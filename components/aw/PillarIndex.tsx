"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

/** One photograph per Säule — the image the header is about. */
const PILLARS = [
  { slug: "zeit", word: "Zeit", note: "Der Hof, die Stadt, die Chronik", src: "/gallery/warmbach/img_0059.jpg", alt: "Der Warmbachhof in der Winterdämmerung", align: "left" },
  { slug: "boden", word: "Boden", note: "Tiefenschnitt, Geologie, Wasser", src: "/gallery/warmbach/img_0024.jpg", alt: "Wiese und Wilder Kaiser hinter dem Hof", align: "right" },
  { slug: "baeume", word: "Bäume", note: "Der lebendige Baum, Früchte & Düfte", src: "/gallery/warmbach/img_0030.jpg", alt: "Der Osthang mit Hof und Wald über Kitzbühel", align: "center" },
  { slug: "manufaktur", word: "Manufaktur", note: "Das Kupfer, das Feuer", src: "/gallery/warmbach/img_0080.jpg", alt: "Die kupferne Kothe-Brennblase mit der Prägung 1464", align: "left" },
  { slug: "flasche", word: "Flasche", note: "Tradition, Hand, Siegel", src: "/flasche/shot-front.jpg", alt: "Die Warmbach-Flasche vor dunklem Grund", align: "right" },
] as const;

const ALIGN = {
  left: "text-left justify-start",
  right: "text-right justify-end",
  center: "text-center justify-center",
} as const;

/**
 * Die Säulen — five giant words, each the door to its chapter. Hovering a
 * word floats its photograph under the cursor (spring-trailed, tilted) while
 * the other four recede: the index reads as type, and the image answers what
 * the word means. Pointer-only — on touch and under prefers-reduced-motion
 * the words stand alone and stay fully legible.
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
                      className={`t-poster text-[clamp(2.8rem,11.5vw,9.5rem)] transition-[color,opacity] duration-500 ${
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

      {/* The floating specimen — trails the cursor, tilts as it appears */}
      {hoverEnabled && (
        <motion.div
          aria-hidden
          style={{ x, y }}
          className="pointer-events-none absolute left-0 top-0 z-20"
        >
          <AnimatePresence>
            {current && (
              <motion.div
                key={current.slug}
                initial={{ opacity: 0, scale: 0.88, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                exit={{ opacity: 0, scale: 0.92, rotate: 2 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative -translate-x-1/2 -translate-y-1/2"
              >
                <div className="relative h-[280px] w-[210px] overflow-hidden shadow-[0_30px_80px_rgba(29,41,29,0.35)] lg:h-[340px] lg:w-[255px]">
                  <Image
                    src={current.src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="255px"
                  />
                </div>
                <span className="absolute -bottom-6 left-0 text-[0.55rem] uppercase tracking-[0.24em] text-terrakotta">
                  {current.alt}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Preload the specimens so the first hover never flashes */}
      <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
        {PILLARS.map((p) => (
          <Image key={p.slug} src={p.src} alt="" width={16} height={16} aria-hidden />
        ))}
      </div>
    </section>
  );
}
