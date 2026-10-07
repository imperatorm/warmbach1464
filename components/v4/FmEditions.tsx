import Image from "next/image";
import Link from "next/link";
import { editions } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

const [apfel, ambassador] = editions;

const TILES = [
  {
    href: "/editions",
    kicker: "Erste Edition",
    name: apfel.name,
    body: apfel.notes,
    status: apfel.status,
    img: "/flasche/shot-front.jpg",
    alt: "Die Kristallflasche des Apfel Brand, frontal",
    blend: true,
  },
  {
    href: "/editions",
    kicker: `Co-kreiert · ${ambassador.year}`,
    name: ambassador.name,
    body: ambassador.notes,
    status: ambassador.status,
    img: "/flasche/shot-lay.jpg",
    alt: "Die Kristallflasche der Ambassador Edition, liegend",
    blend: true,
  },
  {
    href: "/club",
    kicker: "Die Schwelle",
    name: "Club 1464",
    body: "Direkt vom Hof, in kleiner Zahl. Jede Flasche nummeriert, mit Echtheitszertifikat und Wachssiegel.",
    status: "Warteliste offen",
    img: "/gallery/warmbach/img_0065.jpg",
    alt: "Die Bar im Warmbachhof",
    blend: false,
  },
];

/**
 * The product tiles of the reference: three flat green cards, the object on
 * its own ground up top with an arrow bubble, the name and an uppercase line
 * beneath. The two real editions and the club — never a price.
 */
export function FmEditions() {
  return (
    <section className="bg-fm-beige px-6 py-24 text-fm-night lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <h2 className="fm-h text-[clamp(2.4rem,5vw,5rem)] text-fm-moss">
            Für den Tisch.
            <br />
            Für die Sammlung.
          </h2>
        </Reveal>

        <ul className="mt-16 grid gap-4 md:grid-cols-3">
          {TILES.map((t, i) => (
            <li key={t.name}>
              <Reveal delay={i * 0.06} className="h-full">
                <Link
                  href={t.href}
                  data-cursor
                  className="group flex h-full flex-col overflow-hidden rounded-[4px] bg-fm-leaf text-fm-beige"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-fm-leaf">
                    <Image
                      src={t.img}
                      alt={t.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 92vw"
                      className={`object-cover transition-transform duration-700 ease-deep group-hover:scale-[1.04] ${
                        t.blend ? "mix-blend-screen" : "opacity-90"
                      }`}
                    />
                    <span
                      aria-hidden
                      className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-fm-beige text-fm-night transition-transform duration-300 ease-deep group-hover:scale-110"
                    >
                      &rarr;
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="fm-up text-[0.6rem] tracking-[0.14em] text-fm-beige/65">{t.kicker}</p>
                    <h3 className="fm-h mt-2 text-[1.8rem]">{t.name}</h3>
                    <p className="fm-up mb-8 mt-4 text-fm-beige/85">{t.body}</p>
                    <p className="fm-up mt-auto border-t border-fm-beige/20 pt-4 text-[0.6rem] tracking-[0.14em] text-fm-beige/70">
                      {t.status}
                    </p>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
