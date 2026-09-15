import { TischTable } from "@/components/gallery/TischTable";
import { StudySwitch } from "@/components/gallery/StudySwitch";

export const metadata = {
  title: "Galerie — Der Tisch | 1464byW",
  description: "Der Warmbachhof, ausgelegt als lose Abzüge auf einem Tisch.",
  robots: { index: false, follow: false },
};

/** Entwurf A — see components/gallery/TischTable.tsx. Not in the sitemap. */
export default function TischPage() {
  return (
    <div className="bg-kalk pt-[4.5rem] text-night">
      <StudySwitch current="/galerie/tisch" />
      <TischTable />
    </div>
  );
}
