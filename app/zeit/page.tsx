import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { PillarHeroV3, PillarNextV3 } from "@/components/sections/PillarShellV3";
import { NumberedSection } from "@/components/v3/NumberedSection";
import { HourglassMotif } from "@/components/v3/HourglassMotif";
import { GiantYearTimeline } from "@/components/v3/GiantYearTimeline";
import { PosterLabelImage } from "@/components/v3/PosterLabelImage";
import { pillars } from "@/lib/content";

const pillar = pillars.find((p) => p.slug === "zeit")!;

export const metadata = {
  title: "Zeit — 1464byW",
  description: "1464 ist der Grund: der Hof, die Stadt Kitzbühel und die urkundliche Chronik.",
};

/**
 * Säule I — Zeit, v3 (Mirage "about us" pattern). The Sanduhr is this
 * pillar's identity: maturation and heritage, never a clock. Giant italic
 * headline over the hof, the hourglass statement, three numbered doors to
 * the sub-worlds, and the 562-year chronicle as giant year numerals.
 */
export default function ZeitPage() {
  return (
    <div>
      <PillarHeroV3 pillar={pillar} />

      <HourglassMotif
        kicker="Zeit im Glas"
        lines={["Sechsundzwanzig Generationen.", "Eine Quelle. Ein Osthang.", "36 Monate Stille im Glasballon."]}
        body="Die Zeit ist unsere älteste Zutat."
        topImage={{ src: "/gallery/warmbach/img_0041.jpg", alt: "Geschnitzte Balkone des Warmbachhofs" }}
        bottomImage={{ src: "/gallery/warmbach/img_6648.jpg", alt: "Das W-Monogramm auf Altholz" }}
      />

      <NumberedSection
        no="01"
        title="Drei Unterwelten"
        intro="Der Hof, die Stadt, die Chronik — drei Wege in die erste Säule."
        tone="kalk"
      >
        <div className="grid gap-5 md:grid-cols-3">
          {pillar.sub?.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <Link
                href={s.href ?? "#"}
                data-cursor
                className="group flex h-full flex-col border border-night/15 bg-cream p-7 transition-colors duration-500 hover:border-copper"
              >
                <span className="inline-block border-b border-copper/40 pb-1 font-body text-[0.72rem] font-semibold tracking-[0.08em] text-copper">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-body text-xl font-semibold uppercase tracking-[0.02em] text-night transition-colors group-hover:text-copper">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-night/65">{s.line}</p>
                <span className="mt-auto pt-6 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-terrakotta">
                  Eintreten &rarr;
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </NumberedSection>

      <GiantYearTimeline
        kicker="Die Chronik · 1464 — heute"
        vignette={{ src: "/gallery/warmbach/img_0059.jpg", alt: "Der Hof in der Winterdämmerung" }}
      />

      <NumberedSection
        no="02"
        title="Der Wiederaufbau"
        intro="Nach Brixentaler Bauernhof-Vorbild wiederaufgebaut — Holzbau Obermoser, Aurach. Jeder Balken eine Entscheidung für die nächsten hundert Jahre."
        tone="cream"
      >
        <div className="mx-auto max-w-3xl">
          <PosterLabelImage
            src="/gallery/warmbach/img_0041.jpg"
            alt="Geschnitzte Balkone des Warmbachhofs im Morgenlicht"
            labelTop="Holzbau Obermoser · Aurach"
            labelBottom="2019 — 2026"
            caption="Brixentaler Bauernhof-Vorbild — Balkone, Laube, Glockenturm"
            sizes="(min-width: 1024px) 768px, 92vw"
          />
        </div>
      </NumberedSection>

      <PillarNextV3 current="zeit" />
    </div>
  );
}
