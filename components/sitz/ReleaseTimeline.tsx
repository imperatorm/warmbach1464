"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { daysUntil, phaseProgress } from "@/lib/founders/release";
import { formatInt } from "@/lib/time";
import type { ReleasePipeline } from "@/lib/founders/types";

const ARC =
  "conic-gradient(from 0deg, transparent 0deg, rgba(192,145,106,0.5) 40deg, transparent 95deg, transparent 200deg, rgba(192,145,106,0.22) 235deg, transparent 280deg)";

export function ReleaseTimeline({ pipeline }: { pipeline: ReleasePipeline }) {
  const reduce = useReducedMotion();
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(daysUntil(pipeline.targetReleaseISO)); // client-side: today-accurate
  }, [pipeline.targetReleaseISO]);

  const progress = phaseProgress(pipeline.phases);

  return (
    <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      {/* Phase timeline */}
      <ol className="relative border-l border-hairline/20 pl-8">
        {pipeline.phases.map((p) => (
          <li key={p.key} className="relative pb-10 last:pb-0">
            <span
              className={`absolute -left-[33px] top-1 h-3 w-3 rounded-full border ${
                p.status === "done"
                  ? "border-gold bg-gold"
                  : p.status === "current"
                  ? "border-gold bg-night shadow-[0_0_10px_2px_rgba(192,145,106,0.6)]"
                  : "border-hairline/40 bg-night"
              }`}
            />
            <p className={`t-label ${p.status === "current" ? "text-gold" : "text-stone"}`}>{p.dateLabel}</p>
            <h3 className={`t-h3 mt-1 ${p.status === "upcoming" ? "text-cream/55" : "text-cream"}`}>{p.label}</h3>
            {p.status === "current" && <p className="mt-1 text-sm text-cream/60">Aktuelle Phase</p>}
          </li>
        ))}
      </ol>

      {/* Holo countdown panel */}
      <div className="relative flex min-h-[20rem] flex-col items-center justify-center overflow-hidden rounded-[2px] border border-hairline/15 bg-soot/30 px-6 py-14 backdrop-blur-sm">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,_rgba(192,145,106,0.12),_transparent_62%)]" />
        <div
          aria-hidden
          className={`pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full ${reduce ? "" : "holo-ring"}`}
          style={{
            background: ARC,
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
          }}
        />
        <div className={`relative flex flex-col items-center ${reduce ? "" : "holo-float"}`}>
          <div className="scanlines px-2 text-center">
            <span className="holo-num font-display text-6xl tabular-nums">
              {days === null ? "—" : formatInt(days)}
            </span>
          </div>
          <p className="t-label mt-7">Tage bis Release</p>
          <p className="mt-2 max-w-[15rem] text-center text-[0.78rem] leading-relaxed text-stone">
            {pipeline.targetReleaseLabel} · Founder&rsquo;s Reserve N°1
          </p>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </div>

      {/* Progress hairline */}
      <div className="lg:col-span-2">
        <div className="h-px w-full bg-hairline/15">
          <div className="h-px bg-gold transition-all" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      </div>
    </div>
  );
}
