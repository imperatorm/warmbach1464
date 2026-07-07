"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HourglassGlyph } from "./HourglassGlyph";
import { MagneticLink } from "./MagneticLink";

/**
 * Fortress-style two-tone hero: the alpine film on the night half, quiet kalk
 * on the other, the wordmark straddling the seam, and a vertical poster card
 * (the bottle) pinned over the divide. A faint Sanduhr sits behind the poster —
 * the motif is established from the first screen.
 */
export function SplitHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const posterY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden">
      {/* Two-tone ground */}
      <div className="absolute inset-0 grid grid-rows-2 lg:grid-cols-2 lg:grid-rows-1">
        <div className="relative overflow-hidden bg-night">
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-80"
            autoPlay
            loop
            muted
            playsInline
            poster="/video/alpine-poster.jpg"
            aria-hidden="true"
          >
            <source src="/video/alpine.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-night/45" />
        </div>
        <div className="relative bg-kalk">
          {/* The Sanduhr, faint on the light half */}
          <HourglassGlyph
            className="absolute right-[8%] top-1/2 h-[62%] -translate-y-1/2 text-night/[0.07]"
            sand={0.5}
            strokeWidth={1}
          />
        </div>
      </div>

      {/* Wordmark straddling the seam */}
      <motion.div style={reduce ? undefined : { opacity: fade }} className="relative z-10 flex min-h-[100svh] flex-col">
        <div className="flex flex-1 items-center">
          <div className="grid w-full grid-cols-1 items-center gap-y-[46svh] lg:grid-cols-2 lg:gap-y-0">
            <motion.h1
              {...rise(0.1)}
              className="px-6 text-center font-body text-[clamp(3.4rem,9vw,8.5rem)] font-semibold uppercase leading-none tracking-[0.02em] text-cream lg:pr-28 lg:text-right"
            >
              1464
            </motion.h1>
            <motion.p
              {...rise(0.2)}
              aria-hidden
              className="px-6 text-center font-body text-[clamp(3.4rem,9vw,8.5rem)] font-semibold uppercase leading-none tracking-[0.02em] text-night lg:pl-28 lg:text-left"
            >
              byW
            </motion.p>
          </div>
        </div>

        {/* Foot row: claim + CTAs on the seam line */}
        <div className="relative z-10 grid grid-cols-1 gap-6 px-6 pb-10 lg:grid-cols-2 lg:px-10">
          <motion.p {...rise(0.45)} className="max-w-xs text-sm leading-relaxed text-cream/85">
            Edelbrand-Destillerie am Osthang über Kitzbühel. Erstmals 1464 im Salbuch verzeichnet —
            from our Soil to your Soul.
          </motion.p>
          <motion.div {...rise(0.55)} className="flex items-center gap-6 lg:justify-end">
            <MagneticLink
              href="/zeit"
              className="inline-flex items-center gap-3 bg-night px-6 py-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-cream transition-colors duration-300 hover:bg-copper"
            >
              Die Säulen entdecken
            </MagneticLink>
            <Link
              href="/galerie"
              data-cursor
              className="link-underline text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-night"
            >
              Der Hof
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Poster card over the seam */}
      <motion.div
        {...rise(0.32)}
        style={reduce ? undefined : { y: posterY }}
        className="absolute left-1/2 top-1/2 z-20 w-[168px] -translate-x-1/2 -translate-y-1/2 sm:w-[200px] lg:w-[228px]"
      >
        <div className="border border-night/15 bg-cream p-2.5 shadow-[0_30px_90px_rgba(29,41,29,0.4)]">
          <p className="py-2 text-center text-[0.55rem] font-semibold uppercase tracking-[0.24em] text-night/70">
            Aus dem Salbuch 1464
          </p>
          <div className="relative aspect-[3/4.4] overflow-hidden">
            <Image src="/flasche/shot-front.jpg" alt="Die Warmbach-Flasche" fill className="object-cover" sizes="228px" priority />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
