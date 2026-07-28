"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  beginProgrammaticScroll,
  currentScroll,
  endProgrammaticScroll,
  maxScroll,
  scrollToImmediate,
} from "@/lib/smoothScroll";

/** Seconds for a full 0 → 100% traverse at 1×. 2× halves it. */
const TOUR_SECONDS = 20;

/** Progress above which Restart becomes available. */
const RESTART_THRESHOLD = 0.02;

type Phase = "idle" | "running" | "paused" | "done";

/**
 * Auto Tour — drives the page through the film hands-free.
 *
 * Runs a linear tween over normalised document progress (so the duration is
 * the same whatever the page height) and writes each frame straight into the
 * shared Lenis instance. Any real user input — wheel, touch, pointer drag,
 * or a scrolling key — hands control back immediately.
 *
 * Per-frame values are written to refs and a CSS custom property; React only
 * re-renders when the phase or speed actually changes.
 */
export function AutoTour() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [speed, setSpeed] = useState<1 | 2>(1);
  const [canRestart, setCanRestart] = useState(false);

  const rafRef = useRef(0);
  const drivingRef = useRef(false); // true only while the tween writes scroll
  const phaseRef = useRef<Phase>("idle");
  const speedRef = useRef<1 | 2>(1);
  const pctRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  phaseRef.current = phase;
  speedRef.current = speed;

  const paint = useCallback((p: number) => {
    const pct = Math.round(p * 100);
    if (pctRef.current) pctRef.current.textContent = `${pct}%`;
    if (barRef.current) barRef.current.style.setProperty("--tour-progress", `${pct}%`);
  }, []);

  const stopTween = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    if (drivingRef.current) {
      drivingRef.current = false;
      endProgrammaticScroll(); // hand the scroll back to Lenis
    }
  }, []);

  const run = useCallback(() => {
    stopTween();
    const max = maxScroll();
    if (max <= 0) return;

    const from = currentScroll() / max;
    if (from >= 0.999) {
      setPhase("done");
      return;
    }

    // Normalised: the remaining fraction takes the matching slice of the run.
    const durationMs = ((TOUR_SECONDS * (1 - from)) / speedRef.current) * 1000;
    const start = performance.now();
    setPhase("running");
    drivingRef.current = true;
    beginProgrammaticScroll();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const p = from + (1 - from) * t; // linear
      scrollToImmediate(p * maxScroll());
      paint(p);
      if (p > RESTART_THRESHOLD) setCanRestart(true);

      if (t >= 1) {
        drivingRef.current = false;
        endProgrammaticScroll();
        rafRef.current = 0;
        setPhase("done");
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [paint, stopTween]);

  const pause = useCallback(() => {
    if (phaseRef.current !== "running") return;
    stopTween();
    setPhase("paused");
  }, [stopTween]);

  const restart = useCallback(() => {
    stopTween();
    scrollToImmediate(0);
    paint(0);
    setCanRestart(false);
    setPhase("idle");
  }, [paint, stopTween]);

  /* ── User input reclaims control ──────────────────────────────────────── */
  useEffect(() => {
    const SCROLL_KEYS = new Set([
      "PageUp", "PageDown", "Home", "End", " ", "Spacebar",
      "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
    ]);

    const onWheel = () => pause();
    const onTouch = () => pause();
    const onPointerDown = (e: PointerEvent) => {
      // Dragging outside the control counts as taking over; clicking the
      // control itself must not immediately pause it.
      if ((e.target as HTMLElement | null)?.closest("[data-auto-tour]")) return;
      pause();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Stop where we are — never yank the reader's position.
        stopTween();
        setPhase(currentScroll() / Math.max(1, maxScroll()) >= 0.999 ? "done" : "paused");
        return;
      }
      if (SCROLL_KEYS.has(e.key)) pause();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [pause, stopTween]);

  /* ── Keep the readout live while the reader scrolls by hand ───────────── */
  useEffect(() => {
    const onScroll = () => {
      if (drivingRef.current) return;
      const max = maxScroll();
      const p = max > 0 ? currentScroll() / max : 0;
      paint(p);
      if (p > RESTART_THRESHOLD) setCanRestart(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [paint]);

  /* ── Kill every tween on unmount / route change ───────────────────────── */
  useEffect(() => stopTween, [stopTween]);

  const label =
    phase === "running" ? "Pause" : phase === "paused" ? "Fortsetzen" : phase === "done" ? "Erneut" : "Tour starten";

  const onPrimary = () => {
    if (phase === "running") return pause();
    if (phase === "done") return restart();
    run();
  };

  return (
    <div
      data-auto-tour
      className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 sm:bottom-7"
    >
      <div
        ref={barRef}
        className="flex items-center gap-1 rounded-full border border-cream/15 bg-night/80 p-1 backdrop-blur-md [--tour-progress:0%]"
      >
        <button
          type="button"
          onClick={onPrimary}
          className="relative overflow-hidden rounded-full px-5 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-cream transition-colors duration-300 hover:bg-cream/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          {/* Progress fill, driven by the CSS custom property */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 bg-gold/25"
            style={{ width: "var(--tour-progress)" }}
          />
          <span className="relative">{label}</span>
        </button>

        <span
          ref={pctRef}
          className="min-w-[3.2rem] text-center font-body text-[0.65rem] tabular-nums text-cream/70"
        >
          0%
        </span>

        {canRestart && phase !== "idle" && (
          <button
            type="button"
            onClick={restart}
            className="rounded-full px-3.5 py-2.5 text-[0.6rem] uppercase tracking-[0.16em] text-cream/70 transition-colors duration-300 hover:bg-cream/10 hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Neu
          </button>
        )}

        <button
          type="button"
          onClick={() => setSpeed((s) => (s === 1 ? 2 : 1))}
          aria-label={`Tempo ${speed === 1 ? "einfach" : "doppelt"} — umschalten`}
          className="rounded-full px-3.5 py-2.5 text-[0.6rem] uppercase tracking-[0.16em] text-cream/70 transition-colors duration-300 hover:bg-cream/10 hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          {speed}×
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        Tour {phase === "running" ? "läuft" : phase === "paused" ? "pausiert" : phase === "done" ? "beendet" : "bereit"}
      </p>
    </div>
  );
}
