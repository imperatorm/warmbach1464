import type { Metadata } from "next";
import { SanduhrVeilPreview } from "@/components/design/SanduhrVeilPreview";

export const metadata: Metadata = {
  title: "Eingang — Sanduhr | 1464byW",
  robots: { index: false, follow: false },
};

/** Staging route (noindex): the Sanduhr entry veil, replayable. */
export default function LoaderPage() {
  return <SanduhrVeilPreview />;
}
