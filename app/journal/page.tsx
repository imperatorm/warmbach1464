import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { journal, journalByYear } from "@/lib/journal";

export const metadata = {
  title: "Journal — 1464byW",
  description:
    "Was am Hof passiert, schreiben wir auf: Brennbetrieb, Markenregister und Pomologie am Osthang über Kitzbühel.",
};

const [lead, ...rest] = journal;
const years = journalByYear();

/**
 * Journal — the estate's running record, set as an index rather than a card
 * wall (OpenAI's year-gutter index, Plain's dated rows). The newest entry
 * takes the lead spread; everything else lists under its year, so the page
 * reads like the chronicle it belongs to.
 */
export default function JournalPage() {
  return (
    <div className="bg-night">
      {/* Masthead */}
      <header className="px-6 pb-16 pt-32 lg:px-10 lg:pb-20 lg:pt-40">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <div className="flex items-start justify-between gap-8 border-b border-cream/20 pb-6">
              <h1 className="t-hero text-[clamp(2.6rem,8vw,6rem)] text-cream">Journal</h1>
              <span className="pt-2 font-body text-sm tabular-nums text-cream/60">
                {String(journal.length).padStart(2, "0")}
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-cream/75 lg:text-base">
              Was am Hof passiert, schreiben wir auf — Brennbetrieb, Register und die
              Arbeit am Osthang. Kein Redaktionsplan, nur das, was tatsächlich
              geschehen ist.
            </p>
          </Reveal>
        </div>
      </header>

      {/* Lead entry */}
      <section className="px-6 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <article className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="relative aspect-[16/10] overflow-hidden lg:col-span-8">
                <Image
                  src={lead.image}
                  alt={lead.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 62vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="lg:col-span-4 lg:self-end">
                <p className="text-[0.62rem] uppercase tracking-[0.24em] text-gold">
                  {lead.kicker} — Neuester Eintrag
                </p>
                <h2 className="t-hero mt-4 text-[clamp(1.6rem,3vw,2.4rem)] text-cream">
                  {lead.title}
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/75">
                  {lead.excerpt}
                </p>
                <time
                  dateTime={lead.iso}
                  className="mt-6 block text-[0.62rem] uppercase tracking-[0.22em] text-cream/60"
                >
                  {lead.date}
                </time>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* The index */}
      <section className="px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1500px]">
          {years.map(([year, entries]) => (
            <div key={year} className="border-t border-cream/20 pt-8 [&+div]:mt-16">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[120px_1fr] lg:gap-10">
                <p className="font-body text-[0.72rem] uppercase tracking-[0.22em] text-cream/60">
                  {year}
                </p>

                <ol>
                  {entries.map((e) => {
                    const isLead = e.iso === lead.iso;
                    return (
                      <li
                        key={e.iso}
                        className="border-b border-cream/12 last:border-b-0"
                      >
                        <Reveal>
                          <article className="grid grid-cols-1 items-baseline gap-x-8 gap-y-2 py-6 sm:grid-cols-[1fr_auto]">
                            <div>
                              <h3 className="text-lg font-medium text-cream lg:text-xl">
                                {e.title}
                              </h3>
                              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cream/70">
                                {e.excerpt}
                              </p>
                            </div>
                            <p className="flex items-baseline gap-4 text-[0.62rem] uppercase tracking-[0.2em] text-cream/60 sm:justify-end">
                              <span className="text-gold">{e.kicker}</span>
                              <time dateTime={e.iso}>{e.date}</time>
                              {isLead && <span className="text-cream/45">— oben</span>}
                            </p>
                          </article>
                        </Reveal>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          ))}

          {/* Honest close: the record is short because the distillery is new */}
          <Reveal>
            <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-cream/15 pt-6">
              <p className="max-w-md text-xs leading-relaxed text-cream/70">
                Der Brennbetrieb läuft seit Mai 2026. Das Journal wächst mit ihm — wir
                tragen ein, was passiert, nicht was sich gut liest.
              </p>
              <Link
                href="/club/mitglied-werden"
                data-cursor
                className="rounded-full bg-cream px-6 py-3 text-sm font-medium text-night transition-colors duration-300 hover:bg-gold"
              >
                Einträge per Post erhalten
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
