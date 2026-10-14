"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { ZeitStage } from "./ZeitStage";
import { Klappe } from "./Klappe";

/**
 * Zeit v4 — the pop-up book.
 *
 * After davidwhyte.com/experience: a world painted on paper that assembles as
 * the reader scrolls, text that drifts in from a blur, and the page as one
 * continuous sheet rather than a stack of sections. Here the sheet is the
 * Osthang, and what assembles on it is the Hof, old to new.
 *
 *   Opening   the hundred-year apple tree stands alone on the paper, and the
 *             pillar's thesis beside it.
 *   Stage     the land, pinned; the old Hof, the frame, the new house, the
 *             saplings, the orchard — each a cut-out that stands up and lies
 *             back down (ZeitStage).
 *   Record    five flip boxes, the years on their covers: the Salbuch leaf,
 *             the grafting hands, the copper, the glass balloon, the decanter.
 *   Close     the thesis again, and the doors into the three sub-pages.
 *
 * Every figure is a watercolour generated from the house's own photographs
 * (scripts/gen-zeit-images.mjs); the painted idiom is the point — the old Hof
 * can be shown as a depiction without pretending to be a photograph.
 */

const RECORD = [
  { src: "/zeit-v4/salbuch.webp", alt: "Ein Blatt des Salbuchs, gemalt", year: "1464", label: "Das Salbuch", text: "Jörg Frey vom Warmbach zahlt eine Mark Pfennige an die Kirche. Der erste Eintrag." },
  { src: "/zeit-v4/haende.webp", alt: "Zwei Hände pfropfen ein Edelreis, gemalt", year: "2024", label: "Die Pfropfung", text: "Siebenundvierzig Bäume, veredelt mit Sorten, die fast verschwunden waren." },
  { src: "/zeit-v4/kupfer.webp", alt: "Die Kothe-Brennblase, gemalt", year: "2026", label: "Das Kupfer", text: "Mai 2026: die Kothe-Anlage, 100 und 400 Liter. Zweifachbrand, Engschnitt im Herzstück." },
  { src: "/zeit-v4/glasballon.webp", alt: "Ein Glasballon mit Brand, gemalt", year: "36", label: "Monate", text: "Drei Jahre Stille im Glasballon. Ohne Holz, ohne Korrektur." },
  { src: "/zeit-v4/flasche.webp", alt: "Die Warmbach-Flasche, gemalt", year: "2030", label: "Estate Edition", text: "Aus eigenen Bäumen. Jede Flasche nummeriert, mit Wachssiegel." },
];

const DOORS = [
  { title: "Der Hof", line: "Warmbachhof seit 1464 — Wiederaufbau nach Brixentaler Vorbild.", href: "/zeit/hof" },
  { title: "Die Stadt", line: "Kitzbühel: Salbuch, Bergbau-Ära, Sport- und Gastgeber-Heritage.", href: "/zeit/kitzbuehel" },
  { title: "Die Chronik", line: "562 Jahre, urkundlich verbürgt — 1464 bis heute.", href: "/zeit/chronik" },
];

export function ZeitExperience() {
  const reduce = useReducedMotion();
  return (
    <div className="bg-cream text-night">
      {/* Opening — the tree alone on the paper */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pt-[4.5rem] lg:px-10">
        <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-terrakotta">Säule I · Zeit</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="t-hero mt-6 text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.08] text-night">
                Die Zeit ist unsere
                <br />
                älteste Zutat.
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="t-accent mt-6 text-[clamp(1.2rem,2.2vw,1.7rem)] text-terrakotta">
                Wir haben nichts erfunden. Wir haben es nur wiedergefunden.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-night/65">
                Ein Osthang über Kitzbühel, seit 1464 im Salbuch. Was darauf stand, was heute darauf steht, und
                was darauf wächst — gemalt, Blatt für Blatt.
              </p>
            </Reveal>
          </div>
          <motion.div
            className="relative mx-auto aspect-square w-[min(78vw,30rem)] lg:col-span-7 lg:w-[min(40vw,36rem)]"
            initial={reduce ? false : { opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <Image src="/zeit-v4/apfelbaum.webp" alt="Der über hundertjährige Apfelbaum in Blüte, gemalt" fill priority sizes="(min-width: 1024px) 40vw, 78vw" className="object-contain" />
          </motion.div>
        </div>
        <p aria-hidden className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.58rem] uppercase tracking-[0.3em] text-night/40">
          Scrollen, um zu entdecken
        </p>
      </section>

      {/* The stage — old to new */}
      <ZeitStage />

      {/* The record — flip boxes */}
      <section className="px-6 py-24 lg:px-10 lg:py-36">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-terrakotta">( 02 ) Was bleibt</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="t-hero mt-5 max-w-2xl text-[clamp(1.6rem,3.4vw,2.8rem)] leading-[1.15] text-night">
              Fünf Blätter aus 562 Jahren. Jedes öffnet sich, wenn man davor steht.
            </h2>
          </Reveal>
          <ul className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mt-24 lg:grid-cols-5 lg:gap-x-6">
            {RECORD.map((r, i) => (
              <li key={r.src} className={i % 2 === 1 ? "lg:mt-16" : ""}>
                <Klappe src={r.src} alt={r.alt} year={r.year} label={r.label} />
                <p className="mt-5 text-sm leading-relaxed text-night/70">{r.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-12 text-[0.62rem] uppercase tracking-[0.2em] text-night/40">
            Alle Bilder dieser Seite sind gemalte Darstellungen, keine Fotografien.
          </p>
        </div>
      </section>

      {/* Close — the doors */}
      <section className="border-t border-night/10 px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-terrakotta">( 03 ) Weiter hinein</p>
          </Reveal>
          <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-night/15 bg-night/15 md:grid-cols-3">
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
        </div>
      </section>
    </div>
  );
}
