"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Monogram } from "@/components/ui/Monogram";

const SanduhrLoaderScene = dynamic(() => import("@/components/three/SanduhrLoaderScene"), {
  ssr: false,
});

/** How long the veil holds — also how long the sand takes to run (as on redesign/journal-galerie). */
const HOLD = 1500;

/**
 * The entry veil as redesign/journal-galerie built it: the monogram held over a
 * Sanduhr of falling light, then lifted. The live EntryVeil shows once per
 * session on / only, so it cannot be reviewed on demand — this replays it
 * inside a stage, as often as asked. Not wired into any public route.
 */
export function SanduhrVeilPreview() {
  const [run, setRun] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(true);
    const t = window.setTimeout(() => setShow(false), HOLD);
    return () => window.clearTimeout(t);
  }, [run]);

  return (
    <div className="relative h-[100svh] overflow-hidden bg-kalk">
      <div className="flex h-full flex-col items-center justify-center gap-8 px-6 text-center text-night">
        <p className="text-[0.62rem] uppercase tracking-[0.22em] text-terrakotta">Danach: die Seite</p>
        <p className="max-w-sm text-sm leading-relaxed text-night/75">
          {HOLD / 1000} s Sanduhr, dann hebt sich der Vorhang. Live erscheint er einmal pro Sitzung,
          nur auf der Startseite.
        </p>
        <button
          type="button"
          data-cursor
          onClick={() => setRun((n) => n + 1)}
          className="inline-flex min-h-11 items-center rounded-full bg-night px-6 text-sm font-medium text-cream transition-colors duration-300 hover:bg-merlot"
        >
          Noch einmal
        </button>
      </div>

      <AnimatePresence>
        {show && (
          <motion.div
            key={run}
            aria-hidden
            className="absolute inset-0 flex items-center justify-center bg-night"
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
              <Monogram on="dark" className="h-[84px] w-[84px]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
