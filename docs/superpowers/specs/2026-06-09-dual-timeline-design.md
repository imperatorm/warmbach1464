# Dual-Zeitstrahl Kitzbühel ↔ Warmbach — Design-Konzept

- **Datum:** 2026-06-09
- **Status:** Als Rubrik **`/chronik`** integriert (Nav + Footer), Variante A interaktiv, mobil poliert. Kitzbühel-Daten quellenbelegt (§2), Typecheck sauber. **Deployed** auf die grüne Version (`1464byw-green`, passwortgated) am 2026-06-09. Offen: finale Familien-/Auftraggeber-Freigabe der Kitzbühel-Daten.
- **Zielversion:** Grüne „Natur"-Version (Worktree `1464byw-green`, Branch `v2-green`, Live: https://1464byw-green.vercel.app)
- **Baut auf:** dem bestehenden `components/timeline/Timeline.tsx` + `lib/timeline.ts` (22 belegte Hofchronik-Stationen 1464→Heute)

> Hinweis: Die drei offenen Entscheidungen sind geklärt (Layout A · Daten selbst recherchiert · Prototyp gebaut — siehe §6). Der Prototyp ist gebaut und verifiziert (siehe §8).

---

## 1. Die Idee

Zwei eigenständige Zeitstrahlen auf **einer gemeinsamen Zeitachse**:

- **Kitzbühel** (Stadtgeschichte)
- **Warmbach / 1464byW//** (Hofgeschichte)

Dort, wo sich beide Geschichten berühren, eine sichtbare **Parallele** (kupferne Querverbindung mit Label). Kernbotschaft: Der Hof ist kein isolierter Punkt, sondern eingewoben in ~860 Jahre Stadtgeschichte.

---

## 2. Die zwei Stränge

### Kitzbühel (öffentliche Stadtgeschichte — **quellenbelegt**, Stand 2026-06-09)

| Jahr | Station | Quelle |
|------|---------|--------|
| um 1165 | Ersterwähnung „Chizbuhel" (Chiemseer Urkunde; aus Personenname Chizzo + „Bühel") | Stadt Kitzbühel, Historisches |
| 6. Juni 1271 | Stadtrecht durch Herzog Ludwig II. von Oberbayern; Stadt mit Wehrmauer befestigt | Stadt Kitzbühel (750 Jahre Stadterhebung) |
| 16. Jh. | Silber- & **Kupfer**bergbau am Röhrerbühel (unter den Fuggern); Hl.-Geist-Zeche 1583 ~800 m tief | SAGEN.at, Silber- u. Kupferbergbau Röhrerbühel |
| 30. Juni 1504 | Kitzbühel wird tirolisch (nach dem Landshuter Erbfolgekrieg, Maximilian I.) | Tiroler Landesarchiv, „Tirol … 1504" |
| 15. März 1893 | Franz Reisch befährt das Kitzbüheler Horn auf Ski — erste Schilderung einer alpinen Skiabfahrt | Franz Reisch (Wikipedia) |
| 28./29. März 1931 | Erstes Hahnenkammrennen (Kitzbüheler Ski Club) | hahnenkamm.com, HKR-Chronik |
| Heute | Die Streif — eine der bekanntesten Abfahrten im Skiweltcup; internationaler Wintersportort | hahnenkamm.com |

> Substance-Lock erfüllt: jede Jahreszahl mit öffentlicher Quelle belegt (im Datenmodell als `source`-Feld geführt, im UI sichtbar). Der **Kupferbergbau** (Herzstück-Parallele #1) ist bestätigt — Röhrerbühel führte nachweislich Silber *und* Kupfer.

### Warmbach (bereits belegt — `lib/timeline.ts`)

Die bestehenden 22 Stationen aus dem Kitzbüheler Salbuch / „Look & Feel"-Deck Folie 2:
1464 Jörg Frey → 1556 Enzemann → … → 2000 Huber → **2018 Familie Wehrmann** → **Heute: erster eigener Brand** (562 Jahre nach Ersterwähnung).

---

## 3. Die Parallelen (das Herzstück)

1. **Kupfer** — Kitzbühels Kupferbergbau (15./16. Jh.) ↔ der **kupferne Kothe-Kessel** von 1464byW. Leitsatz: *„Das Kupfer der Berge kehrt in den Kessel zurück."*
2. **Ersterwähnung** — Kitzbühel ~1165 / Stadtrecht 1271 ↔ Warmbach **1464 im Kitzbüheler Salbuch**. Der Hof steht in den Urkunden der Stadt.
3. **Beständigkeit** — 1504 Kitzbühel wird tirolisch ↔ die lückenlose Hofchronik durch dieselben Jahrhunderte.
4. **Wandel zum Luxus** — Kitzbühel wird Weltort (Reisch 1893, Hahnenkamm 1931) ↔ 1464byW wird Ultra-Premium-Marke. Alpines Erbe → Weltklasse.
5. **Heute** — beide leben weiter: die Stadt als Luxus-Ort, der Hof brennt zum ersten Mal selbst.

---

## 4. Layout

### Option A — „Geteilte Zeitachse" (vertikal) · **EMPFEHLUNG**

- Mittige vertikale Jahres-Achse (oben ~1165 → unten Heute).
- **Kitzbühel links**, **Warmbach rechts** — jede Station als Karte/Knoten, an ihr Jahr auf der Achse gebunden.
- Beim Scrollen erscheinen die Stationen (`whileInView`, framer-motion).
- **Parallelen** = kupferne Querverbindung quer durch die Achse + Label/Note, dort wo eine Resonanz liegt.
- **Vorteile:** beide Geschichten klar lesbar, viel Raum fürs Storytelling, mobil stapelbar, edel.
- **Nachteil:** lange Seite.

### Option B — „Doppelspur-Scrubber" (horizontal) · interaktiver

- Zwei Spuren auf einer waagerechten Achse, Playhead in der Mitte, Detail-Panel.
- Parallelen als vertikale Verbinder zwischen den Spuren.
- Knüpft an den bestehenden horizontalen Zeitstrahl an, cineastisch.
- **Nachteil:** weniger Textraum; ~860 Jahre Spanne brauchen sorgfältige Bedienung/Skalierung.

### Option C — verwobener Einzelstrang (getaggt) · nicht empfohlen

- Ein Strang, Einträge chronologisch verwoben, je nach Herkunft farbig getaggt. Am simpelsten, aber das „parallel" geht verloren.

---

## 5. Backend / Datenmodell

Typisiertes Datenfile `lib/chronik.ts`:

```ts
type Track = "kitzbuehel" | "warmbach";

type TimelineEvent = {
  id: string;
  track: Track;
  year: number;        // numerisch, für die Achsen-Position
  yearLabel: string;   // Anzeige: "um 1165", "1464", "Heute"
  title: string;
  body: string;
  source: string;      // Belegquelle (Salbuch / Stadtarchiv / öffentlich)
  theme?: string;      // z. B. "kupfer" — für Akzente + Parallelen
};

type Parallel = {
  id: string;
  kitzbuehel: string;  // Event-id
  warmbach: string;    // Event-id
  label: string;       // z. B. "Kupfer" — die Resonanz
  note?: string;       // ein Satz, der die Parallele erklärt
};

export const kitzbuehel: TimelineEvent[] = [ /* … */ ];
export const warmbach: TimelineEvent[]  = [ /* aus lib/timeline.ts migriert */ ];
export const parallelen: Parallel[]     = [ /* die 5 aus Abschnitt 3 */ ];
```

- Die bestehenden 22 Hofchronik-Einträge wandern **1:1** in `warmbach` (mit numerischem `year`; „Heute" → `year: 2026`, `yearLabel: "Heute"`).
- Eine Komponente `<ParallelChronik>` liest beide Spuren + `parallelen`, positioniert die Events auf der gemeinsamen Achse und zeichnet die Parallel-Verbinder.
- **„Backend" heute = versioniertes TS-Datenfile** (schnell, kein Infra-Aufwand, im Git versioniert).
- **Phase 2 (optional):** Wenn die Familie ohne Entwickler pflegen will → Headless-CMS (z. B. Sanity) oder MDX. Erst bei Bedarf.

---

## 6. Entscheidungen (geklärt 2026-06-09)

1. **Layout:** ✅ **Option A** (geteilte vertikale Achse) — erweitert um echte Interaktion (anklickbare Kupfer-Brücken, Lit/Dim, mitlaufender Scrollbalken).
2. **Kitzbühel-Daten:** ✅ **Selbst recherchiert + quellenbelegt** (siehe §2); jede Jahreszahl mit öffentlicher Quelle. Bleibt dem Auftraggeber zur finalen Bestätigung vorgelegt.
3. **Prototyp/Integration:** ✅ Gebaut und als Rubrik `/chronik` integriert (grüne Version), verifiziert (siehe §8).

---

## 7. Nächste Schritte

1. ✅ Die drei Entscheidungen klären.
2. ✅ Kitzbühel-Daten belegen → `lib/chronik.ts` füllen.
3. ✅ `<ParallelChronik>` bauen, mobil poliert (Kitzbühel-Karten linksbündig im Stack).
4. ✅ Als **Rubrik `/chronik`** integriert — Eintrag in `lib/content.ts` (`nav`, Haupt- + Mobil-Menü) und Footer; Test-Route entfernt.
5. ⏳ Auftraggeber-Freigabe der Kitzbühel-Daten + Layout.
6. ✅ Deploy nach `1464byw-green` (2026-06-09 — committet `882bf61`, live & passwortgated; verifiziert: `/` und `/chronik` → 307 `/enter`).
7. ⏳ Optional: bestehende Einzel-`ChronicleSection` (horizontaler Hofchronik-Zeitstrahl) auf Home/Heritage prüfen — behalten, verschlanken oder auf `/chronik` verlinken.

## 8. Gebaute Rubrik (2026-06-09)

**Dateien**
- `lib/chronik.ts` — Datenmodell + beide Stränge, mit **Pflege-Anleitung im Kopf-Kommentar** (Stationen/Parallelen ändern ohne Komponenten-Eingriff). Kitzbühel quellenbelegt; Warmbach 1:1 aus `lib/timeline.ts` (import, kein Duplikat). 5 `parallelen`. Helfer `buildChronikRows()` (verschmilzt nach Jahr) + `parallelsFor()`.
- `components/timeline/ParallelChronik.tsx` — die interaktive Komponente.
- `app/chronik/page.tsx` — die **Rubrik-Seite** (SEO-Metadaten, Seitenkopf, Abschluss-Note). Dev offen, Produktion hinter Passwort.
- `lib/content.ts` (`nav`) + `components/ui/Footer.tsx` — Navigations-/Footer-Eintrag „Chronik". (Test-Route `/chronik-test` entfernt.)

**Interaktion (Variante A, erweitert)**
- Geteilte vertikale Achse: Kitzbühel links, Warmbach rechts, gemeinsame Jahres-Achse mittig. Zeilen nach Jahr verschmolzen (gleiches Jahr ⇒ gleiche Höhe, z. B. „Heute" auf beiden Seiten).
- **Resonanz-Chips** (5) + Klick auf markierte Stationen aktivieren eine Parallele: die zwei verbundenen Karten leuchten, alle anderen dimmen, eine **kupferne Brücke** wird quer über die Achse gezeichnet (animierter Pfad), die Note erscheint. Esc / „zurücksetzen" hebt auf.
- `warmbach-heute` ist Anker zweier Parallelen (Kupfer + Heute) → zeigt beide Labels, Klick wechselt durch.
- Zarte Dauer-Fäden (opacity 0.16) laden zum Erkunden ein; **mitlaufender Kupfer-Scrollbalken** auf der Achse (framer `useScroll`, scaleY).
- Mobil: gestapelt, Brücken ausgeblendet (Resonanz via Note + Hervorhebung). `prefers-reduced-motion` respektiert.

**Verifiziert:** `tsc --noEmit` 0 Fehler · Dev-Compile fehlerfrei · keine Konsolenfehler · Desktop (Brücken diagonal + horizontal, Lit/Dim, Scrollbalken scaleY≈Scroll) + Mobil visuell geprüft.

**Belege (Kitzbühel):** Stadt Kitzbühel (Historisches / 750 Jahre) · SAGEN.at (Röhrerbühel) · Tiroler Landesarchiv (1504) · Wikipedia (Franz Reisch) · hahnenkamm.com (HKR).
