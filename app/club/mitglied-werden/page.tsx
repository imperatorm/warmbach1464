import { Reveal } from "@/components/ui/Reveal";
import { MembershipForm } from "@/components/founders/MembershipForm";

export const metadata = {
  title: "Mitglied werden — Club 1464 · 1464byW",
  description:
    "Der Sitzkreis ist auf 1464 begrenzt und gilt auf Lebenszeit. Wer sich verbunden fühlt, kann sich vorstellen — die Familie Wehrmann entscheidet über jede Aufnahme persönlich.",
};

const criteria = [
  { no: "I", title: "Volljährigkeit & Maß", body: "Wir geben ausschließlich an Volljährige ab. Genuss mit Verantwortung ist Grundbedingung." },
  { no: "II", title: "Geduld", body: "Hier reift alles über Jahre, ohne Korrektur. Ein Sitz ist keine schnelle Anschaffung, sondern eine lange Beziehung." },
  { no: "III", title: "Substanz vor Status", body: "Interesse an Herkunft und Handwerk — Boden, Wasser, Baum, Kupfer, Zeit — zählt mehr als der Wunsch nach einem Etikett." },
  { no: "IV", title: "Verbundenheit", body: "Eine persönliche Beziehung zu Kitzbühel, zum Hof oder zum Edelbrand — ein Grund jenseits des Erwerbs." },
  { no: "V", title: "Diskretion", body: "Der Kreis ist klein — eintausendvierhundertvierundsechzig Sitze. Wir setzen gegenseitige Diskretion voraus." },
];

export default function MitgliedWerdenPage() {
  return (
    <div>
      {/* Hero */}
      <section className="px-6 pb-16 pt-40 lg:px-10 lg:pb-20">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="t-label mb-8 text-gold">Club 1464 · Aufnahme</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="t-display text-cream">Mitglied werden.</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="t-lead mt-10 max-w-2xl">
              Der Sitzkreis ist auf 1464 begrenzt und gilt auf Lebenszeit. Kein offener Verkauf: Aufnahme nur
              nach persönlicher Freigabe durch die Familie Wehrmann — erst danach aktiviert der Erstkauf der
              Founder&rsquo;s Reserve N°1 Ihren Sitz. Der Kreis ist geschlossen, aber nicht verschlossen: Wer
              sich verbunden fühlt, kann sich hier vorstellen.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Kriterien */}
      <section className="border-t border-hairline/10 px-6 py-24 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="t-label mb-4 text-gold">Was wir erwarten</p>
            <h2 className="t-h1 mb-14 max-w-3xl text-cream">Fünf Dinge, die zählen.</h2>
          </Reveal>
          <div className="grid gap-px overflow-hidden border border-hairline/15 bg-hairline/10 sm:grid-cols-2 lg:grid-cols-3">
            {criteria.map((c) => (
              <Reveal key={c.no} className="bg-night p-8">
                <p className="t-label mb-5 text-gold">{c.no}</p>
                <h3 className="t-h3 mb-3 text-cream">{c.title}</h3>
                <p className="text-sm leading-relaxed text-cream/75">{c.body}</p>
              </Reveal>
            ))}
            <Reveal className="flex flex-col justify-center bg-soot/30 p-8">
              <p className="text-sm leading-relaxed text-cream/70">
                Eine Empfehlung durch ein bestehendes Mitglied beschleunigt die Aufnahme — Bedingung ist sie nicht.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Vorstellung / Formular */}
      <section className="border-t border-hairline/10 px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <p className="t-label mb-5 text-stone">Ihre Vorstellung</p>
            <h2 className="t-h1 mb-6 text-cream">Stellen Sie sich vor.</h2>
            <p className="t-lead max-w-md">
              Kein Antrag im klassischen Sinn — eine Vorstellung. Nehmen Sie sich Zeit für die drei Fragen;
              sie sagen uns mehr als jedes Formular.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6">
            <MembershipForm />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
