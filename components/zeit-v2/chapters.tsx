"use client";

import Image from "next/image";
import Link from "next/link";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { pillars } from "@/lib/content";
import type { ChronikEvent } from "@/lib/chronik";
import { daysSince1464, formatInt, pad2, timeToNextYear, type Countdown } from "@/lib/time";
import { Reveal } from "@/components/ui/Reveal";
import { HorizontalTimeline, type TimelineHandle } from "./HorizontalTimeline";
import { chronikItems, hofNames, hofPhotos, resonanzen, stadtItems } from "./data";

/**
 * The four chapter sheets. Each one fills its viewport-sized sheet in deck
 * mode (`h-full`, flex column) and takes its natural height when `stacked`.
 * A chapter that owns a horizontal rail gets first refusal on the wheel
 * through `consumeWheel`, so the deck only turns the page once the rail has
 * reached its end.
 */
export type ChapterHandle = { consumeWheel: (delta: number) => boolean };
export type ChapterProps = { stacked?: boolean };
export type ChapterView = ForwardRefExoticComponent<ChapterProps & RefAttributes<ChapterHandle>>;

const EASE = [0.16, 1, 0.3, 1] as const;
const LABEL = "font-body text-[0.7rem] font-semibold uppercase tracking-[0.22em]";
const noWheel = { consumeWheel: () => false };

function Kicker({ no, title, right }: { no: string; title: string; right?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-night/15 pb-4">
      <p className={`${LABEL} text-terrakotta`}>
        ( {no} ) {title}
      </p>
      {right && <p className="font-body text-[0.65rem] uppercase tracking-[0.22em] text-night/50">{right}</p>}
    </div>
  );
}

// ── 01 · Der Hof ──────────────────────────────────────────────────────────────

export const HofChapter: ChapterView = forwardRef<ChapterHandle, ChapterProps>(function HofChapter(_, ref) {
  useImperativeHandle(ref, () => noWheel, []);
  return (
    <div className="flex h-full flex-col gap-8">
      <Kicker no="01" title="Der Hof" right="Warmbachhof · Kitzbühel" />

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <h3 className="t-h2 text-night">Vom Bauernhof zur Brennerei</h3>
          <p className="mt-6 max-w-lg text-[0.85rem] leading-[1.75] text-night/75">
            Der Warmbachhof ist im Kitzbüheler Salbuch seit 1464 verzeichnet. Über Jahrhunderte ein
            selbstversorgender Alpenhof, wandert er durch sechsundzwanzig Eigentümerwechsel — und
            bleibt doch in Betrieb. Seit 2018 gehört er der Familie Dr. Hans Wehrmann, dem ersten
            Besitzerwechsel außerhalb der Tiroler Bauernreihen.
          </p>
          <p className="mt-4 max-w-lg text-[0.85rem] leading-[1.75] text-night/75">
            Wiederaufbau nach Brixentaler Bauernhof-Vorbild, ausgeführt von Holzbau Obermoser aus
            Aurach — Holz und Bruchstein, am Fuß des Kitzbüheler Horns. Der Weg vom Bauernhof zur
            Brennerei führt nicht weg von der Geschichte des Ortes, sondern tiefer hinein.
          </p>
          <blockquote className="t-accent mt-7 border-l-2 border-copper/30 pl-5 text-[1.15rem] leading-relaxed text-night/80">
            „Wir haben nichts erfunden. Wir haben es nur wiedergefunden.“
          </blockquote>
        </Reveal>

        <div className="grid content-start grid-cols-3 gap-4 lg:col-span-7">
          {hofPhotos.map((p, i) => (
            <Reveal key={p.src} delay={0.08 + i * 0.07}>
              <figure>
                <div className="relative aspect-[3/4] overflow-hidden bg-kalk">
                  <Image src={p.src} alt={p.caption} fill className="object-cover" sizes="(min-width: 1024px) 20vw, 30vw" />
                </div>
                <figcaption className="mt-2 font-body text-[0.62rem] uppercase tracking-[0.22em] text-night/50">
                  {p.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      {/* The names strip — Longines runs its logo through the decades; the Hof runs its families. */}
      <Reveal delay={0.2} className="border-t border-night/15 pt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="font-body text-[0.8rem] font-bold text-night">Die Namen des Hofs</p>
          <p className="text-[0.72rem] text-night/55">Zehn Familien in 562 Jahren — so, wie das Salbuch sie nennt.</p>
        </div>
        <ol className="mt-5 flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {hofNames.map((n) => (
            <li key={n.year} className="relative flex min-w-[8.5rem] flex-1 flex-col border-t border-night/20 pr-4 pt-3">
              <span aria-hidden className="absolute -top-[3px] left-0 h-[5px] w-[5px] rounded-full bg-terrakotta" />
              <span className="font-body text-[0.7rem] font-semibold tabular-nums tracking-[0.2em] text-terrakotta">{n.year}</span>
              <span className="mt-1 font-body text-[0.8rem] font-bold text-night">{n.name}</span>
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  );
});

// ── 02 · Die Chronik ──────────────────────────────────────────────────────────

export const ChronikChapter: ChapterView = forwardRef<ChapterHandle, ChapterProps>(function ChronikChapter({ stacked }, ref) {
  const tl = useRef<TimelineHandle>(null);
  useImperativeHandle(ref, () => ({ consumeWheel: (d) => tl.current?.consumeWheel(d) ?? false }), []);
  return (
    <div className="flex h-full flex-col gap-6">
      <Kicker no="02" title="Die Chronik" right={`1464 — heute · ${chronikItems.length} Einträge`} />
      <div className="min-h-0 flex-1">
        <HorizontalTimeline
          ref={tl}
          items={chronikItems}
          heading="Meilensteine der Hofchronik"
          range={["1464", "Heute"]}
          mode={stacked ? "scroll" : "drag"}
        />
      </div>
    </div>
  );
});

// ── 03 · Die Stadt ────────────────────────────────────────────────────────────

export const StadtChapter: ChapterView = forwardRef<ChapterHandle, ChapterProps>(function StadtChapter({ stacked }, ref) {
  const tl = useRef<TimelineHandle>(null);
  const [pane, setPane] = useState(0);

  useImperativeHandle(
    ref,
    () => ({
      consumeWheel: (d) => {
        if (stacked) return false;
        if (pane === 0) {
          if (tl.current?.consumeWheel(d)) return true;
          if (d > 0) {
            setPane(1);
            return true;
          }
          return false;
        }
        if (d < 0) {
          setPane(0);
          return true;
        }
        return false;
      },
    }),
    [pane, stacked],
  );

  const rail = (
    <div className="flex h-full flex-col gap-6">
      <Kicker no="03" title="Die Stadt" right={`um 1165 — heute · ${stadtItems.length} Stationen`} />
      <div className="min-h-0 flex-1">
        <HorizontalTimeline
          ref={tl}
          items={stadtItems}
          heading="Stationen der Stadt Kitzbühel"
          range={["um 1165", "Heute"]}
          mode={stacked ? "scroll" : "drag"}
        />
      </div>
    </div>
  );

  if (stacked) {
    return (
      <div className="flex flex-col gap-20">
        {rail}
        <Resonanzen />
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden">
      <motion.div
        animate={{ y: `${pane * -100}%` }}
        transition={{ duration: 0.9, ease: EASE }}
        className="h-full"
      >
        <div className="h-full">{rail}</div>
        <div className="h-full pt-2">
          <Resonanzen />
        </div>
      </motion.div>
      {/* pane indicator */}
      <div className="absolute right-0 top-0 flex gap-1.5">
        {[0, 1].map((p) => (
          <button
            key={p}
            type="button"
            data-cursor
            aria-label={p === 0 ? "Stationen" : "Resonanzen"}
            aria-current={p === pane ? "true" : undefined}
            onClick={() => setPane(p)}
            className={`h-11 w-4 ${p === pane ? "text-terrakotta" : "text-night/30 hover:text-night/60"}`}
          >
            <span className="mx-auto block h-1.5 w-1.5 rounded-full bg-current" />
          </button>
        ))}
      </div>
    </div>
  );
});

/** Longines' arrowed sub-sections, re-cast as the five Resonanzen between city and Hof. */
function Resonanzen() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const r = resonanzen[i];
  const to = (k: number) => {
    setDir(k > i ? 1 : -1);
    setI((k + resonanzen.length) % resonanzen.length);
  };

  return (
    <div className="flex h-full flex-col gap-6">
      <Kicker no="03" title="Resonanzen" right={`${pad2(i + 1)} / ${pad2(resonanzen.length)}`} />

      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={r.id}
            custom={dir}
            initial={{ opacity: 0, x: 40 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 * dir }}
            transition={{ duration: 0.5, ease: EASE }}
            className="grid h-full grid-cols-1 content-start gap-8 lg:grid-cols-12 lg:gap-10"
          >
            <div className="lg:col-span-4">
              <p className={`${LABEL} ${r.kupfer ? "text-copper" : "text-terrakotta"}`}>
                {r.kupfer ? "◆ " : ""}
                {r.label}
              </p>
              <p className="t-accent mt-4 text-[clamp(1.3rem,2.2vw,1.9rem)] leading-[1.3] text-night">{r.note}</p>
            </div>
            <EventCol side="Kitzbühel · Stadt" ev={r.kitz} />
            <EventCol side="Warmbach · Hof" ev={r.hof} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-night/15 pt-4">
        <div className="flex flex-wrap gap-1">
          {resonanzen.map((x, k) => (
            <button
              key={x.id}
              type="button"
              data-cursor
              aria-current={k === i ? "true" : undefined}
              onClick={() => to(k)}
              className={`min-h-11 px-3 font-body text-[0.65rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                k === i ? "text-terrakotta" : "text-night/45 hover:text-night"
              }`}
            >
              {x.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Arrow label="Vorherige Resonanz" onClick={() => to(i - 1)}>&larr;</Arrow>
          <Arrow label="Nächste Resonanz" onClick={() => to(i + 1)}>&rarr;</Arrow>
        </div>
      </div>
    </div>
  );
}

function Arrow({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      data-cursor
      aria-label={label}
      onClick={onClick}
      className="grid h-11 w-11 place-items-center rounded-full border border-night/20 text-night transition-colors duration-300 hover:border-terrakotta hover:text-terrakotta"
    >
      {children}
    </button>
  );
}

function EventCol({ side, ev }: { side: string; ev: ChronikEvent }) {
  const kupfer = ev.theme === "kupfer";
  return (
    <div className="border-t border-night/15 pt-4 lg:col-span-4">
      <p className="font-body text-[0.62rem] uppercase tracking-[0.22em] text-night/50">{side}</p>
      <p className={`mt-3 font-body text-[0.7rem] font-semibold uppercase tracking-[0.2em] ${kupfer ? "text-copper" : "text-terrakotta"}`}>
        {ev.yearLabel}
      </p>
      <h4 className="mt-2 font-body text-[0.95rem] font-bold leading-snug text-night">{ev.title}</h4>
      <p className="mt-3 text-[0.8rem] leading-[1.7] text-night/75">{ev.body}</p>
      <p className="mt-3 text-[0.65rem] italic leading-snug text-night/45">{ev.source}</p>
    </div>
  );
}

// ── 04 · Heute ────────────────────────────────────────────────────────────────

export const HeuteChapter: ChapterView = forwardRef<ChapterHandle, ChapterProps>(function HeuteChapter(_, ref) {
  useImperativeHandle(ref, () => noWheel, []);
  const [days, setDays] = useState(0);
  const [cd, setCd] = useState<Countdown | null>(null);

  useEffect(() => {
    const target = daysSince1464();
    let raf = 0;
    let start = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDays(target);
    } else {
      const tick = (t: number) => {
        if (!start) start = t;
        const p = Math.min(1, (t - start) / 2000);
        setDays(Math.round((p >= 1 ? 1 : 1 - Math.pow(2, -10 * p)) * target));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    setCd(timeToNextYear());
    const id = window.setInterval(() => setCd(timeToNextYear()), 1000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(id);
    };
  }, []);

  const zeit = pillars.find((p) => p.slug === "zeit")!;
  const boden = pillars.find((p) => p.slug === "boden")!;
  const units = [
    { v: cd ? String(cd.days) : "––", l: "Tage" },
    { v: cd ? pad2(cd.hours) : "––", l: "Std" },
    { v: cd ? pad2(cd.minutes) : "––", l: "Min" },
    { v: cd ? pad2(cd.seconds) : "––", l: "Sek" },
  ];

  return (
    <div className="flex h-full flex-col gap-8">
      <Kicker no="04" title="Heute" right="Die Zeit, lebendig" />

      <div className="grid min-h-0 flex-1 grid-cols-1 content-start gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <p className="t-poster text-[clamp(3.5rem,10vw,9rem)] leading-[0.85] tabular-nums text-night">{formatInt(days)}</p>
          <p className={`${LABEL} mt-5 text-terrakotta`}>Tage seit 1464</p>
          <p className="mt-3 max-w-md text-[0.85rem] leading-[1.7] text-night/70">
            Ununterbrochen bewirtschaftet — vom Salbuch bis zu diesem Augenblick.
          </p>
          <div className="mt-8 flex flex-wrap items-end gap-x-6 gap-y-3">
            {units.map((u) => (
              <div key={u.l} className="flex flex-col">
                <span className="t-poster text-[clamp(1.4rem,3vw,2.4rem)] leading-none tabular-nums text-night/90">{u.v}</span>
                <span className="mt-2 font-body text-[0.55rem] uppercase tracking-[0.24em] text-night/50">{u.l}</span>
              </div>
            ))}
            <span className="pb-1 font-body text-[0.62rem] uppercase tracking-[0.24em] text-night/50">bis zum Jahreswechsel</span>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5">
          <p className="font-body text-[0.8rem] font-bold text-night">Drei Türen</p>
          <ul className="mt-4 divide-y divide-night/15 border-y border-night/15">
            {zeit.sub?.map((s, i) => (
              <li key={s.title}>
                <Link href={s.href ?? "#"} data-cursor className="group flex items-baseline justify-between gap-6 py-4">
                  <span>
                    <span className="mr-4 font-body text-[0.65rem] font-semibold tracking-[0.2em] text-terrakotta">0{i + 1}</span>
                    <span className="font-body text-[0.95rem] font-bold text-night">{s.title}</span>
                    <span className="mt-1 block text-[0.78rem] leading-relaxed text-night/60">{s.line}</span>
                  </span>
                  <span aria-hidden className="text-terrakotta transition-transform duration-500 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="border-t border-night/15 pt-5">
        <p className={`${LABEL} text-night/50`}>Nächste Säule</p>
        <Link href={`/${boden.slug}`} data-cursor className="group mt-2 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <span className="t-poster text-[clamp(2rem,5vw,4rem)] uppercase leading-none text-night transition-colors duration-500 group-hover:text-terrakotta">
            {boden.name}
          </span>
          <span className={`${LABEL} text-terrakotta`}>
            Säule {boden.no} — {boden.tagline}
          </span>
        </Link>
      </Reveal>
    </div>
  );
});
