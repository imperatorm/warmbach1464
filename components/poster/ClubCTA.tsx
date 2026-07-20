"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The giant closing CTA (Escape's SELL ESCAPE PRODUCTS): the Club as two
 * poster lines with one door under it, and the back-to-top arrow row as the
 * sheet's last flourish.
 */
export function ClubCTA() {
  return (
    <section className="border-t border-hairline/10 bg-night px-6 py-28 text-center text-cream lg:py-40">
      <Reveal>
        <p className="mb-4 text-[0.65rem] uppercase tracking-[0.3em] text-gold">Die Schwelle</p>
        <h2 className="t-poster text-[clamp(3rem,13vw,11rem)] text-cream">
          Club
          <br />
          1464
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-cream/65">
          Direkt vom Hof, in kleiner Zahl. Jede Flasche nummeriert, mit
          Echtheitszertifikat und Wachssiegel.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Link href="/club/mitglied-werden" data-cursor className="btn-primary">
            <span className="text-[0.72rem] font-medium uppercase tracking-[0.22em]">Mitglied werden</span>
            <span aria-hidden>&rarr;</span>
          </Link>
          <Link
            href="/club"
            data-cursor
            className="link-underline text-xs uppercase tracking-[0.18em] text-cream/60 transition-colors hover:text-gold"
          >
            Den Club kennenlernen
          </Link>
        </div>
        <p className="mt-8 text-[0.6rem] uppercase tracking-[0.22em] text-cream/60">
          Direktvertrieb an Sammler · Ohne Zwischenhandel
        </p>
      </Reveal>

      {/* Back-to-top arrow row — the Escape sign-off */}
      <Reveal delay={0.15}>
        <button
          type="button"
          data-cursor
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group mt-24 inline-flex items-center gap-5 text-[0.62rem] uppercase tracking-[0.3em] text-cream/60 transition-colors hover:text-gold"
        >
          <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-1">↑ ↑ ↑</span>
          Zurück zum Anfang
          <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-1">↑ ↑ ↑</span>
        </button>
      </Reveal>
    </section>
  );
}
