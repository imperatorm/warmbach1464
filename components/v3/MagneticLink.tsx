"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * A link that leans a few pixels toward the cursor, springing back on leave
 * (lifted from v2 ThresholdCTA so v3 CTAs can share it).
 */
export function MagneticLink({
  href,
  children,
  className,
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 200, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - (rect.left + rect.width / 2)) * 0.18);
    my.set((e.clientY - (rect.top + rect.height / 2)) * 0.28);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.span style={{ x, y }} className="inline-block">
      <Link ref={ref} href={href} data-cursor aria-label={ariaLabel} onMouseMove={onMove} onMouseLeave={onLeave} className={className}>
        {children}
      </Link>
    </motion.span>
  );
}
