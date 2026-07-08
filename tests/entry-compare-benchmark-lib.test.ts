import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareBenchmarkVerdictClass,
  entryCompareBenchmarkState,
} from "@/lib/entry-compare-benchmark-lib";

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

const target = entry({
  slug: "target",
  title: "Target",
  trust: "review",
  source: "source-backed",
  sourceUrl: "https://github.com/acme/target",
  reviewed: true,
  safetyNotes: "present",
  installCommand: "npm i target",
});

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

const weak = entry({
  slug: "weak",
  title: "Weak",
  trust: "limited",
  source: "unverified",
  reviewed: false,
  safetyNotes: undefined,
  privacyNotes: undefined,
  packageVerified: undefined,
  installCommand: undefined,
});

describe("entry compare benchmark lib", () => {
  it("hides panel when no compare peers exist", () => {
    const state = entryCompareBenchmarkState(target, "balanced", [target]);
    expect(state.showPanel).toBe(false);
    expect(state.rows).toEqual([]);
  });

  it("returns heading per preset", () => {
    expect(
      entryCompareBenchmarkState(target, "balanced", [strong]).heading,
    ).toContain("balanced");
    expect(
      entryCompareBenchmarkState(target, "security", [strong]).heading,
    ).toContain("security");
    expect(
      entryCompareBenchmarkState(target, "rollout", [strong]).heading,
    ).toContain("rollout");
  });

  it("builds benchmark rows excluding target entry", () => {
    const state = entryCompareBenchmarkState(target, "balanced", [
      target,
      strong,
      weak,
    ]);
    expect(state.rows).toHaveLength(2);
    expect(state.rows.some((row) => row.entryRef === "tools/target")).toBe(
      false,
    );
  });

  it("ranks stronger entry above weaker entry", () => {
    const state = entryCompareBenchmarkState(target, "balanced", [
      weak,
      strong,
    ]);
    expect(state.rows[0].entryRef).toBe("tools/strong");
    expect(state.rows[1].entryRef).toBe("tools/weak");
  });

  it("marks stronger and weaker verdicts", () => {
    const state = entryCompareBenchmarkState(weak, "balanced", [strong, weak]);
    expect(
      state.rows.find((row) => row.entryRef === "tools/strong")?.verdict,
    ).toBe("stronger");
    const reverse = entryCompareBenchmarkState(strong, "balanced", [weak]);
    expect(
      reverse.rows.find((row) => row.entryRef === "tools/weak")?.verdict,
    ).toBe("weaker");
  });

  it("tracks stronger and weaker counts", () => {
    const state = entryCompareBenchmarkState(target, "balanced", [
      strong,
      weak,
    ]);
    expect(state.strongerCount).toBeGreaterThanOrEqual(0);
    expect(state.weakerCount).toBeGreaterThanOrEqual(0);
  });

  it("includes four dimension scores per row", () => {
    const state = entryCompareBenchmarkState(target, "balanced", [strong]);
    expect(state.rows[0].dimensions).toHaveLength(4);
  });

  it("changes score profile between security and rollout presets", () => {
    const installOnly = entry({
      slug: "install-only",
      title: "Install only",
      trust: "review",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/install-only",
      reviewed: true,
      safetyNotes: "present",
      privacyNotes: "present",
      packageVerified: undefined,
      installCommand: "npm i install-only",
    });
    const security = entryCompareBenchmarkState(installOnly, "security", [
      strong,
    ]);
    const rollout = entryCompareBenchmarkState(installOnly, "rollout", [
      strong,
    ]);
    expect(security.targetScore).not.toBe(rollout.targetScore);
  });

  it("uses reviewedBy as reviewed signal", () => {
    const reviewedBy = entry({
      slug: "reviewed-by",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/reviewed-by",
      reviewed: false,
      reviewedBy: "ops",
      safetyNotes: "present",
      installCommand: "npm i reviewed-by",
    });
    const state = entryCompareBenchmarkState(reviewedBy, "balanced", [weak]);
    expect(state.targetScore).toBeGreaterThan(
      entryCompareBenchmarkState(weak, "balanced", []).targetScore,
    );
  });

  it("uses checksum as package signal", () => {
    const hashed = entry({
      slug: "hashed",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/hashed",
      safetyNotes: "present",
      installCommand: "npm i hashed",
      packageVerified: undefined,
      downloadSha256: "ffff",
    });
    const state = entryCompareBenchmarkState(hashed, "balanced", []);
    expect(state.targetScore).toBeGreaterThan(0);
  });

  it("returns deterministic title ordering on ties", () => {
    const a = entry({ slug: "a", title: "A" });
    const b = entry({ slug: "b", title: "B" });
    const state = entryCompareBenchmarkState(target, "balanced", [b, a]);
    expect(state.rows[0].title).toBe("A");
  });

  it("generates benchmark summary when peers exist", () => {
    const state = entryCompareBenchmarkState(target, "balanced", [
      strong,
      weak,
    ]);
    expect(state.benchmarkSummary).toBeTruthy();
  });

  it("generates lead summary when no stronger peers", () => {
    const state = entryCompareBenchmarkState(strong, "balanced", [
      weak,
      target,
    ]);
    expect(state.summary).toContain("leads the compare tray");
  });

  it("maps verdict classes for presentation", () => {
    expect(compareBenchmarkVerdictClass("stronger")).toContain("trust-trusted");
    expect(compareBenchmarkVerdictClass("weaker")).toContain("trust-blocked");
    expect(compareBenchmarkVerdictClass("aligned")).toContain("border-border");
  });

  it("includes row summary with delta magnitude", () => {
    const state = entryCompareBenchmarkState(weak, "balanced", [strong]);
    const row = state.rows[0];
    expect(row.summary).toContain("points");
  });
});
