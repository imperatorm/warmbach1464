import { formatInt } from "@/lib/time";
import type { AvailabilityItem } from "@/lib/founders/types";

export function AvailabilityLedger({ items }: { items: AvailabilityItem[] }) {
  return (
    <div className="grid gap-px overflow-hidden border border-hairline/15 bg-hairline/10">
      {items.map((it) => (
        <div key={it.edition} className="bg-night p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="t-h3 text-cream">{it.edition}</h3>
            <span className="t-label text-gold">{it.status}</span>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream/70">{it.note}</p>
          <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-2 text-sm">
            <div>
              <dt className="t-label text-stone">Auflage</dt>
              <dd className="mt-1 text-cream tabular-nums">{it.total === null ? "—" : formatInt(it.total)}</dd>
            </div>
            <div>
              <dt className="t-label text-stone">Für Ihren Sitz</dt>
              <dd className="mt-1 text-cream tabular-nums">{it.reservedForYou}</dd>
            </div>
            <div>
              <dt className="t-label text-stone">Vorzugsfenster</dt>
              <dd className="mt-1 text-cream tabular-nums">{it.firstAccessWindowDays} Tage</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
}
