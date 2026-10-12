"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

const CALLOUTS = [
  {
    h: "Zweifachbrand",
    b: "Schonender Zweifachbrand auf der Kothe-Kupferanlage, Engschnitt im Herzstück. Die Entscheidung liegt in den Händen von René Dubitzky.",
    pos: "lg:left-10 lg:top-32",
  },
  {
    h: "36 Monate",
    b: "Mindestens sechsunddreißig Monate im Glasballon. Ohne Holz, ohne Korrektur — die Zeit macht den Brand.",
    pos: "lg:right-10 lg:top-[44%]",
  },
  {
    h: "Nummeriert",
    b: "Jede Flasche handnummeriert, mit Echtheitszertifikat und Wachssiegel, bevor sie das Gewölbe verlässt.",
    pos: "lg:bottom-44 lg:left-10",
  },
];

/**
 * The object band — the reference drops its tablet into water while frosted
 * callouts hang around it and a giant ghosted product name runs off the
 * bottom edge. Ours pours: the decanter photograph, screen-blended into the
 * dark green, drifting against the scroll; three facts in glass cards; the
 * name of the first edition set huge and clipped by the floor.
 */
export function FmObject() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-90, 90]);
  const ghostX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["3%", "-6%"]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-fm-night text-fm-beige">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_50%_42%,rgba(110,146,79,0.45),transparent_68%)]"
      />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1500px] flex-col items-center justify-center px-6 pb-40 pt-28 lg:px-10 lg:pb-56 lg:pt-36">
        {/* The blend sits on the transformed wrapper: a transform makes a stacking
            context, and an image blending inside one only sees its own empty
            backdrop, not the green beneath. */}
        <motion.div
          style={{ y }}
          className="relative h-[min(70svh,800px)] w-[min(72vw,560px)] mix-blend-screen [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
        >
          <Image
            src="/flasche/shot-pour.jpg"
            alt="Die Kristallflasche beim Ausgießen"
            fill
            sizes="(min-width: 1024px) 560px, 72vw"
            className="object-contain [filter:contrast(1.35)_brightness(0.98)] [mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)]"
          />
        </motion.div>

        <ul className="relative z-10 mt-10 grid w-full gap-3 sm:grid-cols-3 lg:contents">
          {CALLOUTS.map((c, i) => (
            <li key={c.h} className={`lg:absolute lg:w-[300px] ${c.pos}`}>
              <Reveal delay={i * 0.08} className="rounded-[4px] bg-fm-beige/10 p-6 backdrop-blur-md">
                <h3 className="fm-h text-[1.5rem]">{c.h}</h3>
                <p className="fm-up mt-4 text-fm-beige/75">{c.b}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <motion.p
        aria-hidden
        style={{ x: ghostX }}
        className="fm-ghost pointer-events-none absolute -bottom-[0.14em] left-4 select-none whitespace-nowrap text-[clamp(5.5rem,19vw,18rem)] text-fm-beige/[0.22] lg:left-8"
      >
        Apfel Brand
      </motion.p>
    </section>
  );
}
