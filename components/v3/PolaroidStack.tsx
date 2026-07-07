"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type PolaroidShot = { src: string; alt: string; caption: string };

const TILTS = [-7, 5, -3, 8, -5];

/**
 * Fortress's tilted photo stack: the active print sits square, the rest fan
 * behind at slight tilts; circular ← → buttons page the stack and the caption
 * chip names the frame.
 */
export function PolaroidStack({ shots }: { shots: PolaroidShot[] }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const reduce = useReducedMotion();

  const go = (d: number) => {
    setDir(d);
    setIndex((i) => (i + d + shots.length) % shots.length);
  };

  const behind = [1, 2].map((off) => shots[(index + off) % shots.length]);

  return (
    <div className="relative mx-auto max-w-xl">
      <div className="relative flex items-center justify-center">
        {/* Pager buttons */}
        <button
          type="button"
          data-cursor
          onClick={() => go(-1)}
          aria-label="Vorheriges Foto"
          className="absolute -left-2 z-20 grid h-11 w-11 place-items-center rounded-full border border-night/20 bg-cream text-night transition-colors duration-300 hover:bg-gold sm:-left-8"
        >
          ←
        </button>
        <button
          type="button"
          data-cursor
          onClick={() => go(1)}
          aria-label="Nächstes Foto"
          className="absolute -right-2 z-20 grid h-11 w-11 place-items-center rounded-full border border-night/20 bg-cream text-night transition-colors duration-300 hover:bg-gold sm:-right-8"
        >
          →
        </button>

        {/* The stack */}
        <div className="relative h-[330px] w-[260px] sm:h-[400px] sm:w-[320px]">
          {/* Fanned prints behind */}
          {behind.map((s, i) => (
            <div
              key={`${s.src}-behind-${i}`}
              aria-hidden
              className="absolute inset-0 border border-night/10 bg-cream p-2 shadow-[0_14px_40px_rgba(29,41,29,0.18)]"
              style={{ transform: `rotate(${TILTS[(index + i + 1) % TILTS.length]}deg) scale(0.96)` }}
            >
              <div className="relative h-full w-full overflow-hidden">
                <Image src={s.src} alt="" fill className="object-cover" sizes="320px" />
              </div>
            </div>
          ))}

          {/* Active print */}
          <AnimatePresence initial={false} mode="popLayout">
            <motion.figure
              key={shots[index].src}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 46 * dir, rotate: 5 * dir }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: -46 * dir, rotate: -5 * dir, transition: { duration: 0.3 } }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 border border-night/10 bg-cream p-2 shadow-[0_24px_70px_rgba(29,41,29,0.3)]"
            >
              <div className="relative h-[calc(100%-2.4rem)] w-full overflow-hidden">
                <Image src={shots[index].src} alt={shots[index].alt} fill className="object-cover" sizes="320px" />
              </div>
              <figcaption className="flex h-[2.4rem] items-center justify-center text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-night/70">
                {shots[index].caption}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>

      {/* Counter chip */}
      <p className="mt-6 text-center text-[0.62rem] uppercase tracking-[0.26em] text-night/50">
        {String(index + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")}
      </p>
    </div>
  );
}
