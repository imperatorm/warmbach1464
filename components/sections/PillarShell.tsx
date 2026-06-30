import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { pillars, type Pillar } from "@/lib/content";

/**
 * Shared chrome for a pillar page. The hero stays the dark "Natur" canvas (the
 * cinematic anchor); page bodies go light (kalk) for the dark→light→dark rhythm.
 *
 * `backdrop` lets a page slot a decorative watermark behind the hero title
 * (e.g. the Zeit hourglass) — purely visual, over the gradient, under the text.
 */
export function PillarHero({ pillar, backdrop }: { pillar: Pillar; backdrop?: ReactNode }) {
  return (
    <section className="relative flex min-h-[58vh] items-end overflow-hidden px-6 pb-14 pt-36 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_28%_18%,_rgba(58,74,60,0.5)_0%,_rgba(27,38,31,0.96)_62%)]" />
      {backdrop}
      <div className="relative mx-auto w-full max-w-[1200px]">
        <Reveal>
          <p className="t-label mb-5 text-gold">Säule {pillar.no}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="t-display text-cream">{pillar.name}</h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="t-h3 mt-5 max-w-2xl italic text-cream/85">{pillar.tagline}</p>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="t-lead mt-6 max-w-2xl">{pillar.intro}</p>
        </Reveal>
      </div>
    </section>
  );
}

/** Compact numbered chapter heading (i · ii · iii …) used inside pillar pages. */
export function ChapterHeading({ index, title }: { index: string; title: string }) {
  return (
    <Reveal>
      <h2 className="t-h2 mb-6 flex items-baseline gap-4 text-cream">
        <span className="font-display text-base italic text-gold/70">{index}</span>
        <span>{title}</span>
      </h2>
    </Reveal>
  );
}

/** Quiet "next pillar" doorway at the foot of each Säule. Wraps around the cycle. */
export function PillarNext({ current }: { current: string }) {
  const idx = pillars.findIndex((p) => p.slug === current);
  const next = pillars[(idx + 1) % pillars.length];
  return (
    <section className="border-t border-hairline/10 px-6 py-14 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <Link href={`/${next.slug}`} data-cursor className="group flex items-center justify-between gap-6">
          <span>
            <span className="t-label text-stone">Weiter · Säule {next.no}</span>
            <span className="t-h2 mt-1.5 block text-cream transition-colors duration-500 group-hover:text-gold">{next.name}</span>
          </span>
          <span aria-hidden className="text-2xl text-stone transition-all duration-500 group-hover:translate-x-2 group-hover:text-gold">
            &rarr;
          </span>
        </Link>
      </div>
    </section>
  );
}
