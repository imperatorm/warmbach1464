"use client";

import { useRef, useState } from "react";
import { useReducedMotion, useScroll, useMotionValueEvent } from "framer-motion";
import { HourglassGlyph } from "./HourglassGlyph";

/**
 * Scroll-driven Sanduhr watermark: as the reader arrives at the section, the
 * sand runs from the upper bulb into the lower one — the motif's payoff at the
 * Club threshold. Quantized to 40 steps (same trick as HourglassMotif) so the
 * scroll listener causes cheap, infrequent re-renders.
 *
 * Position it absolutely inside a `relative` section; it measures itself.
 */
export function ScrollSandGlyph({
  className,
  strokeWidth = 0.8,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [sand, setSand] = useState(0.15);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    const next = Math.round((0.1 + v * 0.85) * 40) / 40;
    setSand((prev) => (prev === next ? prev : next));
  });

  return (
    <div ref={ref} className={`aspect-[100/160] ${className ?? ""}`} aria-hidden="true">
      <HourglassGlyph
        className="h-full w-full"
        sand={reduce ? 0.5 : sand}
        strokeWidth={strokeWidth}
      />
    </div>
  );
}
