"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { HourglassGlyph } from "./HourglassGlyph";

export type BlueprintAnnotation = {
  text: string;
  /** which side of the frame the callout hangs on */
  side: "left" | "right";
  /** vertical position as a percentage of the frame height */
  top: string;
};

/**
 * Watchibia's crosshair product framing ("Your watch. Our intelligence."):
 * the subject inside corner-tick registration marks on a faint drafting grid,
 * technical annotations hanging off thin leader lines, and a faint Sanduhr
 * line-art beneath — the blueprint of a distillery, not a watchmaker.
 */
export function BlueprintShowcase({
  titleA,
  titleB,
  image,
  annotations = [],
  caption,
  tone = "cream",
  lineArt = true,
}: {
  titleA: string;
  titleB: string;
  image: { src: string; alt: string };
  annotations?: BlueprintAnnotation[];
  caption?: string;
  tone?: "cream" | "kalk";
  lineArt?: boolean;
}) {
  const reduce = useReducedMotion();
  const bg = tone === "cream" ? "bg-cream" : "bg-kalk";

  return (
    <section className={`relative overflow-hidden ${bg} px-6 py-24 text-night lg:px-10 lg:py-32`}>
      {/* Drafting grid — faint dotted paper */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(rgba(29,41,29,0.14) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative mx-auto max-w-[1400px]">
        {/* Two-part serif title, Watchibia's "Your watch. Our intelligence." */}
        <Reveal>
          <h2 className="text-center font-display text-[clamp(2.2rem,5.2vw,4.2rem)] leading-[1.04] text-night">
            <span className="block">{titleA}</span>
            <span className="block">{titleB}</span>
          </h2>
        </Reveal>

        {/* Crosshair frame */}
        <Reveal delay={0.12}>
          <div className="relative mx-auto mt-14 w-full max-w-3xl lg:mt-20">
            {/* Corner registration ticks */}
            {(["-top-3 -left-3 border-t border-l", "-top-3 -right-3 border-t border-r", "-bottom-3 -left-3 border-b border-l", "-bottom-3 -right-3 border-b border-r"] as const).map(
              (pos) => (
                <span key={pos} aria-hidden className={`absolute ${pos} h-7 w-7 border-night/60`} />
              ),
            )}

            <motion.div
              initial={reduce ? undefined : { clipPath: "inset(0 0 100% 0)" }}
              whileInView={{ clipPath: "inset(0 0 0% 0)" }}
              viewport={{ once: true, margin: "0px 0px -18% 0px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[16/9] overflow-hidden"
            >
              <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="(min-width: 1024px) 768px, 92vw" />
            </motion.div>

            {/* Annotations — leader line + small technical note */}
            {annotations.map((a, i) => (
              <Reveal
                key={a.text}
                delay={0.3 + i * 0.1}
                className={`absolute hidden w-44 lg:block ${a.side === "left" ? "right-full mr-6 text-right" : "left-full ml-6 text-left"}`}
                style={{ top: a.top }}
              >
                <span
                  aria-hidden
                  className={`mb-2 block h-px w-10 bg-night/40 ${a.side === "left" ? "ml-auto" : ""}`}
                />
                <p className="text-[0.68rem] leading-relaxed text-night/65">{a.text}</p>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {caption && (
          <Reveal delay={0.25}>
            <p className="mx-auto mt-8 max-w-xs text-center text-[0.72rem] leading-relaxed text-night/60">{caption}</p>
          </Reveal>
        )}

        {/* Faint technical line-art beneath — the Sanduhr, drawn like a draft */}
        {lineArt && (
          <div aria-hidden className="mt-14 flex justify-center">
            <HourglassGlyph className="h-40 text-night/20" showSand={false} strokeWidth={1} />
          </div>
        )}
      </div>
    </section>
  );
}
