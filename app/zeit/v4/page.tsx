import type { Metadata } from "next";
import { ZeitExperience } from "@/components/zeit-v4/ZeitExperience";
import { PillarNext } from "@/components/aw/PillarChrome";

export const metadata: Metadata = {
  title: "Zeit v4 — Das Klappbuch | 1464byW",
  description:
    "Säule I als Klappbuch: der Osthang gemalt, und der Hof, der sich darauf aufstellt — vom alten zum neuen.",
  robots: { index: false, follow: false },
};

/**
 * Säule I — Zeit, the pop-up book (v4). The fourth reading of this pillar,
 * beside the reading room (/zeit), the deck (/zeit/v2) and the corridor
 * (/zeit/v3); all four are listed on /design. Staging only, not in the sitemap.
 */
export default function ZeitPopUpPage() {
  return (
    <div>
      <ZeitExperience />
      <PillarNext current="zeit" />
    </div>
  );
}
