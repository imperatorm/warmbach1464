"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Cinematic page transitions between routes (briefing §4.7): a night curtain
 * wipes up over the leaving page, the new page mounts beneath it, and the
 * curtain continues off the top — one continuous upward motion instead of the
 * old plain cross-fade. `initial={false}` keeps the very first paint free of
 * animation (LCP intact); bypassed entirely under prefers-reduced-motion.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <motion.div key={pathname}>
        {/* Enter veil: covers the fresh page, lifts off the top */}
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[95] bg-night"
          initial={{ y: "0%" }}
          animate={{ y: "-101%" }}
          transition={{ duration: 0.6, ease: EASE }}
        />
        {/* Exit veil: rises from the bottom to cover the leaving page */}
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[95] bg-night"
          initial={{ y: "101%" }}
          animate={{ y: "101%" }}
          exit={{ y: "0%" }}
          transition={{ duration: 0.45, ease: [0.55, 0, 0.55, 0.2] }}
        />
        <motion.div
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
