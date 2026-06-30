"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useAgeConfirmed } from "@/lib/useAgeConfirmed";

const HeroBottleScene = dynamic(
  () => import("@/components/three/HeroBottleScene"),
  { ssr: false },
);

/**
 * Cinematic alternative hero (/experience): the family's alpine film as a full-bleed,
 * darkened background, with the onyx bottle composited over it and "1464" set large.
 * The 3D scene is deferred (age gate + idle) exactly like the main hero.
 */
export function ExperienceHero() {
  const reduce = useReducedMotion();
  const confirmed = useAgeConfirmed();
  const [heroVisible, setHeroVisible] = useState(true);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setHeroVisible(window.scrollY < window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!confirmed || reduce) return;
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void) => number;
    };
    const schedule =
      w.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    schedule(() => setMount(true));
  }, [confirmed, reduce]);

  return (
    <section className="relative h-screen overflow-hidden bg-night">
      {/* Alpine film */}
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

      {/* Cinematic darkening — keeps the dark bottle legible over the landscape */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night/55 via-night/35 to-night" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_24%,_rgba(27,38,31,0.8)_94%)]" />

      {/* Onyx bottle floating in the alpine night; hover to spin */}
      {mount && (
        <div
          data-cursor
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <HeroBottleScene active={heroVisible} onReady={() => setReady(true)} />
        </div>
      )}

      {/* 1464 — large */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[11%] z-10 flex flex-col items-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-7xl leading-[0.85] tracking-[-0.01em] text-cream md:text-[10rem] [font-variation-settings:'opsz'_144]"
        >
          1464
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 text-xs uppercase tracking-[0.32em] text-cream/70 md:text-sm"
        >
          From our soil to your soul
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 1.9 }}
        className="pointer-events-none absolute inset-x-0 bottom-7 z-10 text-center"
      >
        <p className="signage text-stone">Scroll</p>
      </motion.div>
    </section>
  );
}
