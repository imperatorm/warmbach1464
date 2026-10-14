import type { Metadata } from "next";
import { ZeitJourney, JourneyClose } from "@/components/zeit-v5/ZeitJourney";
import { PillarNext } from "@/components/aw/PillarChrome";

export const metadata: Metadata = {
  title: "Zeit v5 — Der Flug | 1464byW",
  description:
    "Säule I als eine Kamerafahrt: von oben über das Land, hinunter durch den Bau des Hofs, zwischen die Bäume, bis zum Apfel.",
  robots: { index: false, follow: false },
};

/**
 * Säule I — Zeit, the flight (v5). The fifth reading of this pillar, beside
 * the reading room (/zeit), the deck (/zeit/v2), the corridor (/zeit/v3) and
 * the pop-up book (/zeit/v4); all five are listed on /design. Staging only.
 */
export default function ZeitFlightPage() {
  return (
    <div>
      <ZeitJourney />
      <JourneyClose />
      <PillarNext current="zeit" />
    </div>
  );
}
