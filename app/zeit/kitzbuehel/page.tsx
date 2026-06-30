import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = {
  title: "Die Stadt Kitzbühel — Zeit | 1464byW",
  description:
    "Kitzbühel als Resonanzraum der Marke: das Salbuch als Quelle der Jahreszahl, die Bergbau-Ära, die Sport- und Gastgeber-Heritage.",
};

export default function ZeitKitzbuehelPage() {
  return (
    <article>
      <section className="relative flex min-h-[50vh] items-end overflow-hidden px-6 pb-12 pt-36 lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_28%_18%,_rgba(58,74,60,0.45)_0%,_rgba(27,38,31,0.96)_62%)]" />
        <div className="relative mx-auto w-full max-w-[1000px]">
          <Reveal>
            <Link href="/zeit" data-cursor className="t-label text-gold/80 hover:text-gold">&larr; Säule I · Zeit</Link>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="t-display mt-5 text-cream">Die Stadt</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="t-h3 mt-5 max-w-2xl italic text-cream/85">Warum diese Stadt.</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-kalk px-6 py-16 text-night lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[760px] space-y-7">
          <Reveal>
            <p className="t-lead !text-night/70">
              Kitzbühel ist der kulturelle Resonanzraum der Marke. Das Salbuch ist die Quelle der
              Jahreszahl 1464. Die Bergbau-Ära — Kupfer und Silber am Röhrerbühel, einst mit über 570
              Metern unter den tiefsten Bergwerken der Welt — verbindet die Stadt direkt mit dem Boden
              des Hofs.
            </p>
          </Reveal>
          <Reveal>
            <p className="text-base leading-relaxed text-night/70">
              So schlägt diese Unterseite den Bogen zur Säule Boden: Das Kupfer, das heute in der
              Brennblase glänzt, liegt als Erz im Kitzbüheler Schiefer. „Distilled in Kitzbühel" ist
              hier historisch verankert — Herkunftsbezüge nur, wo belegbar; in Abstimmung mit Stadtarchiv
              und Museum Kitzbühel.
            </p>
          </Reveal>
          <Reveal>
            <blockquote className="border-l-2 border-copper/20 pl-6 font-display text-xl italic leading-relaxed text-copper">
              „Derselbe Berg, der das Obst nährt, lieferte einst das Kupfer."
            </blockquote>
          </Reveal>
        </div>
      </section>

      <section className="bg-kalk px-6 py-12 text-night lg:px-10">
        <div className="mx-auto flex max-w-[760px] items-center justify-between gap-6">
          <Link href="/zeit/hof" data-cursor className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-copper transition-colors hover:text-terrakotta">&larr; Der Hof</Link>
          <Link href="/zeit/chronik" data-cursor className="group text-right">
            <span className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-terrakotta">Weiter</span>
            <span className="t-h3 mt-1 block text-night transition-colors group-hover:text-terrakotta">Die Chronik &rarr;</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
