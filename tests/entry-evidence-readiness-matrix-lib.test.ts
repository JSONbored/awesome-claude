import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { entryEvidenceReadinessMatrixState } from "@/lib/entry-evidence-readiness-matrix-lib";

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

const strong = entry({
  slug: "strong",
  title: "Strong",
  trust: "trusted",
  source: "source-backed",
  sourceUrl: "https://github.com/acme/strong",
  reviewed: true,
  safetyNotes: "present",
  privacyNotes: "present",
  packageVerified: true,
  downloadSha256: "abc",
  installCommand: "npm i strong",
});

const medium = entry({
  slug: "medium",
  title: "Medium",
  trust: "review",
  source: "source-backed",
  sourceUrl: "https://github.com/acme/medium",
  reviewed: false,
  safetyNotes: "present",
  privacyNotes: undefined,
  packageVerified: undefined,
  installCommand: "npm i medium",
});

const weak = entry({
  slug: "weak",
  title: "Weak",
  trust: "limited",
  source: "unverified",
  sourceUrl: undefined,
  reviewed: false,
  safetyNotes: undefined,
  privacyNotes: undefined,
  packageVerified: undefined,
  installCommand: undefined,
  configSnippet: undefined,
  copySnippet: undefined,
  fullCopy: undefined,
});

describe("entry evidence readiness matrix lib", () => {
  it("returns heading per preset", () => {
    expect(
      entryEvidenceReadinessMatrixState(strong, "balanced", []).heading,
    ).toContain("balanced");
    expect(
      entryEvidenceReadinessMatrixState(strong, "strict", []).heading,
    ).toContain("strict");
    expect(
      entryEvidenceReadinessMatrixState(strong, "pilot", []).heading,
    ).toContain("pilot");
  });

  it("creates six signal cells", () => {
    const state = entryEvidenceReadinessMatrixState(strong, "balanced", []);
    expect(state.cells).toHaveLength(6);
  });

  it("marks present cells as complete", () => {
    const state = entryEvidenceReadinessMatrixState(strong, "strict", []);
    expect(state.cells.every((cell) => cell.tone === "complete")).toBe(true);
  });

  it("marks missing required signals as critical", () => {
    const state = entryEvidenceReadinessMatrixState(weak, "strict", []);
    expect(
      state.cells.some((cell) => cell.required && cell.tone === "critical"),
    ).toBe(true);
  });

  it("marks missing optional signals as warning", () => {
    const state = entryEvidenceReadinessMatrixState(medium, "balanced", []);
    const privacy = state.cells.find((cell) => cell.id === "privacy");
    expect(privacy?.required).toBe(false);
    expect(privacy?.tone).toBe("warning");
  });

  it("tracks required missing labels", () => {
    const state = entryEvidenceReadinessMatrixState(weak, "strict", []);
    expect(state.requiredMissing).toContain("Source provenance");
    expect(state.requiredMissing.length).toBeGreaterThan(2);
  });

  it("computes complete count from present cells", () => {
    const state = entryEvidenceReadinessMatrixState(strong, "strict", []);
    expect(state.completeCount).toBe(6);
  });

  it("generates low risk score for fully-covered trusted entry", () => {
    const state = entryEvidenceReadinessMatrixState(strong, "strict", []);
    expect(state.riskScore).toBeLessThan(20);
  });

  it("generates high risk score for limited entry with gaps", () => {
    const state = entryEvidenceReadinessMatrixState(weak, "strict", []);
    expect(state.riskScore).toBeGreaterThanOrEqual(60);
  });

  it("includes missing summary when required evidence absent", () => {
    const state = entryEvidenceReadinessMatrixState(weak, "strict", []);
    expect(state.summary).toContain("Missing required evidence");
  });

  it("includes all-clear summary when required evidence covered", () => {
    const state = entryEvidenceReadinessMatrixState(strong, "strict", []);
    expect(state.summary).toContain("All strict evidence gates are covered");
  });

  it("removes target entry from benchmarks using sameEntry", () => {
    const state = entryEvidenceReadinessMatrixState(strong, "balanced", [
      strong,
      medium,
    ]);
    expect(
      state.benchmarks.some((item) => item.entryRef === "tools/strong"),
    ).toBe(false);
    expect(
      state.benchmarks.some((item) => item.entryRef === "tools/medium"),
    ).toBe(true);
  });

  it("sorts benchmarks by score descending", () => {
    const state = entryEvidenceReadinessMatrixState(medium, "balanced", [
      weak,
      strong,
    ]);
    expect(state.benchmarks[0].entryRef).toBe("tools/strong");
  });

  it("flags stronger and weaker benchmark comparisons", () => {
    const state = entryEvidenceReadinessMatrixState(medium, "balanced", [
      strong,
      weak,
    ]);
    const stronger = state.benchmarks.find(
      (item) => item.entryRef === "tools/strong",
    );
    const weakerOne = state.benchmarks.find(
      (item) => item.entryRef === "tools/weak",
    );
    expect(stronger?.strongerThanTarget).toBe(true);
    expect(weakerOne?.weakerThanTarget).toBe(true);
  });

  it("builds benchmark summary text when compare items exist", () => {
    const state = entryEvidenceReadinessMatrixState(medium, "balanced", [
      strong,
      weak,
    ]);
    expect(state.benchmarkSummary).toBeTruthy();
  });

  it("returns null benchmark summary with no compare items", () => {
    const state = entryEvidenceReadinessMatrixState(medium, "balanced", []);
    expect(state.benchmarkSummary).toBeNull();
  });

  it("limits benchmarks to top four entries", () => {
    const compare = [strong, medium, weak].concat(
      Array.from({ length: 4 }).map((_, i) =>
        entry({
          slug: `other-${i}`,
          title: `Other ${i}`,
          source: "source-backed",
          sourceUrl: `https://example.com/${i}`,
          installCommand: "npm i other",
        }),
      ),
    );
    const state = entryEvidenceReadinessMatrixState(
      medium,
      "balanced",
      compare,
    );
    expect(state.benchmarks.length).toBeLessThanOrEqual(4);
  });

  it("uses reviewedBy as reviewed evidence", () => {
    const reviewedBy = entry({
      slug: "reviewed-by",
      reviewed: false,
      reviewedBy: "ops",
      source: "source-backed",
      sourceUrl: "https://example.com/reviewed",
      safetyNotes: "present",
      installCommand: "npm i reviewed",
    });
    const state = entryEvidenceReadinessMatrixState(reviewedBy, "balanced", []);
    expect(state.cells.find((cell) => cell.id === "reviewed")?.present).toBe(
      true,
    );
  });

  it("uses checksum as package evidence", () => {
    const hashed = entry({
      slug: "hashed",
      source: "source-backed",
      sourceUrl: "https://example.com/hashed",
      safetyNotes: "present",
      installCommand: "npm i hashed",
      packageVerified: undefined,
      downloadSha256: "ffff",
    });
    const state = entryEvidenceReadinessMatrixState(hashed, "balanced", []);
    expect(state.cells.find((cell) => cell.id === "package")?.present).toBe(
      true,
    );
  });

  it("pilot preset keeps privacy optional", () => {
    const state = entryEvidenceReadinessMatrixState(weak, "pilot", []);
    const privacy = state.cells.find((cell) => cell.id === "privacy");
    expect(privacy?.required).toBe(false);
  });
});
