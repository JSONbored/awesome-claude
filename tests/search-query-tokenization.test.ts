import { describe, expect, it } from "vitest";

import {
  MAX_QUERY_LENGTH,
  MAX_QUERY_TOKENS,
  normalizeSearchQuery,
  tokenizeSearchQuery,
} from "../apps/web/src/lib/search-query-tokenization";

describe("search query tokenization", () => {
  it("normalizes query length and casing", () => {
    expect(normalizeSearchQuery("  Browser  ")).toBe("browser");
    expect(
      normalizeSearchQuery(` ${"a".repeat(300)} `).length,
    ).toBeLessThanOrEqual(MAX_QUERY_LENGTH);
  });

  it("tokenizes without materializing split arrays on delimiter runs", () => {
    expect(tokenizeSearchQuery("postgres memory")).toEqual([
      "postgres",
      "memory",
    ]);
    expect(tokenizeSearchQuery("browser playwright")).toEqual([
      "browser",
      "playwright",
    ]);
    expect(tokenizeSearchQuery(",".repeat(10_000))).toEqual([]);
    expect(
      tokenizeSearchQuery(`${"browser ".repeat(20)}${"x,".repeat(10_000)}`),
    ).toHaveLength(MAX_QUERY_TOKENS);
    expect(
      tokenizeSearchQuery(`${"browser ".repeat(20)}${"x,".repeat(10_000)}`)[0],
    ).toBe("browser");
  });

  it("caps token count", () => {
    const tokens = tokenizeSearchQuery(
      "alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu",
    );
    expect(tokens).toHaveLength(MAX_QUERY_TOKENS);
    expect(tokens[0]).toBe("alpha");
    expect(tokens.at(-1)).toBe("mu");
  });
});
