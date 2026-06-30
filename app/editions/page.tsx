import { Reveal } from "@/components/ui/Reveal";

export const metadata = {
  title: "Editionen — 1464byW",
  description: "Die Editionen entstehen — die Darstellung folgt.",
};

// The bottle imagery has been removed for now (the final edition range is open —
// the family's concept shows several). The page is kept as a holding canvas with
// placeholder frames; restore the gallery from lib/content.ts editionVariants once decided.
export default function EditionsPage() {
  return (
    <div>
      {/* Intro */}
      <section className="px-6 pb-16 pt-40 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="t-label mb-8">In Vorbereitung</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="t-display max-w-4xl text-cream">Die Editionen entstehen.</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="t-lead mt-10 max-w-2xl">
              Die Editionen und ihre Darstellung entwickeln wir gemeinsam mit der Familie
              Wehrmann. Hier entsteht der Raum, in dem sichtbar wird, wie die Brände erscheinen.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Placeholder frames — space for the presentation, to be designed */}
      <section className="px-6 pb-28 lg:px-10 lg:pb-40">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="flex aspect-square items-center justify-center border border-dashed border-hairline/25 bg-soot/15">
                <span className="t-label text-stone/55">Darstellung folgt</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
