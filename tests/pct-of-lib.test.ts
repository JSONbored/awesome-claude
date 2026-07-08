import { describe, expect, it } from "vitest";

import { pctOf } from "../apps/web/src/lib/pct-of-lib";

describe("pctOf", () => {
  it("computes a rounded percentage", () => {
    expect(pctOf(1, 3)).toBe(33);
    expect(pctOf(2, 3)).toBe(67);
    expect(pctOf(5, 5)).toBe(100);
  });

  it("returns 0 when the total is 0", () => {
    expect(pctOf(4, 0)).toBe(0);
  });
});
