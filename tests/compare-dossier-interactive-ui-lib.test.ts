import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { compareDossierInteractiveUiState } from "@/lib/compare-dossier-interactive-ui-lib";

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

describe("compare dossier interactive ui lib", () => {
  it("hides dossier compare UI when no alternatives exist", () => {
    const primary = entry({ category: "skills", slug: "primary" });
    expect(compareDossierInteractiveUiState(primary, [])).toEqual({
      showCompareSection: false,
      bannerTexts: [],
      interactiveSearch: null,
      interactiveLinkLabel: "Open 1 picks in the interactive comparison tool",
    });
  });

  it("bundles dossier compare presentation state for headers and interactive links", () => {
    const primary = entry({ category: "skills", slug: "primary" });
    expect(
      compareDossierInteractiveUiState(primary, [
        entry({ category: "hooks", slug: "alt" }),
      ]),
    ).toEqual({
      showCompareSection: true,
      bannerTexts: [],
      interactiveSearch: { ids: "skills/primary,hooks/alt" },
      interactiveLinkLabel: "Open in the interactive comparison tool",
    });
  });

  it("surfaces divergence banners for dossier alternatives", () => {
    const primary = entry({ category: "skills", slug: "primary" });
    expect(
      compareDossierInteractiveUiState(primary, [
        entry({
          slug: "mixed",
          reviewedBy: "maintainer",
          reviewedAt: "2026-01-02",
          installCommand: "npm i fixture",
        }),
      ]),
    ).toEqual({
      showCompareSection: true,
      bannerTexts: [
        "1 trust signal differ across this comparison (Review status).",
        "Next steps differ across entries — use the actions in the table below to copy install commands and source links per resource.",
      ],
      interactiveSearch: { ids: "skills/primary,mcp/mixed" },
      interactiveLinkLabel: "Open in the interactive comparison tool",
    });
  });
});
