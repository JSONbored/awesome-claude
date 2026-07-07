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
});
