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

/**
 * The dark band (Escape's centered-portrait chapter): a caps lead with an
 * inline chip, the decanter alive in the middle of the night, vertical rails
 * on both edges, and the base-embossing coordinates as the caption — the
 * photo-with-coordinates composition, but the artifact is real 3D.
 *
 * Same performance contract as the v3 Flaschenkammer: dynamic/ssr:false,
 * mounts near viewport + idle, poster still cross-fades, frameloop pauses
 * off-screen, never mounts under prefers-reduced-motion.
 */
export function BottleBand() {
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
    <section ref={sectionRef} className="relative overflow-hidden bg-night px-6 py-24 text-cream lg:py-32">
      {/* Side rails */}
      <p className="t-rail absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 text-cream/60 lg:left-6 lg:block">
        Ein Gefäß mit Denkmalwürde
      </p>
      <p className="t-rail absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rotate-180 text-cream/60 lg:right-6 lg:block">
        Grünes Tiroler Kristall · Handnummeriert
      </p>

      <div className="relative mx-auto max-w-[1500px]">
        {/* Caps lead with inline chip (Escape's paragraph + LEARN MORE) */}
        <Reveal>
          <p className="mx-auto max-w-3xl text-center text-[0.8rem] font-semibold uppercase leading-relaxed tracking-[0.16em] text-cream/85 lg:text-[0.95rem]">
            Kein Rendering fürs Regal — das Gefäß selbst. Tiroler Glasbläsertradition mit
            Wurzeln im 18. Jahrhundert: Herkunft, Hand und Siegel, bevor man die Flasche
            öffnet.{" "}
            <Link
              href="/flasche"
              data-cursor
              className="ml-1 inline-block translate-y-[-0.1em] bg-gold px-2.5 py-1 align-middle text-[0.62rem] font-semibold tracking-[0.18em] text-night transition-colors hover:bg-cream"
            >
              Zur Flasche
            </Link>
          </p>
        </Reveal>

        {/* The artifact — centered, alive */}
        <div className="relative mx-auto mt-14 h-[62vh] min-h-[440px] max-w-[900px] lg:mt-16">
          <Image
            src="/flasche/shot-front.jpg"
            alt="Die Warmbach-Flasche aus grünem Kristall, frontal"
            fill
            sizes="(min-width: 900px) 900px, 100vw"
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

        {/* Coordinates caption — the base embossing, spelled out */}
        <Reveal>
          <p className="mt-8 text-center text-[0.7rem] uppercase tracking-[0.3em] text-cream/60">
            47.4486° N — 12.3936° E
          </p>
        </Reveal>
      </div>
    </section>
  );
}
