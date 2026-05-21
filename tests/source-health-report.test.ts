import { describe, expect, it } from "vitest";

import {
  PACKAGEABLE_CATEGORIES,
  SAFETY_RELEVANT_CATEGORIES,
  SOURCE_FRESHNESS_THRESHOLDS,
  SOURCE_HEALTH_REPORT_SCHEMA_VERSION,
  buildContentSourceHealthArtifact,
  buildEntrySourceHealth,
  buildSourceHealthReport,
  deriveSourceFreshness,
} from "@heyclaude/registry";

// Reference date is fixed so freshness math is deterministic regardless
// of when the suite runs. Pick a date that places one entry in each
// freshness bucket the fixture set exercises.
const REFERENCE_DATE = new Date("2026-01-01T00:00:00.000Z");

function isoDaysAgo(days: number): string {
  const d = new Date(REFERENCE_DATE.getTime() - days * 86_400_000);
  return d.toISOString().slice(0, 10);
}

describe("deriveSourceFreshness", () => {
  it("returns fresh when source date is within the fresh threshold", () => {
    const result = deriveSourceFreshness(
      { repoUpdatedAt: isoDaysAgo(30) },
      REFERENCE_DATE,
    );
    expect(result.bucket).toBe("fresh");
    expect(result.ageDays).toBe(30);
    expect(result.source).toBe("repoUpdatedAt");
  });

  it("returns aging when source date is between fresh and aging thresholds", () => {
    const result = deriveSourceFreshness(
      { repoUpdatedAt: isoDaysAgo(SOURCE_FRESHNESS_THRESHOLDS.freshDays + 5) },
      REFERENCE_DATE,
    );
    expect(result.bucket).toBe("aging");
  });

  it("returns stale when source date is between aging and stale thresholds", () => {
    const result = deriveSourceFreshness(
      { repoUpdatedAt: isoDaysAgo(SOURCE_FRESHNESS_THRESHOLDS.agingDays + 5) },
      REFERENCE_DATE,
    );
    expect(result.bucket).toBe("stale");
  });

  it("returns dormant when source date is older than the stale threshold", () => {
    const result = deriveSourceFreshness(
      { repoUpdatedAt: isoDaysAgo(SOURCE_FRESHNESS_THRESHOLDS.staleDays + 1) },
      REFERENCE_DATE,
    );
    expect(result.bucket).toBe("dormant");
  });

  it("falls back to dateAdded when repoUpdatedAt is missing", () => {
    const result = deriveSourceFreshness(
      { dateAdded: isoDaysAgo(60) },
      REFERENCE_DATE,
    );
    expect(result.bucket).toBe("fresh");
    expect(result.source).toBe("dateAdded");
  });

  it("returns unknown bucket when no usable date is present", () => {
    const result = deriveSourceFreshness({}, REFERENCE_DATE);
    expect(result.bucket).toBe("unknown");
    expect(result.ageDays).toBeNull();
    expect(result.source).toBe("");
  });

  it("returns unknown bucket when the date string fails to parse", () => {
    const result = deriveSourceFreshness(
      { repoUpdatedAt: "not-a-date" },
      REFERENCE_DATE,
    );
    expect(result.bucket).toBe("unknown");
    expect(result.ageDays).toBeNull();
  });
});

describe("buildEntrySourceHealth", () => {
  it("flags safety-relevant categories when safetyNotes / privacyNotes are missing", () => {
    const result = buildEntrySourceHealth(
      {
        category: "hooks",
        slug: "test-hook",
        title: "Test Hook",
        repoUpdatedAt: isoDaysAgo(10),
        repoUrl: "https://github.com/example/hook",
      },
      REFERENCE_DATE,
    );
    expect(result.missingSafetyNotes).toBe(true);
    expect(result.missingPrivacyNotes).toBe(true);
    expect(result.attentionReasons).toEqual(
      expect.arrayContaining(["missing-safety-notes", "missing-privacy-notes"]),
    );
    expect(result.needsAttention).toBe(true);
  });

  it("does not flag categories where safety/privacy notes are not expected", () => {
    const result = buildEntrySourceHealth(
      {
        category: "guides",
        slug: "test-guide",
        title: "Test Guide",
        repoUpdatedAt: isoDaysAgo(10),
        documentationUrl: "https://example.com/docs",
      },
      REFERENCE_DATE,
    );
    expect(result.missingSafetyNotes).toBe(false);
    expect(result.missingPrivacyNotes).toBe(false);
  });

  it("flags packageable categories without a downloadTrust label", () => {
    const result = buildEntrySourceHealth(
      {
        category: "skills",
        slug: "test-skill",
        title: "Test Skill",
        repoUrl: "https://github.com/example/skill",
        repoUpdatedAt: isoDaysAgo(10),
        safetyNotes: ["runs in sandbox"],
        privacyNotes: ["no telemetry"],
      },
      REFERENCE_DATE,
    );
    expect(result.missingPackageTrust).toBe(true);
    expect(result.attentionReasons).toContain("missing-package-trust");
  });

  it("does not flag missingPackageTrust when downloadTrust is provided", () => {
    const result = buildEntrySourceHealth(
      {
        category: "skills",
        slug: "trusted-skill",
        title: "Trusted Skill",
        repoUrl: "https://github.com/example/trusted",
        repoUpdatedAt: isoDaysAgo(10),
        downloadTrust: "first-party",
        safetyNotes: ["runs in sandbox"],
        privacyNotes: ["no telemetry"],
      },
      REFERENCE_DATE,
    );
    expect(result.missingPackageTrust).toBe(false);
    expect(result.packageTrust).toBe("first-party");
  });

  it("flags an unprovenanced source when the only source URL is a self-reference", () => {
    // buildSourceProvenance (existing behavior) treats an entry whose
    // sole source URL points back at the awesome-claude repo as having
    // hasExternalSource=false despite hasRepository=true — the edge
    // case the unprovenanced flag exists to catch.
    const result = buildEntrySourceHealth(
      {
        category: "tools",
        slug: "self-referencing-entry",
        title: "Self Referencing Entry",
        repoUrl: "https://github.com/JSONbored/awesome-claude",
        repoUpdatedAt: isoDaysAgo(10),
      },
      REFERENCE_DATE,
    );
    expect(result.unprovenancedSource).toBe(true);
    expect(result.sourceBacked).toBe(false);
    expect(result.attentionReasons).toContain("unprovenanced-source");
  });

  it("flags stale-source when freshness bucket is stale or dormant", () => {
    const stale = buildEntrySourceHealth(
      {
        category: "guides",
        slug: "stale-guide",
        title: "Stale Guide",
        repoUpdatedAt: isoDaysAgo(SOURCE_FRESHNESS_THRESHOLDS.agingDays + 30),
        documentationUrl: "https://example.com/docs",
      },
      REFERENCE_DATE,
    );
    expect(stale.freshness.bucket).toBe("stale");
    expect(stale.attentionReasons).toContain("stale-source");

    const dormant = buildEntrySourceHealth(
      {
        category: "guides",
        slug: "dormant-guide",
        title: "Dormant Guide",
        repoUpdatedAt: isoDaysAgo(SOURCE_FRESHNESS_THRESHOLDS.staleDays + 30),
        documentationUrl: "https://example.com/docs",
      },
      REFERENCE_DATE,
    );
    expect(dormant.freshness.bucket).toBe("dormant");
    expect(dormant.attentionReasons).toContain("stale-source");
  });

  it("treats safetyNotes containing only blank strings as missing", () => {
    const result = buildEntrySourceHealth(
      {
        category: "mcp",
        slug: "blank-notes",
        title: "Blank Notes",
        repoUrl: "https://github.com/example/mcp",
        repoUpdatedAt: isoDaysAgo(10),
        safetyNotes: ["   "],
        privacyNotes: [""],
      },
      REFERENCE_DATE,
    );
    expect(result.hasSafetyNotes).toBe(false);
    expect(result.hasPrivacyNotes).toBe(false);
    expect(result.missingSafetyNotes).toBe(true);
    expect(result.missingPrivacyNotes).toBe(true);
  });

  it("produces an empty attentionReasons array for fully-provisioned entries", () => {
    const result = buildEntrySourceHealth(
      {
        category: "mcp",
        slug: "well-covered",
        title: "Well Covered",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://example.com/docs",
        repoUpdatedAt: isoDaysAgo(10),
        downloadTrust: "community",
        packageVerified: true,
        safetyNotes: ["read-only access"],
        privacyNotes: ["no data persisted"],
      },
      REFERENCE_DATE,
    );
    expect(result.attentionReasons).toEqual([]);
    expect(result.needsAttention).toBe(false);
    expect(result.packageVerified).toBe(true);
  });
});

describe("buildSourceHealthReport", () => {
  // Pinning the latest dateAdded to the REFERENCE_DATE makes
  // generatedAtForEntries() return REFERENCE_DATE exactly, so the per-entry
  // freshness calculations in the report match the isoDaysAgo offsets the
  // test fixture uses below. Without this, the report would pick the
  // latest dateAdded in the fixture as its reference and the bucket
  // assertions would drift.
  const entries = [
    // Fresh, fully provisioned mcp entry — no attention needed.
    {
      category: "mcp",
      slug: "fresh-mcp",
      title: "Fresh MCP",
      repoUrl: "https://github.com/example/fresh-mcp",
      documentationUrl: "https://example.com/fresh-mcp",
      repoUpdatedAt: isoDaysAgo(15),
      downloadTrust: "first-party",
      packageVerified: true,
      safetyNotes: ["sandboxed network access"],
      privacyNotes: ["no telemetry"],
      dateAdded: REFERENCE_DATE.toISOString().slice(0, 10),
    },
    // Aging hook with missing safety/privacy disclosure — counts toward
    // every missing-notes aggregate, and needs attention.
    {
      category: "hooks",
      slug: "aging-hook",
      title: "Aging Hook",
      repoUrl: "https://github.com/example/aging-hook",
      repoUpdatedAt: isoDaysAgo(SOURCE_FRESHNESS_THRESHOLDS.freshDays + 30),
      dateAdded: isoDaysAgo(400),
    },
    // Stale guide with documentation — counts as stale freshness, no
    // safety/privacy flags because guides aren't safety-relevant.
    {
      category: "guides",
      slug: "stale-guide",
      title: "Stale Guide",
      documentationUrl: "https://example.com/guide",
      repoUpdatedAt: isoDaysAgo(SOURCE_FRESHNESS_THRESHOLDS.agingDays + 30),
      dateAdded: isoDaysAgo(500),
    },
    // Unknown-date tool with no usable source — buildSourceProvenance's
    // default for entries with nothing set is "source-free-first-party",
    // so this counts as sourceBacked (the "editorial first-party"
    // default) but registers as unknown-freshness because no date is
    // available. The unknown-source-date attention reason fires.
    {
      category: "tools",
      slug: "unknown-tool",
      title: "Unknown Tool",
    },
    // Skill missing package trust + safety disclosure — counts toward
    // both missingPackageTrust and the safety aggregates.
    {
      category: "skills",
      slug: "needs-trust",
      title: "Needs Trust",
      repoUrl: "https://github.com/example/needs-trust",
      repoUpdatedAt: isoDaysAgo(30),
      dateAdded: isoDaysAgo(50),
    },
  ];

  const report = buildSourceHealthReport(entries);

  it("produces the documented schema envelope", () => {
    expect(report).toMatchObject({
      schemaVersion: SOURCE_HEALTH_REPORT_SCHEMA_VERSION,
      kind: "content-source-health-report",
      count: entries.length,
      thresholds: SOURCE_FRESHNESS_THRESHOLDS,
      safetyRelevantCategories: SAFETY_RELEVANT_CATEGORIES,
      packageableCategories: PACKAGEABLE_CATEGORIES,
    });
    // generatedAt must be a fixed ISO derived from the latest dateAdded
    // — never `now()` — so the artifact stays deterministic across runs.
    expect(report.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("counts each freshness bucket from the per-entry derivation", () => {
    const summary = report.summary as Record<string, unknown>;
    expect(summary.freshness).toEqual({
      fresh: 2, // fresh-mcp, needs-trust
      aging: 1, // aging-hook
      stale: 1, // stale-guide
      dormant: 0,
      unknown: 1, // unknown-tool
    });
  });

  it("aggregates per-entry health flags into summary counts", () => {
    const summary = report.summary as Record<string, unknown>;
    // All five fixture entries register as sourceBacked: fresh-mcp,
    // aging-hook, stale-guide, and needs-trust have real source URLs;
    // unknown-tool falls through to the existing buildSourceProvenance
    // default of "source-free-first-party" (editorial first-party).
    expect(summary.sourceBackedCount).toBe(5);
    // None of the fixture entries trip the narrow unprovenanced
    // condition (self-referencing repo URL with no other source);
    // that case is exercised in the per-entry test above.
    expect(summary.unprovenancedSourceCount).toBe(0);
    // safety-relevant entries missing notes: aging-hook + needs-trust.
    expect(summary.missingSafetyNotesCount).toBe(2);
    expect(summary.missingPrivacyNotesCount).toBe(2);
    // skills/mcp entries without downloadTrust: needs-trust only.
    expect(summary.missingPackageTrustCount).toBe(1);
    expect(summary.packageVerifiedCount).toBe(1); // fresh-mcp
    // Everything except fresh-mcp needs attention: aging-hook (missing
    // notes), stale-guide (stale-source), unknown-tool (unknown date),
    // needs-trust (missing notes + missing package trust).
    expect(summary.needsAttentionCount).toBe(4);
  });

  it("breaks down counts per category for downstream filter UIs", () => {
    const breakdown = report.categoryBreakdown as Record<
      string,
      { count: number; freshness: Record<string, number>; needsAttentionCount: number }
    >;
    expect(breakdown.mcp.count).toBe(1);
    expect(breakdown.mcp.freshness.fresh).toBe(1);
    expect(breakdown.mcp.needsAttentionCount).toBe(0);
    expect(breakdown.hooks.freshness.aging).toBe(1);
    expect(breakdown.hooks.needsAttentionCount).toBe(1);
    expect(breakdown.guides.freshness.stale).toBe(1);
    expect(breakdown.tools.freshness.unknown).toBe(1);
    expect(breakdown.skills.needsAttentionCount).toBe(1);
    // Categories with no entries report zero across every bucket — this
    // keeps the breakdown a stable shape downstream surfaces can rely on.
    expect(breakdown.agents).toEqual({
      count: 0,
      freshness: { fresh: 0, aging: 0, stale: 0, dormant: 0, unknown: 0 },
      sourceBackedCount: 0,
      unprovenancedSourceCount: 0,
      missingSafetyNotesCount: 0,
      missingPrivacyNotesCount: 0,
      missingPackageTrustCount: 0,
      packageVerifiedCount: 0,
      needsAttentionCount: 0,
    });
  });

  it("is deterministic across repeated builds", () => {
    expect(buildSourceHealthReport(entries)).toEqual(report);
  });

  it("exposes the same report through buildContentSourceHealthArtifact", () => {
    expect(buildContentSourceHealthArtifact(entries)).toEqual(report);
  });
});
