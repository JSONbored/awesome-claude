import { describe, expect, it } from "vitest";

import { hubHighlights, hubStats, trustPosture } from "@/lib/hub-highlights";
import type { Entry } from "@/types/registry";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "mcp",
    slug: "demo",
    title: "Demo",
    description: "Example",
    trust: "review",
    source: "unverified",
    platforms: [],
    tags: [],
    dateAdded: "2026-01-01",
    ...overrides,
  } as Entry;
}

describe("hub-highlights re-export surface", () => {
  it("keeps the public import path wired to the extracted lib", () => {
    const entries = [
      entry({
        slug: "a",
        trust: "trusted",
        source: "first-party",
        dateAdded: "2026-01-02",
      }),
      entry({ slug: "b", dateAdded: "2026-01-01" }),
    ];
    expect(hubHighlights(entries).length).toBeGreaterThan(0);
    expect(hubStats(entries).some((stat) => stat.key === "trusted")).toBe(true);
    expect(trustPosture(entries)).toEqual({ trusted: 1, pct: 50 });
  });
});
