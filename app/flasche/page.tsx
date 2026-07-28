import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { PillarHero, PillarNext, PillarChapter } from "@/components/aw/PillarChrome";
import { BottleStudy } from "@/components/aw/BottleStudy";
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
 * Säule V — Flasche, rebuilt as a product study: the object held sticky
 * beside its register (Assembly Coffee), a four-angle contact sheet, and the
 * closing door to the Club.
 */
export default function FlaschePage() {
  return (
    <div>
      <PillarHero
        pillar={pillar}
        image="/flasche/shot-front.jpg"
        alt="Die Warmbach-Flasche aus grünem Kristall vor dunklem Grund"
      />

      <BottleStudy />

      <PillarChapter
        no="01"
        title="Vier Ansichten"
        intro="Profil, Schliff, Signatur, Siegel — der Dekanter als Kontaktbogen."
        tone="kalk"
      >
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {angles.map((a, i) => (
            <Reveal key={a.src} delay={i * 0.06}>
              <figure className="group">
                <div className="relative aspect-[3/4] overflow-hidden bg-night">
                  <Image
                    src={a.src}
                    fill
                    sizes="(max-width: 768px) 45vw, 22vw"
                    alt={a.label}
                    className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-3 top-3 text-[0.55rem] uppercase tracking-[0.22em] text-cream/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <figcaption className="mt-4">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-terrakotta">
                    {a.label}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-night/75">{a.note}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </PillarChapter>

      <PillarChapter no="02" title="Aus dem Gewölbe" tone="cream">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="t-hero max-w-[18ch] text-[clamp(1.5rem,3vw,2.3rem)] leading-[1.25] text-night">
              Zwei Flaschen dieser Serie sind einander ähnlich — aber nie{" "}
              <span className="t-accent">gleich</span>.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <p className="max-w-xl text-base leading-relaxed text-night/75">
              Mundgeblasen heißt: Material, Maß und Charakter eines Einzelstücks. Die
              Nummer auf der Kupferplakette ist deshalb keine Dekoration, sondern die
              einzige Möglichkeit, genau diese Flasche wiederzufinden.
            </p>
            <Link
              href="/club/mitglied-werden"
              data-cursor
              className="mt-8 inline-block rounded-full bg-night px-6 py-3 text-sm font-medium text-cream transition-colors duration-300 hover:bg-merlot"
            >
              Flasche über den Club anfragen
            </Link>
          </Reveal>
        </div>
      </PillarChapter>

      <PillarNext current="flasche" />
    </div>
  );
}
