import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { FmButton } from "./FmButton";

/**
 * The reference "cleaner for the planet" spread: a headline top-left, the
 * body and door bottom-left, a photograph filling the right half and
 * bleeding off the edge. Ours is the maturation claim — glass, not wood.
 */
export function FmZeit() {
  return (
    <section className="bg-fm-beige text-fm-night">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="order-2 flex flex-col justify-between gap-16 px-6 py-20 lg:order-1 lg:px-14 lg:py-28 xl:px-20">
          <Reveal>
            <h2 className="fm-h text-[clamp(2.2rem,4.2vw,4.2rem)] text-fm-moss">
              Ohne Holz.
              <br />
              Ohne Korrektur.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="fm-up max-w-[26rem] text-fm-night/75">
              Drei Jahre Stille im Glasballon. Kein Fass, das färbt, keine Korrektur, die glättet —
              die Zeit macht den Brand.
            </p>
            <p className="fm-up mt-5 max-w-[26rem] text-fm-night/75">
              Seit Mai 2026 arbeitet im Gewölbe die kupferne Kothe-Anlage, 100 und 400 Liter,
              mit katalytischer Kupferschicht und einer Kolonne mit drei Umkehrkochböden.
            </p>
            <FmButton href="/manufaktur" tone="outline-night" className="mt-9">
              Die Manufaktur
            </FmButton>
          </Reveal>
        </div>

        <div className="relative order-1 aspect-[4/3] lg:order-2 lg:aspect-auto lg:min-h-[720px]">
          <Image
            src="/gallery/warmbach/img_0080.jpg"
            alt="Die kupferne Kothe-Brennblase mit der Prägung 1464"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
