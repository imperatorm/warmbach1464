"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type RevealProps = HTMLMotionProps<"div"> & {
  /** Seconds of delay — use for staggering siblings. */
  delay?: number;
  /** Initial downward offset in px. */
  y?: number;
};

/**
 * Scroll-into-view reveal: rises + fades once when it enters the viewport.
 * Honors prefers-reduced-motion (renders in final state, no motion).
 */
export function Reveal({ children, delay = 0, y = 28, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
