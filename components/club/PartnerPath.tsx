"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

export type Step = { n: string; t: string; b: string };

/**
 * The way in, crossed rather than listed.
 *
 * Five stages travel sideways while the section holds the viewport — the same
 * pinned-rail mechanism the Hofchronik runs on the homepage, and for the same
 * reason: the sequence is the content. Admission here is a path with a refusal
 * in the middle of it, and a row of equal cards says the opposite of that.
 *
 * Progress is read from the live rect every tick rather than from useScroll's
 * cached offsets, because the register above this section settles after mount
 * and a cached measurement would leave the rail starting mid-path.
 *
 * Below `lg` and under prefers-reduced-motion the rail never mounts and the
 * five stages stack as an ordinary ordered list — complete, in order, static.
 */
export function PartnerPath({ steps }: { steps: Step[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [rail, setRail] = useState(false);
  const [active, setActive] = useState(0);
  const travel = useRef(0);
  const x = useMotionValue(0);
  const { scrollY } = useScroll();

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const range = rect.height - window.innerHeight;
    const p = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0;
    x.set(-p * travel.current);
    setActive(Math.round(p * (steps.length - 1)));
  }, [x, steps.length]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      setRail(mq.matches && !reduce);
      const trackW = trackRef.current?.scrollWidth ?? 0;
      travel.current = Math.max(0, trackW - window.innerWidth + 120);
      update();
    };
    measure();
    // The track exists only once `rail` flips on, so measure again after it.
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
    <h2 className="t-hero max-w-[18ch] text-[clamp(1.9rem,4vw,3.2rem)] text-cream">
      Fünf Stationen bis zur <span className="t-accent">Freigabe</span>
    </h2>
  );

  // — Stacked fallback: below lg, and under reduced motion —
  if (!rail) {
    return (
      <section
        className="bg-night px-6 py-24 text-cream lg:px-10"
        aria-label="Fünf Stationen bis zur Freigabe"
      >
        <div className="mx-auto max-w-[1500px]">
          {heading}
          <ol className="mt-14 flex flex-col gap-12">
            {steps.map((s) => (
              <li key={s.n} className="border-t border-hairline/20 pt-6">
                <span className="t-poster block text-[2.4rem] leading-none text-gold">{s.n}</span>
                <h3 className="t-hero mt-4 text-[1.35rem] text-cream">{s.t}</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/80">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  // — Pinned rail. The height is static so useScroll measures the pin range on
  //   its first pass; a height applied later from state leaves a stale box. —
  return (
    <section
      ref={ref}
      className="relative h-[300svh] bg-night text-cream"
      aria-label="Fünf Stationen bis zur Freigabe"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* The stage number, standing behind the path */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.span
            key={steps[active].n}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="t-poster select-none text-[30vw] leading-none text-cream/[0.05]"
          >
            {steps[active].n}
          </motion.span>
        </div>

        <div className="relative px-6 pt-20 lg:px-10">{heading}</div>

        <div className="relative flex flex-1 items-center overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-8 px-6 will-change-transform lg:px-10"
          >
            {steps.map((s, i) => (
              <article
                key={s.n}
                aria-current={i === active ? "step" : undefined}
                className={`w-[min(26rem,72vw)] shrink-0 border-t pt-7 transition-opacity duration-500 ${
                  i === active ? "border-gold opacity-100" : "border-hairline/25 opacity-45"
                }`}
              >
                <span className="t-poster block text-[3rem] leading-none text-gold">{s.n}</span>
                <h3 className="t-hero mt-5 text-[1.5rem] text-cream">{s.t}</h3>
                <p className="mt-4 text-sm leading-relaxed text-cream/80">{s.b}</p>
              </article>
            ))}
          </motion.div>
        </div>

        {/* Where you stand on the path */}
        <div className="relative px-6 pb-12 lg:px-10">
          <div className="flex items-end gap-1">
            {steps.map((s, i) => (
              <span
                key={s.n}
                className={`flex-1 transition-all duration-300 ${
                  i === active ? "h-5 bg-gold" : i < active ? "h-2 bg-cream/40" : "h-2 bg-cream/15"
                }`}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[0.6rem] uppercase tracking-[0.24em] text-cream/75">
            <span>I — Anfrage</span>
            <span className="text-gold">
              {steps[active].n} · {steps[active].t}
            </span>
            <span>V — Bestellen</span>
          </div>
        </div>
      </div>
    </section>
  );
}
