import { describe, expect, it } from "vitest";

import {
  buildDiscoverySurfaceLists,
  hasInstallSurface,
  hasSafeInstallSignal,
  isSourceBackedEntry,
  type GrowthSurfaceEntry,
} from "../apps/web/src/lib/growth-surface-rules-lib";

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

describe("isSourceBackedEntry", () => {
  it("is true only when the trust signal reports an available source", () => {
    expect(
      isSourceBackedEntry({ trustSignals: { sourceStatus: "available" } }),
    ).toBe(true);
    expect(
      isSourceBackedEntry({ trustSignals: { sourceStatus: "unavailable" } }),
    ).toBe(false);
    expect(
      isSourceBackedEntry({ trustSignals: { sourceStatus: "missing" } }),
    ).toBe(false);
    expect(isSourceBackedEntry({})).toBe(false);
    expect(isSourceBackedEntry({ trustSignals: null })).toBe(false);
  });

  it("ignores other trust signal fields without an available status", () => {
    expect(
      isSourceBackedEntry({
        trustSignals: {
          sourceStatus: "missing",
          lastVerifiedAt: "2026-05-20",
        },
      }),
    ).toBe(false);
  });
});

describe("hasInstallSurface", () => {
  it("is true when any install affordance is present", () => {
    expect(hasInstallSurface({ installCommand: "npx example" })).toBe(true);
    expect(hasInstallSurface({ downloadUrl: "/downloads/skills/x.zip" })).toBe(
      true,
    );
    expect(hasInstallSurface({ configSnippet: "{}" })).toBe(true);
    expect(
      hasInstallSurface({
        installCommand: "npx a",
        downloadUrl: "https://example.com/b.zip",
        configSnippet: "{}",
      }),
    ).toBe(true);
  });

  it("is false when no install affordance exists", () => {
    expect(hasInstallSurface({})).toBe(false);
    expect(
      hasInstallSurface({
        installCommand: null,
        downloadUrl: null,
        configSnippet: null,
      }),
    ).toBe(false);
    expect(hasInstallSurface({ installCommand: "" })).toBe(false);
  });
});

describe("hasSafeInstallSignal", () => {
  it("requires a first-party download or a verified package", () => {
    expect(hasSafeInstallSignal({ downloadTrust: "first-party" })).toBe(true);
    expect(hasSafeInstallSignal({ packageVerified: true })).toBe(true);
    expect(
      hasSafeInstallSignal({
        downloadTrust: "first-party",
        packageVerified: true,
      }),
    ).toBe(true);
  });

  it("rejects external downloads and unverified packages", () => {
    expect(hasSafeInstallSignal({ downloadTrust: "external" })).toBe(false);
    expect(hasSafeInstallSignal({ packageVerified: false })).toBe(false);
    expect(hasSafeInstallSignal({})).toBe(false);
    expect(hasSafeInstallSignal({ downloadTrust: "unknown" })).toBe(false);
  });
});

describe("buildDiscoverySurfaceLists newest", () => {
  it("sorts dated entries newest-first and omits undated rows", () => {
    const surfaces = buildDiscoverySurfaceLists([
      entry("old", { dateAdded: "2026-04-01" }),
      entry("mid", { dateAdded: "2026-05-10" }),
      entry("newest", { dateAdded: "2026-05-20" }),
      entry("undated", { dateAdded: "" }),
      entry("null-date", { dateAdded: null }),
    ]);

    expect(slugs(surfaces.newest)).toEqual(["newest", "mid", "old"]);
  });

  it("honors the configured limit for newest entries", () => {
    const surfaces = buildDiscoverySurfaceLists(
      [
        entry("a", { dateAdded: "2026-05-20" }),
        entry("b", { dateAdded: "2026-05-19" }),
        entry("c", { dateAdded: "2026-05-18" }),
      ],
      { limit: 2 },
    );

    expect(slugs(surfaces.newest)).toEqual(["a", "b"]);
  });
});

describe("buildDiscoverySurfaceLists newThisWeek", () => {
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

  it("excludes entries older than seven days from the latest date", () => {
    const surfaces = buildDiscoverySurfaceLists([
      entry("latest", { dateAdded: "2026-05-20" }),
      entry("six-days", { dateAdded: "2026-05-14" }),
      entry("eight-days", { dateAdded: "2026-05-12" }),
    ]);

    expect(slugs(surfaces.newThisWeek)).toEqual(["latest", "six-days"]);
  });

  it("ignores invalid date strings when computing the weekly window", () => {
    const surfaces = buildDiscoverySurfaceLists([
      entry("valid", { dateAdded: "2026-05-20" }),
      entry("invalid", { dateAdded: "not-a-date" }),
    ]);

    expect(slugs(surfaces.newThisWeek)).toEqual(["valid"]);
  });
});

describe("buildDiscoverySurfaceLists recentlyUpdated", () => {
  it("sorts repo updates newest-first and omits entries without repoUpdatedAt", () => {
    const surfaces = buildDiscoverySurfaceLists([
      entry("old", { repoUpdatedAt: "2026-04-01" }),
      entry("fresh", { repoUpdatedAt: "2026-05-20" }),
      entry("mid", { repoUpdatedAt: "2026-05-10" }),
      entry("no-update"),
    ]);

    expect(slugs(surfaces.recentlyUpdated)).toEqual(["fresh", "mid", "old"]);
  });

  it("respects the limit for recently updated entries", () => {
    const surfaces = buildDiscoverySurfaceLists(
      [
        entry("a", { repoUpdatedAt: "2026-05-20" }),
        entry("b", { repoUpdatedAt: "2026-05-19" }),
        entry("c", { repoUpdatedAt: "2026-05-18" }),
      ],
      { limit: 1 },
    );

    expect(slugs(surfaces.recentlyUpdated)).toEqual(["a"]);
  });
});

describe("buildDiscoverySurfaceLists recentlyVerified", () => {
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

  it("includes verified claims even without review metadata", () => {
    const surfaces = buildDiscoverySurfaceLists([
      entry("claimed", {
        claimStatus: "verified",
        dateAdded: "2026-05-01",
      }),
      entry("plain", { dateAdded: "2026-05-20" }),
    ]);

    expect(slugs(surfaces.recentlyVerified)).toEqual(["claimed"]);
  });

  it("prefers trustSignals.lastVerifiedAt over older fallback dates", () => {
    const surfaces = buildDiscoverySurfaceLists([
      entry("recent-source", {
        trustSignals: {
          sourceStatus: "available",
          lastVerifiedAt: "2026-05-25",
        },
        reviewedAt: "2026-05-01",
      }),
      entry("older-review", {
        reviewedBy: "maintainer",
        reviewedAt: "2026-05-20",
      }),
    ]);

    expect(slugs(surfaces.recentlyVerified)).toEqual([
      "recent-source",
      "older-review",
    ]);
  });
});

describe("buildDiscoverySurfaceLists sourceBacked", () => {
  it("keeps source-backed rails restricted to available sources", () => {
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
  });

  it("breaks star ties by newest dateAdded", () => {
    const surfaces = buildDiscoverySurfaceLists([
      entry("older", {
        githubStars: 40,
        dateAdded: "2026-05-01",
        trustSignals: { sourceStatus: "available" },
      }),
      entry("newer", {
        githubStars: 40,
        dateAdded: "2026-05-20",
        trustSignals: { sourceStatus: "available" },
      }),
    ]);

    expect(slugs(surfaces.sourceBacked)).toEqual(["newer", "older"]);
  });
});

describe("buildDiscoverySurfaceLists safeInstall", () => {
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

  it("ranks first-party production installs above verified packages", () => {
    const surfaces = buildDiscoverySurfaceLists([
      entry("verified-only", {
        downloadUrl: "https://example.com/pkg.tgz",
        packageVerified: true,
        dateAdded: "2026-05-20",
      }),
      entry("first-party-prod", {
        installCommand: "npx demo",
        downloadTrust: "first-party",
        verificationStatus: "production",
        trustSignals: { sourceStatus: "available" },
        dateAdded: "2026-05-01",
      }),
    ]);

    expect(slugs(surfaces.safeInstall)).toEqual([
      "first-party-prod",
      "verified-only",
    ]);
  });

  it("breaks safe-install score ties by newest dateAdded", () => {
    const surfaces = buildDiscoverySurfaceLists([
      entry("older", {
        installCommand: "npx a",
        downloadTrust: "first-party",
        dateAdded: "2026-05-01",
      }),
      entry("newer", {
        installCommand: "npx b",
        downloadTrust: "first-party",
        dateAdded: "2026-05-20",
      }),
    ]);

    expect(slugs(surfaces.safeInstall)).toEqual(["newer", "older"]);
  });
});

describe("buildDiscoverySurfaceLists popularBySourceSignals", () => {
  it("includes only entries with positive githubStars", () => {
    const surfaces = buildDiscoverySurfaceLists([
      entry("popular", { githubStars: 500 }),
      entry("small", { githubStars: 1 }),
      entry("zero", { githubStars: 0 }),
      entry("missing", { githubStars: null }),
      entry("undated-stars", { githubStars: 25 }),
    ]);

    expect(slugs(surfaces.popularBySourceSignals)).toEqual([
      "popular",
      "undated-stars",
      "small",
    ]);
  });

  it("sorts popular entries by descending githubStars", () => {
    const surfaces = buildDiscoverySurfaceLists([
      entry("mid", { githubStars: 50 }),
      entry("top", { githubStars: 200 }),
      entry("low", { githubStars: 5 }),
    ]);

    expect(slugs(surfaces.popularBySourceSignals)).toEqual([
      "top",
      "mid",
      "low",
    ]);
  });
});

describe("buildDiscoverySurfaceLists practicalPicks", () => {
  it("requires install surface and a dated entry", () => {
    const surfaces = buildDiscoverySurfaceLists([
      entry("installable", {
        installCommand: "npx demo",
        dateAdded: "2026-05-20",
        githubStars: 10,
      }),
      entry("no-install", { dateAdded: "2026-05-20", githubStars: 99 }),
      entry("undated-install", {
        installCommand: "npx undated",
        dateAdded: "",
        githubStars: 99,
      }),
    ]);

    expect(slugs(surfaces.practicalPicks)).toEqual(["installable"]);
  });

  it("ranks practical picks by stars plus first-party and production bonuses", () => {
    const surfaces = buildDiscoverySurfaceLists([
      entry("stars-only", {
        installCommand: "npx a",
        dateAdded: "2026-05-10",
        githubStars: 100,
      }),
      entry("first-party-prod", {
        installCommand: "npx b",
        dateAdded: "2026-05-01",
        githubStars: 10,
        downloadTrust: "first-party",
        verificationStatus: "production",
      }),
      entry("config-snippet", {
        configSnippet: "{}",
        dateAdded: "2026-05-15",
        githubStars: 20,
      }),
    ]);

    expect(slugs(surfaces.practicalPicks)).toEqual([
      "stars-only",
      "first-party-prod",
      "config-snippet",
    ]);
  });

  it("breaks practical pick score ties by newest dateAdded", () => {
    const surfaces = buildDiscoverySurfaceLists([
      entry("older", {
        installCommand: "npx old",
        dateAdded: "2026-05-01",
        githubStars: 10,
      }),
      entry("newer", {
        installCommand: "npx new",
        dateAdded: "2026-05-20",
        githubStars: 10,
      }),
    ]);

    expect(slugs(surfaces.practicalPicks)).toEqual(["newer", "older"]);
  });
});

describe("buildDiscoverySurfaceLists defaults", () => {
  it("returns empty lists for an empty input set", () => {
    const surfaces = buildDiscoverySurfaceLists([]);

    expect(surfaces.newest).toEqual([]);
    expect(surfaces.newThisWeek).toEqual([]);
    expect(surfaces.recentlyUpdated).toEqual([]);
    expect(surfaces.recentlyVerified).toEqual([]);
    expect(surfaces.sourceBacked).toEqual([]);
    expect(surfaces.safeInstall).toEqual([]);
    expect(surfaces.popularBySourceSignals).toEqual([]);
    expect(surfaces.practicalPicks).toEqual([]);
  });

  it("defaults the limit to twelve entries per rail", () => {
    const entries = Array.from({ length: 20 }, (_, index) =>
      entry(`entry-${index}`, {
        dateAdded: `2026-05-${String(20 - index).padStart(2, "0")}`,
        githubStars: index + 1,
        installCommand: "npx demo",
        downloadTrust: "first-party",
        trustSignals: { sourceStatus: "available" },
        repoUpdatedAt: `2026-05-${String(20 - index).padStart(2, "0")}`,
      }),
    );

    const surfaces = buildDiscoverySurfaceLists(entries);

    expect(surfaces.newest).toHaveLength(12);
    expect(surfaces.recentlyUpdated).toHaveLength(12);
    expect(surfaces.sourceBacked).toHaveLength(12);
    expect(surfaces.safeInstall).toHaveLength(12);
    expect(surfaces.popularBySourceSignals).toHaveLength(12);
    expect(surfaces.practicalPicks).toHaveLength(12);
  });

  it("does not mutate the input entry array", () => {
    const entries = [
      entry("a", { dateAdded: "2026-05-20" }),
      entry("b", { dateAdded: "2026-05-19" }),
    ];
    const snapshot = JSON.stringify(entries);

    buildDiscoverySurfaceLists(entries);

    expect(JSON.stringify(entries)).toBe(snapshot);
  });
});
