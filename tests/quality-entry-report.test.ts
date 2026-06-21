import { describe, expect, it } from "vitest";

import {
  buildEntryQuality,
  buildContentQualityReport,
} from "../packages/registry/src/quality.js";

const REFERENCE = new Date("2026-06-01T00:00:00Z");

const richEntry = {
  category: "agents",
  slug: "rich",
  title: "Rich",
  description: "D".repeat(120),
  seoTitle: "Rich SEO Title",
  seoDescription: "S".repeat(120),
  repoUrl: "https://github.com/a/b",
  documentationUrl: "https://docs.example",
  dateAdded: "2026-05-20",
  body: "x".repeat(220),
};

const thinEntry = {
  category: "mcp",
  slug: "thin",
  title: "Thin",
  description: "short",
  dateAdded: "2023-01-01",
};

describe("buildEntryQuality", () => {
  it("keys the report and exposes all score dimensions", () => {
    const quality = buildEntryQuality(richEntry, REFERENCE);
    expect(quality.key).toBe("agents:rich");
    expect(Object.keys(quality.scores).sort()).toEqual([
      "copyability",
      "freshness",
      "seo",
      "source",
      "total",
      "usefulness",
    ]);
    // Every dimension is a 0-100 score.
    for (const value of Object.values(quality.scores)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
  });

  it("classifies repo+docs provenance and scores it above a source-free entry", () => {
    const quality = buildEntryQuality(richEntry, REFERENCE);
    expect(quality.provenance.sourceQuality).toBe("repo-and-docs");
    // Having both a repo and docs outscores the thin, source-free entry.
    expect(quality.scores.source).toBeGreaterThan(
      buildEntryQuality(thinEntry, REFERENCE).scores.source,
    );
  });

  it("warns about missing SEO fields and weak provenance for a thin entry", () => {
    const quality = buildEntryQuality(thinEntry, REFERENCE);
    expect(quality.warnings.length).toBeGreaterThan(0);
    expect(quality.warnings.join("\n")).toContain("seo");
    // A stale dateAdded relative to the reference lowers freshness.
    expect(quality.scores.freshness).toBeLessThan(
      buildEntryQuality(richEntry, REFERENCE).scores.freshness,
    );
  });
});

describe("buildContentQualityReport", () => {
  it("aggregates per-entry quality into a versioned report", () => {
    const report = buildContentQualityReport([richEntry, thinEntry]);
    expect(report.kind).toBeTruthy();
    expect(report.count).toBe(2);
    expect(report.entries).toHaveLength(2);
    expect(typeof report.schemaVersion).toBe("number");
  });

  it("summarizes averages and quality-gap counts", () => {
    const report = buildContentQualityReport([richEntry, thinEntry]);
    const { summary } = report;
    expect(summary.averageScore).toBeGreaterThanOrEqual(0);
    expect(summary.averageScore).toBeLessThanOrEqual(100);
    // The thin entry is missing seoTitle and seoDescription.
    expect(summary.missingSeoCount).toBeGreaterThanOrEqual(1);
  });
});
