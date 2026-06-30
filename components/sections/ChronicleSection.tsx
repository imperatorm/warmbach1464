import { Timeline } from "@/components/timeline/Timeline";
import { Chronometer } from "@/components/holo/Chronometer";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The Hofchronik block: the interactive 562-year timeline, then the holographic
 * chronometer pair ("Tage seit 1464" + countdown to the next New Year).
 * Shared by the home page and the cinematic /experience page.
 */
export function ChronicleSection() {
  return (
    <section className="border-t border-hairline/10 px-6 py-24 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <p className="t-label mb-4">Hofchronik</p>
          <h2 className="t-h1 mb-16 max-w-2xl text-cream">
            562 Jahre, urkundlich verbürgt.
          </h2>
        </Reveal>

        <Timeline />

        <Reveal>
          <div className="gold-rule mb-16 mt-24 opacity-40" />
          <p className="t-label mb-4">Die Zeit, lebendig</p>
          <h3 className="t-h2 mb-12 max-w-2xl text-cream">
            Seit 1464 — und bis zum nächsten Jahreswechsel.
          </h3>
        </Reveal>

        <Chronometer />
      </div>
    </section>
  );
}
