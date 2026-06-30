import { describe, it, expect } from "vitest";
import { daysUntil, releaseCountdown, currentPhase, phaseProgress } from "./release";
import type { Phase } from "./types";

// Fixed UTC reference → timezone-stable.
const NOW = new Date(Date.UTC(2026, 5, 10, 0, 0, 0)); // 2026-06-10 00:00 UTC

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

describe("releaseCountdown", () => {
  it("breaks remaining time into days/hours/minutes/seconds", () => {
    // 2026-06-10 13:20:28 UTC → 10h 39m 32s before 2026-06-11 00:00 UTC
    const c = releaseCountdown("2026-06-11", new Date(Date.UTC(2026, 5, 10, 13, 20, 28)));
    expect(c.days).toBe(0);
    expect(c.hours).toBe(10);
    expect(c.minutes).toBe(39);
    expect(c.seconds).toBe(32);
  });
  it("is all-zero for past or malformed targets", () => {
    expect(releaseCountdown("2026-06-09", NOW).total).toBe(0);
    expect(releaseCountdown("nope", NOW).days).toBe(0);
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
