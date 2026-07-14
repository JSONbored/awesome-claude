import { describe, expect, it } from "vitest";

import { equalStringArrays } from "../scripts/lib/equal-string-arrays.mjs";

describe("equalStringArrays", () => {
  it("is true for arrays with the same items in the same order", () => {
    expect(equalStringArrays(["a", "b"], ["a", "b"])).toBe(true);
    expect(equalStringArrays([], [])).toBe(true);
  });

  it("is false when lengths differ", () => {
    expect(equalStringArrays(["a"], ["a", "b"])).toBe(false);
    expect(equalStringArrays(["a", "b"], ["a"])).toBe(false);
  });

  it("is false when items differ or are out of order", () => {
    expect(equalStringArrays(["a", "b"], ["a", "c"])).toBe(false);
    expect(equalStringArrays(["a", "b"], ["b", "a"])).toBe(false);
  });
});
