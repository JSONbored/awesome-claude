import { describe, expect, it } from "vitest";

import {
  countWhere,
  exactPct,
  has,
  pct,
} from "../scripts/lib/trust-coverage-math.mjs";

describe("has", () => {
  it("is true for a non-empty array and false for an empty one", () => {
    expect(has(["a"])).toBe(true);
    expect(has([])).toBe(false);
  });

  it("is true for a non-blank scalar and false for blank/nullish", () => {
    expect(has("x")).toBe(true);
    expect(has(0)).toBe(true);
    expect(has("   ")).toBe(false);
    expect(has("")).toBe(false);
    expect(has(null)).toBe(false);
    expect(has(undefined)).toBe(false);
  });
});

describe("pct", () => {
  it("rounds count/total to a whole percentage", () => {
    expect(pct(1, 3)).toBe(33);
    expect(pct(2, 3)).toBe(67);
    expect(pct(1, 1)).toBe(100);
  });

  it("is 0 when total is 0", () => {
    expect(pct(5, 0)).toBe(0);
  });
});

describe("exactPct", () => {
  it("returns the unrounded percentage", () => {
    expect(exactPct(1, 3)).toBeCloseTo(33.3333, 3);
    expect(exactPct(1, 8)).toBe(12.5);
  });

  it("is 0 when total is 0", () => {
    expect(exactPct(5, 0)).toBe(0);
  });
});

describe("countWhere", () => {
  it("counts members satisfying the predicate", () => {
    expect(countWhere([1, 2, 3, 4], (n) => n % 2 === 0)).toBe(2);
    expect(countWhere([], () => true)).toBe(0);
    expect(countWhere([1, 2, 3], () => false)).toBe(0);
  });
});
