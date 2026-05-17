import { describe, expect, it } from "vitest";

import {
  communityDiscoveryScore,
  totalIntentCount,
} from "../apps/web/src/lib/growth-ranking";

describe("growth ranking", () => {
  it("weights aggregate community and intent signals without requiring GitHub stats", () => {
    const activeEntryScore = communityDiscoveryScore({
      communitySignals: { used: 2, works: 2, broken: 0 },
      intentCounts: { copy: 3, open: 5, install: 2, download: 1, vote: 0 },
      votes: 4,
      firstPartyPackage: true,
      productionVerified: true,
    });
    const staleEntryScore = communityDiscoveryScore({
      communitySignals: { used: 1, works: 0, broken: 2 },
      intentCounts: { copy: 1, open: 1, install: 0, download: 0, vote: 0 },
      votes: 0,
    });

    expect(activeEntryScore).toBeGreaterThan(staleEntryScore);
    expect(staleEntryScore).toBeLessThan(0);
  });

  it("counts install and download actions more heavily than passive opens", () => {
    expect(
      totalIntentCount({
        copy: 1,
        open: 1,
        install: 1,
        download: 1,
        vote: 1,
      }),
    ).toBe(8);
  });
});
