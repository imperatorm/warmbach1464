"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Monogram } from "@/components/ui/Monogram";
import { useAgeConfirmed } from "@/lib/useAgeConfirmed";

const HeroDecanterScene = dynamic(() => import("@/components/three/HeroDecanterScene"), {
  ssr: false,
});

const meta = [
  { k: "Lage", v: "47°27′ N · 12°23′ O" },
  { k: "Höhe", v: "760 m ü. A. · Osthang" },
  { k: "Beleg", v: "Salbuch · Anno 1464" },
];

/**
 * v2 hero, third sheet — the alpine film with the decanter afloat above the
 * giant numeral (Oryzo's floating-object-over-display-type composition from
 * the Mobbin research). The section is two viewports tall; a sticky stage
 * holds the film while scroll drives the choreography: the bottle spins and
 * sinks toward the type, the film darkens, the wordmark lifts away.
 *
 * Performance contract (Briefing §6): the poster jpg stays the LCP; the R3F
 * canvas is dynamic/ssr:false, mounts only after the Age Gate + idle, fades
 * in over the film when ready, pauses its frameloop once scrolled past, and
 * is never mounted under prefers-reduced-motion (the static title sheet is
 * the hero). No controls — the canvas is pointer-transparent, wheel stays
 * with Lenis.
 */
export function HeroEditorial() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const ageConfirmed = useAgeConfirmed();
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const [past, setPast] = useState(false); // hero fully scrolled away → pause loop
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // Mount the scene only once the gate is cleared and the thread is idle.
  useEffect(() => {
    if (!ageConfirmed || reduce) return;
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    if (w.requestIdleCallback) w.requestIdleCallback(() => setMount(true), { timeout: 1500 });
    else window.setTimeout(() => setMount(true), 300);
  }, [ageConfirmed, reduce]);

  // Pause the frameloop when the hero leaves the viewport entirely.
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const obs = new IntersectionObserver(([e]) => setPast(!e.isIntersecting));
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // — the choreography —
  const spin = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 1.6]); // read per-frame in-scene
  const bottleY = useTransform(scrollYProgress, [0, 1], ["9%", "-7%"]);
  const bottleScale = useTransform(scrollYProgress, [0, 1], [0.92, 1.1]);
  const wordmarkY = useTransform(scrollYProgress, [0, 0.3], [0, -90]);
  const wordmarkOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const filmScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const filmShade = useTransform(scrollYProgress, [0.45, 1], [0, 0.62]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const frameOpacity = useTransform(scrollYProgress, [0, 0.08, 0.85, 1], [0, 1, 1, 0]);

  const rise = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6, delay } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.1, delay, ease: "easeOut" as const },
        };

  return (
    <section ref={ref} className={`relative bg-night ${reduce ? "h-[100svh]" : "h-[220svh]"}`}>
      {/* Sticky stage — the sheet the choreography plays on */}
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Cinematic alpine film — the LCP poster paints instantly (~26KB jpg) */}
        <motion.video
          style={reduce ? undefined : { scale: filmScale }}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="/video/alpine-poster.jpg"
          aria-hidden="true"
        >
          <source src="/video/alpine.mp4" type="video/mp4" />
        </motion.video>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night/70 via-night/40 to-night/90" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(29,41,29,0.85)_96%)]" />
        {/* Scroll-driven dusk — the film sinks into the night as the sheet turns */}
        <motion.div
          style={reduce ? undefined : { opacity: filmShade }}
          className="pointer-events-none absolute inset-0 bg-night"
        />

        {/* Centred wordmark — lifts away as the decanter takes the frame */}
        <motion.div
          style={reduce ? undefined : { y: wordmarkY, opacity: wordmarkOpacity }}
          className="absolute inset-0 z-10 flex flex-col items-center px-6 pt-[13svh] text-center"
        >
          <motion.p {...rise(0)} className="mb-4 text-[0.6rem] uppercase tracking-[0.42em] text-gold sm:text-[0.68rem]">
            Warmbachhof · Kitzbühel
          </motion.p>
          <motion.div {...rise(0.24)} className="flex items-center gap-3">
            <span className="text-sm uppercase tracking-[0.4em] text-gold sm:text-base [margin-inline-end:-0.4em]">by</span>
            <Monogram className="h-9 w-auto sm:h-11" />
          </motion.div>
          <motion.p {...rise(0.38)} className="mt-5 font-display text-base italic text-cream/70 sm:text-lg">
            From our Soil to your Soul.
          </motion.p>
        </motion.div>

        {/* The decanter — afloat over the numeral, spun by the scroll */}
        {mount && !reduce && (
          <motion.div
            style={{ y: bottleY, scale: bottleScale }}
            className={`pointer-events-none absolute inset-x-0 top-[20svh] h-[44svh] sm:top-[12svh] sm:h-[58svh] z-20 transition-opacity duration-[1400ms] ease-out ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          >
            <HeroDecanterScene
              spin={spin}
              active={!past}
              onReady={() => setReady(true)}
              dustCount={coarse ? 120 : 200}
            />
          </motion.div>
        )}

        {/* Oryzo viewfinder — a quiet dashed register around the specimen */}
        {!reduce && (
          <motion.div
            style={{ opacity: frameOpacity }}
            aria-hidden
            className={`pointer-events-none absolute left-1/2 top-[16svh] z-10 h-[52svh] w-[min(74vw,540px)] -translate-x-1/2 border border-dashed border-cream/20 transition-opacity duration-1000 ${
              ready ? "" : "opacity-0"
            }`}
          >
            <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-gold/70" />
            <span className="absolute -right-px -top-px h-3 w-3 border-r border-t border-gold/70" />
            <span className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-gold/70" />
            <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-gold/70" />
            <span className="absolute -top-6 left-0 text-[0.55rem] uppercase tracking-[0.28em] text-cream/40">
              Warmbach · 01
            </span>
            <span className="absolute -top-6 right-0 text-[0.55rem] uppercase tracking-[0.28em] text-cream/40">
              Grünes Kristall
            </span>
          </motion.div>
        )}

        {/* Full-width title — the numeral the decanter sinks toward */}
        <motion.div
          style={reduce ? undefined : { y: titleY }}
          className="absolute bottom-24 left-0 right-0 z-10 overflow-hidden"
        >
          <motion.div {...rise(0.08)} className="w-full">
            <svg
              viewBox="0 0 1000 280"
              className="block w-full h-auto text-cream [filter:drop-shadow(0_2px_50px_rgba(0,0,0,0.55))]"
              role="img"
              aria-label="1464"
            >
              <text
                x="0"
                y="230"
                textLength="1000"
                lengthAdjust="spacingAndGlyphs"
                fontFamily="var(--font-display)"
                fontWeight="400"
                fontSize="260"
                fill="currentColor"
              >
                1464
              </text>
            </svg>
          </motion.div>
        </motion.div>

        {/* Editorial data strip — the folio line of the title sheet */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.1 }}
          className="absolute inset-x-0 bottom-0 z-30"
        >
          <div className="mx-6 border-t border-cream/15 lg:mx-10">
            <div className="grid grid-cols-2 gap-y-3 py-5 sm:grid-cols-4">
              {meta.map((m) => (
                <div key={m.k} className="flex flex-col gap-1">
                  <span className="text-[0.55rem] uppercase tracking-[0.28em] text-cream/40">{m.k}</span>
                  <span className="text-[0.7rem] uppercase tracking-[0.18em] text-cream/80">{m.v}</span>
                </div>
              ))}
              <div className="flex flex-col gap-1 sm:items-end sm:text-right">
                <span className="text-[0.55rem] uppercase tracking-[0.28em] text-cream/40">Blatt</span>
                <span className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                  Scroll
                  <motion.span
                    aria-hidden
                    animate={reduce ? undefined : { y: [0, 4, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ↓
                  </motion.span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
