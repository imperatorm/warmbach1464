"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { BOTTLE, CRAFT } from "./content";

/**
 * B · "Gallery" (In Common With / Faculty Department) — each chapter is an
 * asymmetric spread on a quiet cream sheet: a small captioned plate, one large
 * plate drifting at a different scroll speed, and the text set low and offset.
 * The sides alternate, so the eye zig-zags down the page like a printed book.
 */
export function CraftGallery() {
  return (
    <section className="bg-cream px-6 py-24 text-night lg:px-10 lg:py-40">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid grid-cols-12 gap-6 border-b border-night/15 pb-10">
          <p className="col-span-12 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-terrakotta lg:col-span-3">{CRAFT.kicker}</p>
          <h2 className="t-hero col-span-12 text-[clamp(2rem,4.2vw,4rem)] leading-[1.06] lg:col-span-8 lg:col-start-5">{CRAFT.title}</h2>
        </div>
        {CRAFT.chapters.map((c, i) => (
          <Spread key={c.id} c={c} i={i} />
        ))}
      </div>
    </section>
  );
}

function Spread({ c, i }: { c: (typeof CRAFT.chapters)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yBig = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);
  const ySmall = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [140, -140]);
  const flip = i % 2 === 1;

  return (
    <div ref={ref} className="grid grid-cols-12 items-end gap-6 py-20 lg:py-32">
      <motion.figure style={{ y: ySmall }} className={`col-span-5 lg:col-span-2 ${flip ? "lg:order-3 lg:col-start-11" : ""}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image src={c.src} alt="" fill sizes="20vw" className="object-cover object-[30%_50%] grayscale-[35%]" />
        </div>
        <figcaption className="mt-3 text-[0.62rem] uppercase leading-relaxed tracking-[0.2em] text-night/55">
          {String(i + 1).padStart(2, "0")} / {c.fact}
        </figcaption>
      </motion.figure>

      <motion.div style={{ y: yBig }} className={`col-span-12 lg:col-span-6 ${flip ? "lg:col-start-4" : "lg:col-start-4"}`}>
        <div className="relative aspect-[4/5] overflow-hidden lg:aspect-[5/6]">
          <Image src={c.src} alt={c.alt} fill sizes="(min-width:1024px) 46vw, 92vw" className="object-cover" />
        </div>
      </motion.div>

      <Reveal className={`col-span-12 lg:col-span-3 ${flip ? "lg:order-first lg:col-start-1" : "lg:col-start-10"}`}>
        <p className="t-poster text-[clamp(3rem,6vw,6rem)] leading-none text-night/10">{String(i + 1).padStart(2, "0")}</p>
        <h3 className="t-hero mt-4 text-[clamp(1.5rem,2.2vw,2.1rem)]">{c.title}</h3>
        <p className="mt-5 font-display text-[1.05rem] leading-[1.6] text-night/75">{c.body}</p>
      </Reveal>
    </div>
  );
}

/**
 * B · "Object study" — the bottle as a still life with two detail plates and
 * the register set as a numbered index, all on one dark sheet; the main plate
 * zooms gently with scroll.
 */
export function BottleStudyGallery() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.12, 1]);

  return (
    <section ref={ref} className="bg-night px-6 py-24 text-cream lg:px-10 lg:py-40">
      <div className="mx-auto grid max-w-[1500px] grid-cols-12 gap-6">
        <Reveal className="col-span-12 lg:col-span-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold">{BOTTLE.kicker}</p>
          <h2 className="t-hero mt-5 text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.08]">
            {BOTTLE.title} <span className="t-accent text-gold">{BOTTLE.accent}</span>
          </h2>
        </Reveal>

        <div className="col-span-12 mt-10 grid grid-cols-12 gap-6 lg:mt-20">
          <div className="col-span-6 flex flex-col gap-6 lg:col-span-2">
            {BOTTLE.details.slice(0, 2).map((d, k) => (
              <figure key={d}>
                <div className="relative aspect-square overflow-hidden">
                  <Image src={d} alt="" fill sizes="16vw" className="object-cover" />
                </div>
                <figcaption className="mt-2 text-[0.58rem] uppercase tracking-[0.2em] text-cream/50">Detail {k + 1}</figcaption>
              </figure>
            ))}
          </div>

          <div className="relative col-span-12 aspect-[560/696] overflow-hidden lg:order-none lg:col-span-5">
            <motion.div style={{ scale }} className="absolute inset-0">
              <Image src={BOTTLE.src} alt={BOTTLE.alt} fill sizes="(min-width:1024px) 40vw, 92vw" className="object-cover" />
            </motion.div>
          </div>

          <div className="col-span-12 flex flex-col justify-between gap-12 lg:col-span-4 lg:col-start-9">
            <ol>
              {BOTTLE.specs.map((s, k) => (
                <li key={s.k} className="grid grid-cols-[2.5rem_1fr] items-baseline border-t border-cream/15 py-4 last:border-b">
                  <span className="text-[0.62rem] tabular-nums tracking-[0.2em] text-gold">{String(k + 1).padStart(2, "0")}</span>
                  <span className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-[0.62rem] uppercase tracking-[0.22em] text-cream/55">{s.k}</span>
                    <span className="font-display text-lg">{s.v}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div>
              <p className="font-display text-[1.05rem] leading-[1.6] text-cream/75">{BOTTLE.body}</p>
              <Link href="/flasche" data-cursor className="group mt-7 inline-flex items-center gap-3 rounded-full bg-cream py-1.5 pl-6 pr-1.5 text-sm font-medium uppercase text-night transition-colors hover:bg-gold">
                {BOTTLE.cta}
                <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-full bg-night text-cream transition-transform group-hover:translate-x-0.5">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
