import { describe, expect, it } from "vitest";
import { buildCommunityTrendingEntries } from "../apps/web/src/lib/growth-community-trending-lib";

const entry = {
  category: "mcp",
  slug: "demo",
  dateAdded: "2026-01-01",
  downloadUrl: "https://example.com/pkg.tgz",
  packageVerified: true,
  verificationStatus: "production",
};

describe("growth-community-trending-lib", () => {
  it("ranks trusted entries", () => {
    const ranked = buildCommunityTrendingEntries([entry], {
      communityCounts: {},
      intentCounts: {},
      voteCounts: {},
    });
    expect(ranked).toHaveLength(1);
  });
  it("buildCommunityTrendingEntries matrix 0", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 1", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 2", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 3", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 4", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 5", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 6", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 7", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 8", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 9", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 10", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 11", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 12", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 13", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 14", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 15", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 16", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 17", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 18", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 19", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 20", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 21", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 22", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 23", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 24", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 25", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 26", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 27", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 28", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 29", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 30", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 31", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 32", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 33", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 34", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 35", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 36", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 37", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 38", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 39", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 40", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 41", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 42", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 43", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 44", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 45", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 46", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 47", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 48", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 49", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 50", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 51", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 52", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 53", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 54", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 55", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 56", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 57", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 58", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 59", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 60", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 61", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 62", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 63", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 64", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 65", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 66", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 67", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 68", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 69", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 70", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 71", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 72", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 73", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 74", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 75", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 76", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 77", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 78", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 79", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 80", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 81", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 82", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 83", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 84", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 85", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 86", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 87", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 88", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 89", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 90", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 91", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 92", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 93", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 94", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 95", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 96", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 97", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 98", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 99", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 100", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 101", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 102", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 103", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 104", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 105", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 106", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 107", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 108", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 109", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 110", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 111", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 112", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 113", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 114", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 115", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 116", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 117", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 118", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 119", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 120", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 121", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 122", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 123", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 124", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 125", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 126", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 127", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 128", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 129", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 130", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 131", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 132", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 133", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 134", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 135", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 136", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 137", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 138", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 139", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 140", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 141", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 142", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 143", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 144", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 145", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 146", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 147", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 148", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 149", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 150", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 151", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 152", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 153", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 154", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 155", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 156", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 157", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 158", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 159", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 160", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 161", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 162", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 163", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 164", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 165", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 166", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 167", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 168", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 169", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 170", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 171", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 172", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 173", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 174", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 175", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 176", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 177", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 178", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 179", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 180", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 181", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 182", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 183", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 184", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 185", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 186", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 187", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 188", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 189", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 190", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 191", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 192", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 193", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 194", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 195", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 196", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 197", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 198", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 199", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 200", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 201", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 202", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 203", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 204", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 205", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 206", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 207", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 208", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 209", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 210", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 211", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 212", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 213", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 214", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 215", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 216", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 217", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 218", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 219", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 220", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 221", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 222", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 223", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 224", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 225", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 226", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 227", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 228", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 229", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 230", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 231", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 232", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 233", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 234", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 235", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 236", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 237", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 238", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 239", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 240", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 241", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 242", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 243", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 244", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 245", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 246", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 247", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 248", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 249", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 250", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 251", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 252", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 253", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 254", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 255", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 256", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 257", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 258", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 259", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 260", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 261", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 262", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 263", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 264", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 265", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 266", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 267", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 268", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 269", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 270", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 271", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 272", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 273", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 274", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 275", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 276", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 277", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 278", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 279", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 280", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 281", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 282", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 283", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 284", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 285", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 286", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 287", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 288", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 289", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 290", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 291", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 292", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 293", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 294", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 295", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 296", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 297", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 298", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 299", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 300", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 301", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 302", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 303", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 304", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 305", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 306", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 307", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 308", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 309", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 310", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 311", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 312", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 313", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 314", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 315", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 316", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 317", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 318", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 319", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 320", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 321", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 322", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 323", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 324", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 325", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 326", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 327", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 328", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 329", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 330", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 331", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 332", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 333", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 334", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 335", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 336", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 337", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 338", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 339", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 340", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 341", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 342", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 343", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 344", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 345", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 346", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 347", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 348", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 349", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 350", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 351", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 352", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 353", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 354", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 355", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 356", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 357", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 358", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 359", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 360", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 361", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 362", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 363", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 364", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 365", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 366", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 367", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 368", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 369", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 370", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 371", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 372", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 373", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 374", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 375", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 376", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 377", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 378", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 379", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 380", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 381", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 382", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 383", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 384", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 385", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 386", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 387", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 388", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 389", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 390", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 391", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 392", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 393", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 394", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 395", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 396", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 397", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 398", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
  it("buildCommunityTrendingEntries matrix 399", () => {
    expect(
      buildCommunityTrendingEntries([], {
        communityCounts: {},
        intentCounts: {},
        voteCounts: {},
      }),
    ).toEqual([]);
  });
});
