"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

const HeroDecanterScene = dynamic(() => import("@/components/three/HeroDecanterScene"), {
  ssr: false,
});

const SPECS = [
  { k: "Glas", v: "Tiroler Glaskunst" },
  { k: "Brand", v: "Zweifachbrand · Kupfer" },
  { k: "Wasser", v: "Quellwasser · 7 °C" },
  { k: "Reife", v: "36 Monate, mindestens" },
  { k: "Siegel", v: "Wachs · Zertifikat" },
  { k: "Nummer", v: "Handnummeriert" },
];

/**
 * Die Flasche — the object itself, alive in the middle of the night, with the
 * provenance register beside it. Performance contract unchanged from the v3
 * Flaschenkammer: the canvas is dynamic/ssr:false, mounts only as the section
 * approaches and the thread goes idle, hides behind the poster still until
 * ready, pauses its frameloop off-screen, and never mounts at all under
 * prefers-reduced-motion.
 */
export function ArtifactBand() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
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
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-night px-6 py-24 text-cream lg:px-10 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_50%_45%,_rgba(197,126,91,0.12),_transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1500px]">
        <Reveal>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold">
            ( 04 ) Die Flasche
          </p>
          <h2 className="t-hero mt-4 max-w-[18ch] text-[clamp(1.9rem,4vw,3.2rem)] text-cream">
            Kein Rendering fürs Regal — <span className="t-accent">das Gefäß selbst</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 items-center gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          {/* Register */}
          <Reveal className="order-2 lg:order-1 lg:col-span-3">
            <dl>
              {SPECS.map((s) => (
                <div
                  key={s.k}
                  className="flex items-baseline justify-between gap-4 border-t border-cream/15 py-3 first:border-t-0"
                >
                  <dt className="text-[0.6rem] uppercase tracking-[0.24em] text-cream/60">{s.k}</dt>
                  <dd className="text-right text-[0.7rem] uppercase tracking-[0.14em] text-cream/90">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* The object */}
          <div className="relative order-1 mx-auto h-[58vh] min-h-[420px] w-full max-w-[560px] lg:order-2 lg:col-span-6">
            <Image
              src="/flasche/shot-front.jpg"
              alt="Die Warmbach-Flasche aus grünem Kristall, frontal"
              fill
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
                <HeroDecanterScene active={visible} onReady={() => setReady(true)} dustCount={180} />
              </div>
            )}
          </div>

          {/* Exit */}
          <Reveal delay={0.1} className="order-3 lg:col-span-3">
            <p className="max-w-[34ch] text-sm leading-relaxed text-cream/65">
              Tiroler Glasbläsertradition mit Wurzeln im 18. Jahrhundert. Herkunft, Hand
              und Siegel — die Flasche erzählt, wo der Brand herkommt, bevor man ihn
              öffnet.
            </p>
            <Link
              href="/flasche"
              data-cursor
              className="mt-7 inline-block rounded-full bg-cream px-5 py-2.5 text-sm font-medium text-night transition-colors duration-300 hover:bg-gold"
            >
              Zur Flasche
            </Link>
            <p className="mt-5 text-[0.6rem] uppercase tracking-[0.22em] text-cream/60">
              47.4486° N — 12.3936° E
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
