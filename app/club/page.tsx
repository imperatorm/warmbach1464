import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Monogram } from "@/components/ui/Monogram";
import { WaitlistSection } from "@/components/sections/WaitlistSection";

export const metadata = {
  title: "Club 1464 — 1464byW",
  description:
    "Eine Schwelle, zwei Türen. Club 1464 — der Sitzkreis für Mitglieder. 1464 Partner — der Zugang für Großhandel, Gastronomie und Distribution.",
};

// Mitglieder-Welt (vormals Founder's Circle) — Inhalt aus dem Konzeptvortrag 08.
const entry = [
  { no: "I", title: "Vorstellung", body: "Sie stellen sich vor — oder werden von einem Mitglied empfohlen. Die Familie lernt Sie kennen." },
  { no: "II", title: "Freigabe", body: "Die Familie Wehrmann entscheidet persönlich. Nicht jede Vorstellung führt zur Aufnahme." },
  { no: "III", title: "Erstkauf", body: "Erst nach der Freigabe aktiviert der Erwerb der Founder's Reserve N°1 Ihren Sitz." },
];

const privileges = [
  { no: "P1", title: "Erstzugriff auf alle Editionen", body: "Sitz vor Markt. Allokation 14 Tage vor jedem öffentlichen Verkauf." },
  { no: "P2", title: "Estate Edition ab 2030", body: "Persönliche Allokation aus den 2024 gepfropften Urapfel-Bäumen — erstmals 2030, einmalig je Mitglied." },
  { no: "P3", title: "Gästehaus Reith", body: "Eine Nacht pro Jahr im Gästehaus (Selbstkosten Verpflegung)." },
  { no: "P4", title: "Hofarchiv", body: "Namentliche Bronzetafel im Brennraum, vom Brennmeister handgraviert — mit Mitgliedsnummer und Aufnahmejahr." },
  { no: "P5", title: "Concierge-Direktdraht", body: "Persönlicher Kontakt zum Hof. Antwort binnen 48 Stunden, persönlich." },
  { no: "P6", title: "Patron-Cask-Vorrecht", body: "Vorrechtsangebot auf alle Patron-Cask-Allokationen — vor allen anderen." },
  { no: "P7", title: "Übertragbar im Erbfall", body: "Einmalig auf eine Person. Die zweite Generation tritt voll privilegiert ein, ohne neuen Erstkauf." },
];

export default function ClubPage() {
  return (
    <div>
      {/* GATEWAY — die Schwelle, zwei Türen */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6 py-32 text-center lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_30%,_rgba(58,74,60,0.55)_0%,_rgba(27,38,31,0.9)_60%)]" />
        <div className="relative w-full max-w-[1100px]">
          <Reveal>
            <p className="t-label mb-8 text-gold">Club · Der Zugang</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="t-display text-cream">1464</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-5 flex items-center justify-center gap-2.5">
              <span className="text-xs uppercase tracking-[0.4em] text-stone [margin-inline-end:-0.4em]">by</span>
              <Monogram className="h-6 w-auto" />
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="mt-8 font-display text-2xl italic text-cream/85 md:text-3xl">Eine Schwelle, zwei Türen.</p>
          </Reveal>

          <div className="mx-auto mt-14 grid max-w-3xl gap-6 text-left md:grid-cols-2">
            <Reveal delay={0.3}>
              <Link href="#mitglieder" data-cursor className="group flex h-full flex-col border border-hairline/25 bg-soot/40 p-8 transition-colors duration-500 hover:border-gold/60">
                <span className="mb-5 flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 font-display text-sm italic text-gold">1464</span>
                <span className="t-label text-stone">Für Mitglieder</span>
                <span className="t-h2 mt-2 text-cream transition-colors group-hover:text-gold">Club 1464</span>
                <span className="mt-3 text-sm leading-relaxed text-cream/70">Der Sitzkreis am Warmbachhof. Persönlich freigegeben, lebenslang, vererbbar.</span>
                <span className="mt-6 text-xs uppercase tracking-[0.18em] text-gold">Mehr erfahren &darr;</span>
              </Link>
            </Reveal>
            <Reveal delay={0.36}>
              <Link href="/club/partner" data-cursor className="group flex h-full flex-col border border-hairline/25 bg-soot/40 p-8 transition-colors duration-500 hover:border-gold/60">
                <span className="mb-5 flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 font-display text-sm italic text-gold">P</span>
                <span className="t-label text-stone">Für den Vertrieb</span>
                <span className="t-h2 mt-2 text-cream transition-colors group-hover:text-gold">1464 Partner</span>
                <span className="mt-3 text-sm leading-relaxed text-cream/70">Für Großhandel, Gastronomie & Distribution. Bestellungen, Allokation, Konditionen.</span>
                <span className="mt-6 text-xs uppercase tracking-[0.18em] text-gold">Partner-Login &rarr;</span>
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.42}>
            <Link href="/sitz" data-cursor className="link-underline mt-12 inline-block text-xs uppercase tracking-[0.18em] text-cream/70">
              Mitglieder · Eintreten &rarr;
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Club 1464 · die Mitglieder-Welt ────────────────────────────── */}
      <span id="mitglieder" className="block scroll-mt-24" />

      {/* Eintritt */}
      <section className="bg-kalk px-6 py-24 text-night lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-terrakotta mb-4">Club 1464 · Eintritt</p>
            <h2 className="t-h1 mb-6 max-w-3xl text-night">Der Weg zum Sitz — Vorstellung, Freigabe, Erstkauf.</h2>
            <p className="t-lead mb-14 max-w-2xl !text-night/70">
              Kein offener Verkauf. Jede Aufnahme wird von der Familie Wehrmann persönlich entschieden —
              erst danach ist der Erstkauf möglich.
            </p>
          </Reveal>
          <div className="grid gap-px overflow-hidden border border-copper/20 bg-copper/20 md:grid-cols-3">
            {entry.map((e) => (
              <Reveal key={e.no} className="card-field p-8 lg:p-10">
                <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-terrakotta mb-5">{e.no}</p>
                <h3 className="t-h3 mb-3 text-cream">{e.title}</h3>
                <p className="text-sm leading-relaxed text-cream/75">{e.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sieben Privilegien */}
      <section className="bg-kalk px-6 py-24 text-night lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-terrakotta mb-4">Sieben Privilegien</p>
            <h2 className="t-h1 mb-16 max-w-3xl text-night">Was der Sitz garantiert.</h2>
          </Reveal>
          <div className="grid gap-px overflow-hidden border border-copper/20 bg-copper/20 sm:grid-cols-2 lg:grid-cols-3">
            {privileges.map((p) => (
              <Reveal key={p.no} className="card-field flex flex-col p-8">
                <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-terrakotta mb-5">{p.no}</p>
                <h3 className="t-h3 mb-3 text-cream">{p.title}</h3>
                <p className="text-sm leading-relaxed text-cream/75">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Beitrag & Dauer */}
      <section className="bg-kalk px-6 py-24 text-night lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-terrakotta mb-5">Beitrag &amp; Dauer</p>
            <h2 className="t-h1 mb-6 text-night">Ein Sitz, eine Lebenszeit.</h2>
            <p className="t-lead max-w-md !text-night/70">
              Nach der persönlichen Freigabe aktiviert der Erstkauf der Founder&rsquo;s Reserve N°1
              (1.464 €) Ihren Sitz. Es gibt keinen Jahresbeitrag — nur die Kosten je Flasche und Edition.
              Die Mitgliedschaft ist lebenslang und einmal vererbbar.
            </p>
            <Link href="/club/mitglied-werden" data-cursor className="btn-primary mt-8 inline-flex !text-night">
              Mitglied werden <span aria-hidden>&rarr;</span>
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <dl className="grid grid-cols-1 gap-px overflow-hidden border border-copper/20 bg-copper/20 sm:grid-cols-2">
              {[
                { t: "Erstkauf", d: "Nach Freigabe — Founder's Reserve N°1 (1.464 €) aktiviert den Sitz." },
                { t: "Kein Jahresbeitrag", d: "Keine Mitgliedsgebühr — nur die Kosten je Flasche." },
                { t: "Dauer", d: "Lebenslang. Ein Sitz, eine Lebenszeit." },
                { t: "Vererbung", d: "Einmalig, auf eine Person, Anzeige binnen 12 Monaten." },
              ].map((s) => (
                <div key={s.t} className="card-field p-6">
                  <dt className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-terrakotta">{s.t}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-cream/80">{s.d}</dd>
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
