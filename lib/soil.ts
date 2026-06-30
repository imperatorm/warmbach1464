// Bodenarchiv — Datenmodell der Stern-Säule „Boden".
//
// SUBSTANZ-LOCK: Auf der Website werden ausschließlich Werte aus dem vorliegenden
// Bodengutachten gezeigt — keine Schätzwerte. Solange das Gutachten nicht als Datei
// vorliegt (Konzept 09 §5.3 · Council §6.3 = kritischste Lücke), bleiben die Werte „—"
// und sind klar als ausstehend markiert. Die Deutungssätze bleiben sensorisch-erzählerisch
// und behaupten keine wissenschaftliche Kausalität zum Geschmack („geprägt von", nicht „beweist").

export type SoilRow = { param: string; value: string; reading: string; pending: boolean };

export const soilPending = true;

export const soilStandort = {
  ort: "Warmbachhof · Osthang",
  hoehe: "760 m",
  gestein: "Wildschönauer Schiefer · nördliche Grauwackenzone",
};

export const soilArchive: SoilRow[] = [
  { param: "Bodenart / Horizont", value: "—", reading: "Verwitterungsboden über Schiefer", pending: true },
  { param: "pH-Wert", value: "—", reading: "Säure-Balance des Hangs", pending: true },
  { param: "Humusgehalt", value: "—", reading: "Lebendigkeit der Auflage", pending: true },
  { param: "Calcium / Magnesium", value: "—", reading: "Mineralische Tiefe, Dolomit-Einfluss", pending: true },
  { param: "Kalium / Phosphor", value: "—", reading: "Kraft für Frucht und Süße", pending: true },
  { param: "Eisen / Spurenelemente", value: "—", reading: "Signatur des erzführenden Schiefers", pending: true },
];

// Der vertikale Tiefenschnitt — von der Humusauflage bis zum wasserführenden Schiefer.
export type SoilLayer = { key: string; title: string; note: string; depth: string };

export const soilLayers: SoilLayer[] = [
  { key: "humus", title: "Humusauflage", note: "Lebendig, offen, vogelfreundlich", depth: "0–15 cm" },
  { key: "verwitterung", title: "Verwitterungsboden", note: "Osthang ohne Kaltluftsee", depth: "15–60 cm" },
  { key: "schiefer", title: "Wildschönauer Schiefer", note: "Erzführend — Eisen & Kupfer", depth: "ab 60 cm" },
  { key: "wasser", title: "Wasserführende Schicht", note: "Geführt zum Warmbach · 7 °C", depth: "tief" },
];
