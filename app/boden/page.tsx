import { Reveal } from "@/components/ui/Reveal";
import { PillarNext } from "@/components/sections/PillarShell";
import { PillarHeroV3 } from "@/components/sections/PillarShellV3";
import { BodenTiefenschnitt } from "@/components/sections/BodenTiefenschnitt";
import { pillars } from "@/lib/content";
import { soilArchive, soilStandort, soilPending } from "@/lib/soil";

const pillar = pillars.find((p) => p.slug === "boden")!;

export const metadata = {
  title: "Boden — 1464byW",
  description:
    "Wie beim Wein entscheidet der Boden. Das Terroir des Standorts — Grauwackenzone, Wildschönauer Schiefer, die Quelle — und die Erdanalyse.",
};

export default function BodenPage() {
  return (
    <div>
      <PillarHeroV3 pillar={pillar} />

      {/* ── Variante 3 · Das Terroir (das Territorium, editorial) ───────────── */}
      <section className="bg-kalk px-6 py-20 text-night lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1000px]">
          <Reveal className="text-center">
            <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-terrakotta mb-3">Kapitel i</p>
            <h2 className="t-h1 mb-10 text-night">Das Terroir</h2>
          </Reveal>

          {/* Gerahmtes Leitzitat — der erkennbare Terroir-Block */}
          <Reveal>
            <figure className="relative mx-auto max-w-3xl overflow-hidden border border-gold/25 bg-gradient-to-b from-soot/50 to-night px-8 py-14 text-center lg:px-16 lg:py-16">
              <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
              <blockquote className="font-display text-[1.7rem] italic leading-snug text-cream lg:text-[2.6rem]">
                „Derselbe Berg, der das Obst nährt, lieferte einst das Kupfer."
              </blockquote>
              <figcaption className="t-label mt-7 text-stone">Boden &amp; Brennblase — geologisch verwandt</figcaption>
            </figure>
          </Reveal>

          <Reveal>
            <p className="t-lead mx-auto mt-10 max-w-2xl text-center !text-night/70">
              Kitzbühel liegt in der nördlichen Grauwackenzone; die tragende Einheit ist der
              Wildschönauer Schiefer — graue, grüne und violette Tonschiefer, erzführend.
              Verwitterter Schiefer speichert Wärme und Wasser und gibt seine Mineralität an den
              Osthang ab. Dieselbe Quelle, die durch den Schiefer steigt, nährt den Hof.
            </p>
          </Reveal>

          {/* Standort & Messwerte — feine Bildunterschriften, kein Laborbogen */}
          <Reveal>
            <div className="mx-auto mt-12 max-w-[920px] border-y border-copper/20 py-7">
              <dl className="flex flex-wrap justify-center gap-x-10 gap-y-5 text-center">
                <div>
                  <dt className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-copper">Lage</dt>
                  <dd className="mt-1 font-display text-lg text-night">{soilStandort.hoehe}</dd>
                </div>
                <div>
                  <dt className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-copper">Exposition</dt>
                  <dd className="mt-1 font-display text-lg text-night">Osthang</dd>
                </div>
                <div>
                  <dt className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-copper">Gestein</dt>
                  <dd className="mt-1 font-display text-lg text-night">Wildschönauer&nbsp;Schiefer</dd>
                </div>
                <div>
                  <dt className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-copper">Quelle</dt>
                  <dd className="mt-1 font-display text-lg text-night">7&nbsp;°C</dd>
                </div>
                {soilArchive.slice(0, 4).map((r) => (
                  <div key={r.param}>
                    <dt className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-copper">{r.param.split(" / ")[0]}</dt>
                    <dd className="mt-1 font-display text-lg italic text-terrakotta">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
          {soilPending && (
            <Reveal>
              <p className="mx-auto mt-5 max-w-2xl text-center text-sm italic text-copper">
                Die Messwerte werden aus dem Bodengutachten übernommen, sobald es vorliegt — nur
                Belegtes, keine Schätzungen.
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── Variante 2 · Der Tiefenschnitt (3D) — Einleitung ───────────────── */}
      <section className="border-t border-hairline/10 px-6 pt-20 lg:px-10 lg:pt-28">
        <div className="mx-auto max-w-[1100px]">
          <Reveal>
            <p className="t-label mb-3 text-gold">Kapitel ii</p>
            <h2 className="t-h1 max-w-2xl text-cream">Der Tiefenschnitt — in 3D</h2>
            <p className="t-lead mt-4 max-w-2xl">
              Scrollen Sie in den Boden hinein: Ein Bohrkern sinkt durch die Schichten — vom lebendigen
              Humus über den Verwitterungsboden bis zum erzführenden Wildschönauer Schiefer und dem
              wasserführenden Grund.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3D-Bohrkern als full-bleed Scrollytelling-Track */}
      <BodenTiefenschnitt />

      <PillarNext current="boden" />
    </div>
  );
}
