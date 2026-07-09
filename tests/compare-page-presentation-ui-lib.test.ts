import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  comparePagePresentationActionRowDiverges,
  comparePagePresentationState,
} from "@/lib/compare-page-presentation-ui-lib";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "mcp",
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

describe("compare page presentation ui lib", () => {
  it("keeps action rows unhighlighted for a single compared entry", () => {
    expect(comparePagePresentationState([entry()])).toEqual({
      actionRowDiverges: false,
    });
  });

  it("keeps action rows unhighlighted when columns share the same next-action sets", () => {
    expect(
      comparePagePresentationState([
        entry({ slug: "alpha", installCommand: "npm i fixture" }),
        entry({ slug: "beta", installCommand: "pnpm add fixture" }),
      ]),
    ).toEqual({
      actionRowDiverges: false,
    });
  });

  it("highlights diverging next-action rows for mixed compare columns", () => {
    const items = [entry({ installCommand: "npm i fixture" }), entry()];
    const state = comparePagePresentationState(items);
    expect(state.actionRowDiverges).toBe(true);
    expect(state.actionRowDiverges).toBe(
      comparePagePresentationActionRowDiverges(items),
    );
  });
});
