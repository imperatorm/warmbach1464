import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { WarmbachLockup } from "./WarmbachLockup";

/**
 * Hero — the title sheet, per the Figma source (node 53:58): the still of the
 * lit distillery room full-bleed, the wordmark set over it as a ghosted
 * "1464" in Grand Slang B-Side with "by WARMBACH" reading across the middle,
 * then the statement, subtitle and status capsule bottom-aligned.
 *
 * The negative bottom margin lets the next band's rounded top corners lift
 * over the image — the page opens like a sheet laid on the room.
 *
 * The photograph is pinned to the viewport (`fixed`) and the text scrolls
 * past it. `clip-path: inset(0)` on the section is what keeps the pinned
 * image confined to the hero — `overflow: hidden` does not clip fixed
 * descendants, clip-path does — so it only ever shows through this box and
 * disappears once the hero has scrolled away.
 */
export function HeroFilm() {
  return (
    <section className="relative -mb-8 h-[100svh] overflow-hidden bg-night [clip-path:inset(0)]">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0">
        <Image
          src="/figma/hero-bar-interior.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Legibility: a soft wash overall, deeper where the type sits */}
        <div className="absolute inset-0 bg-night/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/35 to-transparent" />
      </div>

      {/* Frame rails — the folio marks that run through the whole sheet */}
      <p className="t-rail absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 text-cream/60 lg:left-6 lg:block">
        47°27′ N · 12°23′ O — 760 m ü. A.
      </p>
      <p className="t-rail absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rotate-180 text-cream/60 lg:right-6 lg:block">
        Salbuch · Anno 1464
      </p>

      {/* The wordmark lockup sits in the free space above the statement, so the
          two can never collide on a short viewport; the "by WARMBACH" line
          rides the lower half of the ghosted numeral, as in the comp.
          WarmbachLockup measures the numeral and fits WARMBACH to its exact
          width, so the W always sits under the 1 and the H under the last 4. */}
      {/* No z-index here on purpose: a z-index would start a stacking context,
          and the numeral's soft-light blend would then mix with that empty
          layer instead of the photograph. DOM order already keeps it on top. */}
      <div className="relative flex h-full flex-col">
        {/* pt clears the fixed header, so the lockup centres in the visible area */}
        <div className="pointer-events-none relative flex flex-1 select-none items-center justify-center pt-[88px]">
          <WarmbachLockup />
        </div>

      {/* Height-aware (svh) as well as width-aware, so a wide-but-short laptop
          screen doesn't push the statement and capsule off the bottom. */}
      <div className="z-10 flex flex-col items-center px-6 pb-[clamp(2.5rem,7svh,5rem)] text-center">
        {/* Still the page's h1, but set in the body-text voice — the lockup
            above carries the display weight now. */}
        <Reveal delay={0.14}>
          <h1 className="max-w-[440px] text-sm font-medium leading-relaxed text-cream/75 md:text-base">
            Seit 1464 auf demselben Boden
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-2 max-w-[440px] text-sm font-medium leading-relaxed text-cream/75 md:text-base">
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
              className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-cream px-5 text-sm font-medium uppercase text-night transition-colors duration-300 hover:bg-gold"
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
