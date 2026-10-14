"use client";

import Image from "next/image";
import { motion, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";

export type Window = [number, number];

type Props = {
  src: string;
  alt: string;
  /** Scroll progress of the stage, 0–1. */
  progress: MotionValue<number>;
  /** Progress window over which the figure stands up. */
  rise: Window;
  /** Progress window over which it lies back down; omit to leave it standing. */
  fall?: Window;
  /** Position and width on the plate, in percent of the plate box. `top` is the figure's base line. */
  left: number;
  top: number;
  width: number;
  /** The figure's own aspect ratio (width / height), so the box has a height before the image loads. */
  ratio: number;
  priority?: boolean;
  /** Under reduced motion the stage is static; this says whether the figure is in the final picture. */
  final?: boolean;
};

/**
 * One painted figure of the pop-up book: it lies flat on the meadow (edge-on,
 * invisible), stands up as the reader scrolls into its window, and lies back
 * down when its time is over. The hinge is the figure's base line, so a house
 * rises from the ground it stands on and a row of saplings from the earth
 * they are planted in. Rotation runs through a spring so a fast scroll never
 * snaps a figure upright.
 *
 * Reduced motion: no hinge — the figure is simply present or absent, and the
 * stage shows the final picture.
 */
export function PopUp({ src, alt, progress, rise, fall, left, top, width, ratio, priority, final }: Props) {
  const reduce = useReducedMotion();
  const [r0, r1] = rise;
  const [f0, f1] = fall ?? [2, 3]; // never reached
  const angleRaw = useTransform(progress, [r0, r1, f0, f1], [92, 0, 0, 92]);
  const angle = useSpring(angleRaw, { stiffness: 120, damping: 24, mass: 0.6 });
  const opacity = useTransform(progress, [r0, r0 + (r1 - r0) * 0.35, f0 + (f1 - f0) * 0.5, f1], [0, 1, 1, 0]);
  // The ground shadow flattens as the figure lies down.
  const shadow = useTransform(angle, [0, 92], [0.35, 0]);

  if (reduce) {
    if (!final) return null;
    return (
      <div className="absolute" style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, transform: "translateY(-100%)" }}>
        <div className="relative" style={{ aspectRatio: ratio }}>
          <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 30vw, 60vw" className="object-contain object-bottom" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute"
      style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, transform: "translateY(-100%)", perspective: "1400px" }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-[8%] bottom-[-2%] h-[6%] rounded-[50%] bg-night blur-md"
        style={{ opacity: shadow }}
      />
      <motion.div
        className="relative"
        style={{ aspectRatio: ratio, rotateX: angle, opacity, transformOrigin: "50% 100%", transformStyle: "preserve-3d" }}
      >
        <Image src={src} alt={alt} fill priority={priority} sizes="(min-width: 1024px) 30vw, 60vw" className="object-contain object-bottom" />
      </motion.div>
    </div>
  );
}
