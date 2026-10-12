import { Reveal } from "@/components/ui/Reveal";
import { FmButton } from "./FmButton";

/**
 * The last sheet: the reference closes on a centred invitation with two
 * doors, lit from below. Ours opens the Club — the only commercial door the
 * house has.
 */
export function FmClosing() {
  return (
    <section className="relative isolate overflow-hidden bg-fm-night px-6 py-32 text-center text-fm-beige lg:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_65%_at_50%_105%,rgba(110,146,79,0.5),transparent_66%)]"
      />
      <div className="relative mx-auto max-w-3xl">
        <Reveal>
          <p className="fm-up inline-flex items-center gap-2.5 rounded-full border border-fm-beige/25 px-4 py-2 text-[0.6rem] tracking-[0.2em] text-fm-beige/80">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-fm-copper motion-safe:animate-pulse" />
            Warteliste offen
          </p>
          <h2 className="fm-h mt-8 text-[clamp(2.6rem,6vw,6rem)]">
            Kommen Sie
            <br />
            an den Tisch.
          </h2>
          <p className="fm-up mx-auto mt-8 max-w-[30rem] text-fm-beige/75">
            Direkt vom Hof, in kleiner Zahl. Jede Flasche nummeriert, mit Echtheitszertifikat und
            Wachssiegel. Die Warteliste für Club 1464 ist offen.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <FmButton href="/club/mitglied-werden" tone="solid-beige">
              Mitglied werden
            </FmButton>
            <FmButton href="/contact">Concierge kontaktieren</FmButton>
          </div>
          <p className="fm-up mt-10 text-[0.6rem] tracking-[0.2em] text-fm-beige/50">
            Direktvertrieb an Sammler · Ohne Zwischenhandel
          </p>
        </Reveal>
      </div>
    </section>
  );
}
