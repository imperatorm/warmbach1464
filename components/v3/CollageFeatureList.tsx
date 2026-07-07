import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { HourglassGlyph } from "./HourglassGlyph";

export type CollageFeature = { label: string; desc: string; icon?: React.ReactNode };

/**
 * Watchibia's dark companion band: an image collage on one half, a serif
 * title + icon/label feature list on the other. Icons default to the Sanduhr.
 */
export function CollageFeatureList({
  titleA,
  titleB,
  features,
  images,
}: {
  titleA: string;
  titleB: string;
  features: CollageFeature[];
  images: { src: string; alt: string }[];
}) {
  const spans = ["row-span-2", "", "", "row-span-2", "", "row-span-2", "", ""];
  return (
    <section className="bg-night px-0 text-cream">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-2">
        {/* Collage half */}
        <div className="grid auto-rows-[150px] grid-cols-3 gap-1.5 p-1.5 lg:auto-rows-[170px]">
          {images.slice(0, 8).map((img, i) => (
            <Reveal key={img.src + i} delay={i * 0.04} className={`relative overflow-hidden ${spans[i % spans.length]}`}>
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(min-width: 1024px) 17vw, 33vw" />
              <div className="absolute inset-0 bg-night/20" />
            </Reveal>
          ))}
        </div>

        {/* Feature half */}
        <div className="flex flex-col justify-center px-6 py-16 lg:px-14 lg:py-20">
          <Reveal>
            <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.1] text-cream">
              <span className="block">{titleA}</span>
              <span className="block italic text-gold">{titleB}</span>
            </h2>
          </Reveal>
          <ul className="mt-10 flex flex-col divide-y divide-cream/10">
            {features.map((f, i) => (
              <Reveal key={f.label} delay={0.1 + i * 0.06}>
                <li className="grid grid-cols-[2.2rem_11rem_1fr] items-start gap-4 py-5 max-sm:grid-cols-[2.2rem_1fr]">
                  <span aria-hidden className="mt-0.5 text-gold">
                    {f.icon ?? <HourglassGlyph className="h-6" sand={0.5} strokeWidth={4} />}
                  </span>
                  <p className="text-sm font-semibold text-cream">{f.label}</p>
                  <p className="text-[0.78rem] leading-relaxed text-cream/55 max-sm:col-start-2">{f.desc}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
