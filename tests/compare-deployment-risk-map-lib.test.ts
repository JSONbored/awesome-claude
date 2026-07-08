import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { compareDeploymentRiskMapState } from "@/lib/compare-deployment-risk-map-lib";

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

const lowRisk = entry({
  slug: "low",
  title: "Low",
  trust: "trusted",
  source: "source-backed",
  sourceUrl: "https://github.com/acme/low",
  reviewed: true,
  safetyNotes: "present",
  privacyNotes: "present",
  packageVerified: true,
  downloadSha256: "abc",
  installCommand: "npm i low",
});

const highRisk = entry({
  slug: "high",
  title: "High",
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

describe("compare deployment risk map lib", () => {
  it("returns empty summary when no entries", () => {
    const state = compareDeploymentRiskMapState([], "balanced");
    expect(state.entries).toEqual([]);
    expect(state.summary).toContain("Add entries");
  });

  it("returns heading per preset", () => {
    expect(
      compareDeploymentRiskMapState([lowRisk], "balanced").heading,
    ).toContain("balanced");
    expect(
      compareDeploymentRiskMapState([lowRisk], "security").heading,
    ).toContain("security");
    expect(compareDeploymentRiskMapState([lowRisk], "speed").heading).toContain(
      "speed",
    );
  });

  it("builds six weighted rows", () => {
    const state = compareDeploymentRiskMapState([lowRisk], "balanced");
    expect(state.rows).toHaveLength(6);
  });

  it("scores high-risk entries above low-risk entries", () => {
    const state = compareDeploymentRiskMapState(
      [lowRisk, highRisk],
      "balanced",
    );
    expect(state.entries[0].entryRef).toBe("tools/high");
    expect(state.entries[0].riskScore).toBeGreaterThan(
      state.entries[1].riskScore,
    );
  });

  it("assigns risk bands by score", () => {
    const state = compareDeploymentRiskMapState(
      [lowRisk, highRisk],
      "balanced",
    );
    const high = state.entries.find((entry) => entry.entryRef === "tools/high");
    const low = state.entries.find((entry) => entry.entryRef === "tools/low");
    expect(high?.riskBand).toBe("high");
    expect(low?.riskBand).toBe("low");
  });

  it("tracks high and low risk counters", () => {
    const state = compareDeploymentRiskMapState(
      [lowRisk, highRisk],
      "balanced",
    );
    expect(state.highRiskCount).toBe(1);
    expect(state.lowRiskCount).toBe(1);
  });

  it("adds top risk reasons for missing signals", () => {
    const state = compareDeploymentRiskMapState([highRisk], "balanced");
    expect(state.entries[0].topRiskReasons.length).toBeGreaterThan(0);
    expect(state.entries[0].topRiskReasons[0]).toContain("missing");
  });

  it("keeps reasons capped to top three", () => {
    const state = compareDeploymentRiskMapState([highRisk], "balanced");
    expect(state.entries[0].topRiskReasons.length).toBeLessThanOrEqual(3);
  });

  it("changes score profile between security and speed presets", () => {
    const mixed = entry({
      slug: "mixed",
      title: "Mixed",
      trust: "review",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/mixed",
      reviewed: false,
      safetyNotes: "present",
      privacyNotes: undefined,
      packageVerified: undefined,
      installCommand: undefined,
      configSnippet: undefined,
      copySnippet: undefined,
      fullCopy: undefined,
    });
    const security = compareDeploymentRiskMapState([mixed], "security");
    const speed = compareDeploymentRiskMapState([mixed], "speed");
    expect(security.entries[0].riskScore).not.toBe(speed.entries[0].riskScore);
  });

  it("reports confidence from covered weights", () => {
    const low = compareDeploymentRiskMapState([lowRisk], "balanced");
    const high = compareDeploymentRiskMapState([highRisk], "balanced");
    expect(low.entries[0].confidenceScore).toBeGreaterThan(
      high.entries[0].confidenceScore,
    );
  });

  it("includes mitigation summary copy", () => {
    const state = compareDeploymentRiskMapState([highRisk], "balanced");
    expect(state.entries[0].mitigationSummary.length).toBeGreaterThan(10);
  });

  it("includes high risk summary when high entries exist", () => {
    const state = compareDeploymentRiskMapState(
      [highRisk, lowRisk],
      "balanced",
    );
    expect(state.summary).toContain("high risk");
  });

  it("includes low risk summary when no high entries", () => {
    const state = compareDeploymentRiskMapState([lowRisk], "balanced");
    expect(state.summary).toContain("No high-risk");
  });

  it("uses reviewedBy as reviewed signal", () => {
    const reviewedBy = entry({
      slug: "reviewed-by",
      title: "Reviewed By",
      reviewed: false,
      reviewedBy: "ops",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/reviewed-by",
      safetyNotes: "present",
      installCommand: "npm i reviewed-by",
    });
    const state = compareDeploymentRiskMapState([reviewedBy], "balanced");
    expect(state.entries[0].riskScore).toBeLessThan(90);
  });

  it("uses checksum as package signal", () => {
    const hashed = entry({
      slug: "hashed",
      title: "Hashed",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/hashed",
      safetyNotes: "present",
      installCommand: "npm i hashed",
      packageVerified: undefined,
      downloadSha256: "ffff",
    });
    const state = compareDeploymentRiskMapState([hashed], "balanced");
    expect(state.entries[0].topRiskReasons.join(" ")).not.toContain(
      "Package integrity missing",
    );
  });

  it("keeps deterministic ordering on ties by title", () => {
    const a = entry({ slug: "a", title: "A" });
    const b = entry({ slug: "b", title: "B" });
    const state = compareDeploymentRiskMapState([b, a], "balanced");
    expect(state.entries[0].title).toBe("A");
  });
});
