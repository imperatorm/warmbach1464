# Founders Club Portal — „Der Sitz"

**Stand:** 2026-06-10 · **Projekt:** 1464byw-green · **Status:** Design / Spec (vor Implementierung)

---

## 1 · Kontext & Ziel

Der **Founder's Circle** existiert bereits als öffentliche Konzeptseite (`app/founders-circle/page.tsx`): 464 lebenslange Sitze, Mitglieds-IDs `1464.001`–`1464.464`, sieben Privilegien (P1–P7), Eintritt über Erstkauf / Cooptation / Patenfass.

Dieses Projekt baut das **Mitglieder-Portal dahinter** — den Bereich, in den ein Mitglied „eintritt", um seinen Sitz zu verwalten. Leitidee: **„Der Sitz", nicht „Mein Konto".** Das Portal ist kein Webshop-Login, sondern das private Hof-Archiv eines Mitglieds. Identität ist die Mitgliedsnummer, nicht eine E-Mail. Zurückhaltung *ist* der Luxus.

**Reifegrad:** Pre-Launch (Warteliste, noch keine echten Mitglieder). Daher **Version A — voll designter Prototyp** mit repräsentativen Daten und leichtem Zugang. Kein echtes Backend, keine Datenbank, keine Zahlung. Alles fühlt sich echt an; die Datenquelle ist später austauschbar (siehe §3 „Backend-Naht").

**Erfolgskriterium:** Beim Klicken durch das Portal entsteht das Gefühl einer *vollständigen, exklusiven* Membership-Plattform — visuell und im Ton ununterscheidbar von der bestehenden Seite, mit „Der Weg zum Release" als sichtbarem Höhepunkt.

---

## 2 · Nicht-Ziele (YAGNI)

Bewusst **nicht** Teil des ersten Builds:

- Echte Authentifizierung, Datenbank, Sessions serverseitig.
- Zahlungen, echte Bestellabwicklung, E-Mail-Versand.
- Echte Event-Anmeldung / Kalender-Sync / Echtzeit.
- Funktionierende Vererbungs-Übertragung (P7 wird im Hofarchiv **dargestellt**, nicht abgewickelt).
- Mehrsprachigkeit (Portal ist deutsch wie die übrige Seite).
- CMS-Anbindung (Inhalte liegen in einer Content-Datei — wie heute `lib/content.ts`).

Jeder dieser Punkte sitzt hinter der **Backend-Naht** (§3) und kann später ohne UI-Umbau nachgezogen werden.

---

## 3 · Architektur-Überblick

### Wo es lebt
Ein eigener, gegateter Bereich unter **`/sitz`**. Die öffentliche `/founders-circle`-Seite und der Footer bekommen einen dezenten Link **„Mitglieder · Eintreten"**.

### Gate-Muster (konsistent mit der bestehenden Seite)
Das bestehende Age-Gate (`components/ui/AgeGate.tsx` + `lib/useAgeConfirmed.ts`) ist das exakte Vorbild: ein **client-seitiges Gate**, das einen `localStorage`-Schlüssel liest und über ein Custom-Event live aktualisiert. Das Portal spiegelt das mit einem **`MemberGate`**:

- Kein Sitz-Session-Eintrag → Login-Screen (§4).
- Gültige Session → Portal.
- Schlüssel: `1464byw.sitz.member` · Event: `1464byw:sitz-changed`.

Das ist rein client-seitig und passt damit perfekt zu „Prototyp ohne Backend".

### Backend-Naht (die einzige Austausch-Stelle)
**Eine** Datei — `lib/founders/data.ts` — kapselt sämtliche repräsentativen Daten (Mitglied, Pipeline, Verfügbarkeit, Events, Anfragen, Concierge). Alle Komponenten lesen ausschließlich von hier. Später ersetzt ein echtes Backend (Auth + DB) diese Quelle; das UI bleibt unverändert. Dasselbe „swap-ready"-Prinzip wie bei den Fonts (`app/fonts.ts`) und der Content-Schicht.

### Eigene Hülle für `/sitz`
Das Portal hat seine **eigene ruhige Chrome** (Kopf + Seitennavigation), nicht die öffentliche `Navigation`/`Footer`.
- `app/sitz/layout.tsx` rendert `MemberGate` + die Portal-Hülle (`SitzShell`).
- `components/ui/Navigation.tsx` und `components/ui/Footer.tsx` erhalten je eine kleine Guard-Klausel: bei Pfad `/sitz*` `return null` (via `usePathname`). Minimal-invasiv, kein Route-Group-Refactor der bestehenden Seiten.
- Das Age-Gate bleibt site-weit aktiv (rechtliche Anforderung; einmal pro Browser).

---

## 4 · Zugang & Login (das „innovative" Modul)

**Screen:** die **Hofarchiv-Wand der 464 Sitze** — ein Gitter von 464 Punkten (29 × 16 = 464), jeder ein Sitz. Der Screen atmet die bestehende Holo-/Nacht-Ästhetik.

**Ablauf:**
1. Mitglied gibt seine **Mitgliedsnummer** ein (`1464.NNN`). Der zugehörige Punkt im Gitter **leuchtet auf** (Gold) — „dein Platz".
2. Bestätigung mit einem **4-stelligen „Wachssiegel"-Code**.
3. „**Platz einnehmen**" → Session gesetzt → Portal.

Kein E-Mail-Feld, kein „Passwort vergessen". Der Akt ist *Platznehmen*, nicht *Einloggen*.

**Demo-Zugang (Prototyp):** ein dezenter Hinweis am Screen nennt den Demo-Sitz **`1464.007 · Code 1464`**, damit Stakeholder ohne Hürde hineinkommen. Klar als Demo markiert; entfällt mit echtem Backend.

**Validierung (rein, testbar — Vorbild `lib/age.ts`):**
- Format `1464.NNN`, Bereich `001`–`464`.
- Code-Abgleich gegen den Seed.
- Fehlerfälle: ungültige Nummer → Punkt leuchtet nicht, ruhiger Inline-Hinweis. Falscher Code → sanftes Shake + „Der Code stimmt nicht."

---

## 5 · Module / Informationsarchitektur

Persistente Seitennavigation in `SitzShell`: **Der Sitz · Der Weg zum Release · Verfügbarkeit · Anfragen · Events · Hofarchiv**. Jede Ansicht eine eigene Route unter `/sitz/*`.

### 5.1 Der Sitz — Übersicht (`/sitz`)
Kuratierte Startseite, nicht vollgestopft. Anrede über Mitgliedsnummer + Aufnahmejahr. Oben ein kompakter Reife-Status; darunter die 2–3 Dinge, die *jetzt* anstehen (z. B. „Neue Edition in deinem Vorzugsfenster", „Gasthof-Nacht dieses Jahr verfügbar", „Tag X von Y im Glasballon"). Jede Karte verlinkt in ihr Modul.

### 5.2 Der Weg zum Release — Herzstück (`/sitz/weg`)
Die Produktionspipeline als Zeitleiste **mit aktueller Position und großem Countdown**. Vereint „Brennprozess/Phase" und „Zeitleiste bis Release" in einem Modul.

Phasen (verankert in `heritageChronicle` / `heritageElements`):
`Ernte & Auslese → Maische & Gärung → Brand (Brennblase Kothe) → Reifung im Glasballon → Abfüllung & Versiegelung → Allokation / Release`.

- Aktuelle Phase hervorgehoben; vergangene als erledigt, kommende als ausstehend.
- **Countdown bis Release** — Ziel: **Founder's Reserve N°1 (geplant Q4 2027)**, verankert in `heritageChronicle`; exaktes Datum im Prototyp repräsentativ.
- **Reifedauer wird vorerst NICHT angezeigt.** Die Zahl (1.464 Tage / 36 Monate) ist nicht final und wird ergänzt, sobald die Familie sie festlegt (substance-lock).
- Visuelle Sprache wiederverwendet aus `components/holo/Chronometer.tsx` (HoloPanel, HoloRing, `.holo-num`, `.scanlines`, Tilt-zum-Cursor) und `lib/time.ts`-Mathe-Muster. Respektiert `prefers-reduced-motion`.

### 5.3 Verfügbarkeit & Allokation (`/sitz/verfuegbarkeit`)
Was *für dich* reserviert/freigegeben ist. Knappheit nüchtern, kein FOMO-Banner.
- **Founder's Reserve N°1** — 464 Flaschen, 1:1 mit den Sitzen; „1 für deinen Sitz reserviert".
- Kommende Editionen (aus `content.ts` `editions`/`editionVariants`) mit Status und **Vorzugsfenster (P1: 14 Tage vor Markt)**.
- Status-Vokabular: `reserviert · freigegeben · zugeteilt`.

### 5.4 Anfragen (`/sitz/anfragen`)
Drei concierge-bestätigte Anfragen, geteilt über **eine** generische `RequestForm`:
- **Flasche auf Anfrage** — individuelle Bestellung (Patron-Cask, Sonderallokation, später Estate Edition P2). Kein Warenkorb — eine *Anfrage*, die der Concierge bestätigt. Fühlt sich an wie *beauftragen*.
- **Gasthof-Anfrage (Gästehaus Reith, P3)** — eine Nacht/Jahr: Wunschtermin → Hof bestätigt. Zeigt, ob die Nacht dieses Jahr bereits genutzt wurde.
- **Concierge-Direktdraht** — dritter Tab (ruhiger Thread, siehe 5.6).
- Zustände: `Entwurf → angefragt → bestätigt` (im Prototyp optimistisch, klar als repräsentativ markiert).

### 5.5 Events (`/sitz/events`)
Kommende Termine des Sitzkreises: Hof-Tasting (Start **15:04 Uhr**, das Marken-Motiv), Erntetag, Abfüll-Zeremonie N°1, Sitzkreis-Versammlung. Je Event: Titel, Datum, Zeit, Ort, knappe Platz-Notiz, „Platz anfragen" (concierge-bestätigt). Daten repräsentativ, an die Marke angelehnt.

### 5.6 Concierge-Direktdraht (Tab unter `/sitz/anfragen`)
Die persönliche Leitung zum Hof (P5, Antwort binnen 48 h). Ruhiger Anfrage-Thread (Beispiel-Verlauf), kein Chatbot. Absender/Adresse aus `content.ts` `brand.contactEmail` (`concierge@warmbachhof.com`).

### 5.7 Hofarchiv — Identität (`/sitz/archiv`)
Die Bronzetafel: Mitgliedsnummer, Aufnahmejahr, MCDLXIV, Sitznummer. **Vererbung (P7)** hier als Information dargestellt (nicht abgewickelt).

---

## 6 · Datenmodell (repräsentativ, in `lib/founders/data.ts`)

Alle Werte als Seed; Datumsanker aus `heritageChronicle`. TypeScript-`type`s in `lib/founders/types.ts`.

- **Member** — `{ id: "1464.007", name, joinedYear: 2026, seatNo: 7, accessCode, privileges: ["P1"…"P7"] }`
- **ReleasePipeline** — `phases: { key, label, date|null, status: "done"|"current"|"upcoming" }[]`, `targetReleaseISO` (repräsentativ, Q4 2027), `fillStartISO` (Mai 2026). **Keine** Reifedauer-Angabe (siehe §5.2).
- **Availability** — `{ edition, total, reservedForYou, released, claimed, firstAccessWindowDays: 14 }[]`
- **EventItem** — `{ title, dateISO, time: "15:04", location, type, capacityNote, rsvp: "offen"|"angefragt" }[]`
- **MemberRequest** — `{ kind: "flasche"|"gasthof", subject, dateISO?, status: "entwurf"|"angefragt"|"bestaetigt" }[]`
- **ConciergeThread** — `messages: { from: "member"|"concierge", text, dateISO }[]`
- **GasthofState** — `{ year, used: boolean }`

Berechnete Werte (Tage hoch/runter, aktuelle Phase, %-Fortschritt) kommen aus reinen Funktionen in `lib/founders/release.ts`, **nicht** aus dem Seed.

---

## 7 · Komponenten & Dateien (die Einheiten)

**Logik (rein, unit-getestet — Vorbild `lib/age.ts` + `*.test.ts`):**
- `lib/founders/types.ts` — Typen.
- `lib/founders/member.ts` — Nummern-Parsing/-Validierung, Code-Abgleich.
- `lib/founders/session.ts` + `lib/founders/useMember.ts` — localStorage-Session + Hook (spiegelt `useAgeConfirmed.ts`).
- `lib/founders/release.ts` — Pipeline-/Countdown-/Fortschritts-Mathe (spiegelt `lib/time.ts`).
- `lib/founders/data.ts` — der Seed (Backend-Naht).

**Komponenten (`components/sitz/`):**
- `MemberGate.tsx` — Login-Screen + Gate (spiegelt `AgeGate`).
- `SitzShell.tsx` — Kopf + Seitennavigation.
- `ReleaseTimeline.tsx` — Herzstück (Pipeline + Countdown, Holo-Sprache).
- `AvailabilityLedger.tsx`
- `RequestForm.tsx` — generisch (Flasche + Gasthof).
- `EventsList.tsx`
- `ConciergeThread.tsx`
- `ArchivePlaque.tsx`

**Routen (`app/sitz/`):** `layout.tsx` (Gate + Shell), `page.tsx` (Übersicht), `weg/`, `verfuegbarkeit/`, `anfragen/`, `events/`, `archiv/`.

**Edits an Bestehendem (minimal):** `Navigation.tsx` + `Footer.tsx` (Guard für `/sitz*`), `app/founders-circle/page.tsx` + `Footer` (dezenter „Eintreten"-Link).

---

## 8 · Wiederverwendung bestehender Muster

- **Gate:** `AgeGate` / `useAgeConfirmed` → `MemberGate` / `useMember`.
- **Reine, getestete Logik:** `lib/age.ts` (+ Test) → `lib/founders/member.ts`, `release.ts`.
- **Holo-Zeitsprache:** `components/holo/Chronometer.tsx`, `lib/time.ts`, `.holo-*`-CSS → `ReleaseTimeline`.
- **Inhalts-Seed:** `lib/content.ts` → `lib/founders/data.ts`.
- **Bewegung/Reveal:** `components/ui/Reveal.tsx`, `prefers-reduced-motion`-Regeln in `globals.css`.
- **Design-Tokens:** Palette (`night/soot/copper/gold/cream/stone/hairline`), Typo (`t-display/t-h1/t-h3/t-label`, Fraunces/Hanken, Old-Style-Ziffern).

---

## 9 · Design & Feel (Exklusivität als Textur)

- Anrede über **Mitgliedsnummer**, nicht „Hi User".
- **Anfragen werden bestätigt, nicht instant** — die Reibung ist der Luxus.
- 1464-Motive kehren wieder (15:04, MCDLXIV, Old-Style-Ziffern).
- Langsame, bewusste Übergänge; Custom-Cursor; viel Leerraum.
- Keine Badges, keine Fortschritts-Dopamin-Tricks, kein Gamification.
- Tiefe statt Breite: man scrollt in einen Bereich, statt zwölf Widgets gleichzeitig zu sehen.

---

## 10 · Fehlerbehandlung & Edge Cases

- Ungültige Mitgliedsnummer / Code → ruhige Inline-Rückmeldung (kein harter Fehler).
- `localStorage` blockiert (privater Modus) → In-Memory-Session für die Sitzung; Hinweis.
- `prefers-reduced-motion` → Holo-/Float-/Ring-Animationen aus (globale Regel greift).
- Anfragen im Prototyp → optimistischer „angefragt"-Status, klar als repräsentativ markiert (kein echter Versand).
- Direktaufruf von `/sitz/*` ohne Session → Gate fängt ab, zeigt Login.

---

## 11 · Testing

- **Unit (vitest):** `member.ts` (Format/Bereich/Code), `release.ts` (Tage hoch/runter, aktuelle Phase, Fortschritt, Stabilität über Zeitzonen wie `age.test.ts`).
- **Verifikation im Browser (Preview-Workflow):** Login-Fluss, Modul-Navigation, Reduced-Motion, Responsive — Beweis per Screenshot/Snapshot, nicht „bitte selbst prüfen".

---

## 12 · Entscheidungen & offene Punkte

**Entschieden (2026-06-10):**
- Demo-Zugang: `1464.007 · Code 1464`.
- Concierge: Tab unter „Anfragen".
- „Mitglieder · Eintreten"-Link: Footer **und** `/founders-circle`, dezent.
- Reifedauer-Anzeige vorerst aus dem UI entfernt.

**Noch offen (blockiert die Implementierung nicht):**
1. **Reifedauer:** Die finale Zahl (Tage/Monate im Glasballon) legt die Familie Wehrmann später fest; danach wird die Anzeige im Modul „Der Weg zum Release" ergänzt. Bis dahin keine Reifedauer im UI (substance-lock).
