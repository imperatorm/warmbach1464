import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

const SPECS = [
  { k: "Glas", v: "Tiroler Glaskunst" },
  { k: "Brand", v: "Zweifachbrand · Kupfer" },
  { k: "Wasser", v: "Quellwasser · 7 °C" },
  { k: "Reife", v: "36 Monate, mindestens" },
  { k: "Siegel", v: "Wachs · Zertifikat" },
  { k: "Nummer", v: "Handnummeriert" },
];

/**
 * Die Flasche — the object and its provenance register, per the Figma source
 * (node 53:194): the spec register left, the bottle photographed on its own
 * warm ground in the middle, the provenance note and door right.
 *
 * The interactive WebGL decanter lives on in components/aw/BottleStudy.tsx —
 * the Figma composition calls for the photograph here, so that is what this
 * band ships.
 */
export function ArtifactBand() {
  return (
    <section className="relative overflow-hidden bg-night px-6 py-24 text-cream lg:px-10 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_50%_45%,_rgba(197,126,91,0.12),_transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1500px]">
        <Reveal>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold">
            ( 04 ) Die Flasche
          </p>
          <h2 className="t-hero mt-4 max-w-[24ch] text-[clamp(1.9rem,3.2vw,3.2rem)] text-cream">
            Was wir brennen, brennen wir einmal.
          </h2>
          <p className="mt-1 text-[clamp(1.9rem,3.2vw,3.2rem)] leading-[1.04] text-cream">
            <span className="t-hero">—&nbsp;</span>
            <span className="t-accent">Premiere Edition</span>
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 items-center gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          {/* Register */}
          <Reveal className="order-2 lg:order-1 lg:col-span-3">
            <dl>
              {SPECS.map((s) => (
                <div
                  key={s.k}
                  className="flex items-baseline justify-between gap-4 border-t border-cream/15 py-3 first:border-t-0"
                >
                  <dt className="text-[0.6rem] uppercase tracking-[0.24em] text-cream/60">{s.k}</dt>
                  <dd className="text-right text-[0.7rem] uppercase tracking-[0.14em] text-cream/90">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* The object */}
          <Reveal className="relative order-1 mx-auto w-full max-w-[560px] lg:order-2 lg:col-span-6 lg:col-start-5">
            <div className="relative aspect-[560/696] w-full overflow-hidden rounded-[8px]">
              <Image
                src="/figma/flasche-bottle-glasses.png"
                alt="Die Warmbach-Flasche mit zwei Gläsern auf warmem Grund"
                fill
                sizes="(min-width: 1024px) 560px, 92vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          {/* Exit */}
          <Reveal delay={0.1} className="order-3 lg:col-span-3 lg:col-start-11">
            <p className="max-w-[34ch] text-sm leading-relaxed text-cream/65">
              Tiroler Glasbläsertradition mit Wurzeln im 18. Jahrhundert. Herkunft, Hand
              und Siegel — die Flasche erzählt, wo der Brand herkommt, bevor man ihn
              öffnet.
            </p>
            <Link
              href="/flasche"
              data-cursor
              className="group mt-7 inline-flex items-center gap-3 rounded-full bg-cream py-1.5 pl-6 pr-1.5 text-sm font-medium uppercase text-night transition-colors duration-300 hover:bg-gold"
            >
              weiter Zur Flasche
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-full bg-night text-cream transition-transform duration-300 group-hover:translate-x-0.5"
              >
                &rarr;
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
