import { describe, it, expect } from "vitest";
import { CAPRI_700, createCapriGeometry, createCapriLiquidGeometry } from "./capri";

describe("Capri geometry", () => {
  it("builds a closed bottle at 700 mL proportions", () => {
    const g = createCapriGeometry(CAPRI_700);
    const pos = g.getAttribute("position");
    expect(pos.count).toBeGreaterThan(1000);
    expect(g.getIndex()).not.toBeNull();

    g.computeBoundingBox();
    const bb = g.boundingBox!;
    expect(bb.max.y - bb.min.y).toBeCloseTo(CAPRI_700.height, 1);
    expect(bb.max.x - bb.min.x).toBeCloseTo(CAPRI_700.halfWidth * 2, 0); // wide face
    // depth is shallower than width (it's a flat flask)
    expect(bb.max.z - bb.min.z).toBeLessThan(bb.max.x - bb.min.x);
  });

  it("fills the spirit below the shoulder, inset from the wall", () => {
    const g = createCapriLiquidGeometry(CAPRI_700, 0.66, 0.9);
    g.computeBoundingBox();
    const bb = g.boundingBox!;
    expect(bb.max.y).toBeLessThan(CAPRI_700.height / 2); // headspace at top
    expect(bb.max.x).toBeLessThan(CAPRI_700.halfWidth); // inside the glass wall
  });
});
