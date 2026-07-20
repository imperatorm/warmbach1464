import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Staggered estate spread (Escape's small-image / offset-text rhythm): a
 * modest photo hanging left with the reading block offset right, then twin
 * mini-columns with a second small specimen right — whitespace does the
 * composition, nothing fills its column.
 */
export function EstateSpread() {
  return (
    <section className="bg-kalk px-6 pb-24 text-night lg:px-16 lg:pb-36">
      <div className="mx-auto max-w-[1500px]">
        {/* Beat 1 — small photo left, reading block offset right */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <div className="relative aspect-[4/5] max-w-[360px] overflow-hidden">
              <Image
                src="/gallery/warmbach/img_0041.jpg"
                alt="Geschnitzte Balkone des Warmbachhofs im Morgenlicht"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 360px, 80vw"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-7 lg:mt-24">
            <p className="max-w-xl text-base leading-relaxed text-night/75 lg:text-lg">
              Seit Mai 2026 arbeitet im Gewölbe die kupferne Kothe-Anlage — 100 und 400
              Liter, schonender Zweifachbrand, Engschnitt im Herzstück. Darüber: Bar und
              Lounge im wiederaufgebauten Holz des Brixentals. Und jetzt zeigen wir den
              Ort, an dem alles steht.
            </p>
          </Reveal>
        </div>

        {/* Beat 2 — twin mini-columns + small specimen right */}
        <div className="mt-24 grid grid-cols-1 gap-10 lg:mt-36 lg:grid-cols-12">
          <Reveal className="lg:col-span-3 lg:col-start-1">
            <p className="text-sm leading-relaxed text-night/70">
              Nach Brixentaler Bauernhof-Vorbild wiederaufgebaut — Holzbau Obermoser,
              Aurach. Jeder Balken eine Entscheidung für die nächsten hundert Jahre.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-3 lg:col-start-5">
            <p className="text-sm leading-relaxed text-night/70">
              Die Kothe-Anlage: katalytische Kupferschicht, Kolonne mit drei
              Umkehrkochböden. Einmaischen, schonender Zweifachbrand, Engschnitt im
              Herzstück. Brennmeister: René Dubitzky.
            </p>
          </Reveal>
          <Reveal delay={0.16} className="lg:col-span-3 lg:col-start-10 lg:-mt-16">
            <div className="relative aspect-[3/4] max-w-[280px] overflow-hidden">
              <Image
                src="/gallery/warmbach/img_0080.jpg"
                alt="Die kupferne Kothe-Brennblase mit der Prägung 1464"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 280px, 60vw"
              />
            </div>
            <p className="mt-3 text-[0.62rem] uppercase tracking-[0.22em] text-copper">
              Das Kupfer · Gewölbe
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
