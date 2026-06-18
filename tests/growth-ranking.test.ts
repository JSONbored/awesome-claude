import { describe, expect, it } from "vitest";

import {
  communityDiscoveryScore,
  totalIntentCount,
} from "../apps/web/src/lib/growth-ranking";

describe("growth ranking", () => {
  it("only uses maintainer-controlled trust metadata for discovery ranking", () => {
    const trustedEntryScore = communityDiscoveryScore({
      communitySignals: { used: 0, works: 0, broken: 99 },
      intentCounts: { copy: 0, open: 0, install: 0, download: 0, vote: 0 },
      votes: 0,
      firstPartyPackage: true,
      productionVerified: true,
    });
    const forgedEngagementScore = communityDiscoveryScore({
      communitySignals: { used: 200, works: 200, broken: 0 },
      intentCounts: {
        copy: 200,
        open: 200,
        install: 200,
        download: 200,
        vote: 200,
      },
      votes: 200,
    });

    expect(trustedEntryScore).toBe(4);
    expect(forgedEngagementScore).toBe(0);
  });

  it("still summarizes intent actions for non-ranking analytics", () => {
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
