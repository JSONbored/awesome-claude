import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  browseFreshnessDistributionState,
  entryAgeDays,
  freshnessBucketId,
} from "@/lib/browse-freshness-distribution-lib";

const NOW = "2026-07-10T00:00:00.000Z";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "tools",
    slug: "fixture",
    title: "Fixture",
    description: "Fixture description",
    author: "Author",
    tags: [],
    platforms: ["claude-code"],
    installType: "manual",
    trust: "review",
    source: "unverified",
    dateAdded: "2026-07-01",
    ...overrides,
  } as Entry;
}

/** Build an entry whose dateAdded is `days` before NOW. */
function agedEntry(
  slug: string,
  days: number,
  overrides: Partial<Entry> = {},
): Entry {
  const added = new Date(Date.parse(NOW) - days * 24 * 60 * 60 * 1000);
  return entry({
    slug,
    dateAdded: added.toISOString().slice(0, 10),
    ...overrides,
  });
}

describe("entryAgeDays", () => {
  it("computes whole days between dateAdded and now", () => {
    expect(entryAgeDays("2026-07-01T00:00:00.000Z", NOW)).toBe(9);
  });

  it("clamps future dates to zero", () => {
    expect(entryAgeDays("2026-08-01T00:00:00.000Z", NOW)).toBe(0);
  });

  it("returns zero for unparseable dates", () => {
    expect(entryAgeDays("not-a-date", NOW)).toBe(0);
    expect(entryAgeDays("2026-07-01", "not-a-date")).toBe(0);
  });
});

describe("freshnessBucketId", () => {
  it("maps ages to buckets at the boundaries", () => {
    expect(freshnessBucketId(0)).toBe("fresh");
    expect(freshnessBucketId(30)).toBe("fresh");
    expect(freshnessBucketId(31)).toBe("recent");
    expect(freshnessBucketId(90)).toBe("recent");
    expect(freshnessBucketId(91)).toBe("aging");
    expect(freshnessBucketId(180)).toBe("aging");
    expect(freshnessBucketId(181)).toBe("stale");
  });
});

describe("browseFreshnessDistributionState", () => {
  it("hides the panel for fewer than two entries", () => {
    expect(browseFreshnessDistributionState([], NOW).showPanel).toBe(false);
    expect(
      browseFreshnessDistributionState([agedEntry("a", 5)], NOW).showPanel,
    ).toBe(false);
  });

  it("buckets entries by age with percentages summing to 100", () => {
    const entries = [
      agedEntry("fresh", 10),
      agedEntry("recent", 60),
      agedEntry("aging", 120),
      agedEntry("stale", 400),
    ];
    const state = browseFreshnessDistributionState(entries, NOW);
    expect(state.showPanel).toBe(true);
    expect(state.scannedCount).toBe(4);
    const byId = Object.fromEntries(state.buckets.map((b) => [b.id, b]));
    expect(byId.fresh?.count).toBe(1);
    expect(byId.recent?.count).toBe(1);
    expect(byId.aging?.count).toBe(1);
    expect(byId.stale?.count).toBe(1);
    expect(state.buckets.reduce((sum, b) => sum + b.percent, 0)).toBe(100);
    expect(state.buckets.map((b) => b.id)).toEqual([
      "fresh",
      "recent",
      "aging",
      "stale",
    ]);
  });

  it("keeps fresh + recent in freshCount and only >180d in staleCount", () => {
    const entries = [
      agedEntry("a", 5),
      agedEntry("b", 45),
      agedEntry("c", 200),
      agedEntry("d", 300),
    ];
    const state = browseFreshnessDistributionState(entries, NOW);
    expect(state.freshCount).toBe(2);
    expect(state.staleCount).toBe(2);
  });

  it("computes a median age", () => {
    const entries = [
      agedEntry("a", 10),
      agedEntry("b", 20),
      agedEntry("c", 60),
    ];
    expect(browseFreshnessDistributionState(entries, NOW).medianAgeDays).toBe(
      20,
    );
  });

  it("flags the oldest aging/stale entries with verification status, newest excluded", () => {
    const entries = [
      agedEntry("fresh", 5),
      agedEntry("old-verified", 300, { verifiedAt: "2026-01-01" }),
      agedEntry("older", 500),
    ];
    const state = browseFreshnessDistributionState(entries, NOW);
    expect(state.staleEntries.map((flag) => flag.entryRef)).toEqual([
      "tools/older",
      "tools/old-verified",
    ]);
    expect(state.staleEntries[0]?.ageDays).toBe(500);
    expect(state.staleEntries[1]?.verified).toBe(true);
    expect(state.staleEntries[0]?.verified).toBe(false);
  });

  it("reports a broadly-fresh headline when nothing is aging or stale", () => {
    const entries = [agedEntry("a", 5), agedEntry("b", 40)];
    const state = browseFreshnessDistributionState(entries, NOW);
    expect(state.heading).toContain("broadly fresh");
    expect(state.staleEntries).toEqual([]);
  });

  it("headlines the aging/stale share when it dominates", () => {
    const entries = [
      agedEntry("a", 200),
      agedEntry("b", 300),
      agedEntry("c", 5),
    ];
    const state = browseFreshnessDistributionState(entries, NOW);
    expect(state.heading).toContain("%");
    expect(state.summary).toContain("Re-verify");
  });

  it("respects the scannedCount cap", () => {
    const entries = Array.from({ length: 20 }, (_, i) => agedEntry(`e${i}`, i));
    const state = browseFreshnessDistributionState(entries, NOW, 5);
    expect(state.scannedCount).toBe(5);
  });
});
