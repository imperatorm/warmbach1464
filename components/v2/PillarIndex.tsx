"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { pillars, secondary } from "@/lib/content";
import { ChapterHead } from "./ChapterHead";
import { Reveal } from "@/components/ui/Reveal";

// One frame per pillar — the preview that trails the cursor over the index.
const PREVIEWS: Record<string, { src: string; alt: string }> = {
  zeit: { src: "/gallery/warmbach/img_0059.jpg", alt: "Der Hof in der Winterdämmerung" },
  boden: { src: "/gallery/warmbach/img_0024.jpg", alt: "Wiese und Wilder Kaiser hinter dem Hof" },
  baeume: { src: "/gallery/warmbach/img_0030.jpg", alt: "Der Osthang mit dem Hof über Kitzbühel" },
  manufaktur: { src: "/gallery/warmbach/img_0080.jpg", alt: "Die kupferne Kothe-Brennblase" },
  flasche: { src: "/flasche/shot-front.jpg", alt: "Die Warmbach-Flasche" },
};

/**
 * Chapter 03 — the pillar index as an editorial table of contents:
 * five numbered rows; on fine pointers a photographic preview trails
 * the cursor and crossfades per row (the awwwards index pattern).
 */
export function PillarIndex() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.6 });
  const y = useSpring(my, { stiffness: 260, damping: 28, mass: 0.6 });

  const onMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <section className="bg-cream px-6 pb-24 pt-4 text-night lg:px-10 lg:pb-36">
      <div ref={sectionRef} onMouseMove={onMove} className="relative mx-auto max-w-[1500px]">
        <ChapterHead no="03" title="Die Säulen" aside="Fünf Kapitel — ein Hof" />

        {/* Cursor-trailing preview — fine pointers only */}
        {!reduce && (
          <motion.div
            style={{ x, y }}
            className={`pointer-events-none absolute left-0 top-0 z-20 hidden w-[240px] -translate-x-[15%] -translate-y-[110%] overflow-hidden shadow-[0_24px_80px_rgba(29,41,29,0.35)] transition-opacity duration-300 lg:block ${
              active ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden
          >
            <div className="relative aspect-[3/4]">
              {Object.entries(PREVIEWS).map(([slug, p]) => (
                <Image
                  key={slug}
                  src={p.src}
                  alt=""
                  fill
                  className={`object-cover transition-opacity duration-500 ${active === slug ? "opacity-100" : "opacity-0"}`}
                  sizes="240px"
                />
              ))}
            </div>
          </motion.div>
        )}

        <nav aria-label="Die Säulen" className="border-t border-copper/25">
          {pillars.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <Link
                href={`/${p.slug}`}
                data-cursor
                onMouseEnter={() => setActive(p.slug)}
                onMouseLeave={() => setActive(null)}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 border-b border-copper/20 py-7 lg:grid-cols-[4rem_1fr_16rem_auto] lg:gap-8 lg:py-9"
              >
                <span className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-copper transition-colors duration-500 group-hover:text-terrakotta">
                  {p.no}
                </span>
                <span className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  <span className="font-display text-3xl leading-none text-night transition-all duration-500 group-hover:translate-x-2 group-hover:text-terrakotta sm:text-4xl lg:text-5xl">
                    {p.name}
                  </span>
                </span>
                <span className="hidden text-sm italic leading-snug text-copper/80 lg:block">{p.tagline}</span>
                <span
                  aria-hidden
                  className="self-center text-xl text-copper transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-terrakotta"
                >
                  &rarr;
                </span>
              </Link>
            </Reveal>
          ))}
        </nav>

        {/* Quiet secondary row */}
        <Reveal>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            {secondary.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                data-cursor
                className="link-underline text-xs uppercase tracking-[0.18em] text-copper transition-colors hover:text-night"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
