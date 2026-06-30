import { describe, it, expect } from "vitest";
import { brand, editions, patronageStages, heritageChronicle, nav } from "./content";

describe("content integrity", () => {
  it("keeps the brand wordmark canonical", () => {
    expect(brand.master).toBe("1464byW");
    expect(brand.monogram).toBe("W//");
  });

  it("has unique edition slugs and complete fields", () => {
    const slugs = editions.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const e of editions) {
      expect(e.name && e.volume && e.abv && e.notes && e.status).toBeTruthy();
    }
  });

  it("marks exactly one accented edition and one accented patronage stage", () => {
    expect(editions.filter((e) => e.accent).length).toBe(1);
    expect(patronageStages.filter((p) => p.accent).length).toBe(1);
  });

  it("anchors the chronicle in 1464", () => {
    expect(heritageChronicle.some((c) => c.year === "1464")).toBe(true);
    for (const c of heritageChronicle) expect(c.year && c.text).toBeTruthy();
  });

  it("exposes a non-empty navigation", () => {
    expect(nav.length).toBeGreaterThan(0);
    for (const n of nav) expect(n.href.startsWith("/")).toBe(true);
  });
});
