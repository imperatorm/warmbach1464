"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { chronicle } from "@/lib/timeline";

const STEP = 128; // px between news-points on the rail

/**
 * Interactive Zeitstrahl: the documented Hofchronik (lib/timeline.ts) as a draggable
 * rail of news-points under a fixed centre playhead, with a crossfading detail panel.
 * Drag the rail, click a point, use the arrows, or the keyboard (←/→). The active
 * point always animates to centre.
 */
export function Timeline() {
  const [active, setActive] = useState(0);
  const x = useMotionValue(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(0);

  useEffect(() => {
    const measure = () => setVw(viewportRef.current?.clientWidth ?? 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const go = useCallback((i: number) => {
    setActive(Math.max(0, Math.min(chronicle.length - 1, i)));
  }, []);

  // Centre the active point under the playhead
  useEffect(() => {
    if (!vw) return;
    const target = vw / 2 - (active * STEP + STEP / 2);
    const controls = animate(x, target, { type: "spring", stiffness: 130, damping: 24 });
    return controls.stop;
  }, [active, vw, x]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(active + 1);
      else if (e.key === "ArrowLeft") go(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, go]);

  const leftBound = vw / 2 - ((chronicle.length - 1) * STEP + STEP / 2);
  const rightBound = vw / 2 - STEP / 2;
  const item = chronicle[active];

  return (
    <div className="select-none">
      {/* Active event */}
      <div className="mb-14 min-h-[12rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-display text-6xl leading-none text-gold md:text-8xl [font-variation-settings:'opsz'_90]">
              {item.year}
            </span>
            <h3 className="t-h3 mt-4 text-cream">{item.title}</h3>
            <p className="t-lead mt-4 max-w-xl">{item.detail}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rail */}
      <div className="relative">
        {/* centre playhead */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-[26px] w-px -translate-x-1/2 bg-gold/70" />
        <div className="absolute inset-x-0 top-[12px] h-px bg-hairline/15" />
        <div ref={viewportRef} className="relative overflow-hidden py-1" data-lenis-prevent>
          <motion.div
            className="flex cursor-grab active:cursor-grabbing"
            style={{ x }}
            drag="x"
            dragConstraints={{ left: leftBound, right: rightBound }}
            dragElastic={0.06}
            onDragEnd={() => {
              const centre = vw / 2 - x.get();
              go(Math.round((centre - STEP / 2) / STEP));
            }}
          >
            {chronicle.map((c, i) => (
              <button
                key={`${c.year}-${i}`}
                onClick={() => go(i)}
                data-cursor
                aria-label={`${c.year} — ${c.title}`}
                aria-current={i === active}
                className="group flex shrink-0 flex-col items-center pt-1"
                style={{ width: STEP }}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    i === active
                      ? "h-[14px] w-[14px] bg-gold ring-2 ring-gold/30 ring-offset-2 ring-offset-night"
                      : "h-[10px] w-[10px] border border-hairline/40 bg-night group-hover:border-gold"
                  }`}
                />
                <span
                  className={`mt-5 text-xs tabular-nums transition-colors duration-300 ${
                    i === active ? "text-gold" : "text-stone group-hover:text-cream"
                  }`}
                >
                  {c.year}
                </span>
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-10 flex items-center gap-8">
        <button onClick={() => go(active - 1)} disabled={active === 0} data-cursor className="t-label transition-opacity disabled:opacity-25">
          &larr; Früher
        </button>
        <span className="text-xs tabular-nums text-stone">
          {String(active + 1).padStart(2, "0")} / {chronicle.length}
        </span>
        <button onClick={() => go(active + 1)} disabled={active === chronicle.length - 1} data-cursor className="t-label transition-opacity disabled:opacity-25">
          Später &rarr;
        </button>
      </div>
    </div>
  );
}
