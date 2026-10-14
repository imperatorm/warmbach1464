"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { PopUp, type Window } from "./PopUp";

/**
 * The stage: the land as it was painted — one meadow, one track, the Wilder
 * Kaiser — pinned for five screens while the reader scrolls the Hof from old
 * to new across it. Every figure is a painted cut-out that stands up from the
 * meadow at its moment and lies back down when the next one comes:
 *
 *   0.00  the land, 1464 — only the track and the one apple tree
 *   0.10  the old Hof stands up — and the families that held it, 1556–2018
 *   0.34  it lies down; the timber frame rises — Holzbau Obermoser, 2019
 *   0.56  the frame becomes the house — Wiederaufbau nach Brixentaler Vorbild
 *   0.64  the saplings stand up in front of it — 47 Bäume, gepfropft 2024
 *   0.84  the saplings become the orchard — 2030, Estate Edition
 *
 * The figures are placed in percent of the plate box, not of the viewport, so
 * the house always stands at the end of the painted track whatever the screen.
 *
 * Reduced motion: no pinning, no hinges — the final picture (house, orchard)
 * and the captions as a plain list underneath.
 */

type Beat = {
  id: string;
  /** Opacity/blur window: in, full, hold-until, out. */
  win: [number, number, number, number];
  kicker: string;
  lines: string[];
  note?: string;
};

const BEATS: Beat[] = [
  {
    id: "land",
    win: [0, 0.02, 0.07, 0.11],
    kicker: "1464 · Das Land",
    lines: ["Ein Osthang. Eine Quelle.", "Ein Baum, der schon stand."],
    note: "Jörg Frey vom Warmbach, im Kitzbüheler Salbuch verzeichnet.",
  },
  {
    id: "alt",
    win: [0.12, 0.17, 0.27, 0.32],
    kicker: "1556 – 2018 · Der alte Hof",
    lines: ["Sechsundzwanzig Hände.", "Nie außer Betrieb."],
    note: "Enzemann · Hofer · Vilzer · Obermoser · Fuchs · Feuersinger · Pirchmoser · Huber · Wehrmann",
  },
  {
    id: "rohbau",
    win: [0.36, 0.41, 0.49, 0.54],
    kicker: "2019 · Der Wiederaufbau",
    lines: ["Nach Brixentaler Vorbild,", "Balken für Balken."],
    note: "Holzbau Obermoser, Aurach.",
  },
  {
    id: "neu",
    win: [0.58, 0.63, 0.74, 0.79],
    kicker: "2024 · Siebenundvierzig Bäume",
    lines: ["Noch im Bau,", "werden die Bäume gepfropft."],
    note: "Sorten, die fast verschwunden waren. Der älteste Baum über hundert Jahre.",
  },
  {
    id: "obst",
    win: [0.85, 0.9, 1, 1],
    kicker: "2030 · Estate Edition",
    lines: ["Aus eigenen Bäumen.", "Die Zeit macht den Brand."],
    note: "Mai 2026: Inbetriebnahme der Brennanlage Kothe. Erste Brände.",
  },
];

/** A figure's standing window and, if it leaves, its lying-down window. */
const FIG: Record<string, { rise: Window; fall?: Window }> = {
  alt: { rise: [0.09, 0.17], fall: [0.3, 0.36] },
  rohbau: { rise: [0.34, 0.42], fall: [0.53, 0.58] },
  neu: { rise: [0.56, 0.64] },
  setzlinge: { rise: [0.64, 0.72], fall: [0.83, 0.87] },
  obst: { rise: [0.85, 0.93] },
};

function Caption({ beat, progress }: { beat: Beat; progress: MotionValue<number> }) {
  const [a, b, c, d] = beat.win;
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const blur = useTransform(progress, [a, b, c, d], [10, 0, 0, 10]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  const y = useTransform(progress, [a, b, c, d], [18, 0, 0, -14]);
  return (
    <motion.div className="absolute inset-x-0 top-0" style={{ opacity, filter, y }}>
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-terrakotta">{beat.kicker}</p>
      <div className="mt-4">
        {beat.lines.map((l) => (
          <p key={l} className="t-hero text-[clamp(1.5rem,3.2vw,2.6rem)] leading-[1.18] text-night">
            {l}
          </p>
        ))}
      </div>
      {beat.note && <p className="mt-4 max-w-sm text-sm leading-relaxed text-night/65">{beat.note}</p>}
    </motion.div>
  );
}

export function ZeitStage() {
  const reduce = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  // The plate itself drifts up a little over the whole stage — the camera settling.
  const plateY = useTransform(scrollYProgress, [0, 1], [12, -12]);

  // The plate takes the width it is given, capped so it never grows taller
  // than the viewport leaves it; beside the caption column that is what
  // keeps the two from overlapping.
  const plate = (
    <div className="relative mx-auto" style={{ width: "min(100%, calc(72svh * 16 / 9))", aspectRatio: "16 / 9" }}>
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y: plateY }}>
        <Image
          src="/zeit-v4/land-1464.webp"
          alt="Der Osthang vor dem Wilden Kaiser, gemalt: nur die Wiese, der Weg und ein Apfelbaum"
          fill
          priority
          sizes="(min-width: 1024px) 92vw, 100vw"
          className="object-contain mix-blend-multiply"
        />
        {/* The figures. Positions are the plate's own geometry: the track ends
            at about 58/55; the orchard strip lies left of it, nearer the eye. */}
        <PopUp src="/zeit-v4/hof-alt.webp" alt="Der alte Warmbachhof, gemalt" progress={scrollYProgress} {...FIG.alt} left={46} top={57} width={22} ratio={4 / 3} />
        <PopUp src="/zeit-v4/hof-rohbau.webp" alt="Der Rohbau des neuen Hofs, gemalt" progress={scrollYProgress} {...FIG.rohbau} left={45} top={57} width={25} ratio={4 / 3} />
        <PopUp src="/zeit-v4/hof-neu.webp" alt="Der neue Warmbachhof, gemalt" progress={scrollYProgress} {...FIG.neu} left={44} top={58} width={27} ratio={4 / 3} priority final />
        <PopUp src="/zeit-v4/setzlinge.webp" alt="Siebenundvierzig gepfropfte Setzlinge, gemalt" progress={scrollYProgress} {...FIG.setzlinge} left={10} top={80} width={34} ratio={16 / 9} />
        <PopUp src="/zeit-v4/obstbaeume.webp" alt="Der junge Obstgarten, gemalt" progress={scrollYProgress} {...FIG.obst} left={9} top={81} width={36} ratio={16 / 9} final />
      </motion.div>
    </div>
  );

  if (reduce) {
    return (
      <section className="bg-cream px-6 py-20 text-night lg:px-10">
        {plate}
        <ol className="mx-auto mt-16 grid max-w-[1100px] gap-10 md:grid-cols-2">
          {BEATS.map((b) => (
            <li key={b.id}>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-terrakotta">{b.kicker}</p>
              {b.lines.map((l) => (
                <p key={l} className="t-hero mt-2 text-2xl leading-tight text-night">{l}</p>
              ))}
              {b.note && <p className="mt-3 text-sm leading-relaxed text-night/65">{b.note}</p>}
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section ref={track} className="relative bg-cream text-night" style={{ height: "560svh" }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-4 pt-[4.5rem] lg:px-10">
        {/* captions: above the plate on phones, beside it from lg */}
        <div className="relative mx-auto mb-6 h-[10.5rem] w-full max-w-[1500px] lg:absolute lg:left-10 lg:top-[22svh] lg:mb-0 lg:h-auto lg:w-[24rem]">
          {BEATS.map((b) => (
            <Caption key={b.id} beat={b} progress={scrollYProgress} />
          ))}
        </div>
        <div className="w-full lg:pl-[27rem]">{plate}</div>
        <p aria-hidden className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.58rem] uppercase tracking-[0.3em] text-night/40">
          Scrollen
        </p>
      </div>
    </section>
  );
}
