"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const WarmbachBottleScene = dynamic(() => import("@/components/three/WarmbachBottleScene"), {
  ssr: false,
});

export default function FlascheTestPage() {
  const [tint, setTint] = useState<"green" | "clear">("green");
  const [stopper, setStopper] = useState(true);

  const chip = (active: boolean) =>
    `px-4 py-2 border text-xs transition-colors ${
      active ? "border-gold text-gold" : "border-hairline/30 text-cream/70 hover:text-cream"
    }`;

  return (
    <div className="min-h-screen bg-night px-6 pb-24 pt-28 lg:px-12 lg:pt-32">
      <div className="mx-auto max-w-5xl">
        <p className="signage text-gold mb-2">Testflasche · Warmbach 01</p>
        <h1 className="display text-3xl leading-tight text-cream md:text-5xl">
          Organische Eiform mit der X-Falte.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/70">
          Mundgeblasenes Kristall · 143 × 96 mm · ~750 ml. Die charakteristische Falte ist in
          Front und Rückseite gepresst. Erste 3D-Testintegration — Form, Farbe und Falte sind
          parametrisch und lassen sich gemeinsam feinjustieren.
        </p>

        {/* Bounded 3D inspector — the bottle renders here; the page scrolls normally around it */}
        <div className="relative mt-8 h-[72vh] min-h-[520px] w-full overflow-hidden border border-hairline/15 bg-[#0c120e]">
          <WarmbachBottleScene tint={tint} showStopper={stopper} />
          <p className="pointer-events-none absolute bottom-4 right-5 text-xs text-cream/40">
            ziehen zum Drehen · zoomen mit Rad oder Pinch
          </p>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button onClick={() => setTint("green")} className={chip(tint === "green")}>
            Grünes Kristall
          </button>
          <button onClick={() => setTint("clear")} className={chip(tint === "clear")}>
            Klar
          </button>
          <button onClick={() => setStopper((s) => !s)} className={chip(stopper)}>
            Stopfen {stopper ? "an" : "aus"}
          </button>
        </div>
      </div>
    </div>
  );
}
