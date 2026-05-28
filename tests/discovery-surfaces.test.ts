import { describe, expect, it } from "vitest";

import {
  buildDiscoverySurfaceLists,
  type GrowthSurfaceEntry,
} from "../apps/web/src/lib/growth-surface-rules";

function entry(
  slug: string,
  overrides: Partial<GrowthSurfaceEntry> = {},
): GrowthSurfaceEntry {
  return {
    category: "skills",
    slug,
    dateAdded: "2026-05-01",
    trustSignals: { sourceStatus: "missing" },
    ...overrides,
  };
}

function slugs(entries: GrowthSurfaceEntry[]) {
  return entries.map((item) => item.slug);
}

describe("discovery surface rules", () => {
  it("derives new-this-week relative to the latest registry date", () => {
    const surfaces = buildDiscoverySurfaceLists(
      [
        entry("old", { dateAdded: "2026-04-01" }),
        entry("week-old", { dateAdded: "2026-05-13" }),
        entry("newest", { dateAdded: "2026-05-20" }),
      ],
      { limit: 12 },
    );

    expect(slugs(surfaces.newThisWeek)).toEqual(["newest", "week-old"]);
    expect(slugs(surfaces.newest)).toEqual(["newest", "week-old", "old"]);
  });

  it("falls back to newest entries when no valid weekly dates exist", () => {
    const surfaces = buildDiscoverySurfaceLists([
      entry("dated", { dateAdded: "2026-05-20" }),
      entry("undated", { dateAdded: "" }),
    ]);

    expect(slugs(surfaces.newThisWeek)).toEqual(["dated"]);
  });

  it("sorts recently verified entries by source, package, review, or claim date", () => {
    const surfaces = buildDiscoverySurfaceLists([
      entry("source", {
        trustSignals: {
          sourceStatus: "available",
          lastVerifiedAt: "2026-05-10",
        },
      }),
      entry("package", {
        packageVerified: true,
        verifiedAt: "2026-05-18",
      }),
      entry("reviewed", {
        reviewedBy: "maintainer",
        reviewedAt: "2026-05-15",
      }),
      entry("untrusted", {
        dateAdded: "2026-05-20",
        trustSignals: { sourceStatus: "missing" },
      }),
    ]);

    expect(slugs(surfaces.recentlyVerified)).toEqual([
      "package",
      "reviewed",
      "source",
    ]);
  });

  it("keeps source-backed rails restricted to available sources and source signals", () => {
    const surfaces = buildDiscoverySurfaceLists([
      entry("stars-low", {
        githubStars: 10,
        dateAdded: "2026-05-19",
        trustSignals: { sourceStatus: "available" },
      }),
      entry("stars-high", {
        githubStars: 50,
        dateAdded: "2026-05-10",
        trustSignals: { sourceStatus: "available" },
      }),
      entry("missing-source", {
        githubStars: 500,
        trustSignals: { sourceStatus: "missing" },
      }),
    ]);

    expect(slugs(surfaces.sourceBacked)).toEqual(["stars-high", "stars-low"]);
    expect(slugs(surfaces.popularBySourceSignals)).toEqual([
      "missing-source",
      "stars-high",
      "stars-low",
    ]);
  });

  it("requires install surface and safe install signal for safe-install rails", () => {
    const surfaces = buildDiscoverySurfaceLists([
      entry("first-party", {
        installCommand: "npx first-party",
        downloadTrust: "first-party",
        verificationStatus: "production",
      }),
      entry("verified-package", {
        downloadUrl: "https://example.com/package.tgz",
        packageVerified: true,
      }),
      entry("external-download", {
        downloadUrl: "https://example.com/package.zip",
        downloadTrust: "external",
        trustSignals: { sourceStatus: "available" },
      }),
      entry("source-without-install", {
        trustSignals: { sourceStatus: "available" },
      }),
    ]);

    expect(slugs(surfaces.safeInstall)).toEqual([
      "first-party",
      "verified-package",
    ]);
  });
});
