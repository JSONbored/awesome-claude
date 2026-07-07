import { describe, expect, it } from "vitest";

import {
  MAX_QUERY_LENGTH,
  MAX_QUERY_TOKENS,
  TOKEN_SPLIT_PATTERN,
  normalizeSearchQuery,
  tokenizeSearchQuery,
} from "../apps/web/src/lib/search-query-tokenization-lib";

describe("constants", () => {
  it("exposes the expected caps and split pattern", () => {
    expect(MAX_QUERY_LENGTH).toBe(256);
    expect(MAX_QUERY_TOKENS).toBe(12);
    expect("a b".split(TOKEN_SPLIT_PATTERN)).toEqual(["a", "b"]);
  });
});

describe("normalizeSearchQuery", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeSearchQuery("  hello  ")).toBe("hello");
  });

  it("lowercases the query", () => {
    expect(normalizeSearchQuery("HeLLo World")).toBe("hello world");
  });

  it("caps length at MAX_QUERY_LENGTH before trimming", () => {
    const long = "a".repeat(MAX_QUERY_LENGTH + 50);
    expect(normalizeSearchQuery(long)).toBe("a".repeat(MAX_QUERY_LENGTH));
  });

  it("trims whitespace that remains after the length cap", () => {
    // slice(0, 256) lands inside a run of spaces, which trim() then removes.
    const q = "x".repeat(250) + " ".repeat(20) + "tail";
    expect(normalizeSearchQuery(q)).toBe("x".repeat(250));
  });

  it("returns an empty string for whitespace-only input", () => {
    expect(normalizeSearchQuery("    ")).toBe("");
  });
});

describe("tokenizeSearchQuery", () => {
  it("splits on non-token characters", () => {
    expect(tokenizeSearchQuery("hello world")).toEqual(["hello", "world"]);
  });

  it("lowercases tokens", () => {
    expect(tokenizeSearchQuery("Hello WORLD")).toEqual(["hello", "world"]);
  });

  it("drops tokens shorter than two characters", () => {
    expect(tokenizeSearchQuery("a bc d ef")).toEqual(["bc", "ef"]);
  });

  it("keeps the allowed special characters + # . -", () => {
    expect(tokenizeSearchQuery("c++ c# node.js co-op")).toEqual([
      "c++",
      "c#",
      "node.js",
      "co-op",
    ]);
  });

  it("collapses runs of separators", () => {
    expect(tokenizeSearchQuery("foo,,,bar   baz")).toEqual([
      "foo",
      "bar",
      "baz",
    ]);
  });

  it("flushes a trailing token when it is long enough", () => {
    expect(tokenizeSearchQuery("alpha beta")).toEqual(["alpha", "beta"]);
  });

  it("drops a trailing token shorter than two characters", () => {
    expect(tokenizeSearchQuery("alpha b")).toEqual(["alpha"]);
  });

  it("caps the number of tokens at MAX_QUERY_TOKENS", () => {
    const many = Array.from({ length: 20 }, (_, i) => `tok${i}`).join(" ");
    const result = tokenizeSearchQuery(many);
    expect(result).toHaveLength(MAX_QUERY_TOKENS);
    expect(result[0]).toBe("tok0");
    expect(result[MAX_QUERY_TOKENS - 1]).toBe(`tok${MAX_QUERY_TOKENS - 1}`);
  });

  it("does not flush a trailing token once the cap is reached", () => {
    // 12 two-char tokens fill the cap; the 13th (also valid) must be ignored.
    const q = Array.from({ length: 13 }, () => "ab").join(" ");
    expect(tokenizeSearchQuery(q)).toHaveLength(MAX_QUERY_TOKENS);
  });

  it("returns an empty array for an empty string", () => {
    expect(tokenizeSearchQuery("")).toEqual([]);
  });

  it("returns an empty array when nothing meets the minimum length", () => {
    expect(tokenizeSearchQuery("a b c !")).toEqual([]);
  });
});
