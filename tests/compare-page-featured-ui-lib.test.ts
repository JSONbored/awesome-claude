import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { comparePagePopularComparisonLinks } from "@/lib/compare-page-featured-ui-lib";

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

describe("compare page featured ui lib", () => {
  it("builds popular comparison links for the compare page empty state", () => {
    expect(
      comparePagePopularComparisonLinks(
        [
          {
            slug: "pair",
            heading: "Alpha vs Beta",
            refs: ["skills/alpha", "hooks/beta"],
          },
        ],
        catalog,
      ),
    ).toEqual([
      {
        slug: "pair",
        heading: "Alpha vs Beta",
        interactiveSearch: { ids: "skills/alpha,hooks/beta" },
        interactiveLabel: "Open interactively",
      },
    ]);
  });

  it("omits interactive search when fewer than two refs resolve", () => {
    expect(
      comparePagePopularComparisonLinks(
        [{ slug: "solo", heading: "Alpha only", refs: ["skills/alpha"] }],
        catalog,
      ),
    ).toEqual([
      {
        slug: "solo",
        heading: "Alpha only",
        interactiveSearch: null,
        interactiveLabel: "Open interactively",
      },
    ]);
  });

  it("formats overflow labels for popular comparison links", () => {
    expect(
      comparePagePopularComparisonLinks(
        [
          {
            slug: "triple",
            heading: "Three-way",
            refs: ["skills/alpha", "hooks/beta", "mcp/gamma"],
          },
        ],
        catalog,
      ),
    ).toEqual([
      {
        slug: "triple",
        heading: "Three-way",
        interactiveSearch: { ids: "skills/alpha,hooks/beta,mcp/gamma" },
        interactiveLabel: "Open 3 picks in the interactive comparison tool",
      },
    ]);
  });

  it("ignores missing refs when building popular comparison links", () => {
    expect(
      comparePagePopularComparisonLinks(
        [
          {
            slug: "partial",
            heading: "Partial refs",
            refs: ["skills/alpha", "missing/slug"],
          },
        ],
        catalog,
      ),
    ).toEqual([
      {
        slug: "partial",
        heading: "Partial refs",
        interactiveSearch: null,
        interactiveLabel: "Open interactively",
      },
    ]);
  });
});
