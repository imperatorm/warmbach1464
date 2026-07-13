# Site-Review · 1464byW — Juli 2026

> Vollständige Seiten-Review aller 27 Routen auf Branch `redesign/v3-editorial`.
> Bewertung: **A** = fertig (nur Konsistenz-Check) · **B** = stark, gezielte Arbeit nötig ·
> **C** = Rebuild auf Design-System · **D** = Platzhalter/Legacy · **✕** = entfernen.
> Diese Datei ist die Checkliste für den Awwwards-Pass; jeder Punkt wird abgearbeitet.

## Zusammenfassung

| Route | Note | Urteil |
|---|---|---|
| `/` (Home v2) | A | keep — bleibt unangetastet (Entscheidung Familie) |
| `/v3` | B | **flagship** — 3D-Signaturmoment + Reveal-Polish |
| `/zeit` (+ `/hof`, `/kitzbuehel`, `/chronik`) | A | keep, Konsistenz-Check |
| `/boden` | A | keep (3D-Tiefenschnitt ist ein Highlight) |
| `/baeume` | A | keep (interaktiver Baum) |
| `/manufaktur` | A | keep (Blueprint-Pattern) |
| `/flasche` | A | keep (Produkt-Blueprint) |
| `/club`, `/club/mitglied-werden` | A | keep, Konsistenz-Check |
| `/club/partner` | C | visueller Alignment-Pass (Prototyp, kein Backend) |
| `/editions` | D | **rebuild** — echte Editorial-Show aus vorhandenen Daten |
| `/contact` | C | **rebuild** auf Design-System |
| `/legal` | C | **rebuild** (nur Markup, Text bleibt wörtlich) |
| `/galerie`, `/journal`, `/experience` | A | keep, Token-Abgleich |
| `/enter`, `/sitz/*` (6 Routen) | A | keep |
| `/baum-test`, `/flasche-test` | ✕ | löschen (Szenen leben in `components/three/`) |
| 404 | — | **fehlt** — `app/not-found.tsx` anlegen |

---

## Seiten-Befunde

### `/` — Home v2 · **A**
Editorialer Bogen (HeroEditorial → Manifesto → MaterialPalette → WordmarkMarquee → PillarPanels → EditorialSpread → ChronicleSection → ThresholdCTA). Pantone-Bänder, Scroll-Velocity-Marquee, Sticky-Panels. Bleibt per Entscheidung unangetastet; profitiert automatisch von Footer/PageTransition-Upgrades.

### `/v3` — Sanduhr-Home · **B (Flagship)**
- **Stark:** SplitHero-Zweiton, nummerierte Kapitel 01–04, HourglassMotif mit scrollgetriebenem Sand, BlueprintShowcase, GiantYearTimeline, PolaroidStack, MagneticLink-Threshold.
- **Fehlt für Awwwards-Niveau:** kein WebGL-Signaturmoment (die Marke *hat* eine 3D-Flasche — sie fehlt ausgerechnet hier); Display-Typo erscheint per Fade statt Line-Mask-Reveal; Bilder ohne Clip-Reveal; Threshold-Sanduhr statisch.
- **Maßnahmen:** „Die Flaschenkammer" (WarmbachBottleScene, poster-first, sichtbarkeitsgesteuertes frameloop) nach BlueprintShowcase; `LineReveal` für Display-Zeilen; `MaskReveal` für Bilder; Sandfüllung im Threshold an Scroll-Progress koppeln.
- **TODO (Familie):** `robots: noindex` entfernen, sobald /v3 promoted wird.

### `/zeit` + Unterwelten · **A**
Mirage-Pattern sauber umgesetzt, ParallelChronik ist substanzstark. Nur: Hero-Kicker-Klassen prüfen (`.t-label`), Reveals der H1 auf LineReveal heben.

### `/boden` · **A**
Terroir-Kapitel + 3D-Tiefenschnitt-Scrollytelling — bereits ein Jury-Moment. Kein Eingriff nötig; Token-Spotcheck.

### `/baeume` · **A**
Interaktive Baumszene + Editions-Karten. Karten-Hover auf `card-field`-Grammatik prüfen.

### `/manufaktur` · **A**
BlueprintShowcase + Spec-Grid + CollageFeatureList, belegte Kothe-Daten. Kein Eingriff.

### `/flasche` · **A**
Vier-Ansichten-Galerie mit Registrierungsmarken. Kein Eingriff; Bilder bekommen MaskReveal, sofern kostenlos möglich.

### `/club` · **A** — Zwei-Türen-Gateway, Privilegien-Grid. Konsistenz-Check.
### `/club/mitglied-werden` · **A** — Werte-Kriterien + Formular. Formular-Fokusring prüfen.

### `/club/partner` · **C**
Voller B2B-Prototyp (Segmente, Angebot, Portal-Module, Mock-Dashboard, unverdrahteter Login). Backend bleibt bewusst offen. **Maßnahme:** reiner Visual-Pass — Off-System-Klassen auf Tokens/`.t-*`, Buttons auf `MagneticLink`/`link-underline`-Grammatik, Nacht/Kalk-Rhythmus; dezentes „Prototyp"-Label.

### `/editions` · **D → rebuild**
Drei leere gestrichelte Rahmen („Darstellung folgt") — die schwächste Seite der Site, obwohl `lib/content.ts` sechs Colorways (Bernstein, Saphir, Rosé, Rubin, Onyx, Rauch) mit Bildern in `public/editions/` bereithält. **Maßnahme:** Full-bleed-Kapitel pro Colorway (OverlapHeading, `.t-label`-Glas-Spec, MaskReveal-Bild, Index 01/06, alternierendes Layout, Sticky-Indexleiste auf Desktop), Intro mit den zwei realen Editionen als Text (keine erfundenen Tasting-Notes), CTA „Anfrage über Concierge" (keine Preise — Markenentscheidung offen).

### `/contact` · **C → rebuild**
Legacy-HTML (`signage`/`display`-Klassen), Formular `action="#"` ohne Validierung, ohne Labels-Styling. Die Copy („Kommen Sie. Es ist still hier.") ist gut und bleibt. **Maßnahme:** Kalk-Band-Hero in v3-Grammatik, Hof/Concierge als Zweispalter, neue `ContactForm` mit Token-Inputs, echten Labels, Client-Validierung und „Anfrage vorgemerkt"-Bestätigung (weiterhin backend-los).

### `/legal` · **C → rebuild (nur Markup)**
Minimales Legacy-Markup. Rechtstext bleibt wörtlich erhalten; Anker `#impressum`/`#privacy`/`#age` bleiben (Footer verlinkt darauf). **Maßnahme:** `.t-*`-Typografie, `max-w-prose`, Haarlinien, Anker-TOC.

### `/galerie` · **A** — Kalk-Band + HofGallery (Lightbox, Tastatur-Nav). Token-Spotcheck.
### `/journal` · **A** — Drei belegte Einträge im card-field-Grid. Kein Eingriff.
### `/experience` · **A** — Cinematischer Alternativpfad. Legacy-`signage`-Klassen ersetzen.

### `/enter` · **A** — Passwort-Tor, noindex, atmosphärisch. Kein Eingriff.
### `/sitz` + 5 Unterseiten · **A**
Dashboard, Weg, Verfügbarkeit, Anfragen (3 Tabs), Archiv-Plakette, Events — konsistent und datengetrieben. Kein Eingriff.

### `/baum-test`, `/flasche-test` · **✕ löschen**
3D-Spielwiesen; `ElementalScene`/`WarmbachBottleScene` leben in `components/three/` und werden von `/baeume` bzw. der neuen Flaschenkammer konsumiert. Löschung erst **nach** Phase 1 (flasche-test ist aktuell der einzige Konsument der Szene).

---

## Querschnitts-Befunde

1. **404 fehlt.** `app/not-found.tsx` anlegen: Nacht, „1464 — Seite nicht gefunden", ausgelaufene Sanduhr (HourglassGlyph), MagneticLink zurück.
2. **Footer** nutzt Legacy-`signage`-Klasse; Newsletter-Input unverdrahtet und unstyled. → v3-Rebuild mit WordmarkMarquee-Schlussband, `link-underline`, Client-Validierung.
3. **PageTransition** ist ein einfacher Crossfade. → Nacht-Vorhang-Wipe (~600 ms), `initial={false}` bleibt (LCP), Reduced-Motion-Bypass bleibt.
4. **Ungenutzte Dependencies:** `gsap`, `tone`, `troika-three-text` — null Imports im App-Code (verifiziert). → entfernen.
5. **Metadaten:** `/contact` und `/legal` nur Titel; keine OG-Images, kein `sitemap.ts`/`robots.ts`. → ergänzen (Site ist produktiv passwortgeschützt, SEO sekundär — trotzdem sauber ausliefern).
6. **Cursor & Nav:** Custom-Cursor und Gooey-Pills sind Awwwards-taugliche Details — behalten. Tastaturpfad der Goo-Dropdowns prüfen (Escape/Blur schließt Menü).
7. **Reduced-Motion:** vorbildlich abgedeckt; jede neue Komponente (BottleChamber, LineReveal, MaskReveal, EntryVeil, Vorhang) muss denselben Standard erfüllen.
8. **Performance-Budget bleibt hart:** 3D niemals im Initial-Bundle (`next/dynamic`, `ssr:false`), Poster-first, frameloop pausiert außerhalb des Viewports, DPR ≤ 1.6.
