import { describe, expect, it } from "vitest";

import {
  matchesRegistryQuery,
  scoreRegistrySearchEntry,
} from "../packages/mcp/src/search-ranking.js";

function makeEntry(overrides: Record<string, unknown> = {}) {
  return {
    category: "mcp",
    slug: "browser-bridge",
    title: "Browser Bridge",
    description: "Runs Playwright automation for Claude Code sessions.",
    tags: ["browser-automation"],
    keywords: ["playwright", "browser automation"],
    platforms: ["claude-code"],
    ...overrides,
  };
}

describe("MCP registry search ranking aliases", () => {
  it("matches multi-token registry queries regardless of order", () => {
    const entry = makeEntry();

    expect(matchesRegistryQuery(entry, "browser playwright")).toBe(true);
    expect(matchesRegistryQuery(entry, "playwright browser")).toBe(true);
    expect(matchesRegistryQuery(entry, "spreadsheet export")).toBe(false);
  });

  it("expands shorthand aliases such as gh and automation", () => {
    const entry = makeEntry({
      title: "Repository Review MCP",
      tags: ["github", "code-review"],
      keywords: ["repository review"],
    });

    expect(matchesRegistryQuery(entry, "gh review")).toBe(true);
    expect(
      matchesRegistryQuery(
        makeEntry({
          title: "QA Automation MCP",
          tags: ["testing", "qa"],
          keywords: ["automated browser checks"],
        }),
        "automation qa",
      ),
    ).toBe(true);
  });

  it("does not inherit prototype property names as alias keys", () => {
    const entry = makeEntry({
      title: "Constructor Fixture",
      keywords: ["constructor"],
    });

    expect(matchesRegistryQuery(entry, "constructor")).toBe(true);
    expect(matchesRegistryQuery(entry, "constructor spreadsheet")).toBe(false);
  });

  it("scores ranked registry search using alias expansion", () => {
    const entry = makeEntry();
    const ranked = scoreRegistrySearchEntry(entry, "browser playwright");

    expect(ranked.score).toBeGreaterThan(0);
    expect(scoreRegistrySearchEntry(entry, ",".repeat(10_000))).toEqual({
      score: 0,
      reasons: [],
    });
  });
});
