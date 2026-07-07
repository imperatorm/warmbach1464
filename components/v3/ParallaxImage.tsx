"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Image that drifts gently against the scroll inside its crop (lifted from the
 * v2 EditorialSpread so the v3 sections can share it). `speed` scales the drift.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  sizes,
  speed = 1,
  quality,
  priority,
}: {
  src: string;
  alt: string;
  className: string;
  sizes: string;
  speed?: number;
  quality?: number;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-7 * speed}%`, `${7 * speed}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={reduce ? undefined : { y }} className="absolute inset-x-0 -inset-y-[9%]">
        <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} quality={quality} priority={priority} />
      </motion.div>
    </div>
  );
}
