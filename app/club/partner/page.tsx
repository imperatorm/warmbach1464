import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticLink } from "@/components/v3/MagneticLink";
import { AllocationLedger } from "@/components/club/AllocationLedger";
import { PartnerPath, type Step } from "@/components/club/PartnerPath";

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

const steps: Step[] = [
  { n: "I", t: "Anfrage", b: "Sie stellen sich und Ihr Haus vor — Segment, Gebiet, Sortiment." },
  { n: "II", t: "Prüfung & Freigabe", b: "Wir prüfen Passung und Gebietslage. Nicht jede Anfrage führt zur Aufnahme." },
  { n: "III", t: "Konditionen", b: "Partnerspezifische Staffeln und Vertrag werden festgelegt." },
  { n: "IV", t: "Portal-Zugang", b: "Login, Allokation und Bestellung werden freigeschaltet." },
  { n: "V", t: "Bestellen", b: "Laufend, mit planbarer Zuteilung und Lieferterminen." },
];

const modules = [
  { title: "Bestellungen", body: "Neue Order, offene & vergangene Bestellungen, Nachbestellen mit einem Klick." },
  { title: "Allokation", body: "Zugeteiltes Kontingent je Edition & Jahrgang — abgerufen und verbleibend." },
  { title: "Konditionen", body: "EK-Preise, Staffeln, Zahlungsziele — partnerspezifisch hinterlegt." },
  { title: "Lieferung", body: "Lieferadressen, Versandstatus & Tracking, Wunschtermine." },
  { title: "Dokumente", body: "Rechnungen, Echtheitszertifikate, Datenblätter, Marketing-Assets." },
  { title: "Einstellungen", body: "Firmenprofil, Besteller & Kontakte, Rechnungs- und Lieferpräferenzen." },
];

/**
 * 1464 Partner — the trade door, composed around the one thing that actually
 * governs it: allocation. The register leads, the four trade routes are claims
 * against it, the way in is a path you cross rather than a row of cards, and
 * the portal sits on the light band where an instrument belongs.
 *
 * No contingent figure appears anywhere, because none has been set. The
 * register says so in the place the number will go.
 */
export default function PartnerPage() {
  return (
    <div>
      {/* Hero — the house's own bar, held behind the claim */}
      <section className="relative -mb-8 flex min-h-[86svh] items-end overflow-hidden px-6 pb-28 pt-40 lg:px-10">
        <Image
          src="/gallery/warmbach/img_0065.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-night/[0.72]" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-night/70"
        />

        <div className="relative mx-auto w-full max-w-[1500px]">
          <Reveal>
            <Link
              href="/club"
              data-cursor
              className="text-[0.6rem] uppercase tracking-[0.24em] text-gold transition-colors hover:text-cream"
            >
              &larr; Club · Der Zugang
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="t-poster mt-8 text-[clamp(2.8rem,11vw,8.5rem)] uppercase leading-[0.92] text-cream">
              Partner
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <h1 className="t-hero mt-6 max-w-[20ch] text-[clamp(1.6rem,3.4vw,2.8rem)] text-cream">
              Nicht jedes Haus führt 1464. <span className="t-accent">Das ist der Punkt.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="mt-8 max-w-xl text-sm leading-relaxed text-cream/80">
              Der kontrollierte Weg unseres Edelbrands in den Handel — limitiert, nummeriert, mit
              Echtheitszertifikat. Kein Graumarkt, keine offene Distribution: wer führt, wird
              ausgewählt.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <MagneticLink href="#zugang" className="btn-primary">
                Partner-Login <span aria-hidden>&rarr;</span>
              </MagneticLink>
              <Link
                href="#zugang"
                data-cursor
                className="link-underline text-[0.62rem] uppercase tracking-[0.2em] text-cream/75"
              >
                Partner werden
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ( 01 ) The register — the spine of the page */}
      <section className="relative z-10 rounded-t-[28px] bg-kalk px-6 py-24 text-night lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-8 border-b border-night/20 pb-6">
              <h2 className="t-hero max-w-[16ch] text-[clamp(1.9rem,4vw,3.2rem)] text-night">
                ( 01 ) Was zugeteilt wird
              </h2>
              <p className="max-w-xs text-sm leading-relaxed text-night/75">
                Zwei Editionen, jede Flasche nummeriert. Die Menge je Jahrgang wird zugeteilt —
                nicht ausgeschrieben.
              </p>
            </div>
          </Reveal>
          <AllocationLedger />
        </div>
      </section>

      {/* ( 02 ) Four routes into the trade, over a held photograph */}
      <section className="relative -mb-8 overflow-hidden px-6 py-24 lg:px-10 lg:py-32">
        <Image
          src="/gallery/warmbach/img_0086.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-night/[0.88]" />

        <div className="relative mx-auto max-w-[1500px]">
          <Reveal>
            <h2 className="t-hero max-w-[16ch] text-[clamp(1.9rem,4vw,3.2rem)] text-cream">
              ( 02 ) Vier Wege in den Handel
            </h2>
          </Reveal>
          <ul className="mt-16 flex flex-col">
            {segments.map((s, i) => (
              <li key={s.k}>
                <Reveal delay={i * 0.05}>
                  <div className="grid grid-cols-1 gap-4 border-t border-hairline/25 py-8 lg:grid-cols-12 lg:gap-10 lg:py-10">
                    <p className="text-[0.58rem] uppercase tracking-[0.24em] text-gold lg:col-span-1">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="t-hero text-[clamp(1.4rem,2.8vw,2.1rem)] text-cream lg:col-span-4">
                      {s.k}
                    </h3>
                    <p className="max-w-xl text-sm leading-relaxed text-cream/80 lg:col-span-6 lg:col-start-7">
                      {s.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ( 03 ) The path in — pinned */}
      <PartnerPath steps={steps} />

      {/* ( 04 ) The portal, on the light band where an instrument belongs */}
      <section className="relative z-10 rounded-t-[28px] bg-kalk px-6 py-24 text-night lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-8 border-b border-night/20 pb-6">
              <h2 className="t-hero max-w-[18ch] text-[clamp(1.9rem,4vw,3.2rem)] text-night">
                ( 04 ) Das Portal
              </h2>
              <p className="max-w-xs text-sm leading-relaxed text-night/75">
                Sechs Module, ein Konto. Auf den Vertrieb ausgelegt — klar, schnell, ohne Reibung.
              </p>
            </div>
          </Reveal>

          <ul className="mt-14 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m, i) => (
              <li key={m.title}>
                <Reveal delay={(i % 3) * 0.05}>
                  <h3 className="border-t border-night/20 pt-4 text-[0.95rem] font-semibold text-night">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-night/75">{m.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal>
            <p className="mt-20 max-w-xl text-sm leading-relaxed text-night/75">
              So sieht die Kontoübersicht aus, sobald ein Jahrgang eröffnet und Ihr Zugang
              freigeschaltet ist.
            </p>
            <figure className="mt-8 overflow-hidden rounded-[24px] border border-night/15 bg-cream">
              <figcaption className="flex items-center justify-between gap-4 border-b border-night/15 px-6 py-4">
                <span className="t-hero text-[1.05rem] text-night">
                  1464 Partner · Konto-Übersicht
                </span>
                <span className="rounded-full bg-night px-3 py-1 text-[0.55rem] uppercase tracking-[0.2em] text-cream">
                  Beispielansicht
                </span>
              </figcaption>
              <div className="px-6 py-8">
                <p className="text-[0.58rem] uppercase tracking-[0.24em] text-terrakotta">
                  Allokation · laufender Jahrgang
                </p>
                <p className="t-hero mt-4 max-w-[26ch] text-[clamp(1.2rem,2.4vw,1.7rem)] text-night">
                  Noch kein Jahrgang eröffnet — hier stehen Zuteilung, Abruf und Restmenge je
                  Edition.
                </p>
                <p className="mt-6 max-w-lg text-sm leading-relaxed text-night/75">
                  Darunter laufen Bestellungen mit Bestell-Nummer, Menge, Liefertermin und Status.
                  Die Werte kommen aus dem Vertriebs-Backend, sobald es angebunden ist — bis dahin
                  zeigt diese Seite keine.
                </p>
              </div>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ( 05 ) The door */}
      <section id="zugang" className="scroll-mt-24 bg-night px-6 py-24 text-cream lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-[1200px] gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <h2 className="t-hero text-[clamp(1.9rem,4vw,3.2rem)] text-cream">( 05 ) Anmelden</h2>
            <form className="mt-10 flex flex-col gap-6" action="#" method="post" aria-label="Partner-Login">
              <label className="flex flex-col gap-2 text-[0.6rem] uppercase tracking-[0.22em] text-gold">
                Partner-Nummer oder E-Mail
                <input
                  type="text"
                  name="partner"
                  autoComplete="username"
                  className="min-h-[48px] border-b border-hairline/30 bg-transparent py-3 text-base normal-case tracking-normal text-cream focus:border-gold focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-[0.6rem] uppercase tracking-[0.22em] text-gold">
                Passwort
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  className="min-h-[48px] border-b border-hairline/30 bg-transparent py-3 text-base normal-case tracking-normal text-cream focus:border-gold focus:outline-none"
                />
              </label>
              <button type="button" className="btn-primary mt-2 self-start">
                Eintreten <span aria-hidden>&rarr;</span>
              </button>
            </form>
            <p className="mt-6 max-w-sm text-xs leading-relaxed text-stone">
              Prototyp — Login und Bestell-Mechanik werden mit dem Vertriebs-Backend angebunden.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col lg:border-l lg:border-hairline/20 lg:pl-24">
            <h2 className="t-hero text-[clamp(1.9rem,4vw,3.2rem)] text-cream">Partner werden</h2>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-cream/80">
              Stellen Sie sich und Ihr Haus vor — wir prüfen Passung, Gebiet und Sortiment und
              melden uns persönlich innerhalb von 48 Stunden. Aufnahme nur nach Freigabe.
            </p>
            <MagneticLink href="/contact" className="btn-primary mt-10 self-start">
              Anfrage an den Vertrieb <span aria-hidden>&rarr;</span>
            </MagneticLink>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
