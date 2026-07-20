import { HeroEditorial } from "@/components/v2/HeroEditorial";
import { Manifesto } from "@/components/v2/Manifesto";
import { PillarIndex } from "@/components/v2/PillarIndex";
import { PillarPanels } from "@/components/v2/PillarPanels";
import { BottleChamber } from "@/components/v2/BottleChamber";
import { EditorialSpread } from "@/components/v2/EditorialSpread";
import { ChronicleSection } from "@/components/sections/ChronicleSection";
import { ThresholdCTA } from "@/components/v2/ThresholdCTA";

/**
 * Home v2 — the brand book as a website. An editorial sheet in numbered
 * chapters, alternating night-green and kalk bands (grid & composition
 * after the EcoWood reference):
 *
 *   Title sheet   → alpine film with the folio data strip
 *   01 Manifest   → statement spread + counting facts (kalk)
 *   02 Säulen     → index cards of the five Säulen, click opens the pillar (night)
 *   03 Flasche    → the spotlit product chamber (Fey/Telepathic pattern, night)
 *   04 Der Hof    → asymmetric parallax spread (kalk)
 *   05 Chronik    → the interactive 562-year timeline (night)
 *   Schwelle      → Club 1464 with magnetic CTA (night)
 */
export default function HomePage() {
  return (
    <>
      <HeroEditorial />
      <Manifesto />
      <PillarIndex />
      {/* <PillarPanels /> */}
      <BottleChamber />
      <EditorialSpread />
      <ChronicleSection />
      <ThresholdCTA />
    </>
  );
}
