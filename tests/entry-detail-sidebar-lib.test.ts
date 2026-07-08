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
      sampleEntry({
        trust: "trusted",
        safetyNotes: "Keep secrets local.",
        reviewed: true,
      }),
    );
    expect(rows.find((row) => row.label === "Trust")?.ok).toBe(true);
    expect(rows.find((row) => row.label === "Safety notes")?.value).toBe(
      "Present",
    );
    expect(rows.find((row) => row.label === "Reviewed")?.ok).toBe(true);
  });

  it("marks unverified and missing safety signals as not ready", () => {
    const rows = entryReadinessRows(
      sampleEntry({
        trust: "review",
        source: "unverified",
        safetyNotes: undefined,
        reviewed: false,
      }),
    );
    expect(rows).toEqual([
      { label: "Trust", value: "Review first", ok: false },
      { label: "Source", value: "unverified", ok: false },
      { label: "Safety notes", value: "Missing", ok: false },
      { label: "Reviewed", value: "No", ok: false },
    ]);
  });

  it("builds quick links for docs and source URLs", () => {
    const links = entryQuickLinks(
      sampleEntry({
        docsUrl: "https://example.com/docs",
        sourceUrl: "https://github.com/org/repo",
      }),
    );
    expect(links.map((link) => link.id)).toEqual([
      "docs",
      "source",
      "registry-json",
    ]);
    expect(links[0]).toMatchObject({
      href: "https://example.com/docs",
      external: true,
    });
  });

  it("always includes registry JSON link when optional URLs are absent", () => {
    const links = entryQuickLinks(sampleEntry());
    expect(links).toEqual([
      {
        id: "registry-json",
        label: "Registry JSON · LLM text",
        to: "/browse",
      },
    ]);
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

  it("omits install risk for low-risk entries and includes optional sections", () => {
    const items = buildEntryTocItems({
      risk: "low",
      hasSafetyNotes: false,
      hasPrivacyNotes: true,
      hasPrerequisites: true,
      hasSchema: false,
      hasAlternatives: true,
      hasRelated: false,
      hasGuides: true,
    });
    expect(items.map((item) => item.id)).toEqual([
      "citation-facts",
      "adoption-plan",
      "privacy",
      "prerequisites",
      "about",
      "citations",
      "badge",
      "compare",
      "guides",
      "signals",
    ]);
  });
});
