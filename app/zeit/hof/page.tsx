import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = {
  title: "Der Hof — Zeit | 1464byW",
  description:
    "Der Warmbachhof seit 1464 — sechsundzwanzig Eigentümerwechsel, der Wiederaufbau nach Brixentaler Vorbild, die Lage am Fuß des Horns.",
};

export default function ZeitHofPage() {
  return (
    <article>
      <section className="relative flex min-h-[50vh] items-end overflow-hidden px-6 pb-12 pt-36 lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_28%_18%,_rgba(57,77,58,0.45)_0%,_rgba(29,41,29,0.96)_62%)]" />
        <div className="relative mx-auto w-full max-w-[1000px]">
          <Reveal>
            <Link href="/zeit" data-cursor className="t-label text-gold/80 hover:text-gold">&larr; Säule I · Zeit</Link>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="t-display mt-5 text-cream">Der Hof</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="t-h3 mt-5 max-w-2xl italic text-cream/85">Warum dieser Ort.</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-kalk px-6 py-16 text-night lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[760px] space-y-7">
          <Reveal>
            <p className="t-lead !text-night/70">
              Der Warmbachhof ist im Kitzbüheler Salbuch seit 1464 verzeichnet. Über Jahrhunderte ein
              selbstversorgender Alpenhof, wandert er durch sechsundzwanzig Eigentümerwechsel — und
              bleibt doch in Betrieb. Seit 2018 gehört er der Familie Dr. Hans Wehrmann, dem ersten
              Besitzerwechsel außerhalb der Tiroler Bauernreihen.
            </p>
          </Reveal>
          <Reveal>
            <p className="text-base leading-relaxed text-night/70">
              Wiederaufbau nach Brixentaler Bauernhof-Vorbild, ausgeführt von Holzbau Obermoser aus
              Aurach — Holz und Bruchstein, am Fuß des Kitzbüheler Horns. Der Weg vom Bauernhof zur
              Brennerei führt nicht weg von der Geschichte des Ortes, sondern tiefer hinein.
            </p>
          </Reveal>
          <Reveal>
            <blockquote className="border-l-2 border-copper/20 pl-6 font-display text-xl italic leading-relaxed text-night/80">
              „Wir haben nichts erfunden. Wir haben es nur wiedergefunden."
            </blockquote>
          </Reveal>
        </div>
      </section>

      <section className="bg-kalk px-6 py-12 text-night lg:px-10">
        <div className="mx-auto flex max-w-[760px] items-center justify-between gap-6">
          <Link href="/zeit" data-cursor className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-copper transition-colors hover:text-terrakotta">&larr; Zeit</Link>
          <Link href="/zeit/kitzbuehel" data-cursor className="group text-right">
            <span className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-copper">Weiter</span>
            <span className="t-h3 mt-1 block text-night transition-colors group-hover:text-terrakotta">Die Stadt &rarr;</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
