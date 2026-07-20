import Image from "next/image";
import Link from "next/link";
import { ChapterHead } from "./ChapterHead";
import { Reveal } from "@/components/ui/Reveal";

// Assembly-Coffee-style provenance register — every row backed by lib/content
// and brand_memory, no invented claims.
const SPECS = [
  { k: "Glas", v: "Tiroler Glaskunst" },
  { k: "Brand", v: "Zweifachbrand · Kupfer" },
  { k: "Wasser", v: "Quellwasser · 7 °C" },
  { k: "Reife", v: "36 Monate, mindestens" },
  { k: "Siegel", v: "Wachs · Zertifikat" },
  { k: "Nummer", v: "Handnummeriert" },
];

/**
 * Chapter 03 — die Flaschenkammer. The one composition the sheet was
 * missing: the product itself, staged the way the strongest dark-luxury
 * references stage it (Fey / Resend / Telepathic Instruments on Mobbin) —
 * a single spotlit object on near-black, a quiet spec register beside it,
 * one annotation, one exit. No carousel, no noise.
 */
export function BottleChamber() {
  return (
    <section className="relative overflow-hidden bg-night px-6 py-24 text-cream lg:px-10 lg:py-36">
      {/* Spotlight — the only light in the room falls on the bottle */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_50%_45%,_rgba(184,137,58,0.13),_transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1500px]">
        <ChapterHead no="03" title="Die Flasche" aside="Säule V · Ein Gefäß mit Denkmalwürde" tone="dark" />

        <div className="grid grid-cols-1 items-center gap-y-14 lg:grid-cols-12 lg:gap-x-8">
          {/* Provenance register — the quiet spec table, left of the light */}
          <Reveal className="order-2 lg:order-1 lg:col-span-3">
            <p className="font-display text-lg italic leading-snug text-cream/80">
              Nicht Verpackung — Tiroler Glasbläsertradition mit Wurzeln im 18.&nbsp;Jahrhundert.
            </p>
            <dl className="mt-8">
              {SPECS.map((s) => (
                <div
                  key={s.k}
                  className="flex items-baseline justify-between gap-4 border-t border-hairline/15 py-3 first:border-t-0"
                >
                  <dt className="text-[0.6rem] uppercase tracking-[0.28em] text-cream/60">{s.k}</dt>
                  <dd className="text-right text-[0.7rem] uppercase tracking-[0.14em] text-cream/85">{s.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* The bottle — one object, one light */}
          <Reveal className="order-1 lg:order-2 lg:col-span-6" y={28}>
            {/* Kept near the shot's native size (356×494) — Fey-style: a small
                lit object in a large dark room, instead of a soft upscale. */}
            <div className="relative mx-auto aspect-[356/494] w-full max-w-[390px]">
              <Image
                src="/flasche/shot-front.jpg"
                alt="Die Warmbach-Flasche im Spotlicht vor dunklem Grund"
                fill
                className="object-cover"
                sizes="(min-width: 640px) 390px, 88vw"
              />
              {/* Telepathic-style annotation, anchored to the plaque */}
              <div className="absolute bottom-5 left-5 border-l border-gold/60 pl-3">
                <p className="text-[0.55rem] uppercase tracking-[0.28em] text-cream/60">Kupferplakette</p>
                <p className="mt-1 text-[0.7rem] uppercase tracking-[0.18em] text-gold">Jede Flasche nummeriert</p>
              </div>
            </div>
          </Reveal>

          {/* The exit — one reading block, one door */}
          <Reveal className="order-3 lg:col-span-3" delay={0.1}>
            <p className="max-w-[34ch] text-sm leading-relaxed text-cream/60">
              Herkunft, Hand, Siegel und Editionen — die Flasche erzählt, wo der Brand herkommt,
              bevor man ihn öffnet.
            </p>
            <div className="mt-8 flex flex-col items-start gap-3">
              <Link href="/flasche" data-cursor className="btn-primary">
                <span className="text-[0.72rem] font-medium uppercase tracking-[0.22em]">Zur Flasche</span>
                <span aria-hidden>&rarr;</span>
              </Link>
              <p className="text-[0.6rem] uppercase tracking-[0.22em] text-cream/60">
                Streng limitiert · Direkt vom Hof
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
