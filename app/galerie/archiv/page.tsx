import { HofArchive } from "@/components/gallery/HofArchive";
import { StudySwitch } from "@/components/gallery/StudySwitch";

export const metadata = {
  title: "Galerie — Das Archiv | 1464byW",
  description:
    "Der Warmbachhof in Kitzbühel — Hof, Bar, Brennerei und der kupferne Kothe-Kessel am Osthang.",
  robots: { index: false, follow: false },
};

/**
 * Entwurf G — the archive of the house (redesign/journal-galerie). The room
 * filter carries the page title, so there is no separate heading competing
 * with it. See components/gallery/HofArchive.tsx. Not in the sitemap.
 */
export default function ArchivPage() {
  return (
    <section className="bg-kalk pb-32 pt-32 text-night lg:pt-40">
      <StudySwitch current="/galerie/archiv" />
      {/* The study rail sits on the right edge from lg up; the poster-scale room
          filter runs the full width, so it gives the rail its column. */}
      <div className="lg:pr-32">
        <HofArchive />
      </div>
    </section>
  );
}
