"use client";

import { useEffect, useState } from "react";
import { releaseCountdown, type ReleaseParts } from "@/lib/founders/release";

const UNITS: { key: "days" | "hours" | "minutes" | "seconds"; label: string }[] = [
  { key: "days", label: "Tage" },
  { key: "hours", label: "Std" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sek" },
];

/**
 * Fixed bottom strip with a live countdown to the release (client-side 1s tick,
 * so it never freezes at build time). Uses the shared releaseCountdown so the
 * day figure matches the overview card and the timeline. Spans the content
 * column on desktop.
 */
export function ReleaseCountdownBar({ targetISO, label }: { targetISO: string; label: string }) {
  const [p, setP] = useState<ReleaseParts | null>(null);

  useEffect(() => {
    const tick = () => setP(releaseCountdown(targetISO));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-hairline/15 bg-night/90 backdrop-blur-md lg:left-[260px]">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-3 lg:px-14">
        <p className="t-label text-stone">Bis zum Release</p>

        <div className="flex items-end gap-3 sm:gap-4">
          {UNITS.map((u, i) => (
            <div key={u.key} className="flex items-end gap-3 sm:gap-4">
              {i > 0 && <span className="pb-2 text-gold/40">·</span>}
              <div className="flex flex-col items-center">
                <span
                  className={`holo-num font-display leading-none tabular-nums ${
                    u.key === "days" ? "text-2xl" : "text-xl"
                  }`}
                >
                  {p === null ? "—" : u.key === "days" ? p[u.key] : String(p[u.key]).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-stone">{u.label}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="hidden text-xs uppercase tracking-[0.18em] text-cream/55 sm:block">
          Founder&rsquo;s Reserve N°1 · {label}
        </p>
      </div>
    </div>
  );
}
