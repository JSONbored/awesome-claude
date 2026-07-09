import { describe, expect, it } from "vitest";

import { savedSearchQueryFromParams } from "../apps/web/src/lib/saved-search-query-lib";

describe("savedSearchQueryFromParams", () => {
  it("maps each recognized param", () => {
    const q = savedSearchQueryFromParams(
      new URLSearchParams({
        q: "mcp",
        category: "mcp",
        trust: "verified",
        source: "github",
        platform: "cursor",
      }),
    );
    expect(q).toEqual({
      q: "mcp",
      category: "mcp",
      trust: "verified",
      source: "github",
      platform: "cursor",
    });
  });

  it("leaves absent params undefined and ignores unknown ones", () => {
    const q = savedSearchQueryFromParams(
      new URLSearchParams({ q: "agents", extra: "x" }),
    );
    expect(q).toEqual({
      q: "agents",
      category: undefined,
      trust: undefined,
      source: undefined,
      platform: undefined,
    });
  });
});
