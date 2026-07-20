"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

/** A link that leans a few pixels toward the cursor, springing back on leave. */
function MagneticLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 200, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - (rect.left + rect.width / 2)) * 0.18);
    my.set((e.clientY - (rect.top + rect.height / 2)) * 0.28);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.span style={{ x, y }} className="inline-block">
      <Link ref={ref} href={href} data-cursor onMouseMove={onMove} onMouseLeave={onLeave} className={className}>
        {children}
      </Link>
    </motion.span>
  );
}

/**
 * The closing threshold — the Club as the quiet last page of the sheet,
 * set against a ghosted "1464" watermark.
 */
export function ThresholdCTA() {
  return (
    <section className="relative overflow-hidden border-t border-hairline/10 bg-night px-6 py-28 text-center lg:py-40">
      {/* Ghost numeral — watermark behind the threshold */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[38vw] leading-none text-cream/[0.03] lg:text-[26rem]"
      >
        1464
      </span>

      <div className="relative mx-auto max-w-2xl">
        <Reveal>
          <p className="t-label mb-6">Die Schwelle</p>
          <p className="mx-auto mb-6 inline-flex items-center gap-2.5 border border-gold/30 px-4 py-2 text-[0.6rem] uppercase tracking-[0.24em] text-gold">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold motion-safe:animate-pulse" />
            Warteliste offen
          </p>
          <h2 className="t-h1 text-cream">Club 1464</h2>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-cream/60">
            Direkt vom Hof, in kleiner Zahl. Jede Flasche nummeriert, mit Echtheitszertifikat
            und Wachssiegel.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-12 flex flex-col items-center justify-center gap-7 sm:flex-row">
            <MagneticLink href="/club/mitglied-werden" className="btn-primary">
              <span className="text-[0.72rem] font-medium uppercase tracking-[0.22em]">Mitglied werden</span>
              <span aria-hidden>&rarr;</span>
            </MagneticLink>
            <MagneticLink
              href="/club"
              className="link-underline text-xs uppercase tracking-[0.18em] text-cream/60 transition-colors hover:text-gold"
            >
              Den Club kennenlernen
            </MagneticLink>
          </div>
          <p className="mt-8 text-[0.6rem] uppercase tracking-[0.22em] text-cream/35">
            Direktvertrieb an Sammler · Ohne Zwischenhandel
          </p>
        </Reveal>
      </div>
    </section>
  );
}
