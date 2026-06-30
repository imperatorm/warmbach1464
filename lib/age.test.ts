import { describe, it, expect } from "vitest";
import { ageInYears, isOfLegalAge } from "./age";

// Fixed reference date (local components) → deterministic regardless of TZ.
const NOW = new Date(2026, 4, 29); // 2026-05-29

describe("ageInYears", () => {
  it("counts a birthday today as a full year", () => {
    expect(ageInYears("2008-05-29", NOW)).toBe(18);
  });
  it("does not count a birthday that has not arrived yet this year", () => {
    expect(ageInYears("2008-05-30", NOW)).toBe(17);
  });
  it("counts an earlier-in-year birthday correctly", () => {
    expect(ageInYears("2008-01-01", NOW)).toBe(18);
  });
  it("returns null for empty or malformed input", () => {
    expect(ageInYears("", NOW)).toBeNull();
    expect(ageInYears("not-a-date", NOW)).toBeNull();
    expect(ageInYears("2008-13-40", NOW)).toBeNull();
  });
});

describe("isOfLegalAge", () => {
  it("admits exactly 18 in DE", () => {
    expect(isOfLegalAge("2008-05-29", "DE", NOW)).toBe(true);
  });
  it("rejects 17 in DE", () => {
    expect(isOfLegalAge("2009-05-29", "DE", NOW)).toBe(false);
  });
  it("applies the lower AT threshold (16)", () => {
    expect(isOfLegalAge("2010-05-29", "AT", NOW)).toBe(true); // 16
    expect(isOfLegalAge("2010-05-29", "DE", NOW)).toBe(false); // 16 < 18
    expect(isOfLegalAge("2010-05-30", "AT", NOW)).toBe(false); // 15, birthday tomorrow
  });
  it("rejects unparseable dates", () => {
    expect(isOfLegalAge("", "DE", NOW)).toBe(false);
  });
});
