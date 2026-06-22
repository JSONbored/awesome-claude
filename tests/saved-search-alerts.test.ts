import { describe, expect, it } from "vitest";
import {
  activeInAppSavedSearches,
  buildSavedSearchAlerts,
  savedSearchMatchesEntry,
  savedSearchQueryMatchesEntry,
  type SavedSearchAlertEntry,
  type SavedSearchAlertSearch,
} from "@/lib/saved-search-alerts";

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

describe("saved-search in-app alert matching", () => {
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

  it("matches multi-token and aliased queries against entry metadata", () => {
    expect(savedSearchQueryMatchesEntry(entry, "postgres memory")).toBe(true);
    expect(savedSearchQueryMatchesEntry(entry, "repo memory")).toBe(true);
    expect(savedSearchQueryMatchesEntry(entry, "calendar memory")).toBe(false);
  });

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
      new Map([["mcp/postgres-memory", entry]]),
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
});
