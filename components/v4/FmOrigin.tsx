import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The reference sheet that states the problem: one sourced figure top-right,
 * a big plain claim bottom-left, a faded botanical in the corner. Ours is
 * the single-source claim — the one thing this estate can say that a
 * blended house cannot.
 */
export function FmOrigin() {
  return (
    <section className="relative overflow-hidden bg-fm-beige px-6 py-24 text-fm-night lg:px-10 lg:py-36">
      <Image
        src="/saeulen/branch-large.webp"
        alt=""
        aria-hidden
        width={800}
        height={1230}
        className="pointer-events-none absolute -bottom-10 -right-6 w-[46vw] max-w-[620px] select-none opacity-[0.14] mix-blend-multiply lg:-right-10"
      />

      <div className="relative mx-auto grid max-w-[1500px] grid-cols-12 gap-y-24 lg:gap-y-40">
        <Reveal className="col-span-12 lg:col-span-5 lg:col-start-7">
          <p className="fm-h text-[clamp(1.7rem,3vw,2.8rem)] text-fm-moss">
            562 Jahre ununterbrochen bewirtschaftet — derselbe Hof, derselbe Osthang.
          </p>
          <p className="fm-up mt-5 text-[0.62rem] tracking-[0.14em] text-fm-night/50">
            Quelle: Kitzbüheler Salbuch, 1464 ff. · Hofchronik bis heute
          </p>
        </Reveal>

        <Reveal className="col-span-12 lg:col-span-8">
          <h2 className="fm-h text-[clamp(2.6rem,6vw,6.4rem)] text-fm-moss">
            Alles aus
            <br />
            einem Ort.
          </h2>
          <p className="fm-up mt-10 max-w-[30rem] text-fm-night/75">
            Der Hang, die Quelle, der Obstgarten und die Kupferblase stehen auf demselben Grund.
            Nichts wird zugekauft, nichts verschnitten — was in der Flasche ist, ist hier
            gewachsen, hier gebrannt und hier gereift.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
