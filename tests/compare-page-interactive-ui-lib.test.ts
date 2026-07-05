import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { comparePageInteractiveUiState } from "@/lib/compare-page-interactive-ui-lib";

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

const catalog = [
  entry({ category: "skills", slug: "alpha" }),
  entry({ category: "hooks", slug: "beta" }),
];

describe("compare page interactive ui lib", () => {
  it("bundles interactive compare page and empty-state presentation", () => {
    expect(
      comparePageInteractiveUiState(
        [
          entry({ category: "skills", slug: "alpha" }),
          entry({ category: "hooks", slug: "beta" }),
        ],
        "",
        [
          {
            slug: "pair",
            heading: "Alpha vs Beta",
            refs: ["skills/alpha", "hooks/beta"],
          },
        ],
        catalog,
      ),
    ).toEqual({
      pageUi: {
        actionRowDiverges: false,
        bannerTexts: [],
        singleItemHint: null,
        shareUrl: "/compare?ids=skills%2Falpha%2Chooks%2Fbeta",
      },
      emptyUi: {
        description: expect.stringContaining("directory"),
        invalidUrlHint: null,
        popularComparisonLinks: [
          {
            slug: "pair",
            heading: "Alpha vs Beta",
            interactiveSearch: { ids: "skills/alpha,hooks/beta" },
            interactiveLabel: "Open interactively",
          },
        ],
      },
      actionRowDiverges: false,
      actionCells: [
        expect.objectContaining({ entryKey: "skills:alpha" }),
        expect.objectContaining({ entryKey: "hooks:beta" }),
      ],
    });
  });

  it("surfaces single-item hints and invalid URL hints together", () => {
    const state = comparePageInteractiveUiState(
      [entry()],
      "skills/missing",
      [],
      catalog,
    );
    expect(state.pageUi.singleItemHint).toContain("Add one more resource");
    expect(state.emptyUi.invalidUrlHint).toContain("could not be resolved");
  });

  it("highlights diverging next actions in bundled page state", () => {
    const state = comparePageInteractiveUiState(
      [entry({ installCommand: "npm i fixture" }), entry({ slug: "other" })],
      "",
      [],
      catalog,
    );
    expect(state.actionRowDiverges).toBe(true);
    expect(state.actionCells).toHaveLength(2);
    expect(state.actionCells[0]).toEqual(
      expect.objectContaining({ entryKey: "mcp:fixture" }),
    );
  });
});
