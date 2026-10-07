"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { BOTTLE, CRAFT } from "./content";

const PANEL_BG = ["bg-[#2b3b2b]", "bg-copper", "bg-merlot"];

/**
 * C · "Panorama" (Freitag) — vertical scroll drives a pinned horizontal run:
 * an intro panel, then one full-height panel per chapter, each a coloured
 * ground with the photograph bleeding off one edge and the chapter title set
 * big. Falls back to a plain vertical stack under reduced motion.
 */
export function CraftPanorama({ tail }: { tail?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const n = CRAFT.chapters.length + 1 + (tail ? 1 : 0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${((n - 1) / n) * 100}%`]);

  const panels = (
    <>
      <div className="flex h-full w-screen shrink-0 flex-col justify-between bg-night px-6 pb-12 pt-28 lg:px-10">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold">{CRAFT.kicker}</p>
        <h2 className="t-hero max-w-[16ch] text-[clamp(2.4rem,6vw,6rem)] leading-[1.02]">{CRAFT.title}</h2>
        <div className="flex items-end justify-between gap-6">
          <p className="max-w-xs text-sm leading-relaxed text-cream/60">{CRAFT.note}</p>
          <p className="hidden text-[0.62rem] uppercase tracking-[0.24em] text-cream/50 md:block">Weiter scrollen &rarr;</p>
        </div>
      </div>
      {CRAFT.chapters.map((c, i) => (
        <article key={c.id} className={`grid h-full w-screen shrink-0 grid-cols-1 lg:grid-cols-2 ${PANEL_BG[i]}`}>
          <div className="relative min-h-[45svh] overflow-hidden lg:order-2">
            <Image src={c.src} alt={c.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-between px-6 pb-12 pt-10 lg:px-12 lg:pt-28">
            <div className="flex items-baseline justify-between">
              <span className="text-[0.62rem] uppercase tracking-[0.24em] text-cream/70">{c.fact}</span>
              <span className="t-poster text-6xl leading-none text-cream/25">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div>
              <h3 className="t-hero text-[clamp(2rem,4.6vw,4.6rem)] leading-[1.02]">{c.title}</h3>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/80 md:text-base">{c.body}</p>
            </div>
          </div>
        </article>
      ))}
      {tail}
    </>
  );

  if (reduce) {
    return <section className="flex flex-col text-cream [&>*]:min-h-[100svh]">{panels}</section>;
  }

  return (
    <section ref={ref} className="relative text-cream" style={{ height: `${n * 100}svh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div style={{ x }} className="flex h-full w-max">
          {panels}
        </motion.div>
      </div>
    </section>
  );
}

/**
 * C · "Split stage" (Oryzo + Oura) — headline over the warm photograph on the
 * left, a detail crop that wipes in on the right, and the register as a
 * three-column spec grid underneath.
 */
export function BottleSplit() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const clip = useTransform(scrollYProgress, [0, 1], reduce ? ["inset(0 0 0 0)", "inset(0 0 0 0)"] : ["inset(0 0 100% 0)", "inset(0 0 0% 0)"]);

  return (
    <section ref={ref} className="bg-night px-4 pb-24 pt-4 text-cream lg:px-6 lg:pb-32">
      <div className="grid grid-cols-1 gap-4 lg:h-[92svh] lg:grid-cols-[1.6fr_1fr]">
        <div className="relative min-h-[70svh] overflow-hidden rounded-[10px]">
          <Image src={BOTTLE.src} alt={BOTTLE.alt} fill sizes="(min-width:1024px) 62vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-night/70 via-night/10 to-transparent" />
          <div className="absolute inset-x-0 top-0 p-6 lg:p-10">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold">{BOTTLE.kicker}</p>
            <h2 className="t-hero mt-5 max-w-[14ch] text-[clamp(2.2rem,4.6vw,4.8rem)] leading-[1.02]">{BOTTLE.title}</h2>
          </div>
          <p className="t-accent absolute bottom-6 left-6 text-[clamp(1.4rem,2.4vw,2.2rem)] text-cream lg:bottom-10 lg:left-10">— {BOTTLE.accent}</p>
        </div>
        <motion.div style={{ clipPath: clip }} className="relative min-h-[50svh] overflow-hidden rounded-[10px]">
          <Image src={BOTTLE.details[0]} alt="Hals der Flasche mit Siegel" fill sizes="(min-width:1024px) 38vw, 100vw" className="object-cover" />
          <Link href="/flasche" data-cursor className="group absolute bottom-6 right-6 inline-flex items-center gap-3 rounded-full bg-cream py-1.5 pl-6 pr-1.5 text-sm font-medium uppercase text-night transition-colors hover:bg-gold">
            {BOTTLE.cta}
            <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-full bg-night text-cream transition-transform group-hover:translate-x-0.5">&rarr;</span>
          </Link>
        </motion.div>
      </div>

      <div className="mx-auto mt-20 max-w-[1500px] px-2 lg:px-4">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-cream/15 pb-6">
            <p className="text-[0.7rem] uppercase tracking-[0.22em] text-cream/60">Register</p>
            <p className="max-w-md text-sm leading-relaxed text-cream/65">{BOTTLE.body}</p>
          </div>
        </Reveal>
        <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {BOTTLE.specs.map((s, k) => (
            <Reveal key={s.k} delay={k * 0.05}>
              <div className="border-b border-cream/15 py-7">
                <dt className="text-[0.62rem] uppercase tracking-[0.24em] text-gold">{s.k}</dt>
                <dd className="t-hero mt-3 text-[clamp(1.3rem,1.8vw,1.7rem)]">{s.v}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
