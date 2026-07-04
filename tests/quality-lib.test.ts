import { describe, expect, it } from "vitest";

import {
  QUALITY_REPORT_SCHEMA_VERSION,
  SOURCE_HEALTH_REPORT_SCHEMA_VERSION,
  SOURCE_HEALTH_RISK_CATEGORIES,
  SOURCE_FRESHNESS_THRESHOLDS,
  clean,
  clampScore,
  generatedAtForEntries,
  normalizeBodyForDuplicateCheck,
  buildSourceProvenance,
  scoreFreshness,
  buildEntryQuality,
  findDuplicateBodyGroups,
  buildContentQualityReport,
  isRiskBearingSourceCategory,
  hasMeaningfulNotes,
  percentOf,
  deriveSourceFreshness,
  derivePackageTrust,
  buildEntrySourceHealth,
  buildSourceHealthCategoryBreakdown,
  buildSourceHealthReport,
  buildContentPromptReport,
} from "../packages/registry/src/quality-lib.js";

const REFERENCE = new Date("2026-06-01T00:00:00.000Z");

function entry(overrides: Record<string, unknown> = {}) {
  return {
    category: "skills",
    slug: "alpha",
    title: "Alpha",
    description: "D".repeat(40),
    dateAdded: "2026-05-01",
    ...overrides,
  };
}

const LONG_BODY = "word ".repeat(50).trim(); // >180 chars after normalize

describe("constants", () => {
  it("exposes schema versions and freshness thresholds", () => {
    expect(QUALITY_REPORT_SCHEMA_VERSION).toBe(2);
    expect(SOURCE_HEALTH_REPORT_SCHEMA_VERSION).toBe(1);
    expect(SOURCE_FRESHNESS_THRESHOLDS).toEqual({
      freshMaxDays: 180,
      agingMaxDays: 365,
      staleMaxDays: 730,
    });
    expect(SOURCE_HEALTH_RISK_CATEGORIES.has("mcp")).toBe(true);
    expect(SOURCE_HEALTH_RISK_CATEGORIES.has("agents")).toBe(false);
  });
});

describe("clean / clampScore", () => {
  it("trims and coerces nullish values", () => {
    expect(clean("  hi ")).toBe("hi");
    expect(clean(null)).toBe("");
    expect(clean(undefined)).toBe("");
    expect(clean(12)).toBe("12");
  });

  it("clamps and rounds scores into 0-100", () => {
    expect(clampScore(-5)).toBe(0);
    expect(clampScore(150)).toBe(100);
    expect(clampScore(12.4)).toBe(12);
    expect(clampScore(12.6)).toBe(13);
  });
});

describe("generatedAtForEntries", () => {
  it("falls back to the epoch when no valid dates exist", () => {
    expect(generatedAtForEntries([])).toBe("1970-01-01T00:00:00.000Z");
    expect(generatedAtForEntries([entry({ dateAdded: "not-a-date" })])).toBe(
      "1970-01-01T00:00:00.000Z",
    );
    expect(generatedAtForEntries([entry({ dateAdded: "" })])).toBe(
      "1970-01-01T00:00:00.000Z",
    );
  });

  it("uses the latest valid YYYY-MM-DD dateAdded", () => {
    expect(
      generatedAtForEntries([
        entry({ dateAdded: "2024-01-01T12:00:00.000Z" }),
        entry({ dateAdded: "2025-06-15" }),
        entry({ dateAdded: "bad" }),
      ]),
    ).toBe("2025-06-15T00:00:00.000Z");
  });
});

describe("normalizeBodyForDuplicateCheck", () => {
  it("strips code fences, urls, and punctuation", () => {
    const normalized = normalizeBodyForDuplicateCheck({
      body: "Hello ```code block``` world https://example.com/path! More text.",
    });
    expect(normalized).toBe("hello world more text");
  });

  it("returns empty for blank bodies", () => {
    expect(normalizeBodyForDuplicateCheck({ body: "   " })).toBe("");
    expect(normalizeBodyForDuplicateCheck({})).toBe("");
  });
});

describe("buildSourceProvenance", () => {
  it("classifies every sourceQuality tier", () => {
    expect(
      buildSourceProvenance({
        repoUrl: "https://github.com/a/b",
        documentationUrl: "https://docs.example",
      }).sourceQuality,
    ).toBe("repo-and-docs");
    expect(
      buildSourceProvenance({ repoUrl: "https://github.com/a/b" })
        .sourceQuality,
    ).toBe("repo");
    expect(
      buildSourceProvenance({ documentationUrl: "https://docs.example" })
        .sourceQuality,
    ).toBe("docs");
    expect(
      buildSourceProvenance({ downloadTrust: "first-party" }).sourceQuality,
    ).toBe("verified-first-party-package");
    expect(
      buildSourceProvenance({
        githubUrl: "https://github.com/JSONbored/awesome-claude/blob/main/x.md",
      }).sourceQuality,
    ).toBe("local-editorial-source");
    expect(buildSourceProvenance({}).sourceQuality).toBe(
      "source-free-first-party",
    );
  });

  it("treats first-party directory urls as non-external", () => {
    const provenance = buildSourceProvenance({
      githubUrl: "https://github.com/JSONbored/awesome-claude/blob/main/x.md",
      websiteUrl: "https://external.example",
    });
    expect(provenance.hasExternalSource).toBe(true);
    expect(provenance.externalSourceUrls).toEqual(["https://external.example"]);
    expect(provenance.sourceUrls).toContain(
      "https://github.com/JSONbored/awesome-claude/blob/main/x.md",
    );
  });
});

describe("scoreFreshness", () => {
  it("returns 35 when no date is present", () => {
    expect(scoreFreshness({}, REFERENCE)).toBe(35);
    expect(scoreFreshness({ dateAdded: "" }, REFERENCE)).toBe(35);
  });

  it("returns 45 for unparseable dates", () => {
    expect(scoreFreshness({ dateAdded: "not-a-date" }, REFERENCE)).toBe(45);
  });

  it("scores age buckets against a Date or string reference", () => {
    expect(scoreFreshness({ dateAdded: "2026-05-01" }, REFERENCE)).toBe(100); // <=180 days
    expect(scoreFreshness({ dateAdded: "2025-08-01" }, REFERENCE)).toBe(85); // <=365
    expect(scoreFreshness({ dateAdded: "2024-08-01" }, REFERENCE)).toBe(65); // <=730
    expect(scoreFreshness({ dateAdded: "2023-01-01" }, REFERENCE)).toBe(45); // older
    expect(
      scoreFreshness(
        { repoUpdatedAt: "2026-05-01" },
        "2026-06-01T00:00:00.000Z",
      ),
    ).toBe(100);
  });

  it("prefers repoUpdatedAt over dateAdded", () => {
    expect(
      scoreFreshness(
        { repoUpdatedAt: "2026-05-20", dateAdded: "2020-01-01" },
        REFERENCE,
      ),
    ).toBe(100);
  });

  it("defaults the reference date when omitted", () => {
    const score = scoreFreshness({ dateAdded: new Date().toISOString() });
    expect(score).toBe(100);
  });
});

describe("buildEntryQuality", () => {
  it("scores a rich entry highly and emits no critical warnings", () => {
    const quality = buildEntryQuality(
      entry({
        category: "agents",
        slug: "rich",
        title: "Rich",
        description: "D".repeat(120),
        seoTitle: "Rich SEO",
        seoDescription: "S".repeat(120),
        repoUrl: "https://github.com/a/b",
        documentationUrl: "https://docs.example",
        body: "x".repeat(220),
        installCommand: "npm i rich",
        configSnippet: "{ }",
        downloadUrl: "https://cdn.example/pkg",
        usageSnippet: "use it like this please",
        tags: ["one", "two"],
        keywords: ["alpha", "beta"],
      }),
      REFERENCE,
    );
    expect(quality.key).toBe("agents:rich");
    expect(quality.scores.total).toBeGreaterThan(70);
    expect(quality.provenance.sourceQuality).toBe("repo-and-docs");
    expect(quality.warnings).not.toContain("Missing explicit seoTitle.");
  });

  it("emits warnings for thin, unprovenanced entries", () => {
    const quality = buildEntryQuality(
      entry({
        category: "mcp",
        slug: "thin",
        description: "short",
        dateAdded: "2020-01-01",
      }),
      REFERENCE,
    );
    expect(quality.warnings.join("\n")).toContain("seoTitle");
    expect(quality.warnings.join("\n")).toContain("seoDescription");
    expect(quality.warnings.join("\n")).toContain("copyable asset");
    expect(quality.warnings.join("\n")).toContain("install, config, download");
  });

  it("warns about long descriptions and editorial-only provenance gaps", () => {
    const quality = buildEntryQuality(
      entry({
        description: "D".repeat(230),
        // no repo/docs/package/github — but sourceQuality is source-free-first-party
        // which is explicit editorial, so the unprovenanced warning is skipped
      }),
      REFERENCE,
    );
    expect(quality.warnings).toContain(
      "Description is long for browse/search display.",
    );
  });

  it("warns when a first-party-host repo is not treated as external provenance", () => {
    // repoUrl on the directory host sets sourceQuality=repo but is filtered out
    // of externalSourceUrls, so the editorial-first-party warning fires.
    const quality = buildEntryQuality(
      entry({
        repoUrl: "https://github.com/JSONbored/awesome-claude",
        seoTitle: "Title",
        seoDescription: "short",
        robotsIndex: false,
        body: "x".repeat(200),
        tags: ["only-one"],
      }),
      REFERENCE,
    );
    expect(quality.warnings).toContain(
      "No external docs/repo source; label as editorial first-party content.",
    );
    expect(quality.scores.seo).toBeLessThan(
      buildEntryQuality(
        entry({
          seoTitle: "Title",
          seoDescription: "S".repeat(100),
          keywords: ["a", "b"],
          tags: ["a", "b"],
        }),
        REFERENCE,
      ).scores.seo,
    );
  });

  it("counts usageSnippet as a usable body when body is short", () => {
    const quality = buildEntryQuality(
      entry({
        body: "short",
        usageSnippet: "u".repeat(50),
        installCommand: "install",
        seoTitle: "T",
        seoDescription: "S".repeat(100),
      }),
      REFERENCE,
    );
    expect(quality.scores.usefulness).toBeGreaterThan(40);
  });

  it("scores first-party packages and editorial github urls in the source dimension", () => {
    const packaged = buildEntryQuality(
      entry({
        downloadTrust: "first-party",
        githubUrl: "https://github.com/JSONbored/awesome-claude/blob/main/x.md",
        body: "x".repeat(200),
        installCommand: "install",
      }),
      REFERENCE,
    );
    expect(packaged.provenance.hasFirstPartyPackage).toBe(true);
    // first-party package (25) + githubUrl (10)
    expect(packaged.scores.source).toBe(35);

    const editorial = buildEntryQuality(
      entry({
        githubUrl: "https://github.com/JSONbored/awesome-claude/blob/main/x.md",
        body: "x".repeat(200),
      }),
      REFERENCE,
    );
    expect(editorial.provenance.sourceQuality).toBe("local-editorial-source");
    // editorial provenance (20) + githubUrl (10)
    expect(editorial.scores.source).toBe(30);
  });
});

describe("findDuplicateBodyGroups", () => {
  it("skips bodies shorter than 180 normalized characters", () => {
    expect(
      findDuplicateBodyGroups([
        entry({ slug: "a", body: "short" }),
        entry({ slug: "b", body: "short" }),
      ]),
    ).toEqual([]);
  });

  it("groups identical normalized bodies and sorts by size then key", () => {
    const bodyA = `${LONG_BODY} unique-a`;
    const bodyB = `${LONG_BODY} unique-b`;
    const groups = findDuplicateBodyGroups([
      entry({ category: "skills", slug: "a", title: "A", body: bodyA }),
      entry({ category: "skills", slug: "z", title: "Z", body: bodyA }),
      entry({ category: "mcp", slug: "m1", title: "M1", body: bodyB }),
      entry({ category: "mcp", slug: "m2", title: "M2", body: bodyB }),
      entry({ category: "mcp", slug: "m3", title: "M3", body: bodyB }),
      entry({
        category: "agents",
        slug: "solo",
        title: "Solo",
        body: LONG_BODY,
      }),
    ]);
    expect(groups).toHaveLength(2);
    expect(groups[0]).toHaveLength(3);
    expect(groups[1]).toHaveLength(2);
    // Groups are ordered by size, then by the first member's key.
    expect(groups[1][0].key).toBe("skills:a");
    expect(groups[1].map((item) => item.key).sort()).toEqual([
      "skills:a",
      "skills:z",
    ]);
  });

  it("breaks equal-sized duplicate groups by the first member key", () => {
    const bodyA = `${LONG_BODY} group-a`;
    const bodyZ = `${LONG_BODY} group-z`;
    const groups = findDuplicateBodyGroups([
      entry({ category: "skills", slug: "z1", title: "Z1", body: bodyZ }),
      entry({ category: "skills", slug: "z2", title: "Z2", body: bodyZ }),
      entry({ category: "skills", slug: "a1", title: "A1", body: bodyA }),
      entry({ category: "skills", slug: "a2", title: "A2", body: bodyA }),
    ]);
    expect(groups).toHaveLength(2);
    expect(groups[0]).toHaveLength(2);
    expect(groups[1]).toHaveLength(2);
    expect(groups[0][0].key).toBe("skills:a1");
    expect(groups[1][0].key).toBe("skills:z1");
  });
});

describe("buildContentQualityReport", () => {
  it("aggregates empty registries with zero averages", () => {
    const report = buildContentQualityReport([]);
    expect(report.count).toBe(0);
    expect(report.summary.averageScore).toBe(0);
    expect(report.summary.duplicateBodyGroupCount).toBe(0);
    expect(report.kind).toBe("content-quality-report");
    expect(report.schemaVersion).toBe(QUALITY_REPORT_SCHEMA_VERSION);
  });

  it("summarizes provenance and seo gaps across entries", () => {
    const report = buildContentQualityReport([
      entry({
        category: "agents",
        slug: "rich",
        description: "D".repeat(120),
        seoTitle: "Rich",
        seoDescription: "S".repeat(120),
        repoUrl: "https://github.com/a/b",
        documentationUrl: "https://docs.example",
        body: "x".repeat(220),
        dateAdded: "2026-05-20",
      }),
      entry({
        category: "mcp",
        slug: "thin",
        description: "short",
        dateAdded: "2023-01-01",
      }),
      entry({
        category: "skills",
        slug: "editorial",
        githubUrl: "https://github.com/JSONbored/awesome-claude/blob/main/x.md",
        dateAdded: "2026-01-01",
      }),
    ]);
    expect(report.count).toBe(3);
    expect(report.summary.missingSeoCount).toBeGreaterThanOrEqual(1);
    expect(report.summary.firstPartyEditorialCount).toBeGreaterThanOrEqual(1);
    expect(report.categoryBreakdown.agents.count).toBe(1);
    expect(report.categoryBreakdown.mcp.count).toBe(1);
    expect(report.categoryBreakdown.skills.averageScore).toBeGreaterThan(0);
  });
});

describe("source-health helpers", () => {
  it("detects risk-bearing categories and meaningful notes", () => {
    expect(isRiskBearingSourceCategory("mcp")).toBe(true);
    expect(isRiskBearingSourceCategory(" agents ")).toBe(false);
    expect(hasMeaningfulNotes(["note"])).toBe(true);
    expect(hasMeaningfulNotes(["", "  "])).toBe(false);
    expect(hasMeaningfulNotes("not-array")).toBe(false);
    expect(hasMeaningfulNotes([])).toBe(false);
  });

  it("computes percentages and handles a zero total", () => {
    expect(percentOf(1, 4)).toBe(25);
    expect(percentOf(1, 0)).toBe(0);
  });

  it("derives freshness buckets and unknown states", () => {
    expect(deriveSourceFreshness({}, REFERENCE)).toEqual({
      freshness: "unknown",
      ageDays: null,
      lastActivityAt: "",
    });
    expect(deriveSourceFreshness({ dateAdded: "nope" }, REFERENCE)).toEqual({
      freshness: "unknown",
      ageDays: null,
      lastActivityAt: "",
    });

    const invalidRef = deriveSourceFreshness(
      { dateAdded: "2026-01-01" },
      Number.NaN,
    );
    expect(invalidRef.freshness).toBe("unknown");
    expect(invalidRef.ageDays).toBeNull();
    expect(invalidRef.lastActivityAt).toBe("2026-01-01T00:00:00.000Z");

    expect(
      deriveSourceFreshness({ dateAdded: "2026-05-01" }, REFERENCE).freshness,
    ).toBe("fresh");
    expect(
      deriveSourceFreshness({ dateAdded: "2025-08-01" }, REFERENCE).freshness,
    ).toBe("aging");
    expect(
      deriveSourceFreshness({ dateAdded: "2024-08-01" }, REFERENCE).freshness,
    ).toBe("stale");
    expect(
      deriveSourceFreshness({ dateAdded: "2023-01-01" }, REFERENCE).freshness,
    ).toBe("dormant");

    const fromString = deriveSourceFreshness(
      { repoUpdatedAt: "2026-05-01" },
      "2026-06-01T00:00:00.000Z",
    );
    expect(fromString.freshness).toBe("fresh");
    expect(fromString.ageDays).toBe(31);
  });

  it("defaults the reference date when omitted", () => {
    const result = deriveSourceFreshness({
      dateAdded: new Date().toISOString().slice(0, 10),
    });
    expect(result.freshness).toBe("fresh");
  });

  it("derives package trust from downloadTrust and packageVerified", () => {
    expect(derivePackageTrust({ downloadTrust: "first-party" })).toEqual({
      packageTrust: "first-party",
      packageVerified: false,
      hasPackageTrust: true,
    });
    expect(derivePackageTrust({ packageVerified: true })).toEqual({
      packageTrust: null,
      packageVerified: true,
      hasPackageTrust: true,
    });
    expect(derivePackageTrust({})).toEqual({
      packageTrust: null,
      packageVerified: false,
      hasPackageTrust: false,
    });
    expect(derivePackageTrust({ downloadTrust: "community" })).toEqual({
      packageTrust: "community",
      packageVerified: false,
      hasPackageTrust: false,
    });
  });
});

describe("buildEntrySourceHealth", () => {
  it("flags missing source and stale freshness", () => {
    const health = buildEntrySourceHealth(
      entry({
        category: "agents",
        dateAdded: "2020-01-01",
      }),
      REFERENCE,
    );
    expect(health.sourceStatus).toBe("missing");
    expect(health.freshness).toBe("dormant");
    expect(health.attentionReasons).toContain("missing-source");
    expect(health.attentionReasons).toContain("stale-source");
    expect(health.needsAttention).toBe(true);
    expect(health.riskBearing).toBe(false);
  });

  it("flags missing safety and privacy notes for risk-bearing categories", () => {
    const health = buildEntrySourceHealth(
      entry({
        category: "mcp",
        repoUrl: "https://github.com/a/b",
        dateAdded: "2026-05-01",
        safetyNotes: [],
        privacyNotes: ["  "],
      }),
      REFERENCE,
    );
    expect(health.riskBearing).toBe(true);
    expect(health.attentionReasons).toContain("missing-safety-notes");
    expect(health.attentionReasons).toContain("missing-privacy-notes");
    expect(health.hasSafetyNotes).toBe(false);
    expect(health.hasPrivacyNotes).toBe(false);
  });

  it("is clean when source, freshness, and notes are present", () => {
    const health = buildEntrySourceHealth(
      entry({
        category: "mcp",
        repoUrl: "https://github.com/a/b",
        dateAdded: "2026-05-01",
        safetyNotes: ["review before install"],
        privacyNotes: ["no telemetry"],
        downloadTrust: "first-party",
      }),
      REFERENCE,
    );
    expect(health.sourceStatus).toBe("available");
    expect(health.freshness).toBe("fresh");
    expect(health.hasPackageTrust).toBe(true);
    expect(health.needsAttention).toBe(false);
    expect(health.attentionReasons).toEqual([]);
  });

  it("treats stale freshness as an attention reason", () => {
    const health = buildEntrySourceHealth(
      entry({
        category: "agents",
        repoUrl: "https://github.com/a/b",
        dateAdded: "2024-08-01",
      }),
      REFERENCE,
    );
    expect(health.freshness).toBe("stale");
    expect(health.attentionReasons).toContain("stale-source");
  });
});

describe("buildSourceHealthReport", () => {
  it("aggregates empty registries with zero percents", () => {
    const report = buildSourceHealthReport([]);
    expect(report.count).toBe(0);
    expect(report.summary.sourceBackedPercent).toBe(0);
    expect(report.summary.packageTrustPercent).toBe(0);
    expect(report.kind).toBe("source-health-report");
    expect(report.thresholds).toEqual(SOURCE_FRESHNESS_THRESHOLDS);
  });

  it("summarizes freshness, risk, and package trust across entries", () => {
    const report = buildSourceHealthReport([
      entry({
        category: "mcp",
        slug: "fresh",
        repoUrl: "https://github.com/a/b",
        dateAdded: "2026-05-01",
        safetyNotes: ["safe"],
        privacyNotes: ["private"],
        packageVerified: true,
      }),
      entry({
        category: "skills",
        slug: "stale",
        dateAdded: "2020-01-01",
      }),
      entry({
        category: "agents",
        slug: "aging",
        documentationUrl: "https://docs.example",
        dateAdded: "2025-08-01",
      }),
    ]);
    expect(report.summary.sourceBackedCount).toBe(2);
    expect(report.summary.missingSourceCount).toBe(1);
    expect(report.summary.freshCount).toBe(1);
    expect(report.summary.agingCount).toBe(1);
    expect(report.summary.dormantCount).toBe(1);
    expect(report.summary.riskBearingCount).toBe(2);
    expect(report.summary.packageTrustCount).toBe(1);
    expect(report.summary.needsAttentionCount).toBeGreaterThan(0);
    expect(report.categoryBreakdown.mcp.count).toBe(1);
    expect(report.categoryBreakdown.mcp.sourceBacked).toBe(1);
  });

  it("builds per-category breakdown rows for empty categories", () => {
    const rows = [
      buildEntrySourceHealth(
        entry({ category: "mcp", repoUrl: "https://github.com/a/b" }),
        REFERENCE,
      ),
    ];
    const breakdown = buildSourceHealthCategoryBreakdown(rows);
    expect(breakdown.mcp.count).toBe(1);
    expect(breakdown.agents.count).toBe(0);
    expect(breakdown.agents.sourceBacked).toBe(0);
  });
});

describe("buildContentPromptReport", () => {
  it("prioritizes weak entries and respects maxPrompts", () => {
    const report = buildContentPromptReport(
      [
        entry({
          category: "agents",
          slug: "good",
          description: "D".repeat(120),
          seoTitle: "Good",
          seoDescription: "S".repeat(120),
          repoUrl: "https://github.com/a/b",
          documentationUrl: "https://docs.example",
          body: "x".repeat(220),
          installCommand: "install",
          tags: ["a", "b"],
          keywords: ["a", "b"],
          dateAdded: "2026-05-20",
        }),
        entry({
          category: "mcp",
          slug: "weak-high",
          description: "short",
          dateAdded: "2020-01-01",
        }),
        entry({
          category: "skills",
          slug: "weak-mid",
          description: "D".repeat(90),
          seoTitle: "Mid",
          seoDescription: "S".repeat(100),
          body: "x".repeat(200),
          dateAdded: "2025-01-01",
        }),
      ],
      1,
    );
    expect(report.count).toBe(1);
    expect(report.prompts[0].priority).toBe("high");
    expect(report.prompts[0].prompt).toContain("Address:");
    expect(report.kind).toBe("content-quality-prompts");
  });

  it("assigns medium and low priorities and uses the no-warning fallback prompt", () => {
    // Both fixtures avoid warnings (external repo, seo fields, copyable body,
    // action path) but stay under score 80 via stale freshness and partial SEO.
    // Use a recent dateAdded so the report's generatedAt is current, but an
    // old repoUpdatedAt so freshness stays low inside buildContentPromptReport.
    const mediumish = entry({
      category: "agents",
      slug: "medium",
      description: "D".repeat(90),
      seoTitle: "Medium",
      seoDescription: "short",
      body: "x".repeat(200),
      installCommand: "install me",
      tags: ["a", "b"],
      dateAdded: "2026-05-01",
      repoUpdatedAt: "2020-01-01",
      repoUrl: "https://github.com/a/b",
    });
    const lowish = entry({
      category: "agents",
      slug: "low",
      description: "D".repeat(120),
      seoTitle: "Low",
      seoDescription: "S".repeat(120),
      body: "x".repeat(220),
      installCommand: "install",
      tags: ["a", "b"],
      keywords: ["a", "b"],
      dateAdded: "2026-05-01",
      repoUpdatedAt: "2020-01-01",
      repoUrl: "https://github.com/a/b",
      documentationUrl: "https://docs.example",
    });

    const reportReference = new Date("2026-05-01T00:00:00.000Z");
    const mediumQuality = buildEntryQuality(mediumish, reportReference);
    const lowQuality = buildEntryQuality(lowish, reportReference);
    expect(mediumQuality.warnings).toEqual([]);
    expect(lowQuality.warnings).toEqual([]);
    expect(mediumQuality.scores.total).toBeGreaterThanOrEqual(60);
    expect(mediumQuality.scores.total).toBeLessThan(75);
    expect(lowQuality.scores.total).toBeGreaterThanOrEqual(75);
    expect(lowQuality.scores.total).toBeLessThan(80);

    const report = buildContentPromptReport([mediumish, lowish], 10);
    const bySlug = Object.fromEntries(
      report.prompts.map((prompt) => [prompt.slug, prompt]),
    );
    expect(bySlug.medium.priority).toBe("medium");
    expect(bySlug.low.priority).toBe("low");
    for (const prompt of report.prompts) {
      expect(prompt.prompt).toContain("Tighten usefulness");
    }
  });

  it("sorts prompts by score, warning count, then key", () => {
    const a = entry({
      category: "mcp",
      slug: "a-entry",
      description: "short",
      dateAdded: "2020-01-01",
    });
    const b = entry({
      category: "mcp",
      slug: "b-entry",
      description: "short",
      dateAdded: "2020-01-01",
    });
    const report = buildContentPromptReport([b, a], 10);
    expect(report.prompts[0].key <= report.prompts[1].key).toBe(true);
  });

  it("defaults maxPrompts to 30", () => {
    const entries = Array.from({ length: 40 }, (_, i) =>
      entry({
        slug: `weak-${i}`,
        description: "short",
        dateAdded: "2020-01-01",
      }),
    );
    const report = buildContentPromptReport(entries);
    expect(report.prompts.length).toBe(30);
  });
});

describe("public wrapper re-exports", () => {
  it("keeps the quality.js surface identical to the lib", async () => {
    const wrapper = await import("../packages/registry/src/quality.js");
    expect(wrapper.buildEntryQuality).toBe(buildEntryQuality);
    expect(wrapper.buildContentQualityReport).toBe(buildContentQualityReport);
    expect(wrapper.buildSourceHealthReport).toBe(buildSourceHealthReport);
    expect(wrapper.buildContentPromptReport).toBe(buildContentPromptReport);
    expect(wrapper.QUALITY_REPORT_SCHEMA_VERSION).toBe(
      QUALITY_REPORT_SCHEMA_VERSION,
    );
  });
});
