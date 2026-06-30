import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = {
  title: "1464 Partner — Vertrieb | 1464byW",
  description:
    "Der kontrollierte Weg des Edelbrands in den Handel. Für Großhandel, Gastronomie, Fachhandel und Distribution: Allokation, Konditionen, Bestellungen — strukturiert an einem Ort.",
};

const segments = [
  { k: "Großhandel", body: "Belieferung im kontrollierten Kontingent — Staffelkonditionen und planbare Allokation je Jahrgang." },
  { k: "Gastronomie", body: "Für Häuser mit Anspruch: kleine Mengen, Tasting-Material und Listung mit Herkunftsgeschichte." },
  { k: "Fachhandel", body: "Kuratierte Spirituosen-Sortimente — nummerierte Flaschen, Echtheitszertifikat, Verkaufsunterlagen." },
  { k: "Distribution", body: "Markt- und Gebietspartner — exklusive Zuteilung, gemeinsame Markenführung, abgestimmte Logistik." },
];

const benefits = [
  { t: "Planbare Allokation", b: "Limitiert je Edition und Jahrgang — transparent reserviert, nicht überzeichnet." },
  { t: "Markenhoheit", b: "Kontrollierter Vertrieb statt Graumarkt. Wer führt, wird ausgewählt." },
  { t: "Echtheit", b: "Jede Flasche nummeriert, mit Echtheitszertifikat und Wachssiegel." },
  { t: "Konditionen", b: "Partnerspezifische Staffeln und Zahlungsziele — im Portal hinterlegt." },
  { t: "Verkaufsmaterial", b: "Bildwelt, Datenblätter und Tasting-Material zum Abruf." },
  { t: "Direktdraht", b: "Vertriebs-Concierge — persönliche Antwort binnen 48 Stunden." },
];

const steps = [
  { n: "I", t: "Anfrage", b: "Sie stellen sich und Ihr Haus vor — Segment, Gebiet, Sortiment." },
  { n: "II", t: "Prüfung & Freigabe", b: "Wir prüfen Passung und Gebietslage. Nicht jede Anfrage führt zur Aufnahme." },
  { n: "III", t: "Konditionen", b: "Partnerspezifische Staffeln und Vertrag werden festgelegt." },
  { n: "IV", t: "Portal-Zugang", b: "Login, Allokation und Bestellung werden freigeschaltet." },
  { n: "V", t: "Bestellen", b: "Laufend, mit planbarer Zuteilung und Lieferterminen." },
];

const modules = [
  { ix: "i", title: "Bestellungen", body: "Neue Order, offene & vergangene Bestellungen, Nachbestellen mit einem Klick." },
  { ix: "ii", title: "Allokation", body: "Zugeteiltes Kontingent je Edition & Jahrgang — abgerufen und verbleibend." },
  { ix: "iii", title: "Konditionen", body: "EK-Preise, Staffeln, Zahlungsziele — partnerspezifisch hinterlegt." },
  { ix: "iv", title: "Lieferung", body: "Lieferadressen, Versandstatus & Tracking, Wunschtermine." },
  { ix: "v", title: "Dokumente", body: "Rechnungen, Echtheitszertifikate, Datenblätter, Marketing-Assets." },
  { ix: "vi", title: "Einstellungen", body: "Firmenprofil, Besteller & Kontakte, Rechnungs- und Lieferpräferenzen." },
];

// Demo-Daten — Platzhalter bis zum Vertriebs-Backend (lib/partner/data.ts).
const allocation = [
  { edition: "Apfel Brand", total: 200, used: 120, status: "aktiv" },
  { edition: "Ambassador Edition", total: 6, used: 6, status: "Warteliste" },
];
const orders = [
  { id: "WB-2027-021", edition: "Apfel Brand", menge: "24", termin: "Okt 2027", status: "in Bearbeitung", open: true },
  { id: "WB-2027-014", edition: "Apfel Brand", menge: "36", termin: "geliefert", status: "abgeschlossen", open: false },
  { id: "WB-2027-009", edition: "Ambassador Edition", menge: "6", termin: "—", status: "Warteliste", open: false },
];

export default function PartnerPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[80vh] items-end overflow-hidden px-6 pb-20 pt-40 lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_28%_22%,_rgba(58,74,60,0.5)_0%,_rgba(27,38,31,0.95)_62%)]" />
        <div className="relative mx-auto w-full max-w-[1400px]">
          <Reveal>
            <Link href="/club" data-cursor className="t-label text-gold/80 hover:text-gold">&larr; Club · Der Zugang</Link>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="t-display mt-6 text-cream">1464 Partner</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="t-h3 mt-6 max-w-2xl italic text-cream/85">Vertrieb mit Markenhoheit.</p>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="t-lead mt-8 max-w-2xl">
              Der kontrollierte Weg unseres Edelbrands in den Handel — limitiert, nummeriert, mit
              Echtheitszertifikat. Hier führen Besteller ihre Bestellungen und Einstellungen selbst aus.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="#login" data-cursor className="btn-primary">Partner-Login <span aria-hidden>&rarr;</span></Link>
              <Link href="#anfrage" data-cursor className="link-underline text-xs uppercase tracking-[0.18em] text-cream/70">Partner werden</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Für wen — Segmente */}
      <section className="border-t border-hairline/10 px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="t-label mb-4 text-gold">Für wen</p>
            <h2 className="t-h1 mb-14 max-w-3xl text-cream">Vier Wege in den Handel.</h2>
          </Reveal>
          <div className="grid gap-px overflow-hidden border border-hairline/15 bg-hairline/10 sm:grid-cols-2 lg:grid-cols-4">
            {segments.map((s) => (
              <Reveal key={s.k} className="flex flex-col bg-night p-7">
                <h3 className="t-h3 text-cream">{s.k}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/70">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Was Partner erhalten */}
      <section className="border-t border-hairline/10 px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="t-label mb-4 text-gold">Das Angebot</p>
            <h2 className="t-h1 mb-14 max-w-3xl text-cream">Was Partner erhalten.</h2>
          </Reveal>
          <div className="grid gap-px overflow-hidden border border-hairline/15 bg-hairline/10 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <Reveal key={b.t} className="flex flex-col bg-night p-7">
                <h3 className="t-h3 text-cream">{b.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/70">{b.b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* So werden Sie Partner — Onboarding */}
      <section className="border-t border-hairline/10 px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="t-label mb-4 text-gold">So werden Sie Partner</p>
            <h2 className="t-h1 mb-14 max-w-3xl text-cream">Fünf Schritte zum Zugang.</h2>
          </Reveal>
          <ol className="grid gap-px overflow-hidden border border-hairline/15 bg-hairline/10 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s) => (
              <Reveal key={s.n} className="flex flex-col bg-night p-7">
                <span className="font-display text-2xl italic text-gold/70">{s.n}</span>
                <h3 className="t-h3 mt-3 text-cream">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/70">{s.b}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Das Portal — Module */}
      <section className="border-t border-hairline/10 px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="t-label mb-4 text-gold">Das Partner-Portal</p>
            <h2 className="t-h1 mb-4 max-w-3xl text-cream">Sechs Module, ein Konto.</h2>
            <p className="t-lead mb-14 max-w-2xl">Funktional auf den Vertrieb ausgelegt — klar, schnell, ohne Reibung.</p>
          </Reveal>
          <div className="grid gap-px overflow-hidden border border-hairline/15 bg-hairline/10 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <Reveal key={m.title} className="flex flex-col bg-night p-7">
                <p className="font-display text-2xl italic text-gold/70">{m.ix}</p>
                <h3 className="t-h3 mt-3 text-cream">{m.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/70">{m.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard-Vorschau */}
      <section className="border-t border-hairline/10 px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <p className="t-label mb-4 text-gold">Vorschau · Im Portal</p>
            <h2 className="t-h1 mb-12 max-w-3xl text-cream">Allokation & Bestellungen auf einen Blick.</h2>
          </Reveal>
          <Reveal>
            <div className="overflow-hidden rounded-xl border border-hairline/20 bg-soot/30">
              <div className="flex items-center justify-between border-b border-hairline/15 bg-night/60 px-6 py-4">
                <span className="font-display text-lg text-cream">1464 Partner · Konto-Übersicht</span>
                <span className="rounded-full border border-gold/40 px-3 py-1 text-xs uppercase tracking-[0.14em] text-gold">Demo</span>
              </div>

              {/* Allokation */}
              <div className="grid gap-px bg-hairline/10 lg:grid-cols-2">
                {allocation.map((a) => {
                  const pct = Math.min(100, Math.round((a.used / a.total) * 100));
                  return (
                    <div key={a.edition} className="bg-night p-6">
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="font-display text-xl text-cream">{a.edition}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs ${a.status === "aktiv" ? "bg-gold/20 text-gold" : "bg-hairline/15 text-stone"}`}>{a.status}</span>
                      </div>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-stone">
                        Allokation 2027 · {a.used} / {a.total} abgerufen
                      </p>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-hairline/15">
                        <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Offene Bestellungen */}
              <div className="border-t border-hairline/15 px-6 py-5">
                <p className="t-label mb-4 text-stone">Bestellungen</p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="text-xs uppercase tracking-[0.14em] text-stone">
                        <th className="border-b border-hairline/15 pb-3 pr-4 font-medium">Bestell-Nr.</th>
                        <th className="border-b border-hairline/15 pb-3 pr-4 font-medium">Edition</th>
                        <th className="border-b border-hairline/15 pb-3 pr-4 font-medium">Menge</th>
                        <th className="border-b border-hairline/15 pb-3 pr-4 font-medium">Liefertermin</th>
                        <th className="border-b border-hairline/15 pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id} className="text-cream/85">
                          <td className="border-b border-hairline/10 py-3.5 pr-4 font-mono text-xs text-cream/70">{o.id}</td>
                          <td className="border-b border-hairline/10 py-3.5 pr-4">{o.edition}</td>
                          <td className="border-b border-hairline/10 py-3.5 pr-4">{o.menge}</td>
                          <td className="border-b border-hairline/10 py-3.5 pr-4 text-cream/70">{o.termin}</td>
                          <td className="border-b border-hairline/10 py-3.5">
                            <span className={`rounded-full px-3 py-1 text-xs ${o.open ? "bg-gold/20 text-gold" : "bg-hairline/15 text-stone"}`}>{o.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-stone">Demo-Ansicht · Werte sind Platzhalter, bis das Vertriebs-Backend angebunden ist.</p>
          </Reveal>
        </div>
      </section>

      {/* Login + Anfrage */}
      <section id="login" className="scroll-mt-24 border-t border-hairline/10 px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Login */}
          <Reveal>
            <p className="t-label mb-4 text-gold">Partner-Zugang</p>
            <h2 className="t-h2 mb-6 text-cream">Anmelden.</h2>
            <form className="flex flex-col gap-4" action="#" method="post" aria-label="Partner-Login">
              <label className="flex flex-col gap-2 text-sm text-cream/80">
                Partner-Nummer oder E-Mail
                <input
                  type="text"
                  name="partner"
                  autoComplete="username"
                  className="min-h-[48px] border border-hairline/30 bg-night px-4 py-3 text-cream focus:border-gold focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-cream/80">
                Passwort
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  className="min-h-[48px] border border-hairline/30 bg-night px-4 py-3 text-cream focus:border-gold focus:outline-none"
                />
              </label>
              <button type="button" className="btn-primary mt-1 justify-center">Eintreten <span aria-hidden>&rarr;</span></button>
            </form>
            <p className="mt-5 text-xs text-stone">
              Prototyp — Login und Bestell-Mechanik werden mit dem Vertriebs-Backend angebunden.
            </p>
          </Reveal>

          {/* Anfrage */}
          <Reveal delay={0.1} id="anfrage" className="scroll-mt-24 flex flex-col border-l border-hairline/15 pl-12 lg:pl-16">
            <p className="t-label mb-4 text-gold">Noch kein Konto</p>
            <h2 className="t-h2 mb-6 text-cream">Partner werden.</h2>
            <p className="t-lead mb-8 max-w-md">
              Stellen Sie sich und Ihr Haus vor — wir prüfen Passung, Gebiet und Sortiment und melden uns
              persönlich. Aufnahme nur nach Freigabe.
            </p>
            <Link href="/contact" data-cursor className="btn-primary self-start">
              Anfrage an den Vertrieb <span aria-hidden>&rarr;</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
