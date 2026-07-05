import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { comparePagePresentationUiInteractiveUiState } from "@/lib/compare-page-presentation-ui-interactive-ui-lib";

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

describe("compare page presentation ui interactive ui lib", () => {
  it("keeps action rows unhighlighted for uniform compared entries", () => {
    expect(comparePagePresentationUiInteractiveUiState([entry()])).toEqual({
      actionRowDiverges: false,
    });
  });

  it("highlights diverging next-action rows for mixed compare columns", () => {
    expect(
      comparePagePresentationUiInteractiveUiState([
        entry({ installCommand: "npm i fixture" }),
        entry(),
      ]).actionRowDiverges,
    ).toBe(true);
  });
});
