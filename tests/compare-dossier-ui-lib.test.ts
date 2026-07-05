import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareDossierHeaderBannerTexts,
  compareDossierInteractiveCompareSearch,
  compareDossierInteractiveLinkLabel,
  compareDossierShowCompareSection,
} from "@/lib/compare-dossier-ui-lib";

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

describe("compare dossier ui lib", () => {
  it("only surfaces dossier compare UI when alternatives exist", () => {
    expect(compareDossierShowCompareSection([])).toBe(false);
    expect(compareDossierShowCompareSection([entry({ slug: "alt" })])).toBe(
      true,
    );
  });

  it("returns dossier header banner messages", () => {
    const primary = entry({ slug: "primary" });
    const reviewed = entry({
      slug: "reviewed",
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(compareDossierHeaderBannerTexts(primary, [reviewed])).toEqual([
      "1 trust signal differ across this comparison (Review status).",
    ]);
  });

  it("builds interactive compare search params for dossier alternatives", () => {
    const primary = entry({ category: "skills", slug: "primary" });
    expect(compareDossierInteractiveCompareSearch(primary, [])).toBeNull();
    expect(
      compareDossierInteractiveCompareSearch(primary, [
        entry({ category: "hooks", slug: "alt" }),
      ]),
    ).toEqual({ ids: "skills/primary,hooks/alt" });
  });

  it("formats dossier interactive link labels from compared entry count", () => {
    expect(compareDossierInteractiveLinkLabel(2)).toBe(
      "Open in the interactive comparison tool",
    );
    expect(compareDossierInteractiveLinkLabel(4)).toBe(
      "Open 4 picks in the interactive comparison tool",
    );
  });

  it("returns combined trust and action banner messages for dossier headers", () => {
    const primary = entry({ slug: "primary" });
    expect(
      compareDossierHeaderBannerTexts(primary, [
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
});
