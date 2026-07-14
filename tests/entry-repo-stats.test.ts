import { describe, expect, it } from "vitest";

import { entryRepoStatsEntry } from "../scripts/lib/entry-repo-stats.mjs";

describe("entryRepoStatsEntry", () => {
  it("maps a payload to a keyed repo-stats pair", () => {
    expect(
      entryRepoStatsEntry({
        entry: {
          category: "mcp",
          slug: "example",
          githubStars: 12,
          githubForks: 3,
          repoUpdatedAt: "2026-01-01",
        },
      }),
    ).toEqual([
      "mcp:example",
      { stars: 12, forks: 3, updatedAt: "2026-01-01" },
    ]);
  });

  it("keeps a zero-count stat but drops wrongly-typed ones", () => {
    expect(
      entryRepoStatsEntry({
        entry: { category: "agents", slug: "a", githubStars: 0 },
      }),
    ).toEqual([
      "agents:a",
      { stars: 0, forks: undefined, updatedAt: undefined },
    ]);
  });

  it("leaves each stat undefined when it has the wrong type", () => {
    expect(
      entryRepoStatsEntry({
        entry: {
          category: "hooks",
          slug: "h",
          githubStars: "12",
          githubForks: null,
          repoUpdatedAt: 20260101,
        },
      }),
    ).toEqual([
      "hooks:h",
      { stars: undefined, forks: undefined, updatedAt: undefined },
    ]);
  });

  it("returns null when there is no usable entry", () => {
    expect(entryRepoStatsEntry(null)).toBeNull();
    expect(entryRepoStatsEntry({})).toBeNull();
    expect(entryRepoStatsEntry({ entry: { slug: "a" } })).toBeNull();
    expect(entryRepoStatsEntry({ entry: { category: "mcp" } })).toBeNull();
  });
});
