import { HangSlope } from "@/components/gallery/HangSlope";
import { StudySwitch } from "@/components/gallery/StudySwitch";

export const metadata = {
  title: "Galerie — Der Hang | 1464byW",
  description: "Der Warmbachhof, abwärts am Osthang entlang.",
  robots: { index: false, follow: false },
};

/** Entwurf B — see components/gallery/HangScene.tsx. Not in the sitemap. */
export default function HangPage() {
  return (
    <div className="bg-night text-cream">
      <StudySwitch current="/galerie/hang" />
      <HangSlope />
    </div>
  );
}
