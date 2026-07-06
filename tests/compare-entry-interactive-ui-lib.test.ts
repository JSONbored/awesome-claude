import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareEntryInteractiveShowsFeaturedLinks,
  compareEntryInteractiveUiState,
} from "@/lib/compare-entry-interactive-ui-lib";

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

describe("compare entry interactive ui lib", () => {
  it("bundles dossier and featured compare state for entry detail surfaces", () => {
    const primary = entry({ category: "skills", slug: "primary" });
    expect(
      compareEntryInteractiveUiState(
        primary,
        [entry({ category: "hooks", slug: "alt" })],
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
      dossierUi: {
        showCompareSection: true,
        bannerTexts: [],
        interactiveSearch: { ids: "skills/primary,hooks/alt" },
        interactiveLinkLabel: "Open in the interactive comparison tool",
      },
      featuredUi: {
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
      },
      hasFeaturedLinks: true,
    });
    expect(
      compareEntryInteractiveShowsFeaturedLinks(
        [{ slug: "pair", refs: ["skills/alpha", "hooks/beta"] }],
        [
          {
            slug: "top-picks",
            picks: [{ ref: "skills/alpha" }, { ref: "hooks/beta" }],
          },
        ],
        catalog,
      ),
    ).toBe(true);
  });

  it("hides dossier compare and featured links when nothing references the entry", () => {
    const primary = entry({ category: "skills", slug: "primary" });
    expect(
      compareEntryInteractiveUiState(primary, [], [], [], catalog),
    ).toEqual({
      dossierUi: {
        showCompareSection: false,
        bannerTexts: [],
        interactiveSearch: null,
        interactiveLinkLabel: "Open 1 picks in the interactive comparison tool",
      },
      featuredUi: {
        comparisonLinks: [],
        bestListLinks: [],
        hasFeaturedLinks: false,
      },
      hasFeaturedLinks: false,
    });
    expect(compareEntryInteractiveShowsFeaturedLinks([], [], catalog)).toBe(
      false,
    );
  });

  it("surfaces dossier divergence banners alongside featured links", () => {
    const primary = entry({ category: "skills", slug: "primary" });
    const state = compareEntryInteractiveUiState(
      primary,
      [
        entry({
          slug: "mixed",
          reviewedBy: "maintainer",
          reviewedAt: "2026-01-02",
          installCommand: "npm i fixture",
        }),
      ],
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
    );
    expect(state.dossierUi.bannerTexts).toEqual([
      "1 trust signal differ across this comparison (Review status).",
      "Next steps differ across entries — use the actions in the table below to copy install commands and source links per resource.",
    ]);
    expect(state.featuredUi.bestListLinks[0]?.label).toBe(
      "Open 3 picks in the interactive comparison tool",
    );
    expect(state.hasFeaturedLinks).toBe(true);
  });
});
