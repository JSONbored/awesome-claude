import { describe, expect, it } from "vitest";

import {
  activeInAppSavedSearches,
  buildSavedSearchAlerts,
  savedSearchAlertTargetId,
  savedSearchMatchesEntry,
  savedSearchQueryMatchesEntry,
} from "@/lib/saved-search-alerts";

describe("saved-search-alerts re-export surface", () => {
  it("keeps the public import path wired to the extracted lib", () => {
    expect(savedSearchAlertTargetId({ id: "demo" })).toBe("saved-search:demo");
    expect(
      activeInAppSavedSearches([
        {
          id: "x",
          label: "X",
          alerts: { enabled: true, channels: ["inapp"], cadence: "instant" },
        },
      ]),
    ).toHaveLength(1);
    expect(
      savedSearchQueryMatchesEntry(
        { category: "mcp", slug: "x", title: "Postgres MCP" },
        "postgres",
      ),
    ).toBe(true);
    expect(
      savedSearchMatchesEntry(
        { id: "s", label: "S", q: "postgres" },
        { category: "mcp", slug: "x", title: "Postgres MCP" },
      ),
    ).toBe(true);
    expect(
      buildSavedSearchAlerts(
        [
          {
            id: "s",
            label: "S",
            q: "postgres",
            alerts: { enabled: true, channels: ["inapp"], cadence: "instant" },
          },
        ],
        [],
        new Map(),
      ),
    ).toEqual([]);
  });
});
