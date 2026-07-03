"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

const ElementalDiorama = dynamic(
  () => import("@/components/three/ElementalDiorama"),
  { ssr: false },
);

const DEFAULT_INTRO =
  "Ein Querschnitt durch den Hof: oben der über hundertjährige Apfelbaum, unten die artesische Quelle, die ihn nährt — dazwischen Erde, Kupfer und Feuer, aus denen der Brand entsteht.";

/**
 * The interactive elemental diorama, framed for a page. The WebGL canvas mounts
 * only once the block scrolls into view (keeps Total-Blocking-Time at zero on
 * load), and falls back to a still, non-rotating render under reduced-motion.
 */
export function DioramaSection({
  eyebrow = "Herkunft",
  title = "Der lebendige Baum",
  intro = DEFAULT_INTRO,
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
}) {
  const reduce = useReducedMotion();
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
          className="relative mx-auto h-[68vh] min-h-[460px] w-full max-w-[1120px]"
        >
          {/* seat glow behind the canvas */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(197,126,91,0.07),_transparent_68%)]"
          />
          {inView ? (
            <ElementalDiorama animate={!reduce} />
          ) : (
            <div className="grid h-full place-items-center">
              <span className="inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-gold/50" />
            </div>
          )}
        </div>

        <p className="mt-7 text-center text-xs uppercase tracking-[0.28em] text-stone">
          Element wählen — hineinzoomen
          <span className="mx-2 text-gold/50">·</span>
          ziehen zum Drehen
        </p>
      </div>
    </section>
  );
}
