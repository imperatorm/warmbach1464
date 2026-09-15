"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { editions } from "@/lib/content";

/**
 * The allocation register — the page's spine.
 *
 * What is scarce here is not a number we can print: no per-year contingent has
 * been set, so none is shown. The Substanz-Sperre's own rule applies — an
 * unmeasured value renders as pending, never approximated. What the register
 * can state is entirely true: which editions exist, that every bottle carries
 * its own number and certificate, and that the year's contingent is not yet
 * open. That reads as more controlled than a filled progress bar would.
 *
 * The rule beneath each row draws itself once as the register comes into view,
 * left to right, so the sheet writes itself rather than simply appearing.
 */
const ROWS = editions.map((e) => ({
  name: e.name,
  vintage: e.year || "laufend",
  numbering: e.edition,
  channel: e.status,
}));

export function AllocationLedger() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (reduce) {
      setDrawn(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <div ref={ref} className="mt-16 lg:mt-24">
      <div role="table" aria-label="Allokationsregister">
        <div
          role="row"
          className="grid grid-cols-[1fr_auto] gap-x-8 gap-y-2 border-b border-night/25 pb-4 text-[0.58rem] uppercase tracking-[0.24em] text-terrakotta lg:grid-cols-[1.4fr_0.6fr_1.2fr_1fr_auto]"
        >
          <span role="columnheader">Edition</span>
          <span role="columnheader" className="hidden lg:block">Jahrgang</span>
          <span role="columnheader" className="hidden lg:block">Nummerierung</span>
          <span role="columnheader" className="hidden lg:block">Bezugsweg</span>
          <span role="columnheader" className="text-right">Kontingent</span>
        </div>

        {ROWS.map((r, i) => (
          <div
            key={r.name}
            role="row"
            className="relative grid grid-cols-[1fr_auto] items-baseline gap-x-8 gap-y-3 py-7 lg:grid-cols-[1.4fr_0.6fr_1.2fr_1fr_auto] lg:py-9"
          >
            <span role="cell" className="t-hero text-[clamp(1.4rem,3vw,2.3rem)] text-night">
              {r.name}
            </span>
            <span role="cell" className="hidden text-sm tabular-nums text-night/75 lg:block">
              {r.vintage}
            </span>
            <span role="cell" className="hidden text-sm leading-relaxed text-night/75 lg:block">
              {r.numbering}
            </span>
            <span role="cell" className="hidden text-sm leading-relaxed text-night/75 lg:block">
              {r.channel}
            </span>
            {/* The pending figure. It is a dash because the contingent has not
                been set, and it says so rather than showing a number that
                would have to be invented. */}
            <span role="cell" className="justify-self-end text-right">
              <span className="t-poster block text-[clamp(1.8rem,4vw,3rem)] leading-none text-night/30" aria-hidden>
                —
              </span>
              <span className="mt-2 block text-[0.55rem] uppercase tracking-[0.24em] text-night/70">
                noch nicht eröffnet
              </span>
            </span>

            {/* Everything the row does not yet carry, on small screens. */}
            <dl className="col-span-2 flex flex-wrap gap-x-6 gap-y-1 text-[0.62rem] uppercase tracking-[0.16em] text-night/70 lg:hidden">
              <div className="flex gap-2">
                <dt className="sr-only">Jahrgang</dt>
                <dd className="tabular-nums">{r.vintage}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="sr-only">Nummerierung</dt>
                <dd>{r.numbering}</dd>
              </div>
            </dl>

            {/* The rule, drawing itself in as the register arrives. */}
            <span
              aria-hidden
              className={`absolute inset-x-0 bottom-0 h-px origin-left bg-night/20 transition-transform duration-1000 ease-deep ${
                drawn ? "scale-x-100" : "scale-x-0"
              }`}
              style={{ transitionDelay: reduce ? "0ms" : `${140 + i * 180}ms` }}
            />
          </div>
        ))}
      </div>

      <p className="mt-8 max-w-xl text-sm leading-relaxed text-night/75">
        Kontingente werden je Jahrgang festgelegt und Partnern persönlich zugeteilt. Sobald ein
        Jahrgang eröffnet ist, steht die Zuteilung im Portal — abgerufen und verbleibend, laufend
        aktuell.
      </p>
    </div>
  );
}
