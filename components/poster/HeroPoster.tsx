import { Reveal } from "@/components/ui/Reveal";

/**
 * Poster hero (Escape composition): the alpine film full-bleed, the manifesto
 * as a SPLIT statement — the opening stacked hard top-left, the resolution
 * landing bottom-right — with a small caps block offset mid-right and vertical
 * micro rails pinned to both frame edges. No object, no data strip: the type
 * IS the poster.
 */
export function HeroPoster() {
  return (
    <section className="relative h-[100svh] overflow-hidden bg-night">
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
      {/* Legibility scrims — deep at the corners the type occupies */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night/75 via-night/30 to-night/80" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/45 via-transparent to-night/45" />

      {/* Side rails */}
      <p className="t-rail absolute left-4 top-1/2 z-10 -translate-y-1/2 text-cream/60 lg:left-6">
        Warmbachhof · Kitzbühel — 47°27′ N · 12°23′ O
      </p>
      <p className="t-rail absolute right-4 top-1/2 z-10 -translate-y-1/2 rotate-180 text-cream/60 lg:right-6">
        Seit 1464 · Direkt vom Hof
      </p>

      {/* Opening statement — hard top-left */}
      <div className="absolute left-10 top-[12svh] z-10 lg:left-16">
        <Reveal y={34}>
          <h1 className="t-poster text-[clamp(2.6rem,8.5vw,7.5rem)] text-cream [text-shadow:0_2px_40px_rgba(0,0,0,0.45)]">
            Wir haben
            <br />
            nichts
            <br />
            erfunden.
          </h1>
        </Reveal>
      </div>

      {/* Caps block — offset mid-right, the "why" in miniature */}
      <Reveal delay={0.35} className="absolute right-8 top-[38svh] z-10 max-w-[230px] sm:right-10 sm:max-w-[300px] lg:right-16 lg:top-[34svh]">
        <p className="text-[0.68rem] font-semibold uppercase leading-relaxed tracking-[0.18em] text-gold [text-shadow:0_1px_18px_rgba(0,0,0,0.6)]">
          1464 ist der Grund, warum es diese Marke gibt. Sechsundzwanzig Generationen. Eine
          Quelle. Ein Osthang.
        </p>
      </Reveal>

      {/* Resolution — landing bottom-right */}
      <div className="absolute bottom-[10svh] right-10 z-10 text-right lg:right-16">
        <Reveal delay={0.2} y={34}>
          <p className="t-poster text-[clamp(2rem,6.5vw,5.5rem)] text-cream [text-shadow:0_2px_40px_rgba(0,0,0,0.45)]">
            Wir haben es nur
            <br />
            wiedergefunden.
          </p>
        </Reveal>
      </div>

      {/* Quiet scroll cue, bottom-left where the eye exits */}
      <p className="absolute bottom-6 left-10 z-10 text-[0.6rem] uppercase tracking-[0.3em] text-cream/60 lg:left-16">
        Scroll ↓
      </p>
    </section>
  );
}
