import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  browseConfidenceBandClass,
  browseDecisionConfidenceState,
} from "@/lib/browse-decision-confidence-lib";

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

describe("browse decision confidence lib", () => {
  it("returns empty rows when no entries", () => {
    const state = browseDecisionConfidenceState([], "balanced");
    expect(state.entries).toEqual([]);
    expect(state.scannedCount).toBe(0);
  });

  it("returns heading per preset", () => {
    expect(
      browseDecisionConfidenceState([strong], "balanced").heading,
    ).toContain("balanced");
    expect(browseDecisionConfidenceState([strong], "strict").heading).toContain(
      "strict",
    );
    expect(browseDecisionConfidenceState([strong], "pilot").heading).toContain(
      "pilot",
    );
  });

  it("ranks strong entry above weak entry", () => {
    const state = browseDecisionConfidenceState([weak, strong], "balanced");
    expect(state.entries[0].entryRef).toBe("tools/strong");
    expect(state.entries[1].entryRef).toBe("tools/weak");
  });

  it("assigns high and low bands", () => {
    const state = browseDecisionConfidenceState([strong, weak], "strict");
    expect(
      state.entries.find((entry) => entry.entryRef === "tools/strong")?.band,
    ).toBe("high");
    expect(
      state.entries.find((entry) => entry.entryRef === "tools/weak")?.band,
    ).toBe("low");
  });

  it("prevents blocked entries from receiving high-confidence recommendations", () => {
    const blocked = entry({
      slug: "blocked",
      title: "Blocked",
      trust: "blocked",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/blocked",
      reviewed: true,
      safetyNotes: "present",
      privacyNotes: "present",
      packageVerified: true,
      downloadSha256: "abc",
      installCommand: "npm i blocked",
    });

    const state = browseDecisionConfidenceState([blocked], "strict");

    expect(state.entries[0].confidenceScore).toBe(76);
    expect(state.entries[0].band).toBe("low");
    expect(state.entries[0].recommendation).toContain("Hold adoption");
    expect(state.highCount).toBe(0);
    expect(state.lowRefs).toContain("tools/blocked");
  });

  it("tracks band counters", () => {
    const state = browseDecisionConfidenceState([strong, weak], "balanced");
    expect(state.highCount).toBeGreaterThanOrEqual(0);
    expect(state.lowCount).toBeGreaterThanOrEqual(0);
  });

  it("captures missing signal labels", () => {
    const state = browseDecisionConfidenceState([weak], "balanced");
    expect(state.entries[0].missingSignals).toContain("Source provenance");
    expect(state.entries[0].missingSignals).toContain("Install payload");
  });

  it("changes confidence profile across presets", () => {
    const installOnly = entry({
      slug: "install-only",
      title: "Install only",
      trust: "review",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/install-only",
      reviewed: true,
      safetyNotes: "present",
      privacyNotes: "present",
      packageVerified: true,
      installCommand: undefined,
      configSnippet: undefined,
      copySnippet: undefined,
      fullCopy: undefined,
    });
    const strict = browseDecisionConfidenceState([installOnly], "strict");
    const pilot = browseDecisionConfidenceState([installOnly], "pilot");
    expect(strict.entries[0].confidenceScore).not.toBe(
      pilot.entries[0].confidenceScore,
    );
  });

  it("uses reviewedBy as review signal", () => {
    const reviewedBy = entry({
      slug: "reviewed-by",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/reviewed-by",
      reviewed: false,
      reviewedBy: "ops",
      safetyNotes: "present",
      installCommand: "npm i reviewed-by",
    });
    const state = browseDecisionConfidenceState([reviewedBy], "balanced");
    expect(state.entries[0].missingSignals).not.toContain("Metadata review");
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
    const state = browseDecisionConfidenceState([hashed], "balanced");
    expect(state.entries[0].missingSignals).not.toContain("Package integrity");
  });

  it("enforces deterministic ordering on ties", () => {
    const a = entry({ slug: "a", title: "A" });
    const b = entry({ slug: "b", title: "B" });
    const state = browseDecisionConfidenceState([b, a], "balanced");
    expect(state.entries[0].title).toBe("A");
  });

  it("limits results by maxEntries", () => {
    const state = browseDecisionConfidenceState(
      [strong, weak, strong],
      "balanced",
      2,
    );
    expect(state.entries).toHaveLength(2);
  });

  it("includes low refs list", () => {
    const state = browseDecisionConfidenceState([weak], "balanced");
    expect(state.lowRefs).toContain("tools/weak");
  });

  it("reports low confidence summary when low entries exist", () => {
    const state = browseDecisionConfidenceState([weak], "balanced");
    expect(state.summary).toContain("low-confidence");
  });

  it("reports high confidence summary when no low entries exist", () => {
    const state = browseDecisionConfidenceState([strong], "balanced");
    expect(state.summary).toContain("high-confidence");
  });

  it("maps band classes for UI usage", () => {
    expect(browseConfidenceBandClass("high")).toContain("trust-trusted");
    expect(browseConfidenceBandClass("medium")).toContain("amber");
    expect(browseConfidenceBandClass("low")).toContain("trust-blocked");
  });
});
