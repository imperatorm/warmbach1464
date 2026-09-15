import { KammerCorridor } from "@/components/gallery/KammerCorridor";
import { StudySwitch } from "@/components/gallery/StudySwitch";

export const metadata = {
  title: "Galerie — Die Kammer | 1464byW",
  description: "Der Warmbachhof als vier Räume, durch die man geht.",
  robots: { index: false, follow: false },
};

/** Entwurf C — see components/gallery/KammerCorridor.tsx. Not in the sitemap. */
export default function KammerPage() {
  return (
    <div className="bg-night text-cream">
      <StudySwitch current="/galerie/kammer" />
      <KammerCorridor />
    </div>
  );
}
