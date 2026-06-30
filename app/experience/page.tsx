import { ExperienceHero } from "@/components/sections/ExperienceHero";
import { PortalGateway } from "@/components/sections/PortalGateway";
import { ChronicleSection } from "@/components/sections/ChronicleSection";
import { ElementalSceneSection } from "@/components/sections/ElementalSceneSection";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = {
  title: "1464 — Experience",
  description: "Eine cineastische Annäherung an den Warmbachhof.",
};

/**
 * Alternative cinematic homepage (/experience) — the alpine film hero with the onyx
 * bottle, a full-bleed statement over the landscape, the doorways, and the timeline.
 */
export default function ExperiencePage() {
  return (
    <>
      <ExperienceHero />

      {/* Cinematic statement over the alpine still */}
      <section className="relative flex min-h-[80vh] items-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/video/alpine-poster.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-night/72" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/60" />
        <div className="relative mx-auto w-full max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="t-label mb-6">Kitzbühel · Anno 1464</p>
            <h2 className="t-display max-w-4xl text-cream">
              Sechsundzwanzig Generationen. Eine Quelle. Ein Osthang.
            </h2>
            <p className="t-lead mt-8 max-w-xl">
              Vom Boden bis zur Seele — ein Hof am Wilden Kaiser, der nach 562 Jahren
              zum ersten Mal selbst brennt.
            </p>
          </Reveal>
        </div>
      </section>

      <ElementalSceneSection />

      <PortalGateway />

      <ChronicleSection />
    </>
  );
}
