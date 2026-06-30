"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { heritageElements } from "@/lib/content";

const ElementalScene = dynamic(
  () => import("@/components/three/ElementalScene"),
  { ssr: false },
);

const DEFAULT_INTRO =
  "Der über hundertjährige Apfelbaum, genährt von der artesischen Quelle, die durch seine Wurzeln aufsteigt — daneben der kupferne Kothe-Kessel mit seinem Feuer. Fünf Elemente, aus denen der Brand entsteht.";

/**
 * The interactive elemental scene (realistic apple tree + spring + copper still),
 * framed for a page. The heavy WebGL (procedural tree + bloom) mounts only once
 * the block scrolls into view, keeping load time and Total-Blocking-Time low.
 */
export function ElementalSceneSection({
  eyebrow = "Fünf Elemente",
  title = "Der lebendige Baum",
  intro = DEFAULT_INTRO,
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  return (
    <section className="relative overflow-hidden border-t border-hairline/10 bg-night px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <p className="t-label mb-4">{eyebrow}</p>
          <h2 className="t-h1 mb-5 max-w-3xl text-cream">{title}</h2>
          <p className="t-lead mb-12 max-w-2xl">{intro}</p>
        </Reveal>

        <div
          ref={ref}
          className="relative h-[80vh] min-h-[560px] w-full overflow-hidden"
        >
          {inView ? (
            <ElementalScene />
          ) : (
            <div className="grid h-full place-items-center">
              <span className="inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-gold/50" />
            </div>
          )}
        </div>

        <p className="mt-7 text-center text-xs uppercase tracking-[0.28em] text-stone">
          Element wählen — heranfahren
          <span className="mx-2 text-gold/50">·</span>
          ziehen zum Drehen
        </p>

        <div className="mt-16 grid gap-px overflow-hidden border border-hairline/15 bg-hairline/10 sm:grid-cols-2 lg:grid-cols-5">
          {heritageElements.map((el, i) => (
            <Reveal key={el.no} delay={i * 0.05} className="flex flex-col bg-night p-7">
              <p className="t-label text-gold">{el.no}</p>
              <h3 className="t-h3 mt-3 text-cream">{el.name}</h3>
              <p className="mt-1 text-[0.72rem] uppercase tracking-[0.16em] text-stone">{el.data}</p>
              <p className="mt-4 text-sm leading-relaxed text-cream/70">{el.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
