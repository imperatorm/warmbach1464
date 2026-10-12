import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { FmLiveDays } from "./FmLiveDays";

// Every row is stated in lib/content or lib/timeline — nothing estimated.
const FIGURES: { v: React.ReactNode; l: string }[] = [
  { v: "1464", l: "Erstmals im Kitzbüheler Salbuch verzeichnet" },
  { v: "562", l: "Jahre ununterbrochen bewirtschaftet" },
  { v: "760 m", l: "Osthang in den Kalkalpen" },
  { v: "7 °C", l: "Artesische Quelle, im August wie im Februar" },
  { v: "47", l: "Bäume, der älteste über hundert Jahre" },
  { v: "≥ 36", l: "Monate im Glasballon, mindestens" },
  { v: <FmLiveDays />, l: "Tage seit der ersten Erwähnung — bis heute" },
];

/**
 * The reference ledger of figures: a two-line headline, then one big number
 * per row with its label pinned to the right edge, hairlines between. Ours
 * carries only what the Salbuch, the archive or our own measurement says.
 *
 * The left half is a photograph, held in place for the length of the ledger
 * (from `lg`; on a phone it simply sits above the figures).
 */
export function FmFigures() {
  return (
    <section className="grid grid-cols-1 bg-fm-beige text-fm-night lg:grid-cols-2">
      {/* The photograph — pinned while the figures scroll past */}
      <div className="relative aspect-[4/3] lg:aspect-auto">
        <div className="absolute inset-0 lg:sticky lg:top-0 lg:h-svh">
          <Image
            src="/v4/pears.webp"
            alt="Zwei Hände greifen in eine Holzkiste voller reifer Birnen"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-[57%_50%]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-14 px-6 py-24 lg:px-14 lg:py-36 xl:px-20">
        <Reveal>
          <h2 className="fm-h text-[clamp(2.4rem,4.4vw,4.8rem)] text-fm-moss">
            Belegt.
            <br />
            Nicht behauptet.
          </h2>
        </Reveal>

        <Reveal>
          <dl className="divide-y divide-fm-night/15 border-y border-fm-night/15">
            {FIGURES.map((f, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_auto] items-baseline gap-x-8 py-5 lg:grid-cols-[1fr_220px] lg:py-6"
              >
                <dd className="fm-h order-1 text-[clamp(2.2rem,4vw,3.8rem)] lining-nums tabular-nums">
                  {f.v}
                </dd>
                <dt className="fm-up order-2 max-w-[12rem] text-right text-[0.64rem] text-fm-night/65 lg:max-w-none">
                  {f.l}
                </dt>
              </div>
            ))}
          </dl>
          <p className="fm-up mt-8 max-w-[34rem] text-[0.6rem] tracking-[0.08em] text-fm-night/50">
            * Jeder Wert stammt aus dem Kitzbüheler Salbuch, dem Hofarchiv oder der eigenen
            Messung. Was nicht gemessen ist, steht hier nicht.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
