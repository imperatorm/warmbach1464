import { HeroPoster } from "@/components/poster/HeroPoster";
import { IntroBand } from "@/components/poster/IntroBand";
import { EstateSpread } from "@/components/poster/EstateSpread";
import { PillarScatter } from "@/components/poster/PillarScatter";
import { BottleBand } from "@/components/poster/BottleBand";
import { ChronicleSection } from "@/components/sections/ChronicleSection";
import { ClubCTA } from "@/components/poster/ClubCTA";

/**
 * Home, poster edition — the brand book recomposed after the Escape Cafe
 * sheet (Mobbin): type-as-image, split statements, staggered specimens,
 * one dark artifact band, one giant door.
 *
 *   Poster hero   → alpine film, split manifesto statement + side rails
 *   Intro         → one plain paragraph on kalk, no headline
 *   Der Hof       → staggered small specimens + twin mini-columns (kalk)
 *   Die Säulen    → five giant scattered words, each a door (kalk)
 *   Die Flasche   → dark band: caps lead + live decanter + coordinates
 *   Chronik       → the interactive 562-year timeline (night)
 *   Club 1464     → giant poster CTA + back-to-top sign-off (night)
 */
export default function HomePage() {
  return (
    <>
      <HeroPoster />
      <IntroBand />
      <EstateSpread />
      <PillarScatter />
      <BottleBand />
      <ChronicleSection />
      <ClubCTA />
    </>
  );
}
