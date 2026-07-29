import { HofArchive } from "@/components/gallery/HofArchive";

export const metadata = {
  title: "Galerie — Warmbachhof | 1464byW",
  description:
    "Der Warmbachhof in Kitzbühel — Hof, Bar, Brennerei und der kupferne Kothe-Kessel am Osthang.",
};

/**
 * Galerie — the archive of the house. The room filter carries the page title,
 * so there is no separate heading competing with it.
 */
export default function GaleriePage() {
  return (
    <section className="bg-kalk pb-32 pt-32 text-night lg:pt-40">
      <HofArchive />
    </section>
  );
}
