"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { sectionOrder, warmbachGallery } from "@/lib/gallery";
import { GalleryLightbox, useLightbox } from "./GalleryLightbox";
import { GalleryFallback } from "./GalleryFallback";

/** The slope needs WebGL2; without it the page is the plain set, complete. */
function hasWebGL2() {
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    return false;
  }
}

const labelOf = (i: number) =>
  sectionOrder.find((s) => s.key === warmbachGallery[i].section)?.label ?? "";

/**
 * Scroll owns the journey down the slope; the canvas only reads it. The whole
 * set also exists as real buttons in the DOM beside the canvas — visually
 * hidden but focusable — so the estate is walkable by keyboard and readable by
 * a screen reader whether or not a GPU ever gets involved.
 */
export function HangSlope() {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState<boolean | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const progress = useRef(0);
  const railRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{ setProgress: (p: number) => void; dispose: () => void } | null>(null);

  const { open, close } = useLightbox(warmbachGallery, setIndex);

  useEffect(() => {
    setReady(hasWebGL2());
  }, []);

  /**
   * The slope is built only once the page knows it can run it, and torn down
   * completely on the way out — the GPU context does not outlive the route.
   */
  useEffect(() => {
    if (!ready || reduce || !canvasRef.current) return;
    let handle: { setProgress: (p: number) => void; dispose: () => void } | null = null;
    let cancelled = false;
    import("./HangScene").then(({ createHangScene }) => {
      if (cancelled || !canvasRef.current) return;
      handle = createHangScene(canvasRef.current, {
        onActive: setActive,
        onSelect: (i) => open(i, null),
      });
      sceneRef.current = handle;
    });
    return () => {
      cancelled = true;
      handle?.dispose();
      sceneRef.current = null;
    };
  }, [ready, reduce, open]);

  /** Scroll position through the rail, 0 → 1. */
  useEffect(() => {
    if (!ready || reduce) return;
    const read = () => {
      const el = railRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const travel = height - window.innerHeight;
      progress.current = travel <= 0 ? 0 : Math.min(1, Math.max(0, -top / travel));
      sceneRef.current?.setProgress(progress.current);
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [ready, reduce]);

  /** Put a given frame under the camera. */
  const travelTo = useCallback((i: number) => {
    const el = railRef.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    const p = i / Math.max(1, warmbachGallery.length - 1);
    window.scrollTo({ top: el.offsetTop + travel * p, behavior: "smooth" });
  }, []);

  const openIndex = useCallback(
    (i: number) => open(i, null),
    [open],
  );

  if (reduce || ready === false) return <GalleryFallback />;

  return (
    <>
      {/* The rail's height is the length of the journey: one viewport of
          scroll per photograph, so no frame flies past unread. */}
      <div ref={railRef} className="relative" style={{ height: `${warmbachGallery.length * 62}svh` }}>
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-night">
          <canvas ref={canvasRef} className="block h-full w-full" />

          <div className="pointer-events-none absolute left-0 top-0 max-w-[22rem] px-6 pt-24 lg:px-10 lg:pt-28">
            <h1 className="t-hero text-[clamp(1.6rem,2.6vw,2.4rem)] text-cream">
              Der Warmbachhof
            </h1>
            <p className="mt-2 text-[0.58rem] uppercase tracking-[0.24em] text-cream/45">
              Der Osthang, abwärts
            </p>
          </div>

          {/* What you are looking at, named only while you are looking at it. */}
          <p
            aria-live="polite"
            className={`pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 text-[0.6rem] uppercase tracking-[0.28em] text-cream/70 transition-opacity duration-500 ${
              active === null ? "opacity-0" : "opacity-100"
            }`}
          >
            {active === null ? "" : labelOf(active)}
          </p>

          <p className="pointer-events-none absolute bottom-10 right-6 text-[0.55rem] uppercase tracking-[0.28em] text-cream/35 lg:right-10">
            Scrollen, um den Hang hinabzugehen
          </p>
        </div>
      </div>

      {/* The set as real controls. Off-screen until focused, then it brings
          itself and the camera to the frame it names. */}
      <nav aria-label="Alle Aufnahmen" className="sr-only focus-within:not-sr-only">
        <ul>
          {warmbachGallery.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                onFocus={() => {
                  setActive(i);
                  travelTo(i);
                }}
                onBlur={() => setActive(null)}
                onClick={() => openIndex(i)}
                className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-cream px-5 py-3 text-xs uppercase tracking-[0.18em] text-night"
              >
                {labelOf(i)} — Aufnahme {i + 1} von {warmbachGallery.length} öffnen
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <GalleryLightbox
        images={warmbachGallery}
        index={index}
        onClose={close}
        onPage={(d) =>
          setIndex((i) => (i === null ? i : (i + d + warmbachGallery.length) % warmbachGallery.length))
        }
      />
    </>
  );
}
