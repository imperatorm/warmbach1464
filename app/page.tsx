import { HeroFilm } from "@/components/aw/HeroFilm";
import { ManifestBand } from "@/components/aw/ManifestBand";
import { PillarIndex } from "@/components/aw/PillarIndex";
import { CraftFeatures } from "@/components/aw/CraftFeatures";
import { ArtifactBand } from "@/components/aw/ArtifactBand";
import { ChronicleRail } from "@/components/aw/ChronicleRail";
import { LivingCount } from "@/components/aw/LivingCount";
import { ClosingCTA } from "@/components/aw/ClosingCTA";

/**
 * Home — the estate as one continuous sheet, banded light/dark so no two
 * neighbouring chapters read the same:
 *
 *   Hero        film  · statement bottom-aligned, serif accent, status bar
 *   01 Manifest kalk  · lifts over the film on rounded corners
 *   02 Säulen   cream · five giant words; hover floats the photograph
 *   03 Manufakt night · held photograph, sticky rail, cards over it
 *   04 Flasche  night · the live decanter + provenance register
 *   05 Chronik  kalk  · 562 years as a pinned horizontal century rail
 *   06 Zeit     night · the two live numbers, plain
 *   Schwelle    night · one door
 */
export default function HomePage() {
  return (
    <>
      <HeroFilm />
      <ManifestBand />
      <PillarIndex />
      <CraftFeatures />
      <ArtifactBand />
      <ChronicleRail />
      <LivingCount />
      <ClosingCTA />
    </>
  );
}
