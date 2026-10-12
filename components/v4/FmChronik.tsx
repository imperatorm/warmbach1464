import Image from "next/image";
import { chronicle } from "@/lib/timeline";
import { Reveal } from "@/components/ui/Reveal";
import { FmButton } from "./FmButton";

/**
 * The field-trials ledger of the reference, as the Hofchronik: a headline
 * and intro, then one row per entry — year, owner, the record — on a dark
 * green ground, with a sticky right column that says what comes next and
 * why the house shows its data at all.
 */
export function FmChronik() {
  return (
    <section className="bg-fm-green text-fm-beige">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-16 px-6 py-24 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:py-32">
        <div className="lg:col-span-7">
          <Reveal>
            <h2 className="fm-h text-[clamp(2.4rem,5vw,5rem)]">
              Hofchronik.
              <br />
              1464 bis heute.
            </h2>
            <p className="fm-up mt-8 max-w-[28rem] text-fm-beige/75">
              Zweiundzwanzig Einträge aus dem Kitzbüheler Salbuch und dem Hofarchiv — Besitzer,
              Vieh, Erbschaften, Baumarken. Jede Zeile steht so in der Quelle.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <ol className="mt-14 divide-y divide-fm-beige/15 border-y border-fm-beige/15">
              {chronicle.map((e) => (
                <li
                  key={`${e.year}-${e.title}`}
                  className="grid grid-cols-[6rem_1fr] items-baseline gap-x-6 py-3.5 sm:grid-cols-[6rem_11rem_1fr]"
                >
                  <span className="fm-h text-[1.35rem] lining-nums tabular-nums">{e.year}</span>
                  <span className="fm-up text-fm-beige">{e.title}</span>
                  <span className="fm-up hidden truncate text-fm-beige/55 sm:block">{e.detail}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="flex flex-col gap-10 lg:sticky lg:top-28">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[4px]">
                <Image
                  src="/gallery/warmbach/img_0059.jpg"
                  alt="Der Warmbachhof in der Winterdämmerung"
                  fill
                  sizes="(min-width: 1024px) 30vw, 92vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <h3 className="fm-h text-[1.5rem]">Nächster Eintrag</h3>
              <p className="fm-up mt-3 text-fm-beige/75">
                Q4 2027 — Edition Premiere und Founder&rsquo;s Reserve N°1 (geplant).
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="fm-h text-[1.5rem]">Warum wir das zeigen</h3>
              <p className="fm-up mt-3 text-fm-beige/75">
                Belegte Daten statt Behauptungen. Was nicht in der Quelle steht, steht nicht hier.
              </p>
              <FmButton href="/zeit/chronik" className="mt-7">
                Zur Chronik
              </FmButton>
            </Reveal>
          </div>
        </aside>
      </div>
    </section>
  );
}
