"use client";

import { useState } from "react";
import type { EventItem } from "@/lib/founders/types";

export function EventsList({ events }: { events: EventItem[] }) {
  const [requested, setRequested] = useState<Set<number>>(
    () => new Set(events.map((e, i) => (e.rsvp === "angefragt" ? i : -1)).filter((i) => i >= 0)),
  );

  function toggle(i: number) {
    setRequested((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  return (
    <div className="grid gap-px overflow-hidden border border-hairline/15 bg-hairline/10">
      {events.map((e, i) => {
        const isReq = requested.has(i);
        return (
          <div key={`${e.title}-${i}`} className="flex flex-wrap items-center justify-between gap-6 bg-night p-8">
            <div className="min-w-0">
              <p className="t-label text-gold">{e.kind} · {e.dateLabel} · {e.time}</p>
              <h3 className="t-h3 mt-1 text-cream">{e.title}</h3>
              <p className="mt-1 text-sm text-cream/60">{e.location} · {e.capacityNote}</p>
            </div>
            <button
              onClick={() => toggle(i)}
              data-cursor
              className={`shrink-0 px-5 py-2.5 text-xs uppercase tracking-[0.16em] transition-colors ${
                isReq ? "border border-gold/60 text-gold" : "btn-primary"
              }`}
            >
              {isReq ? "Platz angefragt ✓" : "Platz anfragen"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
