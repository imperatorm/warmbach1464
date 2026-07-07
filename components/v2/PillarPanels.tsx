"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { pillars, type Pillar } from "@/lib/content";
import { Monogram } from "@/components/ui/Monogram";
import { GooFilter } from "@/components/ui/GooFilter";

// One full-bleed frame per pillar.
const FRAMES: Record<string, { src: string; alt: string }> = {
  zeit: { src: "/gallery/warmbach/img_0059.jpg", alt: "Der Hof in der Winterdämmerung" },
  boden: { src: "/gallery/warmbach/img_0024.jpg", alt: "Wiese und Wilder Kaiser hinter dem Hof" },
  baeume: { src: "/gallery/warmbach/img_0030.jpg", alt: "Der Osthang mit dem Hof über Kitzbühel" },
  manufaktur: { src: "/gallery/warmbach/img_0080.jpg", alt: "Die kupferne Kothe-Brennblase" },
  flasche: { src: "/flasche/shot-front.jpg", alt: "Die Warmbach-Flasche" },
};

const N = pillars.length;
/** Scroll fraction each media wipe occupies (half of a slide's runway). */
const WIPE = 0.5 / N;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Die Säulen — Floema's collections-cta mechanic: ONE pinned viewport with a
 * long scroll runway. Media slides wipe in with a scroll-scrubbed clip; a
 * full-width hairline fills left→right with section progress; every element
 * is anchored to the line, so positions never shift with the title's line
 * count (title lives in a fixed slot and grows downward only).
 */
export function PillarPanels() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  // Content switches mid-wipe, like the reference.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    let i = 0;
    for (let k = 1; k < N; k++) if (v >= k / N - WIPE / 2) i = k;
    if (i !== active) setActive(i);
  });

  const progressW = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const pillar = pillars[active];
  const no = String(active + 1).padStart(2, "0");

  return (
    <section ref={ref} aria-label="Die Säulen" className="relative h-[650vh] bg-night">
      <GooFilter id="cta-goo" blur={6} />
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Media stack — each slide wipes up over the previous one */}
        {pillars.map((pl, i) => (
          <SlideMedia key={pl.slug} slug={pl.slug} index={i} progress={scrollYProgress} />
        ))}

        {/* Line wrapper — full-width hairline; number + chip ride ABOVE it,
            the claim below. Everything here is anchored, never reflows. */}
        <div className="absolute inset-x-0 top-[26%] z-10 lg:top-[40%]">
          <div className="mb-4 flex items-end px-6 sm:px-10 lg:px-0">
            {/* Rolling folio number — left column, fixed width */}
            <div className="relative h-[1.35em] w-16 shrink-0 overflow-hidden lg:w-[27%] lg:pl-10">
              <AnimatePresence initial={false}>
                <motion.p
                  key={no}
                  initial={reduce ? { opacity: 0 } : { y: "115%", scaleY: 1.5, opacity: 0 }}
                  animate={{ y: "0%", scaleY: 1, opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { y: "-115%", scaleY: 1.5, opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="absolute inset-x-0 top-0 origin-top text-sm tracking-[0.08em] text-cream/90 lg:pl-10"
                >
                  {no}
                </motion.p>
              </AnimatePresence>
            </div>
            {/* Category tag — pill background scales open from the left */}
            <div className="relative h-9">
              <AnimatePresence initial={false}>
                <motion.span
                  key={pillar.slug}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="absolute left-0 top-0 inline-flex origin-left items-center gap-2.5 whitespace-nowrap rounded-full bg-kalk/95 py-2 pl-3.5 pr-5 text-sm font-medium text-night"
                >
                  <motion.span
                    initial={reduce ? undefined : { opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.18 }}
                    className="inline-flex items-center gap-2.5"
                  >
                    <Monogram className="h-3.5 w-auto text-night" />
                    {pillar.name}
                  </motion.span>
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* The line — full screen width, progress fills with the scroll */}
          <div className="relative h-px w-full bg-cream/25">
            <motion.span style={{ width: progressW }} className="absolute inset-y-0 left-0 bg-cream" />
          </div>

          <p className="mt-3 px-6 text-sm text-cream/75 sm:px-10 lg:px-10">Seit Anno 1464</p>
        </div>

        {/* Statement + CTA — anchored below the line; the title has a fixed
            slot so the CTA never moves when the tagline wraps differently */}
        <div className="absolute left-6 right-6 top-[calc(26%+5.2rem)] z-10 sm:left-10 sm:right-10 lg:left-[27%] lg:right-20 lg:top-[calc(40%+4.6rem)]">
          <AnimatePresence initial={false}>
            <SlideContent key={pillar.slug} pillar={pillar} reduce={!!reduce} />
          </AnimatePresence>
        </div>

        {/* Scroll cue */}
        <div className="absolute inset-x-0 bottom-6 z-10 text-center">
          <span className="inline-flex items-center gap-1.5 text-[0.78rem] text-cream/85">
            Weiter entdecken
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
    </section>
  );
}

/** One stacked media layer; slides &gt; 0 wipe in bottom-up via scroll-scrubbed clip. */
function SlideMedia({ slug, index, progress }: { slug: string; index: number; progress: MotionValue<number> }) {
  const frame = FRAMES[slug];
  // Wipe window: the last WIPE of the previous slide's runway.
  const start = Math.max(0, index / N - WIPE);
  const end = Math.max(0.0001, index / N);
  const reveal = useTransform(progress, [start, end], [100, 0], { clamp: true });
  const clip = useMotionTemplate`inset(${reveal}% 0% 0% 0%)`;
  // Slight counter-drift inside the clip, like Floema's media-inner.
  const innerY = useTransform(reveal, [100, 0], ["-8%", "0%"]);

  const first = index === 0;
  return (
    <motion.div style={first ? undefined : { clipPath: clip }} className="absolute inset-0">
      <motion.div style={first ? undefined : { y: innerY }} className="absolute inset-0">
        <Image src={frame.src} alt={frame.alt} fill className="object-cover" sizes="100vw" quality={82} />
      </motion.div>
      <div className="absolute inset-0 bg-night/25" />
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-night/70 to-transparent" />
    </motion.div>
  );
}

/** Statement words stagger up; the gooey CTA (circle + pill) rises last. */
function SlideContent({ pillar, reduce }: { pillar: Pillar; reduce: boolean }) {
  const words = pillar.tagline.split(" ");

  const container = {
    hide: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.045, delayChildren: reduce ? 0 : 0.12 } },
  };
  const rise = {
    hide: reduce ? { opacity: 0 } : { opacity: 0, y: "35%" },
    show: { opacity: 1, y: "0%", transition: { duration: reduce ? 0.2 : 0.8, ease: EASE } },
  };

  return (
    <motion.div
      variants={container}
      initial="hide"
      animate="show"
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      className="absolute inset-x-0 top-0"
    >
      {/* Fixed slot: up to ~4 lines on mobile, ~2.5 on desktop; grows downward only */}
      <h3 className="flex h-[4.6em] items-start font-body text-[clamp(1.9rem,4.6vw,3.9rem)] font-medium leading-[1.08] tracking-[-0.01em] text-cream [text-shadow:0_2px_28px_rgba(0,0,0,0.35)] lg:h-[2.6em]">
        <span className="sr-only">{pillar.tagline}</span>
        <span aria-hidden className="flex flex-wrap gap-x-[0.26em]">
          {words.map((w, i) => (
            <span key={`${w}-${i}`} className="-mb-[0.08em] inline-block overflow-hidden pb-[0.08em]">
              <motion.span variants={rise} className="inline-block">
                {w}
              </motion.span>
            </span>
          ))}
        </span>
      </h3>

      {/* Gooey special button — circle + label pill; on hover the pill flows
          into the circle and they merge into one capsule (Floema's bridge) */}
      <motion.div variants={rise} className="mt-8">
        <Link
          href={`/${pillar.slug}`}
          data-cursor
          aria-label={`Säule ${pillar.name} entdecken`}
          className="group inline-flex items-center"
        >
          <span className="inline-flex items-center" style={{ filter: "url(#cta-goo)" }}>
            <span className="relative grid h-12 w-12 shrink-0 place-items-center">
              <span aria-hidden className="absolute inset-0 rounded-full bg-cream" />
              <Monogram className="relative h-4 w-auto text-night transition-transform duration-500 ease-deep group-hover:rotate-[8deg]" />
            </span>
            <span className="relative ml-2.5 transition-[margin] duration-500 ease-deep group-hover:-ml-1.5">
              <span aria-hidden className="absolute inset-0 rounded-full bg-cream" />
              <span className="relative block px-7 py-[0.95rem] text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-night">
                Säule entdecken
              </span>
            </span>
          </span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
