import { describe, expect, it } from "vitest";

import {
  categoryFeedAliases,
  platformFeedAliases,
} from "../apps/web/src/lib/registry-feed-aliases-lib";

describe("categoryFeedAliases", () => {
  it("maps each category to its feed path", () => {
    expect(
      categoryFeedAliases([{ category: "agents" }, { category: "mcp" }]),
    ).toEqual({
      agents: "/data/feeds/categories/agents.json",
      mcp: "/data/feeds/categories/mcp.json",
    });
  });

  it("returns an empty map for no categories", () => {
    expect(categoryFeedAliases([])).toEqual({});
  });
});

describe("platformFeedAliases", () => {
  it("maps each definition's slug to its platform feed path", () => {
    const aliases = platformFeedAliases([
      { platform: "claude-code", slug: "claude-code" },
    ]);
    expect(Object.keys(aliases)).toEqual(["claude-code"]);
    expect(aliases["claude-code"]).toMatch(
      /^\/data\/feeds\/platforms\/.+\.json$/,
    );
  });

  it("returns an empty map for no definitions", () => {
    expect(platformFeedAliases([])).toEqual({});
  });
});
