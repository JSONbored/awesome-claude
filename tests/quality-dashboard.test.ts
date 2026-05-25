import { describe, expect, it } from "vitest";

import type {
  RegistryTrustReport,
  RegistryTrustReportEntry,
} from "@heyclaude/registry";

import {
  buildCategoryHref,
  buildCategoryTrustRows,
  buildEntryHref,
  buildQualityDashboardSummary,
  findSafetyPrivacyGaps,
  isRiskBearingCategory,
  rankWeakestTrustCategories,
  summarizeProvenanceCoverage,
  summarizeRiskBearingTotals,
  toSafePathSegment,
} from "../apps/web/src/lib/quality-dashboard";

interface CategoryBreakdownInput {
  count: number;
  brandCoverage?: number;
  sourceAvailable?: number;
  checksumPresent?: number;
  adapterGenerated?: number;
  provenancePresent?: number;
  safetyNotesPresent?: number;
  privacyNotesPresent?: number;
  firstPartyPackage?: number;
  recommendedFixes?: number;
}

function trustEntry(
  overrides: Partial<RegistryTrustReportEntry> & {
    category: string;
    slug: string;
  },
): RegistryTrustReportEntry {
  return {
    key: `${overrides.category}:${overrides.slug}`,
    category: overrides.category,
    slug: overrides.slug,
    title: overrides.title ?? `${overrides.category}:${overrides.slug}`,
    brandName: overrides.brandName ?? "",
    brandDomain: overrides.brandDomain ?? "",
    brandAssetSource: overrides.brandAssetSource ?? "",
    sourceStatus: overrides.sourceStatus ?? "missing",
    sourceUrlCount: overrides.sourceUrlCount ?? 0,
    checksumPresent: overrides.checksumPresent ?? false,
    adapterGenerated: overrides.adapterGenerated ?? false,
    firstPartyEditorial: overrides.firstPartyEditorial ?? false,
    packageVerified: overrides.packageVerified ?? false,
    packageTrust: overrides.packageTrust ?? null,
    hasSafetyNotes: overrides.hasSafetyNotes ?? false,
    hasPrivacyNotes: overrides.hasPrivacyNotes ?? false,
    lastVerifiedAt: overrides.lastVerifiedAt ?? "",
    verificationAgeDays: overrides.verificationAgeDays ?? null,
    hasProvenance: overrides.hasProvenance ?? false,
    submittedBy: overrides.submittedBy ?? "",
    reviewedBy: overrides.reviewedBy ?? "",
    claimStatus: overrides.claimStatus ?? "unclaimed",
    recommendations: overrides.recommendations ?? [],
  };
}

function makeBreakdownRow(input: CategoryBreakdownInput) {
  return {
    count: input.count,
    brandCoverage: input.brandCoverage ?? 0,
    sourceAvailable: input.sourceAvailable ?? 0,
    checksumPresent: input.checksumPresent ?? 0,
    adapterGenerated: input.adapterGenerated ?? 0,
    provenancePresent: input.provenancePresent ?? 0,
    safetyNotesPresent: input.safetyNotesPresent ?? 0,
    privacyNotesPresent: input.privacyNotesPresent ?? 0,
    firstPartyPackage: input.firstPartyPackage ?? 0,
    recommendedFixes: input.recommendedFixes ?? 0,
  };
}

function makeReport(options: {
  entries: RegistryTrustReportEntry[];
  categoryBreakdown: Record<string, CategoryBreakdownInput>;
}): RegistryTrustReport {
  const categoryBreakdown: RegistryTrustReport["categoryBreakdown"] = {};
  for (const [key, value] of Object.entries(options.categoryBreakdown)) {
    categoryBreakdown[key] = makeBreakdownRow(value);
  }
  return {
    schemaVersion: 1,
    kind: "registry-trust-report",
    generatedAt: "2026-05-22T00:00:00.000Z",
    count: options.entries.length,
    thresholds: { recentlyVerifiedDays: 180, staleVerificationDays: 365 },
    summary: {
      brandedCount: 0,
      brandedPercent: 0,
      brandfetchCount: 0,
      sourceAvailableCount: 0,
      sourceAvailablePercent: 0,
      missingSourceCount: 0,
      checksumPresentCount: 0,
      checksumPresentPercent: 0,
      adapterGeneratedCount: 0,
      recentlyVerifiedCount: 0,
      staleVerificationCount: 0,
      provenanceCount: 0,
      provenancePercent: 0,
      claimedOrReviewedCount: 0,
      claimedOrReviewedPercent: 0,
      safetyNotesCount: 0,
      safetyNotesPercent: 0,
      privacyNotesCount: 0,
      privacyNotesPercent: 0,
      firstPartyPackageCount: 0,
      firstPartyPackagePercent: 0,
      recommendedFixCount: 0,
      entriesNeedingAttention: 0,
    },
    categoryBreakdown,
    queues: {},
    entries: options.entries,
  };
}

describe("isRiskBearingCategory", () => {
  it("identifies risk-bearing categories", () => {
    expect(isRiskBearingCategory("mcp")).toBe(true);
    expect(isRiskBearingCategory("hooks")).toBe(true);
    expect(isRiskBearingCategory("skills")).toBe(true);
    expect(isRiskBearingCategory("statuslines")).toBe(true);
    expect(isRiskBearingCategory("commands")).toBe(true);
  });

  it("rejects non-risk-bearing categories", () => {
    expect(isRiskBearingCategory("agents")).toBe(false);
    expect(isRiskBearingCategory("tools")).toBe(false);
    expect(isRiskBearingCategory("rules")).toBe(false);
    expect(isRiskBearingCategory("")).toBe(false);
  });
});

describe("buildCategoryTrustRows", () => {
  it("computes percentages and joins per-category claimed-or-reviewed counts", () => {
    const report = makeReport({
      entries: [
        trustEntry({ category: "mcp", slug: "a", claimStatus: "verified" }),
        trustEntry({ category: "mcp", slug: "b", reviewedBy: "octocat" }),
        trustEntry({ category: "mcp", slug: "c" }),
        trustEntry({ category: "mcp", slug: "d" }),
        trustEntry({ category: "hooks", slug: "h" }),
      ],
      categoryBreakdown: {
        mcp: {
          count: 4,
          brandCoverage: 2,
          sourceAvailable: 3,
          safetyNotesPresent: 1,
          privacyNotesPresent: 0,
          provenancePresent: 2,
          firstPartyPackage: 1,
          recommendedFixes: 5,
        },
        hooks: {
          count: 1,
          brandCoverage: 0,
          sourceAvailable: 1,
          safetyNotesPresent: 0,
          privacyNotesPresent: 0,
          provenancePresent: 0,
          firstPartyPackage: 0,
          recommendedFixes: 1,
        },
        agents: {
          count: 0,
        },
      },
    });

    const rows = buildCategoryTrustRows(report);

    expect(rows.map((row) => row.category)).toEqual(["hooks", "mcp"]);
    const mcp = rows.find((row) => row.category === "mcp");
    expect(mcp).toBeDefined();
    if (!mcp) {
      return;
    }
    expect(mcp.count).toBe(4);
    expect(mcp.brandPercent).toBe(50);
    expect(mcp.sourcePercent).toBe(75);
    expect(mcp.safetyNotesPercent).toBe(25);
    expect(mcp.privacyNotesPercent).toBe(0);
    expect(mcp.provenancePercent).toBe(50);
    expect(mcp.claimedOrReviewed).toBe(2);
    expect(mcp.claimedOrReviewedPercent).toBe(50);
    expect(mcp.firstPartyPackagePercent).toBe(25);
    expect(mcp.riskBearing).toBe(true);
    expect(mcp.trustCoverageScore).toBe(
      mcp.sourcePercent +
        mcp.brandPercent +
        mcp.safetyNotesPercent +
        mcp.privacyNotesPercent +
        mcp.provenancePercent,
    );
  });

  it("drops empty categories from the rows", () => {
    const report = makeReport({
      entries: [],
      categoryBreakdown: {
        mcp: { count: 0 },
        agents: { count: 0 },
      },
    });
    expect(buildCategoryTrustRows(report)).toEqual([]);
  });
});

describe("findSafetyPrivacyGaps", () => {
  it("flags risk-bearing entries missing safety or privacy notes", () => {
    const report = makeReport({
      entries: [
        trustEntry({
          category: "mcp",
          slug: "missing-both",
          title: "Missing both",
        }),
        trustEntry({
          category: "mcp",
          slug: "has-safety-only",
          title: "Has safety only",
          hasSafetyNotes: true,
        }),
        trustEntry({
          category: "mcp",
          slug: "fully-covered",
          title: "Fully covered",
          hasSafetyNotes: true,
          hasPrivacyNotes: true,
        }),
        trustEntry({
          category: "agents",
          slug: "non-risk",
          title: "Non-risk entry",
        }),
        trustEntry({
          category: "hooks",
          slug: "hook-a",
          title: "Hook A",
        }),
      ],
      categoryBreakdown: {},
    });

    const gaps = findSafetyPrivacyGaps(report);

    expect(gaps.missingSafetyNotes.map((gap) => gap.slug)).toEqual([
      "hook-a",
      "missing-both",
    ]);
    expect(gaps.missingPrivacyNotes.map((gap) => gap.slug)).toEqual([
      "hook-a",
      "has-safety-only",
      "missing-both",
    ]);
    expect(gaps.missingSafetyNotes.every((gap) => gap.missingSafetyNotes)).toBe(
      true,
    );
    expect(
      gaps.missingPrivacyNotes.every((gap) => gap.missingPrivacyNotes),
    ).toBe(true);
  });

  it("respects the limit argument", () => {
    const report = makeReport({
      entries: [
        trustEntry({ category: "mcp", slug: "a" }),
        trustEntry({ category: "mcp", slug: "b" }),
        trustEntry({ category: "mcp", slug: "c" }),
        trustEntry({ category: "mcp", slug: "d" }),
      ],
      categoryBreakdown: {},
    });
    const gaps = findSafetyPrivacyGaps(report, 2);
    expect(gaps.missingSafetyNotes).toHaveLength(2);
    expect(gaps.missingPrivacyNotes).toHaveLength(2);
  });
});

describe("rankWeakestTrustCategories", () => {
  it("sorts categories by ascending coverage and breaks ties by recommended fixes", () => {
    const report = makeReport({
      entries: [],
      categoryBreakdown: {
        agents: { count: 10, sourceAvailable: 10, recommendedFixes: 0 },
        mcp: { count: 10, sourceAvailable: 5, recommendedFixes: 2 },
        hooks: { count: 10, sourceAvailable: 0, recommendedFixes: 4 },
        commands: { count: 10, sourceAvailable: 0, recommendedFixes: 1 },
      },
    });
    const rows = buildCategoryTrustRows(report);
    const ranked = rankWeakestTrustCategories(rows, 3);
    expect(ranked.map((row) => row.category)).toEqual([
      "hooks",
      "commands",
      "mcp",
    ]);
  });
});

describe("summarizeRiskBearingTotals", () => {
  it("aggregates safety/privacy coverage across risk-bearing categories only", () => {
    const report = makeReport({
      entries: [
        trustEntry({ category: "mcp", slug: "a", hasSafetyNotes: true }),
        trustEntry({
          category: "mcp",
          slug: "b",
          hasSafetyNotes: true,
          hasPrivacyNotes: true,
        }),
        trustEntry({ category: "hooks", slug: "h" }),
        trustEntry({
          category: "agents",
          slug: "noise",
          hasSafetyNotes: true,
        }),
      ],
      categoryBreakdown: {},
    });
    const totals = summarizeRiskBearingTotals(report);
    expect(totals.totalEntries).toBe(3);
    expect(totals.totalMissingSafetyNotes).toBe(1);
    expect(totals.totalMissingPrivacyNotes).toBe(2);
    expect(totals.safetyCoveragePercent).toBe(67);
    expect(totals.privacyCoveragePercent).toBe(33);
  });

  it("returns zero coverage when no risk-bearing entries exist", () => {
    const report = makeReport({
      entries: [trustEntry({ category: "agents", slug: "only" })],
      categoryBreakdown: {},
    });
    const totals = summarizeRiskBearingTotals(report);
    expect(totals.totalEntries).toBe(0);
    expect(totals.safetyCoveragePercent).toBe(0);
    expect(totals.privacyCoveragePercent).toBe(0);
  });
});

describe("summarizeProvenanceCoverage", () => {
  it("computes provenance and source availability across all entries", () => {
    const report = makeReport({
      entries: [
        trustEntry({
          category: "mcp",
          slug: "a",
          hasProvenance: true,
          sourceStatus: "available",
        }),
        trustEntry({
          category: "mcp",
          slug: "b",
          hasProvenance: false,
          sourceStatus: "available",
        }),
        trustEntry({
          category: "agents",
          slug: "c",
          hasProvenance: false,
          sourceStatus: "missing",
        }),
      ],
      categoryBreakdown: {},
    });
    const coverage = summarizeProvenanceCoverage(report);
    expect(coverage.totalEntries).toBe(3);
    expect(coverage.provenancePresent).toBe(1);
    expect(coverage.provenancePercent).toBe(33);
    expect(coverage.sourceAvailable).toBe(2);
    expect(coverage.sourcePercent).toBe(67);
    expect(coverage.missingSourceCount).toBe(1);
  });
});

describe("buildQualityDashboardSummary", () => {
  it("assembles every derivation deterministically from one trust report", () => {
    const report = makeReport({
      entries: [
        trustEntry({
          category: "mcp",
          slug: "secure",
          hasSafetyNotes: true,
          hasPrivacyNotes: true,
          claimStatus: "verified",
          sourceStatus: "available",
          hasProvenance: true,
        }),
        trustEntry({
          category: "mcp",
          slug: "needs-help",
          sourceStatus: "missing",
        }),
        trustEntry({
          category: "hooks",
          slug: "hook",
          sourceStatus: "available",
        }),
      ],
      categoryBreakdown: {
        mcp: {
          count: 2,
          brandCoverage: 1,
          sourceAvailable: 1,
          safetyNotesPresent: 1,
          privacyNotesPresent: 1,
          provenancePresent: 1,
          recommendedFixes: 2,
        },
        hooks: {
          count: 1,
          sourceAvailable: 1,
          recommendedFixes: 0,
        },
      },
    });
    const summary = buildQualityDashboardSummary(report);
    expect(summary.riskBearingCategories).toEqual([
      "mcp",
      "hooks",
      "skills",
      "statuslines",
      "commands",
    ]);
    expect(summary.categoryTrustRows).toHaveLength(2);
    expect(summary.weakestCategories[0]?.category).toBe("hooks");
    expect(summary.riskBearingTotals.totalEntries).toBe(3);
    expect(summary.riskBearingTotals.totalMissingSafetyNotes).toBe(2);
    expect(summary.provenanceCoverage.totalEntries).toBe(3);
    expect(summary.provenanceCoverage.sourceAvailable).toBe(2);
  });
});

describe("path segment encoding", () => {
  it("trims and percent-encodes unsafe characters", () => {
    expect(toSafePathSegment("mcp")).toBe("mcp");
    expect(toSafePathSegment("  mcp  ")).toBe("mcp");
    expect(toSafePathSegment("a b")).toBe("a%20b");
    expect(toSafePathSegment("../etc/passwd")).toBe("..%2Fetc%2Fpasswd");
    expect(toSafePathSegment("café")).toBe("caf%C3%A9");
    expect(toSafePathSegment("")).toBe("");
  });

  it("buildCategoryHref encodes the category segment", () => {
    expect(buildCategoryHref("mcp")).toBe("/mcp");
    expect(buildCategoryHref("a/b")).toBe("/a%2Fb");
  });

  it("buildEntryHref encodes both segments independently", () => {
    expect(buildEntryHref("mcp", "context7")).toBe("/mcp/context7");
    expect(buildEntryHref("a/b", "c d")).toBe("/a%2Fb/c%20d");
    expect(buildEntryHref("mcp", "../escape")).toBe("/mcp/..%2Fescape");
  });
});
