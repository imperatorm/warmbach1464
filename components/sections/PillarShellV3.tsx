import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { OverlapHeading } from "@/components/v3/OverlapHeading";
import { HourglassGlyph } from "@/components/v3/HourglassGlyph";
import { pillars, type Pillar } from "@/lib/content";

/**
 * v3 pillar chrome (Mirage "about us" pattern): the pillar's name as a giant
 * lowercase italic headline overlapping a full-bleed estate image, a quiet
 * two-column tagline strip beneath, and a restyled next-pillar doorway.
 * The v2 PillarShell stays untouched for pages not yet migrated.
 */

const HERO_IMAGES: Record<string, { src: string; alt: string }> = {
  zeit: { src: "/gallery/warmbach/img_0027.jpg", alt: "Der Warmbachhof vor dem Wilden Kaiser" },
  boden: { src: "/gallery/warmbach/img_0024.jpg", alt: "Wiese und Wilder Kaiser hinter dem Hof" },
  baeume: { src: "/gallery/warmbach/img_0030.jpg", alt: "Der Osthang mit dem Hof über Kitzbühel" },
  manufaktur: { src: "/gallery/warmbach/img_0068.jpg", alt: "Der Brennraum mit der Kothe-Kupferanlage" },
  flasche: { src: "/flasche/shot-lay.jpg", alt: "Die Warmbach-Flasche, liegend" },
};

export function PillarHeroV3({ pillar, image }: { pillar: Pillar; image?: { src: string; alt: string } }) {
  const img = image ?? HERO_IMAGES[pillar.slug] ?? HERO_IMAGES.zeit;
  return (
    <div className="relative">
      {/* The Sanduhr watermark rides the sheet's top corner */}
      <HourglassGlyph
        className="pointer-events-none absolute right-[4%] top-24 z-10 hidden h-44 text-night/15 lg:block"
        sand={0.5}
        strokeWidth={1.2}
      />
      <OverlapHeading word={pillar.name.toLowerCase()} image={img} kicker={`Säule ${pillar.no}`} />

      {/* Tagline strip — Mirage's two-column philosophy row */}
      <section className="bg-cream px-6 py-14 text-night lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-copper">Leitzeile</p>
          </Reveal>
          <div className="lg:col-span-7 lg:col-start-5">
            <Reveal>
              <h2 className="font-display text-[clamp(1.5rem,2.8vw,2.3rem)] italic leading-[1.25] text-night">
                {pillar.tagline}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-night/70 lg:text-lg">{pillar.intro}</p>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Restyled next-pillar doorway: big uppercase name on cream, Sanduhr divider. */
export function PillarNextV3({ current }: { current: string }) {
  const idx = pillars.findIndex((p) => p.slug === current);
  const next = pillars[(idx + 1) % pillars.length];
  return (
    <section className="border-t border-night/10 bg-cream px-6 py-16 text-night lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <Link href={`/${next.slug}`} data-cursor className="group flex items-center justify-between gap-6">
            <span>
              <span className="inline-flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-copper">
                <HourglassGlyph className="h-5" sand={0.5} strokeWidth={4} />
                Weiter · Säule {next.no}
              </span>
              <span className="mt-3 block font-body text-[clamp(2rem,5vw,3.8rem)] font-semibold uppercase leading-none text-night transition-colors duration-500 group-hover:text-copper">
                {next.name}
              </span>
            </span>
            <span
              aria-hidden
              className="text-3xl text-copper transition-all duration-500 group-hover:translate-x-2 group-hover:text-terrakotta"
            >
              &rarr;
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
