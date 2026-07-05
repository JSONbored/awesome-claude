import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { comparePageEmptyUiState } from "@/lib/compare-page-empty-ui-lib";

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

describe("compare page empty ui lib", () => {
  it("bundles empty-state copy, invalid URL hints, and popular comparison links", () => {
    expect(
      comparePageEmptyUiState(
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
    });
  });

  it("surfaces invalid URL hints when ids cannot be resolved", () => {
    const state = comparePageEmptyUiState("skills/missing", [], catalog);
    expect(state.invalidUrlHint).toContain("could not be resolved");
    expect(state.popularComparisonLinks).toEqual([]);
  });

  it("omits interactive search when fewer than two refs resolve", () => {
    expect(
      comparePageEmptyUiState(
        "",
        [{ slug: "solo", heading: "Alpha only", refs: ["skills/alpha"] }],
        catalog,
      ).popularComparisonLinks,
    ).toEqual([
      {
        slug: "solo",
        heading: "Alpha only",
        interactiveSearch: null,
        interactiveLabel: "Open interactively",
      },
    ]);
  });
});
