import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Hero — the title sheet, per the Figma source (node 53:58): the still of the
 * lit distillery room full-bleed, the wordmark set over it as a ghosted
 * "1464" in Grand Slang B-Side with "by WARMBACH" reading across the middle,
 * then the statement, subtitle and status capsule bottom-aligned.
 *
 * The negative bottom margin lets the next band's rounded top corners lift
 * over the image — the page opens like a sheet laid on the room.
 */
export function HeroFilm() {
  return (
    <section className="relative -mb-8 h-[100svh] overflow-hidden bg-night">
      <Image
        src="/figma/hero-bar-interior.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />

      {/* Legibility: a soft wash overall, deeper where the type sits */}
      <div className="pointer-events-none absolute inset-0 bg-night/25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night via-night/35 to-transparent" />

      {/* Frame rails — the folio marks that run through the whole sheet */}
      <p className="t-rail absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 text-cream/60 lg:left-6 lg:block">
        47°27′ N · 12°23′ O — 760 m ü. A.
      </p>
      <p className="t-rail absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rotate-180 text-cream/60 lg:right-6 lg:block">
        Salbuch · Anno 1464
      </p>

      {/* The wordmark lockup sits in the free space above the statement, so the
          two can never collide on a short viewport; the "by WARMBACH" line
          rides the lower half of the ghosted numeral, as in the comp. */}
      <div className="relative z-[5] flex h-full flex-col">
        <div className="pointer-events-none relative flex flex-1 select-none items-center justify-center">
          <p
            aria-hidden
            className="t-poster text-[clamp(4rem,15vw,19.95rem)] leading-[0.75] tracking-[0.12em] text-cream mix-blend-soft-light"
          >
            1464
          </p>
          <div className="absolute inset-x-0 top-[62%] text-center">
            <p className="font-body text-[clamp(0.55rem,0.85vw,0.85rem)] uppercase tracking-[0.28em] text-cream/60">
              by
            </p>
            <h2 className="mt-1 font-display text-[clamp(2rem,5.6vw,7.5rem)] leading-[0.9] tracking-[-0.01em] text-cream">
              WARMBACH
            </h2>
          </div>
        </div>

      <div className="z-10 flex flex-col items-center px-6 pb-16 text-center lg:pb-20">
        <Reveal y={26}>
          <h1 className="font-display max-w-[16ch] text-[clamp(2.2rem,4.6vw,4.625rem)] leading-[1.17] tracking-[-0.014em] text-cream">
            Seit 1464 auf demselben Boden
          </h1>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-7 max-w-[440px] text-sm font-medium leading-relaxed text-cream/75 md:text-base">
            Wie beim Wein entscheidet der Boden — worauf die Bäume stehen, schmeckt man
            später.
          </p>
        </Reveal>

        {/* Status bar — the line and the door in one object */}
        <Reveal delay={0.26}>
          <div className="mt-9 flex items-center gap-4 rounded-full bg-night/45 py-1 pl-6 pr-1 backdrop-blur-md">
            <p className="hidden text-sm font-medium text-cream/90 sm:block">
              Sechsundzwanzig Generationen. Eine Quelle. Ein Osthang.
            </p>
            <p className="text-sm font-medium text-cream/90 sm:hidden">Eine Quelle. Ein Osthang.</p>
            <Link
              href="/club/mitglied-werden"
              data-cursor
              className="shrink-0 rounded-full bg-cream px-5 py-2.5 text-sm font-medium uppercase text-night transition-colors duration-300 hover:bg-gold"
            >
              Club 1464
            </Link>
          </div>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
