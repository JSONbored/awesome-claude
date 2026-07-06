import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareContextInteractiveUiState,
  compareContextSelectionChanged,
} from "@/lib/compare-context-interactive-ui-lib";

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

describe("compare context interactive ui lib", () => {
  it("bundles empty compare context share and selection state", () => {
    expect(compareContextInteractiveUiState([])).toEqual({
      selectionParam: "",
      shareUrl: "/browse",
    });
  });

  it("bundles compare context selection params for URL hydration", () => {
    expect(
      compareContextInteractiveUiState([
        entry({ category: "skills", slug: "alpha" }),
        entry({ category: "hooks", slug: "beta" }),
      ]),
    ).toEqual({
      selectionParam: "skills/alpha,hooks/beta",
      shareUrl: "/browse?compare=skills%2Falpha%2Chooks%2Fbeta",
    });
  });

  it("preserves single-entry compare context state", () => {
    expect(compareContextInteractiveUiState([entry()])).toEqual({
      selectionParam: "mcp/fixture",
      shareUrl: "/browse?compare=mcp%2Ffixture",
    });
  });

  it("detects when hydrated selection differs from live tray selection", () => {
    const alpha = entry({ category: "skills", slug: "alpha" });
    const beta = entry({ category: "hooks", slug: "beta" });
    expect(compareContextSelectionChanged([alpha], [])).toBe(true);
    expect(compareContextSelectionChanged([alpha], [alpha])).toBe(false);
    expect(compareContextSelectionChanged([alpha, beta], [alpha])).toBe(true);
    expect(compareContextSelectionChanged([], [])).toBe(false);
  });
});
