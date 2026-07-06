import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareCuratedInteractivePageRenderable,
  compareCuratedInteractiveUiState,
} from "@/lib/compare-curated-interactive-ui-lib";

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

describe("compare curated interactive ui lib", () => {
  it("requires at least two resolved entries for curated pages", () => {
    expect(compareCuratedInteractiveUiState([], catalog).renderable).toBe(
      false,
    );
    expect(
      compareCuratedInteractiveUiState(["skills/alpha"], catalog).renderable,
    ).toBe(false);
    expect(
      compareCuratedInteractiveUiState(["skills/alpha", "hooks/beta"], catalog)
        .renderable,
    ).toBe(true);
    expect(
      compareCuratedInteractivePageRenderable(
        ["skills/alpha", "hooks/beta"],
        catalog,
      ),
    ).toBe(true);
  });

  it("bundles curated compare page presentation state", () => {
    expect(
      compareCuratedInteractiveUiState(["skills/alpha", "hooks/beta"], catalog),
    ).toEqual({
      entries: [catalog[0], catalog[1]],
      bannerTexts: [],
      interactiveSearch: { ids: "skills/alpha,hooks/beta" },
      interactiveLinkLabel: "Open in the interactive comparison tool",
      renderable: true,
    });
  });

  it("omits interactive search when fewer than two refs resolve", () => {
    expect(
      compareCuratedInteractiveUiState(
        ["skills/alpha", "missing/slug"],
        catalog,
      ),
    ).toEqual({
      entries: [catalog[0]],
      bannerTexts: [],
      interactiveSearch: null,
      interactiveLinkLabel: "Open 1 picks in the interactive comparison tool",
      renderable: false,
    });
  });

  it("surfaces banner text when trust signals diverge", () => {
    const reviewed = entry({
      category: "skills",
      slug: "reviewed",
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    const refs = ["skills/alpha", "skills/reviewed"];
    const extendedCatalog = [...catalog, reviewed];
    expect(
      compareCuratedInteractiveUiState(refs, extendedCatalog).bannerTexts,
    ).toEqual([
      "1 trust signal differ across this comparison (Review status).",
    ]);
  });
});
