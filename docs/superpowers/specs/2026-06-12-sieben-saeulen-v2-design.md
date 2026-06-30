# 1464byW — Sieben Säulen V2 · Design- & Umsetzungs-Spezifikation

**Stand:** 12. Juni 2026 · **Projekt:** `1464byw-saeulen` (Kopie von `1464byw-green`)
**Grundsatz:** Kernkonzept, Design und Substanz bleiben **1:1**. Nur **Gliederung und Visualisierung** werden neu. Die alte Seite (`1464byw-green` → vercel) bleibt unangetastet; diese Version bekommt ein **eigenes, neues Vercel-Deployment**.

## 1 · Leitentscheidungen (aus dem Brainstorming bestätigt)

- **Struktur B** (Council V2.2): sieben verdichtete Säulen statt Seitenlogik.
- **Design 1:1**: W//-Logo & „1464 by W//"-Lockup, EB Garamond + Hanken Grotesk, „Natur"-Palette (night/soot/copper/gold/cream/stone/hairline), Hero, Cursor, Age-Gate, Passwort-Gate, Lenis-Scroll, PageTransition — alles bleibt.
- **Obere Leiste = Variante 1 (ausgeschrieben):** `Zeit · Boden · Bäume · Manufaktur · Flasche · Galerie` + Button `Club 1464`. Hero unverändert.
- **Startseite = schlank (Variante A):** Hero → veredelter Säulen-Index (7 Türen) → Chronik-Teaser. Keine sieben Vollbild-Kapitel.
- **Boden (Säule II) ist der Star:** Inszenierung = **Tiefenschnitt (immersiv) + editorial/warm (Var. 3)**, *kein* Laborbogen. Messwerte als feine, eingewobene Markierungen. „Protokoll"-Idee dezent, nie klinisch.
- **Galerie bleibt** (Name „Galerie", nicht „Archiv") — bestehende Fotos, nur edler kuratiert.
- **Chronik beibehalten** (lib/chronik.ts + Komponenten 1:1), nur verbessert, unter `/zeit/chronik`.
- **Lebendiger 3D-Baum** wird in Säule III (Bäume) untergebracht; **3D-Flasche** in Säule V.
- **Club = zwei Türen:** „1464" als Schwelle → **Club 1464** (Mitglieder, bestehender `/sitz`-Bereich 1:1) + **1464 Partner** (neu, Vertrieb für Großhandel/Gastronomie/Distribution).
- **Substanz-Lock bleibt:** keine erfundenen Tasting-Notes/Werte. Bodenwerte = Platzhalter bis Gutachten vorliegt.

## 2 · Sitemap & Routen

| Neue Route | Inhalt | Herkunft im Bestand |
|---|---|---|
| `/` | Hero + 7-Säulen-Index + Chronik-Teaser | page.tsx (PortalGateway umgebaut) |
| `/zeit` | Übersicht + drei Unterwelten | neu |
| `/zeit/hof` | Warmbachhof seit 1464, Wiederaufbau | neu (Texte aus Bestand) |
| `/zeit/kitzbuehel` | Salbuch, Bergbau, Sport-Heritage | neu |
| `/zeit/chronik` | bestehende Hofchronik | `/chronik` + ChronicleSection 1:1 |
| `/boden` | Tiefenschnitt + Erdanalyse-Modul (Platzhalter) | neu (Stern-Säule) |
| `/baeume` | lebendiger 3D-Baum, 47 Bäume, Früchte/Düfte → Brand | ElementalScene/Tree + Editionen |
| `/manufaktur` | Kupfer & Feuer, Kothe-Specs | `/heritage` (umbenannt) |
| `/flasche` | 3D-Flasche, Glasbläsertradition (IP-sicher) | `/bottle` (umbenannt) |
| `/galerie` | bestehende Galerie, edler | `/galerie` (bleibt) |
| `/club` | Schwelle: 1464 → zwei Türen | `/founders-circle` (Gateway neu) |
| `/club/mitglied-werden` | Aufnahme-Formular | `/founders-circle/mitglied-werden` |
| `/club/partner` | **Partner-Portal (neu)** | neu |
| `/sitz/*` | Mitglieder-Portal | **bleibt 1:1** |
| `/editionen` `/journal` `/contact` `/legal` | sekundär | bleiben |

**301-Redirects (next.config.mjs):** `/heritage→/manufaktur`, `/bottle→/flasche`, `/chronik→/zeit/chronik`, `/founders-circle→/club`, `/founders-circle/mitglied-werden→/club/mitglied-werden`.

**Navigation:** `nav` in lib/content.ts → die 6 Säulen-Routen. Club als eigener Button. Journal & Besuch (contact) wandern in den Footer. Mobile-Overlay = 6 Säulen + Club-Türen.

## 3 · Datenmodell (lib/content.ts)

Neu: `pillars: Pillar[]` (7) — Quelle für Index + Säulenseiten.
```
type Pillar = { no, slug, name, tagline, intro, sub?: {title, line, href?}[], accent? }
```
Slugs: `zeit, boden, baeume, manufaktur, flasche, galerie` (+ `club` als Schwelle separat).
`heritageElements` (5) bleibt erhalten und wird in Säule III/IV/VI weiterverwendet (umgehängt, nicht gelöscht). `nav` wird auf die neue Struktur umgestellt.

## 4 · Säulen-Seiten — gemeinsames Muster

Reusable `PillarShell` (components/sections): Säulen-Hero (Ziffer I–VII, Name, Tagline, ein Bild), dann Inhalts-Kapitel per Scroll (KEIN Akkordeon), unten „weiter zur nächsten Säule". Unterpunkte werden als ruhige, nummerierte Kapitel dargestellt — schön gegliedert, im bestehenden Look.

### Boden (Stern-Säule)
1. **Tiefenschnitt** — vertikale Scroll-Grafik: Humus → Verwitterungsboden (Osthang) → Wildschönauer Schiefer → wasserführend → Warmbach. Jede Schicht gibt einen Wert/Satz frei.
2. **Editorial/warm** — großes Serifen-Zitat „Worauf die Bäume stehen, schmeckt man später", Fotografie, der Bogen Schiefer→Kupfer.
3. **Erdanalyse-Modul** — feine, eingewobene Werte (pH, Humus, Ca/Mg, K/P, Fe) als **Platzhalter** (`lib/soil.ts`, klar als „aus Gutachten" markiert), KEIN Laborbogen-Look.

## 5 · Club & Partner

**`/club` Gateway:** „1464" groß, „Eine Schwelle, zwei Türen": Card **Club 1464** (→ `/sitz` Login, `/club/mitglied-werden`) + Card **1464 Partner** (→ `/club/partner`).

**`/club/partner` (neu):** Login-Plaque (im Stil von `/sitz`) + Dashboard-Konzept mit Modulen: **Bestellungen · Allokation · Konditionen · Lieferung · Dokumente · Einstellungen**, plus Demo-Tabelle „Offene Bestellungen" (Allokations-Logik). Partner-Typen: Großhandel/Gastronomie/Fachhandel/Distribution. Daten zunächst statisch (lib/partner/data.ts), als Backend-Seam wie lib/founders/data.ts. Auth-Mechanik wie Mitglieder-Portal (Prototyp-Code), getrennter Session-Key.

## 6 · Datenlücken (bewusst Platzhalter)
- Bodenanalyse & Wasseranalyse: noch keine Datei → Platzhalter-Werte, klar markiert.
- Salbuch-Faksimile: nur Deck-Auflösung → niedrigaufgelöst als Referenz, hochauflösend später.
- Zangenflasche: 3D bleibt formneutral bis IP-Freigabe.

## 7 · Umsetzungsphasen
1. Datenmodell `lib/content.ts` (pillars + nav).
2. `Navigation.tsx` (neue Leiste + Club-Button) + `Footer.tsx` (neue Links).
3. `PortalGateway.tsx` → 7-Säulen-Index; Startseite.
4. Routen: PillarShell + Seiten; `/heritage`→`/manufaktur`, `/bottle`→`/flasche`, neue `/zeit`(+sub), `/boden`, `/baeume`; `/galerie` bleibt.
5. `next.config.mjs` Redirects.
6. `/club` Gateway + `/club/partner` Portal + `lib/partner/*`.
7. Boden-Spezialmodule (Tiefenschnitt, Erdanalyse-Platzhalter, `lib/soil.ts`).
8. QS: Build, Preview-Verifikation, Mobile/Age-Gate/Redirects, dann **neues Vercel-Deploy** (alte Seite behalten).

## 8 · Erfolgskriterien
- Alle alten URLs leiten korrekt um; keine toten Links.
- Hero, Logo, Schrift, Farben, Cursor optisch identisch zur alten Seite.
- Sechs Säulen + Club in der Leiste; Startseite schlank.
- Boden fühlbar (Tiefenschnitt) ohne erfundene Werte.
- Chronik, 3D-Baum, 3D-Flasche, Galerie-Fotos sichtbar untergebracht.
- Club-Schwelle mit funktionierenden zwei Türen; Partner-Portal als klar gegliederter Prototyp.
- `npm run build` + Tests grün.
