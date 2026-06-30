import { HofGallery } from "@/components/gallery/HofGallery";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = {
  title: "Galerie — Warmbachhof | 1464byW",
  description:
    "Der Warmbachhof in Kitzbühel — Hof, Bar, Brennerei und der kupferne Kothe-Kessel am Osthang.",
};

const eyebrow = "font-body text-[0.7rem] font-medium uppercase tracking-[0.22em]";

export default function GaleriePage() {
  return (
    <section className="bg-kalk pb-32 pt-32 text-night lg:pt-40">
      <div className="mx-auto mb-12 max-w-[1500px] px-6 text-center lg:px-10">
        <Reveal>
          <p className={`${eyebrow} mb-4 text-terrakotta`}>Galerie</p>
          <h1 className="t-h1 text-night">Der Warmbachhof</h1>
          <p className="t-lead mx-auto mt-6 max-w-2xl !text-night/70">
            Hof, Bar, Brennerei und der kupferne Kothe-Kessel — am Osthang über Kitzbühel.
          </p>
        </Reveal>
      </div>

      <HofGallery />
    </section>
  );
}
