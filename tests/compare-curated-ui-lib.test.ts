import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareCuratedHasRenderableEntries,
  compareCuratedHeaderBannerTexts,
  compareCuratedInteractiveLinkLabel,
  compareCuratedInteractiveSearch,
  compareCuratedResolvedEntries,
} from "@/lib/compare-curated-ui-lib";

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

describe("compare curated ui lib", () => {
  it("resolves curated comparison refs against the entry catalog", () => {
    expect(compareCuratedResolvedEntries([], catalog)).toEqual([]);
    expect(
      compareCuratedResolvedEntries(["skills/alpha", "hooks/beta"], catalog),
    ).toEqual([catalog[0], catalog[1]]);
    expect(
      compareCuratedResolvedEntries(["skills/alpha", "missing/slug"], catalog),
    ).toEqual([catalog[0]]);
  });

  it("requires at least two resolved entries for curated pages", () => {
    expect(compareCuratedHasRenderableEntries([], catalog)).toBe(false);
    expect(compareCuratedHasRenderableEntries(["skills/alpha"], catalog)).toBe(
      false,
    );
    expect(
      compareCuratedHasRenderableEntries(
        ["skills/alpha", "hooks/beta"],
        catalog,
      ),
    ).toBe(true);
    expect(
      compareCuratedHasRenderableEntries(
        ["skills/alpha", "missing/slug"],
        catalog,
      ),
    ).toBe(false);
  });

  it("returns curated comparison header banner messages", () => {
    const reviewed = entry({
      slug: "reviewed",
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(compareCuratedHeaderBannerTexts([entry(), reviewed])).toEqual([
      "1 trust signal differ across this comparison (Review status).",
    ]);
    expect(compareCuratedHeaderBannerTexts([entry()])).toEqual([]);
  });

  it("builds interactive compare search params for curated pages", () => {
    expect(compareCuratedInteractiveSearch([entry()])).toBeNull();
    expect(
      compareCuratedInteractiveSearch([
        entry({ category: "skills", slug: "alpha" }),
        entry({ category: "hooks", slug: "beta" }),
      ]),
    ).toEqual({ ids: "skills/alpha,hooks/beta" });
  });

  it("formats curated interactive link labels from entry count", () => {
    expect(compareCuratedInteractiveLinkLabel(2)).toBe(
      "Open in the interactive comparison tool",
    );
    expect(compareCuratedInteractiveLinkLabel(3)).toBe(
      "Open 3 picks in the interactive comparison tool",
    );
  });

  it("returns combined trust and action banner messages for curated headers", () => {
    expect(
      compareCuratedHeaderBannerTexts([
        entry(),
        entry({
          slug: "mixed",
          reviewedBy: "maintainer",
          reviewedAt: "2026-01-02",
          installCommand: "npm i fixture",
        }),
      ]),
    ).toEqual([
      "1 trust signal differ across this comparison (Review status).",
      "Next steps differ across entries — open the interactive comparison to copy install commands and source links per resource.",
    ]);
  });
});
