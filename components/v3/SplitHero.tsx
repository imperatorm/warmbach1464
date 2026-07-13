"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { MaskReveal } from "./MaskReveal";

/**
 * Editorial split hero (PROmeat grammar): the alpine film fills the left half
 * with a small tracked kicker and the wordmark set large over it; the right
 * half is a quiet cream editorial panel — label, serif statement in caps, an
 * italic serif accent line, a framed specimen photograph and the estate claim.
 */
export function SplitHero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="grid min-h-[100svh] grid-cols-1 pt-[3.9rem] lg:grid-cols-2">
      {/* Left — the alpine film with the wordmark over it */}
      <div className="relative flex min-h-[62svh] items-center justify-center overflow-hidden bg-night lg:min-h-full">
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
        <div className="absolute inset-0 bg-night/35" />

        <div className="relative z-10 flex flex-col items-center gap-10 px-6 py-20 text-center text-cream">
          <motion.p
            {...rise(0.15)}
            className="max-w-xs text-[0.62rem] font-semibold uppercase leading-[2] tracking-[0.3em] text-cream/85"
          >
            Sechsundzwanzig Generationen ·<br />
            eine Quelle · ein Osthang
          </motion.p>

          <h1 className="overflow-hidden font-body text-[clamp(3rem,7vw,6.2rem)] font-semibold uppercase leading-none tracking-[0.02em]">
            <motion.span
              className="flex items-center gap-4 pb-[0.08em]"
              initial={reduce ? { opacity: 0 } : { y: "112%" }}
              animate={reduce ? { opacity: 1 } : { y: "0%" }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              1464&thinsp;by&thinsp;W
              <Link
                href="/zeit"
                data-cursor
                aria-label="Die Säulen entdecken"
                className="inline-flex h-[0.62em] w-[0.62em] shrink-0 items-center justify-center rounded-full border border-cream/70 text-[0.28em] transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-night"
              >
                <span aria-hidden>&rarr;</span>
              </Link>
            </motion.span>
          </h1>
        </div>
      </div>

      {/* Right — cream editorial panel */}
      <div className="flex flex-col justify-center gap-12 bg-cream px-6 py-16 text-night lg:px-14 lg:py-24">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="text-[0.66rem] font-semibold uppercase leading-[1.9] tracking-[0.24em] text-copper">
                Osthang · 760 m ü. A.
                <br />
                Kitzbühel · Tirol
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-9 max-w-[13em] font-display text-[clamp(1.5rem,2.4vw,2.15rem)] uppercase leading-[1.22] tracking-[0.01em]">
                Wir haben nichts erfunden. Wir haben es nur wiedergefunden.
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 font-display text-[clamp(1.5rem,2.2vw,2rem)] italic lowercase tracking-[-0.01em] text-copper/85">
                mit Zeit
              </p>
            </Reveal>
          </div>

          <MaskReveal className="lg:col-span-5 lg:col-start-8">
            <figure className="border border-night/15 bg-cream p-2">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/gallery/warmbach/img_0030.jpg"
                  alt="Der Osthang mit dem Hof über Kitzbühel"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 22vw, 80vw"
                  priority
                />
              </div>
            </figure>
          </MaskReveal>
        </div>

        <Reveal delay={0.1}>
          <div className="flex flex-wrap items-end justify-between gap-6 border-t border-night/10 pt-8">
            <p className="max-w-md text-sm leading-relaxed text-night/70">
              Edelbrand-Destillerie am Osthang über Kitzbühel. Erstmals 1464 im Salbuch verzeichnet —
              from our Soil to your Soul.
            </p>
            <Link
              href="/galerie"
              data-cursor
              className="link-underline text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-night hover:text-copper"
            >
              Der Hof
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
