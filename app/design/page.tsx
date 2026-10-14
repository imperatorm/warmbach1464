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
 * Parallel designs kept accumulating across branches — whole homepages, the
 * homepage's middle sections, three readings of the Zeit pillar, eight of the
 * gallery, a second Journal, Club, Mitglied-werden and Besuch, two entry veils
 * — and the only way to compare them was to know the routes by heart. They are
 * all on this branch now, each at its own address, listed here.
 *
 * The homepages that were rebuilt in place, rather than beside each other, are
 * here too: each as a static snapshot of the whole site on the day it stood
 * (public/archive, built by scripts/archive-snapshot.sh), with its own nav, type
 * and palette, and every page of that version one click away.
 *
 * Staging only: this page and every version route it points at are noindex and
 * stay out of sitemap.ts. The one marked "live" on each row is the version the
 * public navigation actually reaches.
 */
const SURFACES: Surface[] = [
  {
    surface: "Startseite",
    question: "Welche Haltung trägt die ganze Seite?",
    versions: [
      { name: "Aktuell", href: "/", note: "Die gebaute Fassung — Panorama-Lauf, gesetztes Hero-Lockup.", live: true },
      { name: "v4 · Farm Minerals", href: "/v4", note: "Das Objekt im grünen Lichtraum, Faktenleiste, flache Elementkarten, Salbuch-Ledger — die Hausfarben einen Schritt angehoben." },
      { name: "v3 · Sanduhr", href: "/v3", note: "Zweifarbiger Hero, das Sanduhr-Statement, Flasche als Blaupause, Chronik in großen Jahreszahlen, Polaroid-Galerie." },
      { name: "Experience", href: "/experience", note: "Die cineastische Fassung — Alpenfilm mit Onyx-Flasche, Statement über der Landschaft, die Türen, die Zeitleiste." },
    ],
  },
  {
    surface: "Frühere Fassungen",
    question: "Wie ist die Seite hierher gekommen? Jede öffnet die ganze Website, wie sie an dem Tag stand.",
    versions: [
      { name: "30.06. · Erstfassung", href: "/archive/erstfassung", note: "Der Ausgangspunkt: Natur-Palette mit Kalk und Terrakotta, die fünf Säulen, die Zeit-Plakette, die Kristallflaschen-Vitrine." },
      { name: "03.07. · Markenbuch", href: "/archive/editorial", note: "Die Startseite als nummeriertes Markenbuch — Titelblatt, Manifest, Materialpalette, Wortmarke im Scrolltempo — in der Pantone-Palette." },
      { name: "07.07. · Floema", href: "/archive/floema", note: "Die Säulen als gepinnte Bahn mit gescrubbten Bildwischern, dazu die Gooey-Pill-Navigation." },
      { name: "20.07. · Editorial-Hero", href: "/archive/v3-editorial", note: "Film und Cremefläche im Split, »1464« randlos über die volle Breite, die Elemente als Sticky Steps, Footer-Parallaxe." },
      { name: "20.07. · Dekanter", href: "/archive/dekanter", note: "Der Hero als Scroll-Szene: die Karaffe schwebt in 3D über der Jahreszahl, dreht sich mit dem Scroll, der Film dunkelt zur Nacht." },
      { name: "20.07. · Plakat", href: "/archive/escape", note: "Typo als Bild: geteilte Statements, die Säulen als verstreute Plakatwörter, ein dunkles Flaschenband, eine große Tür." },
      { name: "15.09. · Living Scroll", href: "/archive/living-scroll", note: "Ein durchgehendes Band mit weichen Nähten: Fotos am Cursor, Chronik als Jahrhundert-Schiene, Boden als Bohrkern-Abstieg." },
    ],
  },
  {
    surface: "Startseite · Mitte",
    question: "Wie lesen sich Manufaktur und Flasche in der Mitte der Seite?",
    versions: [
      { name: "Aktuell", href: "/", note: "Panorama-Lauf durch die Manufaktur, danach die Flasche.", live: true },
      { name: "A · Index", href: "/design/sections?v=a", note: "Handwerk als Index, Flasche annotiert." },
      { name: "B · Gallery", href: "/design/sections?v=b", note: "Handwerk als Galerie, Flasche als Studie." },
      { name: "C · Panorama", href: "/design/sections?v=c", note: "Handwerk als Panorama, Flasche geteilt." },
    ],
  },
  {
    surface: "Eingang",
    question: "Was hält der Vorhang, bevor sich die Startseite hebt?",
    versions: [
      { name: "Monogramm", href: "/", note: "Das W// allein auf Nacht, unter einer Sekunde. Erscheint einmal pro Sitzung.", live: true },
      { name: "Sanduhr", href: "/design/loader", note: "Das W// über einer Sanduhr aus fallendem Licht, 1,5 s — hier beliebig oft abspielbar." },
    ],
  },
  {
    surface: "Säule I · Zeit",
    question: "Wie erzählt man 562 Jahre?",
    versions: [
      { name: "Leseraum", href: "/zeit", note: "Statement, drei Türen, Chronik nach Jahrhundert gruppiert.", live: true },
      { name: "Deck", href: "/zeit/v2", note: "Kapitel-Deck — Hof, Chronik, Stadt, Heute." },
      { name: "Korridor", href: "/zeit/v3", note: "Die Chronik auf echter Zeit: jeder Eintrag an seinem Jahr, die Lücken so lang wie sie waren." },
      { name: "Klappbuch", href: "/zeit/v4", note: "Der Osthang gemalt, und der Hof, der sich beim Scrollen darauf aufstellt — vom alten zum neuen; fünf Blätter, die sich öffnen." },
      { name: "Flug", href: "/zeit/v5", note: "Eine Kamerafahrt durch das gemalte Land, ohne Schnitt: von oben über den Bau des Hofs hinunter zwischen die Bäume, bis zum Apfel am Zweig." },
    ],
  },
  {
    surface: "Galerie",
    question: "Was ist eine Galerie, wenn sie kein Raster ist — und was, wenn doch?",
    versions: [
      { name: "Raster", href: "/galerie", note: "Laufendes Band, danach Abschnitte.", live: true },
      { name: "Der Tisch", href: "/galerie/tisch", note: "Alle Aufnahmen als lose Abzüge auf einer Fläche, die man zieht." },
      { name: "Der Hang", href: "/galerie/hang", note: "Die Aufnahmen am Osthang, Scroll als Fahrt." },
      { name: "Die Kammer", href: "/galerie/kammer", note: "Ein Korridor, durch den man hindurchgeht." },
      { name: "Das Register", href: "/galerie/register", note: "Redaktioneller Index auf Kalk — mitlaufendes Inhaltsverzeichnis, beschriftetes Mauerwerk." },
      { name: "Die Bühne", href: "/galerie/buehne", note: "Ein Bild auf der Bühne, Kapitel-Chips, Filmstreifen; Tasten und Wischen blättern." },
      { name: "Das Mosaik", href: "/galerie/mosaik", note: "Randlose Wand auf Nacht, nichts beschnitten, jedes Kapitel im Plakatschnitt angekündigt." },
      { name: "Das Archiv", href: "/galerie/archiv", note: "Der Raumfilter ist der Seitentitel — Hof, Bar, Brennerei, Lounge — darunter ein bündiges Raster." },
    ],
  },
  {
    surface: "Journal",
    question: "Wie sieht eine Chronik aus, die gerade erst anfängt?",
    versions: [
      { name: "Einträge", href: "/journal", note: "Die Einträge untereinander.", live: true },
      { name: "Index", href: "/journal/v2", note: "Masthead mit Zählung, der jüngste Eintrag als Aufmacher, darunter nach Jahren geordnet." },
    ],
  },
  {
    surface: "Club 1464",
    question: "Wie lädt man in einen Kreis ein, der nicht jeden aufnimmt?",
    versions: [
      { name: "Aktuell", href: "/club", note: "Zwei Türen, die drei Schritte, sieben Privilegien als Register.", live: true },
      { name: "v2", href: "/club/v2", note: "Bänder im Wechsel Nacht und Kalk, die Privilegien als nummeriertes Register auf Haarlinien." },
    ],
  },
  {
    surface: "Club · Mitglied werden",
    question: "Wie fühlt sich eine Vorstellung an, die keine Kasse ist?",
    versions: [
      { name: "Aktuell", href: "/club/mitglied-werden", note: "Fünf Kriterien, die Kandidatur in Feldern.", live: true },
      { name: "v2", href: "/club/mitglied-werden/v2", note: "Felder auf Grundlinien, Mikro-Versalien, die drei Fragen als eigener Block, cremefarbene Pille." },
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
  {
    surface: "Besuch & Concierge",
    question: "Ist Besuch ein Formular oder ein Ort?",
    versions: [
      { name: "Aktuell", href: "/contact", note: "Nummerierte Abschnitte, die Anfrage in Feldern.", live: true },
      { name: "v2", href: "/contact/v2", note: "Der Hof randlos mit Koordinaten, drei feste Angaben als Register, das Formular auf Nacht." },
    ],
  },
];

/** The archive snapshots are separate static apps: they need a full page load, not a client transition. */
function VersionLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  return href.startsWith("/archive/") ? (
    <a href={href} data-cursor className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} data-cursor className={className}>
      {children}
    </Link>
  );
}

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
                    <VersionLink
                      href={v.href}
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
                    </VersionLink>
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
