import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareDossierActionBannerText,
  compareDossierBannerTexts,
  compareDossierDecisionBannerText,
  compareDossierEntries,
  compareDossierInteractiveSearch,
  compareDossierSummary,
} from "@/lib/compare-dossier-summary";

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

describe("compare dossier summary", () => {
  it("builds dossier comparison entry lists with the primary entry first", () => {
    const primary = entry({ slug: "primary" });
    const alt = entry({ slug: "alternative" });
    expect(compareDossierEntries(primary, [alt])).toEqual([primary, alt]);
    expect(compareDossierEntries(primary, [])).toEqual([primary]);
  });

  it("summarizes trust and action divergence for dossier compare sections", () => {
    const primary = entry();
    const reviewed = entry({
      slug: "reviewed",
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(compareDossierSummary(primary, [])).toEqual({
      comparedCount: 1,
      decision: {
        comparedCount: 1,
        divergingCount: 0,
        divergingLabels: [],
      },
      actionsDiverge: false,
      hasAnyDivergence: false,
    });
    expect(compareDossierSummary(primary, [reviewed])).toEqual({
      comparedCount: 2,
      decision: {
        comparedCount: 2,
        divergingCount: 1,
        divergingLabels: ["Review status"],
      },
      actionsDiverge: false,
      hasAnyDivergence: true,
    });
    expect(
      compareDossierSummary(primary, [
        entry({ slug: "installable", installCommand: "npm i fixture" }),
      ]).hasAnyDivergence,
    ).toBe(true);
  });

  it("formats dossier decision banner copy", () => {
    const primary = entry();
    expect(compareDossierDecisionBannerText(primary, [])).toBeNull();
    expect(
      compareDossierDecisionBannerText(primary, [
        entry({
          slug: "reviewed",
          reviewedBy: "maintainer",
          reviewedAt: "2026-01-02",
        }),
      ]),
    ).toBe("1 trust signal differ across this comparison (Review status).");
  });

  it("formats dossier action banner copy for inline table CTAs", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
    expect(compareDossierActionBannerText(true)).toBe(
      "Next steps differ across entries — use the actions in the table below to copy install commands and source links per resource.",
    );
  });

  it("returns ordered dossier banner messages", () => {
    const primary = entry();
    const reviewed = entry({
      slug: "reviewed",
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(compareDossierBannerTexts(primary, [reviewed])).toEqual([
      "1 trust signal differ across this comparison (Review status).",
    ]);
    expect(
      compareDossierBannerTexts(primary, [
        entry({ slug: "installable", installCommand: "npm i fixture" }),
      ]),
    ).toEqual([
      "Next steps differ across entries — use the actions in the table below to copy install commands and source links per resource.",
    ]);
    expect(
      compareDossierBannerTexts(primary, [
        entry({
          slug: "mixed",
          reviewedBy: "maintainer",
          reviewedAt: "2026-01-02",
          installCommand: "npm i fixture",
        }),
      ]),
    ).toEqual([
      "1 trust signal differ across this comparison (Review status).",
      "Next steps differ across entries — use the actions in the table below to copy install commands and source links per resource.",
    ]);
  });

  it("builds interactive compare search params for dossier alternatives", () => {
    const primary = entry({ category: "skills", slug: "primary" });
    expect(compareDossierInteractiveSearch(primary, [])).toBeNull();
    expect(
      compareDossierInteractiveSearch(primary, [
        entry({ category: "hooks", slug: "alt" }),
      ]),
    ).toEqual({ ids: "skills/primary,hooks/alt" });
    expect(
      compareDossierInteractiveSearch(primary, [
        entry({ slug: "two" }),
        entry({ slug: "three" }),
        entry({ slug: "four" }),
      ]),
    ).toEqual({
      ids: "skills/primary,mcp/two,mcp/three,mcp/four",
    });
  });
});
