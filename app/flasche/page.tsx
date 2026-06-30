import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { PillarHero, PillarNext } from "@/components/sections/PillarShell";
import { pillars } from "@/lib/content";

const pillar = pillars.find((p) => p.slug === "flasche")!;

export const metadata = {
  title: "Die Flasche — 1464byW",
  description:
    "Der Kristall-Dekanter: flach-oval gefasst, mit gefaltetem Stern-Schliff, graviert 1464 · Kitzbühel · Austria, mit dem Warmbach-Medaillon am Hals.",
};

const eyebrow = "font-body text-[0.7rem] font-medium uppercase tracking-[0.22em]";

const angles = [
  { src: "/flasche/shot-side.jpg", label: "Das Profil", note: "Flach gefasst — eine Handbreit tief." },
  { src: "/flasche/shot-optic.jpg", label: "Der Schliff", note: "Der gefaltete, vierstrahlige Stern." },
  { src: "/flasche/shot-back.jpg", label: "Die Signatur", note: "Rückseitig das W//-Monogramm." },
  { src: "/flasche/shot-neck.jpg", label: "Das Siegel", note: "Medaillon an feiner Kette am Hals." },
];

export default function FlaschePage() {
  return (
    <div>
      <PillarHero pillar={pillar} />

      {/* Die Flasche — dunkles Showcase: das Kristall schwebt im Schwarz */}
      <section className="bg-night px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 md:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden bg-[#0a0b0a]">
              <Image
                src="/flasche/shot-front.jpg"
                fill
                sizes="(max-width: 768px) 80vw, 40vw"
                alt="Die 1464byW Kristallflasche — Front mit Medaillon, gefaltetem Stern-Schliff und Gravur 1464"
                className="object-contain"
                priority
              />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className={`${eyebrow} mb-4 text-gold`}>Die Flasche</p>
              <h2 className="t-h1 mb-6 text-cream">Ein flacher Kristall-Dekanter.</h2>
              <p className="t-lead max-w-md">
                Klares Kristall, flach-oval gefasst, mit geschliffenem Stopfen. Im Herzen des Korpus
                ein gefalteter, vierstrahliger Stern. Vorderseite graviert: 1464 · Kitzbühel · Austria.
                Am Hals das Warmbach-Medaillon an feiner Kette.
              </p>
              <p className="mt-6 text-sm leading-relaxed text-stone">
                Tiroler Glasbläsertradition mit Wurzeln im 18. Jahrhundert — traditionell für edle Obstbrände.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Vier Ansichten — Galerie auf Schwarz */}
      <section className="bg-night px-6 pb-24 lg:px-10 lg:pb-32">
        <div className="mx-auto max-w-[1300px]">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {angles.map((a, i) => (
              <Reveal key={a.src} delay={i * 0.06}>
                <figure className="group">
                  <div className="relative aspect-[3/4] overflow-hidden border border-hairline/10 bg-[#0a0b0a]">
                    <Image
                      src={a.src}
                      fill
                      sizes="(max-width: 768px) 45vw, 22vw"
                      alt={a.label}
                      className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="mt-3">
                    <p className={`${eyebrow} text-gold/80`}>{a.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-stone">{a.note}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hand & Siegel — helle Erzählung */}
      <section className="bg-kalk px-6 py-16 text-night lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1000px] text-center">
          <Reveal>
            <p className={`${eyebrow} mb-4 text-terrakotta`}>Hand &amp; Siegel</p>
            <h2 className="t-h2 mb-6 text-night">Mundgeblasen, nummeriert, versiegelt.</h2>
            <p className="t-lead mx-auto max-w-2xl !text-night/70">
              Jede Flasche mundgeblasen — Material, Maß und Charakter eines Einzelstücks. Dazu
              fortlaufende Nummerierung, Echtheitszertifikat und Wachssiegel — die Signatur des Hofs.
            </p>
          </Reveal>
        </div>
      </section>

      <PillarNext current="flasche" />
    </div>
  );
}
