import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Versionen — 1464byW",
  description: "Jede Fassung jeder Seite, nebeneinander.",
  robots: { index: false, follow: false },
};

type Version = {
  name: string;
  href: string;
  note: string;
  /** The one currently wired into the public navigation. */
  live?: boolean;
};

type Surface = {
  surface: string;
  question: string;
  versions: Version[];
};

/**
 * Every version of every surface, in one place.
 *
 * Parallel designs kept accumulating across branches — three readings of the
 * Zeit pillar, four of the gallery, three of the homepage's middle sections —
 * and the only way to compare them was to know the routes by heart. They are
 * all on this branch now, each at its own address, listed here.
 *
 * Staging only: this page and every version route it points at are noindex and
 * stay out of sitemap.ts. The one marked "live" on each row is the version the
 * public navigation actually reaches.
 */
const SURFACES: Surface[] = [
  {
    surface: "Startseite",
    question: "Wie lesen sich Manufaktur und Flasche in der Mitte der Seite?",
    versions: [
      { name: "Aktuell", href: "/", note: "Die gebaute Fassung — Panorama-Lauf, gesetztes Hero-Lockup.", live: true },
      { name: "A · Index", href: "/design/sections?v=a", note: "Handwerk als Index, Flasche annotiert." },
      { name: "B · Gallery", href: "/design/sections?v=b", note: "Handwerk als Galerie, Flasche als Studie." },
      { name: "C · Panorama", href: "/design/sections?v=c", note: "Handwerk als Panorama, Flasche geteilt." },
    ],
  },
  {
    surface: "Säule I · Zeit",
    question: "Wie erzählt man 562 Jahre?",
    versions: [
      { name: "Leseraum", href: "/zeit", note: "Statement, drei Türen, Chronik nach Jahrhundert gruppiert.", live: true },
      { name: "Deck", href: "/zeit/v2", note: "Kapitel-Deck — Hof, Chronik, Stadt, Heute." },
      { name: "Korridor", href: "/zeit/v3", note: "Die Chronik auf echter Zeit: jeder Eintrag an seinem Jahr, die Lücken so lang wie sie waren." },
    ],
  },
  {
    surface: "Galerie",
    question: "Was ist eine Galerie, wenn sie kein Raster ist?",
    versions: [
      { name: "Raster", href: "/galerie", note: "Laufendes Band, danach Abschnitte.", live: true },
      { name: "Der Tisch", href: "/galerie/tisch", note: "Alle Aufnahmen als lose Abzüge auf einer Fläche, die man zieht." },
      { name: "Der Hang", href: "/galerie/hang", note: "Die Aufnahmen am Osthang, Scroll als Fahrt." },
      { name: "Die Kammer", href: "/galerie/kammer", note: "Ein Korridor, durch den man hindurchgeht." },
    ],
  },
  {
    surface: "Club · Partner",
    question: "Was trägt eine Handelsseite — das Angebot oder die Zuteilung?",
    versions: [
      {
        name: "Register",
        href: "/club/partner",
        note: "Die Allokation als Rückgrat, der Weg hinein als Strecke.",
        live: true,
      },
    ],
  },
];

export default function DesignVersionsPage() {
  return (
    <div className="min-h-screen bg-kalk px-6 pb-32 pt-36 text-night lg:px-10 lg:pt-44">
      <div className="mx-auto max-w-[1100px]">
        <header className="border-b border-night/20 pb-8">
          <h1 className="t-hero text-[clamp(2rem,5vw,3.6rem)] text-night">Versionen</h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-night/75">
            Jede Fassung jeder Seite, nebeneinander. Alles liegt auf einem Branch — diese
            Übersicht und jede Fassung dahinter sind noindex und stehen nicht in der Sitemap.
            Was <span className="text-terrakotta">live</span> markiert ist, erreicht die
            öffentliche Navigation.
          </p>
        </header>

        <div className="mt-20 flex flex-col gap-24">
          {SURFACES.map((s) => (
            <section key={s.surface}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-night/15 pb-4">
                <h2 className="t-hero text-[clamp(1.4rem,3vw,2.2rem)] text-night">{s.surface}</h2>
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-terrakotta">
                  {s.versions.length} {s.versions.length === 1 ? "Fassung" : "Fassungen"}
                </p>
              </div>
              <p className="mt-5 max-w-lg text-sm italic leading-relaxed text-night/70">
                {s.question}
              </p>

              <ul className="mt-8 flex flex-col">
                {s.versions.map((v) => (
                  <li key={v.href}>
                    <Link
                      href={v.href}
                      data-cursor
                      className="group grid grid-cols-1 items-baseline gap-x-8 gap-y-2 border-b border-night/15 py-6 lg:grid-cols-12"
                    >
                      <span className="flex items-baseline gap-3 lg:col-span-4">
                        <span className="t-hero text-[clamp(1.1rem,2.2vw,1.5rem)] text-night">
                          {v.name}
                        </span>
                        {v.live && (
                          <span className="rounded-full bg-terrakotta px-2.5 py-0.5 text-[0.5rem] uppercase tracking-[0.2em] text-cream">
                            live
                          </span>
                        )}
                      </span>
                      <span className="text-sm leading-relaxed text-night/75 lg:col-span-7">
                        {v.note}
                      </span>
                      <span
                        aria-hidden
                        className="text-[0.62rem] uppercase tracking-[0.22em] text-terrakotta transition-transform duration-500 ease-deep group-hover:translate-x-1 lg:col-span-1 lg:justify-self-end"
                      >
                        &rarr;
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
