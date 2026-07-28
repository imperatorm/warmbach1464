import { PillarHero, PillarNext } from "@/components/aw/PillarChrome";
import { BodenExperience } from "@/components/boden/BodenExperience";
import { pillars } from "@/lib/content";

const pillar = pillars.find((p) => p.slug === "boden")!;

export const metadata = {
  title: "Boden — 1464byW",
  description:
    "Wie beim Wein entscheidet der Boden. Der Bohrkern des Osthangs — Humusauflage, Verwitterungsboden, Wildschönauer Schiefer und die wasserführende Schicht.",
};

/**
 * Säule II — Boden. The hero stays; everything beneath it is the descent:
 * a scroll-scrubbed core sample from the living surface down to the water,
 * annotated with the surveyed strata, closing on the Bodenarchiv.
 */
export default function BodenPage() {
  return (
    <div>
      <PillarHero
        pillar={pillar}
        image="/gallery/warmbach/img_0024.jpg"
        alt="Wiese und Wilder Kaiser hinter dem Warmbachhof"
      />

      <BodenExperience />

      <PillarNext current="boden" />
    </div>
  );
}
