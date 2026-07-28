"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { daysSince1464, timeToNextYear, formatInt, pad2, type Countdown } from "@/lib/time";
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
    if (!mounted) return;
    const update = () => setCd(timeToNextYear());
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [mounted]);

  const units = [
    { v: mounted ? String(cd.days) : "––", l: "Tage" },
    { v: mounted ? pad2(cd.hours) : "––", l: "Std" },
    { v: mounted ? pad2(cd.minutes) : "––", l: "Min" },
    { v: mounted ? pad2(cd.seconds) : "––", l: "Sek" },
  ];

  return (
    <section className="border-t border-hairline/10 bg-night px-6 py-24 text-cream lg:px-10 lg:py-32">
      <div ref={ref} className="mx-auto max-w-[1500px]">
        <Reveal>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold">
            ( 06 ) Die Zeit, lebendig
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="border-t border-cream/20 pt-6">
              <p className="t-poster text-[clamp(3rem,9vw,7rem)] leading-none text-cream tabular-nums">
                {mounted ? formatInt(days) : "—"}
              </p>
              <p className="mt-5 text-[0.65rem] uppercase tracking-[0.24em] text-gold">
                Tage seit 1464
              </p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream/60">
                Ununterbrochen bewirtschaftet — vom Salbuch bis zu diesem Augenblick.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border-t border-cream/20 pt-6">
              <div className="flex items-start gap-5 sm:gap-8">
                {units.map((u) => (
                  <div key={u.l} className="flex flex-col">
                    <span className="t-poster text-[clamp(2rem,5.4vw,4rem)] leading-none text-cream tabular-nums">
                      {u.v}
                    </span>
                    <span className="mt-3 text-[0.55rem] uppercase tracking-[0.24em] text-cream/60">
                      {u.l}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[0.65rem] uppercase tracking-[0.24em] text-gold">
                Bis zum Jahreswechsel
              </p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream/60">
                Countdown bis zur Mitternacht des 31. Dezember.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
