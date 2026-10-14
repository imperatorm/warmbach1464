"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { scrollTo } from "@/lib/smoothScroll";
import type { JourneyProgress } from "@/components/three/ZeitJourneyScene";

const ZeitJourneyScene = dynamic(() => import("@/components/three/ZeitJourneyScene"), { ssr: false });

/**
 * Zeit v5 — the flight.
 *
 * One continuous camera move through the painted diorama (ZeitJourneyScene),
 * scrubbed by a seven-screen scroll track; this component owns the track,
 * the captions that give each point of interest its context, and the rail
 * that shows where in the flight the reader is. The scene reads progress
 * from a ref so no React render stands between the wheel and the camera.
 *
 * The points of interest, with the camera's position at each:
 *
 *   0.00  from above — the land, 1464
 *   0.14  descending — the old Hof
 *   0.32  three-quarter — the timber frame rising
 *   0.50  close — the new house
 *   0.62  turning, coming down — the orchard growing
 *   0.76  eye level — between the rows
 *   0.90  the last tree
 *   1.00  the branch, a hand's breadth away
 */

type Poi = {
  id: string;
  at: number;
  /** Caption window: in, full, hold-until, out. */
  win: [number, number, number, number];
  kicker: string;
  title: string;
  body: string;
};

const POIS: Poi[] = [
  {
    id: "land",
    at: 0,
    win: [-0.01, 0, 0.09, 0.13],
    kicker: "Von oben · 1464",
    title: "Ein Osthang über Kitzbühel.",
    body: "760 Meter, Verwitterungsboden aus den Kalkalpen, eine Quelle, die nie versiegt. Im Salbuch verzeichnet: Jörg Frey vom Warmbach, eine Mark Pfennige an die Kirche.",
  },
  {
    id: "alt",
    at: 0.14,
    win: [0.11, 0.15, 0.25, 0.29],
    kicker: "Der alte Hof · 1556 – 2018",
    title: "Sechsundzwanzig Hände, nie außer Betrieb.",
    body: "Enzemann, Hofer, Vilzer, Obermoser, Fuchs, Feuersinger, Pirchmoser, Huber — und 2018 die Familie Wehrmann, der erste Besitzerwechsel außerhalb der Tiroler Bauernreihen.",
  },
  {
    id: "rohbau",
    at: 0.32,
    win: [0.3, 0.34, 0.44, 0.47],
    kicker: "Der Rohbau · 2019",
    title: "Nach Brixentaler Vorbild, Balken für Balken.",
    body: "Wiederaufbau durch Holzbau Obermoser, Aurach. Die geschnitzten Balkone, der Glockenturm, die Bogentür — nichts davon ist erfunden, alles ist wiedergefunden.",
  },
  {
    id: "neu",
    at: 0.5,
    win: [0.48, 0.52, 0.59, 0.62],
    kicker: "Der neue Hof · 2026",
    title: "Kupfer und Feuer.",
    body: "Im Mai 2026 geht die Kothe-Anlage in Betrieb, 100 und 400 Liter. Zweifachbrand, Engschnitt im Herzstück. Die ersten Brände.",
  },
  {
    id: "obst",
    at: 0.62,
    win: [0.63, 0.67, 0.73, 0.76],
    kicker: "Die Pflanzung · 2024",
    title: "Siebenundvierzig Bäume.",
    body: "Noch während der Hof im Bau war, gepfropft mit Sorten, die fast verschwunden waren. Der älteste Baum steht seit über hundert Jahren.",
  },
  {
    id: "reihen",
    at: 0.76,
    win: [0.77, 0.81, 0.87, 0.9],
    kicker: "Zwischen den Reihen",
    title: "Worauf die Bäume stehen, schmeckt man später.",
    body: "Standortgerechte Sorten, Handernte. Wie beim Wein entscheidet der Boden — Grauwacke, Schiefer, das Wasser der eigenen Quelle, sieben Grad im August wie im Februar.",
  },
  {
    id: "apfel",
    at: 1,
    win: [0.91, 0.95, 1.01, 1.02],
    kicker: "Der Apfel · 2030",
    title: "Drei Jahre Stille im Glasballon.",
    body: "Sein Herz ist ein über hundert Jahre alter Apfelbaum. Ohne Holz, ohne Korrektur — die Estate Edition aus eigenen Bäumen. Die Zeit macht den Brand.",
  },
];

/** The track's height in viewports; the rail maps progress back onto it. */
const SCREENS = 7;

function Caption({ poi, progress }: { poi: Poi; progress: MotionValue<number> }) {
  const [a, b, c, d] = poi.win;
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const blur = useTransform(progress, [a, b, c, d], [10, 0, 0, 10]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  const y = useTransform(progress, [a, b, c, d], [16, 0, 0, -12]);
  return (
    <motion.div className="absolute inset-x-0 bottom-0" style={{ opacity, filter, y }}>
      {/* each caption brings its own paper, so nothing stands empty between stops */}
      <div aria-hidden className="absolute -inset-x-6 -inset-y-6 -z-10 rounded-[22px] bg-cream/75 backdrop-blur-sm lg:-inset-x-8" />
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-terrakotta">{poi.kicker}</p>
      <p className="t-hero mt-3 text-[clamp(1.4rem,2.8vw,2.2rem)] leading-[1.15] text-night">{poi.title}</p>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-night/70">{poi.body}</p>
    </motion.div>
  );
}

export function ZeitJourney() {
  const reduce = !!useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<JourneyProgress>({ current: 0 }).current;
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
  });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // the rail's filled dot: the last point of interest the camera has reached
    let i = 0;
    for (let k = 0; k < POIS.length; k++) if (v >= POIS[k].at - 0.02) i = k;
    if (i !== active) setActive(i);
  });
  const inView = useInView(track, { margin: "20% 0px 20% 0px" });
  const railFill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const jump = (at: number) => {
    const el = track.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollTo(top + at * (el.offsetHeight - window.innerHeight));
  };

  return (
    <section ref={track} className="relative bg-cream text-night" style={{ height: `${SCREENS * 100}svh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* the world */}
        <div className="absolute inset-0 bg-cream">
          <ZeitJourneyScene progress={progress} active={inView} reduce={reduce} />
        </div>

        {/* the context, one point of interest at a time */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-14 lg:px-10 lg:pb-16">
          <div className="relative h-[13rem] w-full max-w-md sm:h-[12rem]">
            <div className="absolute inset-0">
              {POIS.map((p) => (
                <Caption key={p.id} poi={p} progress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>

        {/* the rail: where in the flight we are, and a way to jump */}
        <nav
          aria-label="Stationen des Flugs"
          className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col items-center md:flex lg:right-8"
        >
          <div className="relative h-[46svh] w-px bg-night/15">
            <motion.div className="absolute left-0 top-0 w-px bg-terrakotta" style={{ height: railFill }} />
            {POIS.map((p, i) => (
              <button
                key={p.id}
                type="button"
                data-cursor
                onClick={() => jump(p.at)}
                aria-label={p.kicker}
                aria-current={i === active ? "step" : undefined}
                className="group absolute left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{ top: `${p.at * 100}%` }}
              >
                <span
                  className={`block h-2 w-2 rounded-full border transition-colors duration-500 ${
                    i <= active ? "border-terrakotta bg-terrakotta" : "border-night/40 bg-cream"
                  }`}
                />
                <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap text-[0.55rem] uppercase tracking-[0.2em] text-night/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {p.kicker}
                </span>
              </button>
            ))}
          </div>
        </nav>

        <p aria-hidden className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-[0.58rem] uppercase tracking-[0.3em] text-night/40">
          Scrollen
        </p>
      </div>
    </section>
  );
}

const DOORS = [
  { title: "Der Hof", line: "Warmbachhof seit 1464 — Wiederaufbau nach Brixentaler Vorbild.", href: "/zeit/hof" },
  { title: "Die Stadt", line: "Kitzbühel: Salbuch, Bergbau-Ära, Sport- und Gastgeber-Heritage.", href: "/zeit/kitzbuehel" },
  { title: "Die Chronik", line: "562 Jahre, urkundlich verbürgt — 1464 bis heute.", href: "/zeit/chronik" },
];

/** After the flight: the thesis, said once, and the doors into the sub-pages. */
export function JourneyClose() {
  return (
    <section className="border-t border-night/10 bg-cream px-6 py-24 text-night lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-terrakotta">Säule I · Zeit</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="t-hero mt-5 max-w-3xl text-[clamp(1.8rem,3.8vw,3.2rem)] leading-[1.1] text-night">
            Die Zeit ist unsere älteste Zutat.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="t-accent mt-5 text-[clamp(1.2rem,2.2vw,1.7rem)] text-terrakotta">
            Wir haben nichts erfunden. Wir haben es nur wiedergefunden.
          </p>
        </Reveal>
        <ul className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-night/15 bg-night/15 md:grid-cols-3">
          {DOORS.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 0.06}>
                <Link href={s.href} data-cursor className="group flex h-full flex-col bg-cream p-7 transition-colors duration-500 hover:bg-kalk lg:p-9">
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-terrakotta">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-6 text-xl font-medium text-night">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-night/75">{s.line}</p>
                  <span className="mt-auto pt-8 text-[0.62rem] uppercase tracking-[0.22em] text-terrakotta transition-transform duration-500 group-hover:translate-x-1">
                    Eintreten &rarr;
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-[0.62rem] uppercase tracking-[0.2em] text-night/40">
          Alle Bilder dieser Seite sind gemalte Darstellungen, keine Fotografien.
        </p>
      </div>
    </section>
  );
}
