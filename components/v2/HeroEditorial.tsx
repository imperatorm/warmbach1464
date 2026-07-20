"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Monogram } from "@/components/ui/Monogram";

const meta = [
  { k: "Lage", v: "47°27′ N · 12°23′ O" },
  { k: "Höhe", v: "760 m ü. A. · Osthang" },
  { k: "Beleg", v: "Salbuch · Anno 1464" },
];

/**
 * v2 hero — the alpine film reframed as an editorial title sheet:
 * the centred wordmark stays, framed by a data strip (coordinates,
 * elevation, deed) along the bottom hairline, like a printed folio.
 * The centre block parallax-fades as the sheet is scrolled away.
 */
export function HeroEditorial() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const rise = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6, delay } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.1, delay, ease: "easeOut" as const },
        };

  return (
    <section ref={ref} className="relative h-[100svh] overflow-hidden bg-night">
      {/* Cinematic alpine film — the LCP poster paints instantly (~26KB jpg) */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="/video/alpine-poster.jpg"
        aria-hidden="true"
      >
        <source src="/video/alpine.mp4" type="video/mp4" />
      </video>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night/70 via-night/40 to-night/90" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(29,41,29,0.85)_96%)]" />

      {/* Centred wordmark — parallax-fades against the scrolling sheet */}
      <motion.div
        style={reduce ? undefined : { y, opacity }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
      >
        <motion.p {...rise(0)} className="mb-5 text-[0.6rem] uppercase tracking-[0.42em] text-gold sm:text-[0.68rem]">
          Warmbachhof · Kitzbühel
        </motion.p>
        <motion.div {...rise(0.24)} className="mt-5 flex items-center gap-3 sm:mt-7">
          <span className="text-sm uppercase tracking-[0.4em] text-gold sm:text-base [margin-inline-end:-0.4em]">by</span>
          <Monogram className="h-9 w-auto sm:h-11" />
        </motion.div>
        <motion.p {...rise(0.38)} className="mt-6 font-display text-base italic text-cream/70 sm:text-lg">
          From our Soil to your Soul.
        </motion.p>
      </motion.div>

      {/* Full-width title — bottom positioned */}
      <motion.div
        style={reduce ? undefined : { opacity }}
        className="absolute bottom-24 left-0 right-0 z-10 overflow-hidden"
      >
        <motion.div {...rise(0.08)} className="w-full">
          <svg
            viewBox="0 0 1000 280"
            className="block w-full h-auto text-cream [filter:drop-shadow(0_2px_50px_rgba(0,0,0,0.55))]"
            role="img"
            aria-label="1464"
          >
            <text
              x="0"
              y="230"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              fontFamily="var(--font-display)"
              fontWeight="400"
              fontSize="260"
              fill="currentColor"
            >
              1464
            </text>
          </svg>
        </motion.div>
      </motion.div>

      {/* Editorial data strip — the folio line of the title sheet */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.1 }}
        className="absolute inset-x-0 bottom-0 z-10"
      >
        <div className="mx-6 border-t border-cream/15 lg:mx-10">
          <div className="grid grid-cols-2 gap-y-3 py-5 sm:grid-cols-4">
            {meta.map((m) => (
              <div key={m.k} className="flex flex-col gap-1">
                <span className="text-[0.55rem] uppercase tracking-[0.28em] text-cream/40">{m.k}</span>
                <span className="text-[0.7rem] uppercase tracking-[0.18em] text-cream/80">{m.v}</span>
              </div>
            ))}
            <div className="flex flex-col gap-1 sm:items-end sm:text-right">
              <span className="text-[0.55rem] uppercase tracking-[0.28em] text-cream/40">Blatt</span>
              <span className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                Scroll
                <motion.span
                  aria-hidden
                  animate={reduce ? undefined : { y: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  ↓
                </motion.span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
