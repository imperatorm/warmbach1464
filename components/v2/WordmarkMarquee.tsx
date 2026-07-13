"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

/** One endless row whose drift speed and direction follow scroll velocity. */
function VelocityRow({
  children,
  baseVelocity,
  className,
}: {
  children: React.ReactNode;
  baseVelocity: number;
  className?: string;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const direction = useRef(baseVelocity >= 0 ? 1 : -1);

  useAnimationFrame((_, delta) => {
    let moveBy = direction.current * Math.abs(baseVelocity) * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) direction.current = baseVelocity >= 0 ? -1 : 1;
    else if (vf > 0) direction.current = baseVelocity >= 0 ? 1 : -1;
    moveBy += direction.current * Math.abs(moveBy) * Math.abs(vf);
    baseX.set(baseX.get() + moveBy);
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, -25, v)}%`);

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div style={{ x }} className={`flex w-max ${className ?? ""}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} aria-hidden={i > 0} className="block">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * The giant wordmark interlude — "Warmbach" at poster scale drifting with
 * the reader's scroll, a second counter-running line of provenance beneath.
 * Static (centred, single line) when the reader prefers reduced motion.
 * `tone="night"` renders it on the dark ground (footer closing band).
 */
export function WordmarkMarquee({
  tone = "cream",
  compact = false,
}: {
  tone?: "cream" | "night";
  compact?: boolean;
}) {
  const reduce = useReducedMotion();
  const ground = tone === "cream" ? "bg-cream text-night" : "bg-transparent text-cream";
  const accent = tone === "cream" ? "text-copper" : "text-gold";
  const pad = compact ? "py-12 lg:py-16" : "py-20 lg:py-28";

  return (
    <section aria-label="Warmbach — Anno 1464, Kitzbühel" className={`overflow-hidden ${ground} ${pad}`}>
      {reduce ? (
        <div className="px-6 text-center">
          <p className="font-display text-[clamp(3.5rem,12vw,11rem)] leading-none tracking-[-0.02em]">Warmbach</p>
          <p className={`mt-6 text-[0.7rem] uppercase tracking-[0.3em] ${accent}`}>
            Anno 1464 · Kitzbühel · Vom Boden in die Seele
          </p>
        </div>
      ) : (
        <>
          <VelocityRow baseVelocity={2.2} className="font-display text-[clamp(4.5rem,14vw,13rem)] leading-[0.95] tracking-[-0.02em]">
            <span className="pr-[0.5em]">
              Warmbach <span className={`italic ${accent}`}>Hof</span> — Warmbach{" "}
              <span className={`italic ${accent}`}>1464</span> —
            </span>
          </VelocityRow>
          <VelocityRow
            baseVelocity={-1.4}
            className={`mt-6 text-[0.75rem] uppercase tracking-[0.32em] ${accent} lg:text-[0.85rem]`}
          >
            <span className="pr-[2em]">
              Anno 1464 · Kitzbühel · Tirol · Vom Boden in die Seele · Zweifachbrand auf Kupfer ·
            </span>
          </VelocityRow>
        </>
      )}
    </section>
  );
}
