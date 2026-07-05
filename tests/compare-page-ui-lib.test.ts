import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  comparePageActionsDiverge,
  comparePageEmptyStateDescription,
  comparePageHeaderBannerTexts,
  comparePageInvalidUrlHint,
  comparePageSelectionHint,
  comparePageShareUrl,
} from "@/lib/compare-page-ui-lib";

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

describe("compare page ui lib", () => {
  it("builds compare page share URLs for copy-link actions", () => {
    expect(comparePageShareUrl([])).toBe("/compare");
    expect(
      comparePageShareUrl([
        entry({ category: "skills", slug: "alpha" }),
        entry({ category: "hooks", slug: "beta" }),
      ]),
    ).toBe("/compare?ids=skills%2Falpha%2Chooks%2Fbeta");
  });

  it("returns page header banner messages from page summaries", () => {
    const reviewed = entry({
      slug: "reviewed",
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(comparePageHeaderBannerTexts([entry(), reviewed])).toEqual([
      "1 trust signal differ across this comparison (Review status).",
    ]);
  });

  it("prompts readers to add another resource when only one item is selected", () => {
    expect(comparePageSelectionHint(0)).toBeNull();
    expect(comparePageSelectionHint(1)).toBe(
      "Add one more resource to unlock trust and next-step comparisons across the full table.",
    );
    expect(comparePageSelectionHint(2)).toBeNull();
  });

  it("detects when interactive compare columns expose different next actions", () => {
    expect(comparePageActionsDiverge([])).toBe(false);
    expect(
      comparePageActionsDiverge([
        entry({ installCommand: "npm i fixture" }),
        entry({ slug: "other" }),
      ]),
    ).toBe(true);
    expect(
      comparePageActionsDiverge([
        entry({ installCommand: "npm i fixture" }),
        entry({ slug: "other", installCommand: "pnpm add fixture" }),
      ]),
    ).toBe(false);
  });

  it("returns empty-state copy and invalid URL hints for the compare page", () => {
    expect(comparePageEmptyStateDescription()).toContain("directory");
    expect(comparePageInvalidUrlHint("", 0)).toBeNull();
    expect(comparePageInvalidUrlHint("skills/missing", 0)).toContain(
      "could not be resolved",
    );
  });
});
