import type { Metadata } from "next";
import { brand } from "@/lib/content";
import { NumberedSection } from "@/components/v3/NumberedSection";
import { LineReveal } from "@/components/v3/LineReveal";
import { ContactForm } from "@/components/v3/ContactForm";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Besuch & Concierge — 1464byW",
  description:
    "Der Warmbachhof in Kitzbühel: Tasting-Reservierung, Gästehaus Reith und Concierge-Anfragen. Kommen Sie — es ist still hier.",
};

export default function ContactPage() {
  return (
    <div>
      {/* Kalk-band hero in the v3 grammar — the copy stays, the setting is new */}
      <header className="bg-kalk px-6 pb-20 pt-40 text-night lg:px-10 lg:pb-28">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="mb-8 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-copper">Besuch</p>
          </Reveal>
          <h1 className="max-w-4xl font-display text-[clamp(2.6rem,6.4vw,5.4rem)] italic leading-[1.02] tracking-[-0.01em]">
            <LineReveal lines={["Kommen Sie.", "Es ist still hier."]} />
          </h1>
        </div>
      </header>

      <NumberedSection
        no="01"
        title="Hof & Concierge"
        intro="Sichtachse zum Wilden Kaiser, Brennerei innerhalb der Stadtgrenzen Kitzbühels. Wer kommt, wird erwartet — nicht abgefertigt."
        tone="kalk"
      >
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <Reveal>
            <div className="card-field h-full p-8">
              <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-copper">Hof</p>
              <p className="leading-relaxed text-night/85">
                Warmbachhof
                <br />
                Kitzbühel, Tirol
                <br />
                Österreich
              </p>
              <p className="mt-4 text-sm text-night/60">
                Sichtachse zum Wilden Kaiser. Brennerei innerhalb der Stadtgrenzen Kitzbühels.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="card-field h-full p-8">
              <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-copper">Concierge</p>
              <p className="leading-relaxed text-night/85">
                <a href={`mailto:${brand.contactEmail}`} data-cursor className="link-underline">
                  {brand.contactEmail}
                </a>
                <br />
                Reservierung Tasting (40 Sitzplätze)
                <br />
                Gästehaus Reith — auf Anfrage
              </p>
            </div>
          </Reveal>
        </div>
      </NumberedSection>

      <NumberedSection
        no="02"
        title="Ihre Anfrage"
        intro="Tasting, Patron Cask, Gästehaus oder etwas Eigenes — schreiben Sie uns, worum es geht. Wir antworten persönlich."
        tone="night"
      >
        <div className="max-w-3xl">
          <ContactForm />
        </div>
      </NumberedSection>
    </div>
  );
}
