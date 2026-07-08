import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { compareEvidenceGapsState } from "@/lib/compare-evidence-gaps-lib";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "tools",
    slug: "fixture",
    title: "Fixture",
    description: "Fixture description",
    author: "Author",
    tags: [],
    platforms: ["claude-code"],
    installType: "manual",
    trust: "review",
    source: "unverified",
    dateAdded: "2026-01-01",
    ...overrides,
  } as Entry;
}

describe("compare evidence gaps lib", () => {
  it("returns default summary for empty compare set", () => {
    const state = compareEvidenceGapsState([]);
    expect(state.comparedCount).toBe(0);
    expect(state.rows).toHaveLength(6);
    expect(state.headline).toContain("Add more entries");
  });

  it("builds per-entry signal cells and missing labels", () => {
    const state = compareEvidenceGapsState([entry()]);
    expect(state.entries).toHaveLength(1);
    expect(state.entries[0].missingLabels.length).toBeGreaterThan(0);
  });

  it("reports full coverage as low severity", () => {
    const strong = entry({
      trust: "trusted",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/strong",
      reviewed: true,
      safetyNotes: "yes",
      privacyNotes: "yes",
      packageVerified: true,
      downloadSha256: "abc",
      installCommand: "npm i strong",
    });
    const state = compareEvidenceGapsState([strong]);
    expect(state.rows.every((row) => row.severity === "low")).toBe(true);
  });

  it("reports high severity when coverage drops below 50%", () => {
    const strong = entry({
      slug: "strong",
      title: "Strong",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/strong",
      safetyNotes: "yes",
      privacyNotes: "yes",
      reviewed: true,
      packageVerified: true,
      installCommand: "npm i strong",
    });
    const weak = entry({
      slug: "weak",
      title: "Weak",
      source: "unverified",
      sourceUrl: undefined,
      safetyNotes: undefined,
      privacyNotes: undefined,
      reviewed: false,
      packageVerified: undefined,
      installCommand: undefined,
      configSnippet: undefined,
      fullCopy: undefined,
      copySnippet: undefined,
    });
    const state = compareEvidenceGapsState([strong, weak, weak]);
    expect(state.rows.some((row) => row.severity === "high")).toBe(true);
    expect(state.highSeverityCount).toBeGreaterThan(0);
  });

  it("tracks missing refs for each gap row", () => {
    const a = entry({
      slug: "a",
      title: "A",
      source: "unverified",
      sourceUrl: undefined,
    });
    const b = entry({
      slug: "b",
      title: "B",
      source: "source-backed",
      sourceUrl: "https://x.com",
    });
    const state = compareEvidenceGapsState([a, b]);
    const sourceRow = state.rows.find((row) => row.id === "source");
    expect(sourceRow?.missingRefs).toContain("tools/a");
    expect(sourceRow?.missingRefs).not.toContain("tools/b");
  });

  it("computes coverage percentage from present and missing counts", () => {
    const withSafety = entry({ slug: "a", safetyNotes: "yes" });
    const withoutSafety = entry({ slug: "b", safetyNotes: undefined });
    const state = compareEvidenceGapsState([withSafety, withoutSafety]);
    const safetyRow = state.rows.find((row) => row.id === "safety");
    expect(safetyRow?.presentCount).toBe(1);
    expect(safetyRow?.missingCount).toBe(1);
    expect(safetyRow?.coveragePercent).toBe(50);
  });

  it("marks medium severity at 50-79 coverage", () => {
    const a = entry({ slug: "a", reviewed: true });
    const b = entry({ slug: "b", reviewed: true });
    const c = entry({ slug: "c", reviewed: false });
    const state = compareEvidenceGapsState([a, b, c]);
    const reviewedRow = state.rows.find((row) => row.id === "reviewed");
    expect(reviewedRow?.severity).toBe("medium");
  });

  it("produces strong headline when no high-severity rows exist", () => {
    const a = entry({
      slug: "a",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/a",
      reviewed: true,
      safetyNotes: "yes",
      privacyNotes: "yes",
      packageVerified: true,
      installCommand: "npm i a",
    });
    const b = entry({
      slug: "b",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/b",
      reviewed: true,
      safetyNotes: "yes",
      privacyNotes: "yes",
      packageVerified: true,
      installCommand: "npm i b",
    });
    const state = compareEvidenceGapsState([a, b]);
    expect(state.highSeverityCount).toBe(0);
    expect(state.headline).toContain("strong");
  });

  it("summarizes high severity labels when present", () => {
    const a = entry({ slug: "a", source: "unverified", sourceUrl: undefined });
    const b = entry({ slug: "b", source: "unverified", sourceUrl: undefined });
    const state = compareEvidenceGapsState([a, b]);
    expect(state.highSeverityCount).toBeGreaterThan(0);
    expect(state.summary).toContain("Largest gaps");
  });

  it("includes gap-specific hints", () => {
    const state = compareEvidenceGapsState([entry()]);
    expect(state.rows.find((row) => row.id === "source")?.hint).toContain(
      "ownership",
    );
    expect(state.rows.find((row) => row.id === "privacy")?.hint).toContain(
      "data-flow",
    );
  });

  it("includes install gap hints when payload is missing", () => {
    const noInstall = entry({
      installCommand: undefined,
      configSnippet: undefined,
      fullCopy: undefined,
      copySnippet: undefined,
    });
    const state = compareEvidenceGapsState([noInstall]);
    const installRow = state.rows.find((row) => row.id === "install");
    expect(installRow?.hint).toContain("adoption");
  });
});
