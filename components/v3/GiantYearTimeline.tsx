"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { HourglassGlyph } from "./HourglassGlyph";
import { heritageChronicle } from "@/lib/content";

export type TimelineEntry = { year: string; text: string };

/**
 * Mirage's dark journey band: huge year numerals staggered left/right with
 * small captions, on the merlot ground. The line-art drawing between entries
 * is the Sanduhr — its sand runs as the reader scrolls the 562 years — and a
 * circular vignette photo breaks the rhythm once, like the reference.
 */
export function GiantYearTimeline({
  kicker = "Unsere Reise",
  entries = heritageChronicle,
  vignette,
}: {
  kicker?: string;
  entries?: TimelineEntry[];
  vignette?: { src: string; alt: string };
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 30%"] });
  const [sand, setSand] = useState(0.5);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    const q = Math.round(v * 30) / 30;
    if (q !== sand) setSand(q);
  });

  const mid = Math.floor(entries.length / 2);

  return (
    <section ref={ref} className="relative overflow-hidden bg-merlot px-6 py-24 text-cream lg:px-10 lg:py-36">
      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-gold">{kicker}</p>
        </Reveal>

        {/* The Sanduhr runs alongside the years */}
        <div aria-hidden className="pointer-events-none absolute right-[6%] top-[16%] hidden lg:block">
          <HourglassGlyph className="h-72 text-cream/[0.14]" sand={reduce ? 0.5 : sand} strokeWidth={1} />
        </div>

        <div className="mt-14 flex flex-col gap-20 lg:gap-28">
          {entries.map((e, i) => {
            const right = i % 2 === 1;
            return (
              <div key={`${e.year}-${i}`} className="relative">
                {/* Circular vignette photo once, mid-band (Mirage's round image) */}
                {vignette && i === mid && (
                  <Reveal className="pointer-events-none absolute -top-10 left-1/2 hidden w-56 -translate-x-1/2 lg:block">
                    <div className="relative aspect-square overflow-hidden rounded-full opacity-70">
                      <Image src={vignette.src} alt={vignette.alt} fill className="object-cover" sizes="224px" />
                      <div className="absolute inset-0 bg-merlot/35" />
                    </div>
                  </Reveal>
                )}

                <Reveal className={right ? "lg:ml-auto lg:w-[52%] lg:text-right" : "lg:w-[52%]"}>
                  <p className="whitespace-nowrap font-body text-[clamp(3.2rem,10vw,8.2rem)] font-bold leading-none tracking-[-0.01em] text-cream">
                    {e.year}
                  </p>
                  <span aria-hidden className={`mt-3 block h-px w-40 bg-gold/50 ${right ? "lg:ml-auto" : ""}`} />
                  <p className={`mt-4 max-w-sm text-sm leading-relaxed text-cream/65 ${right ? "lg:ml-auto" : ""}`}>{e.text}</p>
                </Reveal>
              </div>
            );
          })}
        </div>

        {/* Foot rule — the running sand made literal */}
        <div className="relative mt-24 h-px w-full bg-cream/15">
          <motion.span
            aria-hidden
            style={{ width: `${(reduce ? 0.5 : sand) * 100}%` }}
            className="absolute inset-y-0 left-0 bg-gold/70"
          />
        </div>
        <p className="mt-3 text-[0.6rem] uppercase tracking-[0.28em] text-cream/45">
          1464 — heute · urkundlich verbürgt
        </p>
      </div>
    </section>
  );
}
