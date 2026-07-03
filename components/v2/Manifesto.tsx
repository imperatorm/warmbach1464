"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion, animate } from "framer-motion";
import { ChapterHead } from "./ChapterHead";
import { Reveal } from "@/components/ui/Reveal";

const LINES = ["Wir haben nichts", "erfunden. Wir haben es", "nur wiedergefunden."];

const STATS = [
  { value: 562, label: "Jahre, urkundlich verbürgt" },
  { value: 47, label: "Bäume am Osthang" },
  { value: 7, label: "°C Quellwasser, ganzjährig" },
  { value: 36, label: "Monate Reife, mindestens" },
];

/** One masked manifesto line — rises out of its own overflow crop. */
function Line({ children, delay }: { children: string; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
      <motion.span
        className="block"
        initial={reduce ? false : { y: "112%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "0px 0px -14% 0px" }}
        transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Counts from 0 to `value` once the number scrolls into view. */
function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return <span ref={ref}>{n}</span>;
}

/**
 * Chapter 01 — the manifesto spread: a small captioned image in the left
 * column (the editorial "specimen"), the big serif statement rising line
 * by line on the right, and a counting fact row underneath.
 */
export function Manifesto() {
  return (
    <section className="bg-kalk px-6 py-24 text-night lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1500px]">
        <ChapterHead no="01" title="Manifest" aside="Warmbachhof · Kitzbühel" />

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
          {/* Specimen column — small image, tight caption, like a pinned print */}
          <Reveal className="order-2 lg:order-1 lg:col-span-4 lg:self-end">
            <div className="max-w-[340px]">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/gallery/warmbach/img_0041.jpg"
                  alt="Geschnitzte Balkone des Warmbachhofs im Morgenlicht"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 340px, 80vw"
                />
              </div>
              <div className="mt-4 border-t border-copper/30 pt-3">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-terrakotta">Der Wiederaufbau</p>
                <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-night/70">
                  Nach Brixentaler Bauernhof-Vorbild wiederaufgebaut — Holzbau Obermoser, Aurach. Jeder Balken
                  eine Entscheidung für die nächsten hundert Jahre.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Statement column */}
          <div className="order-1 lg:order-2 lg:col-span-7 lg:col-start-6">
            <Reveal>
              <p className="mb-8 font-display text-lg italic text-copper">From our Soil to your Soul.</p>
            </Reveal>
            <h3 className="t-h1 text-night">
              {LINES.map((l, i) => (
                <Line key={l} delay={0.1 + i * 0.12}>
                  {l}
                </Line>
              ))}
            </h3>
            <Reveal delay={0.2}>
              <p className="mt-10 max-w-xl text-base leading-relaxed text-night/70 lg:text-lg">
                1464 ist der Grund, warum es diese Marke gibt. Sechsundzwanzig Generationen. Eine Quelle.
                Ein Osthang. Wie beim Wein entscheidet der Boden — worauf die Bäume stehen, schmeckt man später.
              </p>
            </Reveal>

            {/* Fact row — numbers count up as they enter the sheet */}
            <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-copper/25 pt-8 sm:grid-cols-4">
              {STATS.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.06}>
                  <p className="font-display text-4xl text-night lg:text-5xl">
                    <CountUp value={s.value} />
                  </p>
                  <p className="mt-2 text-[0.65rem] uppercase tracking-[0.18em] text-copper">{s.label}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
