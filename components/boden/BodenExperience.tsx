"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollVideo } from "./ScrollVideo";
import { AutoTour } from "./AutoTour";
import { scrollTo } from "@/lib/smoothScroll";
import { soilArchive, soilPending, soilStandort } from "@/lib/soil";

const VIDEO_SRC = "/video/soil_warmbach_video.mp4";

/**
 * The five stages of the descent, mapped onto the film. Depths and notes come
 * straight from lib/soil (soilLayers) — the strata are surveyed fact. The
 * closing stage is the archive itself.
 */
const CHAPTERS = [
  {
    id: "auflage",
    no: "I",
    title: "Die Auflage",
    depth: "0 – 15 cm",
    depthTo: 15,
    lead: "Lebendig, offen, vogelfreundlich.",
    body: "Die oberste Handbreit ist kein Substrat, sondern ein Betrieb: Wurzelfilz, Streu, Regenwurmgänge. Was hier atmet, entscheidet, wie viel Wasser der Hang im August noch hält.",
  },
  {
    id: "verwitterung",
    no: "II",
    title: "Der Verwitterungsboden",
    depth: "15 – 60 cm",
    depthTo: 60,
    lead: "Osthang ohne Kaltluftsee.",
    body: "Darunter zerfällt der Schiefer zu Boden. Der Osthang nimmt die erste Sonne und lässt die kalte Luft abfließen — kein stehender Frost, keine Fäulnis am Stamm.",
  },
  {
    id: "schiefer",
    no: "III",
    title: "Der Schiefer",
    depth: "ab 60 cm",
    depthTo: 95,
    lead: "Erzführend — Eisen und Kupfer.",
    body: "Wildschönauer Schiefer, nördliche Grauwackenzone: graue, grüne und violette Tonschiefer. Verwitterter Schiefer speichert Wärme und Wasser und gibt seine Mineralität nach oben ab.",
    quote: "Derselbe Berg, der das Obst nährt, lieferte einst das Kupfer.",
  },
  {
    id: "wasser",
    no: "IV",
    title: "Das Wasser",
    depth: "Tiefe",
    depthTo: 120,
    lead: "Geführt zum Warmbach · 7 °C.",
    body: "Am Grund läuft die wasserführende Schicht. Dieselbe Quelle, die durch den Schiefer steigt, nährt den Hof — ganzjährig sieben Grad, und am Ende in der Flasche.",
  },
] as const;

/** Where each chapter owns the film, as a fraction of the track. */
const BANDS: [number, number][] = [
  [0.02, 0.26],
  [0.28, 0.5],
  [0.52, 0.74],
  [0.76, 0.97],
];

const MAX_DEPTH = 120;

export function BodenExperience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const depthRef = useRef<HTMLSpanElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  /* One loop owns progress: it feeds the film, the depth readout and the
   * gauge marker. Read from the live rect so deferred media above this
   * section cannot leave a stale measurement behind. */
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = trackRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const range = r.height - window.innerHeight;
        const p = range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0;
        progressRef.current = p;

        const depth = Math.round(p * MAX_DEPTH);
        if (depthRef.current) depthRef.current.textContent = String(depth);
        if (markerRef.current) {
          markerRef.current.setAttribute("transform", `translate(0 ${(p * 340).toFixed(1)})`);
        }

        let idx = 0;
        for (let i = 0; i < BANDS.length; i++) if (p >= BANDS[i][0]) idx = i;
        if (idx !== activeRef.current) {
          activeRef.current = idx;
          setActive(idx);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const goToChapter = useCallback((i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const range = el.getBoundingClientRect().height - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const mid = (BANDS[i][0] + BANDS[i][1]) / 2;
    scrollTo(top + range * mid);
  }, []);

  return (
    <>
      {/* ── The scrubbed film, fixed behind everything ───────────────────── */}
      <div className="relative">
        <ScrollVideo src={VIDEO_SRC} progressRef={progressRef} />

        {/* ── The track: 520svh of scroll that drives the descent ────────── */}
        <div ref={trackRef} className="relative h-[520svh]">
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            {/* Reading scrim — a soft wash on the type side only, so the core
                stays visible while the chapter text keeps its contrast. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/85 via-night/35 to-transparent lg:to-night/10"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night/80 to-transparent"
            />

            {/* Top rule + running label */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-6 pt-24 lg:px-10">
              <div className="mx-auto flex max-w-[1500px] items-baseline justify-between border-b border-cream/15 pb-3">
                <p className="text-[0.6rem] uppercase tracking-[0.28em] text-gold">
                  Bohrkern · {soilStandort.ort}
                </p>
                <p className="hidden text-[0.6rem] uppercase tracking-[0.28em] text-cream/60 sm:block">
                  {soilStandort.hoehe} · {soilStandort.gestein}
                </p>
              </div>
            </div>

            {/* ── Chapter type ─────────────────────────────────────────── */}
            <div className="absolute inset-0 z-10 flex items-center px-6 lg:px-10">
              <div className="mx-auto w-full max-w-[1500px]">
                <div className="relative max-w-xl lg:ml-[8%]">
                  {CHAPTERS.map((c, i) => (
                    <article
                      key={c.id}
                      className={`transition-all duration-700 ease-out ${
                        i === active
                          ? "relative opacity-100 blur-0"
                          : "pointer-events-none absolute inset-0 opacity-0 blur-[2px]"
                      }`}
                    >
                      <p className="text-[0.62rem] uppercase tracking-[0.3em] text-gold">
                        Schicht {c.no} — {c.depth}
                      </p>
                      <h2 className="t-hero mt-5 text-[clamp(2.1rem,5.4vw,4rem)] text-cream [text-shadow:0_2px_40px_rgba(0,0,0,0.8)]">
                        {c.title}
                      </h2>
                      <p className="t-accent mt-3 text-[clamp(1.1rem,2.2vw,1.7rem)] text-cream/90 [text-shadow:0_2px_30px_rgba(0,0,0,0.8)]">
                        {c.lead}
                      </p>
                      <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/80 [text-shadow:0_1px_20px_rgba(0,0,0,0.9)] lg:text-base">
                        {c.body}
                      </p>
                      {"quote" in c && c.quote && (
                        <blockquote className="mt-7 border-l border-gold/60 pl-5 font-display text-lg italic leading-snug text-cream/90 [text-shadow:0_1px_20px_rgba(0,0,0,0.9)]">
                          „{c.quote}"
                        </blockquote>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </div>

            {/* ── The core gauge: instrument and navigation in one ──────── */}
            <nav
              aria-label="Schichten des Bohrkerns"
              className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 lg:block"
            >
              <div className="flex items-start gap-5">
                {/* Labels */}
                <ul className="flex flex-col justify-between py-1 text-right" style={{ height: 340 }}>
                  {CHAPTERS.map((c, i) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => goToChapter(i)}
                        aria-current={i === active ? "true" : undefined}
                        className={`group block text-right transition-colors duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${
                          i === active ? "text-gold" : "text-cream/55 hover:text-cream/90"
                        }`}
                      >
                        <span className="block text-[0.62rem] uppercase tracking-[0.2em]">{c.title}</span>
                        <span className="block text-[0.55rem] tracking-[0.16em] text-cream/50">{c.depth}</span>
                      </button>
                    </li>
                  ))}
                </ul>

                {/* The core column — the meaningful SVG */}
                <svg
                  width="42"
                  height="356"
                  viewBox="0 0 42 356"
                  className="overflow-visible"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="coreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8C5A2B" />
                      <stop offset="26%" stopColor="#C57E5B" />
                      <stop offset="52%" stopColor="#9C9489" />
                      <stop offset="76%" stopColor="#3B5C3F" />
                      <stop offset="100%" stopColor="#1D291D" />
                    </linearGradient>
                  </defs>

                  {/* the core itself */}
                  <rect x="10" y="8" width="22" height="340" fill="url(#coreGrad)" opacity="0.85" />
                  <rect x="10" y="8" width="22" height="340" fill="none" stroke="#EDE6D4" strokeOpacity="0.35" />

                  {/* stratum divisions at the real boundaries */}
                  {[0.26, 0.5, 0.74].map((f) => (
                    <line
                      key={f}
                      x1="10"
                      x2="32"
                      y1={8 + 340 * f}
                      y2={8 + 340 * f}
                      stroke="#EDE6D4"
                      strokeOpacity="0.5"
                      strokeDasharray="2 3"
                    />
                  ))}

                  {/* depth ticks */}
                  {[0, 0.25, 0.5, 0.75, 1].map((f) => (
                    <line
                      key={f}
                      x1="32"
                      x2="38"
                      y1={8 + 340 * f}
                      y2={8 + 340 * f}
                      stroke="#EDE6D4"
                      strokeOpacity="0.4"
                    />
                  ))}

                  {/* travelling marker */}
                  <g ref={markerRef} transform="translate(0 0)">
                    <line x1="4" x2="38" y1="8" y2="8" stroke="#B8893A" strokeWidth="1.5" />
                    <circle cx="4" cy="8" r="3" fill="#B8893A" />
                  </g>
                </svg>
              </div>
            </nav>

            {/* ── Depth readout ────────────────────────────────────────── */}
            <div className="pointer-events-none absolute bottom-24 left-6 z-20 lg:left-10">
              <p className="flex items-baseline gap-2">
                <span
                  ref={depthRef}
                  className="t-poster text-[clamp(2.2rem,5vw,3.6rem)] leading-none tabular-nums text-cream/90"
                >
                  0
                </span>
                <span className="text-[0.7rem] uppercase tracking-[0.24em] text-gold">cm Tiefe</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Das Bodenarchiv — the commercial close, on solid ground ──────── */}
      <section id="bodenarchiv" className="relative bg-night px-6 py-24 text-cream lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 border-b border-cream/20 pb-5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold">
              ( V ) Das Bodenarchiv
            </p>
            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-cream/60">
              {soilStandort.ort} · {soilStandort.hoehe}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <h2 className="t-hero text-[clamp(1.8rem,3.6vw,2.8rem)] text-cream">
                Was der Hang <span className="t-accent">hergibt</span>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/75 lg:text-base">
                Kitzbühel liegt in der nördlichen Grauwackenzone; die tragende Einheit ist der
                Wildschönauer Schiefer. Was daraus in die Frucht geht, wird gemessen — nicht
                behauptet.
              </p>

              <div className="mt-10 flex flex-col items-start gap-4">
                <Link
                  href="/club/mitglied-werden"
                  data-cursor
                  className="rounded-full bg-cream px-6 py-3 text-sm font-medium text-night transition-colors duration-300 hover:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  Bodenarchiv über den Club beziehen
                </Link>
                <Link
                  href="/contact"
                  data-cursor
                  className="text-[0.68rem] uppercase tracking-[0.2em] text-cream/70 underline-offset-4 transition-colors duration-300 hover:text-gold hover:underline"
                >
                  Den Hang besuchen
                </Link>
              </div>
            </div>

            {/* The register — honest about what is not yet measured */}
            <div className="lg:col-span-6 lg:col-start-7">
              <dl className="border-t border-cream/20">
                {soilArchive.map((r) => (
                  <div
                    key={r.param}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-cream/12 py-3.5"
                  >
                    <dt className="text-[0.6rem] uppercase tracking-[0.24em] text-cream/70">
                      {r.param}
                    </dt>
                    <dd className="flex items-baseline gap-4">
                      <span className="text-[0.7rem] text-cream/70">{r.reading}</span>
                      <span
                        className={`min-w-[2.5rem] text-right font-body text-sm tabular-nums ${
                          r.pending ? "text-gold" : "text-cream"
                        }`}
                      >
                        {r.value}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
              {soilPending && (
                <p className="mt-5 max-w-lg text-xs leading-relaxed text-cream/70">
                  Die Messwerte werden aus dem Bodengutachten übernommen, sobald es vorliegt —
                  nur Belegtes, keine Schätzungen.
                </p>
              )}
            </div>
          </div>

          <div className="mt-20 flex flex-wrap items-center justify-between gap-5 border-t border-cream/15 pt-6">
            <button
              type="button"
              onClick={() => scrollTo(0)}
              className="text-[0.6rem] uppercase tracking-[0.24em] text-cream/70 transition-colors duration-300 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              ↑ Zurück an die Oberfläche
            </button>
            <Link
              href="/prompt"
              className="text-[0.6rem] uppercase tracking-[0.24em] text-cream/60 transition-colors duration-300 hover:text-gold"
            >
              Rekonstruktions-Brief
            </Link>
          </div>
        </div>
      </section>

      <AutoTour />
    </>
  );
}
