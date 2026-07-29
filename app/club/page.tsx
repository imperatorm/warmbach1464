import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { WaitlistSection } from "@/components/sections/WaitlistSection";

export const metadata = {
  title: "Club 1464 — 1464byW",
  description:
    "Eine Schwelle, zwei Türen. Club 1464 — der Sitzkreis für Mitglieder. 1464 Partner — der Zugang für Großhandel, Gastronomie und Distribution.",
};

// Inhalt aus dem Konzeptvortrag 08 — unverändert übernommen.
const entry = [
  { no: "I", title: "Vorstellung", body: "Sie stellen sich vor — oder werden von einem Mitglied empfohlen. Die Familie lernt Sie kennen." },
  { no: "II", title: "Freigabe", body: "Die Familie Wehrmann entscheidet persönlich. Nicht jede Vorstellung führt zur Aufnahme." },
  { no: "III", title: "Erstkauf", body: "Erst nach der Freigabe aktiviert der Erwerb der Founder's Reserve N°1 Ihren Sitz." },
];

const privileges = [
  { title: "Erstzugriff auf alle Editionen", body: "Sitz vor Markt. Allokation 14 Tage vor jedem öffentlichen Verkauf." },
  { title: "Estate Edition ab 2030", body: "Persönliche Allokation aus den 2024 gepfropften Urapfel-Bäumen — erstmals 2030, einmalig je Mitglied." },
  { title: "Gästehaus Reith", body: "Eine Nacht pro Jahr im Gästehaus (Selbstkosten Verpflegung)." },
  { title: "Hofarchiv", body: "Namentliche Bronzetafel im Brennraum, vom Brennmeister handgraviert — mit Mitgliedsnummer und Aufnahmejahr." },
  { title: "Concierge-Direktdraht", body: "Persönlicher Kontakt zum Hof. Antwort binnen 48 Stunden, persönlich." },
  { title: "Patron-Cask-Vorrecht", body: "Vorrechtsangebot auf alle Patron-Cask-Allokationen — vor allen anderen." },
  { title: "Übertragbar im Erbfall", body: "Einmalig auf eine Person. Die zweite Generation tritt voll privilegiert ein, ohne neuen Erstkauf." },
];

const terms = [
  { t: "Erstkauf", d: "Nach Freigabe — Founder's Reserve N°1 (1.464 €) aktiviert den Sitz." },
  { t: "Kein Jahresbeitrag", d: "Keine Mitgliedsgebühr — nur die Kosten je Flasche." },
  { t: "Dauer", d: "Lebenslang. Ein Sitz, eine Lebenszeit." },
  { t: "Vererbung", d: "Einmalig, auf eine Person, Anzeige binnen 12 Monaten." },
];

/**
 * Club 1464 — the membership set as a register rather than a card wall
 * (A24's numbered-benefits pattern): the statement and the seven privileges
 * listed against the giant house numeral, the two doors kept side by side,
 * and the terms stated plainly. Bands alternate night/kalk so the page never
 * runs three light chapters together.
 */
export default function ClubPage() {
  return (
    <div>
      {/* ── The threshold ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-night px-6 pb-24 pt-36 text-cream lg:px-10 lg:pb-32 lg:pt-44">
        <span
          aria-hidden
          className="t-poster pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none text-[34vw] leading-none text-cream/[0.05]"
        >
          1464
        </span>

        <div className="relative mx-auto max-w-[1500px]">
          <Reveal>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold">
              Club · Der Zugang
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="t-hero mt-6 max-w-[18ch] text-[clamp(2.4rem,6.4vw,5rem)] text-cream">
              Eine Schwelle, <span className="t-accent">zwei Türen</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-lg text-sm leading-relaxed text-cream/75 lg:text-base">
              Kein offener Verkauf. Der Sitzkreis am Warmbachhof wird persönlich
              freigegeben — und daneben steht der Weg für Handel und Gastronomie.
            </p>
          </Reveal>

          {/* The two doors */}
          <div className="mt-14 grid max-w-4xl grid-cols-1 gap-px overflow-hidden border border-cream/20 bg-cream/20 md:grid-cols-2">
            <Reveal delay={0.24}>
              <Link
                href="#mitglieder"
                data-cursor
                className="group flex h-full flex-col bg-night p-8 transition-colors duration-500 hover:bg-soot lg:p-10"
              >
                <span className="text-[0.62rem] uppercase tracking-[0.24em] text-gold">
                  Für Mitglieder
                </span>
                <span className="t-hero mt-5 text-2xl text-cream lg:text-3xl">Club 1464</span>
                <span className="mt-4 text-sm leading-relaxed text-cream/75">
                  Der Sitzkreis am Warmbachhof. Persönlich freigegeben, lebenslang,
                  vererbbar.
                </span>
                <span className="mt-auto pt-8 text-[0.62rem] uppercase tracking-[0.22em] text-gold transition-transform duration-500 group-hover:translate-y-0.5">
                  Mehr erfahren ↓
                </span>
              </Link>
            </Reveal>
            <Reveal delay={0.3}>
              <Link
                href="/club/partner"
                data-cursor
                className="group flex h-full flex-col bg-night p-8 transition-colors duration-500 hover:bg-soot lg:p-10"
              >
                <span className="text-[0.62rem] uppercase tracking-[0.24em] text-gold">
                  Für den Vertrieb
                </span>
                <span className="t-hero mt-5 text-2xl text-cream lg:text-3xl">1464 Partner</span>
                <span className="mt-4 text-sm leading-relaxed text-cream/75">
                  Für Großhandel, Gastronomie und Distribution. Bestellungen, Allokation,
                  Konditionen.
                </span>
                <span className="mt-auto pt-8 text-[0.62rem] uppercase tracking-[0.22em] text-gold transition-transform duration-500 group-hover:translate-x-1">
                  Partner-Login →
                </span>
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.36}>
            <Link
              href="/sitz"
              data-cursor
              className="mt-10 inline-block text-[0.65rem] uppercase tracking-[0.2em] text-cream/70 underline-offset-4 transition-colors duration-300 hover:text-gold hover:underline"
            >
              Mitglieder · Eintreten →
            </Link>
          </Reveal>
        </div>
      </section>

      <span id="mitglieder" className="block scroll-mt-24" />

      {/* ── Eintritt: three steps ────────────────────────────────────────── */}
      <section className="bg-kalk px-6 py-24 text-night lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 border-b border-night/20 pb-5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-terrakotta">
                ( 01 ) Eintritt
              </p>
              <p className="text-[0.62rem] uppercase tracking-[0.22em] text-terrakotta">
                Vorstellung · Freigabe · Erstkauf
              </p>
            </div>
          </Reveal>
          <Reveal>
            <h2 className="t-hero max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.8rem)] text-night">
              Jede Aufnahme wird <span className="t-accent">persönlich entschieden</span>
            </h2>
          </Reveal>

          <ol className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-night/15 bg-night/15 md:grid-cols-3">
            {entry.map((e, i) => (
              <li key={e.no}>
                <Reveal delay={i * 0.06}>
                  <div className="flex h-full flex-col bg-kalk p-7 lg:p-9">
                    <span className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-terrakotta">
                      {e.no}
                    </span>
                    <h3 className="mt-6 text-xl font-medium text-night">{e.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-night/75">{e.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── The seven privileges, as a numbered register ─────────────────── */}
      <section className="bg-night px-6 py-24 text-cream lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 border-b border-cream/20 pb-5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold">
                ( 02 ) Sieben Privilegien
              </p>
              <p className="text-[0.62rem] uppercase tracking-[0.22em] text-cream/60">
                Was der Sitz garantiert
              </p>
            </div>
          </Reveal>

          <ol className="border-t border-cream/15">
            {privileges.map((p, i) => (
              <li key={p.title} className="border-b border-cream/15">
                <Reveal>
                  <article className="grid grid-cols-1 items-baseline gap-x-10 gap-y-2 py-7 lg:grid-cols-[64px_minmax(0,26ch)_1fr]">
                    <span className="font-body text-[0.7rem] tabular-nums tracking-[0.2em] text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-lg font-medium text-cream lg:text-xl">{p.title}</h3>
                    <p className="max-w-2xl text-sm leading-relaxed text-cream/75">{p.body}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Terms ────────────────────────────────────────────────────────── */}
      <section className="bg-kalk px-6 py-24 text-night lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-terrakotta">
              ( 03 ) Beitrag &amp; Dauer
            </p>
            <h2 className="t-hero mt-6 text-[clamp(1.8rem,3.6vw,2.8rem)] text-night">
              Ein Sitz, eine <span className="t-accent">Lebenszeit</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-night/75 lg:text-base">
              Nach der persönlichen Freigabe aktiviert der Erstkauf der Founder&rsquo;s
              Reserve N°1 (1.464 €) Ihren Sitz. Es gibt keinen Jahresbeitrag — nur die
              Kosten je Flasche und Edition.
            </p>
            <Link
              href="/club/mitglied-werden"
              data-cursor
              className="mt-9 inline-block rounded-full bg-night px-6 py-3 text-sm font-medium text-cream transition-colors duration-300 hover:bg-merlot"
            >
              Mitglied werden
            </Link>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <dl className="border-t border-night/20">
              {terms.map((s) => (
                <div
                  key={s.t}
                  className="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-night/12 py-4 sm:grid-cols-[200px_1fr]"
                >
                  <dt className="text-[0.62rem] uppercase tracking-[0.22em] text-terrakotta">
                    {s.t}
                  </dt>
                  <dd className="text-sm leading-relaxed text-night/80">{s.d}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <WaitlistSection />
    </div>
  );
}
