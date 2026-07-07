import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { countSearchResults } from "@/data/search";
import {
  BROWSE_TRUST_SIGNAL_OPTIONS,
  browseTrustRelaxationTrials,
  browseTrustSignalLabel,
  buildBrowseTrustSignalCounts,
  buildBrowseTrustUtilityOptions,
  formatBrowseTrustUtilityOptionLabel,
  isBrowseTrustSignalFilter,
  toggleBrowseTrustSignal,
} from "@/lib/browse-trust-filters-lib";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "skills",
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

const slice = {
  q: "",
  category: "",
  trust: "",
  source: "",
  signal: "",
  platform: "",
  sort: "popular" as const,
};

describe("browse trust filters lib", () => {
  it("recognizes trust signal filter ids", () => {
    expect(isBrowseTrustSignalFilter("safety-notes")).toBe(true);
    expect(isBrowseTrustSignalFilter("unknown")).toBe(false);
    expect(browseTrustSignalLabel("reviewed")).toBe("Reviewed");
    expect(browseTrustSignalLabel("bogus")).toBe("");
  });

  it("toggles trust signal selection for quick chips", () => {
    expect(toggleBrowseTrustSignal("", "reviewed")).toBe("reviewed");
    expect(toggleBrowseTrustSignal("reviewed", "reviewed")).toBe("");
    expect(toggleBrowseTrustSignal("safety-notes", "reviewed")).toBe(
      "reviewed",
    );
  });

  it("counts trust signals from the currently loaded entries", () => {
    const entries = [
      entry({ safetyNotes: "Read carefully" }),
      entry({ slug: "other", privacyNotes: "No telemetry" }),
      entry({ slug: "third", reviewed: true }),
    ];
    const counts = buildBrowseTrustSignalCounts(
      slice,
      (filters) =>
        entries.filter((row) => {
          if (filters.signal === "safety-notes")
            return Boolean(row.safetyNotes);
          if (filters.signal === "privacy-notes")
            return Boolean(row.privacyNotes);
          if (filters.signal === "reviewed") return Boolean(row.reviewed);
          return false;
        }).length,
    );

    expect(counts["safety-notes"]).toBe(1);
    expect(counts["privacy-notes"]).toBe(1);
    expect(counts["reviewed"]).toBe(1);
    expect(counts["source-backed"]).toBe(0);
  });

  it("builds facet counts through countSearchResults with active browse filters", () => {
    const entries = [
      entry({
        category: "mcp",
        slug: "safe-mcp",
        safetyNotes: "Sandboxed",
        platforms: ["claude-code"],
        source: "source-backed",
      }),
      entry({
        category: "mcp",
        slug: "other-mcp",
        platforms: ["claude-code"],
        reviewed: true,
      }),
      entry({
        category: "skills",
        slug: "skill",
        safetyNotes: "Read docs",
        platforms: ["cursor"],
      }),
    ];

    const counts = buildBrowseTrustSignalCounts(
      {
        ...slice,
        category: "mcp",
        platform: "claude-code",
      },
      (filters) => countSearchResults(filters, entries),
    );

    expect(counts["safety-notes"]).toBe(1);
    expect(counts["reviewed"]).toBe(1);
    expect(counts["source-backed"]).toBe(1);
    expect(counts["privacy-notes"]).toBe(0);
  });

  it("ignores invalid signal values when building facet counts", () => {
    const entries = [entry({ safetyNotes: "Present" })];
    const counts = buildBrowseTrustSignalCounts(
      { ...slice, signal: "not-a-signal" },
      (filters) => countSearchResults(filters, entries),
    );

    expect(counts["safety-notes"]).toBe(1);
    expect(Object.keys(counts)).toHaveLength(
      BROWSE_TRUST_SIGNAL_OPTIONS.length,
    );
  });

  it("formats utility dropdown labels with facet counts", () => {
    expect(formatBrowseTrustUtilityOptionLabel("Safety notes", 12)).toBe(
      "Safety notes (12)",
    );
    const options = buildBrowseTrustUtilityOptions({
      "safety-notes": 3,
      "privacy-notes": 2,
      "source-backed": 1,
      "trusted-package": 0,
      reviewed: 4,
      checksums: 0,
    });
    expect(options[0]).toEqual({
      id: "",
      label: "All trust signals",
      count: 0,
    });
    expect(options[1]?.label).toBe("Safety notes (3)");
    expect(options).toHaveLength(BROWSE_TRUST_SIGNAL_OPTIONS.length + 1);
  });

  it("orders empty-state relaxation trials from least specific filters first", () => {
    expect(
      browseTrustRelaxationTrials({
        ...slice,
        q: "mcp",
        category: "mcp",
        trust: "trusted",
        source: "source-backed",
        signal: "reviewed",
        platform: "claude-code",
      }).map((trial) => trial.patch),
    ).toEqual([
      { platform: "" },
      { signal: "" },
      { source: "" },
      { trust: "" },
      { category: "" },
      { q: "" },
    ]);
  });

  it("skips signal relaxation when the active signal is invalid", () => {
    expect(
      browseTrustRelaxationTrials({
        ...slice,
        signal: "not-real",
        platform: "claude-code",
      }).map((trial) => trial.label),
    ).toEqual(['Remove platform "claude-code"']);
  });

  it("returns no relaxation trials when browse filters are empty", () => {
    expect(browseTrustRelaxationTrials(slice)).toEqual([]);
  });
});
