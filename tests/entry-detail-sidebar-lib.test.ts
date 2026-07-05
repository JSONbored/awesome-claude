import { describe, expect, it } from "vitest";

import {
  buildEntryTocItems,
  entryQuickLinks,
  entryReadinessRows,
} from "../apps/web/src/lib/entry-detail-sidebar-lib";
import type { Entry } from "../apps/web/src/types/registry";

function sampleEntry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "skills",
    slug: "sample",
    title: "Sample",
    description: "Sample entry",
    author: "Author",
    tags: [],
    platforms: [],
    trust: "review",
    source: "source-backed",
    dateAdded: "2026-01-01",
    ...overrides,
  } as Entry;
}

describe("entry-detail-sidebar-lib", () => {
  it("builds readiness rows from entry trust signals", () => {
    const rows = entryReadinessRows(
      sampleEntry({ trust: "trusted", safetyNotes: "Keep secrets local.", reviewed: true }),
    );
    expect(rows.find((row) => row.label === "Trust")?.ok).toBe(true);
    expect(rows.find((row) => row.label === "Safety notes")?.value).toBe("Present");
    expect(rows.find((row) => row.label === "Reviewed")?.ok).toBe(true);
  });

  it("builds quick links for docs and source URLs", () => {
    const links = entryQuickLinks(
      sampleEntry({
        docsUrl: "https://example.com/docs",
        sourceUrl: "https://github.com/org/repo",
      }),
    );
    expect(links.map((link) => link.id)).toEqual(["docs", "source", "registry-json"]);
  });

  it("orders dossier TOC items with optional risk and schema sections", () => {
    const items = buildEntryTocItems({
      risk: "high",
      hasSafetyNotes: true,
      hasPrivacyNotes: false,
      hasPrerequisites: false,
      hasSchema: true,
      hasAlternatives: false,
      hasRelated: true,
      hasGuides: false,
    });
    expect(items[0]).toEqual({ id: "risk-callout", label: "Install risk" });
    expect(items.some((item) => item.id === "schema")).toBe(true);
    expect(items.at(-1)).toEqual({ id: "signals", label: "Signals" });
  });
});
