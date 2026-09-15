"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

const PILLARS = [
  { slug: "zeit", word: "Zeit", note: "Der Hof, die Stadt, die Chronik", align: "left" },
  { slug: "boden", word: "Boden", note: "Tiefenschnitt, Geologie, Wasser", align: "right" },
  { slug: "baeume", word: "Bäume", note: "Der lebendige Baum, Früchte & Düfte", align: "center" },
  { slug: "manufaktur", word: "Manufaktur", note: "Das Kupfer, das Feuer", align: "left" },
  { slug: "flasche", word: "Flasche", note: "Tradition, Hand, Siegel", align: "right" },
] as const;

/** The botanical specimen the index carries under the cursor (Figma 53:115). */
const SPECIMEN = "/figma/saeulen-branch.png";

const ALIGN = {
  left: "text-left justify-start",
  right: "text-right justify-end",
  center: "text-center justify-center",
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
 * row floats the botanical specimen under the cursor (spring-trailed, tilted)
 * while the other four recede. The specimen is picked up once on entering the
 * index and carried across the rows rather than re-drawn per row, so moving
 * down the list reads as one branch travelling with the hand.
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
                    <span
                      className={`text-[0.62rem] uppercase tracking-[0.2em] transition-opacity duration-500 ${
                        dim ? "text-terrakotta/65" : "text-terrakotta"
                      }`}
                    >
                      {p.note}
                    </span>
                    {/* The door, drawn only when the row is addressed: fades up
                        from the left and settles on the row's right edge. */}
                    <span
                      aria-hidden
                      className="ml-auto hidden h-12 w-12 shrink-0 -translate-x-3 self-center items-center justify-center rounded-full bg-night text-cream opacity-0 transition-[opacity,transform] duration-500 ease-deep group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 lg:inline-flex"
                    >
                      <ChevronRight />
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
                initial={{ opacity: 0, scale: 0.88, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: 2.3 }}
                exit={{ opacity: 0, scale: 0.92, rotate: 6 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative -translate-x-1/2 -translate-y-1/2"
              >
                <Image
                  src={SPECIMEN}
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

      {/* Warm the specimen at the size the hover actually renders, so the first
          pick-up never flashes. Same width prop ⇒ same optimized source. */}
      {hoverEnabled && (
        <Image
          src={SPECIMEN}
          alt=""
          width={280}
          height={431}
          aria-hidden
          className="pointer-events-none absolute h-px w-px opacity-0"
        />
      )}
    </section>
  );
}
