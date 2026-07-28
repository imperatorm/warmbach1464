import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { PillarHero, PillarNext, PillarChapter } from "@/components/aw/PillarChrome";
import { CenturyChronicle } from "@/components/aw/CenturyChronicle";
import { LivingCount } from "@/components/aw/LivingCount";
import { pillars } from "@/lib/content";

const pillar = pillars.find((p) => p.slug === "zeit")!;

export const metadata = {
  title: "Zeit — 1464byW",
  description: "1464 ist der Grund: der Hof, die Stadt Kitzbühel und die urkundliche Chronik.",
};

const STATEMENT = ["Sechsundzwanzig Generationen.", "Eine Quelle. Ein Osthang.", "36 Monate Stille im Glasballon."];

/**
 * Säule I — Zeit, rebuilt as the chronicle's reading room: the statement, the
 * three doors, the full 562 years grouped by century (SIGMA's history layout),
 * and the two live numbers to close.
 */
export default function ZeitPage() {
  return (
    <div>
      <PillarHero
        pillar={pillar}
        image="/gallery/warmbach/img_0059.jpg"
        alt="Der Warmbachhof in der Winterdämmerung"
      />

      {/* The statement — the pillar's thesis, set large on kalk */}
      <section className="relative z-10 rounded-t-[28px] bg-kalk px-6 py-20 text-night lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-terrakotta">
              ( 01 ) Zeit im Glas
            </p>
          </Reveal>
          <div className="lg:col-span-8 lg:col-start-5">
            {STATEMENT.map((line, i) => (
              <Reveal key={line} delay={i * 0.08}>
                <p className="t-hero text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.3] text-night">
                  {line}
                </p>
              </Reveal>
            ))}
            <Reveal delay={0.3}>
              <p className="t-accent mt-8 text-[clamp(1.3rem,2.6vw,2rem)] text-terrakotta">
                Die Zeit ist unsere älteste Zutat.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Three doors into the sub-worlds */}
        <div className="mx-auto mt-20 max-w-[1500px] lg:mt-28">
          <ul className="grid grid-cols-1 gap-px overflow-hidden border border-night/15 bg-night/15 md:grid-cols-3">
            {pillar.sub?.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 0.06}>
                  <Link
                    href={s.href ?? "#"}
                    data-cursor
                    className="group flex h-full flex-col bg-kalk p-7 transition-colors duration-500 hover:bg-cream lg:p-9"
                  >
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-terrakotta">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-6 text-xl font-medium text-night">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-night/75">{s.line}</p>
                    <span className="mt-auto pt-8 text-[0.62rem] uppercase tracking-[0.22em] text-terrakotta transition-transform duration-500 group-hover:translate-x-1">
                      Eintreten &rarr;
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CenturyChronicle />

      <PillarChapter
        no="03"
        title="Der Wiederaufbau"
        intro="Nach Brixentaler Bauernhof-Vorbild wiederaufgebaut — Holzbau Obermoser, Aurach. Jeder Balken eine Entscheidung für die nächsten hundert Jahre."
        tone="cream"
      >
        <Reveal>
          <figure>
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src="/gallery/warmbach/img_0041.jpg"
                alt="Geschnitzte Balkone des Warmbachhofs im Morgenlicht"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 1440px, 100vw"
              />
            </div>
            <figcaption className="mt-4 flex flex-wrap justify-between gap-4 text-[0.62rem] uppercase tracking-[0.22em] text-terrakotta">
              <span>Holzbau Obermoser · Aurach</span>
              <span>Brixentaler Bauernhof-Vorbild — Balkone, Laube, Glockenturm</span>
              <span>2019 — 2026</span>
            </figcaption>
          </figure>
        </Reveal>
      </PillarChapter>

      <LivingCount />

      <PillarNext current="zeit" />
    </div>
  );
}
