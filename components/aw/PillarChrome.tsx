import Image from "next/image";
import Link from "next/link";
import { pillars, type Pillar } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Pillar hero — the same title sheet as the homepage, tuned for a chapter:
 * a full-bleed photograph, the Säule numeral on a rail, the name in Whyte
 * with its tagline resolving in Garamond italic.
 */
export function PillarHero({
  pillar,
  image,
  alt,
}: {
  pillar: Pillar;
  image: string;
  alt: string;
}) {
  return (
    <section className="relative -mb-8 flex h-[86svh] min-h-[520px] items-end overflow-hidden bg-night">
      <Image src={image} alt={alt} fill priority className="object-cover" sizes="100vw" />
      <div className="pointer-events-none absolute inset-0 bg-night/35" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />

      <p className="t-rail absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 text-cream/70 lg:left-6 lg:block">
        Säule {pillar.no} · Warmbachhof
      </p>

      <div className="relative z-10 w-full px-6 pb-20 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold">
              Säule {pillar.no}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="t-hero mt-5 text-[clamp(2.8rem,9vw,7.5rem)] text-cream">{pillar.name}</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="t-accent mt-4 max-w-[24ch] text-[clamp(1.2rem,2.4vw,1.9rem)] text-cream/90">
              {pillar.tagline}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="mt-8 max-w-xl text-sm leading-relaxed text-cream/75 lg:text-base">
              {pillar.intro}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** The doorway on to the next Säule — wraps around the cycle. */
export function PillarNext({ current }: { current: string }) {
  const i = pillars.findIndex((p) => p.slug === current);
  const next = pillars[(i + 1) % pillars.length];
  return (
    <section className="border-t border-hairline/10 bg-night px-6 py-20 text-cream lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1500px]">
        <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cream/60">Nächste Säule</p>
        <Link
          href={`/${next.slug}`}
          data-cursor
          className="group mt-5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b border-cream/20 pb-6 transition-colors duration-500 hover:border-gold"
        >
          <span className="t-poster text-[clamp(2.4rem,9vw,7rem)] text-cream transition-colors duration-500 group-hover:text-gold">
            {next.name}
          </span>
          <span className="text-[0.65rem] uppercase tracking-[0.22em] text-gold">
            Säule {next.no} — {next.tagline}
          </span>
        </Link>
      </div>
    </section>
  );
}

/** Numbered chapter band inside a pillar page. */
export function PillarChapter({
  no,
  title,
  intro,
  tone = "kalk",
  children,
}: {
  no: string;
  title: string;
  intro?: string;
  tone?: "kalk" | "cream" | "night";
  children?: React.ReactNode;
}) {
  const dark = tone === "night";
  const bg = tone === "night" ? "bg-night" : tone === "cream" ? "bg-cream" : "bg-kalk";
  return (
    <section className={`${bg} px-6 py-20 lg:px-10 lg:py-28 ${dark ? "text-cream" : "text-night"}`}>
      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <div
            className={`mb-12 flex flex-wrap items-baseline justify-between gap-4 border-b pb-5 lg:mb-16 ${
              dark ? "border-cream/20" : "border-night/20"
            }`}
          >
            <p
              className={`text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${
                dark ? "text-gold" : "text-terrakotta"
              }`}
            >
              ( {no} ) {title}
            </p>
          </div>
        </Reveal>
        {intro && (
          <Reveal>
            <p
              className={`mb-14 max-w-2xl text-base leading-relaxed lg:text-lg ${
                dark ? "text-cream/75" : "text-night/75"
              }`}
            >
              {intro}
            </p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
