import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Die Schwelle — the last page of the sheet. One statement, one door, and the
 * status line that says the offer is actually open.
 */
export function ClosingCTA() {
  return (
    <section className="relative overflow-hidden border-t border-hairline/10 bg-night px-6 py-28 text-center text-cream lg:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(197,126,91,0.10),_transparent_65%)]"
      />
      <div className="relative mx-auto max-w-3xl">
        <Reveal>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 px-4 py-2 text-[0.6rem] uppercase tracking-[0.24em] text-gold">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold motion-safe:animate-pulse" />
            Warteliste offen
          </span>
          <h2 className="t-hero mt-8 text-[clamp(2.4rem,6.5vw,5rem)] text-cream">
            Kommen Sie an den <span className="t-accent">Tisch</span>
          </h2>
          <p className="mx-auto mt-7 max-w-md text-base leading-relaxed text-cream/70">
            Direkt vom Hof, in kleiner Zahl. Jede Flasche nummeriert, mit
            Echtheitszertifikat und Wachssiegel.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-11 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Link
              href="/club/mitglied-werden"
              data-cursor
              className="rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-night transition-colors duration-300 hover:bg-gold"
            >
              Mitglied werden
            </Link>
            <Link
              href="/club"
              data-cursor
              className="rounded-full bg-cream/10 px-7 py-3.5 text-sm font-medium text-cream transition-colors duration-300 hover:bg-cream/20"
            >
              Den Club kennenlernen
            </Link>
          </div>
          <p className="mt-8 text-[0.6rem] uppercase tracking-[0.22em] text-cream/60">
            Direktvertrieb an Sammler · Ohne Zwischenhandel
          </p>
        </Reveal>
      </div>
    </section>
  );
}
