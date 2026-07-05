import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareFeaturedInteractiveLinkLabel,
  compareFeaturedInteractiveSearch,
  resolveComparisonRefs,
} from "@/lib/compare-featured-link";

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
  entry({ category: "mcp", slug: "delta" }),
  entry({ category: "mcp", slug: "epsilon" }),
];

describe("compare featured link", () => {
  it("resolves comparison refs against the entry catalog", () => {
    expect(resolveComparisonRefs([], catalog)).toEqual([]);
    expect(
      resolveComparisonRefs(["skills/alpha", "hooks/beta"], catalog),
    ).toEqual([catalog[0], catalog[1]]);
    expect(
      resolveComparisonRefs(
        ["skills/alpha", "missing/slug", "bad-ref"],
        catalog,
      ),
    ).toEqual([catalog[0]]);
  });

  it("builds interactive compare search params for featured comparisons", () => {
    expect(
      compareFeaturedInteractiveSearch(["skills/alpha"], catalog),
    ).toBeNull();
    expect(
      compareFeaturedInteractiveSearch(["skills/alpha", "hooks/beta"], catalog),
    ).toEqual({ ids: "skills/alpha,hooks/beta" });
    expect(
      compareFeaturedInteractiveSearch(
        ["mcp/gamma", "mcp/delta", "mcp/epsilon", "skills/alpha", "hooks/beta"],
        catalog,
      ),
    ).toEqual({ ids: "mcp/gamma,mcp/delta,mcp/epsilon,skills/alpha" });
  });

  it("formats featured comparison interactive link labels", () => {
    expect(compareFeaturedInteractiveLinkLabel(2)).toBe("Open interactively");
    expect(compareFeaturedInteractiveLinkLabel(3)).toBe(
      "Open 3 picks in the interactive comparison tool",
    );
    expect(compareFeaturedInteractiveLinkLabel(5)).toBe(
      "Open 4 picks in the interactive comparison tool",
    );
  });
});
