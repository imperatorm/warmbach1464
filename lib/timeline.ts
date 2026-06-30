// Hofchronik Warmbach — belegt aus dem Kitzbüheler Salbuch.
// Quelle: „1464 by W Präsentation Look & Feel", Folie 2 (Salbuch-Faksimile + Liste).
// NICHT erfinden — jeder Eintrag steht so im Deck.

export type ChronicleEntry = {
  year: string;
  title: string;
  detail: string;
};

export const chronicle: ChronicleEntry[] = [
  { year: "1464", title: "Jörg Frey", detail: "Erste urkundliche Erwähnung: Jörg Frey zahlt 1 lb d an die Kirche. Der Warmbachhof erscheint im Kitzbüheler Salbuch." },
  { year: "1556", title: "Familie Enzemann", detail: "Die Familie Enzemann übernimmt den Hof." },
  { year: "1574", title: "Dachpfette", detail: "Einkerbung an der Dachpfette — eine bauliche Marke jener Zeit." },
  { year: "1605", title: "Thomas Hofer", detail: "2 Kühe, 18 Rinder, 22 Schafe, 25 lb Schmalz — davon 93 lb für den Eigenverbrauch." },
  { year: "1632", title: "Thomas Hofer", detail: "28 Kühe, 425 lb Schmalz; 80 lb verkauft, 145 lb Eigenverbrauch für 14 Personen." },
  { year: "1687", title: "Stephan Hofer", detail: "Quittung des Stephan Hofer, der vom Vater übernahm; anschließend erbt dessen Sohn Paul." },
  { year: "1734", title: "Anna Hofer", detail: "Anna Hofer erbt von Vater Paul. Witwe Christina Seybaldin behält die Hausführung." },
  { year: "1749", title: "Christian Vilzer", detail: "Anna Hofer verkauft an ihren Mann Christian Vilzer." },
  { year: "1778", title: "Grundsteuer", detail: "Wert laut Grundsteuer: 427 fl 28 kr." },
  { year: "1784", title: "Witwe Vilzer", detail: "Die Witwe Vilzer erbt gemeinsam mit ihren drei Söhnen." },
  { year: "1786", title: "Johann Vilzer", detail: "Sohn Johann übernimmt den Hof allein." },
  { year: "1812", title: "Kristian Obermoser", detail: "Kristian Obermoser erwirbt den Hof gegen die Schulden des Johann Vilzer von Sebastian Hechenberger." },
  { year: "1856", title: "Andrä", detail: "Andrä übernimmt vom Vater und entschädigt die Geschwister Gertraud, Anna, Elisabeth und Paul Simon mit 1.000 fl." },
  { year: "1892", title: "Fuchs", detail: "Am 29. März kaufen Leonhard und Anna Fuchs den Hof." },
  { year: "1894", title: "Feuersinger", detail: "Am 27. März erwerben Michael und Anna Feuersinger, geborene Stöckl, den Hof." },
  { year: "1939", title: "Anna Feuersinger", detail: "Anna Feuersinger stirbt." },
  { year: "1944", title: "Pirchmoser", detail: "Am 29. April übernehmen Tochter Anna Feuersinger und ihr Mann Michael Pirchmoser." },
  { year: "1971", title: "Jakob Pichmoser", detail: "Am 26. April übernimmt der Neffe Jakob Pichmoser." },
  { year: "1997", title: "Johanna Pichmoser", detail: "Am 25. März erfolgt die Schenkung an Johanna Pichmoser." },
  { year: "2000", title: "Familie Huber", detail: "Verkauf an die Familie Viktor Huber." },
  { year: "2018", title: "Familie Wehrmann", detail: "Kauf durch die Familie Dr. Hans Wehrmann." },
  { year: "Heute", title: "Der erste eigene Brand", detail: "562 Jahre nach der ersten Erwähnung brennt der Warmbachhof zum ersten Mal selbst — modernes Handwerk in einer neuen Ära der Destillation." },
];
