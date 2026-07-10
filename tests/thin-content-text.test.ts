import { describe, expect, it } from "vitest";

import {
  collapseWhitespace,
  combinedTextOf,
  introOf,
  jaccard,
  normalizeForCompare,
  round,
  shinglesOf,
  TEXT_FIELDS,
  tokenize,
} from "../scripts/lib/thin-content-text.mjs";

describe("collapseWhitespace", () => {
  it("stringifies and trims, null/undefined become ''", () => {
    expect(collapseWhitespace("  hi ")).toBe("hi");
    expect(collapseWhitespace(null)).toBe("");
    expect(collapseWhitespace(undefined)).toBe("");
    expect(collapseWhitespace(42)).toBe("42");
  });
});

describe("introOf", () => {
  it("prefers description, then cardDescription, then seoDescription", () => {
    expect(
      introOf({ description: "d", cardDescription: "c", seoDescription: "s" }),
    ).toBe("d");
    expect(introOf({ cardDescription: "c", seoDescription: "s" })).toBe("c");
    expect(introOf({ seoDescription: "s" })).toBe("s");
    expect(introOf({})).toBe("");
  });
});

describe("combinedTextOf", () => {
  it("joins the known fields and de-duplicates identical values", () => {
    const combined = combinedTextOf({
      description: "same",
      cardDescription: "same",
      seoDescription: "other",
    });
    expect(combined).toBe("same other");
  });

  it("only reads the recognized TEXT_FIELDS", () => {
    expect(TEXT_FIELDS).toContain("description");
    expect(combinedTextOf({ description: "d", nope: "ignored" })).toBe("d");
  });
});

describe("tokenize / normalizeForCompare", () => {
  it("lowercases and splits on non-alphanumerics", () => {
    expect(tokenize("Hello, World! 123")).toEqual(["hello", "world", "123"]);
    expect(tokenize("   ")).toEqual([]);
  });

  it("normalizeForCompare rejoins the tokens with single spaces", () => {
    expect(normalizeForCompare("A--b  C")).toBe("a b c");
  });
});

describe("shinglesOf", () => {
  it("builds size-N word shingles", () => {
    expect([...shinglesOf(["a", "b", "c", "d"], 2)]).toEqual([
      "a b",
      "b c",
      "c d",
    ]);
  });

  it("returns one shingle when there are fewer tokens than size, and none for empty", () => {
    expect([...shinglesOf(["a"], 3)]).toEqual(["a"]);
    expect(shinglesOf([], 3).size).toBe(0);
  });
});

describe("jaccard", () => {
  it("is 0 for two empty sets and 1 for identical sets", () => {
    expect(jaccard(new Set(), new Set())).toBe(0);
    expect(jaccard(new Set(["a", "b"]), new Set(["a", "b"]))).toBe(1);
  });

  it("is intersection over union for overlapping sets, regardless of arg order", () => {
    expect(jaccard(new Set(["a", "b"]), new Set(["b", "c"]))).toBeCloseTo(
      1 / 3,
    );
    // larger set first exercises the size-ordering swap
    expect(jaccard(new Set(["a", "b", "c"]), new Set(["a"]))).toBeCloseTo(
      1 / 3,
    );
    expect(jaccard(new Set(["a"]), new Set(["b"]))).toBe(0);
  });
});

describe("round", () => {
  it("rounds to the requested number of digits (default 3)", () => {
    expect(round(1 / 3)).toBe(0.333);
    expect(round(0.12345, 2)).toBe(0.12);
    expect(round(2)).toBe(2);
  });
});
