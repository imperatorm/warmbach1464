"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { chronicle } from "@/lib/timeline";
import { Reveal } from "@/components/ui/Reveal";

// The chronicle's own image paths (/images/1464.jpg …) were never shipped —
// these are the estate photographs that exist, cycled so every entry carries
// a face. The final entry gets the bottle: the chronicle's actual endpoint.
const PHOTOS = [
  "/gallery/warmbach/img_0059.jpg",
  "/gallery/warmbach/img_0027.jpg",
  "/gallery/warmbach/img_0041.jpg",
  "/gallery/warmbach/img_0024.jpg",
  "/gallery/warmbach/img_0096.jpg",
  "/gallery/warmbach/img_0030.jpg",
  "/gallery/warmbach/img_0046.jpg",
  "/gallery/warmbach/img_0067.jpg",
  "/gallery/warmbach/img_0075.jpg",
  "/gallery/warmbach/img_0086.jpg",
  "/gallery/warmbach/img_0101.jpg",
];
const photoFor = (i: number) =>
  i === chronicle.length - 1 ? "/flasche/shot-front.jpg" : PHOTOS[i % PHOTOS.length];

const CARD_W = 260; // px — must match w-[260px] on the card
const GAP = 24; // px — must match gap-6 on the track

/** One entry, identical in both the rail and the stacked fallback. */
function EntryCard({ i, active }: { i: number; active: boolean }) {
  const e = chronicle[i];
  return (
    <article
      className={`flex h-full w-[260px] shrink-0 flex-col transition-opacity duration-500 ${
        active ? "opacity-100" : "opacity-55"
      }`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={photoFor(i)}
          alt=""
          fill
          className="object-cover"
          sizes="260px"
        />
        <span className="absolute left-3 top-3 bg-night/70 px-2 py-1 text-[0.55rem] uppercase tracking-[0.22em] text-cream backdrop-blur-sm">
          {String(i + 1).padStart(2, "0")} / {chronicle.length}
        </span>
      </div>
      <p className="mt-4 font-body text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-terrakotta">
        {e.year}
      </p>
      <h3 className="mt-2 text-lg font-medium text-night">{e.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-night/70">{e.detail}</p>
    </article>
  );
}

/**
 * Hofchronik — 562 years as a pinned horizontal rail: the section holds
 * still while the twenty-two entries travel sideways, the year behind them
 * counting up at poster scale and a tick rail marking the position. Below
 * lg, and whenever motion is reduced, it degrades to a plain vertical
 * reading list — same content, no pinning.
 */
export function ChronicleRail() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [rail, setRail] = useState(false); // lg+ and motion allowed → pinned rail
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  // Travel lives in a ref, not state: the scroll handler reads the current
  // value without re-subscribing, and x is driven directly rather than through
  // a useTransform whose output range would have to be rebuilt on measure.
  const travel = useRef(0);
  const x = useMotionValue(0);

  const { scrollY } = useScroll();

  // Progress is read from the live rect on every tick rather than from
  // useScroll's cached element offsets: images and the deferred 3D canvas
  // above this section change the document height after mount, and a cached
  // measurement leaves the rail starting and ending mid-chronicle.
  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const range = rect.height - window.innerHeight;
    const p = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0;
    x.set(-p * travel.current);
    setActive(Math.round(p * (chronicle.length - 1)));
  }, [x]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      setRail(mq.matches && !reduce);
      const trackW =
        trackRef.current?.scrollWidth ??
        chronicle.length * CARD_W + (chronicle.length - 1) * GAP;
      travel.current = Math.max(0, trackW - window.innerWidth + 120);
      update();
    };
    measure();
    // The track only exists once `rail` flips on, so measure again after it.
    const raf = requestAnimationFrame(measure);
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, [reduce, rail, update]);

  useMotionValueEvent(scrollY, "change", () => {
    if (rail) update();
  });

  const header = (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-terrakotta">
          ( 05 ) Hofchronik
        </p>
        <h2 className="t-hero mt-4 max-w-[16ch] text-[clamp(1.9rem,4vw,3.2rem)] text-night">
          562 Jahre, <span className="t-accent">urkundlich verbürgt</span>
        </h2>
      </div>
      <p className="max-w-xs text-sm leading-relaxed text-night/75">
        Jeder Eintrag steht so im Kitzbüheler Salbuch — vom ersten Vermerk 1464 bis zum
        ersten eigenen Brand.
      </p>
    </div>
  );

  // — Stacked fallback: mobile and reduced motion —
  if (!rail) {
    return (
      <section className="border-t border-night/15 bg-kalk px-6 py-24 text-night lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          {header}
          <ol className="mt-16 grid grid-cols-1 gap-14 sm:grid-cols-2">
            {chronicle.map((_, i) => (
              <li key={chronicle[i].year + i}>
                <Reveal delay={(i % 2) * 0.06}>
                  <EntryCard i={i} active />
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  // — Pinned rail —
  // The section height is static (h-[650svh]) so useScroll measures the pin
  // range on its first pass. A height applied later from state leaves framer
  // holding a stale box, and the rail then starts and ends mid-chronicle.
  return (
    <section
      ref={ref}
      className="relative h-[650svh] border-t border-night/15 bg-kalk text-night"
      aria-label="Hofchronik — 562 Jahre"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* The year, counting up behind everything */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={chronicle[active].year}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="t-poster select-none text-[26vw] leading-none text-night/[0.07]"
            >
              {chronicle[active].year}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="relative px-6 pt-16 lg:px-10">{header}</div>

        {/* The travelling track */}
        <div className="relative flex flex-1 items-center overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x }}
            data-chronicle-track
            className="flex gap-6 px-6 will-change-transform lg:px-10"
          >
            {chronicle.map((_, i) => (
              <EntryCard key={chronicle[i].year + i} i={i} active={i === active} />
            ))}
          </motion.div>
        </div>

        {/* Tick rail */}
        <div className="relative px-6 pb-10 lg:px-10">
          <div className="flex items-end gap-[3px]">
            {chronicle.map((e, i) => (
              <span
                key={e.year + i}
                className={`flex-1 transition-all duration-300 ${
                  i === active ? "h-5 bg-copper" : i < active ? "h-2 bg-night/40" : "h-2 bg-night/15"
                }`}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[0.6rem] uppercase tracking-[0.24em] text-night/75">
            <span>1464 — Jörg Frey</span>
            <span className="text-terrakotta">
              {chronicle[active].year} · {chronicle[active].title}
            </span>
            <span>Heute — Der erste eigene Brand</span>
          </div>
        </div>
      </div>
    </section>
  );
}
