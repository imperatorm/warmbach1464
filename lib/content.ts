// Zentrale Inhalts-Bausteine — alle Texte werden später durch CMS-Inhalte ersetzt.
export const brand = {
  master: "1464byW",
  house: "WARMBACHHOF",
  monogram: "W//",
  estate: "KITZBÜHEL · ANNO 1464",
  claim: "From our Soil to your Soul.",
  claimDe: "Aus dem Salbuch 1464.",
  contactEmail: "concierge@warmbachhof.com",
  domain: "warmbachhof.com",
};

// Editionen — belegt aus den Decks (M7). Keine erfundenen Tasting-Notes/Preise.
export const editions = [
  {
    slug: "apfel-brand",
    name: "Apfel Brand",
    year: "",
    sort: "Apfel",
    volume: "0,75 L",
    abv: "42 % vol.",
    notes: "Der erste Edelbrand des Hofs. Sein Herz ist ein über hundert Jahre alter Apfelbaum — Symbol für Ursprung und Beständigkeit.",
    edition: "Nummeriert, mit Echtheitszertifikat",
    status: "Anfrage über Gastronomie oder 1464byW.com",
    accent: true,
  },
  {
    slug: "ambassador-edition",
    name: "Ambassador Edition",
    year: "2023",
    sort: "Apfel — co-kreiert",
    volume: "0,75 L",
    abv: "42 % vol.",
    notes: "Gemeinsam mit einer Persönlichkeit aus Kulinarik, Kultur oder Lifestyle entwickelt — von der Fruchtauswahl bis zum Design. Ein Sammlerobjekt mit persönlicher Geschichte.",
    edition: "Nummeriert, mit Echtheitszertifikat",
    status: "Anfrage über 1464byW.com",
  },
];

// Die Editionen als Glas-Ausführungen ("Geschmäcker") — Produktrenders der Familie.
// Glas-/Look-Beschreibung ist sachlich; Geschmacksprofil ("flavor") wird NICHT erfunden.
export const editionVariants = [
  { slug: "bernstein", name: "Bernstein", glass: "Bernsteinglas · Gold", image: "/editions/bernstein.jpg", line: "Der klassische Brand — warmes Bernstein, golden gefasst." },
  { slug: "saphir", name: "Saphir", glass: "Saphirglas · Gold", image: "/editions/saphir.jpg", line: "Tiefes Blau, in Gold gefasst." },
  { slug: "rose", name: "Rosé", glass: "Roséglas · Roségold", image: "/editions/rose.jpg", line: "Roségold, warm und weich." },
  { slug: "rubin", name: "Rubin", glass: "Rubinglas · Gold", image: "/editions/rubin.jpg", line: "Tiefes Rubin, dunkel funkelnd." },
  { slug: "onyx", name: "Onyx", glass: "Schwarzglas · Platin", image: "/editions/onyx.jpg", line: "Schwarzes Glas, Platin-Signet." },
  { slug: "rauch", name: "Rauch", glass: "Klarglas · Schwarz", image: "/editions/rauch.jpg", line: "Klares Glas, schwarzes Etikett." },
];

export const heritageChronicle = [
  { year: "1464", text: "Jörg Frey vom Warmbach im Kitzbüheler Salbuch verzeichnet. Eine Mark Pfennige an die Kirche." },
  { year: "1556", text: "Familie Enzemann übernimmt den Hof." },
  { year: "1605", text: "Hofer, dann Vilzer und Obermoser. Wechselnde Bauernfamilien über zweieinhalb Jahrhunderte." },
  { year: "1892", text: "Familien Fuchs, Feuersinger, Pirchmoser/Pichmoser im Wechsel." },
  { year: "2000", text: "Verkauf an Familie Viktor Huber." },
  { year: "2018", text: "Kauf durch Familie Dr. Hans Wehrmann. Erster Besitzerwechsel außerhalb der Tiroler Bauernreihen." },
  { year: "2019–2026", text: "Wiederaufbau nach Brixentaler Bauernhof-Vorbild durch Holzbau Obermoser, Aurach." },
  { year: "Mai 2026", text: "Inbetriebnahme der Brennanlage Kothe (100 + 400 l). Erste Brände." },
  { year: "Q4 2027", text: "Edition Premiere und Founder's Reserve N°1 (geplant)." },
  { year: "2030", text: "Estate Edition aus eigenen Bäumen (geplant)." },
];

// Die fünf Elemente der Heritage-Erzählung (brand_memory/00_heritage · Briefing §4.4)
export const heritageElements = [
  { no: "I", name: "Boden", data: "760 m · Kalkalpen", body: "Verwitterungsboden aus den Kalkalpen, 760 Meter über dem Meer. Worauf die Bäume stehen, schmeckt man später." },
  { no: "II", name: "Wasser", data: "7 °C · ganzjährig", body: "Eine artesische Quelle am Hof, die nie versiegt. Sieben Grad im August wie im Februar." },
  { no: "III", name: "Baum", data: "47 Bäume · > 100 Jahre", body: "Siebenundvierzig Bäume, der älteste über hundert Jahre. 2024 gepfropft mit Sorten, die fast verschwunden waren." },
  { no: "IV", name: "Kupfer", data: "Zweifachbrand · Kothe", body: "Zweifachbrand auf der Kothe-Kupferanlage, Engschnitt im Herzstück. Die Entscheidung liegt in den Händen von René Dubitzky." },
  { no: "V", name: "Zeit", data: "min. 36 Monate", body: "Drei Jahre Stille im Glasballon. Ohne Holz, ohne Korrektur." },
];

// ── Die sieben Säulen (Struktur V2.2) ───────────────────────────────────────
// Verdichtung statt Inventar: Wasser wandert in den Boden, Früchte zu den Bäumen.
// Reihenfolge folgt der Genese der Marke: Zeit → Boden → Bäume → Manufaktur → Flasche → Galerie.
// Der Club steht bewusst außerhalb der Säulen (Schwelle, siehe /club).
export type PillarSub = { title: string; line: string; href?: string };
export type Pillar = {
  no: string;          // röm. Ziffer I–VI
  slug: string;        // Route unter "/"
  name: string;
  tagline: string;     // kurze, kursive Leitzeile
  intro: string;       // ein Absatz Einführung
  sub?: PillarSub[];   // Unterpunkte als Scroll-Kapitel (kein Akkordeon)
  accent?: boolean;    // hebt die Stern-Säule (Boden) hervor
};

export const pillars: Pillar[] = [
  {
    no: "I",
    slug: "zeit",
    name: "Zeit",
    tagline: "Wir haben nichts erfunden. Wir haben es nur wiedergefunden.",
    intro:
      "1464 ist der Grund, warum es diese Marke gibt. Die erste Säule trägt den Ort, die Stadt und die urkundliche Chronik.",
    sub: [
      { title: "Der Hof", line: "Warmbachhof seit 1464 — Wiederaufbau nach Brixentaler Vorbild.", href: "/zeit/hof" },
      { title: "Die Stadt", line: "Kitzbühel: Salbuch, Bergbau-Ära, Sport- und Gastgeber-Heritage.", href: "/zeit/kitzbuehel" },
      { title: "Die Chronik", line: "562 Jahre, urkundlich verbürgt — 1464 bis heute.", href: "/zeit/chronik" },
    ],
  },
  {
    no: "II",
    slug: "boden",
    name: "Boden",
    accent: true,
    tagline: "Worauf die Bäume stehen, schmeckt man später.",
    intro:
      "Wie beim Wein entscheidet der Boden. Grauwackenzone, Wildschönauer Schiefer, die artesische Quelle — und die Erdanalyse des Standorts als belegte Substanz.",
    sub: [
      { title: "Der Tiefenschnitt", line: "Vom Humus bis zum wasserführenden Schiefer — Schicht für Schicht in den Boden hinein." },
      { title: "Geologie am Horn", line: "Erzführender Schiefer — derselbe Berg, der einst das Kupfer der Brennblase gab." },
      { title: "Das Bodenarchiv", line: "Die Mineralwerte des Standorts — ausschließlich aus dem Gutachten." },
      { title: "Wasser", line: "Die eigene Quelle am Hof: sieben Grad, gefiltert durch den Schiefer." },
    ],
  },
  {
    no: "III",
    slug: "baeume",
    name: "Bäume",
    tagline: "Siebenundvierzig Bäume. Der älteste über hundert Jahre.",
    intro:
      "Der lebendige Baum ist das Herz des ersten Edelbrands. Diese Säule erzählt das Stehende und das Bewegliche — Früchte und Düfte — und mündet in den Brand.",
    sub: [
      { title: "Der lebendige Baum", line: "Der über hundertjährige Apfelbaum im Jahreslauf." },
      { title: "Früchte & Düfte", line: "Standortgerechte Sorten, Handernte, das Aromarad." },
      { title: "Die Editionen", line: "Wohin die Frucht führt: Apfel Brand & Ambassador Edition.", href: "/editions" },
    ],
  },
  {
    no: "IV",
    slug: "manufaktur",
    name: "Manufaktur",
    tagline: "Kupfer und Feuer.",
    intro:
      "Die Kothe-Anlage und der schonende Zweifachbrand — perfekte Balance aus Technik, Natur und Zeit. Brennmeister: René Dubitzky.",
    sub: [
      { title: "Das Kupfer", line: "Die Kothe-Anlage — katalytische Kupferschicht, Kolonne mit drei Umkehrkochböden." },
      { title: "Das Feuer", line: "Einmaischen, schonender Zweifachbrand, Engschnitt im Herzstück." },
    ],
  },
  {
    no: "V",
    slug: "flasche",
    name: "Flasche",
    tagline: "Ein Gefäß mit Denkmalwürde.",
    intro:
      "Die Säule erzählt die Flasche nicht als Verpackung, sondern als Tiroler Glasbläsertradition — Herkunft, Hand, Siegel und Editionen.",
    sub: [
      { title: "Die Tradition", line: "Tiroler Glaskunst mit Wurzeln im 18. Jahrhundert." },
      { title: "Die Hand", line: "Glasmacher, Fertigung, Unikat-Charakter." },
      { title: "Das Siegel", line: "Nummerierung, Echtheitszertifikat, Wachs." },
    ],
  },
];

// Wege zur Marke — belegt aus den Decks (M9, M10, M11, L9). Ersetzt die erfundene „Patenschaft".
export const patronageStages = [
  {
    title: "Sammlerkreis",
    line: "Direkt vom Hof. Mit Echtheitszertifikat.",
    body: "Direktvertrieb an Sammler über 1464byW.com — jede Flasche nummeriert, mit Echtheitszertifikat und Wachssiegel. Kontrollierter Direktbezug mit maximaler Markenhoheit.",
    cta: "Sammler werden — Anfrage",
    accent: true,
  },
  {
    title: "Ambassador",
    line: "Mitgestalter im Brennprozess.",
    body: "Persönlichkeiten aus Kulinarik, Kultur und Lifestyle entwickeln eine eigene Edition mit — von der Fruchtauswahl bis zum Design.",
    cta: "Ambassador-Anfrage",
  },
  {
    title: "1464 for a better World",
    line: "Alpine Authentizität, echte Verantwortung.",
    body: "Eine Charity-Initiative mit Gala-Serie, bei der die Community selbst mitentscheidet, welche Projekte unterstützt werden.",
    cta: "Mehr erfahren",
  },
];

// Navigation: die fünf Säulen leben in EINER Kategorie ("Die Säulen" — Dropdown).
export const nav = [
  { href: "/zeit", label: "Zeit" },
  { href: "/boden", label: "Boden" },
  { href: "/baeume", label: "Bäume" },
  { href: "/manufaktur", label: "Manufaktur" },
  { href: "/flasche", label: "Flasche" },
];

// Weitere Punkte — separat neben der Säulen-Kategorie.
export const secondary = [
  { href: "/journal", label: "Journal" },
  { href: "/galerie", label: "Galerie" },
  { href: "/contact", label: "Besuch" },
];

// Der Club (rechts) mit eigenem Menü.
export const clubMenu = [
  { href: "/sitz", label: "Club Eintritt" },
  { href: "/club/partner", label: "Partner Eintritt" },
  { href: "/club/mitglied-werden", label: "Mitglied werden" },
];
