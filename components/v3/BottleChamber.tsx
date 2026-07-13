"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { HourglassGlyph } from "./HourglassGlyph";
import { Reveal } from "@/components/ui/Reveal";

const WarmbachBottleScene = dynamic(
  () => import("@/components/three/WarmbachBottleScene"),
  { ssr: false },
);

/**
 * "Die Flaschenkammer" — the v3 signature moment: the technical drawing of the
 * BlueprintShowcase gives way to the object itself, alive in the alpine night.
 *
 * Performance contract (Briefing §6): the canvas never enters the initial
 * bundle (dynamic, ssr:false), mounts only once the section approaches the
 * viewport (IntersectionObserver + idle), renders behind a poster still until
 * the scene is ready, and pauses its frameloop while off-screen. Zoom is off
 * so wheel input stays with Lenis. Under prefers-reduced-motion the canvas is
 * never mounted — the still is the section.
 */
export function BottleChamber() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false); // approaching → mount the scene
  const [visible, setVisible] = useState(false); // on screen → run the frameloop
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduce) return;
    const nearObs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setNear(true),
      { rootMargin: "100% 0px" },
    );
    const visObs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { rootMargin: "10% 0px" },
    );
    nearObs.observe(el);
    visObs.observe(el);
    // Immediate position check: IO callbacks can be delayed (or withheld in
    // hidden tabs) — if the section is already close, don't wait for one.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 2 && r.bottom > -window.innerHeight) setNear(true);
    if (r.top < window.innerHeight * 1.1 && r.bottom > -window.innerHeight * 0.1) setVisible(true);
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
      className="relative overflow-hidden bg-night text-cream"
    >
      {/* Sanduhr watermark behind the vessel */}
      <HourglassGlyph
        className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] -translate-x-1/2 -translate-y-1/2 text-cream/[0.04]"
        sand={0.5}
        strokeWidth={0.8}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 pt-20 lg:px-10 lg:pt-28">
        <Reveal>
          <span className="inline-block border-b border-gold/40 pb-1 font-body text-[0.72rem] font-semibold tracking-[0.08em] text-gold">
            Das Gefäß
          </span>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 max-w-3xl font-body text-[clamp(1.7rem,3.6vw,2.9rem)] font-semibold uppercase leading-[1.12] tracking-[0.01em]">
            Die Flaschenkammer
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream/65 lg:text-lg">
            Grünes Tiroler Kristall, in der Nacht des Gewölbes. Kein Rendering
            fürs Regal — das Gefäß selbst, drehbar wie auf dem Brenntisch.
          </p>
        </Reveal>
      </div>

      {/* The vessel: poster-first, canvas cross-fades in on top (no reflow) */}
      <div className="relative mx-auto h-[72vh] min-h-[480px] max-w-[1400px]">
        <Image
          src="/flasche/shot-front.jpg"
          alt="Die Warmbach-Flasche aus grünem Kristall, frontal"
          fill
          sizes="(min-width: 1400px) 1400px, 100vw"
          className={`object-contain transition-opacity duration-[1200ms] ease-out ${
            ready ? "opacity-0" : "opacity-100"
          }`}
        />
        {mount && !reduce && (
          <div
            data-cursor
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          >
            <WarmbachBottleScene
              active={visible}
              onReady={() => setReady(true)}
              enableZoom={false}
              dustCount={coarse ? 140 : 260}
            />
          </div>
        )}
      </div>

      <p className="relative pb-12 text-center text-[0.68rem] uppercase tracking-[0.24em] text-cream/40 lg:pb-16">
        {reduce ? "Die Flasche · grünes Kristall" : "Ziehen zum Drehen"}
      </p>
    </section>
  );
}
