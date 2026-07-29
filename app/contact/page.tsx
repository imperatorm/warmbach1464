import type { Metadata } from "next";
import Image from "next/image";
import { brand } from "@/lib/content";
import { ContactForm } from "@/components/v3/ContactForm";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Besuch & Concierge — 1464byW",
  description:
    "Der Warmbachhof in Kitzbühel: Tasting-Reservierung, Gästehaus Reith und Concierge-Anfragen. Kommen Sie — es ist still hier.",
};

/** The three standing facts, set as a caps register (Monte's contact rhythm). */
const REGISTER = [
  {
    label: "Der Hof",
    lines: ["Warmbachhof", "Kitzbühel, Tirol", "Österreich"],
    note: "Sichtachse zum Wilden Kaiser. Brennerei innerhalb der Stadtgrenzen.",
  },
  {
    label: "Concierge",
    lines: [brand.contactEmail],
    note: "Wir antworten persönlich — kein Ticketsystem, keine Warteschleife.",
    mail: true,
  },
  {
    label: "Vor Ort",
    lines: ["Tasting — 40 Sitzplätze", "Gästehaus Reith — auf Anfrage"],
    note: "Reservierung erforderlich. Wer kommt, wird erwartet.",
  },
];

/**
 * Besuch — the visit page as a place, not a form: the house named and shown,
 * the three standing facts in a caps register (Samara's location block, Monte's
 * column rhythm), and the concierge form underneath on night.
 */
export default function ContactPage() {
  return (
    <div>
      {/* Masthead */}
      <header className="bg-kalk px-6 pb-16 pt-32 text-night lg:px-10 lg:pb-20 lg:pt-40">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-terrakotta">
              Besuch &amp; Concierge
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="t-hero mt-6 max-w-[14ch] text-[clamp(2.6rem,7vw,5.6rem)] text-night">
              Kommen Sie. <span className="t-accent">Es ist still hier.</span>
            </h1>
          </Reveal>
        </div>
      </header>

      {/* The house, shown */}
      <section className="bg-kalk px-6 pb-20 text-night lg:px-10 lg:pb-28">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <div className="relative aspect-[16/9] w-full overflow-hidden lg:aspect-[21/9]">
              <Image
                src="/gallery/warmbach/img_0027.jpg"
                alt="Der Warmbachhof vor dem Wilden Kaiser"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <p className="mt-4 flex flex-wrap justify-between gap-4 text-[0.62rem] uppercase tracking-[0.22em] text-terrakotta">
              <span>Der Hof vor dem Wilden Kaiser</span>
              <span>760 m ü. A. · Osthang</span>
              <span>47°27′ N · 12°23′ O</span>
            </p>
          </Reveal>

          {/* The register */}
          <div className="mt-20 grid grid-cols-1 gap-px overflow-hidden border border-night/15 bg-night/15 md:grid-cols-3">
            {REGISTER.map((r, i) => (
              <Reveal key={r.label} delay={i * 0.06}>
                <div className="flex h-full flex-col bg-kalk p-7 lg:p-9">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-terrakotta">
                    {r.label}
                  </p>
                  <div className="mt-6 text-base leading-relaxed text-night">
                    {r.lines.map((l) =>
                      r.mail ? (
                        <a
                          key={l}
                          href={`mailto:${l}`}
                          data-cursor
                          className="link-underline block break-all transition-colors duration-300 hover:text-terrakotta"
                        >
                          {l}
                        </a>
                      ) : (
                        <span key={l} className="block">
                          {l}
                        </span>
                      ),
                    )}
                  </div>
                  <p className="mt-auto pt-6 text-sm leading-relaxed text-night/75">{r.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The request */}
      <section className="bg-night px-6 py-24 text-cream lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 border-b border-cream/20 pb-5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold">
              ( 02 ) Ihre Anfrage
            </p>
            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-cream/60">
              Antwort persönlich
            </p>
          </div>
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-4">
              <h2 className="t-hero text-[clamp(1.7rem,3.2vw,2.5rem)] text-cream">
                Tasting, Patron Cask oder <span className="t-accent">etwas Eigenes</span>
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream/75">
                Schreiben Sie uns, worum es geht. Wir antworten persönlich — nicht
                automatisiert.
              </p>
            </Reveal>
            <div className="lg:col-span-7 lg:col-start-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
