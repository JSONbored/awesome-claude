import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { browseRolloutSignalsState } from "@/lib/browse-rollout-signals-lib";

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

describe("browse rollout signals lib", () => {
  it("hides panel when fewer than two entries are scanned", () => {
    expect(browseRolloutSignalsState([], 12).showPanel).toBe(false);
    expect(browseRolloutSignalsState([strong], 12).showPanel).toBe(false);
  });

  it("shows panel and scans up to provided count", () => {
    const state = browseRolloutSignalsState([strong, medium, weak], 2);
    expect(state.showPanel).toBe(true);
    expect(state.scannedCount).toBe(2);
  });

  it("always returns six signal rows", () => {
    const state = browseRolloutSignalsState([strong, medium], 12);
    expect(state.rows).toHaveLength(6);
  });

  it("computes full source coverage as good tone", () => {
    const state = browseRolloutSignalsState([strong, medium], 12);
    const sourceRow = state.rows.find((row) => row.id === "source");
    expect(sourceRow?.coveragePercent).toBe(100);
    expect(sourceRow?.tone).toBe("good");
  });

  it("computes low coverage as risk tone", () => {
    const state = browseRolloutSignalsState([weak, weak, strong], 12);
    const reviewedRow = state.rows.find((row) => row.id === "reviewed");
    expect(reviewedRow?.coveragePercent).toBe(33);
    expect(reviewedRow?.tone).toBe("risk");
  });

  it("computes medium coverage as watch tone", () => {
    const state = browseRolloutSignalsState([strong, weak], 12);
    const reviewedRow = state.rows.find((row) => row.id === "reviewed");
    expect(reviewedRow?.coveragePercent).toBe(50);
    expect(reviewedRow?.tone).toBe("watch");
  });

  it("tracks missing required labels per entry", () => {
    const state = browseRolloutSignalsState([weak, strong], 12);
    const weakFlag = state.flaggedEntries.find(
      (entry) => entry.entryRef === "tools/weak",
    );
    expect(weakFlag?.missingRequired).toEqual([
      "Source provenance",
      "Safety notes",
      "Install payload",
    ]);
  });

  it("ranks flagged entries by required gaps and low coverage", () => {
    const state = browseRolloutSignalsState([strong, weak, medium], 12);
    expect(state.flaggedEntries[0].entryRef).toBe("tools/weak");
  });

  it("limits flagged entries to top five", () => {
    const entries = Array.from({ length: 8 }).map((_, index) =>
      entry({
        slug: `weak-${index}`,
        title: `Weak ${index}`,
        source: "unverified",
        installCommand: undefined,
        safetyNotes: undefined,
      }),
    );
    const state = browseRolloutSignalsState(entries, 12);
    expect(state.flaggedEntries).toHaveLength(5);
  });

  it("reports entry signal coverage percent", () => {
    const state = browseRolloutSignalsState([strong], 12);
    expect(state.flaggedEntries[0].signalCoveragePercent).toBe(100);
  });

  it("returns strong heading when no risk rows exist", () => {
    const state = browseRolloutSignalsState([strong, strong], 12);
    expect(state.heading).toContain("strong");
    expect(state.riskCount).toBe(0);
  });

  it("returns risk heading when risk rows exist", () => {
    const state = browseRolloutSignalsState([strong, weak, weak], 12);
    expect(state.heading).toContain("risk signal");
    expect(state.summary).toContain("Biggest gaps");
  });

  it("sets strong and risk entry counters", () => {
    const state = browseRolloutSignalsState([strong, medium, weak], 12);
    expect(state.strongCount).toBeGreaterThanOrEqual(1);
    expect(state.riskCount).toBeGreaterThanOrEqual(1);
  });

  it("uses scoped results for row counts", () => {
    const state = browseRolloutSignalsState([strong, strong, weak], 2);
    const sourceRow = state.rows.find((row) => row.id === "source");
    expect(sourceRow?.presentCount).toBe(2);
    expect(sourceRow?.missingCount).toBe(0);
  });

  it("adds row messages tied to signal tone", () => {
    const state = browseRolloutSignalsState([strong, weak], 12);
    const watchRow = state.rows.find((row) => row.id === "reviewed");
    expect(watchRow?.message).toContain("mixed");
  });

  it("keeps row labels stable", () => {
    const state = browseRolloutSignalsState([strong, weak], 12);
    expect(state.rows.map((row) => row.label)).toEqual([
      "Source provenance",
      "Metadata review",
      "Safety notes",
      "Privacy notes",
      "Package integrity",
      "Install payload",
    ]);
  });

  it("handles reviewedBy as reviewed signal", () => {
    const reviewedBy = entry({
      slug: "reviewed-by",
      title: "Reviewed By",
      reviewed: false,
      reviewedBy: "team",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/reviewed-by",
      safetyNotes: "present",
      installCommand: "npm i reviewed-by",
    });
    const state = browseRolloutSignalsState([reviewedBy, weak], 12);
    const reviewedRow = state.rows.find((row) => row.id === "reviewed");
    expect(reviewedRow?.presentCount).toBe(1);
  });

  it("handles package hash as package signal", () => {
    const hashed = entry({
      slug: "hashed",
      title: "Hashed",
      downloadSha256: "ffff",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/hashed",
      safetyNotes: "present",
      installCommand: "npm i hashed",
    });
    const state = browseRolloutSignalsState([hashed, weak], 12);
    const packageRow = state.rows.find((row) => row.id === "package");
    expect(packageRow?.presentCount).toBe(1);
  });

  it("reports default empty-state copy for no results", () => {
    const state = browseRolloutSignalsState([], 12);
    expect(state.heading).toContain("Add filters");
    expect(state.summary).toContain("guidance");
  });
});
