# PLAN.md · 1464byW · Ultra-Premium 3D Brand Experience

> Lebendes Plan-Dokument (Briefing 07 §11.2). Wird nach jedem grösseren Commit aktualisiert.
> Stand: 2026-05-29 · Branch-Strategie: eine Branch + PR pro Phase.

## Mission

Den 1464byW-Prototypen auf das Niveau von Louis XIII, The Macallan in Lalique und
Hennessy Paradis Impérial heben. Drei Farben: Schwarz, Gold, Kupfer. Substanz schlägt
Behauptung. Jede Aussage über die Chronik 1464 ist aus `brand_memory/` belegbar.

## Entscheidungs-Log

| # | Datum | Entscheidung | Begründung |
|---|---|---|---|
| D1 | 2026-05-29 | **Fonts: freie Analoga, swap-ready.** Display = EB Garamond, Body = Inter, self-hosted via `next/font`. | GT Sectra (Grilli Type) / Söhne (Klim) sind kommerziell, nicht lizenzierbar im Build. EB Garamond ist die im Briefing §3.2 genannte Fallback-Stufe. Architektur erlaubt 1-Zeilen-Swap auf lizenzierte `.woff2`, sobald vorhanden. Erfüllt Akzeptanzkriterium 7 (self-hosted). |
| D2 | 2026-05-29 | **Scope dieser Runde: Scaffold + Phase 1 (Hero-Reinforce), dann Checkpoint.** | Phase 1 ist das Herzstück (Briefing §10). Checkpoint vor Phase 2. |
| D3 | 2026-05-29 | **Git lokal, kein Push.** Branches + Commits lokal; PR/Remote erst auf ausdrückliche Freigabe. | Kein Remote vorhanden; Push nur auf Anweisung. |
| D4 | 2026-05-29 | **HDR-Environment: gebackener/prozeduraler Alpine-Night-Rig.** | Externe HDR-Downloads sind im Build nicht reproduzierbar/lizenzsicher. Struktur erlaubt späteren `.hdr`-Drop-in via `useEnvironment`. |
| D5 | 2026-05-29 | **Editions-Daten an `brand_memory/01_product.md` ausrichten.** | `lib/content.ts` ist veraltet (300 statt 2000 Stück bei Premiere, falsche Volumina). brand_memory ist die Substanz-Quelle. (Phase 3) |

## Offene Fragen (für Familie Wehrmann)

1. **Preise auf Editions-Seiten?** Briefing §4.5 listet Preise (480/780/1480 €); das Web-Konzept (`02`) sagt „Keine Preise auf der Website". Konflikt vor Phase 3 zu klären. *Empfehlung: Preise nur im Founder's-Circle-Account, auf Editions-Seiten „Anfrage über Concierge".*
2. **Hero-Headline-Variante?** Briefing §4.3 = „1464byW / Seit 1464. Auf demselben Boden." Web-Konzept §Copy = „1464. / Der Warmbachhof erscheint im Salbuch…". *Phase 1 nutzt die Briefing-§4.3-Zeile; final vor Launch.*
3. **Echte HDR + Glas-`.glb`** vom Glas-Partner (Riedel Kufstein) — ersetzt parametrische Lathe-Flasche, sobald verfügbar.

## Phasen

### Phase 1 — Hero-Reinforce  ⟶  Branch `feat/hero-reinforce`  ·  STATUS: ✅ CHECKPOINT (Familie Wehrmann)
- [x] Dependencies ergänzt: `postprocessing` 6.36.4 (auf three 0.166 gepinnt), `troika-three-text`, `maath`, `tone`, `vitest`
- [x] Fonts self-hosted via `next/font` (EB Garamond + Inter), `--font-display`/`--font-body` verdrahtet, swap-ready
- [x] Crystal-Decanter-Flasche: `MeshTransmissionMaterial` (Glas), Bernstein-Kern (2. Lathe), Kupferplakette `N° 017/300`, Goldkapsel `W//`, Wachssiegel, Boden-Embossing `47.4486° N · 12.3936° E`
- [x] 3-Punkt-Beleuchtung (Key/Fill/Rim) + prozedurales Alpine-Night-Environment (Lightformer)
- [x] Post-Processing: Bloom · ACES ToneMapping · ChromaticAberration · Noise · Vignette
- [x] Idle: Y-Rotation 0.05 rad/s + Sinus-Float 0.4 Hz; Gold-Staub-Partikel (800)
- [x] LCP-Standbild (WebP 11 KB) → Suspense-Hydration → Cross-Fade 800 ms
- [x] `prefers-reduced-motion`: vollständig statischer Fallback (Canvas wird nie gemountet)
- [x] Tests (Vitest): 17 grün — Age-Gate-Logik, Content-Integrität, Bottle/Engraving-SSR
- [x] Lighthouse: **Desktop Perf 100 / A11y 96 · Mobile Perf 97 / A11y 96 · TBT 0 · CLS 0**
- [x] Docs: `docs/3d-architecture.md`, `docs/hero-v1.md`
- **Offen für Phase 5:** Mobile-LCP 2,6 s (Sim-Slow-4G, Ziel 2,5 s); iOS-Safari-fps am Gerät; Kontrast-Feinschliff (`stone`-Text)
- **Perf-Schlüssel:** 3D wird erst nach Age-Gate (+ Idle) initialisiert → TBT 9,3 s → 0 s, Perf 68 → 100
- **Deliverable:** Branch `feat/hero-reinforce` (lokal, kein Push) + Reel `docs/hero-v1.md`

### Phase 2 — Scroll-Choreographie  ⟶  `feat/scroll-choreography`  ·  STATUS: OFFEN
- [ ] Sieben Beats (GSAP ScrollTrigger + Lenis), Flasche vertikal mittig durchgehend
- [ ] Hintergrund-Bild-Ebenen (`mix-blend-mode: lighten`, 25 %), prozedurale Platzhalter
- [ ] Flaschen-Dissolve zu Partikeln bei 100 vh → Übergang Story
- [ ] Mobile: Beats linear gestapelt; `prefers-reduced-motion`: sechs Karten linear

### Phase 3 — Editions-Pages  ⟶  `feat/editions-pages`  ·  STATUS: OFFEN
- [ ] Drei Routen, geteiltes Bottle-Modell mit Edition-Variationen
- [ ] Tasting-Notes-Reveal (Nase · Antrunk · Mittelteil · Abgang)
- [ ] Founder's-Reserve-Page: Editionsnummer-Wähler (001–300), Live-Gravur-Vorschau, Concierge-Form

### Phase 4 — Founder's Circle + Concierge  ⟶  `feat/founders-circle`  ·  STATUS: OFFEN
- [ ] Multi-Step-Sign-Up (4 Schritte), 3D-Bestätigungssektion
- [ ] Concierge-Form (Resend, Template in `lib/email/`)

### Phase 5 — Polish, Performance, Audit  ⟶  `chore/launch-readiness`  ·  STATUS: OFFEN
- [ ] Visual Regression Tests (Playwright)
- [ ] Lighthouse-Final-Audit, axe-core A11y-Audit
- [ ] Docs-Refresh, `docs/3d-architecture.md`

## Performance-Budget (hart · Briefing §6)
LCP ≤ 2,5 s mobil / ≤ 1,8 s desktop · FCP ≤ 1,2 s desktop · CLS ≤ 0,02 · TBT ≤ 180 ms ·
Initial JS ≤ 240 KB · Lazy 3D ≤ 900 KB · Lighthouse Perf ≥ 88 mobil / ≥ 95 desktop · A11y ≥ 92 ·
iOS Safari ≥ 50 fps · `prefers-reduced-motion` voll statisch.

## Verbote (Briefing §9)
Keine Farbe ausser den 7 Tokens · keine Gradients (ausser dunkel→dunkler Vignette) · kein 2. CSS-Framework ·
keine externen Stockfotos in Prod · keine Buzzword-Copy · keine Drittanbieter-Cookies/Tracker · kein Lottie ·
keine Hover-Color-Switches · keine Auto-Play-Carousels · kein Dark-Pattern.
