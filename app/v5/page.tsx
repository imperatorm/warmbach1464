import type { Metadata } from "next";
import { BarHero } from "@/components/hero-bar/BarHero";
import { ManifestBand } from "@/components/aw/ManifestBand";
import { PillarIndex } from "@/components/aw/PillarIndex";
import { CraftPanoramaBand } from "@/components/aw/CraftPanoramaBand";
import { ChronicleRail } from "@/components/aw/ChronicleRail";
import { LivingCount } from "@/components/aw/LivingCount";
import { ClosingCTA } from "@/components/aw/ClosingCTA";

export const metadata: Metadata = {
  title: "1464byW — v5 Entwurf",
  description: "Hero-Entwurf: die Bar als Kamerafahrt — von der Totalen bis an die Flasche.",
  robots: { index: false, follow: false },
};

/**
 * Home v5 — the live homepage with one change: the hero is the bar, a scroll-
 * driven camera move through the Blender scene (BarHero) instead of the still
 * film. Everything after it is the homepage as it stands at /.
 */
export default function HomeV5Page() {
  return (
    <>
      <BarHero />
      <ManifestBand />
      <PillarIndex />
      <CraftPanoramaBand />
      <ChronicleRail />
      <LivingCount />
      <ClosingCTA />
    </>
  );
}
