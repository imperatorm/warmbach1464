import type { Metadata } from "next";
import { ParallelChronik } from "@/components/timeline/ParallelChronik";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Chronik — Kitzbühel & Warmbach | 1464byW",
  description:
    "Zwei Geschichten auf einer Zeitachse: die Stadt Kitzbühel (um 1165) und der Warmbachhof (1464) — an fünf Stellen sichtbar verbunden.",
};

const eyebrow = "font-body text-[0.7rem] font-medium uppercase tracking-[0.22em]";

/**
 * Säule I · Zeit — Unterwelt „Die Chronik". Der Doppel-Zeitstrahl Kitzbühel ↔ Warmbach.
 * Fassade-Rhythmus: helles Band (Kopf + die zwei Geschichten) → dunkles Feature-Band
 * (der Doppel-Zeitstrahl bleibt dunkel). Inhalt aus lib/chronik.ts via <ParallelChronik>.
 */
export default function ZeitChronikPage() {
  return (
    <div>
      {/* Helles Band — Kopf + die zwei flankierenden Geschichten */}
      <section className="bg-kalk px-6 pb-16 pt-32 text-night lg:px-10 lg:pt-40">
        <div className="mx-auto max-w-[1500px]">
          <Reveal className="text-center">
            <p className={`${eyebrow} mb-4 text-terrakotta`}>Säule I · Zeit — Die Chronik</p>
            <h1 className="t-h1 mb-6 text-night">
              Kitzbühel <span className="text-terrakotta">↔</span> Warmbach
            </h1>
            <p className="t-lead mx-auto mb-16 max-w-2xl !text-night/70">
              Der Warmbachhof ist kein isolierter Punkt. Seit seiner ersten Erwähnung 1464 ist er
              eingewoben in eine Stadtgeschichte, die schon um 1165 beginnt — an fünf Stellen
              berühren sich beide Wege.
            </p>
          </Reveal>

          <Reveal>
            <div className="grid items-center gap-8 border-t border-copper/20 pt-10 lg:grid-cols-[0.8fr_1.15fr_1.15fr_0.8fr] lg:gap-10">
              <figure className="border-l border-copper/30 pl-5">
                <blockquote className="font-display text-sm italic leading-relaxed text-copper">
                  „Zog ein Sturm über den Wilden Kaiser, hissten die Bauern des Tennerhofs ein
                  weißes Tuch — eine stille Warnung über dem Tal."
                </blockquote>
                <figcaption className="mt-3 text-xs leading-relaxed text-copper/70">
                  Der Tennerhof — seit 1416 · überliefert
                </figcaption>
              </figure>

              <div>
                <p className={`${eyebrow} mb-3 text-terrakotta`}>Die Stadt</p>
                <h2 className="t-h3 mb-3 text-night">Kitzbühel</h2>
                <p className="text-sm leading-relaxed text-night/75">
                  Um 1165 erstmals als „Chizbuhel“ genannt, 1271 das Stadtrecht. Der Silber- und
                  Kupferbergbau macht Kitzbühel im 16. Jahrhundert reich; nach seinem Ende 1772
                  verarmt der Ort. Erst Eisenbahn (1875), Skilauf (1893), die alte Wirtshaus-Kultur
                  — etwa der Stanglwirt — und das erste Grandhotel (1903) wenden das Blatt. Heute
                  steht der Name Kitzbühel rund um den Globus für Weltgeltung.
                </p>
              </div>

              <div>
                <p className={`${eyebrow} mb-3 text-terrakotta`}>Der Hof</p>
                <h2 className="t-h3 mb-3 text-night">Der Warmbachhof</h2>
                <p className="text-sm leading-relaxed text-night/75">
                  1464 erscheint der Warmbachhof erstmals im Kitzbüheler Salbuch. Über Jahrhunderte
                  ein selbstversorgender Alpenhof — 1632 zählt Thomas Hofer 28 Kühe und 425 Pfund
                  Schmalz —, wandert er durch viele Hände und bleibt doch in Betrieb. 2018 übernimmt
                  ihn die Familie Wehrmann und nimmt ihn als Edelbrand-Manufaktur in Betrieb — der
                  wohl bedeutendste Wendepunkt: 562 Jahre nach der ersten Erwähnung brennt der Hof
                  zum ersten Mal selbst.
                </p>
              </div>

              <figure className="border-l border-copper/30 pl-5">
                <blockquote className="font-display text-sm italic leading-relaxed text-copper">
                  „Wer das erste Mal da ist, hat nicht das Bedürfnis, gleich wieder aus der Stadt
                  zu sausen, sondern will erstmal eine Weile verbleiben."
                </blockquote>
                <figcaption className="mt-3 text-xs leading-relaxed text-copper/70">
                  Pepi Treichl, Kitzbüheler Stadtführer und Urgestein
                </figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Dunkles Feature-Band — der Doppel-Zeitstrahl + Quellnote */}
      <section className="px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1500px]">
          <ParallelChronik />

          <Reveal>
            <div className="gold-rule mt-24 opacity-30" />
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-stone">
              Jede Jahreszahl ist belegt — die Stadtgeschichte aus öffentlichen Quellen (unter jeder
              Station genannt), die Hofchronik aus der überlieferten Hofdokumentation des Kitzbüheler
              Salbuchs.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
