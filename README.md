# 1464byW — Web-Prototyp

Live-Prototyp der Marken-Website für **1464byW · WARMBACHHOF · Kitzbühel**.
Modular, dunkel-luxuriös, mit React-Three-Fiber-3D-Flasche als Markenherz.

## Stack
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** + CSS-Variablen (Design-Tokens)
- **React Three Fiber** + drei + postprocessing
- **GSAP** + **Framer Motion** für Choreografie
- **Lenis** für Smooth Scroll

## Setup

```bash
# Im Projektordner
npm install
# oder
pnpm install

# Dev-Server
npm run dev
# → http://localhost:3000

# Production-Build
npm run build && npm start
```

Node 18.17+ wird empfohlen. Erstes Laden braucht ca. 8–10 s, weil die R3F-Szene und Drei-Helper kompiliert werden.

## Struktur

```
/app
  layout.tsx          # Root-Layout mit Navigation, Footer, Age Gate
  page.tsx            # Home — alle Sektionen
  heritage/           # /heritage
  bottle/             # /the-bottle
  editions/           # /editions
  patronage/          # /patronage
  founders-circle/    # /founders-circle
  journal/            # /journal
  contact/            # /contact (Visit)
  legal/              # /legal — Impressum, Datenschutz, AgeGate
/components
  three/
    HeroBottleScene.tsx   # 3D-Flasche (Lathe-Geometrie, Glas-Material)
  sections/
    HeroSection.tsx
    ScrollStory.tsx
    HeritageSection.tsx
    EditionsGrid.tsx
    PatronageSection.tsx
    WaitlistSection.tsx
  ui/
    Navigation.tsx
    Footer.tsx
    AgeGate.tsx
    Monogram.tsx         # W// SVG (Platzhalter für finales Logo)
/lib
  content.ts             # Zentrale Texte und Editionen — später CMS
```

## Design-System

CSS-Variablen in `app/globals.css`. Tailwind-Tokens in `tailwind.config.ts`.

| Token | Farbe | Verwendung |
|-------|-------|------------|
| `night` | `#0E0E0E` | Hintergrund |
| `soot` | `#1A1714` | Sektionen, Karten |
| `copper` | `#8C5A2B` | Akzent warm |
| `gold` | `#B8893A` | Signets, Edition, CTA-Borders |
| `cream` | `#EDE6D4` | Text auf dunkel |
| `stone` | `#9C9489` | Meta / Captions |
| `hairline` | `#C8C0AE` | Subtile Linien |

Typografie: `--font-display` (Display, Garamond/GT Sectra), `--font-body` (Inter/Söhne).
Fonts können später als next/font integriert werden — Plätze sind in `globals.css` vorbereitet.

## 3D-Platzhalter ersetzen

Die Sanduhr-Flasche in `components/three/HeroBottleScene.tsx` ist als `LatheGeometry` mit parametrischem Profil aufgebaut. So lange es kein finales Modell vom Glas-Partner (Riedel Kufstein / Lamberts / Poschinger) gibt, ist die Form vollständig editierbar.

Sobald ein `.glb` vorliegt:

```tsx
import { useGLTF } from "@react-three/drei";
const { scene } = useGLTF("/bottle.glb");
return <primitive object={scene} />;
```

DRACO + KTX2 für Optimierung empfohlen. Datei in `public/bottle.glb`.

## Was später hinzukommt

| Phase | Aufgabe |
|-------|---------|
| Phase 1 (Q3 2026) | Echte Fotos (Hof, Brennraum, Urapfelbaum), Sanity CMS, Concierge-Form via Resend |
| Phase 2 (Q4 2026) | 3D-Welten 1–5 (Herkunft, Handwerk, Reife, Sammler, Produkt) mit Scroll-Trigger |
| Phase 2 | Auth (Clerk / Supabase) für Founder's Circle |
| Phase 3 (2027) | Shopify Hydrogen Shop, NFC-Echtheitsprüfung, optionale Blockchain-Provenance |
| Phase 3 | Multi-Language (EN / DE / FR / IT), PWA für Sammler-App |

## Komponenten-API

Alle Komponenten sind props-frei oder via `lib/content.ts` gespeist — kein Hardcoding in Sections. Damit ist der Schritt zu Sanity / Payload CMS minimal (Schema-Mapping auf `editions`, `heritageChronicle`, `patronageStages`).

## Performance

- `dynamic()` lädt R3F-Szene erst clientseitig → kein SSR-Block.
- `prefers-reduced-motion` ist in `globals.css` respektiert.
- `next/image` mit AVIF/WebP voreingestellt.
- Plausible (cookieless) als Analytics empfohlen — Setup über Custom Domain.

## Lizenzen / Drittinhalte

Logo (Monogram W//) als SVG-Platzhalter. Eingetragene Wortmarke: DPMA Reg.-Nr. 30 2026 207 672 (Inhaber: Certina IP AG, Grünwald). Vor Produktion: finales Logo der Brand-Identity-Agentur einbauen.
