import { MosaikWall } from "@/components/gallery/MosaikWall";
import { StudySwitch } from "@/components/gallery/StudySwitch";

export const metadata = {
  title: "Galerie — Das Mosaik | 1464byW",
  description: "Der Warmbachhof als eine Wand aus Fotografien, Kante an Kante.",
  robots: { index: false, follow: false },
};

/** Entwurf F — see components/gallery/MosaikWall.tsx. Not in the sitemap. */
export default function MosaikPage() {
  return (
    <div className="bg-night text-cream">
      <StudySwitch current="/galerie/mosaik" />
      <MosaikWall />
    </div>
  );
}
