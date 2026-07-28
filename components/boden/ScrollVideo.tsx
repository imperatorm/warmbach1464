"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ── Tuning constants ──────────────────────────────────────────────────────
 * Documented rather than sprinkled through the loop, because these are the
 * numbers you actually reach for when the scrub feels wrong.
 */

/** Exponential damping rate, per second. Higher = the film catches the scroll
 *  faster. ~9 keeps the playhead a beat behind the cursor without feeling laggy. */
const DAMPING_LAMBDA = 9;

/** Below this delta (seconds) the playhead is treated as arrived; stops the
 *  loop issuing micro-seeks the decoder would only queue up and drop. */
const SETTLE_EPSILON = 0.004;

/** Minimum delta (seconds) worth asking the decoder to seek for. Anything
 *  smaller is visually indistinguishable and costs a keyframe decode. */
const SEEK_EPSILON = 0.012;

/** Clamp for a single frame's dt (seconds). Guards the damping maths after a
 *  background-tab stall, which would otherwise jump the playhead. */
const MAX_FRAME_DT = 0.1;

/** Desktop pointer parallax, in px at full deflection. Deliberately small —
 *  the film is the subject, the parallax is only depth. */
const PARALLAX_PX = 14;
const PARALLAX_LAMBDA = 6;

type Props = {
  src: string;
  /** 0..1 — where the film should be. Owned by the parent's scroll maths. */
  progressRef: React.MutableRefObject<number>;
  /** Notified once metadata has landed, so the parent can reveal the interface. */
  onReady?: (duration: number) => void;
  className?: string;
  poster?: string;
};

/**
 * Scroll-scrubbed film.
 *
 * The contract: scrolling never seeks. Scroll only moves a target; a single
 * RAF loop eases an internal playhead toward that target with frame-rate
 * independent damping, and issues at most one seek at a time. While the
 * decoder is busy only the newest target is retained — there is no queue to
 * grow, and no stale value that can drag the film backwards.
 *
 * Under prefers-reduced-motion the film is not scrubbed at all: a single
 * representative frame is shown and left alone.
 */
export function ScrollVideo({ src, progressRef, onReady, className = "", poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [buffered, setBuffered] = useState(0);

  // Mutable playback state — refs only, so the scrub never re-renders React.
  const durationRef = useRef(0);
  const playheadRef = useRef(0); // eased, what we last asked for
  const seekingRef = useRef(false);
  const pendingRef = useRef<number | null>(null); // newest target while busy
  const parallax = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const reduceRef = useRef(false);

  /* ── Seek pump ─────────────────────────────────────────────────────────
   * One in flight at a time. `pendingRef` holds only the newest request, so
   * a fast flick collapses to a single seek rather than a backlog.
   */
  const requestSeek = useCallback((t: number) => {
    const v = videoRef.current;
    if (!v || !durationRef.current) return;
    const clamped = Math.max(0, Math.min(durationRef.current - 0.001, t));

    if (seekingRef.current) {
      pendingRef.current = clamped;
      return;
    }
    if (Math.abs(clamped - v.currentTime) < SEEK_EPSILON) return;

    seekingRef.current = true;
    try {
      v.currentTime = clamped;
    } catch {
      seekingRef.current = false;
    }
  }, []);

  /* ── Metadata, buffering, errors ──────────────────────────────────────── */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onMeta = () => {
      durationRef.current = v.duration || 0;
      setReady(true);
      onReady?.(v.duration || 0);
      // Reduced motion: park on a representative frame and never scrub.
      if (reduceRef.current && v.duration) {
        try {
          v.currentTime = v.duration * 0.45;
        } catch {
          /* decoder not ready — the poster stands in */
        }
      }
    };

    const onSeeked = () => {
      seekingRef.current = false;
      const next = pendingRef.current;
      pendingRef.current = null;
      // Drain exactly one pending target; anything older was overwritten.
      if (next !== null && !reduceRef.current) requestSeek(next);
    };

    const onProgress = () => {
      if (!v.buffered.length || !v.duration) return;
      setBuffered(v.buffered.end(v.buffered.length - 1) / v.duration);
    };

    const onError = () => {
      setFailed(true);
      setReady(true); // stop showing the loader; the fallback takes over
    };

    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("seeked", onSeeked);
    v.addEventListener("progress", onProgress);
    v.addEventListener("error", onError);

    // Metadata can already be present when React re-runs effects (StrictMode)
    // or when the file is warm in cache.
    if (v.readyState >= 1) onMeta();

    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("seeked", onSeeked);
      v.removeEventListener("progress", onProgress);
      v.removeEventListener("error", onError);
      // NB: the `src` is deliberately left in place. Clearing it on cleanup
      // makes StrictMode's double-invoke throw away a loaded decoder and
      // re-download the file.
    };
  }, [onReady, requestSeek]);

  /* ── The single RAF loop: damping + parallax ──────────────────────────── */
  useEffect(() => {
    if (reduceRef.current) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(MAX_FRAME_DT, (now - last) / 1000);
      last = now;

      const dur = durationRef.current;
      if (dur > 0) {
        const target = Math.max(0, Math.min(1, progressRef.current)) * dur;
        const head = playheadRef.current;
        const delta = target - head;

        if (Math.abs(delta) > SETTLE_EPSILON) {
          // Frame-rate independent exponential approach.
          const next = head + delta * (1 - Math.exp(-DAMPING_LAMBDA * dt));
          playheadRef.current = next;
          requestSeek(next);
        }
      }

      // Pointer parallax — eased with the same damping shape.
      const p = parallax.current;
      p.x += (p.tx - p.x) * (1 - Math.exp(-PARALLAX_LAMBDA * dt));
      p.y += (p.ty - p.y) * (1 - Math.exp(-PARALLAX_LAMBDA * dt));
      const w = wrapRef.current;
      if (w) w.style.transform = `translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0) scale(1.045)`;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef, requestSeek]);

  /* ── Pointer parallax input (fine pointers only) ──────────────────────── */
  useEffect(() => {
    if (reduceRef.current) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      parallax.current.tx = -nx * PARALLAX_PX;
      parallax.current.ty = -ny * PARALLAX_PX;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black" aria-hidden="true">
      <div ref={wrapRef} className="h-full w-full will-change-transform">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className={`h-full w-full object-cover ${className}`}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
        />
      </div>

      {/* Vignette — seats the black void of the render into the page */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(0,0,0,0.72)_100%)]" />

      {/* Loading state — a hairline that fills with the buffer, nothing more */}
      <div
        className={`pointer-events-none absolute inset-0 flex items-end justify-center bg-black transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="mb-16 w-48">
          <div className="h-px w-full bg-cream/20">
            <div
              className="h-px bg-gold transition-[width] duration-300"
              style={{ width: `${Math.round(buffered * 100)}%` }}
            />
          </div>
          <p className="mt-3 text-center text-[0.55rem] uppercase tracking-[0.3em] text-cream/60">
            Bohrkern wird geladen
          </p>
        </div>
      </div>

      {failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-night">
          <p className="max-w-xs px-6 text-center text-[0.62rem] uppercase leading-relaxed tracking-[0.24em] text-cream/60">
            Der Bohrkern-Film konnte nicht geladen werden. Die Schichten sind unten als
            Text beschrieben.
          </p>
        </div>
      )}
    </div>
  );
}
