import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  browseCompareInteractiveUiShowsHint,
  browseCompareInteractiveUiState,
} from "@/lib/compare-browse-interactive-ui-lib";

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

describe("compare browse interactive ui lib", () => {
  it("returns null when fewer than two items are selected", () => {
    expect(browseCompareInteractiveUiState([])).toBeNull();
    expect(browseCompareInteractiveUiState([entry()])).toBeNull();
    expect(browseCompareInteractiveUiShowsHint([])).toBe(false);
    expect(browseCompareInteractiveUiShowsHint([entry()])).toBe(false);
  });

  it("builds capped compare CTA state aligned with hint and overflow copy", () => {
    const five = [
      entry({ slug: "one" }),
      entry({ slug: "two" }),
      entry({ slug: "three" }),
      entry({ slug: "four" }),
      entry({
        slug: "five",
        reviewedBy: "maintainer",
        reviewedAt: "2026-01-02",
      }),
    ];
    expect(browseCompareInteractiveUiState(five)).toEqual({
      search: { ids: "mcp/one,mcp/two,mcp/three,mcp/four" },
      selectedCount: 4,
      hint: "Open compare to review trust and next steps side by side.",
      overflowHint: "Opening 4 of 5 selected in compare.",
      showHint: true,
    });
    expect(browseCompareInteractiveUiShowsHint(five)).toBe(true);
    const bundled = browseCompareInteractiveUiState(five);
    expect(bundled?.showHint).toBe(browseCompareInteractiveUiShowsHint(five));
  });

  it("surfaces divergence hints in browse compare CTA state", () => {
    expect(
      browseCompareInteractiveUiState([
        entry(),
        entry({
          slug: "mixed",
          reviewedBy: "maintainer",
          reviewedAt: "2026-01-02",
          installCommand: "npm i fixture",
        }),
      ]),
    ).toEqual({
      search: { ids: "mcp/fixture,mcp/mixed" },
      selectedCount: 2,
      hint: "1 trust signal differ · next steps differ — open compare for details.",
      overflowHint: null,
      showHint: true,
    });
    expect(
      browseCompareInteractiveUiShowsHint([
        entry(),
        entry({
          slug: "mixed",
          reviewedBy: "maintainer",
          reviewedAt: "2026-01-02",
          installCommand: "npm i fixture",
        }),
      ]),
    ).toBe(true);
  });
});
