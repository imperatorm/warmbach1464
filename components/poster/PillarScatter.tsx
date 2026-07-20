import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The Säulen as a type-scatter (Escape's LIVE / SLOW / FAST): five giant
 * poster words thrown across the light band, each one the door to its
 * Säule, with two small specimens tucked into the gaps and one caps note
 * doing the explaining. Type as image; whitespace as grid.
 */
export function PillarScatter() {
  const word = "t-poster block text-night transition-colors duration-300 hover:text-terrakotta";
  return (
    <section className="overflow-hidden bg-kalk px-6 py-28 text-night lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <Link href="/zeit" data-cursor className={`${word} text-[clamp(3.2rem,12vw,10rem)]`}>
            Zeit
          </Link>
        </Reveal>

        <div className="mt-6 flex flex-wrap items-end justify-end gap-10 lg:mt-2">
          <Reveal delay={0.06} className="hidden max-w-[200px] lg:block">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/gallery/warmbach/img_0059.jpg"
                alt="Der Warmbachhof in der Winterdämmerung"
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/boden" data-cursor className={`${word} text-right text-[clamp(3.2rem,13vw,11rem)]`}>
              Boden
            </Link>
          </Reveal>
        </div>

        <div className="mt-8 grid grid-cols-1 items-end gap-10 lg:mt-4 lg:grid-cols-12">
          <Reveal delay={0.05} className="lg:col-span-3">
            <p className="max-w-[30ch] text-[0.68rem] font-semibold uppercase leading-relaxed tracking-[0.18em] text-copper">
              Fünf Säulen, ein Haus. Zeit, Boden, Bäume, Manufaktur und Flasche — die
              Kapitel, aus denen die Marke gebaut ist. Klick öffnet die Säule.
            </p>
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-8 lg:col-start-5">
            <Link href="/baeume" data-cursor className={`${word} text-center text-[clamp(3.2rem,12vw,10rem)]`}>
              Bäume
            </Link>
          </Reveal>
        </div>

        <div className="mt-8 flex flex-wrap items-start justify-between gap-10 lg:mt-6">
          <Reveal delay={0.08}>
            <Link href="/manufaktur" data-cursor className={`${word} text-[clamp(2.6rem,9vw,7.5rem)]`}>
              Manufaktur
            </Link>
          </Reveal>
          <Reveal delay={0.16} className="hidden max-w-[180px] lg:block lg:pt-6">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/flasche/shot-neck.jpg"
                alt="Der Hals der Warmbach-Flasche mit Kette und Plakette"
                fill
                className="object-cover"
                sizes="180px"
              />
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <Link
            href="/flasche"
            data-cursor
            className={`${word} mt-8 text-right text-[clamp(3.2rem,13vw,11rem)] lg:mt-4`}
          >
            Flasche
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
