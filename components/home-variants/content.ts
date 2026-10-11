// Copy for the 03 Manufaktur / 04 Flasche design variants — lifted verbatim
// from components/aw/CraftFeatures.tsx and ArtifactBand.tsx, nothing new.

export const CRAFT = {
  kicker: "( 03 ) Manufaktur",
  title: "Handwerk, das sich nach dem Ort richtet — nicht nach dem Kalender",
  note: "Direkt vom Hof, in kleiner Zahl. Jede Flasche nummeriert, mit Echtheitszertifikat und Wachssiegel.",
  chapters: [
    {
      id: "boden",
      word: "Boden",
      title: "Der Boden trägt alles",
      body: "Ein Osthang auf 760 Metern, eine Quelle mit ganzjährig sieben Grad. Wie beim Wein entscheidet der Untergrund: worauf die Bäume stehen, schmeckt man später im Glas.",
      fact: "760 m · 7 °C",
      src: "/gallery/warmbach/img_0024.jpg",
      alt: "Wiese und Wilder Kaiser hinter dem Warmbachhof",
    },
    {
      id: "kupfer",
      word: "Kupfer",
      title: "Kupfer und Feuer",
      body: "Seit Mai 2026 arbeitet im Gewölbe die kupferne Kothe-Anlage — 100 und 400 Liter, katalytische Kupferschicht, Kolonne mit drei Umkehrkochböden. Schonender Zweifachbrand, Engschnitt im Herzstück.",
      fact: "100 + 400 l · Kothe",
      src: "/gallery/warmbach/img_0080.jpg",
      alt: "Die kupferne Kothe-Brennblase mit der Prägung 1464",
    },
    {
      id: "zeit",
      word: "Zeit",
      title: "Zeit ist die letzte Zutat",
      body: "Mindestens sechsunddreißig Monate. Nichts an diesem Haus ist beschleunigt worden — der Hof hat fünfhundertzweiundsechzig Jahre gebraucht, um zum ersten Mal selbst zu brennen.",
      fact: "≥ 36 Monate",
      src: "/gallery/warmbach/img_0096.jpg",
      alt: "Die geschwungene Holztreppe im Inneren des Hofs",
    },
  ],
};

export const BOTTLE = {
  kicker: "( 04 ) Die Flasche",
  title: "Was wir brennen, brennen wir einmal.",
  accent: "Premiere Edition",
  body: "Tiroler Glasbläsertradition mit Wurzeln im 18. Jahrhundert. Herkunft, Hand und Siegel — die Flasche erzählt, wo der Brand herkommt, bevor man ihn öffnet.",
  cta: "Weiter zur Flasche",
  src: "/figma/flasche-bottle-glasses.png",
  alt: "Die Warmbach-Flasche mit zwei Gläsern auf warmem Grund",
  details: ["/flasche/shot-neck.jpg", "/flasche/shot-base.jpg", "/flasche/shot-optic.jpg"],
  specs: [
    { k: "Glas", v: "Tiroler Glaskunst" },
    { k: "Brand", v: "Zweifachbrand · Kupfer" },
    { k: "Wasser", v: "Quellwasser · 7 °C" },
    { k: "Reife", v: "36 Monate, mindestens" },
    { k: "Siegel", v: "Wachs · Zertifikat" },
    { k: "Nummer", v: "Handnummeriert" },
  ],
};
