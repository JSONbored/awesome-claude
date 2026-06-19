import { describe, expect, it } from "vitest";

import {
  communityDiscoveryScore,
  metadataCompletenessScore,
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

describe("metadataCompletenessScore", () => {
  it("returns 0 for an entry with no metadata", () => {
    expect(metadataCompletenessScore({})).toBe(0);
  });

  it("returns 100 for a fully-documented entry", () => {
    const score = metadataCompletenessScore({
      safetyNotes: "runs background worker",
      privacyNotes: "sends telemetry",
      sourceUrl: "https://github.com/user/repo",
      platforms: ["claude-code"],
      tags: ["automation"],
      cardDescription: "Short preview.",
      docsUrl: "https://docs.example.com",
      author: "Example Corp",
      prerequisites: ["Node.js 18+"],
      reviewed: true,
      claimed: true,
    });
    expect(score).toBe(100);
  });

  it("scores safety and privacy notes at 20 points each", () => {
    expect(metadataCompletenessScore({ safetyNotes: "x" })).toBe(20);
    expect(metadataCompletenessScore({ privacyNotes: "y" })).toBe(20);
    expect(metadataCompletenessScore({ safetyNotes: "x", privacyNotes: "y" })).toBe(40);
  });

  it("accepts either sourceUrl or repoUrl for the provenance check", () => {
    expect(metadataCompletenessScore({ sourceUrl: "https://github.com/x/y" })).toBe(15);
    expect(metadataCompletenessScore({ repoUrl: "https://github.com/x/y" })).toBe(15);
  });

  it("does not count empty arrays for platforms or tags", () => {
    expect(metadataCompletenessScore({ platforms: [], tags: [] })).toBe(0);
  });

  it("counts both reviewed and claimed as 2.5 each", () => {
    expect(metadataCompletenessScore({ reviewed: true })).toBe(2.5);
    expect(metadataCompletenessScore({ claimed: true })).toBe(2.5);
    expect(metadataCompletenessScore({ reviewed: true, claimed: true })).toBe(5);
  });

  it("score is always in the range [0, 100]", () => {
    const all = metadataCompletenessScore({
      safetyNotes: "x", privacyNotes: "y", sourceUrl: "x", platforms: ["a"],
      tags: ["t"], cardDescription: "d", docsUrl: "u", author: "a",
      prerequisites: ["p"], reviewed: true, claimed: true,
    });
    expect(all).toBeGreaterThanOrEqual(0);
    expect(all).toBeLessThanOrEqual(100);
    expect(metadataCompletenessScore({})).toBeGreaterThanOrEqual(0);
  });
});
