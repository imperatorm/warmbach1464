"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { BOTTLE, CRAFT } from "./content";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * A · "Index" (Atlas) — one full-bleed photograph per chapter, held while the
 * page scrolls through 300vh. The chapter word is set across the bottom of
 * the frame at poster size and swaps with the photograph; a counter and a
 * hairline progress carry the position. No cards, no monogram.
 */
export function CraftIndex() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [i, setI] = useState(0);
  const n = CRAFT.chapters.length;
  useMotionValueEvent(scrollYProgress, "change", (p) => setI(Math.min(n - 1, Math.floor(p * n))));
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const c = CRAFT.chapters[i];

  return (
    <section ref={ref} className="relative bg-night text-cream" style={{ height: `${n * 100}svh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={c.id}
            initial={reduce ? false : { opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: EASE }}
            className="absolute inset-0"
          >
            <Image src={c.src} alt={c.alt} fill sizes="100vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-night/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-night/60" />

        {/* frame chrome */}
        <div className="relative mx-auto flex h-full max-w-[1500px] flex-col px-6 pb-6 pt-28 lg:px-10">
          <div className="grid grid-cols-12 gap-6">
            <p className="col-span-6 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold lg:col-span-2">{CRAFT.kicker}</p>
            <div className="col-span-6 flex items-start gap-4 lg:col-span-2">
              <span className="t-poster text-5xl leading-none tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="mt-1 flex gap-1.5">
                {CRAFT.chapters.map((x, k) => (
                  <span key={x.id} className={`h-1.5 w-1.5 rounded-full ${k === i ? "bg-gold" : "bg-cream/30"}`} />
                ))}
              </span>
            </div>
            <h2 className="t-hero col-span-12 max-w-[22ch] text-[clamp(1.4rem,2.2vw,2rem)] text-cream/90 lg:col-span-5 lg:col-start-8">
              {CRAFT.title}
            </h2>
          </div>

          <div className="mt-auto grid grid-cols-12 items-end gap-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={c.id}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="col-span-12 lg:col-span-3"
              >
                <p className="text-[0.62rem] uppercase tracking-[0.24em] text-gold">{c.fact}</p>
                <h3 className="mt-3 text-lg font-medium">{c.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/70">{c.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* the poster word */}
          <div className="relative mt-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={c.id}
                aria-hidden
                initial={reduce ? false : { y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.8, ease: EASE }}
                className="t-poster text-[clamp(5rem,19vw,22rem)] uppercase leading-[0.8] text-cream"
              >
                {c.word}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="relative mt-4 h-px bg-cream/15">
            <motion.div style={{ width: bar }} className="absolute inset-y-0 left-0 bg-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Callout positions as % of the image box — anchored to parts of the bottle. */
const PINS = [
  { k: 0, x: 56, y: 18, side: "r" },
  { k: 3, x: 72, y: 44, side: "r" },
  { k: 4, x: 66, y: 64, side: "r" },
  { k: 1, x: 37, y: 58, side: "l" },
  { k: 2, x: 28, y: 80, side: "l" },
  { k: 5, x: 54, y: 82, side: "r" },
] as const;

/**
 * A · "Annotated object" (Norma / Telepathic Instruments) — the bottle on its
 * own, the provenance register turned into callouts pinned to it with
 * hairline leaders; each one draws in as the object enters view.
 */
export function BottleAnnotated({ asPanel = false }: { asPanel?: boolean }) {
  const Wrap = asPanel ? "div" : "section";
  return (
    <Wrap
      className={
        asPanel
          ? "relative flex h-full w-screen shrink-0 items-center overflow-hidden bg-night px-6 pt-20 text-cream lg:px-10"
          : "relative overflow-hidden bg-night px-6 py-24 text-cream lg:px-10 lg:py-36"
      }
    >
      <div className={`mx-auto grid w-full max-w-[1500px] grid-cols-1 lg:grid-cols-12 ${asPanel ? "items-center gap-8" : "gap-16"}`}>
        <div className="lg:col-span-4 lg:pt-10">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold">{BOTTLE.kicker}</p>
          <h2 className="t-hero mt-5 text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.08]">{BOTTLE.title}</h2>
          <p className="t-accent mt-2 text-[clamp(1.6rem,2.8vw,2.6rem)] text-gold">{BOTTLE.accent}</p>
          <p className={`mt-8 max-w-sm text-sm leading-relaxed text-cream/65 ${asPanel ? "hidden lg:block" : ""}`}>{BOTTLE.body}</p>
          <Link href="/flasche" data-cursor className="group mt-9 inline-flex items-center gap-3 border-b border-cream/30 pb-2 text-[0.72rem] uppercase tracking-[0.22em] transition-colors hover:border-gold hover:text-gold">
            {BOTTLE.cta}
            <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>

        <motion.figure
          initial="hide"
          whileInView="show"
          viewport={{ once: true, margin: "-20%" }}
          // As a panorama panel the object has to fit the viewport height, so it
          // is sized by height there and by width in the stacked layout.
          className={`relative mx-auto aspect-[560/696] lg:col-span-7 lg:col-start-6 ${
            asPanel ? "h-[34svh] w-auto max-w-full lg:h-[min(78svh,760px)]" : "w-full max-w-[620px]"
          }`}
        >
          <div className="absolute inset-[8%] overflow-hidden rounded-[6px]">
            <Image src={BOTTLE.src} alt={BOTTLE.alt} fill sizes="(min-width:1024px) 560px, 90vw" className="object-cover" />
          </div>
          {PINS.map((p, idx) => {
            const s = BOTTLE.specs[p.k];
            const right = p.side === "r";
            return (
              <motion.div
                key={s.k}
                variants={{ hide: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.3 + idx * 0.12, duration: 0.6 } } }}
                className="absolute flex items-center"
                style={{ left: `${p.x}%`, top: `${p.y}%`, flexDirection: right ? "row" : "row-reverse", transform: `translate(${right ? "0" : "-100%"}, -50%)` }}
              >
                <span className="h-2 w-2 shrink-0 rounded-full border border-gold bg-night" />
                <motion.span
                  variants={{ hide: { scaleX: 0 }, show: { scaleX: 1, transition: { delay: 0.4 + idx * 0.12, duration: 0.7, ease: EASE } } }}
                  className="h-px w-[clamp(2rem,6vw,5rem)] bg-cream/40"
                  style={{ transformOrigin: right ? "left" : "right" }}
                />
                <span className="hidden whitespace-nowrap rounded-full border border-cream/20 bg-night/70 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.18em] backdrop-blur-md sm:inline-block">
                  <span className="text-cream/55">{s.k}</span> <span className="ml-1 text-cream">{s.v}</span>
                </span>
              </motion.div>
            );
          })}
        </motion.figure>

        {/* the register stays legible on phones, where the pins drop their labels */}
        <dl className="grid grid-cols-2 gap-x-6 sm:hidden">
          {BOTTLE.specs.map((s) => (
            <div key={s.k} className="border-t border-cream/15 py-3">
              <dt className="text-[0.58rem] uppercase tracking-[0.22em] text-cream/55">{s.k}</dt>
              <dd className="mt-1 text-[0.72rem] uppercase tracking-[0.12em]">{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Wrap>
  );
}
