"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { chronicle, chroniclePhoto } from "@/lib/timeline";
import { Reveal } from "@/components/ui/Reveal";

const FIRST = 1464;
const LAST = 2026;
/** The corridor's own length. 562 years at roughly 9px each. */
const TRACK = 5200;
const CARD_W = 236;
const LANE_GAP = 26;
const LANES = 3;

/** "Heute" closes the record in the present; every other entry is its year. */
function yearOf(raw: string): number {
  const n = Number.parseInt(raw, 10);
  return Number.isNaN(n) ? LAST : n;
}

type Placed = {
  i: number;
  year: number;
  label: string;
  x: number;
  lane: number;
};

/**
 * Lay the chronicle out along real time, then lift colliding entries into
 * their own lanes.
 *
 * This is the whole point of the corridor: an evenly spaced row of cards makes
 * 1464→1556 look the same as 1784→1786, when one is ninety-two years of
 * silence and the other is two. Positioning by year makes the empty stretches
 * physically empty — and the clusters, where the record suddenly gets busy,
 * visibly crowded. Entries that would overlap are stacked rather than pushed,
 * so nothing is moved off its own date.
 */
function place(): Placed[] {
  const laneEnds = new Array(LANES).fill(-Infinity);
  return chronicle.map((e, i) => {
    const year = yearOf(e.year);
    const x = ((year - FIRST) / (LAST - FIRST)) * TRACK;
    let lane = laneEnds.findIndex((end) => x >= end + LANE_GAP);
    if (lane === -1) {
      // Every lane is occupied here — take the one that frees up soonest.
      lane = laneEnds.indexOf(Math.min(...laneEnds));
    }
    laneEnds[lane] = x + CARD_W;
    return { i, year, label: e.year, x, lane };
  });
}

const CENTURIES = [1500, 1600, 1700, 1800, 1900, 2000];
const ROMAN: Record<number, string> = {
  1500: "XVI", 1600: "XVII", 1700: "XVIII", 1800: "XIX", 1900: "XX", 2000: "XXI",
};

export function TimeCorridor() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [rail, setRail] = useState(false);
  const [active, setActive] = useState(0);
  const travel = useRef(0);
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const placed = useMemo(() => place(), []);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const range = rect.height - window.innerHeight;
    const p = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0;
    const offset = -p * travel.current;
    x.set(offset);
    // The entry nearest the middle of the frame is the one being read.
    const centre = -offset + window.innerWidth / 2;
    let nearest = 0;
    let best = Infinity;
    for (const pl of placed) {
      const d = Math.abs(pl.x + CARD_W / 2 - centre);
      if (d < best) {
        best = d;
        nearest = pl.i;
      }
    }
    setActive((prev) => (prev === nearest ? prev : nearest));
  }, [x, placed]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      setRail(mq.matches && !reduce);
      // The track runs to TRACK + CARD_W, so the last entry needs its own
      // width of travel too or "Heute" never clears the right edge.
      travel.current = Math.max(0, TRACK + CARD_W - window.innerWidth + 80);
      update();
    };
    measure();
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

  const heading = (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <h2 className="t-hero max-w-[16ch] text-[clamp(1.9rem,4vw,3.2rem)] text-night">
        ( 02 ) 562 Jahre, <span className="t-accent">als Strecke</span>
      </h2>
      <p className="max-w-sm text-sm leading-relaxed text-night/75">
        Jeder Eintrag steht an seinem Jahr. Die Lücken zwischen ihnen sind echt — die
        langen Jahrzehnte, in denen der Hof einfach weiterlief, nehmen hier auch den Platz ein,
        den sie gedauert haben.
      </p>
    </div>
  );

  // — Stacked fallback: below lg, and under reduced motion —
  if (!rail) {
    return (
      <section
        className="bg-kalk px-6 py-24 text-night lg:px-10"
        aria-label="Die Chronik als Zeitstrahl, 1464 bis heute"
      >
        <div className="mx-auto max-w-[1500px]">
          {heading}
          <ol className="mt-16 flex flex-col gap-12">
            {chronicle.map((e, i) => (
              <li key={e.year + i}>
                <Reveal delay={(i % 3) * 0.05}>
                  <article className="grid grid-cols-[4.5rem_1fr] gap-5 border-t border-night/20 pt-5">
                    <span className="t-poster text-[1.2rem] leading-none tabular-nums text-terrakotta">
                      {e.year}
                    </span>
                    <div>
                      <h3 className="t-hero text-[1.25rem] text-night">{e.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-night/75">{e.detail}</p>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  const current = chronicle[active];

  // — The corridor. Static height so useScroll measures the pin range on its
  //   first pass; a height applied later from state leaves a stale box. —
  return (
    <section
      ref={ref}
      className="relative h-[500svh] bg-kalk text-night"
      aria-label="Die Chronik als Zeitstrahl, 1464 bis heute"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* The year standing behind the corridor */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.span
            key={current.year}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="t-poster select-none text-[26vw] leading-none tabular-nums text-night/[0.06]"
          >
            {current.year}
          </motion.span>
        </div>

        <div className="relative px-6 pt-16 lg:px-10">{heading}</div>

        {/* The travelling corridor */}
        <div className="relative flex-1 overflow-hidden">
          <motion.div style={{ x }} className="absolute inset-y-0 left-0 will-change-transform" >
            <div className="relative h-full" style={{ width: TRACK + CARD_W }}>
              {/* Century posts — the landmarks you pass */}
              {CENTURIES.map((c) => {
                const cx = ((c - FIRST) / (LAST - FIRST)) * TRACK;
                return (
                  <div
                    key={c}
                    aria-hidden
                    className="absolute inset-y-0 border-l border-night/15"
                    style={{ left: cx }}
                  >
                    <span className="absolute top-6 left-3 text-[0.55rem] uppercase tracking-[0.24em] text-night/70">
                      {c}. — {ROMAN[c]}
                    </span>
                  </div>
                );
              })}

              {placed.map((pl) => {
                const e = chronicle[pl.i];
                const isActive = pl.i === active;
                return (
                  <article
                    key={e.year + pl.i}
                    aria-current={isActive ? "true" : undefined}
                    // Every entry stays fully legible — dimming the inactive
                    // ones pushed their body copy under 3:1 on this ground.
                    // The addressed entry is marked by its copper stem and by
                    // being the only one carrying a photograph.
                    className="absolute"
                    style={{
                      left: pl.x,
                      width: CARD_W,
                      top: `${16 + pl.lane * 27}%`,
                    }}
                  >
                    {/* The stem, tying the entry to its own year on the axis */}
                    <span
                      aria-hidden
                      className={`block h-px w-full origin-left transition-colors duration-500 ${
                        isActive ? "bg-copper" : "bg-night/25"
                      }`}
                    />
                    <span className="t-poster mt-3 block text-[1.5rem] leading-none tabular-nums text-terrakotta">
                      {e.year}
                    </span>
                    <h3 className="t-hero mt-2 text-[1.15rem] leading-tight text-night">{e.title}</h3>
                    <p className="mt-2 line-clamp-4 text-[0.82rem] leading-relaxed text-night/75">
                      {e.detail}
                    </p>
                    {isActive && (
                      <div className="relative mt-4 h-24 w-full overflow-hidden rounded-[8px]">
                        <Image
                          src={chroniclePhoto(pl.i)}
                          alt=""
                          fill
                          sizes="236px"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* The axis — ticks stand where their years do, so the record's own
            rhythm of silence and activity is visible at a glance. */}
        <div className="relative px-6 pb-10 lg:px-10">
          <div className="relative h-6">
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-night/20" />
            {placed.map((pl) => (
              <span
                key={pl.label + pl.i}
                aria-hidden
                className={`absolute bottom-0 w-px transition-all duration-300 ${
                  pl.i === active ? "h-6 bg-copper" : pl.i < active ? "h-3 bg-night/45" : "h-3 bg-night/20"
                }`}
                style={{ left: `${((pl.year - FIRST) / (LAST - FIRST)) * 100}%` }}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[0.6rem] uppercase tracking-[0.24em] text-night/75">
            <span className="tabular-nums">1464</span>
            <span className="text-terrakotta">
              {current.year} · {current.title}
            </span>
            <span>Heute</span>
          </div>
        </div>
      </div>
    </section>
  );
}
