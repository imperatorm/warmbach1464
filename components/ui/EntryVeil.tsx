"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Monogram } from "./Monogram";

const SanduhrLoaderScene = dynamic(
  () => import("@/components/three/SanduhrLoaderScene"),
  { ssr: false },
);

const KEY = "wbz_entered";

/** How long the veil holds — also how long the sand takes to run. */
const HOLD = 1500;

/**
 * One-time entry moment: on the first arrival of a session (home routes only),
 * a night veil holds the monogram over a Sanduhr of falling light (SanduhrLoaderScene)
 * for a beat, then lifts. Session-gated so it never repeats, HOLD ms so it never
 * annoys, skipped under prefers-reduced-motion,
 * and rendered only after hydration so the server paint (LCP) is untouched.
 * Explicitly expendable per PLAN if Lighthouse regresses.
 */
export function EntryVeil() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduce) return;
    if (pathname !== "/" && pathname !== "/v3") return;
    try {
      if (sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY, "1");
    } catch {
      return;
    }
    setShow(true);
    const t = window.setTimeout(() => setShow(false), HOLD);
    return () => window.clearTimeout(t);
    // Run once on first mount only — later route changes must not re-trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[120] flex items-center justify-center bg-night"
          initial={{ opacity: 1 }}
          exit={{ y: "-101%" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <SanduhrLoaderScene duration={HOLD} />

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Monogram className="h-[84px] w-[84px]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
