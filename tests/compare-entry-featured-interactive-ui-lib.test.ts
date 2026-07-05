import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { compareEntryFeaturedInteractiveUiState } from "@/lib/compare-entry-featured-interactive-ui-lib";

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
  entry({ category: "mcp", slug: "gamma" }),
];

describe("compare entry featured interactive ui lib", () => {
  it("hides featured compare links when no comparisons or best lists reference the entry", () => {
    expect(compareEntryFeaturedInteractiveUiState([], [], catalog)).toEqual({
      comparisonLinks: [],
      bestListLinks: [],
      hasFeaturedLinks: false,
    });
  });

  it("bundles featured comparison and best-list links for dossier surfaces", () => {
    expect(
      compareEntryFeaturedInteractiveUiState(
        [{ slug: "pair", refs: ["skills/alpha", "hooks/beta"] }],
        [
          {
            slug: "top-picks",
            picks: [{ ref: "skills/alpha" }, { ref: "hooks/beta" }],
          },
        ],
        catalog,
      ),
    ).toEqual({
      comparisonLinks: [
        {
          slug: "pair",
          search: { ids: "skills/alpha,hooks/beta" },
          label: "Open interactively",
        },
      ],
      bestListLinks: [
        {
          slug: "top-picks",
          search: { ids: "skills/alpha,hooks/beta" },
          label: "Open interactively",
        },
      ],
      hasFeaturedLinks: true,
    });
  });

  it("formats overflow labels for wide featured best lists", () => {
    expect(
      compareEntryFeaturedInteractiveUiState(
        [],
        [
          {
            slug: "wide-list",
            picks: [
              { ref: "skills/alpha" },
              { ref: "hooks/beta" },
              { ref: "mcp/gamma" },
            ],
          },
        ],
        catalog,
      ),
    ).toEqual({
      comparisonLinks: [],
      bestListLinks: [
        {
          slug: "wide-list",
          search: { ids: "skills/alpha,hooks/beta,mcp/gamma" },
          label: "Open 3 picks in the interactive comparison tool",
        },
      ],
      hasFeaturedLinks: true,
    });
  });
});
