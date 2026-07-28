"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { chronicle } from "@/lib/timeline";
import { Reveal } from "@/components/ui/Reveal";

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

/** 1464 → 15, 2018 → 21, "Heute" → 21. */
function centuryOf(year: string) {
  const n = parseInt(year, 10);
  if (Number.isNaN(n)) return 21;
  return Math.floor((n - 1) / 100) + 1;
}

const ROMAN: Record<number, string> = { 15: "XV", 16: "XVI", 17: "XVII", 18: "XVIII", 19: "XIX", 20: "XX", 21: "XXI" };

/**
 * The chronicle as a reading document, grouped by century (SIGMA's history
 * layout). The homepage rail gives the sweep in one gesture; this gives the
 * depth — every entry with its own line, its own photograph, and a sticky
 * index that tells you which century you are standing in.
 */
export function CenturyChronicle() {
  const groups = useMemo(() => {
    const map = new Map<number, { i: number; year: string; title: string; detail: string }[]>();
    chronicle.forEach((e, i) => {
      const c = centuryOf(e.year);
      if (!map.has(c)) map.set(c, []);
      map.get(c)!.push({ i, year: e.year, title: e.title, detail: e.detail });
    });
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, []);

  const [active, setActive] = useState(groups[0][0]);
  const refs = useRef<Record<number, HTMLElement | null>>({});

  useEffect(() => {
    const nodes = groups.map(([c]) => refs.current[c]).filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.getAttribute("data-century")));
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [groups]);

  return (
    <section className="bg-kalk px-6 py-20 text-night lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 border-b border-night/20 pb-5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-terrakotta">
              ( 02 ) Die Chronik
            </p>
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-terrakotta">
              1464 — heute · {chronicle.length} Einträge
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[160px_1fr] lg:gap-20">
          {/* Century index — stays with you */}
          <nav aria-label="Jahrhunderte" className="lg:sticky lg:top-24 lg:self-start">
            <ul className="flex flex-wrap gap-x-4 gap-y-2 lg:flex-col lg:gap-2">
              {groups.map(([c]) => (
                <li key={c}>
                  <a
                    href={`#jh-${c}`}
                    data-cursor
                    className={`block text-[0.7rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
                      active === c ? "text-terrakotta" : "text-night/45 hover:text-night/80"
                    }`}
                    aria-current={active === c ? "true" : undefined}
                  >
                    {c}. Jh.
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* The entries */}
          <div>
            {groups.map(([c, items]) => (
              <section
                key={c}
                id={`jh-${c}`}
                data-century={c}
                ref={(el) => {
                  refs.current[c] = el;
                }}
                className="scroll-mt-24 border-t border-night/20 pt-8 first:border-t-0 first:pt-0 [&+section]:mt-20"
              >
                <div className="mb-10 flex items-baseline gap-5">
                  <span className="t-poster text-[clamp(2.4rem,6vw,4.5rem)] leading-none text-night">
                    {c}.
                  </span>
                  <span className="text-[0.65rem] uppercase tracking-[0.24em] text-terrakotta">
                    Jahrhundert · {ROMAN[c]}
                  </span>
                </div>

                <ol className="flex flex-col gap-12">
                  {items.map((it) => (
                    <li key={it.year + it.i}>
                      <Reveal>
                        <article className="grid grid-cols-1 gap-6 sm:grid-cols-[96px_1fr] lg:grid-cols-[110px_1fr_220px] lg:gap-8">
                          <p className="font-body text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-terrakotta">
                            {it.year}
                          </p>
                          <div>
                            <h3 className="text-xl font-medium text-night">{it.title}</h3>
                            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-night/75">
                              {it.detail}
                            </p>
                          </div>
                          <div className="relative hidden aspect-[4/3] overflow-hidden lg:block">
                            <Image
                              src={
                                it.i === chronicle.length - 1
                                  ? "/flasche/shot-front.jpg"
                                  : PHOTOS[it.i % PHOTOS.length]
                              }
                              alt=""
                              fill
                              className="object-cover"
                              sizes="220px"
                            />
                          </div>
                        </article>
                      </Reveal>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
