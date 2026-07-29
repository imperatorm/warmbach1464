import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { MembershipForm } from "@/components/founders/MembershipForm";

export const metadata = {
  title: "Mitglied werden — Club 1464 · 1464byW",
  description:
    "Der Sitzkreis ist auf 1464 begrenzt und gilt auf Lebenszeit. Wer sich verbunden fühlt, kann sich vorstellen — die Familie Wehrmann entscheidet über jede Aufnahme persönlich.",
};

const criteria = [
  { title: "Volljährigkeit & Maß", body: "Wir geben ausschließlich an Volljährige ab. Genuss mit Verantwortung ist Grundbedingung." },
  { title: "Geduld", body: "Hier reift alles über Jahre, ohne Korrektur. Ein Sitz ist keine schnelle Anschaffung, sondern eine lange Beziehung." },
  { title: "Substanz vor Status", body: "Interesse an Herkunft und Handwerk — Boden, Wasser, Baum, Kupfer, Zeit — zählt mehr als der Wunsch nach einem Etikett." },
  { title: "Verbundenheit", body: "Eine persönliche Beziehung zu Kitzbühel, zum Hof oder zum Edelbrand — ein Grund jenseits des Erwerbs." },
  { title: "Diskretion", body: "Der Kreis ist klein — eintausendvierhundertvierundsechzig Sitze. Wir setzen gegenseitige Diskretion voraus." },
];

/**
 * Aufnahme — the candidacy page in the Club's own grammar: the five criteria
 * as a numbered register on hairlines (matching the seven privileges), and the
 * Vorstellung set on night. Bands alternate night → kalk → night so the page
 * never runs two identical chapters together.
 */
export default function MitgliedWerdenPage() {
  return (
    <div>
      {/* Masthead */}
      <section className="relative overflow-hidden bg-night px-6 pb-20 pt-36 text-cream lg:px-10 lg:pb-28 lg:pt-44">
        <span
          aria-hidden
          className="t-poster pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none text-[32vw] leading-none text-cream/[0.05]"
        >
          1464
        </span>

        <div className="relative mx-auto max-w-[1500px]">
          <Reveal>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold">
              Club 1464 · Aufnahme
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="t-hero mt-6 max-w-[16ch] text-[clamp(2.4rem,6.4vw,5rem)] text-cream">
              Der Kreis ist geschlossen, <span className="t-accent">aber nicht verschlossen</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-8 max-w-xl text-sm leading-relaxed text-cream/75 lg:text-base">
              Der Sitzkreis ist auf 1464 begrenzt und gilt auf Lebenszeit. Kein offener
              Verkauf: Aufnahme nur nach persönlicher Freigabe durch die Familie
              Wehrmann — erst danach aktiviert der Erstkauf der Founder&rsquo;s Reserve
              N°1 Ihren Sitz. Wer sich verbunden fühlt, kann sich hier vorstellen.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <Link
              href="/club"
              data-cursor
              className="mt-9 inline-block text-[0.65rem] uppercase tracking-[0.2em] text-cream/70 underline-offset-4 transition-colors duration-300 hover:text-gold hover:underline"
            >
              ← Was der Sitz garantiert
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Criteria as a numbered register ──────────────────────────────── */}
      <section className="bg-kalk px-6 py-24 text-night lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 border-b border-night/20 pb-5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-terrakotta">
                ( 01 ) Was wir erwarten
              </p>
              <p className="text-[0.62rem] uppercase tracking-[0.22em] text-terrakotta">
                Fünf Dinge, die zählen
              </p>
            </div>
          </Reveal>

          <ol className="border-t border-night/15">
            {criteria.map((c, i) => (
              <li key={c.title} className="border-b border-night/15">
                <Reveal>
                  <article className="grid grid-cols-1 items-baseline gap-x-10 gap-y-2 py-7 lg:grid-cols-[64px_minmax(0,26ch)_1fr]">
                    <span className="font-body text-[0.7rem] tabular-nums tracking-[0.2em] text-terrakotta">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-lg font-medium text-night lg:text-xl">{c.title}</h2>
                    <p className="max-w-2xl text-sm leading-relaxed text-night/75">{c.body}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal>
            <p className="mt-10 max-w-lg text-sm leading-relaxed text-night/75">
              Eine Empfehlung durch ein bestehendes Mitglied beschleunigt die Aufnahme —
              Bedingung ist sie nicht.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── The Vorstellung ──────────────────────────────────────────────── */}
      <section className="bg-night px-6 py-24 text-cream lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 border-b border-cream/20 pb-5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold">
                ( 02 ) Ihre Vorstellung
              </p>
              <p className="text-[0.62rem] uppercase tracking-[0.22em] text-cream/60">
                Kein Antrag — eine Vorstellung
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-4">
              <h2 className="t-hero text-[clamp(1.7rem,3.2vw,2.5rem)] text-cream">
                Stellen Sie sich <span className="t-accent">vor</span>
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream/75">
                Nehmen Sie sich Zeit für die drei Fragen; sie sagen uns mehr als jedes
                Formular.
              </p>
            </Reveal>
            <div className="lg:col-span-7 lg:col-start-6">
              <MembershipForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
