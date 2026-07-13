"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Monogram } from "@/components/ui/Monogram";

/**
 * Home hero — the cinematic alpine film with the centred 1464byW// wordmark.
 * The onyx bottle has been retired (the Warmbach bottle now lives in the
 * v3 Flaschenkammer); the hero leads with the wordmark + "distilled in Kitzbühel".
 */
export function HeroSection() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6, delay } }
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.1, delay, ease: "easeOut" as const },
        };

  return (
    <section className="relative h-screen overflow-hidden bg-night">
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

      {/* Darkening — keeps the centred wordmark legible over the dusk film */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night/70 via-night/45 to-night" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(29,41,29,0.85)_94%)]" />

      {/* Centred brand wordmark — 1464 by W// · distilled in Kitzbühel */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <motion.h1
          {...rise(0.05)}
          style={{ fontSize: "clamp(5.5rem, 17vw, 15rem)", fontWeight: 500 }}
          className="display leading-none text-cream [text-shadow:0_2px_50px_rgba(0,0,0,0.55)]"
        >
          1464
        </motion.h1>
        <motion.div {...rise(0.22)} className="mt-5 flex items-center gap-3 sm:mt-7">
          <span className="text-sm uppercase tracking-[0.4em] text-gold sm:text-base [margin-inline-end:-0.4em]">by</span>
          <Monogram className="h-9 w-auto sm:h-11" />
        </motion.div>
        <motion.p {...rise(0.36)} className="mt-6 text-[0.6rem] uppercase tracking-[0.42em] text-cream/55 sm:text-[0.7rem]">
          distilled in Kitzbühel
        </motion.p>
      </div>

      {/* Quiet scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 1.4 }}
        className="pointer-events-none absolute inset-x-0 bottom-7 z-10 text-center"
      >
        <p className="t-label text-stone">Scroll</p>
      </motion.div>
    </section>
  );
}
