"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { daysSince1464, timeToNextYear, formatInt, pad2, type Countdown } from "@/lib/time";
import { Monogram } from "@/components/ui/Monogram";
import { Reveal } from "@/components/ui/Reveal";

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Die Zeit, lebendig — the chronicle's two live numbers, set as plain poster
 * figures on hairlines. (The previous holographic panels read as a second
 * design language inside an editorial sheet; the numbers are the drama, the
 * chrome around them was not.)
 */
export function LivingCount() {
  const reduce = !!useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const target = useRef(0);
  const [days, setDays] = useState(0);
  const [cd, setCd] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
  // WCAG 2.2.2 (Pause, Stop, Hide): the countdown updates every second,
  // indefinitely — give it an explicit pause rather than relying on nobody
  // needing to stop it.
  const [paused, setPaused] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    target.current = daysSince1464();
    if (reduce) setDays(target.current);
  }, [mounted, reduce]);

  useEffect(() => {
    if (!mounted || reduce || !inView || target.current === 0) return;
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / 2300);
      setDays(Math.round(easeOutExpo(p) * target.current));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mounted, reduce, inView]);

  useEffect(() => {
    if (!mounted || paused) return;
    const update = () => setCd(timeToNextYear());
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [mounted, paused]);

  const units = [
    { v: mounted ? String(cd.days) : "––", l: "Tage" },
    { v: mounted ? pad2(cd.hours) : "––", l: "Std" },
    { v: mounted ? pad2(cd.minutes) : "––", l: "Min" },
    { v: mounted ? pad2(cd.seconds) : "––", l: "Sek" },
  ];

  return (
    <section className="border-t border-hairline/10 bg-night px-6 py-24 text-cream lg:px-10 lg:py-32">
      <div ref={ref} className="mx-auto max-w-[1500px]">
        {/* The figure, centred under the monogram (Figma 53:7) */}
        <Reveal>
          <div className="flex flex-col items-center">
            <Monogram on="dark" className="h-10 w-auto" />
            <div className="mt-12 w-full max-w-[464px] border-t border-cream/20 pt-6 text-center">
              <p className="t-poster text-[clamp(3rem,9.6vw,7.75rem)] leading-[0.83] text-cream tabular-nums">
                {mounted ? formatInt(days) : "—"}
              </p>
              <p className="mt-4 text-[0.65rem] uppercase tracking-[0.24em] text-gold">
                Tage seit 1464
              </p>
              <p className="mt-3 text-sm leading-relaxed text-cream/60">
                Ununterbrochen bewirtschaftet — vom Salbuch bis zu diesem Augenblick.
              </p>
            </div>
          </div>
        </Reveal>

        {/* The turn of the year, kept as a quieter second reading */}
        <Reveal delay={0.1}>
          <div className="mx-auto mt-20 flex max-w-[464px] flex-col items-center border-t border-cream/15 pt-6">
            <div className="flex items-start gap-5 sm:gap-8">
              {units.map((u) => (
                <div key={u.l} className="flex flex-col items-center">
                  <span className="t-poster text-[clamp(1.5rem,3.6vw,2.6rem)] leading-none text-cream/90 tabular-nums">
                    {u.v}
                  </span>
                  <span className="mt-2.5 text-[0.55rem] uppercase tracking-[0.24em] text-cream/55">
                    {u.l}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-4">
              <p className="text-[0.62rem] uppercase tracking-[0.24em] text-gold/80">
                Bis zum Jahreswechsel
              </p>
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-pressed={paused}
                className="inline-flex min-h-11 items-center rounded-full border border-cream/20 px-4 text-[0.6rem] uppercase tracking-[0.2em] text-cream/60 transition-colors duration-300 hover:border-gold hover:text-gold"
              >
                {paused ? "Fortsetzen" : "Pausieren"}
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
