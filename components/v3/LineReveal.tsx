"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Line-mask text reveal: each line sits in an overflow-hidden wrapper and
 * rises from below its baseline when the block scrolls into view — the
 * editorial "typesetting" entrance for display type. Pass the copy as
 * `lines` so the mask boundaries are deterministic (no runtime line-breaking).
 *
 * Honors prefers-reduced-motion: degrades to a plain opacity fade.
 */
export function LineReveal({
  lines,
  as: Tag = "span",
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 0.09,
}: {
  lines: string[];
  /** Wrapper element for each line — keep inline-safe inside headings. */
  as?: "span" | "div";
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={`block ${lineClassName}`}
            initial={reduce ? { opacity: 0 } : { y: "110%" }}
            whileInView={reduce ? { opacity: 1 } : { y: "0%" }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{
              duration: reduce ? 0.6 : 1.1,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
