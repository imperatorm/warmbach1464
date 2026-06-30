import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { pillars, secondary } from "@/lib/content";

/**
 * Home portal after the hero: a compact, structured index of the five pillars,
 * a quiet secondary row (Galerie · Journal · Besuch), and the Club as the
 * threshold set apart at the end.
 *
 * Fassade-Trial: rendered as a light lime-wash (kalk) section — a deliberate
 * breath of daylight between the dark hero and the dark chronicle — with
 * terracotta as the rare warm accent. Both sampled from the Warmbachhof façade
 * (the sage-painted spiral column + the red tulip-on-cream frieze).
 */
const eyebrow = "font-body text-[0.7rem] font-medium uppercase tracking-[0.22em]";

export function PortalGateway() {
  return (
    <section className="relative bg-kalk px-6 py-20 text-night lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
          <p className={`${eyebrow} mb-5 text-terrakotta`}>Die Säulen</p>
          <p className="t-h2 italic text-night">From our soil to your soul</p>
        </Reveal>

        <nav aria-label="Die Säulen" className="border-t border-copper/25">
          {pillars.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.04}>
              <Link
                href={`/${p.slug}`}
                data-cursor
                className="group grid grid-cols-[2rem_1fr_auto] items-baseline gap-5 border-b border-copper/20 py-5 lg:gap-8 lg:py-6"
              >
                <span className={`${eyebrow} text-copper transition-colors duration-500 group-hover:text-terrakotta`}>{p.no}</span>
                <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-display text-2xl text-night transition-colors duration-500 group-hover:text-terrakotta lg:text-3xl">
                    {p.name}
                  </span>
                  <span className="text-sm italic text-copper/80">{p.tagline}</span>
                </span>
                <span
                  aria-hidden
                  className="self-center text-xl text-copper transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-terrakotta"
                >
                  &rarr;
                </span>
              </Link>
            </Reveal>
          ))}
        </nav>

        {/* Sekundär + Club-Schwelle */}
        <Reveal>
          <div className="mt-8 flex flex-col items-center justify-between gap-5 sm:flex-row">
            <div className="flex items-center gap-6">
              {secondary.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  data-cursor
                  className="link-underline text-xs uppercase tracking-[0.18em] text-copper transition-colors hover:text-night"
                >
                  {s.label}
                </Link>
              ))}
            </div>
            <Link
              href="/club"
              data-cursor
              className="group inline-flex items-center gap-3 border border-copper/40 px-5 py-3 transition-colors duration-500 hover:border-terrakotta/70"
            >
              <span className={`${eyebrow} text-terrakotta`}>Schwelle</span>
              <span className="font-display text-lg text-night transition-colors group-hover:text-terrakotta">Club 1464</span>
              <span aria-hidden className="text-terrakotta/70 transition-transform duration-500 group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
