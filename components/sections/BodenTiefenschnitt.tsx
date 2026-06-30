"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { soilLayers } from "@/lib/soil";

const TiefenschnittScene = dynamic(() => import("@/components/three/TiefenschnittScene"), { ssr: false });

// Erdtöne für den Reduced-Motion-Fallback (statische Schicht-Bänder, keine Animation).
const layerBg: Record<string, string> = {
  humus: "linear-gradient(180deg,#3c2e1d,#312614)",
  verwitterung: "linear-gradient(180deg,#4a3a24,#3c2e1d)",
  schiefer: "linear-gradient(180deg,#3d4741,#313a34)",
  wasser: "linear-gradient(180deg,#27484f,#1b3338)",
};

export function BodenTiefenschnitt() {
  const reduce = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stickyRef, { margin: "0px 0px -10% 0px" });
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = trackRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        progressRef.current = p;
        setActive(Math.min(soilLayers.length - 1, Math.floor(p * soilLayers.length + 0.0001)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  // Reduced motion / no-JS-friendly: ruhige, gestapelte Schicht-Bänder ohne Bewegung.
  if (reduce) {
    return (
      <div className="mx-auto max-w-[1100px] overflow-hidden rounded-lg border border-hairline/20">
        {soilLayers.map((l, i) => (
          <div key={l.key} className="relative flex min-h-[34vh] items-center px-8 py-10 lg:px-14" style={{ background: layerBg[l.key] }}>
            <div className="absolute left-0 top-0 h-full w-px bg-gold/30" />
            <div className="flex w-full items-center justify-between gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cream/55">{l.depth}</p>
                <h3 className="t-h2 mt-2 text-cream">{l.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream/75">{l.note}</p>
              </div>
              <span aria-hidden className="font-display text-6xl italic leading-none text-gold/25">{i + 1}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={trackRef} className="relative h-[300vh]">
      <div ref={stickyRef} className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* 3D-Bohrkern (lazy) */}
        <div className="absolute inset-0">{inView && <TiefenschnittScene progressRef={progressRef} />}</div>

        {/* Lesbarkeits-Scrim links für den Text */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-night/85 via-night/30 to-transparent" />

        {/* Overlay: aktive Schicht */}
        <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-[1280px] items-center justify-between gap-8 px-6 lg:px-10">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-sm"
          >
            <p className="t-label text-gold">Der Tiefenschnitt</p>
            <p className="mt-3 font-display text-sm italic text-stone">
              {String(active + 1).padStart(2, "0")} / {String(soilLayers.length).padStart(2, "0")}
            </p>
            <h3 className="mt-2 font-display text-4xl text-cream lg:text-5xl">{soilLayers[active].title}</h3>
            <p className="mt-3 text-xs uppercase tracking-[0.24em] text-gold/80">{soilLayers[active].depth}</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/75">{soilLayers[active].note}</p>
          </motion.div>

          {/* Tiefen-Index rechts */}
          <ol className="hidden flex-col items-end gap-3 sm:flex">
            {soilLayers.map((l, i) => (
              <li key={l.key} className="flex items-center gap-3">
                <span className={`text-xs uppercase tracking-[0.18em] transition-colors duration-300 ${i === active ? "text-gold" : "text-stone/45"}`}>
                  {l.title}
                </span>
                <span className={`h-px transition-all duration-300 ${i === active ? "w-10 bg-gold" : "w-5 bg-stone/30"}`} />
              </li>
            ))}
          </ol>
        </div>

        <p className="pointer-events-none absolute inset-x-0 bottom-7 text-center text-xs uppercase tracking-[0.28em] text-stone">
          ↓ in den Boden scrollen
        </p>
      </div>

      {/* A11y: Schichten als Text */}
      <ul className="sr-only">
        {soilLayers.map((l) => (
          <li key={l.key}>{l.title} ({l.depth}): {l.note}</li>
        ))}
      </ul>
    </div>
  );
}
