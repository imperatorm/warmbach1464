# Founders Club Portal („Der Sitz") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the gated member portal behind the Founder's Circle — login, dashboard, release timeline, availability, requests (bottle + Gasthof + concierge), events, archive — as a high-fidelity prototype with representative data.

**Architecture:** A client-gated area under `/sitz`, mirroring the existing AgeGate pattern (`localStorage` + custom window event). All data lives behind one swap-ready seam (`lib/founders/data.ts`). Pure logic (`member.ts`, `release.ts`) is TDD'd with vitest (node env); UI is verified in the browser via the preview workflow, matching this repo's convention (all existing tests are pure-logic `lib/*.test.ts`).

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind, Framer Motion, vitest. Reuses existing design tokens (`night/soot/copper/gold/cream/stone/hairline`), type classes (`t-display/t-h1/t-h3/t-label`, `signage`), holo CSS (`holo-num/scanlines/holo-float/holo-ring`), and `components/ui/Reveal.tsx`.

> **Commits:** The repo is local git (no remote enforced). Commit steps are included per task. Confirm cadence with Marlon before the first commit — he may prefer batched commits. End commit messages with the Co-Authored-By trailer per repo convention.

> **Dev server / verification:** `npm run dev` (Next on :3000). Use `preview_start`, then `preview_eval` `window.location.href='http://localhost:3000/sitz'`, `preview_snapshot`, `preview_screenshot`, `preview_console_logs`. Tests: `npx vitest run <file>`.

> **Open content item (do NOT invent):** The maturation *duration* figure is deliberately omitted from the UI until the family finalizes it (spec §12). The release countdown anchors to the documented **Q4 2027** target only.

---

## File Structure

**New — pure logic + data (`lib/founders/`):**
- `types.ts` — all portal types (one source of truth).
- `data.ts` — representative seed (THE backend seam; everything reads from here).
- `member.ts` — member-id parsing/validation + access check (pure).
- `member.test.ts` — tests for the above.
- `release.ts` — pipeline status, days-until, current phase, progress (pure).
- `release.test.ts` — tests for the above.
- `session.ts` — localStorage session keys + read/write/clear.
- `useMember.ts` — client hook exposing the logged-in member (mirrors `useAgeConfirmed`).

**New — UI (`components/sitz/`):**
- `MemberGate.tsx` — login screen (464-seat wall) + gate logic.
- `SitzShell.tsx` — portal chrome: header + side navigation.
- `ReleaseTimeline.tsx` — the centerpiece (phase timeline + holo countdown).
- `AvailabilityLedger.tsx` — allocation ledger.
- `RequestForm.tsx` — generic concierge-confirmed request (bottle + Gasthof).
- `ConciergeThread.tsx` — the concierge message thread.
- `EventsList.tsx` — upcoming events with RSVP.
- `ArchivePlaque.tsx` — bronze plaque / identity.

**New — routes (`app/sitz/`):**
- `layout.tsx` — gate + shell wrapper (client).
- `page.tsx` — Der Sitz (overview).
- `weg/page.tsx` — Der Weg zum Release.
- `verfuegbarkeit/page.tsx` — Verfügbarkeit & Allokation.
- `anfragen/page.tsx` — Anfragen (3 tabs: Flasche / Gasthof / Concierge).
- `events/page.tsx` — Events.
- `archiv/page.tsx` — Hofarchiv.

**Modify (minimal):**
- `components/ui/Navigation.tsx` — hide chrome on `/sitz*`.
- `components/ui/Footer.tsx` — hide chrome on `/sitz*` + add "Mitglieder · Eintreten" link.
- `app/founders-circle/page.tsx` — add a discreet "Eintreten" link.

---

## Task 1: Types + data seam

**Files:**
- Create: `lib/founders/types.ts`
- Create: `lib/founders/data.ts`

Structural task (no behavior → no test). Locks the data contract every later task depends on.

- [ ] **Step 1: Create `lib/founders/types.ts`**

```typescript
// Portal-Typen — die einzige Quelle der Wahrheit für „Der Sitz".
export type Privilege = "P1" | "P2" | "P3" | "P4" | "P5" | "P6" | "P7";

export type Member = {
  id: string; // "1464.007"
  name: string;
  seatNo: number; // 1..464
  joinedYear: number;
  accessCode: string; // Demo-Code; später durch echtes Auth ersetzt
  privileges: Privilege[];
};

export type PhaseStatus = "done" | "current" | "upcoming";
export type Phase = {
  key: string;
  label: string;
  dateLabel: string; // menschlich, z. B. "Mai 2026" / "Q4 2027"
  status: PhaseStatus;
};

export type ReleasePipeline = {
  phases: Phase[];
  fillStartISO: string; // "2026-05-01"
  targetReleaseISO: string; // repräsentativ, Q4 2027
  targetReleaseLabel: string; // "Q4 2027 (geplant)"
};

export type AvailabilityStatus = "reserviert" | "freigegeben" | "zugeteilt";
export type AvailabilityItem = {
  edition: string;
  total: number | null; // null = keine feste Auflage
  reservedForYou: number;
  status: AvailabilityStatus;
  note: string;
  firstAccessWindowDays: number; // P1 = 14
};

export type EventRsvp = "offen" | "angefragt";
export type EventItem = {
  title: string;
  dateLabel: string; // keine erfundenen exakten Daten
  time: string; // "15:04"
  location: string;
  kind: string;
  capacityNote: string;
  rsvp: EventRsvp;
};

export type RequestKind = "flasche" | "gasthof";
export type RequestStatus = "entwurf" | "angefragt" | "bestaetigt";
export type MemberRequest = {
  kind: RequestKind;
  subject: string;
  dateLabel?: string;
  status: RequestStatus;
};

export type ConciergeMessage = {
  from: "member" | "concierge";
  text: string;
  dateLabel: string;
};

export type GasthofState = { year: number; used: boolean };

export type FoundersData = {
  member: Member;
  pipeline: ReleasePipeline;
  availability: AvailabilityItem[];
  events: EventItem[];
  requests: MemberRequest[];
  concierge: ConciergeMessage[];
  gasthof: GasthofState;
};
```

- [ ] **Step 2: Create `lib/founders/data.ts`**

```typescript
// REPRÄSENTATIVER PROTOTYP-SEED — die einzige Austausch-Stelle ("Backend-Naht").
// Später ersetzt ein echtes Backend diese Datei; das UI bleibt unverändert.
// Datumsanker stammen aus lib/content.ts → heritageChronicle. Nichts erfunden:
// die Reifedauer-ZAHL ist bewusst NICHT enthalten (noch von der Familie festzulegen).
import type { FoundersData } from "./types";

export const foundersData: FoundersData = {
  member: {
    id: "1464.007",
    name: "M. Berger", // fiktiver Demo-Sitz
    seatNo: 7,
    joinedYear: 2026,
    accessCode: "1464",
    privileges: ["P1", "P2", "P3", "P4", "P5", "P6", "P7"],
  },
  pipeline: {
    phases: [
      { key: "ernte", label: "Ernte & Auslese", dateLabel: "Herbst 2025", status: "done" },
      { key: "maische", label: "Maische & Gärung", dateLabel: "Winter 2025/26", status: "done" },
      { key: "brand", label: "Brand · Brennblase Kothe", dateLabel: "Mai 2026", status: "done" },
      { key: "reifung", label: "Reifung im Glasballon", dateLabel: "seit Mai 2026", status: "current" },
      { key: "abfuellung", label: "Abfüllung & Versiegelung", dateLabel: "geplant 2027", status: "upcoming" },
      { key: "allokation", label: "Allokation an den Sitz", dateLabel: "Q4 2027", status: "upcoming" },
    ],
    fillStartISO: "2026-05-01",
    targetReleaseISO: "2027-10-01",
    targetReleaseLabel: "Q4 2027 (geplant)",
  },
  availability: [
    {
      edition: "Founder's Reserve N°1",
      total: 464,
      reservedForYou: 1,
      status: "reserviert",
      note: "Eins zu eins mit den 464 Sitzen. Deine Flasche ist deinem Sitz zugeordnet.",
      firstAccessWindowDays: 14,
    },
    {
      edition: "Apfel Brand",
      total: null,
      reservedForYou: 0,
      status: "freigegeben",
      note: "Nummeriert, mit Echtheitszertifikat. Anfrage über Gastronomie oder 1464byW.com.",
      firstAccessWindowDays: 14,
    },
    {
      edition: "Kommende Edition",
      total: null,
      reservedForYou: 0,
      status: "freigegeben",
      note: "Vorzugsfenster: 14 Tage vor öffentlichem Verkauf (P1).",
      firstAccessWindowDays: 14,
    },
  ],
  events: [
    { title: "Hof-Tasting", dateLabel: "Herbst 2026", time: "15:04", location: "Warmbachhof, Reith", kind: "Tasting", capacityNote: "Plätze limitiert", rsvp: "offen" },
    { title: "Erntetag im Apfelgarten", dateLabel: "Oktober 2026", time: "10:00", location: "Osthang, Warmbachhof", kind: "Ernte", capacityNote: "Mitglied & Begleitung", rsvp: "offen" },
    { title: "Abfüll-Zeremonie N°1", dateLabel: "Q4 2027 (geplant)", time: "15:04", location: "Brennraum", kind: "Zeremonie", capacityNote: "Founder's-Reserve-Inhaber", rsvp: "offen" },
    { title: "Sitzkreis-Versammlung", dateLabel: "Frühjahr 2027", time: "15:04", location: "Warmbach Lounge", kind: "Versammlung", capacityNote: "Alle 464 Sitze geladen", rsvp: "angefragt" },
  ],
  requests: [
    { kind: "flasche", subject: "Patron-Cask — Vorrechtsangebot", status: "angefragt" },
  ],
  concierge: [
    { from: "concierge", text: "Willkommen am Hof, Sitz N°007. Ihr Concierge-Draht ist offen — wir antworten binnen 48 Stunden, persönlich.", dateLabel: "Mai 2026" },
    { from: "member", text: "Danke. Ich melde mich zur Founder's Reserve.", dateLabel: "Mai 2026" },
  ],
  gasthof: { year: 2026, used: false },
};
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/founders/types.ts lib/founders/data.ts
git commit -m "feat(sitz): portal types + representative data seam

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Member identity logic (TDD)

**Files:**
- Create: `lib/founders/member.ts`
- Test: `lib/founders/member.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect } from "vitest";
import { parseSeatNo, isValidMemberId, checkAccess } from "./member";
import type { Member } from "./types";

const M: Member = {
  id: "1464.007",
  name: "Demo",
  seatNo: 7,
  joinedYear: 2026,
  accessCode: "1464",
  privileges: ["P1"],
};

describe("parseSeatNo", () => {
  it("parses a valid id to its seat number", () => {
    expect(parseSeatNo("1464.007")).toBe(7);
    expect(parseSeatNo("1464.464")).toBe(464);
  });
  it("trims surrounding whitespace", () => {
    expect(parseSeatNo("  1464.007 ")).toBe(7);
  });
  it("rejects out-of-range seats", () => {
    expect(parseSeatNo("1464.000")).toBeNull();
    expect(parseSeatNo("1464.465")).toBeNull();
  });
  it("rejects malformed ids", () => {
    expect(parseSeatNo("1464.7")).toBeNull(); // needs 3 digits
    expect(parseSeatNo("1463.007")).toBeNull();
    expect(parseSeatNo("foo")).toBeNull();
    expect(parseSeatNo("")).toBeNull();
  });
});

describe("isValidMemberId", () => {
  it("is true for valid, false otherwise", () => {
    expect(isValidMemberId("1464.001")).toBe(true);
    expect(isValidMemberId("1464.999")).toBe(false);
  });
});

describe("checkAccess", () => {
  it("admits the matching id + code", () => {
    expect(checkAccess("1464.007", "1464", M)).toBe(true);
    expect(checkAccess(" 1464.007 ", " 1464 ", M)).toBe(true);
  });
  it("rejects a wrong code", () => {
    expect(checkAccess("1464.007", "0000", M)).toBe(false);
  });
  it("rejects a non-member id", () => {
    expect(checkAccess("1464.008", "1464", M)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/founders/member.test.ts`
Expected: FAIL — `parseSeatNo` is not defined.

- [ ] **Step 3: Write minimal implementation**

```typescript
// Mitglieds-Identität — rein & testbar (Vorbild lib/age.ts).
import type { Member } from "./types";

const MEMBER_RE = /^1464\.(\d{3})$/;

/** Seat number 1..464 for a valid id, else null. */
export function parseSeatNo(id: string): number | null {
  const m = MEMBER_RE.exec(id.trim());
  if (!m) return null;
  const n = Number(m[1]);
  if (n < 1 || n > 464) return null;
  return n;
}

export function isValidMemberId(id: string): boolean {
  return parseSeatNo(id) !== null;
}

/** Prototype access check against the seeded member. */
export function checkAccess(id: string, code: string, member: Member): boolean {
  return id.trim() === member.id && code.trim() === member.accessCode;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/founders/member.test.ts`
Expected: PASS (all green).

- [ ] **Step 5: Commit**

```bash
git add lib/founders/member.ts lib/founders/member.test.ts
git commit -m "feat(sitz): member id parsing + access check (TDD)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Release pipeline logic (TDD)

**Files:**
- Create: `lib/founders/release.ts`
- Test: `lib/founders/release.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect } from "vitest";
import { daysUntil, currentPhase, phaseProgress } from "./release";
import type { Phase } from "./types";

// Fixed UTC reference → timezone-stable.
const NOW = new Date(Date.UTC(2026, 5, 10, 12, 0, 0)); // 2026-06-10

describe("daysUntil", () => {
  it("is 0 on the same calendar day", () => {
    expect(daysUntil("2026-06-10", NOW)).toBe(0);
  });
  it("counts whole days ahead", () => {
    expect(daysUntil("2026-06-11", NOW)).toBe(1);
    expect(daysUntil("2026-06-20", NOW)).toBe(10);
  });
  it("never goes negative for past dates", () => {
    expect(daysUntil("2026-06-09", NOW)).toBe(0);
  });
  it("returns 0 for malformed input", () => {
    expect(daysUntil("nope", NOW)).toBe(0);
  });
});

const phases: Phase[] = [
  { key: "a", label: "A", dateLabel: "", status: "done" },
  { key: "b", label: "B", dateLabel: "", status: "current" },
  { key: "c", label: "C", dateLabel: "", status: "upcoming" },
];

describe("currentPhase", () => {
  it("returns the phase marked current", () => {
    expect(currentPhase(phases)?.key).toBe("b");
  });
  it("falls back to the last phase when none is current", () => {
    const done: Phase[] = phases.map((p) => ({ ...p, status: "done" }));
    expect(currentPhase(done)?.key).toBe("c");
  });
  it("returns undefined for an empty list", () => {
    expect(currentPhase([])).toBeUndefined();
  });
});

describe("phaseProgress", () => {
  it("counts done as 1 and current as 0.5", () => {
    expect(phaseProgress(phases)).toBeCloseTo((1 + 0.5) / 3);
  });
  it("is 1 when all done", () => {
    expect(phaseProgress(phases.map((p) => ({ ...p, status: "done" })))).toBe(1);
  });
  it("is 0 for an empty list", () => {
    expect(phaseProgress([])).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/founders/release.test.ts`
Expected: FAIL — `daysUntil` is not defined.

- [ ] **Step 3: Write minimal implementation**

```typescript
// Release-Pipeline — rein & testbar. daysUntil ist UTC-stabil (vgl. lib/age.ts).
import type { Phase } from "./types";

/** Whole calendar days from `now` until an ISO date (YYYY-MM-DD), floored at 0. */
export function daysUntil(targetISO: string, now: Date = new Date()): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(targetISO.trim());
  if (!m) return 0;
  const target = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.max(0, Math.round((target - today) / 86_400_000));
}

/** The phase marked "current"; otherwise the last phase; undefined if empty. */
export function currentPhase(phases: Phase[]): Phase | undefined {
  return phases.find((p) => p.status === "current") ?? phases[phases.length - 1];
}

/** Fraction 0..1: each done phase counts 1, a current phase counts 0.5. */
export function phaseProgress(phases: Phase[]): number {
  if (phases.length === 0) return 0;
  const done = phases.filter((p) => p.status === "done").length;
  const cur = phases.some((p) => p.status === "current") ? 0.5 : 0;
  return Math.min(1, (done + cur) / phases.length);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/founders/release.test.ts`
Expected: PASS (all green).

- [ ] **Step 5: Commit**

```bash
git add lib/founders/release.ts lib/founders/release.test.ts
git commit -m "feat(sitz): release pipeline math (TDD)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Session + member hook

**Files:**
- Create: `lib/founders/session.ts`
- Create: `lib/founders/useMember.ts`

Mirrors `lib/useAgeConfirmed.ts` (localStorage + custom event). Verified in the browser (Task 5); not unit-tested (node env has no localStorage).

- [ ] **Step 1: Create `lib/founders/session.ts`**

```typescript
// Sitz-Session — rein client-seitig (Prototyp). Spiegelt das Age-Gate-Muster.
export const SITZ_STORAGE_KEY = "1464byw.sitz.member";
export const SITZ_CHANGED_EVENT = "1464byw:sitz-changed";

export function readSession(): string | null {
  try {
    return localStorage.getItem(SITZ_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function writeSession(id: string): void {
  try {
    localStorage.setItem(SITZ_STORAGE_KEY, id);
  } catch {
    /* private mode — session bleibt nur für diese Sitzung im State */
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(SITZ_CHANGED_EVENT));
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SITZ_STORAGE_KEY);
  } catch {}
  if (typeof window !== "undefined") window.dispatchEvent(new Event(SITZ_CHANGED_EVENT));
}
```

- [ ] **Step 2: Create `lib/founders/useMember.ts`**

```typescript
"use client";

import { useEffect, useState } from "react";
import { SITZ_STORAGE_KEY, SITZ_CHANGED_EVENT } from "./session";
import { foundersData } from "./data";
import type { Member } from "./types";

/**
 * Resolves the logged-in member from the localStorage session, live-updating
 * when session changes (mirrors useAgeConfirmed). Prototype: matches the single
 * seeded member by id. Returns { ready } so callers can avoid a gate flash.
 */
export function useMember(): { member: Member | null; ready: boolean } {
  const [id, setId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        setId(localStorage.getItem(SITZ_STORAGE_KEY));
      } catch {
        setId(null);
      }
      setReady(true);
    };
    read();
    window.addEventListener(SITZ_CHANGED_EVENT, read);
    return () => window.removeEventListener(SITZ_CHANGED_EVENT, read);
  }, []);

  const member = id && id === foundersData.member.id ? foundersData.member : null;
  return { member, ready };
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/founders/session.ts lib/founders/useMember.ts
git commit -m "feat(sitz): client session + useMember hook

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: MemberGate (login wall) + gated layout

**Files:**
- Create: `components/sitz/MemberGate.tsx`
- Create: `components/sitz/SitzShell.tsx`
- Create: `app/sitz/layout.tsx`
- Create: `app/sitz/page.tsx` (temporary placeholder; replaced in Task 7)

This produces the first runnable, verifiable slice: visiting `/sitz` shows the login wall; correct credentials reveal a placeholder portal.

- [ ] **Step 1: Create `components/sitz/MemberGate.tsx`**

```tsx
"use client";

import { useState } from "react";
import { parseSeatNo, checkAccess } from "@/lib/founders/member";
import { writeSession } from "@/lib/founders/session";
import { foundersData } from "@/lib/founders/data";

const SEATS = Array.from({ length: 464 }, (_, i) => i + 1);

export function MemberGate() {
  const [id, setId] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const seatNo = parseSeatNo(id); // highlights the seat live, null if invalid

  function takeSeat(e: React.FormEvent) {
    e.preventDefault();
    if (checkAccess(id, code, foundersData.member)) {
      writeSession(foundersData.member.id);
      return;
    }
    setError(seatNo === null ? "Diese Sitznummer kennen wir nicht." : "Der Code stimmt nicht.");
  }

  return (
    <div className="min-h-screen bg-night px-6 py-24 flex items-center justify-center">
      <div className="w-full max-w-5xl grid gap-14 lg:grid-cols-2 lg:items-center">
        {/* The wall of 464 seats */}
        <div aria-hidden className="order-2 lg:order-1">
          <div
            className="grid gap-[3px]"
            style={{ gridTemplateColumns: "repeat(29, minmax(0, 1fr))" }}
          >
            {SEATS.map((n) => (
              <span
                key={n}
                className={`aspect-square rounded-full transition-colors duration-300 ${
                  n === seatNo ? "bg-gold shadow-[0_0_10px_2px_rgba(192,145,106,0.7)]" : "bg-hairline/15"
                }`}
              />
            ))}
          </div>
          <p className="t-label mt-6 text-stone">1 × 464 · Der Sitzkreis</p>
        </div>

        {/* Entry form */}
        <form onSubmit={takeSeat} className="order-1 lg:order-2 max-w-sm">
          <p className="t-label mb-6">Founder&rsquo;s Circle</p>
          <h1 className="t-h1 text-cream mb-3">Nehmen Sie Platz.</h1>
          <p className="t-lead mb-10 text-cream/75">
            Eintritt über Ihre Mitgliedsnummer und Ihr Wachssiegel.
          </p>

          <label className="t-label text-stone">Mitgliedsnummer</label>
          <input
            value={id}
            onChange={(e) => { setId(e.target.value); setError(""); }}
            placeholder="1464.007"
            autoComplete="off"
            data-cursor
            className="mt-2 mb-6 w-full border border-hairline/30 bg-soot/40 px-5 py-4 tracking-[0.2em] text-cream placeholder:text-stone/40 focus:border-gold focus:outline-none"
          />

          <label className="t-label text-stone">Wachssiegel-Code</label>
          <input
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(""); }}
            type="password"
            inputMode="numeric"
            placeholder="••••"
            data-cursor
            className="mt-2 w-full border border-hairline/30 bg-soot/40 px-5 py-4 tracking-[0.4em] text-cream placeholder:text-stone/40 focus:border-gold focus:outline-none"
          />

          {error && <p role="alert" className="mt-4 text-xs uppercase tracking-[0.15em] text-gold">{error}</p>}

          <button type="submit" data-cursor className="btn-primary mt-8 w-full justify-center">
            Platz einnehmen →
          </button>

          <p className="mt-8 text-xs leading-relaxed text-stone/70">
            Demo-Zugang: <span className="text-cream/80">1464.007</span> · Code <span className="text-cream/80">1464</span>
          </p>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `components/sitz/SitzShell.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clearSession } from "@/lib/founders/session";
import type { Member } from "@/lib/founders/types";

const SECTIONS = [
  { href: "/sitz", label: "Der Sitz" },
  { href: "/sitz/weg", label: "Der Weg zum Release" },
  { href: "/sitz/verfuegbarkeit", label: "Verfügbarkeit" },
  { href: "/sitz/anfragen", label: "Anfragen" },
  { href: "/sitz/events", label: "Events" },
  { href: "/sitz/archiv", label: "Hofarchiv" },
];

export function SitzShell({ member, children }: { member: Member; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/sitz" ? pathname === "/sitz" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-night lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-hairline/10 lg:border-b-0 lg:border-r lg:min-h-screen px-6 py-8 lg:px-8 lg:py-12">
        <Link href="/" data-cursor className="font-display text-2xl text-cream [font-variation-settings:'opsz'_48]">
          1464
        </Link>
        <p className="t-label mt-2 text-stone">Sitz N°{String(member.seatNo).padStart(3, "0")}</p>

        <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-3 lg:flex-col lg:gap-y-4">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              data-cursor
              className={`link-underline text-xs uppercase tracking-[0.16em] transition-colors ${
                isActive(s.href) ? "text-gold" : "text-cream/70 hover:text-cream"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={clearSession}
          data-cursor
          className="mt-10 text-xs uppercase tracking-[0.16em] text-stone hover:text-gold"
        >
          Sitz verlassen
        </button>
      </aside>

      <div className="min-w-0 px-6 py-12 lg:px-14 lg:py-16">{children}</div>
    </div>
  );
}
```

- [ ] **Step 3: Create `app/sitz/layout.tsx`**

```tsx
"use client";

import { useMember } from "@/lib/founders/useMember";
import { MemberGate } from "@/components/sitz/MemberGate";
import { SitzShell } from "@/components/sitz/SitzShell";

export default function SitzLayout({ children }: { children: React.ReactNode }) {
  const { member, ready } = useMember();

  if (!ready) return <div className="min-h-screen bg-night" />; // avoid gate flash pre-hydration
  if (!member) return <MemberGate />;

  return <SitzShell member={member}>{children}</SitzShell>;
}
```

- [ ] **Step 4: Create temporary `app/sitz/page.tsx`**

```tsx
export default function SitzOverviewPage() {
  return <p className="t-lead text-cream">Portal — Übersicht folgt (Task 7).</p>;
}
```

- [ ] **Step 5: Verify in the browser**

Run: `preview_start` (if not running), then `preview_eval` → `window.location.href='http://localhost:3000/sitz'`.
- `preview_console_logs` → expect no errors.
- `preview_snapshot` → expect the login wall ("Nehmen Sie Platz.", the seat grid, two inputs).
- `preview_fill` the Mitgliedsnummer with `1464.007` → `preview_snapshot` → the seat grid shows one gold seat.
- `preview_fill` the code with `1464`, `preview_click` "Platz einnehmen" → `preview_snapshot` → expect the placeholder portal + side nav ("Der Sitz", "Der Weg zum Release", …).
- `preview_screenshot` → save proof of the login wall.

- [ ] **Step 6: Commit**

```bash
git add components/sitz/MemberGate.tsx components/sitz/SitzShell.tsx app/sitz/layout.tsx app/sitz/page.tsx
git commit -m "feat(sitz): login wall + gated portal shell

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Hide public chrome on /sitz

**Files:**
- Modify: `components/ui/Navigation.tsx` (the guard line)
- Modify: `components/ui/Footer.tsx` (the guard line)

The portal has its own chrome (`SitzShell`); the public Navigation/Footer must not render on `/sitz*`.

- [ ] **Step 1: Update the Navigation guard**

In `components/ui/Navigation.tsx`, replace:

```tsx
  if (pathname === "/enter") return null; // gate page has no chrome
```

with:

```tsx
  if (pathname === "/enter" || pathname.startsWith("/sitz")) return null; // gate + portal have own chrome
```

- [ ] **Step 2: Update the Footer guard**

In `components/ui/Footer.tsx`, replace:

```tsx
  if (pathname === "/enter") return null; // gate page has no chrome
```

with:

```tsx
  if (pathname === "/enter" || pathname.startsWith("/sitz")) return null; // gate + portal have own chrome
```

- [ ] **Step 3: Verify in the browser**

`preview_eval` → `window.location.href='http://localhost:3000/sitz'`.
- `preview_snapshot` → the public top nav ("Manufaktur/Chronik/…") and public footer are GONE; only the portal/login chrome shows.
- `preview_eval` → `window.location.href='http://localhost:3000/'` → `preview_snapshot` → public nav + footer are BACK on the home page.

- [ ] **Step 4: Commit**

```bash
git add components/ui/Navigation.tsx components/ui/Footer.tsx
git commit -m "feat(sitz): suppress public chrome inside the portal

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: Der Sitz — overview page

**Files:**
- Modify: `app/sitz/page.tsx` (replace the placeholder)

Curated overview: greeting by member number, a compact release status, and the 2–3 things that need attention now.

- [ ] **Step 1: Replace `app/sitz/page.tsx`**

```tsx
import Link from "next/link";
import { foundersData } from "@/lib/founders/data";
import { currentPhase, daysUntil } from "@/lib/founders/release";
import { Reveal } from "@/components/ui/Reveal";
import { formatInt } from "@/lib/time";

export default function SitzOverviewPage() {
  const { member, pipeline, availability, gasthof } = foundersData;
  const phase = currentPhase(pipeline.phases);
  const days = daysUntil(pipeline.targetReleaseISO);
  const reserved = availability.find((a) => a.reservedForYou > 0);

  const cards = [
    {
      label: "Aktuelle Phase",
      value: phase?.label ?? "—",
      note: phase?.dateLabel ?? "",
      href: "/sitz/weg",
    },
    {
      label: "Bis Release",
      value: `${formatInt(days)} Tage`,
      note: pipeline.targetReleaseLabel,
      href: "/sitz/weg",
    },
    {
      label: "Für deinen Sitz reserviert",
      value: reserved ? `${reserved.reservedForYou} × ${reserved.edition}` : "—",
      note: reserved?.status ?? "",
      href: "/sitz/verfuegbarkeit",
    },
    {
      label: "Gästehaus Reith",
      value: gasthof.used ? "dieses Jahr genutzt" : "Nacht verfügbar",
      note: `Saison ${gasthof.year}`,
      href: "/sitz/anfragen",
    },
  ];

  return (
    <div>
      <Reveal>
        <p className="t-label">Sitz N°{String(member.seatNo).padStart(3, "0")} · seit {member.joinedYear}</p>
        <h1 className="t-display text-cream mt-4">Willkommen zurück.</h1>
        <p className="t-lead mt-6 max-w-xl">
          Ihr Platz im Kreis der 464. Hier sehen Sie, wo der Brand steht — und was gerade ansteht.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-px overflow-hidden border border-hairline/15 bg-hairline/10 sm:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.06}>
            <Link href={c.href} data-cursor className="block bg-night p-8 transition-colors hover:bg-soot/40">
              <p className="t-label text-stone">{c.label}</p>
              <p className="mt-4 font-display text-2xl text-cream">{c.value}</p>
              {c.note && <p className="mt-2 text-sm text-cream/60">{c.note}</p>}
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify in the browser**

Log in (Task 5 flow), land on `/sitz`.
- `preview_snapshot` → greeting "Sitz N°007 · seit 2026", four cards (Aktuelle Phase = "Reifung im Glasballon", Bis Release = a day count + "Q4 2027 (geplant)", reserved Founder's Reserve, Gästehaus "Nacht verfügbar").
- `preview_console_logs` → no errors.
- `preview_click` the "Aktuelle Phase" card → URL becomes `/sitz/weg` (404/empty until Task 8 — that's expected here).
- `preview_screenshot` → proof.

- [ ] **Step 3: Commit**

```bash
git add app/sitz/page.tsx
git commit -m "feat(sitz): overview dashboard

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 8: Der Weg zum Release — the centerpiece

**Files:**
- Create: `components/sitz/ReleaseTimeline.tsx`
- Create: `app/sitz/weg/page.tsx`

Phase timeline + holo countdown (reusing `holo-num`/`scanlines`/`holo-float` + a conic ring, the visual language of `Chronometer.tsx`). NO maturation-duration figure (spec §12).

- [ ] **Step 1: Create `components/sitz/ReleaseTimeline.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { daysUntil, phaseProgress } from "@/lib/founders/release";
import { formatInt } from "@/lib/time";
import type { ReleasePipeline } from "@/lib/founders/types";

const ARC =
  "conic-gradient(from 0deg, transparent 0deg, rgba(192,145,106,0.5) 40deg, transparent 95deg, transparent 200deg, rgba(192,145,106,0.22) 235deg, transparent 280deg)";

export function ReleaseTimeline({ pipeline }: { pipeline: ReleasePipeline }) {
  const reduce = useReducedMotion();
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(daysUntil(pipeline.targetReleaseISO)); // client-side: today-accurate
  }, [pipeline.targetReleaseISO]);

  const progress = phaseProgress(pipeline.phases);

  return (
    <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      {/* Phase timeline */}
      <ol className="relative border-l border-hairline/20 pl-8">
        {pipeline.phases.map((p) => (
          <li key={p.key} className="relative pb-10 last:pb-0">
            <span
              className={`absolute -left-[33px] top-1 h-3 w-3 rounded-full border ${
                p.status === "done"
                  ? "border-gold bg-gold"
                  : p.status === "current"
                  ? "border-gold bg-night shadow-[0_0_10px_2px_rgba(192,145,106,0.6)]"
                  : "border-hairline/40 bg-night"
              }`}
            />
            <p className={`t-label ${p.status === "current" ? "text-gold" : "text-stone"}`}>{p.dateLabel}</p>
            <h3 className={`t-h3 mt-1 ${p.status === "upcoming" ? "text-cream/55" : "text-cream"}`}>{p.label}</h3>
            {p.status === "current" && <p className="mt-1 text-sm text-cream/60">Aktuelle Phase</p>}
          </li>
        ))}
      </ol>

      {/* Holo countdown panel */}
      <div className="relative flex min-h-[20rem] flex-col items-center justify-center overflow-hidden rounded-[2px] border border-hairline/15 bg-soot/30 px-6 py-14 backdrop-blur-sm">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,_rgba(192,145,106,0.12),_transparent_62%)]" />
        <div
          aria-hidden
          className={`pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full ${reduce ? "" : "holo-ring"}`}
          style={{
            background: ARC,
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
          }}
        />
        <div className={`relative flex flex-col items-center ${reduce ? "" : "holo-float"}`}>
          <div className="scanlines px-2 text-center">
            <span className="holo-num font-display text-6xl tabular-nums">
              {days === null ? "—" : formatInt(days)}
            </span>
          </div>
          <p className="t-label mt-7">Tage bis Release</p>
          <p className="mt-2 max-w-[15rem] text-center text-[0.78rem] leading-relaxed text-stone">
            {pipeline.targetReleaseLabel} · Founder&rsquo;s Reserve N°1
          </p>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </div>

      {/* Progress hairline */}
      <div className="lg:col-span-2">
        <div className="h-px w-full bg-hairline/15">
          <div className="h-px bg-gold transition-all" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/sitz/weg/page.tsx`**

```tsx
import { foundersData } from "@/lib/founders/data";
import { ReleaseTimeline } from "@/components/sitz/ReleaseTimeline";
import { Reveal } from "@/components/ui/Reveal";

export default function WegPage() {
  return (
    <div>
      <Reveal>
        <p className="t-label">Der Weg zum Release</p>
        <h1 className="t-h1 text-cream mt-3">Vom Apfel zum Sitz.</h1>
        <p className="t-lead mt-5 max-w-xl">
          Wo der Brand gerade steht — und wie lange bis zur Allokation an Ihren Sitz.
        </p>
      </Reveal>
      <div className="mt-14">
        <ReleaseTimeline pipeline={foundersData.pipeline} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify in the browser**

Navigate to `/sitz/weg`.
- `preview_snapshot` → six phases (Reifung marked "Aktuelle Phase"), the holo number = a day count, "Tage bis Release", "Q4 2027 (geplant)". Confirm NO maturation-duration figure appears.
- `preview_console_logs` → no errors.
- `preview_resize` to mobile width → `preview_snapshot` → timeline stacks above the panel, still readable.
- `preview_screenshot` → proof (this is the showpiece).

- [ ] **Step 4: Commit**

```bash
git add components/sitz/ReleaseTimeline.tsx app/sitz/weg/page.tsx
git commit -m "feat(sitz): release timeline + holo countdown

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 9: Verfügbarkeit & Allokation

**Files:**
- Create: `components/sitz/AvailabilityLedger.tsx`
- Create: `app/sitz/verfuegbarkeit/page.tsx`

- [ ] **Step 1: Create `components/sitz/AvailabilityLedger.tsx`**

```tsx
import { formatInt } from "@/lib/time";
import type { AvailabilityItem } from "@/lib/founders/types";

export function AvailabilityLedger({ items }: { items: AvailabilityItem[] }) {
  return (
    <div className="grid gap-px overflow-hidden border border-hairline/15 bg-hairline/10">
      {items.map((it) => (
        <div key={it.edition} className="bg-night p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="t-h3 text-cream">{it.edition}</h3>
            <span className="t-label text-gold">{it.status}</span>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream/70">{it.note}</p>
          <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-2 text-sm">
            <div>
              <dt className="t-label text-stone">Auflage</dt>
              <dd className="mt-1 text-cream tabular-nums">{it.total === null ? "—" : formatInt(it.total)}</dd>
            </div>
            <div>
              <dt className="t-label text-stone">Für deinen Sitz</dt>
              <dd className="mt-1 text-cream tabular-nums">{it.reservedForYou}</dd>
            </div>
            <div>
              <dt className="t-label text-stone">Vorzugsfenster</dt>
              <dd className="mt-1 text-cream tabular-nums">{it.firstAccessWindowDays} Tage</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create `app/sitz/verfuegbarkeit/page.tsx`**

```tsx
import { foundersData } from "@/lib/founders/data";
import { AvailabilityLedger } from "@/components/sitz/AvailabilityLedger";
import { Reveal } from "@/components/ui/Reveal";

export default function VerfuegbarkeitPage() {
  return (
    <div>
      <Reveal>
        <p className="t-label">Verfügbarkeit & Allokation</p>
        <h1 className="t-h1 text-cream mt-3">Was für Sie reserviert ist.</h1>
        <p className="t-lead mt-5 max-w-xl">
          Sitz vor Markt. Ihre Allokation erscheint 14 Tage vor jedem öffentlichen Verkauf (P1).
        </p>
      </Reveal>
      <div className="mt-14">
        <AvailabilityLedger items={foundersData.availability} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify in the browser**

Navigate to `/sitz/verfuegbarkeit`.
- `preview_snapshot` → three items; Founder's Reserve N°1 shows Auflage 464 / Für deinen Sitz 1 / status "reserviert".
- `preview_console_logs` → no errors.
- `preview_screenshot` → proof.

- [ ] **Step 4: Commit**

```bash
git add components/sitz/AvailabilityLedger.tsx app/sitz/verfuegbarkeit/page.tsx
git commit -m "feat(sitz): availability ledger

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 10: Anfragen — Flasche / Gasthof / Concierge (tabs)

**Files:**
- Create: `components/sitz/RequestForm.tsx`
- Create: `components/sitz/ConciergeThread.tsx`
- Create: `app/sitz/anfragen/page.tsx`

Three concierge-confirmed flows. `RequestForm` is shared by Flasche + Gasthof; Concierge is the third tab (a thread). Prototype submissions are optimistic local state, clearly representative.

- [ ] **Step 1: Create `components/sitz/RequestForm.tsx`**

```tsx
"use client";

import { useState } from "react";

type Props = {
  /** Heading + intent shown above the form. */
  title: string;
  intro: string;
  /** Label for the free-text field. */
  fieldLabel: string;
  placeholder: string;
  /** If true, show an optional date field (used by Gasthof). */
  withDate?: boolean;
  /** Disable submission with this note (e.g. Gasthof night already used). */
  disabledNote?: string;
};

export function RequestForm({ title, intro, fieldLabel, placeholder, withDate, disabledNote }: Props) {
  const [sent, setSent] = useState(false);
  const [text, setText] = useState("");

  if (disabledNote) {
    return (
      <div className="border border-hairline/15 bg-soot/20 p-8">
        <h3 className="t-h3 text-cream">{title}</h3>
        <p className="mt-3 text-sm text-cream/70">{disabledNote}</p>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="border border-gold/30 bg-soot/20 p-8">
        <p className="t-label text-gold">Angefragt</p>
        <h3 className="t-h3 mt-2 text-cream">{title}</h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/70">
          Ihre Anfrage liegt beim Concierge. Wir bestätigen persönlich, binnen 48 Stunden.
        </p>
        <p className="mt-4 text-xs text-stone/70">(Prototyp — repräsentative Bestätigung, kein echter Versand.)</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); setSent(true); }}
      className="border border-hairline/15 bg-soot/20 p-8"
    >
      <h3 className="t-h3 text-cream">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/70">{intro}</p>

      {withDate && (
        <>
          <label className="t-label mt-6 block text-stone">Wunschtermin</label>
          <input
            type="date"
            data-cursor
            className="mt-2 w-full border border-hairline/30 bg-night px-4 py-3 text-cream [color-scheme:dark] focus:border-gold focus:outline-none"
          />
        </>
      )}

      <label className="t-label mt-6 block text-stone">{fieldLabel}</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={3}
        data-cursor
        className="mt-2 w-full resize-none border border-hairline/30 bg-night px-4 py-3 text-cream placeholder:text-stone/40 focus:border-gold focus:outline-none"
      />

      <button type="submit" data-cursor className="btn-primary mt-6 justify-center">
        Anfrage senden →
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Create `components/sitz/ConciergeThread.tsx`**

```tsx
"use client";

import { useState } from "react";
import { brand } from "@/lib/content";
import type { ConciergeMessage } from "@/lib/founders/types";

export function ConciergeThread({ seed }: { seed: ConciergeMessage[] }) {
  const [messages, setMessages] = useState<ConciergeMessage[]>(seed);
  const [draft, setDraft] = useState("");

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((m) => [...m, { from: "member", text: draft.trim(), dateLabel: "gerade eben" }]);
    setDraft("");
  }

  return (
    <div className="border border-hairline/15 bg-soot/20 p-8">
      <h3 className="t-h3 text-cream">Concierge-Direktdraht</h3>
      <p className="mt-2 text-sm text-cream/70">Persönlich, {brand.contactEmail}. Antwort binnen 48 Stunden.</p>

      <ul className="mt-7 flex flex-col gap-4">
        {messages.map((m, i) => (
          <li key={i} className={m.from === "member" ? "ml-auto max-w-[80%] text-right" : "mr-auto max-w-[80%]"}>
            <p className="t-label text-stone">{m.from === "member" ? "Sie" : "Concierge"} · {m.dateLabel}</p>
            <p
              className={`mt-1 inline-block px-4 py-3 text-sm leading-relaxed ${
                m.from === "member" ? "bg-gold/15 text-cream" : "bg-night text-cream/80 border border-hairline/15"
              }`}
            >
              {m.text}
            </p>
          </li>
        ))}
      </ul>

      <form onSubmit={send} className="mt-7 flex gap-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Nachricht an den Hof …"
          data-cursor
          className="flex-1 border border-hairline/30 bg-night px-4 py-3 text-cream placeholder:text-stone/40 focus:border-gold focus:outline-none"
        />
        <button type="submit" data-cursor className="btn-primary justify-center">Senden →</button>
      </form>
      <p className="mt-4 text-xs text-stone/70">(Prototyp — der Hof antwortet hier nicht automatisch.)</p>
    </div>
  );
}
```

- [ ] **Step 3: Create `app/sitz/anfragen/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { foundersData } from "@/lib/founders/data";
import { RequestForm } from "@/components/sitz/RequestForm";
import { ConciergeThread } from "@/components/sitz/ConciergeThread";

const TABS = [
  { key: "flasche", label: "Flasche auf Anfrage" },
  { key: "gasthof", label: "Gasthof" },
  { key: "concierge", label: "Concierge" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AnfragenPage() {
  const [tab, setTab] = useState<TabKey>("flasche");
  const { gasthof, concierge } = foundersData;

  return (
    <div>
      <p className="t-label">Anfragen</p>
      <h1 className="t-h1 text-cream mt-3">Beauftragen, nicht bestellen.</h1>
      <p className="t-lead mt-5 max-w-xl">Jede Anfrage wird vom Hof persönlich bestätigt.</p>

      <div className="mt-10 flex gap-6 border-b border-hairline/15">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            data-cursor
            className={`pb-3 text-xs uppercase tracking-[0.16em] transition-colors ${
              tab === t.key ? "border-b border-gold text-gold" : "text-cream/60 hover:text-cream"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-10 max-w-xl">
        {tab === "flasche" && (
          <RequestForm
            title="Flasche auf Anfrage"
            intro="Patron-Cask, Sonderallokation oder eine individuelle Edition. Nennen Sie Ihren Wunsch — der Concierge meldet sich."
            fieldLabel="Ihr Wunsch"
            placeholder="z. B. Patron-Cask-Vorrecht, eine Sonderallokation …"
          />
        )}
        {tab === "gasthof" && (
          <RequestForm
            title="Gästehaus Reith — eine Nacht"
            intro="Eine Nacht pro Jahr im Gästehaus (Selbstkosten Verpflegung)."
            fieldLabel="Anmerkung"
            placeholder="Anlass, Begleitung, Wünsche …"
            withDate
            disabledNote={gasthof.used ? `Ihre Nacht für ${gasthof.year} ist bereits gebucht.` : undefined}
          />
        )}
        {tab === "concierge" && <ConciergeThread seed={concierge} />}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify in the browser**

Navigate to `/sitz/anfragen`.
- `preview_snapshot` → three tabs; "Flasche auf Anfrage" form visible.
- `preview_fill` the textarea, `preview_click` "Anfrage senden" → `preview_snapshot` → "Angefragt" confirmation with the 48h note.
- `preview_click` "Gasthof" tab → date field + textarea (gasthof.used=false, so the form shows).
- `preview_click` "Concierge" tab → seeded thread; `preview_fill` + send → your message appends.
- `preview_console_logs` → no errors. `preview_screenshot` → proof.

- [ ] **Step 5: Commit**

```bash
git add components/sitz/RequestForm.tsx components/sitz/ConciergeThread.tsx app/sitz/anfragen/page.tsx
git commit -m "feat(sitz): requests — bottle, Gasthof, concierge thread

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 11: Events

**Files:**
- Create: `components/sitz/EventsList.tsx`
- Create: `app/sitz/events/page.tsx`

- [ ] **Step 1: Create `components/sitz/EventsList.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { EventItem } from "@/lib/founders/types";

export function EventsList({ events }: { events: EventItem[] }) {
  const [requested, setRequested] = useState<Set<number>>(
    () => new Set(events.map((e, i) => (e.rsvp === "angefragt" ? i : -1)).filter((i) => i >= 0)),
  );

  function toggle(i: number) {
    setRequested((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  return (
    <div className="grid gap-px overflow-hidden border border-hairline/15 bg-hairline/10">
      {events.map((e, i) => {
        const isReq = requested.has(i);
        return (
          <div key={`${e.title}-${i}`} className="flex flex-wrap items-center justify-between gap-6 bg-night p-8">
            <div className="min-w-0">
              <p className="t-label text-gold">{e.kind} · {e.dateLabel} · {e.time}</p>
              <h3 className="t-h3 mt-1 text-cream">{e.title}</h3>
              <p className="mt-1 text-sm text-cream/60">{e.location} · {e.capacityNote}</p>
            </div>
            <button
              onClick={() => toggle(i)}
              data-cursor
              className={`shrink-0 px-5 py-2.5 text-xs uppercase tracking-[0.16em] transition-colors ${
                isReq ? "border border-gold/60 text-gold" : "btn-primary"
              }`}
            >
              {isReq ? "Platz angefragt ✓" : "Platz anfragen"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create `app/sitz/events/page.tsx`**

```tsx
import { foundersData } from "@/lib/founders/data";
import { EventsList } from "@/components/sitz/EventsList";
import { Reveal } from "@/components/ui/Reveal";

export default function EventsPage() {
  return (
    <div>
      <Reveal>
        <p className="t-label">Events</p>
        <h1 className="t-h1 text-cream mt-3">Der Sitzkreis trifft sich.</h1>
        <p className="t-lead mt-5 max-w-xl">
          Tastings beginnen um 15:04 — „14:64", wenn die Stunde 64 Minuten hätte.
        </p>
      </Reveal>
      <div className="mt-14">
        <EventsList events={foundersData.events} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify in the browser**

Navigate to `/sitz/events`.
- `preview_snapshot` → four events; the Sitzkreis-Versammlung shows "Platz angefragt ✓" (seeded), others show "Platz anfragen".
- `preview_click` a "Platz anfragen" button → toggles to "Platz angefragt ✓".
- `preview_console_logs` → no errors. `preview_screenshot` → proof.

- [ ] **Step 4: Commit**

```bash
git add components/sitz/EventsList.tsx app/sitz/events/page.tsx
git commit -m "feat(sitz): events with RSVP

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 12: Hofarchiv — identity / bronze plaque

**Files:**
- Create: `components/sitz/ArchivePlaque.tsx`
- Create: `app/sitz/archiv/page.tsx`

- [ ] **Step 1: Create `components/sitz/ArchivePlaque.tsx`**

```tsx
import type { Member } from "@/lib/founders/types";

const PRIV_LABELS: Record<string, string> = {
  P1: "Erstzugriff auf alle Editionen",
  P2: "Estate Edition ab 2030",
  P3: "Gästehaus Reith",
  P4: "Hofarchiv — Bronzetafel",
  P5: "Concierge-Direktdraht",
  P6: "Patron-Cask-Vorrecht",
  P7: "Übertragbar im Erbfall",
};

export function ArchivePlaque({ member }: { member: Member }) {
  const seat = String(member.seatNo).padStart(3, "0");
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* The plaque */}
      <div className="relative overflow-hidden border border-gold/30 bg-gradient-to-b from-copper/30 to-night p-10">
        <p className="t-label text-gold">Hofarchiv · Bronzetafel</p>
        <p className="mt-6 font-display text-5xl text-cream tabular-nums [font-variation-settings:'opsz'_48]">
          1464.{seat}
        </p>
        <p className="mt-3 text-sm text-cream/70">{member.name}</p>
        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-sm">
          <div><p className="t-label text-stone">Aufnahmejahr</p><p className="mt-1 text-cream">{member.joinedYear}</p></div>
          <div><p className="t-label text-stone">Sitz</p><p className="mt-1 text-cream tabular-nums">{member.seatNo} / 464</p></div>
          <div><p className="t-label text-stone">Lesart</p><p className="mt-1 text-cream tracking-[0.2em]">MCDLXIV</p></div>
        </div>
        <p className="mt-8 text-xs leading-relaxed text-stone/70">
          Namentliche Bronzetafel im Brennraum, vom Brennmeister handgraviert (P4).
        </p>
      </div>

      {/* Privileges + inheritance */}
      <div>
        <p className="t-label text-stone">Ihre sieben Säulen</p>
        <ul className="mt-5 flex flex-col gap-px overflow-hidden border border-hairline/15 bg-hairline/10">
          {member.privileges.map((p) => (
            <li key={p} className="flex items-baseline gap-4 bg-night px-5 py-3">
              <span className="t-label text-gold">{p}</span>
              <span className="text-sm text-cream/80">{PRIV_LABELS[p]}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 border border-hairline/15 bg-soot/20 p-6">
          <p className="t-label text-stone">Vererbung (P7)</p>
          <p className="mt-2 text-sm leading-relaxed text-cream/70">
            Einmalig auf eine Person übertragbar. Die zweite Generation tritt voll privilegiert ein,
            ohne neuen Erstkauf. Anzeige binnen 12 Monaten. — Übertragung wird persönlich am Hof veranlasst.
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/sitz/archiv/page.tsx`**

```tsx
import { foundersData } from "@/lib/founders/data";
import { ArchivePlaque } from "@/components/sitz/ArchivePlaque";
import { Reveal } from "@/components/ui/Reveal";

export default function ArchivPage() {
  return (
    <div>
      <Reveal>
        <p className="t-label">Hofarchiv</p>
        <h1 className="t-h1 text-cream mt-3">Ihr Platz, in Bronze.</h1>
      </Reveal>
      <div className="mt-14">
        <ArchivePlaque member={foundersData.member} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify in the browser**

Navigate to `/sitz/archiv`.
- `preview_snapshot` → plaque "1464.007", name, Aufnahmejahr 2026, Sitz 7 / 464, MCDLXIV; seven privileges P1–P7; the inheritance note.
- `preview_console_logs` → no errors. `preview_screenshot` → proof.

- [ ] **Step 4: Commit**

```bash
git add components/sitz/ArchivePlaque.tsx app/sitz/archiv/page.tsx
git commit -m "feat(sitz): Hofarchiv plaque + privileges

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 13: "Eintreten" entry points

**Files:**
- Modify: `components/ui/Footer.tsx` (add a member link)
- Modify: `app/founders-circle/page.tsx` (add a discreet entry link)

- [ ] **Step 1: Add the member link to the Footer "Marke" column**

In `components/ui/Footer.tsx`, find the "Marke" column block:

```tsx
        <div className="flex flex-col gap-2 text-sm">
          <p className="signage text-stone mb-2">Marke</p>
          <Link href="/bottle" className="hover:text-gold">The Bottle</Link>
          <Link href="/founders-circle" className="hover:text-gold">Founder&apos;s Circle</Link>
        </div>
```

and add the member link after the Founder's Circle link:

```tsx
        <div className="flex flex-col gap-2 text-sm">
          <p className="signage text-stone mb-2">Marke</p>
          <Link href="/bottle" className="hover:text-gold">The Bottle</Link>
          <Link href="/founders-circle" className="hover:text-gold">Founder&apos;s Circle</Link>
          <Link href="/sitz" className="hover:text-gold">Mitglieder · Eintreten</Link>
        </div>
```

- [ ] **Step 2: Add a discreet entry link on the Founder's Circle page**

In `app/founders-circle/page.tsx`, inside the Hero `<section>`, after the closing tag of the `<Reveal delay={0.24}>` block that holds the lead paragraph, add:

```tsx
          <Reveal delay={0.32}>
            <a
              href="/sitz"
              data-cursor
              className="link-underline mt-10 inline-block text-xs uppercase tracking-[0.18em] text-gold"
            >
              Mitglieder · Eintreten →
            </a>
          </Reveal>
```

(Use the existing `Reveal` import already present in that file. The hero section already uses `Reveal` with `delay` props, so this matches the surrounding pattern.)

- [ ] **Step 3: Verify in the browser**

- `preview_eval` → `window.location.href='http://localhost:3000/founders-circle'` → `preview_snapshot` → "Mitglieder · Eintreten →" link appears under the hero lead.
- `preview_click` it → lands on `/sitz` (login wall, since likely logged out in a fresh check — or portal if session present).
- Scroll the footer on any public page → `preview_snapshot` → "Mitglieder · Eintreten" in the Marke column.
- `preview_console_logs` → no errors.

- [ ] **Step 4: Commit**

```bash
git add components/ui/Footer.tsx app/founders-circle/page.tsx
git commit -m "feat(sitz): member entry points (footer + founders-circle)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 14: Full verification + production build

**Files:** none (verification only)

- [ ] **Step 1: Run the full unit suite**

Run: `npm run test`
Expected: all pass, including `lib/founders/member.test.ts` and `lib/founders/release.test.ts`.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors (warnings acceptable if pre-existing).

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build succeeds; `/sitz`, `/sitz/weg`, `/sitz/verfuegbarkeit`, `/sitz/anfragen`, `/sitz/events`, `/sitz/archiv` appear in the route output.

- [ ] **Step 4: End-to-end browser walkthrough**

With `npm run dev` and a logged-out session (clear `localStorage` key `1464byw.sitz.member` via `preview_eval`):
- `/sitz` → login wall. Wrong code → "Der Code stimmt nicht." Correct (`1464.007` / `1464`) → portal.
- Click through all six sections; confirm no console errors at each (`preview_console_logs`).
- `preview_resize` mobile → confirm side-nav wraps and each page is usable.
- "Sitz verlassen" → returns to the login wall.
- `preview_screenshot` of the overview + the release timeline as final proof.

- [ ] **Step 5: Final commit (if any verification fixes were made)**

```bash
git add -A
git commit -m "chore(sitz): verification pass — tests, lint, build green

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review (completed during planning)

**Spec coverage:** Login (§4) → T5; Der Sitz overview (§5.1) → T7; Weg zum Release (§5.2) → T8; Verfügbarkeit (§5.3) → T9; Anfragen incl. Flasche/Gasthof (§5.4) + Concierge tab (§5.6) → T10; Events (§5.5) → T11; Hofarchiv + P7 (§5.7) → T12; backend seam (§3) → T1/T4; own chrome (§3) → T5/T6; entry links → T13; testing (§11) → T2/T3/T14. All sections mapped.

**Decisions honored:** demo `1464.007 · 1464` (T5); Concierge as a tab (T10); entry link footer + founders-circle (T13); maturation duration omitted from UI (T8, data.ts comment).

**Type consistency:** all components consume the `lib/founders/types.ts` types defined in T1; function names (`parseSeatNo`, `checkAccess`, `daysUntil`, `currentPhase`, `phaseProgress`, `writeSession`, `clearSession`, `useMember`) are used consistently across tasks.

**No placeholders:** every code step contains complete, runnable code. (The Task 5 `app/sitz/page.tsx` is intentionally a temporary stub, explicitly replaced in Task 7.)
