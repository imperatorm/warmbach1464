import { BuehneStage } from "@/components/gallery/BuehneStage";
import { StudySwitch } from "@/components/gallery/StudySwitch";

export const metadata = {
  title: "Galerie — Die Bühne | 1464byW",
  description: "Der Warmbachhof, eine Aufnahme nach der anderen auf der Bühne.",
  robots: { index: false, follow: false },
};

/** Entwurf E — see components/gallery/BuehneStage.tsx. Not in the sitemap. */
export default function BuehnePage() {
  return (
    <div className="bg-night text-cream">
      <StudySwitch current="/galerie/buehne" />
      <BuehneStage />
    </div>
  );
}
