import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareEntryFeaturedBestListLinks,
  compareEntryFeaturedComparisonLinks,
} from "@/lib/compare-entry-featured-ui-lib";

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

describe("compare entry featured ui lib", () => {
  it("builds featured comparison links for dossier surfaces", () => {
    expect(
      compareEntryFeaturedComparisonLinks(
        [{ slug: "solo", refs: ["skills/alpha"] }],
        catalog,
      ),
    ).toEqual([
      {
        slug: "solo",
        search: null,
        label: "Open interactively",
      },
    ]);

    expect(
      compareEntryFeaturedComparisonLinks(
        [{ slug: "pair", refs: ["skills/alpha", "hooks/beta"] }],
        catalog,
      ),
    ).toEqual([
      {
        slug: "pair",
        search: { ids: "skills/alpha,hooks/beta" },
        label: "Open interactively",
      },
    ]);
  });

  it("skips missing refs when building featured comparison links", () => {
    expect(
      compareEntryFeaturedComparisonLinks(
        [{ slug: "partial", refs: ["skills/alpha", "missing/slug"] }],
        catalog,
      ),
    ).toEqual([
      {
        slug: "partial",
        search: null,
        label: "Open interactively",
      },
    ]);
  });

  it("builds featured best-list links for dossier surfaces", () => {
    expect(
      compareEntryFeaturedBestListLinks(
        [
          {
            slug: "top-picks",
            picks: [{ ref: "skills/alpha" }, { ref: "hooks/beta" }],
          },
        ],
        catalog,
      ),
    ).toEqual([
      {
        slug: "top-picks",
        search: { ids: "skills/alpha,hooks/beta" },
        label: "Open interactively",
      },
    ]);
  });

  it("formats overflow labels for featured best-list links", () => {
    expect(
      compareEntryFeaturedBestListLinks(
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
    ).toEqual([
      {
        slug: "wide-list",
        search: { ids: "skills/alpha,hooks/beta,mcp/gamma" },
        label: "Open 3 picks in the interactive comparison tool",
      },
    ]);
  });
});
