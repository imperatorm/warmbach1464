import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Impressum & Datenschutz — 1464byW",
  description: "Impressum, Datenschutz und Altersbestätigung des Warmbachhofs, Kitzbühel.",
};

const SECTIONS = [
  {
    id: "impressum",
    title: "Impressum",
    body: (
      <p>
        WARMBACHHOF · Kitzbühel, Tirol, Österreich. Inhaber: Familie Dr. Hans Wehrmann. Vertreten durch:
        Geschäftsführung Hofbüro. Markenrechtliche Vertretung: Certina IP AG, Grünwald. UID-Nummer: in Anmeldung.
        Aufsichtsbehörde: BH Kitzbühel. Kontakt: concierge@warmbachhof.com.
      </p>
    ),
  },
  {
    id: "privacy",
    title: "Datenschutz",
    body: (
      <p>
        Wir erheben personenbezogene Daten nach DSGVO ausschließlich zur Vertragserfüllung und für die Kommunikation
        mit Interessenten und Mitgliedern. Diese Website verwendet keine Analyse- oder Tracking-Tools und keine
        Drittanbieter-Cookies. Technisch notwendig setzen wir lediglich ein Erstanbieter-Cookie für den
        passwortgeschützten Zugang (wbz_access, Speicherdauer 30 Tage); zusätzlich wird Ihre Altersbestätigung lokal
        auf Ihrem Gerät gespeichert (localStorage). Eine darüber hinausgehende Auswertung findet nicht statt.
      </p>
    ),
  },
  {
    id: "age",
    title: "Altersbestätigung",
    body: (
      <p>
        Der Verkauf alkoholischer Erzeugnisse erfolgt ausschließlich an Volljährige (Mindestalter 18 Jahre). Mit der
        Bestätigung des Geburtsdatums versichern Sie die Wahrheit Ihrer Angabe.
      </p>
    ),
  },
  {
    id: "genuss",
    title: "Verantwortungsvoller Genuss",
    body: (
      <p>
        1464byW steht für bewussten Genuss. Schwangere und Stillende sollten auf den Konsum von Alkohol verzichten.
        Genuss in Maßen ist ein Privileg — und ein Versprechen an die nächste Generation.
      </p>
    ),
  },
];

export default function LegalPage() {
  return (
    <div className="px-6 pb-32 pt-40 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="t-label mb-6">Legal</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="font-display text-[clamp(2rem,4.4vw,3.4rem)] italic leading-[1.08] tracking-[-0.01em] text-cream">
            Impressum · Datenschutz · Altersbestätigung
          </h1>
        </Reveal>

        {/* Anchor TOC — the footer links target these ids */}
        <Reveal delay={0.12}>
          <nav aria-label="Inhalt" className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-b border-hairline/15 pb-8">
            {SECTIONS.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                data-cursor
                className="link-underline text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone transition-colors hover:text-gold"
              >
                {String(i + 1).padStart(2, "0")} — {s.title}
              </a>
            ))}
          </nav>
        </Reveal>

        {SECTIONS.map((s) => (
          <Reveal key={s.id}>
            <section id={s.id} className="mt-14 scroll-mt-28 border-b border-hairline/10 pb-12 last:border-b-0">
              <h2 className="font-display text-2xl italic text-cream">{s.title}</h2>
              <div className="mt-5 max-w-prose text-[0.95rem] leading-relaxed text-cream/75">{s.body}</div>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
