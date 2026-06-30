import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { PillarHero, PillarNext } from "@/components/sections/PillarShell";
import { PlaketteReveal } from "@/components/sections/PlaketteReveal";
import { pillars } from "@/lib/content";

const pillar = pillars.find((p) => p.slug === "zeit")!;
const numerals = ["i", "ii", "iii"];

export const metadata = {
  title: "Zeit — 1464byW",
  description: "1464 ist der Grund: der Hof, die Stadt Kitzbühel und die urkundliche Chronik.",
};

const eyebrow = "font-body text-[0.7rem] font-medium uppercase tracking-[0.22em]";

export default function ZeitPage() {
  return (
    <div>
      {/* Hero with the framed chronicle plaque hung on the right (opens to read) */}
      <div className="relative">
        <PillarHero pillar={pillar} />
        <PlaketteReveal className="absolute right-5 top-24 z-20 w-28 sm:right-12 sm:top-28 sm:w-44 lg:right-[13%] lg:top-1/2 lg:w-[clamp(16rem,24vw,21rem)] lg:-translate-y-1/2" />
      </div>

      {/* Light kalk body — dark hero → light content → dark foot (Fassade rhythm) */}
      <section className="bg-kalk px-6 py-16 text-night lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1100px]">
          <Reveal>
            <p className={`${eyebrow} mb-8 text-terrakotta`}>Drei Unterwelten</p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {pillar.sub?.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <Link href={s.href ?? "#"} data-cursor className="card-field group flex h-full flex-col p-7">
                  <span className="font-display text-sm italic text-terrakotta">{numerals[i]}</span>
                  <h2 className="t-h3 mt-2 text-cream transition-colors group-hover:text-terrakotta">{s.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-cream/70">{s.line}</p>
                  <span className={`${eyebrow} mt-5 text-gold`}>Eintreten &rarr;</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PillarNext current="zeit" />
    </div>
  );
}
