import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { compareDrawerEmptyInteractiveUiState } from "@/lib/compare-drawer-empty-interactive-ui-lib";

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

describe("compare drawer empty interactive ui lib", () => {
  it("bundles drawer empty-state hint and browse share URL for no selection", () => {
    expect(compareDrawerEmptyInteractiveUiState([])).toEqual({
      emptyHint: expect.stringContaining("Compare"),
      shareUrl: "/browse",
    });
  });

  it("builds browse share URLs for multi-item drawer selections", () => {
    expect(
      compareDrawerEmptyInteractiveUiState([
        entry({ category: "skills", slug: "alpha" }),
        entry({ category: "hooks", slug: "beta" }),
      ]),
    ).toEqual({
      emptyHint: expect.stringContaining("Compare"),
      shareUrl: "/browse?compare=skills%2Falpha%2Chooks%2Fbeta",
    });
  });

  it("preserves single-entry drawer share URLs", () => {
    expect(compareDrawerEmptyInteractiveUiState([entry()])).toEqual({
      emptyHint: expect.stringContaining("Compare"),
      shareUrl: "/browse?compare=mcp%2Ffixture",
    });
  });
});
