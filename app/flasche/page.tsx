import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { PillarHeroV3, PillarNextV3 } from "@/components/sections/PillarShellV3";
import { NumberedSection } from "@/components/v3/NumberedSection";
import { BlueprintShowcase } from "@/components/v3/BlueprintShowcase";
import { pillars } from "@/lib/content";

const pillar = pillars.find((p) => p.slug === "flasche")!;

export const metadata = {
  title: "Die Flasche — 1464byW",
  description:
    "Der Kristall-Dekanter: flach-oval gefasst, mit gefaltetem Stern-Schliff, graviert 1464 · Kitzbühel · Austria, mit dem Warmbach-Medaillon am Hals.",
};

const angles = [
  { src: "/flasche/shot-side.jpg", label: "Das Profil", note: "Flach gefasst — eine Handbreit tief." },
  { src: "/flasche/shot-optic.jpg", label: "Der Schliff", note: "Der gefaltete, vierstrahlige Stern." },
  { src: "/flasche/shot-back.jpg", label: "Die Signatur", note: "Rückseitig das W//-Monogramm." },
  { src: "/flasche/shot-neck.jpg", label: "Das Siegel", note: "Medaillon an feiner Kette am Hals." },
];

/**
 * Säule V — Flasche, v3 (Watchibia crosshair product pattern): the crystal
 * decanter inside registration marks ("Ihr Glas. Unsere Zeit."), a four-angle
 * technical gallery, and the light hand-&-seal narrative.
 */
export default function FlaschePage() {
  return (
    <div>
      <PillarHeroV3 pillar={pillar} />

      <BlueprintShowcase
        titleA="Ihr Glas."
        titleB="Unsere Zeit."
        image={{ src: "/flasche/shot-front.jpg", alt: "Die 1464byW Kristallflasche — Front mit Medaillon und Stern-Schliff" }}
        annotations={[
          { text: "Im Herzen des Korpus ein gefalteter, vierstrahliger Stern.", side: "left", top: "22%" },
          { text: "Vorderseite graviert: 1464 · Kitzbühel · Austria.", side: "right", top: "40%" },
          { text: "Am Hals das Warmbach-Medaillon an feiner Kette.", side: "left", top: "62%" },
        ]}
        caption="Klares Kristall, flach-oval gefasst, mit geschliffenem Stopfen — Tiroler Glasbläsertradition mit Wurzeln im 18. Jahrhundert."
      />

      <NumberedSection
        no="01"
        title="Vier Ansichten"
        intro="Profil, Schliff, Signatur, Siegel — der Dekanter als technisches Blatt."
        tone="kalk"
      >
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {angles.map((a, i) => (
            <Reveal key={a.src} delay={i * 0.06}>
              <figure className="group relative">
                {/* Corner registration ticks — the blueprint frame per tile */}
                {(["-top-1.5 -left-1.5 border-t border-l", "-top-1.5 -right-1.5 border-t border-r", "-bottom-1.5 -left-1.5 border-b border-l", "-bottom-1.5 -right-1.5 border-b border-r"] as const).map(
                  (pos) => (
                    <span key={pos} aria-hidden className={`absolute ${pos} z-10 h-4 w-4 border-night/50`} />
                  ),
                )}
                <div className="relative aspect-[3/4] overflow-hidden border border-night/10 bg-[#0a0b0a]">
                  <Image
                    src={a.src}
                    fill
                    sizes="(max-width: 768px) 45vw, 22vw"
                    alt={a.label}
                    className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="mt-4">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-copper">{a.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-night/60">{a.note}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </NumberedSection>

      <NumberedSection
        no="02"
        title="Hand & Siegel"
        intro="Jede Flasche mundgeblasen — Material, Maß und Charakter eines Einzelstücks. Dazu fortlaufende Nummerierung, Echtheitszertifikat und Wachssiegel — die Signatur des Hofs."
        tone="cream"
        centered
      />

      <PillarNextV3 current="flasche" />
    </div>
  );
}
