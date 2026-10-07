import type { Metadata } from "next";
import { FmHero } from "@/components/v4/FmHero";
import { FmProvenanceStrip } from "@/components/v4/FmProvenanceStrip";
import { FmOrigin } from "@/components/v4/FmOrigin";
import { FmElements } from "@/components/v4/FmElements";
import { FmObject } from "@/components/v4/FmObject";
import { FmFigures } from "@/components/v4/FmFigures";
import { FmZeit } from "@/components/v4/FmZeit";
import { FmEditions } from "@/components/v4/FmEditions";
import { FmChronik } from "@/components/v4/FmChronik";
import { FmGalleryMarquee } from "@/components/v4/FmGalleryMarquee";
import { FmClosing } from "@/components/v4/FmClosing";

export const metadata: Metadata = {
  title: "1464byW — v4 Entwurf",
  description:
    "Redesign-Entwurf nach Farm-Minerals-Vorbild: ein Hof, ein Brand — das Objekt im Licht, die Fakten als Register.",
  robots: { index: false, follow: false },
};

/**
 * Home v4 — the Farm Minerals study (staging route, noindex). The live
 * homepage at / is untouched; this is a parallel composition of the same
 * content with the reference's moves:
 *
 *   Hero        green  · the object in a cone of light, headline top-left,
 *                        claim + door bottom-right
 *   Strip       night  · the facts of the place where they show partners
 *   Origin      beige  · one sourced figure, one plain claim, a faded botanical
 *   Elements    leaf   · question / object / answer, then five flat cards
 *   Object      night  · the pour, three glass callouts, the name run off the floor
 *   Figures     beige  · the ledger of numbers
 *   Zeit        beige  · copy left, photograph bleeding right
 *   Editions    beige  · three product tiles, never a price
 *   Chronik     green  · the Salbuch ledger with a sticky aside
 *   Galerie     beige  · the marquee of photographs
 *   Schwelle    night  · one invitation, two doors
 *
 * Colour is the same four hues as the rest of the site, each brought out a
 * step (tailwind `fm-*`); type is one sans at every size, as on the reference.
 */
export default function HomeV4Page() {
  return (
    <>
      <FmHero />
      <FmProvenanceStrip />
      <FmOrigin />
      <FmElements />
      <FmObject />
      <FmFigures />
      <FmZeit />
      <FmEditions />
      <FmChronik />
      <FmGalleryMarquee />
      <FmClosing />
    </>
  );
}
