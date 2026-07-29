import { describe, expect, it } from "vitest";

import { filterEntriesByQuery } from "../packages/mcp/src/registry-search-delegate-lib.js";
import { searchRegistry } from "../packages/mcp/src/registry-tool-orchestration-lib.js";

const entries = [
  {
    category: "mcp",
    slug: "postgres-bridge",
    title: "Postgres Bridge",
    description: "PostgreSQL database client for Claude Code",
    tags: ["database"],
    platforms: ["claude-code"],
  },
  {
    category: "skills",
    slug: "spreadsheet-helper",
    title: "Spreadsheet Helper",
    description: "CSV export utilities",
    tags: ["spreadsheet"],
    platforms: ["claude-code"],
  },
];

const artifactOptions = {
  readJsonArtifact: async () => ({ entries }),
};

describe("filterEntriesByQuery (#5643)", () => {
  it("keeps strict AND matches when every token hits", () => {
    const matched = filterEntriesByQuery(entries, "postgres client");
    expect(matched.map((entry) => entry.slug)).toEqual(["postgres-bridge"]);
  });

  it("falls back to token-OR when AND-match returns nothing", () => {
    const matched = filterEntriesByQuery(entries, "postgres spreadsheet");
    expect(matched.map((entry) => entry.slug).sort()).toEqual([
      "postgres-bridge",
      "spreadsheet-helper",
    ]);
  });

  it("returns all entries for an empty query", () => {
    expect(filterEntriesByQuery(entries, "")).toHaveLength(2);
  });
});

describe("searchRegistry query OR fallback (#5643)", () => {
  it("returns OR-fallback matches for multi-token queries", async () => {
    const result = await searchRegistry(
      { query: "postgres spreadsheet" },
      artifactOptions,
    );
    expect(result.ok).toBe(true);
    expect(
      result.entries.map((entry: { slug: string }) => entry.slug).sort(),
    ).toEqual(["postgres-bridge", "spreadsheet-helper"]);
  });
});
