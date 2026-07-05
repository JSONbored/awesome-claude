import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareCuratedPickInteractiveLabel,
  compareCuratedPickInteractiveSearch,
  compareDrawerEmptyHint,
  compareEmptyStateDescription,
  compareInvalidUrlHint,
  compareSingleItemHintText,
  resolveCuratedPickRefs,
} from "@/lib/compare-empty-guidance";

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

describe("compare empty guidance", () => {
  it("describes the interactive compare selection range", () => {
    expect(compareEmptyStateDescription()).toBe(
      "Add 2–4 resources from the directory to see them side by side.",
    );
  });

  it("prompts readers to add another resource when only one is selected", () => {
    expect(compareSingleItemHintText(0)).toBeNull();
    expect(compareSingleItemHintText(1)).toBe(
      "Add one more resource to unlock trust and next-step comparisons across the full table.",
    );
    expect(compareSingleItemHintText(2)).toBeNull();
  });

  it("warns when compare URL params do not resolve to entries", () => {
    expect(compareInvalidUrlHint("", 0)).toBeNull();
    expect(compareInvalidUrlHint("   ", 0)).toBeNull();
    expect(compareInvalidUrlHint("mcp/missing", 0)).toBe(
      "The compare link could not be resolved — choose resources from the directory instead.",
    );
    expect(compareInvalidUrlHint("mcp/fixture", 1)).toBeNull();
  });

  it("guides drawer readers to add resources from cards", () => {
    expect(compareDrawerEmptyHint()).toBe(
      "Add resources to compare by tapping the Compare button on any card.",
    );
  });

  it("builds interactive compare links for curated comparison picks", () => {
    expect(
      resolveCuratedPickRefs(["skills/alpha", "missing/slug"], catalog),
    ).toEqual([catalog[0]]);
    expect(
      resolveCuratedPickRefs(["bad-ref", "skills/alpha"], catalog),
    ).toEqual([catalog[0]]);
    expect(
      compareCuratedPickInteractiveSearch(["skills/alpha"], catalog),
    ).toBeNull();
    expect(
      compareCuratedPickInteractiveSearch(
        ["skills/alpha", "hooks/beta"],
        catalog,
      ),
    ).toEqual({ ids: "skills/alpha,hooks/beta" });
    expect(compareCuratedPickInteractiveLabel(2)).toBe("Open interactively");
    expect(compareCuratedPickInteractiveLabel(3)).toBe(
      "Open 3 picks in the interactive comparison tool",
    );
  });
});
