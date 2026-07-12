import { describe, expect, it } from "vitest";

import { meter, sparkline } from "../scripts/lib/impact-card-svg.mjs";

describe("sparkline", () => {
  it("builds a normalized polyline with an end marker", () => {
    const svg = sparkline(0, 0, 10, 10, [0, 5, 10], "#mut", "#acc", "#bg");
    // 3 points across w=10 => stepX 5; min 0, max 10, range 10
    expect(svg).toContain('d="M0.0,10.0 L5.0,5.0 L10.0,0.0"');
    expect(svg).toContain('stroke="#mut"');
    // end marker sits on the last point (10, 0)
    expect(svg).toContain('<circle cx="10.0" cy="0.0" r="6" fill="#bg"/>');
    expect(svg).toContain('<circle cx="10.0" cy="0.0" r="4" fill="#acc"/>');
    // first command is a move, the rest are lines
    expect(svg).toMatch(/d="M[^"]*"/);
    expect(svg).toContain("L5.0,5.0");
  });

  it("applies the max>=1 / min<=0 flooring so small/negative series still render", () => {
    // all values below 1 -> max floors to 1; a negative value -> min stays real
    const svg = sparkline(0, 0, 4, 10, [-3, 0.5], "#mut", "#acc", "#bg");
    // min -3, max 1, range 4; n=2, stepX 4
    // p0: y = 10 - ((-3 - -3)/4)*10 = 10 ; p1: y = 10 - ((0.5 - -3)/4)*10 = 1.25 -> "1.3"
    expect(svg).toContain('d="M0.0,10.0 L4.0,1.3"');
  });
});

describe("meter", () => {
  it("fills value/max of the width", () => {
    const svg = meter(0, 0, 100, 10, 5, 10, "#acc", "#trk");
    expect(svg).toContain(
      '<rect x="0" y="0" width="100" height="10" rx="5" fill="#trk"/>',
    );
    expect(svg).toContain(
      '<rect x="0" y="0" width="50.0" height="10" rx="5" fill="#acc"/>',
    );
  });

  it("clamps the fill to the full width when value exceeds max", () => {
    const svg = meter(0, 0, 100, 10, 25, 10, "#acc", "#trk");
    expect(svg).toContain('width="100.0" height="10" rx="5" fill="#acc"');
  });

  it("floors the fill width to the bar height so the cap never collapses", () => {
    const svg = meter(0, 0, 100, 10, 0, 10, "#acc", "#trk");
    // value 0 -> fraction 0 -> Math.max(10, 0) = 10
    expect(svg).toContain('width="10.0" height="10" rx="5" fill="#acc"');
  });
});
