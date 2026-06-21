import { describe, expect, it } from "vitest";

import {
  isRecord,
  optionalString,
  optionalRawString,
  optionalBoolean,
  optionalNumber,
  uniqueStrings,
  normalizeStringArray,
} from "../integrations/raycast/src/utils.ts";

describe("isRecord", () => {
  it("accepts any non-null object (including arrays), rejects primitives", () => {
    // The guard is a plain `typeof === object && !== null`, so arrays pass.
    expect(isRecord({})).toBe(true);
    expect(isRecord([])).toBe(true);
    expect(isRecord(null)).toBe(false);
    expect(isRecord("x")).toBe(false);
    expect(isRecord(undefined)).toBe(false);
  });
});

describe("optionalString", () => {
  it("trims strings and coerces non-strings to an empty string", () => {
    expect(optionalString("  hi  ")).toBe("hi");
    expect(optionalString("")).toBe("");
    expect(optionalString(5)).toBe("");
    expect(optionalString(null)).toBe("");
  });
});

describe("optionalRawString", () => {
  it("returns strings untrimmed and coerces non-strings to empty", () => {
    // Unlike optionalString, whitespace is preserved here.
    expect(optionalRawString("  hi  ")).toBe("  hi  ");
    expect(optionalRawString(5)).toBe("");
  });
});

describe("optionalBoolean", () => {
  it("passes through booleans and returns undefined otherwise", () => {
    expect(optionalBoolean(true)).toBe(true);
    expect(optionalBoolean(false)).toBe(false);
    expect(optionalBoolean("true")).toBeUndefined();
  });
});

describe("optionalNumber", () => {
  it("passes finite numbers and rejects non-numbers and non-finite values", () => {
    expect(optionalNumber(5)).toBe(5);
    expect(optionalNumber(0)).toBe(0);
    // Numeric strings are not coerced; only real finite numbers pass.
    expect(optionalNumber("3")).toBeUndefined();
    expect(optionalNumber(Number.NaN)).toBeUndefined();
    expect(optionalNumber(Number.POSITIVE_INFINITY)).toBeUndefined();
  });
});

describe("uniqueStrings", () => {
  it("trims, drops blanks, and dedupes while preserving first-seen order", () => {
    expect(uniqueStrings([" a ", "a", "b", "", "  "])).toEqual(["a", "b"]);
  });
});

describe("normalizeStringArray", () => {
  it("returns [] for non-arrays and keeps only trimmed unique strings", () => {
    expect(normalizeStringArray("nope")).toEqual([]);
    expect(normalizeStringArray([" a ", "b", "b", 1, null])).toEqual([
      "a",
      "b",
    ]);
  });
});
