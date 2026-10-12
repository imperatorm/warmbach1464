// Journal — was am Hof passiert. Jeder Eintrag ist belegt (Brennbetrieb,
// Markenregister, Pomologie); es werden keine Einträge erfunden, um die Liste
// zu füllen. Neue Einträge kommen oben dazu.

export type JournalEntry = {
  /** ISO date — sorting and <time datetime>. */
  iso: string;
  /** Wie es auf der Seite steht. */
  date: string;
  kicker: string;
  title: string;
  excerpt: string;
  image: string;
  alt: string;
};

export const journal: JournalEntry[] = [
  {
    iso: "2026-05-01",
    date: "Mai 2026",
    kicker: "Brennerei",
    title: "Inbetriebnahme Kothe",
    excerpt:
      "Die 100-Liter-Blase läuft. Erste Maische heute Mittag. Dubitzky hat den Schnitt.",
    image: "/gallery/warmbach/img_0080.jpg",
    alt: "Die kupferne Kothe-Brennblase mit der Prägung 1464",
  },
  {
    iso: "2026-04-01",
    date: "April 2026",
    kicker: "Die Marke",
    title: "Eintragung W// beim DPMA",
    excerpt:
      "Wortmarke registriert, Reg.-Nr. 30 2026 207 672. Klassen 03/31/32/33.",
    image: "/gallery/warmbach/img_6648.jpg",
    alt: "Das W-Monogramm auf Altholz",
  },
  {
    iso: "2026-03-01",
    date: "März 2026",
    kicker: "Bäume",
    title: "Pomologie — Reiser am Osthang",
    excerpt:
      "Hans Schiefer hat sechzehn Reiser des Urstocks gepfropft. Klosterneuburg läuft an.",
    image: "/gallery/warmbach/img_0030.jpg",
    alt: "Der Osthang mit Hof und Wald über Kitzbühel",
  },
];

/** Entries bucketed by calendar year, newest year first. */
export function journalByYear(): [string, JournalEntry[]][] {
  const map = new Map<string, JournalEntry[]>();
  [...journal]
    .sort((a, b) => b.iso.localeCompare(a.iso))
    .forEach((e) => {
      const y = e.iso.slice(0, 4);
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(e);
    });
  return [...map.entries()];
}
