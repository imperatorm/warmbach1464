import Link from "next/link";

export const metadata = {
  title: "Rekonstruktions-Brief · Der Boden — 1464byW",
  description:
    "Der vollständige Brief, aus dem die Boden-Sequenz rekonstruiert werden kann: Marke, Narrativ, Kapitel, visuelles System, Navigation, Interaktionen, Stack und Scroll-Video-Verhalten.",
};

type Block = { h: string; rows: [string, string][] };

const BLOCKS: Block[] = [
  {
    h: "01 · Marke und kommerzielles Ziel",
    rows: [
      ["Marke", "1464byW — Warmbachhof, Kitzbühel. Keine erfundene Marke: die Sequenz ist Säule II („Boden\") einer bestehenden Markenwelt."],
      ["Angebot", "Das Bodenarchiv — die dokumentierte Herkunft des Brands: Standort, Gestein, Quelle und die Erdanalyse des Osthangs."],
      ["Konversionsziel", "Beitritt zum Club 1464 (Direktbezug ab Hof) bzw. eine Besuchsanfrage. Kein Warenkorb, kein Preis auf der Seite."],
      ["Substanz-Sperre", "Es werden ausschließlich belegte Werte gezeigt. Laborparameter stehen auf „—\" und sind sichtbar als ausstehend markiert, solange das Bodengutachten nicht vorliegt. Keine geschätzten Messwerte, keine Kausalbehauptung zum Geschmack."],
    ],
  },
  {
    h: "02 · Film und Narrativ",
    rows: [
      ["Datei", "soil_warmbach_video.mp4 — abgelegt unter public/video/, im Browser referenziert als /video/soil_warmbach_video.mp4."],
      ["Inhalt", "Ein hoher, rechteckiger Bodenkern im schwarzen Nichts, langsam um die Hochachse rotierend, während die Kamera von der wurzeldichten Krume bis zum zerklüfteten, wasserführenden Fuß absinkt."],
      ["Erzählung", "Der Abstieg IST die Seite. Vier belegte Schichten des Osthangs werden nacheinander erreicht; die Oberfläche erklärt, was die Kamera gerade passiert."],
      ["Dauer", "Wird aus loadedmetadata gelesen, nie hart kodiert."],
    ],
  },
  {
    h: "03 · Kapitel (an den Film gekoppelt)",
    rows: [
      ["I — Die Auflage · 0–15 cm", "„Lebendig, offen, vogelfreundlich.\" Wurzelfilz, Streu, Regenwurmgänge; entscheidet die Wasserhaltung im August."],
      ["II — Der Verwitterungsboden · 15–60 cm", "„Osthang ohne Kaltluftsee.\" Der Schiefer zerfällt zu Boden; kalte Luft fließt ab, kein stehender Frost."],
      ["III — Der Schiefer · ab 60 cm", "„Erzführend — Eisen und Kupfer.\" Wildschönauer Schiefer, nördliche Grauwackenzone. Leitzitat: „Derselbe Berg, der das Obst nährt, lieferte einst das Kupfer.\""],
      ["IV — Das Wasser · Tiefe", "„Geführt zum Warmbach · 7 °C.\" Die wasserführende Schicht am Grund; dieselbe Quelle nährt den Hof."],
      ["V — Das Bodenarchiv", "Auf festem Grund unter dem Film: das Register der Parameter samt Ausstehend-Hinweis, CTA und Rückweg."],
    ],
  },
  {
    h: "04 · Visuelles System",
    rows: [
      ["Grund", "Der Film liegt fixiert und formatfüllend hinter der Oberfläche; darüber nur Typografie und Linien — keine opaken Panels, die das Bild zudecken."],
      ["Farbe", "Ausschließlich die Haus-Token: night #1D291D, cream #EDE6D4, gold #B8893A, copper #8C5A2B, terrakotta #713940, kalk #D9D7CF, stone #9C9489."],
      ["Typografie", "Whyte (self-hosted) für Display und Kapitel — .t-hero in mittlerer Stärke, .t-poster in Black für Zahlen; EB Garamond kursiv (.t-accent) für die betonte Zeile."],
      ["Instrumentierung", "Laufende Kopfzeile mit Ort und Gestein, Tiefenanzeige in cm, gestrichelte Schichtgrenzen, Registermarken — die Sprache eines Museumsexponats, nicht eines Dashboards."],
    ],
  },
  {
    h: "05 · Navigation",
    rows: [
      ["Konzept", "Die Navigation ist der Bohrkern selbst: eine vertikale SVG-Säule rechts mit Farbverlauf über die vier Schichten, gestrichelten Schichtgrenzen, Tiefenmarken und einem mitlaufenden Marker."],
      ["Verhalten", "Jede Schicht ist eine echte Schaltfläche; ein Klick scrollt an die Mitte des zugehörigen Kapitels, der Film scrubbt mit. Die aktive Schicht ist golden markiert (aria-current)."],
      ["Klein", "Unter lg wird die Säule ausgeblendet; Kapitel und Tiefenanzeige bleiben vollständig lesbar."],
    ],
  },
  {
    h: "06 · Signatur-Interaktionen",
    rows: [
      ["Scrub", "Der Seitenfortschritt bewegt die Filmzeit — die eine tragende Bewegung."],
      ["Tiefenzähler", "Eine Ziffer zählt 0 → 120 cm mit dem Abstieg, per ref geschrieben, ohne Re-Render."],
      ["Kapitelwechsel", "Kreuzblende mit leichtem Weichzeichner; nur der aktive Text ist interaktiv."],
      ["Marker", "Der Kernmarker wandert die SVG-Säule entlang, gekoppelt an denselben Fortschritt."],
      ["Parallaxe", "Dezente Zeigerparallaxe auf dem Film (max. 14 px), auf Touch und bei reduzierter Bewegung aus."],
    ],
  },
  {
    h: "07 · Technischer Stack",
    rows: [
      ["Rahmen", "Next.js 14 App Router, TypeScript, Tailwind 3.4 mit CSS-Variablen-Token."],
      ["Bewegung", "framer-motion für Reveals; die Scroll-Video-Maschine ist handgeschrieben (ein RAF-Loop, keine Animationsbibliothek)."],
      ["Glättung", "Genau eine Lenis-Instanz global, ein RAF-Loop; imperativ erreichbar über lib/smoothScroll."],
      ["Video", "Natives <video>-Element, kein Canvas-Rendering."],
    ],
  },
  {
    h: "08 · Scroll-Video-Verhalten",
    rows: [
      ["Grundsatz", "Scrollen sucht nie direkt. Scrollen setzt nur ein Ziel; ein einzelner RAF-Loop führt einen internen Abspielkopf per bildratenunabhängiger exponentieller Dämpfung an dieses Ziel heran."],
      ["Seek-Disziplin", "Höchstens eine Suche gleichzeitig. Während der Decoder arbeitet, wird nur das neueste Ziel behalten — keine wachsende Warteschlange, kein veralteter Wert, der den Film zurückzieht. Entleert wird über das seeked-Ereignis."],
      ["Konstanten", "DAMPING_LAMBDA 9 · SETTLE_EPSILON 0,004 s · SEEK_EPSILON 0,012 s · MAX_FRAME_DT 0,1 s — dokumentiert, nicht im Loop verstreut."],
      ["Robustheit", "muted, playsInline, preload=auto, disablePictureInPicture; Ladeanzeige mit Pufferfortschritt; Fehlerfall zeigt die Schichten als Text. Das src wird beim Cleanup bewusst nicht entfernt, damit StrictMode den geladenen Decoder nicht verwirft."],
      ["Reduzierte Bewegung", "Kein Scrubbing: ein repräsentatives Einzelbild wird gesetzt und in Ruhe gelassen."],
    ],
  },
  {
    h: "09 · Auto Tour",
    rows: [
      ["Zustände", "Tour starten → Pause → Fortsetzen → Erneut, mit Prozentanzeige; „Neu\" erscheint ab 2 % Fortschritt."],
      ["Tempo", "1× durchläuft die Seite in 20 s, 2× in 10 s — über den normalisierten Fortschritt, unabhängig von der Dokumenthöhe."],
      ["Abgabe der Kontrolle", "Mausrad, Touch, Zeigerziehen außerhalb des Bedienelements sowie Bild-auf/-ab, Pos1, Ende, Leertaste und Pfeiltasten pausieren. Escape hält an, ohne die Leseposition zu verändern."],
      ["Technik", "Lineare Interpolation über den Fortschritt, Frame für Frame in die geteilte Lenis-Instanz geschrieben. Kein Re-Render pro Bild: Werte gehen in refs und eine CSS-Custom-Property. Nicht auf dieser Seite sichtbar."],
    ],
  },
  {
    h: "10 · Responsivität und Zugänglichkeit",
    rows: [
      ["Aufbau", "Track über 520svh, innen ein klebender Viewport. Keine horizontale Überlauf-Achse."],
      ["Klein", "Kapiteltext und Tiefenanzeige bleiben vollflächig lesbar; die Kernsäule entfällt, die Kopfzeile kürzt sich."],
      ["Semantik", "Kapitel sind echte <article>-Elemente und stehen vollständig im DOM — auch die gerade unsichtbaren, damit Vorlesesoftware die ganze Sequenz erfassen kann. Die Navigation ist ein <nav> aus echten Schaltflächen."],
      ["Fokus und Kontrast", "Sichtbare Fokusringe in Gold, Text durchgehend mit Schattierung gegen den Film gesetzt, dekorative Elemente per aria-hidden ausgeblendet."],
    ],
  },
];

export default function PromptPage() {
  return (
    <main className="bg-night px-6 pb-24 pt-32 text-cream lg:px-10">
      <div className="mx-auto max-w-[1000px]">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold">
          Rekonstruktions-Brief
        </p>
        <h1 className="t-hero mt-5 text-[clamp(2.2rem,5.5vw,4rem)] text-cream">
          Der Boden — <span className="t-accent">vollständig rekonstruierbar</span>
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-cream/75 lg:text-base">
          Alles, was nötig ist, um die Boden-Sequenz von Grund auf neu zu bauen: Marke,
          Narrativ, Kapitelinhalte, visuelles System, Navigationskonzept, Interaktionen,
          Stack, Scroll-Video-Verhalten, Auto Tour und die Anforderungen an Responsivität
          und Zugänglichkeit.
        </p>

        <div className="mt-16 flex flex-col gap-14">
          {BLOCKS.map((b) => (
            <section key={b.h}>
              <h2 className="border-b border-cream/20 pb-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-gold">
                {b.h}
              </h2>
              <dl className="mt-5">
                {b.rows.map(([k, v]) => (
                  <div
                    key={k}
                    className="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-cream/10 py-4 sm:grid-cols-[210px_1fr]"
                  >
                    <dt className="text-[0.68rem] uppercase tracking-[0.18em] text-cream/70">{k}</dt>
                    <dd className="text-sm leading-relaxed text-cream/85">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <div className="mt-16 border-t border-cream/15 pt-6">
          <Link
            href="/boden"
            className="text-[0.62rem] uppercase tracking-[0.24em] text-cream/70 transition-colors duration-300 hover:text-gold"
          >
            ← Zur Boden-Sequenz
          </Link>
        </div>
      </div>
    </main>
  );
}
