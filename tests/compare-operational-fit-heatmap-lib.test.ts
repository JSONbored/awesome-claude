import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareOperationalFitHeatmapState,
  operationalFitToneClass,
} from "@/lib/compare-operational-fit-heatmap-lib";

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

describe("compare operational fit heatmap lib", () => {
  it("returns empty state when no entries", () => {
    const state = compareOperationalFitHeatmapState([], "team-default");
    expect(state.entries).toEqual([]);
    expect(state.bestEntryRef).toBeNull();
  });

  it("builds five axes", () => {
    const state = compareOperationalFitHeatmapState([strong], "team-default");
    expect(state.axes).toHaveLength(5);
  });

  it("returns heading per preset", () => {
    expect(
      compareOperationalFitHeatmapState([strong], "team-default").heading,
    ).toContain("team");
    expect(
      compareOperationalFitHeatmapState([strong], "security-hardening").heading,
    ).toContain("security");
    expect(
      compareOperationalFitHeatmapState([strong], "rapid-adoption").heading,
    ).toContain("rapid");
  });

  it("scores strong entry above weak entry", () => {
    const state = compareOperationalFitHeatmapState(
      [weak, strong],
      "team-default",
    );
    expect(state.entries[0].entryRef).toBe("tools/strong");
    expect(state.entries[1].entryRef).toBe("tools/weak");
  });

  it("assigns strong and weak tones", () => {
    const state = compareOperationalFitHeatmapState(
      [strong, weak],
      "team-default",
    );
    expect(
      state.entries.find((entry) => entry.entryRef === "tools/strong")?.fitTone,
    ).toBe("strong");
    expect(
      state.entries.find((entry) => entry.entryRef === "tools/weak")?.fitTone,
    ).toBe("weak");
  });

  it("sets best entry ref and weak refs", () => {
    const state = compareOperationalFitHeatmapState(
      [strong, weak],
      "team-default",
    );
    expect(state.bestEntryRef).toBe("tools/strong");
    expect(state.weakEntryRefs).toContain("tools/weak");
  });

  it("creates cells for each axis", () => {
    const state = compareOperationalFitHeatmapState([strong], "team-default");
    expect(state.entries[0].cells).toHaveLength(5);
  });

  it("shows provenance reason when source and review present", () => {
    const state = compareOperationalFitHeatmapState([strong], "team-default");
    const provenance = state.entries[0].cells.find(
      (cell) => cell.axisId === "provenance",
    );
    expect(provenance?.reason).toContain("Source and review");
  });

  it("shows safety reason when notes missing", () => {
    const state = compareOperationalFitHeatmapState([weak], "team-default");
    const safety = state.entries[0].cells.find(
      (cell) => cell.axisId === "safety",
    );
    expect(safety?.reason).toContain("missing");
  });

  it("changes score by preset for mixed entry", () => {
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
    });
    const security = compareOperationalFitHeatmapState(
      [mixed],
      "security-hardening",
    );
    const speed = compareOperationalFitHeatmapState([mixed], "rapid-adoption");
    expect(security.entries[0].totalScore).not.toBe(
      speed.entries[0].totalScore,
    );
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
    const state = compareOperationalFitHeatmapState(
      [reviewedBy],
      "team-default",
    );
    const provenance = state.entries[0].cells.find(
      (cell) => cell.axisId === "provenance",
    );
    expect(provenance?.score).toBeGreaterThan(60);
  });

  it("uses checksum as integrity signal", () => {
    const hashed = entry({
      slug: "hashed",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/hashed",
      safetyNotes: "present",
      installCommand: "npm i hashed",
      packageVerified: undefined,
      downloadSha256: "ffff",
    });
    const state = compareOperationalFitHeatmapState([hashed], "team-default");
    const integrity = state.entries[0].cells.find(
      (cell) => cell.axisId === "integrity",
    );
    expect(integrity?.score).toBe(100);
  });

  it("returns deterministic title ordering on ties", () => {
    const a = entry({ slug: "a", title: "A" });
    const b = entry({ slug: "b", title: "B" });
    const state = compareOperationalFitHeatmapState([b, a], "team-default");
    expect(state.entries[0].title).toBe("A");
  });

  it("generates summary for weak entries", () => {
    const state = compareOperationalFitHeatmapState([weak], "team-default");
    expect(state.summary).toContain("weak operational fit");
  });

  it("generates summary when weak entries absent", () => {
    const state = compareOperationalFitHeatmapState([strong], "team-default");
    expect(state.summary).toContain("strong operational fit");
  });
});

describe("operationalFitToneClass", () => {
  it("maps each tone to its chip classes", () => {
    expect(operationalFitToneClass("strong")).toContain("text-trust-trusted");
    expect(operationalFitToneClass("mixed")).toContain("text-amber-900");
    expect(operationalFitToneClass("weak")).toContain("text-trust-blocked");
  });
});
