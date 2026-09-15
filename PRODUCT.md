# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two co-primary audiences, roughly equal weight:

- **Private collectors** discovering the brand directly online, requesting editions via Concierge, and potentially joining Founder's Circle / Club 1464 (member area at `/sitz`).
- **Gastronomy / HORECA partners** (restaurants, bars) sourcing the Apfel Brand through trade inquiry — `lib/content.ts` records "Anfrage über Gastronomie oder 1464byW.com" as the stated channel for the flagship edition.

Both are pre-purchase discovery visitors, not checkout shoppers: the site has no cart or e-commerce, only inquiry paths (Concierge, Gastronomie-Anfrage, Founder's-Circle sign-up).

*(Carried forward unchanged from the `redesign/v3-editorial` PRODUCT.md, confirmed with the user earlier in this working session — `lib/content.ts` is byte-identical on this branch, so the underlying product facts don't change with the visual direction.)*

## Product Purpose

1464byW is an ultra-premium Tyrolean spirits brand produced at Warmbachhof, a documented estate near Kitzbühel. The website is the brand's digital experience: it tells the estate's heritage (five "pillars" — Zeit, Boden, Bäume, Manufaktur, Flasche), presents the two real editions (Apfel Brand, Ambassador Edition) without prices, and converts interest into a Concierge or Gastronomie inquiry — or, for the most engaged visitors, entry into Club 1464 / Founder's Circle. Success is a qualified inquiry or club application, not a transaction.

## Positioning

The estate's own documented continuity is the differentiator: Warmbachhof appears in the Kitzbühel Salbuch in 1464 and has continuous ownership record through today (562 years — this branch's `lib/timeline.ts` carries an even richer 22-entry chronicle than the other branch's summary version, down to named owners, livestock counts, and inheritance settlements). Everything in the bottle traces to that one place — its own east-facing slope (Boden), its own artesian spring (Wasser, 7 °C year-round), its own orchard (47 trees, oldest over 100 years), and its own copper still (Kothe, Zweifachbrand) — rather than sourced or blended inputs. No invented tasting notes, testimonials, or numbers: every claim on the site must trace to a source document. `app/prompt/page.tsx` (this branch's own internal reconstruction brief for the Boden sequence) states this as an explicit rule in its own words: **"Substanz-Sperre"** — only evidenced values are shown; unproven lab parameters render as "—" and are visibly marked pending rather than estimated.

Category comparisons to houses like Louis XIII, Macallan in Lalique, or Hennessy Paradis Impérial (see `PLAN.md`) are an **internal craft and production-value bar** — photography quality, copy restraint, material fidelity — not a public positioning claim. The site itself never name-drops or compares itself to those brands.

## Operating Context

- German-primary copy with an English claim line ("From our Soil to your Soul."); no other languages live yet.
- A legally required age-gate (`components/ui/AgeGate.tsx`, `lib/age.ts`) precedes any content — this is an alcohol brand.
- **This branch's live homepage** (`app/page.tsx`) is a from-scratch recomposition (`components/aw/*`, "aw" = awwwards): one continuous scrolling sheet in eight numbered chapters — Hero, ( 01 ) Manifest, ( 02 ) Die Säulen, ( 03 ) Manufaktur, ( 04 ) Die Flasche, ( 05 ) Hofchronik, ( 06 ) Die Zeit (lebendig), and a closing threshold — replacing the `redesign/v3-editorial` branch's composition entirely.
- Public site: heritage/pillar pages (`/zeit`, `/boden`, `/baeume`, `/manufaktur`, `/flasche`), editions (`/editions`), gallery (`/galerie`), journal (`/journal`), visit/contact (`/contact`).
- `/boden` has its own bespoke scroll-driven video sequence (`components/boden/BodenExperience.tsx`) — a descending core-sample film synced to four documented soil layers. `/prompt` is that sequence's own internal reconstruction brief (brand, narrative, chapters, visual system, stack, all spelled out as reference documentation) — a real, linked page (footnoted from `BodenExperience.tsx`), but developer/production documentation, not a visitor-facing marketing page; do not treat its content as a second product surface.
- Member area: Club 1464 at `/sitz` (Anfragen, Archiv, Events, Verfügbarkeit) plus `/club` (Partner-Eintritt, Mitglied-werden) — gated relationship content for those already admitted, separate from public discovery.
- No checkout anywhere. All commercial intent routes to a Concierge or Gastronomie inquiry (`concierge@warmbachhof.com`), or the Club 1464 "Mitglied werden" door.
- `lib/content.ts` is an explicit stand-in for a future CMS — components are meant to stay content-driven rather than hardcoded, to keep a later CMS swap cheap.

## Capabilities and Constraints

- **No public prices.** Editions show "Anfrage über Concierge" / "Anfrage über Gastronomie" — never a number. This branch's own `/prompt` documentation independently reconfirms the same rule ("Kein Warenkorb, kein Preis auf der Seite").
- Only two real editions exist: **Apfel Brand** and **Ambassador Edition**. `editionVariants` (Bernstein/Saphir/Rosé/Rubin/Onyx/Rauch) are glass-color/look descriptions only — never flavor or tasting claims.
- **No invented or estimated content.** Every factual claim must be traceable to a source document; an unmeasured value is shown as pending, never approximated. This is stated explicitly as the "Substanz-Sperre" rule in `app/prompt/page.tsx`.
- The hero and artifact-band 3D object (`components/three/HeroDecanterScene.tsx`) follows a strict performance contract, repeated verbatim in this branch's component comments: dynamic import with `ssr:false`, mounts only once the section is near and the thread is idle, poster-image-first with a crossfade, frameloop paused off-screen, and never mounted at all under `prefers-reduced-motion`.
- Logo is a placeholder monogram (`W//`); the registered wordmark is with a brand-identity agency, not yet integrated.
- Performance is a hard constraint carried from the brief (`PLAN.md`): LCP ≤ 2.5 s mobile / ≤ 1.8 s desktop, CLS ≤ 0.02, TBT ≤ 180 ms, Lighthouse Perf ≥ 88 mobile / ≥ 95 desktop, A11y ≥ 92, `prefers-reduced-motion` fully static.
- This repository carries multiple parallel visual branches (`v2`, `redesign/v3-editorial`, `redesign/awwwards`). Treat each branch's own implementation as its own current visual evidence — this branch (`redesign/awwwards`) has fully replaced the homepage composition and several shared components (`Cursor`, pillar chrome) with its own versions; it does not extend `redesign/v3-editorial`'s "dossier" system even though both start from the same underlying commit history and the same color tokens.

## Brand Commitments

- Name: **1464byW**. House: **WARMBACHHOF**. Monogram: **W//**. Estate line: "KITZBÜHEL · ANNO 1464."
- Claim (EN): "From our Soil to your Soul." Claim (DE): "Aus dem Salbuch 1464."
- Contact: `concierge@warmbachhof.com`, domain `warmbachhof.com`.
- Registered wordmark: DPMA Reg.-Nr. 30 2026 207 672, held by Certina IP AG, Grünwald — final logo integration is pending from the brand-identity agency.
- Five-pillar information architecture is a confirmed brand structure, not just a UI choice: **Zeit → Boden → Bäume → Manufaktur → Flasche**. Club/Sitz sits deliberately outside the pillars as a threshold, not a sixth pillar.

## Evidence on Hand

- **Hofchronik** (`lib/timeline.ts` `chronicle`): a richer, 22-entry sourced ownership record than the summary version elsewhere in the repo — named owners, livestock counts, inheritance settlements, and building marks, 1464 → today, each entry independently traceable to the Kitzbühel Salbuch.
- **Heritage elements** (`lib/content.ts` `heritageElements`): five sourced data points — Boden (760 m, Kalkalpen), Wasser (7 °C artesian spring), Baum (47 trees, oldest 100+ years), Kupfer (Kothe still, Brennmeister René Dubitzky), Zeit (min. 36 months in glass balloon, no wood, no correction).
- **The Boden reconstruction brief** (`app/prompt/page.tsx`): a fully documented four-layer soil profile (0–15 cm Auflage, 15–60 cm Verwitterungsboden, 60 cm+ Schiefer, and the water-bearing depth feeding the Warmbach spring) — real geology, explicitly gated behind "pending" lab values rather than invented ones.
- **Real estate photography** in `public/gallery/warmbach/` — used extensively across this branch's homepage and chronicle rail.
- **Editions data** (`lib/content.ts`): the two real products and six glass-color variants, explicitly marked as not-invented in the source comments.
- Explicit absences to preserve: no tasting notes beyond what's written, no customer testimonials, no case studies, no press quotes, no benchmark numbers, no estimated lab/soil measurements — none exist yet and none should be fabricated.

## Product Principles

1. **Provenance over invention.** Every claim traces to a source document. An unmeasured value is shown as pending ("—"), never estimated — this branch's own internal documentation names this the "Substanz-Sperre."
2. **One estate, nothing bought in.** The slope, the spring, the orchard, and the still are all on the same property — this single-source claim is the brand's real differentiator and should stay legible everywhere.
3. **Inquiry, not checkout.** The site's only conversions are Concierge, Gastronomie, and Club/Founder's-Circle applications. Never introduce cart or price-forward commerce patterns.
4. **Restraint as luxury signal.** The craft bar is set by ultra-premium spirits houses, but expressed through material fidelity, photography, and copy discipline — never through name-dropping or direct category comparison on the site itself.
5. **Motion is optional, substance is not.** `prefers-reduced-motion` must degrade to a fully static, still-complete experience; performance budgets are non-negotiable brand behavior, not an afterthought.

## Accessibility & Inclusion

- `prefers-reduced-motion` must produce a fully static fallback everywhere (no 3D canvas mount, no scroll-locked rail, no cursor-trailing photo) — a hard requirement repeated in nearly every component comment on this branch, not optional polish.
- Age verification (`AgeGate`) is a legal requirement for an alcohol brand and must gate all content.
- Lighthouse A11y ≥ 92 is a stated hard budget from the brief.
