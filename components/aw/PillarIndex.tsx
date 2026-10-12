"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The drawing each row carries under the cursor (Figma 53:115). Each Säule
 * owns its own: the hourglass, the soil in hand, the apple tree, the copper
 * still, and the fruiting branch. Files are trimmed WebP cut-outs exported at
 * twice the hover size (public/saeulen); `w`/`h` are the CSS size each one
 * renders at, fitted inside a 280 × 340 box so a tall drawing and a wide one
 * read at the same weight.
 */
const SPECIMEN = {
  zeit: { src: "/saeulen/zeit.webp", w: 220, h: 340 },
  boden: { src: "/saeulen/boden.webp", w: 275, h: 340 },
  baeume: { src: "/saeulen/baeume.webp", w: 280, h: 308 },
  manufaktur: { src: "/saeulen/manufaktur.webp", w: 228, h: 340 },
  flasche: { src: "/saeulen/flasche.webp", w: 221, h: 340 },
} as const;

const PILLARS = [
  { slug: "zeit", word: "Zeit", note: "Der Hof, die Stadt, die Chronik", specimen: SPECIMEN.zeit, align: "left" },
  { slug: "boden", word: "Boden", note: "Tiefenschnitt, Geologie, Wasser", specimen: SPECIMEN.boden, align: "right" },
  { slug: "baeume", word: "Bäume", note: "Der lebendige Baum, Früchte & Düfte", specimen: SPECIMEN.baeume, align: "center" },
  { slug: "manufaktur", word: "Manufaktur", note: "Das Kupfer, das Feuer", specimen: SPECIMEN.manufaktur, align: "left" },
  { slug: "flasche", word: "Flasche", note: "Tradition, Hand, Siegel", specimen: SPECIMEN.flasche, align: "right" },
] as const;

/** Every drawing, to warm before the first hover. */
const SPECIMENS = Object.values(SPECIMEN);

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
 * row floats its own drawing under the cursor (spring-trailed, tilted) while
 * the other four recede.
 *
 * The reveal keys on the drawing's file, so moving from one row to the next
 * lets the old drawing tip away as the new one is picked up.
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

  // The drawing lives in the viewport, not in the section: it is portalled to
  // <body> and fixed, and its spring follows the pointer's client position
  // everywhere, all the time. So scrolling never moves it, and by the time a
  // row is picked up the spring is already resting under the pointer — there
  // is no stale position to correct and nothing ever has to snap.
  const tracking = useRef(false);
  useEffect(() => {
    if (!hoverEnabled) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (!tracking.current) {
        // The very first reading: start the spring where the pointer is.
        tracking.current = true;
        x.jump(e.clientX);
        y.jump(e.clientY);
      }
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [hoverEnabled, mx, my, x, y]);

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
      {hoverEnabled &&
        createPortal(
          <motion.div
            aria-hidden
            style={{ x, y }}
            className="pointer-events-none fixed left-0 top-0 z-30"
          >
            <AnimatePresence>
              {current && (
                <motion.div
                  key={current.specimen.src}
                  initial={{ opacity: 0, scale: 0.88, rotate: -6 }}
                  animate={{ opacity: 1, scale: 1, rotate: 2.3 }}
                  exit={{ opacity: 0, scale: 0.92, rotate: 6 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  // Every drawing sits on the same anchor (absolute), so the
                  // one arriving and the one tipping away overlap. As block
                  // children they stacked: the new drawing was laid out under
                  // the exiting one and popped up when that one unmounted.
                  // Centring goes through motion's transform, because its
                  // scale/rotate overwrite a Tailwind translate class.
                  style={{ x: "-50%", y: "-50%" }}
                  className="absolute left-0 top-0"
                >
                  <Image
                    src={current.specimen.src}
                    alt=""
                    width={current.specimen.w}
                    height={current.specimen.h}
                    style={{ width: current.specimen.w, height: current.specimen.h }}
                    className="max-w-none select-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>,
          document.body,
        )}

      {/* Warm the drawings at the size the hover actually renders, so the first
          pick-up never flashes. Same width prop ⇒ same optimized source. */}
      {hoverEnabled &&
        SPECIMENS.map((sp) => (
          <Image
            key={sp.src}
            src={sp.src}
            alt=""
            width={sp.w}
            height={sp.h}
            // Eager: a lazy 1px image parked off-screen never enters the
            // viewport, so it would never load and the warm-up would be a no-op.
            loading="eager"
            aria-hidden
            className="pointer-events-none absolute h-px w-px opacity-0"
          />
        ))}
    </section>
  );
}
