---
name: 1464byW — Warmbachhof (Awwwards direction)
description: One continuous scrolling sheet, its bands lifting over each other on soft rounded corners, where photographs float free of the grid and poster-weight numerals mark the passing of time.
colors:
  bronze-green: "#1d291d"
  bronze-green-800: "#2b3b2b"
  mocha-bisque: "#8c5438"
  copper: "#c57e5b"
  cloud-dancer: "#f0efeb"
  cloud-dancer-400: "#a8a59b"
  cloud-dancer-500: "#9b988e"
  light-gray: "#d9d7cf"
  oxblood-red: "#713940"
  oxblood-900: "#422628"
typography:
  display:
    fontFamily: "'Grand Slang B-Side', Georgia, serif"
    fontSize: "clamp(2.8rem, 11.5vw, 9.5rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Grand Slang Roman', Georgia, serif"
    fontSize: "clamp(1.9rem, 4vw, 3.2rem)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.014em"
  wordmark:
    fontFamily: "'Grand Slang Roman', Georgia, serif"
    fontSize: "clamp(2rem, 5.6vw, 7.5rem)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "-0.01em"
  accent:
    fontFamily: "'Grand Slang Italic', Georgia, serif"
    fontSize: "1em"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.01em"
    fontFeature: "italic"
  body:
    fontFamily: "'Hanken Grotesk', system-ui, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "'Hanken Grotesk', system-ui, Arial, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.22em"
rounded:
  seam: "28px"
  card: "24px"
  card-inner: "16px"
  photo: "2px"
  full: "9999px"
spacing:
  section-sm: "5rem"
  section-lg: "8rem"
  gutter: "1.5rem"
  gutter-lg: "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.cloud-dancer}"
    textColor: "{colors.bronze-green}"
    rounded: "{rounded.full}"
    padding: "10px 28px"
  button-primary-hover:
    backgroundColor: "{colors.copper}"
  status-capsule:
    backgroundColor: "{colors.bronze-green}"
    textColor: "{colors.cloud-dancer}"
    rounded: "{rounded.full}"
    padding: "4px 4px 4px 24px"
  card-held:
    backgroundColor: "{colors.bronze-green}"
    textColor: "{colors.cloud-dancer}"
    rounded: "{rounded.card}"
    padding: "24px 40px"
---

# Design System: 1464byW — Warmbachhof (Awwwards direction)

<!-- Scope note: documents redesign/awwwards specifically — its own homepage
recomposition (components/aw/*), pillar chrome, and shared UI (AgeGate,
Navigation, Cursor). This branch shares its color tokens with v2 and
redesign/v3-editorial (same tailwind.config.ts) but has fully replaced the
homepage and several shared components; it is not an extension of
v3-editorial's "dossier" system, which lives only on that other branch and
is not present here. Treat this file as the sole design authority for this
branch's working tree. -->

## Overview

**Creative North Star: "The Living Scroll"**

The homepage's own composition comment states the idea directly: the estate as one continuous sheet, banded light and dark, so no two neighboring chapters read the same. There are no page breaks here, only lifts — each band ends in a rounded top corner that rises over the one before it, like a loose page laid on top of the last. Photographs are not locked into the grid: the pillar index lets a photograph float free and trail the cursor, tilted, the moment a word is touched; the hero's lit distillery room is held full-bleed behind glass-blurred UI riding on top of it, and the bottle is photographed on its own warm ground. Numbers do the shouting the type otherwise refuses — giant poster-weight digits (chronicle years, the daily countdown, each pillar's name) punctuate an otherwise calm, sentence-case voice.

This is a warmer, softer reading of the same estate that `redesign/v3-editorial` renders as a square-cornered dossier: same tokens, same 562-year claim, same restraint about invented facts — but expressed here as something you unroll and touch, not something you file.

**Key Characteristics:**
- One continuous scroll in banded chapters, each lifting over the last on a rounded top seam — never a hard page break
- Photographs float free of the grid — cursor-trailing, tilted specimens, not locked frames
- Two depth vocabularies used for different jobs: frosted glass-blur for UI riding over held photography, soft directional shadow for genuinely floating objects
- Giant Grand Slang B-Side numerals and words do the visual shouting; the running statement voice stays calm and sentence-case in Grand Slang Roman, and Hanken Grotesk handles everything small
- Soft rounding everywhere a surface is touched or transitions (buttons, status chips, section seams, cards); the reading body of a pillar chapter stays flat and hairline-bordered, closer to the sibling branch's restraint
- The same "no invented values" discipline as the rest of the product — this branch's own internal documentation calls it the "Substanz-Sperre"

## Colors

The same ten-token Pantone-derived palette as the rest of the codebase (`tailwind.config.ts`), but with a different balance of use: terrakotta (Oxblood Red) is this branch's default numbered-chapter-marker color on light bands, not a rare third accent.

### Primary
- **Bronze Green** (`#1d291d`): the night register — hero film, artifact band, chronicle year-count band, AgeGate, closing threshold.
- **Bronze Green 800** (`#2b3b2b`): held-photograph overlays and dark glass-capsule fills (chapter-nav pills, sticky rail buttons).

### Secondary
- **Mocha Bisque** (`#8c5438`, Tailwind key `copper`): the warm accent on cream/kalk grounds — active tick marks on the chronicle rail, hover fills.
- **Copper** (`#c57e5b`, Tailwind key `gold`): the warm accent on Bronze Green — chapter-number labels, the AgeGate error line, the waitlist-status pulse dot. (Same naming caution as the sibling branch: resolve by hex, not by key name — `gold` is Pantone "Copper," `copper` is Pantone "Mocha Bisque.")

### Tertiary
- **Oxblood Red** (`#713940`, Tailwind key `terrakotta`): the standard chapter-number color on light (cream/kalk) bands — `( 01 )`, `( 02 )` markers, pillar-index captions, the "next pillar" tagline. Far more prominent here than the "rare accent" role it plays on `redesign/v3-editorial`.
- **Oxblood 900** (`#422628`, Tailwind key `merlot`): hover fill for the "Besuch anfragen" pill; otherwise held in reserve.

### Neutral
- **Cloud Dancer** (`#f0efeb`, Tailwind key `cream`): primary button fill, primary text on dark grounds, the pillar-index page color.
- **Cloud Dancer 400** (`#a8a59b`, Tailwind key `stone`): quiet meta text on dark surfaces (AgeGate footer line).
- **Cloud Dancer 500** (`#9b988e`, Tailwind key `hairline`): the hairline divider and underline-input border, always at reduced opacity.
- **Light Gray** (`#d9d7cf`, Tailwind key `kalk`): the chronicle rail's resting ground and the fallback stacked-chronicle background.

### Named Rules
**The Ledger Rule.** Only the ten tokens above exist anywhere in the system — carried unchanged from the sibling branch. No gradient appears except soft radial glows behind statement text (artifact band, closing threshold, AgeGate) and the directional shadow under floating photographs; both read as light, not decoration.

## Typography

**Display Font:** Grand Slang (self-hosted, `app/fonts.css`) in three distinct cuts — **B-Side** (giant numerals and pillar words), **Roman** (the WARMBACH wordmark, the footer's "by"), **Italic** (accent phrases). Each is registered under its own family name because B-Side is a genuinely different letterform, not a style variant of Roman.
**Body/UI Font:** Hanken Grotesk (`next/font/google`, `app/fonts.ts`) — body copy, labels, nav, buttons, spec registers.

**Two families, and only two.** Every header, statement, numeral and accent is a cut of Grand Slang; everything small and structural is Hanken Grotesk. Whyte, which previously carried the statement headlines, was retired and its `@font-face` rules removed.

**Character:** Three faces, three clearly separated jobs. Grand Slang does all the shouting and all the flourish: the ghosted `1464`, the five pillar words, the day-count figure, and — in its Italic cut — the single emphasised phrase that closes a headline (`— *Premiere Edition*`, `Kommen Sie an den *Tisch*`). Grand Slang Roman carries the calm statement sentences that sit under those flourishes — the same family, a quieter cut. Hanken Grotesk handles everything small and structural, and never appears large. A headline is never set in the body face, and the italic accent never carries a sentence on its own.

### Hierarchy
- **Display** (Grand Slang B-Side, 400, `clamp(2.8rem, 11.5vw, 9.5rem)`, line-height 0.92): giant structural words and numerals. The Säulen index sets its five words in caps; the numerals have no case to set — each pillar's name in the index, the "next pillar" doorway, the chronicle's background year, the countdown's day/hour/minute/second figures. Never a sentence, always a word or number.
- **Headline** (Grand Slang Roman, 400, `clamp(1.9rem, 4vw, 3.2rem)`–`clamp(2.6rem, 7.4vw, 6.5rem)` for the hero, sentence case, line-height 1.12, letter-spacing -0.014em): the calm narrative voice for every section's opening statement — almost always pairs one **Accent**-tier italic phrase inline.
- **Wordmark** (Grand Slang Roman, 400, `clamp(2rem, 5.6vw, 7.5rem)`): the WARMBACH lockup over the hero still, and the footer signature's lowercase "by". The Roman cut appears only in the wordmark — never in running text.
- **Accent** (Grand Slang Italic, 400, inherits surrounding size): the one emphasized phrase inside a Headline or a pillar tagline — never a standalone block, always riding inside a Headline-tier sentence.
- **Label** (600, 0.6rem–0.7rem, uppercase, letter-spacing 0.22em–0.24em): the numbered chapter marker (`( 01 ) Manifest`), spec-register keys (`ArtifactBand`'s `dl`), status-capsule and button microcopy.
- **Rail** (Hanken Grotesk, uppercase, letter-spacing 0.3em, 0.6rem, `writing-mode: vertical-rl`): coordinates and provenance notes pinned to the frame edge, rotated — a device unique to this branch, not present on the sibling.
- **Body** (500, ~0.9375rem, line-height 1.6, measure `max-w-xs`–`max-w-lg`): set at 60–80% opacity on its ground color, slightly heavier weight (500 vs. the sibling's 400) to hold up against the display tier's scale elsewhere on the same page.

### Named Rules
**The One Aside Rule.** The italic accent phrase appears at most once per sentence, inline, never as its own block — it punctuates a Grand Slang Roman sentence, it does not replace one.

## Layout

A 12-column grid inside a `max-w-[1500px]` container. The composition is a single unbroken vertical scroll: sections carry no top margin of their own, but a negative bottom margin (`-mb-8`) on the section *above* a rounded-top-corner section beneath it, so each band visibly overlaps the one before — the literal mechanism behind "lifting." Two distinct scroll-locked rail patterns recur: a **vertical sticky rail** (Manufaktur's left column stays fixed height-of-viewport while cards scroll past on the right) and a **horizontal pinned rail** (the Hofchronik section holds `height: 650svh` while its card track translates sideways, driven by a live `getBoundingClientRect` read rather than a cached scroll offset, because the deferred 3D canvas above it changes document height after mount). Both degrade to a plain stacked/linear layout under `lg` breakpoint or reduced motion.

## Elevation & Depth

Two distinct depth vocabularies, used for two distinct situations — never interchanged.

**Frosted glass, for UI riding over held photography.** Where a control sits on top of a full-bleed image or a sticky-held photograph (the hero's status capsule, the Manufaktur chapter-nav pills, the artifact band's spec register background), it gets `backdrop-blur` and a translucent fill — never a shadow. This reads as glass laid over the scene, not an object floating above it.

**Directional shadow, for objects genuinely floating free of the layout.** The one thing in this system that actually leaves the page's plane is the pillar-index's cursor-trailing photograph — it gets a real, soft, wide shadow (`shadow-[0_30px_80px_rgba(29,41,29,0.35)]`) because it is meant to read as a loose print lifted off the surface, tilted, following the pointer.

### Named Rules
**The Two-Depths Rule.** Blur means "this is glass on top of the scene." Shadow means "this has left the page entirely." A surface never gets both, and nothing gets a shadow just to look important.

## Shapes

Rounding is concentrated at two kinds of places: **every touchable/interactive surface** (buttons, status chips, chapter-nav pills — all `rounded-full`) and **every seam where one band lifts over another** (`rounded-t-[28px]` on a section, `rounded-[24px]`/`rounded-[16px]` on a card and its inner image). The reading body of a pillar chapter (`PillarChapter`, the numbered `( 0X )` content bands) stays flat with hairline borders, the same restraint as the sibling branch — rounding is a property of *transitions and touchpoints*, not of *content itself*. Photograph frames get only the barest softening (`rounded-sm`, nav dropdown image cards) or none at all (the pillar-index's floating specimen is a hard-edged rectangle, its softness coming entirely from the shadow and tilt, not the corner radius).

### Named Rules
**The Touchpoint Rule.** A corner is rounded only if it is something you would press, or a seam where the page itself folds. Everything else — running text, content dividers, the reading body — stays exactly as flat as the sibling branch's dossier system.

## Components

### Buttons
- **Primary:** `rounded-full`, solid Cloud Dancer fill, Bronze Green text, generous horizontal padding (`px-7 py-3.5` for standalone CTAs). Hover fills solid Copper.
- **Secondary/Ghost pill:** `rounded-full`, `bg-cream/10`, cream text, hover to `bg-cream/20` — a quieter twin of primary for a page's second door.
- **Icon-door button** (`ManifestBand`'s "Besuch anfragen"/"Journal lesen"): a pill with a solid circular icon-badge riding its left edge — the button and its icon are one continuous rounded shape, not an icon-plus-label pair.

### Status Capsule (signature component)
A `rounded-full` frosted chip combining a message and a solid door in one object — never a bare button. The hero's status bar (`bg-night/45 backdrop-blur-md`, a sentence plus the Club 1464 door) and the closing threshold's waitlist badge (a pulsing dot plus label) are both this pattern. It is this system's answer to a plain CTA button: never just a link, always a glass capsule that also states something true (an offer, a status) before the door.

### Cards / Held Bands
- **Corner style:** `rounded-[24px]`, inner imagery `rounded-[16px]` — the Manufaktur cards and their photographs.
- **Background:** Bronze Green at reduced opacity + `backdrop-blur-sm`, riding over a sticky-held photograph behind the whole section.
- **Reveal:** cards translate in from the right and fade the first time they cross into view (`IntersectionObserver`, threshold 0.15), then hold their resting state permanently — never re-animate on re-entry.

### Säulen Row
- **Type:** the pillar's name in Display tier, set in caps, with the chapter list beside it in Label tier Oxblood Red. Rows alternate alignment left / right / centre / left / right down the index.
- **Addressed state:** the hovered (or keyboard-focused) row holds full ink while the other four drop to `text-night/25`; the floating specimen appears under the pointer.
- **The door:** a 48px Bronze Green disc holding a chevron, pinned to the row's right edge. It rests at `opacity-0` and 12px to the left, then fades up and settles into place over 500ms on `ease-deep`. Pointer-width only (`lg:`) — it is a hover affordance, and touch taps the whole row. Keyboard focus triggers the same arrival, so the door is never mouse-only.

### Floating Specimen (signature component)
A cursor-trailing photograph (`PillarIndex`) — spring-eased position (`stiffness 190, damping 24`), a slight tilt that reverses direction on exit, a hard rectangular frame (no rounding), and the one genuine drop shadow in the system. Fine-pointer only; on touch and under `prefers-reduced-motion` it never mounts at all, and the five giant words stand alone, still fully legible without it.

### Inputs / Fields
- **Style:** No box at all — an underline-only field (`border-b border-hairline/30`) on a transparent background, large Garamond display digits, not a bordered rectangle. Used for AgeGate's three-part TT·MM·JJJJ date entry (auto-advancing focus per field) rather than a native date picker.
- **Focus:** Underline shifts to solid Copper.
- **Error:** An always-mounted `aria-live="polite"` line below the fields — the message announces itself to assistive tech without a manual `role="alert"`, a different but equally valid pattern from the sibling branch's approach.

### Navigation
- **Style:** Same solid Cloud Dancer fixed bar as the sibling branch, but its dropdown panel is richer: pillar links render as `rounded-sm` full-bleed photograph cards with a text overlay and a small circular arrow "bubble" that scales in on hover, rather than plain text rows.
- **States:** Hover/active resolve to Mocha Bisque on text links; photograph cards get a `scale(1.08)` image zoom plus a lightening overlay on hover instead of a color change.

### Chapter Marker
The `( 01 )`/`( 02 )` numbered label preceding every section's title — Label-tier type, Oxblood Red on light grounds, Copper on dark grounds. The through-line that ties all eight homepage chapters and every pillar-chapter band into one numbered sequence, regardless of how different their internal composition is.

## Do's and Don'ts

### Do:
- **Do** round a corner only where it is touched (a button, a chip, a card) or where the page itself folds (a section seam) — never on running content.
- **Do** use frosted glass-blur for any UI riding over held photography, and reserve real directional shadow for the one thing in the system that actually floats free of the layout (the cursor-trailing specimen).
- **Do** keep the italic Grand Slang accent to one phrase inside a Roman-cut sentence — never a standalone italic block.
- **Do** resolve every color by its hex value in `tailwind.config.ts`, not by its Tailwind key name.
- **Do** provide a full static fallback for every scroll-locked or cursor-driven effect (the pinned chronicle rail, the sticky Manufaktur rail, the floating specimen) — this branch's own component comments repeat the same performance/reduced-motion contract almost verbatim across every signature piece.

### Don't:
- **Don't** round the reading body of a pillar chapter or any structural content divider — that restraint carries over from the sibling branch on purpose.
- **Don't** give a surface both a shadow and a glass-blur treatment, or a shadow with no reason (see The Two-Depths Rule).
- **Don't** invent or estimate a factual value anywhere on the site — this branch's own `/prompt` documentation names this the "Substanz-Sperre": an unmeasured value renders as pending, never approximated.
- **Don't** treat this branch's system as an extension of `redesign/v3-editorial`'s DESIGN.md — they share tokens but are otherwise separate, independently authored visual worlds. Neither branch's DESIGN.md is visible to the other's working tree.
