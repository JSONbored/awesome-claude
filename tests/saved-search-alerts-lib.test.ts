import { describe, expect, it } from "vitest";

import {
  savedSearchAlertTargetId,
  activeInAppSavedSearches,
  savedSearchQueryMatchesEntry,
  savedSearchMatchesEntry,
  buildSavedSearchAlerts,
  type SavedSearchAlertEntry,
  type SavedSearchAlertSearch,
} from "../apps/web/src/lib/saved-search-alerts-lib";

const entry: SavedSearchAlertEntry = {
  category: "mcp",
  slug: "postgres-memory",
  title: "Postgres Memory MCP",
  description:
    "A source-backed memory server for Postgres-backed Claude workflows.",
  author: "Example Maintainer",
  tags: ["database", "memory"],
  keywords: ["postgres mcp", "repository memory"],
  platforms: ["claude-code", "claude-desktop"],
  trust: "trusted",
  source: "source-backed",
};

function search(
  overrides: Partial<SavedSearchAlertSearch> = {},
): SavedSearchAlertSearch {
  return {
    id: "s-1",
    label: "Postgres memory",
    q: "postgres memory",
    alerts: { enabled: true, channels: ["inapp"], cadence: "instant" },
    ...overrides,
  };
}

describe("savedSearchAlertTargetId", () => {
  it("prefixes saved-search ids for alert routing", () => {
    expect(savedSearchAlertTargetId({ id: "weekly-mcp" })).toBe(
      "saved-search:weekly-mcp",
    );
  });
});

describe("activeInAppSavedSearches", () => {
  it("only activates searches with enabled in-app alerts", () => {
    expect(
      activeInAppSavedSearches([
        search(),
        search({
          id: "email",
          alerts: { enabled: true, channels: ["email"], cadence: "daily" },
        }),
        search({
          id: "off",
          alerts: { enabled: false, channels: ["inapp"], cadence: "daily" },
        }),
      ]).map((item) => item.id),
    ).toEqual(["s-1"]);
  });

  it("skips searches with alerts disabled or missing channels", () => {
    expect(activeInAppSavedSearches([search({ alerts: undefined })])).toEqual(
      [],
    );
    expect(
      activeInAppSavedSearches([
        search({ alerts: { enabled: true, channels: [], cadence: "daily" } }),
      ]),
    ).toEqual([]);
    expect(
      activeInAppSavedSearches([
        search({
          alerts: { enabled: false, channels: ["inapp"], cadence: "daily" },
        }),
      ]),
    ).toEqual([]);
  });
});

describe("savedSearchQueryMatchesEntry", () => {
  it("matches multi-token and aliased queries against entry metadata", () => {
    expect(savedSearchQueryMatchesEntry(entry, "postgres memory")).toBe(true);
    expect(savedSearchQueryMatchesEntry(entry, "repo memory")).toBe(true);
    expect(savedSearchQueryMatchesEntry(entry, "calendar memory")).toBe(false);
    expect(savedSearchQueryMatchesEntry(entry, "")).toBe(true);
    expect(savedSearchQueryMatchesEntry(entry, undefined)).toBe(true);
    expect(savedSearchQueryMatchesEntry(entry, ",,,")).toBe(false);
    expect(savedSearchQueryMatchesEntry(entry, "mcp")).toBe(true);
  });

  it("uses the shared alias map for saved-search query expansion", () => {
    const automationEntry: SavedSearchAlertEntry = {
      ...entry,
      title: "QA Automation MCP",
      tags: ["testing", "qa"],
      keywords: ["automated browser checks"],
    };

    expect(savedSearchQueryMatchesEntry(automationEntry, "automation qa")).toBe(
      true,
    );
    expect(savedSearchQueryMatchesEntry(automationEntry, "design ux")).toBe(
      false,
    );
  });

  it("does not treat prototype property names as alias keys", () => {
    const oddEntry: SavedSearchAlertEntry = {
      ...entry,
      title: "Constructor Fixture",
      keywords: ["constructor"],
    };

    expect(savedSearchQueryMatchesEntry(oddEntry, "constructor")).toBe(true);
    expect(
      savedSearchQueryMatchesEntry(oddEntry, "constructor spreadsheet"),
    ).toBe(false);
  });

  it("matches short queries via word-prefix heuristics", () => {
    const shortEntry: SavedSearchAlertEntry = {
      category: "skills",
      slug: "ai",
      title: "AI Helper",
      tags: ["ai"],
    };
    expect(savedSearchQueryMatchesEntry(shortEntry, "ai")).toBe(true);
    expect(savedSearchQueryMatchesEntry(shortEntry, "xx")).toBe(false);
  });

  it("requires every expanded token to match for multi-word queries", () => {
    expect(savedSearchQueryMatchesEntry(entry, "postgres calendar")).toBe(
      false,
    );
    expect(savedSearchQueryMatchesEntry(entry, "postgres repository")).toBe(
      true,
    );
  });

  it("indexes optional entry metadata fields into the searchable haystack", () => {
    const richEntry: SavedSearchAlertEntry = {
      category: "hooks",
      slug: "lint-hook",
      title: "Lint Hook",
      cardDescription: "Runs eslint on save",
      author: "Ada Lovelace",
      trust: "trusted",
      source: "first-party",
      platforms: ["cursor"],
      tags: ["lint"],
      keywords: ["eslint"],
    };
    expect(savedSearchQueryMatchesEntry(richEntry, "eslint")).toBe(true);
    expect(savedSearchQueryMatchesEntry(richEntry, "ada lovelace")).toBe(true);
    expect(savedSearchQueryMatchesEntry(richEntry, "runs eslint on save")).toBe(
      true,
    );
    expect(savedSearchQueryMatchesEntry(richEntry, "first-party")).toBe(true);
  });

  it("still matches entries that omit optional tag and keyword arrays", () => {
    const sparseEntry: SavedSearchAlertEntry = {
      category: "mcp",
      slug: "sparse",
      title: "Sparse MCP",
      platforms: ["claude-code"],
    };
    expect(savedSearchQueryMatchesEntry(sparseEntry, "sparse")).toBe(true);
    expect(savedSearchQueryMatchesEntry(sparseEntry, "claude-code")).toBe(true);
  });

  it("matches direct haystack substrings for queries longer than two characters", () => {
    expect(savedSearchQueryMatchesEntry(entry, "postgres-backed")).toBe(true);
    expect(savedSearchQueryMatchesEntry(entry, "example maintainer")).toBe(
      true,
    );
  });
});

describe("savedSearchMatchesEntry", () => {
  it("honors category, platform, trust, and source filters", () => {
    expect(
      savedSearchMatchesEntry(
        search({ category: "mcp", platform: "claude-code" }),
        entry,
      ),
    ).toBe(true);
    expect(savedSearchMatchesEntry(search({ category: "skills" }), entry)).toBe(
      false,
    );
    expect(savedSearchMatchesEntry(search({ platform: "cursor" }), entry)).toBe(
      false,
    );
    expect(savedSearchMatchesEntry(search({ trust: "review" }), entry)).toBe(
      false,
    );
    expect(savedSearchMatchesEntry(search({ source: "external" }), entry)).toBe(
      false,
    );
  });

  it("passes when optional filters are unset", () => {
    expect(
      savedSearchMatchesEntry(
        search({
          category: undefined,
          platform: undefined,
          trust: undefined,
          source: undefined,
          q: "postgres",
        }),
        entry,
      ),
    ).toBe(true);
  });

  it("rejects entries missing a required platform", () => {
    const noPlatforms: SavedSearchAlertEntry = {
      category: "mcp",
      slug: "x",
      title: "X",
      platforms: [],
    };
    expect(
      savedSearchMatchesEntry(search({ platform: "claude-code" }), noPlatforms),
    ).toBe(false);

    const undefinedPlatforms: SavedSearchAlertEntry = {
      category: "mcp",
      slug: "x",
      title: "X",
    };
    expect(
      savedSearchMatchesEntry(
        search({ platform: "claude-code" }),
        undefinedPlatforms,
      ),
    ).toBe(false);
  });

  it("still applies query matching after structural filters pass", () => {
    expect(savedSearchMatchesEntry(search({ q: "missing-term" }), entry)).toBe(
      false,
    );
    expect(savedSearchMatchesEntry(search({ q: undefined }), entry)).toBe(true);
  });
});

describe("buildSavedSearchAlerts", () => {
  const entries = new Map([["mcp/postgres-memory", entry]]);

  it("materializes matching public entry events into saved-search alerts", () => {
    const alerts = buildSavedSearchAlerts(
      [search()],
      [
        {
          id: "evt-1",
          kind: "entry",
          category: "mcp",
          slug: "postgres-memory",
          action: "updated",
          date: "2026-06-18T10:00:00.000Z",
          title: "Postgres Memory MCP",
        },
      ],
      entries,
    );

    expect(alerts).toEqual([
      expect.objectContaining({
        id: "saved-search:s-1:mcp/postgres-memory:2026-06-18T10:00:00.000Z:updated",
        targetId: "saved-search:s-1",
        kind: "saved-search",
        title: "Postgres Memory MCP updated",
        body: 'Matches saved search "Postgres memory".',
        severity: "info",
        href: "/entry/mcp/postgres-memory",
        date: "2026-06-18T10:00:00.000Z",
      }),
    ]);
  });

  it("does not alert when the changed entry detail is unavailable", () => {
    expect(
      buildSavedSearchAlerts(
        [search()],
        [
          {
            kind: "entry",
            category: "mcp",
            slug: "missing",
            action: "updated",
            date: "2026-06-18T10:00:00.000Z",
          },
        ],
        new Map(),
      ),
    ).toEqual([]);
  });

  it("returns no alerts when no searches are active in-app", () => {
    expect(
      buildSavedSearchAlerts(
        [
          search({
            alerts: { enabled: false, channels: ["inapp"], cadence: "daily" },
          }),
        ],
        [
          {
            kind: "entry",
            category: "mcp",
            slug: "postgres-memory",
            action: "updated",
            date: "2026-06-18T10:00:00.000Z",
          },
        ],
        entries,
      ),
    ).toEqual([]);
  });

  it("skips non-entry events and events missing refs or dates", () => {
    expect(
      buildSavedSearchAlerts(
        [search()],
        [
          {
            kind: "vote",
            category: "mcp",
            slug: "postgres-memory",
            date: "2026-06-18",
          },
          { kind: "entry", category: "mcp", slug: "postgres-memory" },
          { kind: "entry", category: "mcp", date: "2026-06-18" },
        ],
        entries,
      ),
    ).toEqual([]);
  });

  it("maps removed actions to warning severity and added actions to info", () => {
    const removed = buildSavedSearchAlerts(
      [search()],
      [
        {
          kind: "entry",
          category: "mcp",
          slug: "postgres-memory",
          action: "removed",
          date: "2026-06-18T10:00:00.000Z",
        },
      ],
      entries,
    );
    expect(removed[0]?.severity).toBe("warning");
    expect(removed[0]?.title).toBe("Postgres Memory MCP removed");

    const added = buildSavedSearchAlerts(
      [search()],
      [
        {
          kind: "entry",
          category: "mcp",
          slug: "postgres-memory",
          action: "added",
          date: "2026-06-18T09:00:00.000Z",
        },
      ],
      entries,
    );
    expect(added[0]?.severity).toBe("info");
    expect(added[0]?.title).toBe("Postgres Memory MCP added");
  });

  it("defaults unknown actions to updated", () => {
    const alerts = buildSavedSearchAlerts(
      [search()],
      [
        {
          kind: "entry",
          category: "mcp",
          slug: "postgres-memory",
          action: "refreshed",
          date: "2026-06-18T10:00:00.000Z",
        },
      ],
      entries,
    );
    expect(alerts[0]?.title).toBe("Postgres Memory MCP updated");
    expect(alerts[0]?.id).toContain(":updated");
  });

  it("falls back to the entry title when the event title is absent", () => {
    const alerts = buildSavedSearchAlerts(
      [search()],
      [
        {
          kind: "entry",
          category: "mcp",
          slug: "postgres-memory",
          action: "updated",
          date: "2026-06-18T10:00:00.000Z",
        },
      ],
      entries,
    );
    expect(alerts[0]?.title).toBe("Postgres Memory MCP updated");
  });

  it("sorts alerts newest-first by event date", () => {
    const alerts = buildSavedSearchAlerts(
      [search()],
      [
        {
          kind: "entry",
          category: "mcp",
          slug: "postgres-memory",
          action: "updated",
          date: "2026-06-17T10:00:00.000Z",
        },
        {
          kind: "entry",
          category: "mcp",
          slug: "postgres-memory",
          action: "added",
          date: "2026-06-19T10:00:00.000Z",
        },
      ],
      entries,
    );
    expect(alerts.map((alert) => alert.date)).toEqual([
      "2026-06-19T10:00:00.000Z",
      "2026-06-17T10:00:00.000Z",
    ]);
  });

  it("emits one alert per active saved search that matches the entry", () => {
    const alerts = buildSavedSearchAlerts(
      [
        search({ id: "a", label: "Alpha" }),
        search({ id: "b", label: "Beta", q: "postgres" }),
        search({
          id: "c",
          label: "Gamma",
          q: "postgres",
          alerts: { enabled: false, channels: ["inapp"], cadence: "daily" },
        }),
      ],
      [
        {
          kind: "entry",
          category: "mcp",
          slug: "postgres-memory",
          action: "updated",
          date: "2026-06-18T10:00:00.000Z",
        },
      ],
      entries,
    );

    expect(alerts.map((alert) => alert.targetId).sort()).toEqual([
      "saved-search:a",
      "saved-search:b",
    ]);
    expect(
      alerts.every((alert) => alert.body.includes("Matches saved search")),
    ).toBe(true);
  });

  it("skips alerts when the saved search no longer matches the entry", () => {
    expect(
      buildSavedSearchAlerts(
        [search({ q: "calendar" })],
        [
          {
            kind: "entry",
            category: "mcp",
            slug: "postgres-memory",
            action: "updated",
            date: "2026-06-18T10:00:00.000Z",
          },
        ],
        entries,
      ),
    ).toEqual([]);
  });
});

describe("combined saved-search alert scenarios", () => {
  it("handles multiple entries and searches in one batch", () => {
    const skillEntry: SavedSearchAlertEntry = {
      category: "skills",
      slug: "browser-qa",
      title: "Browser QA Skill",
      tags: ["automation", "qa"],
      platforms: ["claude-code"],
      trust: "trusted",
      source: "source-backed",
    };
    const entries = new Map<string, SavedSearchAlertEntry>([
      ["mcp/postgres-memory", entry],
      ["skills/browser-qa", skillEntry],
    ]);

    const alerts = buildSavedSearchAlerts(
      [
        search({ id: "mcp-watch", label: "MCP watch", q: "postgres" }),
        search({
          id: "skills-watch",
          label: "Skills watch",
          category: "skills",
          q: "automation",
        }),
      ],
      [
        {
          kind: "entry",
          category: "mcp",
          slug: "postgres-memory",
          action: "updated",
          date: "2026-06-18T12:00:00.000Z",
        },
        {
          kind: "entry",
          category: "skills",
          slug: "browser-qa",
          action: "added",
          date: "2026-06-18T11:00:00.000Z",
        },
      ],
      entries,
    );

    expect(alerts).toHaveLength(2);
    expect(alerts[0]?.href).toBe("/entry/mcp/postgres-memory");
    expect(alerts[1]?.href).toBe("/entry/skills/browser-qa");
    expect(alerts[0]?.targetId).toBe("saved-search:mcp-watch");
    expect(alerts[1]?.targetId).toBe("saved-search:skills-watch");
  });
});
