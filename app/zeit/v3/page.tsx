import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { PillarNext } from "@/components/aw/PillarChrome";
import { TimeCorridor } from "@/components/zeit/TimeCorridor";
import { LivingCount } from "@/components/aw/LivingCount";
import { pillars } from "@/lib/content";

const pillar = pillars.find((p) => p.slug === "zeit")!;

export const metadata = {
  title: "Zeit v3 — Korridor | 1464byW",
  description:
    "Säule I als Strecke: 562 Jahre Hofchronik, jeder Eintrag an seinem Jahr, die Lücken so lang wie sie waren.",
  robots: { index: false, follow: false },
};

const STATEMENT = [
  "Sechsundzwanzig Generationen.",
  "Eine Quelle. Ein Osthang.",
  "36 Monate Stille im Glasballon.",
];

/**
 * Säule I — Zeit, the corridor study (v3).
 *
 * Three readings of this pillar now exist side by side: /zeit is the reading
 * room, /zeit/v2 is the chapter deck, and this is the corridor. All three are
 * listed on /design.
 *
 * The reading-room version reads the chronicle as a room: a statement, three
 * doors, and 562 years scrolled past vertically across fourteen screens. This
 * one makes the span a distance instead. The chronicle becomes a corridor laid
 * out on real time — every entry standing at its own year, so the ninety-two
 * silent years after 1464 take up ninety-two years of floor — and the page
 * closes on the two numbers that are still running.
 *
 * Kept from the original on purpose: the statement, the three sub-doors, the
 * live count, and the next-pillar door. Only the composition is new.
 */
export default function ZeitCorridorPage() {
  return (
    <div>
      {/* The hero — the span stated before it is crossed */}
      <section className="relative -mb-8 flex min-h-[92svh] items-end overflow-hidden px-6 pb-24 pt-40 lg:px-10">
        <Image
          src="/gallery/warmbach/img_0059.jpg"
          alt="Der Warmbachhof in der Winterdämmerung"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-night/68" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-night/60" />

        <div className="relative mx-auto w-full max-w-[1500px]">
          <Reveal>
            <p className="text-[0.6rem] uppercase tracking-[0.24em] text-gold">
              Säule I · Warmbachhof
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="t-poster mt-8 text-[clamp(3rem,13vw,10rem)] uppercase leading-[0.9] text-cream">
              Zeit
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            {/* The span itself, as a measure rather than a sentence */}
            <div className="mt-8">
              <p className="flex items-center gap-5 text-cream">
                <span className="t-poster text-[clamp(1.6rem,4vw,3rem)] tabular-nums leading-none">1464</span>
                <span aria-hidden className="h-px w-16 bg-gold lg:w-28" />
                <span className="t-poster text-[clamp(1.6rem,4vw,3rem)] tabular-nums leading-none">2026</span>
              </p>
              <p className="mt-4 text-[0.62rem] uppercase tracking-[0.24em] text-cream/75">
                562 Jahre · 22 Einträge · lückenlos belegt
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="t-accent mt-8 max-w-2xl text-[clamp(1.1rem,2.2vw,1.6rem)] text-cream/90">
              {pillar.tagline}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ( 01 ) The thesis */}
      <section className="relative z-10 rounded-t-[28px] bg-cream px-6 py-24 text-night lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className="t-hero text-[clamp(1.5rem,3vw,2.2rem)] text-night">
              ( 01 ) Zeit im Glas
            </h2>
          </Reveal>
          <div className="lg:col-span-7 lg:col-start-6">
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
      </section>

      {/* ( 02 ) The corridor */}
      <TimeCorridor />

      {/* ( 03 ) The exits */}
      <section className="bg-cream px-6 py-24 text-night lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <h2 className="t-hero max-w-[20ch] border-b border-night/20 pb-6 text-[clamp(1.9rem,4vw,3.2rem)] text-night">
              ( 03 ) Drei Wege tiefer hinein
            </h2>
          </Reveal>
          <ul className="mt-4 flex flex-col">
            {pillar.sub?.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 0.06}>
                  <Link
                    href={s.href ?? "#"}
                    data-cursor
                    className="group grid grid-cols-1 items-baseline gap-3 border-b border-night/15 py-8 transition-colors duration-500 lg:grid-cols-12 lg:gap-10 lg:py-10"
                  >
                    <span className="text-[0.58rem] uppercase tracking-[0.24em] text-terrakotta lg:col-span-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="t-hero text-[clamp(1.5rem,3.2vw,2.4rem)] text-night lg:col-span-5">
                      {s.title}
                    </h3>
                    <p className="max-w-lg text-sm leading-relaxed text-night/75 lg:col-span-5">
                      {s.line}
                    </p>
                    <span
                      aria-hidden
                      className="text-[0.62rem] uppercase tracking-[0.22em] text-terrakotta transition-transform duration-500 ease-deep group-hover:translate-x-1 lg:col-span-1 lg:justify-self-end"
                    >
                      &rarr;
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <LivingCount />

      <PillarNext current="zeit" />
    </div>
  );
}
