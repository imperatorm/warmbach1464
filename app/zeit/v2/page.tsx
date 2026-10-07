import type { Metadata } from "next";
import { ZeitDeck } from "@/components/zeit-v2/ZeitDeck";

export const metadata: Metadata = {
  title: "Zeit v2 — 1464byW",
  description: "Säule I als Kapitel-Deck: der Hof, die Chronik, die Stadt und das Heute — nach dem Vorbild der Longines-Geschichte.",
  robots: { index: false, follow: false },
};

/**
 * Säule I · Zeit, v2 — staging route (noindex). The Longines history deck's
 * structure and mechanics, carrying the sourced Zeit content. Promote by
 * pointing app/zeit/page.tsx at <ZeitDeck /> once it has been signed off.
 */
export default function ZeitV2Page() {
  return <ZeitDeck />;
}
