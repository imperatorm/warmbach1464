import { describe, it, expect } from "vitest";
import {
  BOTTLE_PROFILE,
  bottleProfilePoints,
  ESTATE_COORDS,
  HERO_EDITION,
} from "./bottle";
import { makeEngravingTexture } from "./engraving";

describe("bottle constants", () => {
  it("anchors the hero edition to Founder's Reserve N°1 / 300", () => {
    expect(HERO_EDITION.slug).toBe("founders-reserve-n1");
    expect(HERO_EDITION.editionLabel).toMatch(/N° \d{1,3} \/ 300/);
    expect(HERO_EDITION.capsuleMark).toBe("W//");
  });

  it("embosses the real Hof coordinates", () => {
    expect(ESTATE_COORDS).toContain("47.4486° N");
    expect(ESTATE_COORDS).toContain("12.3936° E");
  });

  it("revolves the full lathe profile as Vector2 points on the axis", () => {
    const pts = bottleProfilePoints();
    expect(pts.length).toBe(BOTTLE_PROFILE.length);
    expect(pts[0].x).toBe(0); // base sits on the axis of revolution
  });
});

describe("engraving texture", () => {
  it("is SSR-safe (returns null without a document)", () => {
    // vitest's default environment is node — no document — so this must not throw.
    expect(makeEngravingTexture("N° 017 / 300")).toBeNull();
  });
});
