// ════════════════════════════════════════════════════════════════════════
//  CHRONIK — Kitzbühel ↔ Warmbach   ·   Inhalts-Datei (hier wird gepflegt)
// ════════════════════════════════════════════════════════════════════════
//
//  Diese Datei IST der Inhalt der Chronik-Rubrik (/chronik). Wer Texte oder
//  Jahreszahlen ändern will, ändert sie HIER — die Seite aktualisiert sich
//  automatisch, ganz ohne Eingriff in die Komponente.
//
//  • Station ändern/hinzufügen:  Eintrag im Array `kitzbuehel` (Stadt) bzw.
//    `warmbach` (Hof) bearbeiten. Pflichtfelder: id, year, yearLabel, title,
//    body, source.  `theme: "kupfer"` setzt den Kupfer-Akzent.
//  • Querverbindung ("Parallele"):  Eintrag in `parallelen` mit den beiden
//    Event-`id`s (kitzbuehel + warmbach), `label` (kurz) und `note` (ein Satz).
//  • Warmbach-Hofchronik:  kommt 1:1 aus lib/timeline.ts — dort pflegen, hier
//    wird sie automatisch übernommen ("Heute" → Jahr 2026).
//
//  Substance-Lock: nichts erfinden. Jede Kitzbüheler Jahreszahl ist mit einer
//  öffentlichen Quelle belegt (Feld `source`, im UI sichtbar); die Warmbach-
//  Daten stammen aus der überlieferten Hofdokumentation des Salbuchs.
// ════════════════════════════════════════════════════════════════════════

import { chronicle } from "@/lib/timeline";

export type Track = "kitzbuehel" | "warmbach";

export type ChronikEvent = {
  id: string;
  track: Track;
  year: number;        // numerisch — bestimmt die Reihenfolge auf der Achse
  yearLabel: string;   // kompakte Achsen-Anzeige: "um 1165", "1464", "Heute"
  title: string;
  body: string;
  source: string;      // Belegquelle
  theme?: "kupfer";    // optionaler Kupfer-Akzent (Bergbau, Kessel)
};

export type Parallel = {
  id: string;
  kitzbuehel: string;  // ChronikEvent.id im Kitzbühel-Strang
  warmbach: string;    // ChronikEvent.id im Warmbach-Strang
  label: string;       // die Resonanz, kurz ("Kupfer")
  note: string;        // ein Satz, der die Parallele erklärt
  theme?: "kupfer";
};

// — Kitzbühel: öffentliche Stadtgeschichte, quellenbelegt ————————————————————

export const kitzbuehel: ChronikEvent[] = [
  {
    id: "kitz-1165",
    track: "kitzbuehel",
    year: 1165,
    yearLabel: "um 1165",
    title: "Chizbuhel — erste Erwähnung",
    body: "In einer Chiemseer Urkunde erscheint erstmals der Name „Chizbuhel“ — aus dem Personennamen Chizzo und „Bühel“, dem Hügel der Siedlung.",
    source: "Stadt Kitzbühel, Historisches",
  },
  {
    id: "kitz-1271",
    track: "kitzbuehel",
    year: 1271,
    yearLabel: "1271",
    title: "Stadtrecht",
    body: "Herzog Ludwig II. von Oberbayern verleiht Kitzbühel am 6. Juni 1271 das Stadtrecht; die Stadt wird mit einer Wehrmauer befestigt.",
    source: "Stadt Kitzbühel, 750 Jahre Stadterhebung",
  },
  {
    id: "kitz-1504",
    track: "kitzbuehel",
    year: 1504,
    yearLabel: "1504",
    title: "Kitzbühel wird tirolisch",
    body: "Nach dem Landshuter Erbfolgekrieg fällt das Gericht Kitzbühel am 30. Juni 1504 an König Maximilian I. — und damit dauerhaft an Tirol.",
    source: "Tiroler Landesarchiv, „Tirol und die Ereignisse des Jahres 1504“",
  },
  {
    id: "kitz-bergbau",
    track: "kitzbuehel",
    year: 1539,
    yearLabel: "ab 1539",
    title: "Großbergbau am Röhrerbühel",
    body: "Um 1539 werden am Röhrerbühel reiche Silber- und Kupfererze entdeckt. Der Bergbau macht Kitzbühel zu einem europäischen Zentrum; 1583 erreicht die Hl.-Geist-Zeche rund 800 m Tiefe — für ihre Zeit außergewöhnlich tief.",
    source: "Stadt Kitzbühel; SAGEN.at, Bergbau Röhrerbühel",
    theme: "kupfer",
  },
  {
    id: "kitz-1893",
    track: "kitzbuehel",
    year: 1893,
    yearLabel: "1893",
    title: "Franz Reisch auf Ski",
    body: "Franz Reisch befährt am 15. März 1893 das Kitzbüheler Horn auf Ski. Sein Bericht gilt als erste Schilderung einer alpinen Skiabfahrt.",
    source: "Franz Reisch (Wikipedia)",
  },
  {
    id: "kitz-1931",
    track: "kitzbuehel",
    year: 1931,
    yearLabel: "1931",
    title: "Das erste Hahnenkammrennen",
    body: "Am 28. und 29. März 1931 trägt der Kitzbüheler Ski Club das erste Hahnenkammrennen aus — der Beginn einer bis heute währenden Tradition.",
    source: "hahnenkamm.com, HKR-Chronik",
  },
  {
    id: "kitz-heute",
    track: "kitzbuehel",
    year: 2026,
    yearLabel: "Heute",
    title: "Die Streif",
    body: "Das Hahnenkammrennen auf der Streif zählt zu den bekanntesten Abfahrten im Skiweltcup; Kitzbühel ist internationaler Wintersportort geblieben.",
    source: "hahnenkamm.com",
  },
  {
    id: "kitz-andreas",
    track: "kitzbuehel",
    year: 1506,
    yearLabel: "1435–1506",
    title: "Stadtpfarrkirche St. Andreas",
    body: "Ab 1435 entsteht unter dem Salzburger Baumeister Stephan Krumenauer die spätgotische Stadtpfarrkirche St. Andreas; 1506 vollendet, galt sie als größter Sakralraum zwischen Schwaz und Salzburg.",
    source: "Stadtpfarrkirche Kitzbühel (Wikipedia); Pfarre Kitzbühel",
  },
  {
    id: "kitz-bergbau-ende",
    track: "kitzbuehel",
    year: 1774,
    yearLabel: "1774",
    title: "Ende des Bergbaus",
    body: "Nach langem Niedergang — sinkende Erzqualität, Geldmangel und der Rückzug der Gewerken — wird der Bergbau am Röhrerbühel 1774 aufgelassen.",
    source: "SAGEN.at, Röhrerbühel; abweichend Stadt Kitzbühel (1772)",
    theme: "kupfer",
  },
  {
    id: "kitz-1875",
    track: "kitzbuehel",
    year: 1875,
    yearLabel: "1875",
    title: "Die Eisenbahn kommt",
    body: "Am 6. August 1875 wird die Giselabahn eröffnet; auf Betreiben der Stadt führt die Strecke über Kitzbühel und legt den Grundstein für den Fremdenverkehr.",
    source: "Salzburg-Tiroler-Bahn (SALZBURGWIKI); Stadt Kitzbühel",
  },
  {
    id: "kitz-1928",
    track: "kitzbuehel",
    year: 1928,
    yearLabel: "1928",
    title: "Die Hahnenkammbahn",
    body: "1928 nimmt die Hahnenkammbahn den Betrieb auf und macht Kitzbühel zum Pionier des seilbahnerschlossenen Wintertourismus; die Stationen entwirft der Maler Alfons Walde.",
    source: "Hahnenkammbahn (Wikipedia); Bergbahn AG Kitzbühel",
  },
  {
    id: "kitz-1956",
    track: "kitzbuehel",
    year: 1956,
    yearLabel: "1956",
    title: "Toni Sailers Olympia-Gold",
    body: "Bei den Winterspielen 1956 in Cortina d’Ampezzo gewinnt der Kitzbüheler Toni Sailer alle drei alpinen Goldmedaillen — Abfahrt, Riesenslalom und Slalom.",
    source: "Toni Sailer (Wikipedia); Österreichisches Olympisches Comité",
  },
];

// — Warmbach: die Hofchronik, 1:1 aus lib/timeline.ts migriert ————————————————

const toYear = (label: string): number =>
  label === "Heute" ? 2026 : parseInt(label, 10);

// Curated to the KEY Hof stations — the recurring ownership transfers are dropped so the
// chronicle reads as milestones, not a deed register. (Full chronicle: lib/timeline.ts.)
const KEY_HOF = new Set(["1464", "1632", "1812", "1894", "1944", "2000", "2018", "Heute"]);

export const warmbach: ChronikEvent[] = chronicle
  .filter((c) => KEY_HOF.has(c.year))
  .map((c) => ({
  id: `warmbach-${c.year === "Heute" ? "heute" : c.year}`,
  track: "warmbach" as const,
  year: toYear(c.year),
  yearLabel: c.year,
  title: c.title,
  body: c.detail,
  source: "Hofchronik nach dem Kitzbüheler Salbuch (überlieferte Hofdokumentation)",
  theme: c.year === "Heute" ? ("kupfer" as const) : undefined,
}));

// — Die Parallelen: das Herzstück ——————————————————————————————————————————————

export const parallelen: Parallel[] = [
  {
    id: "p-ersterwaehnung",
    kitzbuehel: "kitz-1165",
    warmbach: "warmbach-1464",
    label: "Erste Erwähnung",
    note: "Beide treten zuerst in einer Urkunde in Erscheinung — die Stadt um 1165, der Warmbachhof 1464 im Kitzbüheler Salbuch.",
  },
  {
    id: "p-bestand",
    kitzbuehel: "kitz-1504",
    warmbach: "warmbach-1632",
    label: "Bestand",
    note: "Während die Gerichte 1504 tirolisch werden, läuft die Hoffolge ununterbrochen durch dieselben Jahrhunderte weiter.",
  },
  {
    id: "p-kupfer",
    kitzbuehel: "kitz-bergbau",
    warmbach: "warmbach-heute",
    label: "Kupfer",
    note: "Das Kupfer der Berge kehrt in den Kessel zurück — vom Röhrerbühel des 16. Jahrhunderts zum kupfernen Brennkessel von heute.",
    theme: "kupfer",
  },
  {
    id: "p-buehne",
    kitzbuehel: "kitz-1931",
    warmbach: "warmbach-2018",
    label: "Neue Bühne",
    note: "Kitzbühel tritt 1931 mit dem Hahnenkammrennen auf die internationale Bühne; 2018 beginnt mit Familie Wehrmann das Kapitel der eigenen Destillation.",
  },
  {
    id: "p-heute",
    kitzbuehel: "kitz-heute",
    warmbach: "warmbach-heute",
    label: "Heute",
    note: "Beide leben weiter: die Stadt als internationaler Wintersportort, der Hof am ersten eigenen Brand.",
  },
];

// — Abgeleitete Strukturen für die Komponente ————————————————————————————————

export const eventById: Map<string, ChronikEvent> = new Map(
  [...kitzbuehel, ...warmbach].map((e) => [e.id, e]),
);

export type ChronikRow = {
  year: number;
  yearLabel: string;
  kitz?: ChronikEvent;
  warmbach?: ChronikEvent;
};

/**
 * Beide Stränge zu einer chronologischen Zeilenliste verschmelzen.
 * Ereignisse desselben Jahres (z. B. „Heute“ auf beiden Seiten) teilen sich eine Zeile,
 * sodass sie auf der Achse auf gleicher Höhe stehen.
 */
export function buildChronikRows(): ChronikRow[] {
  const byYear = new Map<number, ChronikRow>();
  for (const ev of [...kitzbuehel, ...warmbach]) {
    const row = byYear.get(ev.year) ?? { year: ev.year, yearLabel: ev.yearLabel };
    if (ev.track === "kitzbuehel") row.kitz = ev;
    else row.warmbach = ev;
    byYear.set(ev.year, row);
  }
  return [...byYear.values()].sort((a, b) => a.year - b.year);
}

/** Welche Parallelen hängen an einem Ereignis? (für Klick/Highlight) */
export function parallelsFor(eventId: string): Parallel[] {
  return parallelen.filter((p) => p.kitzbuehel === eventId || p.warmbach === eventId);
}
