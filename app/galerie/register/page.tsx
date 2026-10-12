import { RegisterIndex } from "@/components/gallery/RegisterIndex";
import { StudySwitch } from "@/components/gallery/StudySwitch";

export const metadata = {
  title: "Galerie — Das Register | 1464byW",
  description: "Der Warmbachhof als Verzeichnis: vier Kapitel, jede Aufnahme beschriftet.",
  robots: { index: false, follow: false },
};

/** Entwurf D — see components/gallery/RegisterIndex.tsx. Not in the sitemap. */
export default function RegisterPage() {
  return (
    <div className="bg-cream text-night">
      <StudySwitch current="/galerie/register" />
      <RegisterIndex />
    </div>
  );
}
