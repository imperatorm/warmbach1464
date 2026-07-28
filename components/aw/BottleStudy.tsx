"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

const HeroDecanterScene = dynamic(() => import("@/components/three/HeroDecanterScene"), {
  ssr: false,
});

// Every row is stated in lib/content or the existing Flasche copy — nothing
// invented. Presented as a register (Assembly / Touchy pattern) rather than
// prose, because a spec sheet is what a collector actually reads.
const SPEC = [
  { k: "Material", v: "Klares Kristall, mundgeblasen" },
  { k: "Form", v: "Flach-oval, eine Handbreit tief" },
  { k: "Schliff", v: "Gefalteter, vierstrahliger Stern" },
  { k: "Gravur", v: "1464 · Kitzbühel · Austria" },
  { k: "Signatur", v: "W//-Monogramm, rückseitig" },
  { k: "Siegel", v: "Warmbach-Medaillon an feiner Kette" },
  { k: "Herkunft", v: "Tiroler Glaskunst, 18. Jahrhundert" },
  { k: "Nummerierung", v: "Fortlaufend, mit Echtheitszertifikat" },
  { k: "Boden", v: "47.4486° N · 12.3936° E" },
];

const NOTES = [
  {
    h: "Die Tradition",
    b: "Tiroler Glasbläserei mit Wurzeln im 18. Jahrhundert. Der Dekanter ist kein Behälter, sondern der letzte Handwerksschritt einer Kette, die am Osthang beginnt.",
  },
  {
    h: "Die Hand",
    b: "Jede Flasche mundgeblasen — Material, Maß und Charakter eines Einzelstücks. Zwei Flaschen dieser Serie sind einander ähnlich, aber nie gleich.",
  },
  {
    h: "Das Siegel",
    b: "Fortlaufende Nummerierung, Echtheitszertifikat und Wachssiegel — die Signatur des Hofs, angebracht bevor die Flasche das Gewölbe verlässt.",
  },
];

/**
 * The bottle as a study: the object stands still in a sticky column while the
 * register and the three notes scroll past it (Assembly Coffee's product
 * pattern). The 3D scene carries the same performance contract as everywhere
 * else — deferred, idle-mounted, paused off-screen, never under reduced
 * motion, with the photograph standing in until the canvas is ready.
 */
export function BottleStudy() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const nearObs = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), {
      rootMargin: "100% 0px",
    });
    const visObs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: "10% 0px",
    });
    nearObs.observe(el);
    visObs.observe(el);
    return () => {
      nearObs.disconnect();
      visObs.disconnect();
    };
  }, [reduce]);

  useEffect(() => {
    if (!near || reduce) return;
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    if (w.requestIdleCallback) w.requestIdleCallback(() => setMount(true), { timeout: 1200 });
    else window.setTimeout(() => setMount(true), 200);
  }, [near, reduce]);

  return (
    <section ref={ref} className="relative bg-night px-6 py-20 text-cream lg:px-10 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_28%_45%,_rgba(197,126,91,0.12),_transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-[1500px] grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
        {/* The object — held while the reading column moves */}
        <div className="lg:sticky lg:top-0 lg:h-[100svh] lg:self-start">
          <div className="relative h-[56vh] min-h-[380px] w-full lg:h-full">
            <Image
              src="/flasche/shot-front.jpg"
              alt="Die 1464byW Kristallflasche — Front mit Medaillon und Stern-Schliff"
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 92vw"
              className={`object-contain transition-opacity duration-[1200ms] ease-out ${
                ready ? "opacity-0" : "opacity-100"
              }`}
            />
            {mount && !reduce && (
              <div
                className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
                  ready ? "opacity-100" : "opacity-0"
                }`}
              >
                <HeroDecanterScene active={visible} onReady={() => setReady(true)} dustCount={160} />
              </div>
            )}
          </div>
        </div>

        {/* The reading column */}
        <div className="lg:py-24">
          <Reveal>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold">
              Das Blatt
            </p>
            <h2 className="t-hero mt-4 text-[clamp(1.8rem,3.6vw,2.8rem)] text-cream">
              Ein Gefäß mit <span className="t-accent">Denkmalwürde</span>
            </h2>
          </Reveal>

          {/* Register */}
          <Reveal delay={0.08}>
            <dl className="mt-12 border-t border-cream/20">
              {SPEC.map((s) => (
                <div
                  key={s.k}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-cream/12 py-3.5"
                >
                  <dt className="text-[0.6rem] uppercase tracking-[0.24em] text-cream/60">{s.k}</dt>
                  <dd className="text-right text-[0.75rem] uppercase tracking-[0.12em] text-cream/90">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* The three notes */}
          <div className="mt-16 flex flex-col gap-10">
            {NOTES.map((n, i) => (
              <Reveal key={n.h} delay={i * 0.06}>
                <div className="border-t border-cream/20 pt-5">
                  <h3 className="text-lg font-medium text-cream">{n.h}</h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-cream/70">{n.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
