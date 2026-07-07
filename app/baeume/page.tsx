import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { PillarNext } from "@/components/sections/PillarShell";
import { PillarHeroV3 } from "@/components/sections/PillarShellV3";
import { ElementalSceneSection } from "@/components/sections/ElementalSceneSection";
import { pillars, editions } from "@/lib/content";

const pillar = pillars.find((p) => p.slug === "baeume")!;

export const metadata = {
  title: "Bäume — 1464byW",
  description: "Der lebendige Baum, 47 Bäume, Früchte und Düfte — und der Weg in den Brand.",
};

export default function BaeumePage() {
  return (
    <div>
      <PillarHeroV3 pillar={pillar} />

      {/* i — der lebendige Baum (interaktive 3D-Szene) */}
      <ElementalSceneSection
        eyebrow="i · Der lebendige Baum"
        title="Der über hundertjährige Apfelbaum"
        intro="Genährt von der artesischen Quelle, die durch seine Wurzeln aufsteigt — Herz und Seele des ersten Edelbrands. Siebenundvierzig Bäume am Osthang, 2024 gepfropft mit Sorten, die fast verschwunden waren."
      />

      {/* ii — Früchte & Düfte (light kalk body — Fassade rhythm) */}
      <section className="bg-kalk px-6 py-16 text-night lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1000px]">
          <Reveal>
            <h2 className="t-h2 mb-6 flex items-baseline gap-4 text-night">
              <span className="font-display text-base italic text-terrakotta">ii</span>
              <span>Früchte &amp; Düfte</span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="max-w-2xl text-[clamp(1.15rem,1.55vw,1.45rem)] leading-[1.62] text-night/70">
              Standortgerechte Sortenwahl, Handernte und Handreinigung, der kurze Weg vom Baum zur
              Maische. Tasting-Notes werden nicht erfunden — sie entstehen mit den ersten Bränden und
              werden dann hier veröffentlicht.
            </p>
          </Reveal>
        </div>
      </section>

      {/* iii — mündet in den Brand (light kalk body — Fassade rhythm) */}
      <section className="bg-kalk px-6 py-16 text-night lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1000px]">
          <Reveal>
            <h2 className="t-h2 mb-6 flex items-baseline gap-4 text-night">
              <span className="font-display text-base italic text-terrakotta">iii</span>
              <span>Mündet in den Brand</span>
            </h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            {editions.map((e, i) => (
              <Reveal key={e.slug} delay={i * 0.06}>
                <Link href="/editions" data-cursor className="card-field group flex h-full flex-col p-7">
                  <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-terrakotta">{e.sort}</p>
                  <h3 className="t-h3 mt-2 text-cream transition-colors group-hover:text-terrakotta">{e.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/70">{e.notes}</p>
                  <p className="mt-5 text-xs uppercase tracking-[0.16em] text-cream/50">{e.volume} · {e.abv} · {e.edition}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PillarNext current="baeume" />
    </div>
  );
}
