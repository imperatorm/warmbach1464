import type { Metadata } from "next";
import { HourglassGlyph } from "@/components/v3/HourglassGlyph";
import { MagneticLink } from "@/components/v3/MagneticLink";

export const metadata: Metadata = {
  title: "Seite nicht gefunden — 1464byW",
  robots: { index: false, follow: false },
};

/** The 404: the Sanduhr has run out — this page's time is over. */
export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-night px-6 text-center text-cream">
      <HourglassGlyph
        className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] -translate-x-1/2 -translate-y-1/2 text-cream/[0.05]"
        sand={1}
        strokeWidth={0.8}
      />
      <div className="relative max-w-xl">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-gold">404</p>
        <h1 className="mt-6 font-display text-[clamp(3rem,9vw,6.5rem)] italic leading-[0.95] tracking-[-0.02em]">
          Der Sand ist durch.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-cream/60">
          Diese Seite gibt es nicht — oder nicht mehr. Was es gibt: einen Hof,
          der seit 1464 an derselben Stelle steht.
        </p>
        <div className="mt-12">
          <MagneticLink
            href="/"
            className="inline-flex items-center gap-3 bg-cream px-7 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-night transition-colors duration-300 hover:bg-gold"
          >
            Zurück zum Hof <span aria-hidden>&rarr;</span>
          </MagneticLink>
        </div>
      </div>
    </section>
  );
}
