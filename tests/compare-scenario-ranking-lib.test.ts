import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  COMPARE_SCENARIO_PRESETS,
  compareScenarioRankingState,
} from "@/lib/compare-scenario-ranking-lib";

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

describe("compare scenario ranking lib", () => {
  it("exposes all scenario presets", () => {
    expect(COMPARE_SCENARIO_PRESETS.map((preset) => preset.id)).toEqual([
      "balanced",
      "safety-first",
      "speed-first",
      "minimal-risk",
    ]);
  });

  it("returns empty ranking with no entries", () => {
    const state = compareScenarioRankingState([], "balanced");
    expect(state.ranked).toEqual([]);
    expect(state.summary).toContain("Add entries");
  });

  it("ranks entries for balanced scenario", () => {
    const strong = entry({
      slug: "strong",
      title: "Strong",
      trust: "trusted",
      reviewed: true,
      source: "source-backed",
      sourceUrl: "https://github.com/acme/strong",
      safetyNotes: "yes",
      privacyNotes: "yes",
      packageVerified: true,
    });
    const weak = entry({ slug: "weak", title: "Weak", trust: "limited" });
    const state = compareScenarioRankingState([weak, strong], "balanced");
    expect(state.ranked[0].title).toBe("Strong");
    expect(state.ranked[0].rank).toBe(1);
  });

  it("prioritizes source and notes for safety-first scenario", () => {
    const safe = entry({
      slug: "safe",
      title: "Safe",
      trust: "trusted",
      reviewed: true,
      source: "source-backed",
      sourceUrl: "https://github.com/acme/safe",
      safetyNotes: "yes",
      privacyNotes: "yes",
      packageVerified: true,
    });
    const fast = entry({
      slug: "fast",
      title: "Fast",
      trust: "review",
      installCommand: "npm i fast",
      source: "unverified",
    });
    const state = compareScenarioRankingState([fast, safe], "safety-first");
    expect(state.ranked[0].title).toBe("Safe");
    expect(state.summary).toContain("safety");
  });

  it("prioritizes installability for speed-first scenario", () => {
    const installable = entry({
      slug: "installable",
      title: "Installable",
      trust: "review",
      installCommand: "npm i installable",
      configSnippet: "config",
      fullCopy: "full",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/installable",
    });
    const slow = entry({
      slug: "slow",
      title: "Slow",
      trust: "trusted",
      installCommand: undefined,
      source: "source-backed",
      sourceUrl: "https://github.com/acme/slow",
    });
    const state = compareScenarioRankingState(
      [slow, installable],
      "speed-first",
    );
    expect(state.ranked[0].title).toBe("Installable");
    expect(state.summary).toContain("fast adoption");
  });

  it("deprioritizes blocked entries in minimal-risk scenario", () => {
    const blocked = entry({
      slug: "blocked",
      title: "Blocked",
      trust: "blocked",
      source: "unverified",
    });
    const trusted = entry({
      slug: "trusted",
      title: "Trusted",
      trust: "trusted",
      reviewed: true,
      source: "source-backed",
      sourceUrl: "https://github.com/acme/trusted",
      safetyNotes: "yes",
      privacyNotes: "yes",
      packageVerified: true,
    });
    const state = compareScenarioRankingState(
      [blocked, trusted],
      "minimal-risk",
    );
    expect(state.ranked.at(-1)?.title).toBe("Blocked");
    expect(state.ranked.at(-1)?.score).toBeLessThan(state.ranked[0].score);
  });

  it("includes rank deltas from top", () => {
    const top = entry({
      slug: "top",
      title: "Top",
      trust: "trusted",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/top",
      safetyNotes: "yes",
      privacyNotes: "yes",
    });
    const low = entry({ slug: "low", title: "Low", trust: "limited" });
    const state = compareScenarioRankingState([top, low], "balanced");
    expect(state.ranked[0].deltaFromTop).toBe(0);
    expect(state.ranked[1].deltaFromTop).toBeLessThan(0);
  });

  it("includes rationale labels for scored entries", () => {
    const candidate = entry({
      title: "Candidate",
      trust: "trusted",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/candidate",
      safetyNotes: "yes",
      privacyNotes: "yes",
      installCommand: "npm i candidate",
    });
    const state = compareScenarioRankingState([candidate], "balanced");
    expect(state.ranked[0].rationale.length).toBeGreaterThan(0);
  });

  it("adds missing install payload rationale in speed-first mode", () => {
    const docsOnly = entry({
      title: "Docs only",
      installCommand: undefined,
      configSnippet: undefined,
      fullCopy: undefined,
      copySnippet: undefined,
      source: "source-backed",
      sourceUrl: "https://github.com/acme/docs",
    });
    const state = compareScenarioRankingState([docsOnly], "speed-first");
    expect(state.ranked[0].rationale).toContain("Missing install payload");
  });

  it("adds unverified-source rationale in minimal-risk mode", () => {
    const unverified = entry({
      title: "Unverified",
      source: "unverified",
      sourceUrl: undefined,
    });
    const state = compareScenarioRankingState([unverified], "minimal-risk");
    expect(state.ranked[0].rationale).toContain("Unverified source");
  });

  it("uses balanced summary text", () => {
    const top = entry({
      title: "Top",
      trust: "trusted",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/top",
      safetyNotes: "yes",
      privacyNotes: "yes",
    });
    const state = compareScenarioRankingState([top], "balanced");
    expect(state.summary).toContain("balanced weighting");
  });

  it("uses minimal-risk summary text", () => {
    const top = entry({
      title: "Top",
      trust: "trusted",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/top",
      safetyNotes: "yes",
      privacyNotes: "yes",
    });
    const state = compareScenarioRankingState([top], "minimal-risk");
    expect(state.summary).toContain("risk-minimization");
  });

  it("returns preset metadata in state", () => {
    const top = entry({
      title: "Top",
      trust: "trusted",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/top",
      safetyNotes: "yes",
      privacyNotes: "yes",
    });
    const state = compareScenarioRankingState([top], "safety-first");
    expect(state.scenario.id).toBe("safety-first");
    expect(state.scenario.label).toBe("Safety first");
  });

  it("handles tie scores deterministically with stable ordering", () => {
    const a = entry({
      slug: "a",
      title: "A",
      trust: "review",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/a",
      safetyNotes: "yes",
      privacyNotes: "yes",
    });
    const b = entry({
      slug: "b",
      title: "B",
      trust: "review",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/b",
      safetyNotes: "yes",
      privacyNotes: "yes",
    });
    const state = compareScenarioRankingState([a, b], "balanced");
    expect(state.ranked).toHaveLength(2);
    expect(state.ranked[0].score).toBe(state.ranked[1].score);
  });
});
