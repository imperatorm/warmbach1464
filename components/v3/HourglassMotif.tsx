"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { HourglassGlyph } from "./HourglassGlyph";

/**
 * The Sanduhr statement (Watchibia's "time around a statement", reinterpreted
 * for a distillery): a large hourglass watermark behind a centred statement,
 * two small framed specimens above and below. The sand runs with the scroll —
 * the upper bulb empties into the lower as the section passes the viewport.
 * Reduced motion renders the emblematic half-run glass. No clock faces.
 */
export function HourglassMotif({
  kicker,
  lines,
  body,
  topImage,
  bottomImage,
}: {
  kicker: string;
  lines: string[];
  body?: string;
  topImage: { src: string; alt: string };
  bottomImage: { src: string; alt: string };
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 15%"] });
  const [sand, setSand] = useState(0.5);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    // Quantise to keep re-renders cheap.
    const q = Math.round(v * 40) / 40;
    if (q !== sand) setSand(q);
  });

  return (
    <section ref={ref} className="relative overflow-hidden bg-cream px-6 py-24 text-night lg:px-10 lg:py-36">
      {/* The Sanduhr — watermark behind everything, sand scrubbed by scroll */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <HourglassGlyph className="h-[86%] text-night/[0.08]" sand={reduce ? 0.5 : sand} strokeWidth={0.9} />
      </div>

      <div className="relative mx-auto flex max-w-[1400px] flex-col items-center gap-14 text-center lg:gap-20">
        {/* Upper specimen — sits in the top bulb's field */}
        <Reveal className="lg:-translate-x-[26%]">
          <figure className="w-40 border border-night/15 bg-cream p-2 shadow-[0_16px_50px_rgba(29,41,29,0.15)] sm:w-48">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src={topImage.src} alt={topImage.alt} fill className="object-cover" sizes="192px" />
            </div>
          </figure>
        </Reveal>

        {/* Statement at the neck */}
        <div className="max-w-2xl">
          <Reveal>
            <p className="mb-6 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-copper">{kicker}</p>
          </Reveal>
          <h2 className="font-body text-[clamp(1.5rem,2.9vw,2.3rem)] font-semibold leading-[1.3] text-night">
            {lines.map((l, i) => (
              <Reveal key={l} delay={0.08 + i * 0.08}>
                <span className="block">{l}</span>
              </Reveal>
            ))}
          </h2>
          {body && (
            <Reveal delay={0.3}>
              <p className="mt-5 font-display text-lg italic text-night/60">{body}</p>
            </Reveal>
          )}
        </div>

        {/* Lower specimen — the sand's destination */}
        <Reveal className="lg:translate-x-[26%]">
          <figure className="w-40 border border-night/15 bg-cream p-2 shadow-[0_16px_50px_rgba(29,41,29,0.15)] sm:w-48">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src={bottomImage.src} alt={bottomImage.alt} fill className="object-cover" sizes="192px" />
            </div>
          </figure>
        </Reveal>
      </div>

      {/* Quiet sand meter — the section's folio line */}
      <div className="relative mx-auto mt-16 flex max-w-[1400px] items-center justify-center gap-4">
        <motion.div className="h-px w-24 bg-night/20" />
        <p className="text-[0.6rem] uppercase tracking-[0.28em] text-night/45">Die Zeit läuft für uns</p>
        <motion.div className="h-px w-24 bg-night/20" />
      </div>
    </section>
  );
}
