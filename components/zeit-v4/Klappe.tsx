"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

type Props = {
  src: string;
  alt: string;
  /** The cover's label — the year, set large. */
  year: string;
  /** The cover's second line. */
  label: string;
  /** Aspect of the card (width / height). */
  ratio?: number;
  className?: string;
};

/**
 * A flip box: a closed paper card with the year on its cover, which opens
 * like a book as it scrolls into view — the cover swings away on its left
 * edge and the painted figure inside is revealed on cream. The opening is
 * driven by the card's own position in the viewport, so scrolling back
 * closes it again; nothing is one-shot.
 *
 * Reduced motion: shown open.
 */
export function Klappe({ src, alt, year, label, ratio = 4 / 5, className = "" }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "start 38%"] });
  const angleRaw = useTransform(scrollYProgress, [0, 1], [0, -168]);
  const angle = useSpring(angleRaw, { stiffness: 110, damping: 22, mass: 0.7 });
  const inside = useTransform(scrollYProgress, [0.25, 0.7], [0.92, 1]);
  const insideOpacity = useTransform(scrollYProgress, [0.15, 0.55], [0, 1]);
  // The cover's face darkens as it turns away, like paper turning from the light.
  const coverShade = useTransform(angle, [0, -90, -168], [0, 0.18, 0.4]);

  return (
    <div ref={ref} className={`relative ${className}`} style={{ aspectRatio: ratio, perspective: "1600px" }}>
      {/* the inside: cream page with the figure */}
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-[6px] bg-cream shadow-[inset_0_0_0_1px_rgba(29,41,29,0.08)]"
        style={reduce ? undefined : { scale: inside, opacity: insideOpacity }}
      >
        <div className="absolute inset-[9%]">
          <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 28vw, 80vw" className="object-contain" />
        </div>
      </motion.div>

      {/* the cover */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-[6px] bg-kalk shadow-[0_18px_40px_-20px_rgba(29,41,29,0.45)]"
          style={{ rotateY: angle, transformOrigin: "0% 50%", transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
        >
          <div className="flex h-full flex-col justify-between p-5 lg:p-7">
            <span className="text-[0.6rem] uppercase tracking-[0.24em] text-terrakotta">{label}</span>
            <span className="t-hero text-[clamp(2.2rem,5vw,4rem)] leading-none text-night">{year}</span>
          </div>
          <motion.div className="pointer-events-none absolute inset-0 rounded-[6px] bg-night" style={{ opacity: coverShade }} />
        </motion.div>
      )}
    </div>
  );
}
