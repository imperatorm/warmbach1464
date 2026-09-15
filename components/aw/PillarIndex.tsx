"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The botanical specimen a row carries under the cursor (Figma 53:115).
 * One drawing stands in for all five Säulen for now; each is getting its own.
 * Point a row at its own file when it arrives — nothing else needs to change,
 * because the reveal keys on the file rather than on the row (see below).
 */
const SPECIMEN = "/figma/saeulen-branch.png";

const PILLARS = [
  { slug: "zeit", word: "Zeit", note: "Der Hof, die Stadt, die Chronik", specimen: SPECIMEN, align: "left" },
  { slug: "boden", word: "Boden", note: "Tiefenschnitt, Geologie, Wasser", specimen: SPECIMEN, align: "right" },
  { slug: "baeume", word: "Bäume", note: "Der lebendige Baum, Früchte & Düfte", specimen: SPECIMEN, align: "center" },
  { slug: "manufaktur", word: "Manufaktur", note: "Das Kupfer, das Feuer", specimen: SPECIMEN, align: "left" },
  { slug: "flasche", word: "Flasche", note: "Tradition, Hand, Siegel", specimen: SPECIMEN, align: "right" },
] as const;

/** Distinct drawings to warm — one today, five once each Säule has its own. */
const SPECIMENS = Array.from(new Set(PILLARS.map((p) => p.specimen)));

/**
 * The index is staggered, not stacked: rows sit left / right / centre / left /
 * right down the sheet (Figma 26:5953). Only from `lg` — below that the words
 * already fill the measure, so the offsets would read as ragged rather than
 * composed, and every row runs flush left.
 */
const ALIGN = {
  left: "justify-start text-left",
  right: "lg:justify-end lg:text-right",
  center: "lg:justify-center lg:text-center",
} as const;

/** The row's door mark — same stroke and weight as the arrow on the Flasche band. */
function ChevronRight() {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      className="h-3.5 w-3.5"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M4.98 11.12 9.48 6.62 4.98 2.12" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

/**
 * Die Säulen — five giant words, each the door to its chapter. Addressing a
 * row floats its botanical specimen under the cursor (spring-trailed, tilted)
 * while the other four recede.
 *
 * The reveal keys on the drawing, not the row: while every Säule shares the
 * one specimen, moving between rows carries it rather than re-drawing it, and
 * once each row has its own the same key makes every drawing animate in on
 * arrival. No change needed here when the other four land.
 *
 * Pointer-only — on touch and under prefers-reduced-motion the words stand
 * alone and stay fully legible.
 */
export function PillarIndex() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const [fine, setFine] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 190, damping: 24, mass: 0.55 });
  const y = useSpring(my, { stiffness: 190, damping: 24, mass: 0.55 });

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const hoverEnabled = fine && !reduce;

  useEffect(() => {
    if (!hoverEnabled) return;
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mx.set(e.clientX - r.left);
      my.set(e.clientY - r.top);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [hoverEnabled, mx, my]);

  const current = PILLARS.find((p) => p.slug === active);

  return (
    <section
      ref={sectionRef}
      onMouseLeave={() => setActive(null)}
      className="relative overflow-hidden bg-cream px-6 py-24 text-night lg:px-10 lg:py-36"
    >
      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 border-b border-night/20 pb-5 lg:mb-20">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-terrakotta">
              ( 02 ) Die Säulen
            </p>
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-terrakotta">
              Fünf Kapitel — Klick öffnet die Säule
            </p>
          </div>
        </Reveal>

        <ul className="relative z-10">
          {PILLARS.map((p, i) => {
            const dim = active !== null && active !== p.slug;
            return (
              <li key={p.slug}>
                <Reveal delay={i * 0.05} y={30}>
                  <Link
                    href={`/${p.slug}`}
                    data-cursor
                    onMouseEnter={() => hoverEnabled && setActive(p.slug)}
                    onFocus={() => setActive(p.slug)}
                    onBlur={() => setActive(null)}
                    aria-label={`Säule ${p.word} — ${p.note}`}
                    className={`group flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-night/12 py-3 transition-colors duration-500 lg:py-1 ${ALIGN[p.align]}`}
                  >
                    <span
                      className={`t-poster text-[clamp(2.8rem,11.5vw,9.5rem)] uppercase transition-[color,opacity] duration-500 ${
                        dim ? "text-night/25" : "text-night"
                      }`}
                    >
                      {p.word}
                    </span>
                    {/* The door, drawn only when the row is addressed: fades in
                        and travels right into the gap after the word. It holds
                        its own space at rest, so arriving on a row never shifts
                        the caption — and never absorbs the free space the row's
                        justification needs to stagger. */}
                    <span
                      aria-hidden
                      className="hidden h-12 w-12 shrink-0 -translate-x-3 self-center items-center justify-center rounded-full bg-night text-cream opacity-0 transition-[opacity,transform] duration-500 ease-deep group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 lg:inline-flex"
                    >
                      <ChevronRight />
                    </span>
                    <span
                      className={`text-[0.62rem] uppercase tracking-[0.2em] transition-opacity duration-500 ${
                        dim ? "text-terrakotta/65" : "text-terrakotta"
                      }`}
                    >
                      {p.note}
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal>
          <p className="mt-12 max-w-md text-sm leading-relaxed text-night/75">
            Fünf Säulen, ein Haus. Zeit, Boden, Bäume, Manufaktur und Flasche — die
            Kapitel, aus denen die Marke gebaut ist.
          </p>
        </Reveal>
      </div>

      {/* The specimen — trails the cursor, tilts as it is picked up. It has no
          frame or shadow: the cut-out sits directly on the sheet. */}
      {hoverEnabled && (
        <motion.div
          aria-hidden
          style={{ x, y }}
          className="pointer-events-none absolute left-0 top-0 z-20"
        >
          <AnimatePresence>
            {current && (
              <motion.div
                key={current.specimen}
                initial={{ opacity: 0, scale: 0.88, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: 2.3 }}
                exit={{ opacity: 0, scale: 0.92, rotate: 6 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative -translate-x-1/2 -translate-y-1/2"
              >
                <Image
                  src={current.specimen}
                  alt=""
                  width={280}
                  height={431}
                  className="h-auto w-[220px] select-none lg:w-[280px]"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Warm the drawings at the size the hover actually renders, so the first
          pick-up never flashes. Same width prop ⇒ same optimized source. */}
      {hoverEnabled &&
        SPECIMENS.map((src) => (
          <Image
            key={src}
            src={src}
            alt=""
            width={280}
            height={431}
            aria-hidden
            className="pointer-events-none absolute h-px w-px opacity-0"
          />
        ))}
    </section>
  );
}
