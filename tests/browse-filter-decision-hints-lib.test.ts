import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  browseActiveFilterCount,
  browseFilteredTrustMixHint,
  browseFilterDecisionUiState,
} from "@/lib/browse-filter-decision-hints-lib";

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

const emptySlice = {
  q: "",
  category: "",
  trust: "",
  source: "",
  signal: "",
  platform: "",
  sort: "popular" as const,
};

describe("browse filter decision hints lib", () => {
  it("counts active browse filters from URL slice", () => {
    expect(browseActiveFilterCount(emptySlice)).toBe(0);
    expect(
      browseActiveFilterCount({
        ...emptySlice,
        trust: "trusted",
        signal: "reviewed",
      }),
    ).toBe(2);
  });

  it("summarizes mixed trust levels in filtered results", () => {
    expect(
      browseFilteredTrustMixHint([
        entry({ trust: "trusted" }),
        entry({ trust: "review", slug: "two" }),
      ]),
    ).toBe(
      "1 trusted · 1 review in this set — compare to see which signals differ.",
    );
    expect(
      browseFilteredTrustMixHint([entry({ trust: "trusted" })]),
    ).toBeNull();
  });

  it("prioritizes trust-mix hints over signal-filter guidance", () => {
    expect(
      browseFilterDecisionUiState({ ...emptySlice, signal: "safety-notes" }, [
        entry({ trust: "trusted" }),
        entry({ trust: "review", slug: "two" }),
      ]),
    ).toEqual({
      hint: "1 trusted · 1 review in this set — compare to see which signals differ.",
      kind: "trust-mix",
    });
  });

  it("builds trust-signal and narrow-set decision hints", () => {
    expect(
      browseFilterDecisionUiState(
        { ...emptySlice, signal: "privacy-notes" },
        [entry(), entry({ slug: "two" })],
        0,
      ),
    ).toEqual({
      hint: "Privacy notes filter active — add entries to compare trust side by side.",
      kind: "signal-filter",
    });

    expect(
      browseFilterDecisionUiState(
        { ...emptySlice, category: "skills", platform: "claude-code" },
        [entry(), entry({ slug: "two" })],
        2,
      ),
    ).toEqual({
      hint: "Narrow filter set — open compare to review trust differences.",
      kind: "narrow-set",
    });
  });

  it("returns null when filters are inactive or results are empty", () => {
    expect(browseFilterDecisionUiState(emptySlice, [entry()])).toEqual({
      hint: null,
      kind: null,
    });
    expect(
      browseFilterDecisionUiState({ ...emptySlice, trust: "review" }, []),
    ).toEqual({
      hint: null,
      kind: null,
    });
  });

  it("builds trust-filter guidance when every result shares one trust level", () => {
    const results = [entry(), entry({ slug: "two" })];
    expect(
      browseFilterDecisionUiState({ ...emptySlice, trust: "review" }, results),
    ).toEqual({
      hint: "All 2 results are review trust — check install risk per entry.",
      kind: "trust-filter",
    });
  });

  it("switches signal-filter copy when compare already has two entries", () => {
    expect(
      browseFilterDecisionUiState(
        { ...emptySlice, signal: "safety-notes" },
        [entry(), entry({ slug: "two" })],
        2,
      ),
    ).toEqual({
      hint: "Safety notes filter — open compare to see trust gaps in your selection.",
      kind: "signal-filter",
    });
  });

  it("nudges compare when a narrow filter set has fewer than two selections", () => {
    expect(
      browseFilterDecisionUiState(
        { ...emptySlice, category: "skills", platform: "claude-code" },
        [entry(), entry({ slug: "two" })],
        0,
      ),
    ).toEqual({
      hint: "Narrow filter set — select entries to compare trust side by side.",
      kind: "narrow-set",
    });
  });

  it("opens compare guidance when two entries are already selected", () => {
    expect(
      browseFilterDecisionUiState(
        { ...emptySlice, q: "memory" },
        [entry(), entry({ slug: "two" })],
        2,
      ),
    ).toEqual({
      hint: "Open compare to review trust and next steps across your selection.",
      kind: "compare",
    });
  });

  it("suggests compare for text/category/source/platform filters with enough results", () => {
    const results = [entry(), entry({ slug: "two" }), entry({ slug: "three" })];
    expect(
      browseFilterDecisionUiState({ ...emptySlice, q: "memory" }, results, 0),
    ).toEqual({
      hint: "Select entries to compare install and trust signals side by side.",
      kind: "compare",
    });
    expect(
      browseFilterDecisionUiState(
        { ...emptySlice, source: "source-backed" },
        results,
        0,
      ).kind,
    ).toBe("compare");
    expect(
      browseFilterDecisionUiState(
        { ...emptySlice, platform: "claude-code" },
        results,
        0,
      ).kind,
    ).toBe("compare");
  });

  it("counts every active browse filter dimension", () => {
    expect(
      browseActiveFilterCount({
        ...emptySlice,
        q: "memory",
        category: "skills",
        trust: "trusted",
        source: "source-backed",
        signal: "reviewed",
        platform: "claude-code",
      }),
    ).toBe(6);
  });

  it("returns null trust-mix hint for fewer than two entries or a single trust level", () => {
    expect(browseFilteredTrustMixHint([entry()])).toBeNull();
    expect(
      browseFilteredTrustMixHint([
        entry({ trust: "trusted" }),
        entry({ slug: "two", trust: "trusted" }),
      ]),
    ).toBeNull();
  });
});
