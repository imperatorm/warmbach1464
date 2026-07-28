import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Hero — the alpine film full-bleed with the statement bottom-aligned
 * (Drift composition): a calm sentence-case Whyte heading whose emphasised
 * phrase switches to Garamond italic, a tight subtitle, and the inline
 * status bar (blurred capsule + solid door) instead of a lone button.
 *
 * The negative bottom margin lets the next band's rounded top corners lift
 * over the film — the page opens like a sheet laid on the landscape.
 */
export function HeroFilm() {
  return (
    <section className="relative -mb-8 h-[100svh] overflow-hidden bg-night">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="/video/alpine-poster.jpg"
        aria-hidden="true"
      >
        <source src="/video/alpine.mp4" type="video/mp4" />
      </video>

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

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-6 pb-16 text-center lg:pb-20">
        <Reveal y={26}>
          <h1 className="t-hero max-w-[16ch] text-[clamp(2.6rem,7.4vw,6.5rem)] text-cream">
            Seit 1464 auf{" "}
            <span className="t-accent text-cream">demselben Boden</span>
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
              className="shrink-0 rounded-full bg-cream px-5 py-2.5 text-sm font-medium text-night transition-colors duration-300 hover:bg-gold"
            >
              Club 1464
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
