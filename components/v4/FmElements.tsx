import Image from "next/image";
import { heritageElements } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { FmButton } from "./FmButton";

/**
 * The light-green band of the reference: a question top-left, the object
 * floating in the middle, the answer bottom-right, then a row of flat beige
 * cards — a mark top-left, a title, a short uppercase body. Our five cards
 * are the five Größen every brand of the house is made from.
 */
export function FmElements() {
  return (
    <section className="relative overflow-hidden bg-fm-leaf text-fm-beige">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(244,237,228,0.22),transparent_70%),linear-gradient(180deg,#6e924f_0%,#5f8044_100%)]"
      />

      <div className="relative mx-auto max-w-[1500px] px-6 pb-20 pt-24 lg:px-10 lg:pb-28 lg:pt-36">
        <div className="relative grid grid-cols-12 gap-y-16 lg:min-h-[78svh]">
          <Reveal className="col-span-12 lg:col-span-6">
            <h2 className="fm-h text-[clamp(2.2rem,4.6vw,4.6rem)]">
              Wie viel Ort
              <br />
              passt in ein Glas?
            </h2>
          </Reveal>

          {/* The specimen, drifting in the light */}
          <div className="pointer-events-none col-span-12 flex justify-center lg:absolute lg:inset-0 lg:items-center">
            <Image
              src="/saeulen/branch-large.webp"
              alt="Botanische Zeichnung eines Zweigs mit Früchten"
              width={520}
              height={812}
              sizes="(min-width: 1024px) 380px, 60vw"
              className="w-[52vw] max-w-[380px] select-none drop-shadow-[0_30px_40px_rgba(36,54,34,0.35)] motion-safe:animate-drift"
            />
          </div>

          <Reveal className="col-span-12 self-end lg:col-span-5 lg:col-start-8">
            <h3 className="fm-h text-[clamp(1.8rem,3.4vw,3.4rem)]">
              Fünf Größen.
              <br />
              Ein Brand.
            </h3>
            <p className="fm-up mt-6 max-w-[24rem] text-fm-beige/80">
              Boden, Wasser, Baum, Kupfer und Zeit — die fünf Größen, aus denen jeder Brand des
              Hofs entsteht. Keine davon ist zugekauft.
            </p>
            <FmButton href="/boden" className="mt-8">
              Die Säulen
            </FmButton>
          </Reveal>
        </div>

        {/* The cards: a snap row below xl, five across from xl */}
        <ul className="-mx-6 mt-20 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 lg:-mx-10 lg:px-10 xl:mx-0 xl:grid xl:grid-cols-5 xl:overflow-visible xl:px-0 xl:pb-0">
          {heritageElements.map((e, i) => (
            <li
              key={e.no}
              className="flex min-h-[300px] w-[78vw] shrink-0 snap-start flex-col justify-between rounded-[4px] bg-fm-beige p-6 text-fm-night sm:w-[340px] xl:w-auto"
            >
              <Reveal delay={i * 0.05} className="flex h-full flex-col justify-between">
                <p className="flex items-center gap-3">
                  <span className="fm-up inline-flex h-8 w-8 items-center justify-center rounded-full border border-fm-night/25 text-[0.58rem] tracking-[0.1em]">
                    {e.no}
                  </span>
                  <span className="fm-up text-[0.6rem] tracking-[0.12em] text-fm-oxblood">{e.data}</span>
                </p>
                <div className="pt-16">
                  <h4 className="fm-h text-[1.7rem]">{e.name}</h4>
                  <p className="fm-up mt-3 text-fm-night/70">{e.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
