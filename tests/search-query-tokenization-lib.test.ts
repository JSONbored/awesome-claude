import { describe, expect, it } from "vitest";

import {
  MAX_QUERY_LENGTH,
  MAX_QUERY_TOKENS,
  TOKEN_SPLIT_PATTERN,
  normalizeSearchQuery,
  tokenizeSearchQuery,
} from "../apps/web/src/lib/search-query-tokenization-lib";

describe("constants", () => {
  it("exposes the token split pattern", () => {
    expect(TOKEN_SPLIT_PATTERN).toBeInstanceOf(RegExp);
    expect(TOKEN_SPLIT_PATTERN.source).toBe("[^a-z0-9+#.-]+");
    expect(TOKEN_SPLIT_PATTERN.flags).toBe("i");
  });

  it("caps query length at 256", () => {
    expect(MAX_QUERY_LENGTH).toBe(256);
  });

  it("caps token count at 12", () => {
    expect(MAX_QUERY_TOKENS).toBe(12);
  });
});

describe("normalizeSearchQuery", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeSearchQuery("  hello  ")).toBe("hello");
  });

  it("lowercases the query", () => {
    expect(normalizeSearchQuery("Hello WORLD")).toBe("hello world");
  });

  it("returns an empty string for whitespace-only input", () => {
    expect(normalizeSearchQuery("   ")).toBe("");
  });

  it("caps the query at MAX_QUERY_LENGTH characters", () => {
    const result = normalizeSearchQuery("a".repeat(300));
    expect(result).toHaveLength(256);
    expect(result).toBe("a".repeat(256));
  });

  it("slices before trimming so leading whitespace counts toward the cap", () => {
    // First 256 chars are 2 spaces + 254 'a's; trailing 'z's are sliced off,
    // then the leading spaces are trimmed away.
    const input = "  " + "a".repeat(254) + "z".repeat(10);
    expect(normalizeSearchQuery(input)).toBe("a".repeat(254));
  });

  it("handles an already-normalized query unchanged", () => {
    expect(normalizeSearchQuery("node.js")).toBe("node.js");
  });
});

describe("tokenizeSearchQuery", () => {
  it("returns no tokens for an empty string", () => {
    expect(tokenizeSearchQuery("")).toEqual([]);
  });

  it("returns no tokens for whitespace only", () => {
    expect(tokenizeSearchQuery("     ")).toEqual([]);
  });

  it("splits on whitespace", () => {
    expect(tokenizeSearchQuery("hello world")).toEqual(["hello", "world"]);
  });

  it("drops tokens shorter than two characters", () => {
    expect(tokenizeSearchQuery("a b cd")).toEqual(["cd"]);
  });

  it("drops a trailing single-character token", () => {
    expect(tokenizeSearchQuery("ab c")).toEqual(["ab"]);
  });

  it("keeps a two-character token", () => {
    expect(tokenizeSearchQuery("ab")).toEqual(["ab"]);
  });

  it("lowercases token characters", () => {
    expect(tokenizeSearchQuery("Hello World")).toEqual(["hello", "world"]);
  });

  it("keeps + inside a token", () => {
    expect(tokenizeSearchQuery("c++")).toEqual(["c++"]);
  });

  it("keeps # inside a token", () => {
    expect(tokenizeSearchQuery("c#")).toEqual(["c#"]);
  });

  it("keeps . inside a token", () => {
    expect(tokenizeSearchQuery("node.js")).toEqual(["node.js"]);
  });

  it("keeps - inside a token", () => {
    expect(tokenizeSearchQuery("code-review")).toEqual(["code-review"]);
  });

  it("keeps all special characters together and lowercases them", () => {
    expect(tokenizeSearchQuery("C++ node.JS a-B")).toEqual([
      "c++",
      "node.js",
      "a-b",
    ]);
  });

  it("splits on symbols that are not token characters", () => {
    expect(tokenizeSearchQuery("hello@world")).toEqual(["hello", "world"]);
  });

  it("collapses runs of delimiters", () => {
    expect(tokenizeSearchQuery("ab   cd")).toEqual(["ab", "cd"]);
  });

  it("flushes the final token when it is not followed by a delimiter", () => {
    expect(tokenizeSearchQuery("ab cd ef")).toEqual(["ab", "cd", "ef"]);
  });

  it("caps the number of tokens at MAX_QUERY_TOKENS", () => {
    const words = Array.from({ length: 15 }, (_, i) => `w${i}z`);
    const result = tokenizeSearchQuery(words.join(" "));
    expect(result).toHaveLength(12);
    expect(result).toEqual([
      "w0z",
      "w1z",
      "w2z",
      "w3z",
      "w4z",
      "w5z",
      "w6z",
      "w7z",
      "w8z",
      "w9z",
      "w10z",
      "w11z",
    ]);
  });

  it("does not flush a trailing token once the cap is reached", () => {
    // Exactly 12 delimited tokens, then a 13th trailing token with no
    // delimiter after it — the trailing flush is skipped because the cap is hit.
    const twelve = Array.from({ length: 12 }, () => "ab").join(" ");
    const result = tokenizeSearchQuery(`${twelve} zz`);
    expect(result).toHaveLength(12);
    expect(result.every((token) => token === "ab")).toBe(true);
  });
});
