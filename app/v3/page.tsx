import type { Metadata } from "next";
import Link from "next/link";
import { SplitHero } from "@/components/v3/SplitHero";
import { NumberedSection } from "@/components/v3/NumberedSection";
import { HourglassMotif } from "@/components/v3/HourglassMotif";
import { BlueprintShowcase } from "@/components/v3/BlueprintShowcase";
import { InlineImageList, type InlineListItem } from "@/components/v3/InlineImageList";
import { GiantYearTimeline } from "@/components/v3/GiantYearTimeline";
import { PosterLabelImage } from "@/components/v3/PosterLabelImage";
import { PolaroidStack, type PolaroidShot } from "@/components/v3/PolaroidStack";
import { MagneticLink } from "@/components/v3/MagneticLink";
import { HourglassGlyph } from "@/components/v3/HourglassGlyph";
import { Reveal } from "@/components/ui/Reveal";
import { heritageElements } from "@/lib/content";

export const metadata: Metadata = {
  title: "1464byW — v3 Entwurf",
  description: "Redesign-Entwurf: der Warmbachhof als editorialer Bogen — Sanduhr statt Uhrwerk.",
  robots: { index: false, follow: false },
};

// The five elements as a Fortress-style inline-image list.
const ELEMENT_IMAGES: Record<string, { src: string; alt: string }> = {
  Boden: { src: "/gallery/warmbach/img_0024.jpg", alt: "Wiese vor dem Wilden Kaiser" },
  Wasser: { src: "/gallery/warmbach/img_0059.jpg", alt: "Der Hof in der Winterdämmerung" },
  Baum: { src: "/gallery/warmbach/img_0030.jpg", alt: "Der Osthang über Kitzbühel" },
  Kupfer: { src: "/gallery/warmbach/img_0080.jpg", alt: "Die kupferne Kothe-Brennblase" },
  Zeit: { src: "/gallery/warmbach/img_6648.jpg", alt: "Das W-Monogramm auf Altholz" },
};

const elementItems: InlineListItem[] = heritageElements.map((e) => ({
  label: e.name,
  data: e.data,
  image: ELEMENT_IMAGES[e.name] ?? ELEMENT_IMAGES.Zeit,
}));

const polaroids: PolaroidShot[] = [
  { src: "/gallery/warmbach/img_0027.jpg", alt: "Der Hof vor dem Wilden Kaiser", caption: "Der Hof · Osthang" },
  { src: "/gallery/warmbach/img_0065.jpg", alt: "Die Bar im Warmbachhof", caption: "Die Bar" },
  { src: "/gallery/warmbach/img_0080.jpg", alt: "Die Kothe-Brennblase", caption: "Die Brennerei" },
  { src: "/gallery/warmbach/img_0096.jpg", alt: "Die Holztreppe im Kupferlicht", caption: "Warmbach Lounge" },
  { src: "/gallery/warmbach/img_6648.jpg", alt: "Das W-Monogramm auf Altholz", caption: "Das Zeichen" },
];

/**
 * Home v3 — the reference-driven recomposition (staging route, noindex):
 * Fortress two-tone hero → numbered intro → the Sanduhr statement →
 * blueprint bottle → the five elements as an inline-image list → hof spread →
 * Mirage giant-year chronicle → polaroid gallery → Club threshold.
 * The recurring device is the hourglass — maturation and heritage, never a watch.
 */
export default function HomeV3Page() {
  return (
    <>
      <SplitHero />

      <NumberedSection
        no="01"
        title="Ein alter Ort. Ein neuer Brand."
        intro="Bei Kitzbühel liegt ein Boden, der seit Jahrhunderten bewirtschaftet wird. Was wir daraus brennen, ist jung. Es gehört hierher — erstmals 1464 im Salbuch verzeichnet, heute eine Edelbrand-Manufaktur am selben Osthang."
        tone="cream"
        centered
      />

      <HourglassMotif
        kicker="Zeit im Glas"
        lines={["Drei Jahre Stille im Glasballon.", "Ohne Holz, ohne Korrektur.", "Die Zeit macht den Brand."]}
        body="Wir haben nichts erfunden. Wir haben es nur wiedergefunden."
        topImage={{ src: "/gallery/warmbach/img_0041.jpg", alt: "Geschnitzte Balkone des Warmbachhofs" }}
        bottomImage={{ src: "/gallery/warmbach/img_0080.jpg", alt: "Die kupferne Kothe-Brennblase" }}
      />

      <BlueprintShowcase
        titleA="Tiroler Glas."
        titleB="1464er Geist."
        image={{ src: "/flasche/shot-lay.jpg", alt: "Die Warmbach-Flasche, liegend" }}
        annotations={[
          { text: "Tiroler Glasbläsertradition — Wurzeln im 18. Jahrhundert.", side: "left", top: "18%" },
          { text: "Nummeriert, mit Echtheitszertifikat und Wachssiegel.", side: "right", top: "34%" },
          { text: "Zweifachbrand auf der Kothe-Kupferanlage, Engschnitt im Herzstück.", side: "left", top: "62%" },
        ]}
        caption="Ein Gefäß mit Denkmalwürde — gefertigt für Jahrzehnte, nicht für Regale."
      />

      <NumberedSection
        no="02"
        title="Fünf Elemente, ein Geschmack"
        intro="Worauf die Bäume stehen, schmeckt man später. Boden, Wasser, Baum, Kupfer und Zeit — die fünf Größen, aus denen jeder Brand des Hofs entsteht."
        tone="cream"
        centered
      >
        <InlineImageList items={elementItems} tone="cream" />
      </NumberedSection>

      <NumberedSection
        no="03"
        title="Der Hof am Osthang"
        intro="Wiederaufgebaut nach Brixentaler Bauernhof-Vorbild. Seit Mai 2026 arbeitet im Gewölbe die kupferne Kothe-Anlage — 100 und 400 Liter."
        tone="kalk"
      >
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-12 lg:gap-x-8">
          <PosterLabelImage
            src="/gallery/warmbach/img_0027.jpg"
            alt="Der Warmbachhof vor dem Wilden Kaiser"
            labelTop="Warmbachhof · Kitzbühel"
            labelBottom="Anno 1464"
            caption="Der Hof vor dem Wilden Kaiser — 760 m ü. A."
            className="lg:col-span-7"
          />
          <PosterLabelImage
            src="/gallery/warmbach/img_0096.jpg"
            alt="Die geschwungene Holztreppe im Kupferlicht"
            labelTop="Innen · Altholz & Stein"
            labelBottom="Handwerk"
            aspect="aspect-[3/4]"
            labelSide="left"
            className="lg:col-span-4 lg:col-start-9 lg:mt-24"
            sizes="(min-width: 1024px) 30vw, 92vw"
          />
        </div>
      </NumberedSection>

      <GiantYearTimeline vignette={{ src: "/gallery/warmbach/img_0059.jpg", alt: "Der Hof in der Winterdämmerung" }} />

      <NumberedSection
        no="04"
        title="Hof, Bar, Brennerei"
        intro="Vier Räume, ein Haus — durchblättern wie Abzüge aus dem Hofarchiv."
        tone="cream"
        centered
      >
        <PolaroidStack shots={polaroids} />
      </NumberedSection>

      {/* Threshold — split-tone Club close, the Sanduhr as watermark */}
      <section className="relative overflow-hidden bg-night px-6 py-28 text-center text-cream lg:py-36">
        <HourglassGlyph
          className="pointer-events-none absolute left-1/2 top-1/2 h-[130%] -translate-x-1/2 -translate-y-1/2 text-cream/[0.045]"
          sand={0.5}
          strokeWidth={0.8}
        />
        <div className="relative mx-auto max-w-2xl">
          <Reveal>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-gold">Die Schwelle</p>
            <h2 className="mt-5 font-body text-[clamp(2rem,4.4vw,3.6rem)] font-semibold uppercase leading-[1.1]">
              Club 1464
            </h2>
            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-cream/60">
              Direkt vom Hof, in kleiner Zahl. Jede Flasche nummeriert, mit Echtheitszertifikat und Wachssiegel.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-12 flex flex-col items-center justify-center gap-7 sm:flex-row">
              <MagneticLink
                href="/club/mitglied-werden"
                className="inline-flex items-center gap-3 bg-cream px-7 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-night transition-colors duration-300 hover:bg-gold"
              >
                Mitglied werden <span aria-hidden>&rarr;</span>
              </MagneticLink>
              <Link
                href="/club"
                data-cursor
                className="link-underline text-xs uppercase tracking-[0.18em] text-cream/60 transition-colors hover:text-gold"
              >
                Den Club kennenlernen
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
