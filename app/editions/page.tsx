import type { Metadata } from "next";
import Image from "next/image";
import { editions, editionVariants } from "@/lib/content";
import { NumberedSection } from "@/components/v3/NumberedSection";
import { OverlapHeading } from "@/components/v3/OverlapHeading";
import { MaskReveal } from "@/components/v3/MaskReveal";
import { MagneticLink } from "@/components/v3/MagneticLink";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Editionen — 1464byW",
  description:
    "Die Editionen des Warmbachhofs: sechs Glas-Ausführungen, nummeriert, mit Echtheitszertifikat und Wachssiegel. Anfrage über den Concierge.",
};

/**
 * The edition range as an editorial folio: a Mirage-style overlap hero, the two
 * documented editions as text (no invented tasting notes — Briefing M7), then
 * one full-bleed night chapter per glass colorway from lib/content.ts.
 * No prices on the page — "Anfrage über Concierge" (brand decision pending).
 */
export default function EditionsPage() {
  return (
    <div>
      <OverlapHeading
        word="editionen"
        kicker="Nummeriert · Zertifikat · Wachssiegel"
        image={{ src: "/flasche/shot-lay.jpg", alt: "Die Warmbach-Flasche, liegend auf Stein" }}
      />

      <NumberedSection
        no="01"
        title="Zwei Brände, dokumentiert"
        intro="Was der Hof heute brennt, ist belegt — keine Behauptung, kein Marketing-Profil. Die Darstellung der Reihe entsteht gemeinsam mit der Familie Wehrmann."
        tone="cream"
      >
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {editions.map((e, i) => (
            <Reveal key={e.slug} delay={i * 0.08}>
              <article className="card-field flex h-full flex-col gap-4 p-8">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-copper">
                  {e.sort}
                  {e.year ? ` · ${e.year}` : ""}
                </p>
                <h3 className="font-display text-3xl italic text-night">{e.name}</h3>
                <p className="text-sm leading-relaxed text-night/70">{e.notes}</p>
                <dl className="mt-auto grid grid-cols-2 gap-x-6 gap-y-2 border-t border-copper/25 pt-4 text-xs text-night/60">
                  <div>
                    <dt className="font-semibold uppercase tracking-[0.16em] text-copper/80">Volumen</dt>
                    <dd className="mt-1">{e.volume}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold uppercase tracking-[0.16em] text-copper/80">Alkohol</dt>
                    <dd className="mt-1">{e.abv}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="font-semibold uppercase tracking-[0.16em] text-copper/80">Edition</dt>
                    <dd className="mt-1">{e.edition}</dd>
                  </div>
                </dl>
              </article>
            </Reveal>
          ))}
        </div>
      </NumberedSection>

      <NumberedSection
        no="02"
        title="Sechs Gläser, ein Inhalt"
        intro="Die Ausführungen der Reihe unterscheiden sich im Glas, nicht im Anspruch: jede Flasche nummeriert, jede mit Zertifikat und Wachssiegel. Keine Preise auf dieser Seite — die Anfrage läuft über den Concierge."
        tone="night"
        centered
      />

      {/* The colorway folios — one night chapter per glass, sticky index rail on desktop */}
      <div className="relative bg-night">
        <nav
          aria-label="Editionen-Index"
          className="pointer-events-none absolute bottom-0 left-6 top-0 z-10 hidden lg:block"
        >
          <div className="pointer-events-auto sticky top-[38vh] flex flex-col gap-2.5">
            {editionVariants.map((v, i) => (
              <a
                key={v.slug}
                href={`#${v.slug}`}
                data-cursor
                className="text-[0.62rem] font-semibold tracking-[0.14em] text-cream/35 transition-colors duration-300 hover:text-gold"
              >
                {String(i + 1).padStart(2, "0")} — {v.name}
              </a>
            ))}
          </div>
        </nav>

        {editionVariants.map((v, i) => {
          const flip = i % 2 === 1;
          return (
            <section
              key={v.slug}
              id={v.slug}
              className="border-t border-hairline/10 px-6 py-20 text-cream scroll-mt-24 lg:px-10 lg:py-28"
            >
              <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
                <MaskReveal
                  className={`lg:col-span-6 ${flip ? "lg:order-2 lg:col-start-7" : ""}`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-soot/40">
                    <Image
                      src={v.image}
                      alt={`Edition ${v.name} — ${v.glass}`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 46vw, 92vw"
                    />
                  </div>
                </MaskReveal>
                <div className={`lg:col-span-5 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"}`}>
                  <Reveal>
                    <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-gold">
                      {String(i + 1).padStart(2, "0")} / {String(editionVariants.length).padStart(2, "0")}
                    </p>
                  </Reveal>
                  <Reveal delay={0.06}>
                    <h2 className="mt-5 font-display text-[clamp(2.6rem,6vw,4.6rem)] lowercase italic leading-[0.95] tracking-[-0.02em]">
                      {v.name}
                    </h2>
                  </Reveal>
                  <Reveal delay={0.12}>
                    <p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-gold">
                      {v.glass}
                    </p>
                    <p className="mt-4 max-w-sm text-base leading-relaxed text-cream/65">{v.line}</p>
                  </Reveal>
                  <Reveal delay={0.18}>
                    <MagneticLink
                      href="/contact"
                      className="mt-10 inline-flex items-center gap-3 border border-gold/60 px-6 py-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-cream transition-colors duration-300 hover:bg-gold hover:text-night"
                    >
                      Anfrage über Concierge <span aria-hidden>&rarr;</span>
                    </MagneticLink>
                  </Reveal>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
