"use client";

import dynamic from "next/dynamic";

const ElementalScene = dynamic(
  () => import("@/components/three/ElementalScene"),
  { ssr: false },
);

export default function BaumTest() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-night">
      <ElementalScene />
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 hidden text-center md:block">
        <p className="text-xs uppercase tracking-[0.22em] text-stone">
          Element wählen · ziehen zum Drehen
        </p>
      </div>
    </main>
  );
}
