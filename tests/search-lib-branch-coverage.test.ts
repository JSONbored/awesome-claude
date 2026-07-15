import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { ENTRIES } from "@/data/entries";
import {
  entryMatchesTrustSignal,
  filterSearchEntries,
  matchesSearchFilters,
  related,
  relatedBySimilarity,
  relatedGroups,
  relatedGuides,
  search,
} from "@/data/search";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "skills",
    slug: "fixture",
    title: "Fixture Skill",
    description: "A searchable description about memory workflows",
    author: "Author",
    tags: ["memory"],
    keywords: ["rag"],
    platforms: ["claude-code"],
    installType: "manual",
    trust: "review",
    source: "unverified",
    dateAdded: "2026-01-01",
    ...overrides,
  } as Entry;
}

describe("search lib branch coverage", () => {
  it("matches trust signals from trustSignals metadata fallbacks", () => {
    const viaSignals = entry({
      safetyNotes: undefined,
      privacyNotes: undefined,
      source: "unverified",
      reviewed: false,
      reviewedBy: undefined,
      claimed: false,
      claimStatus: undefined,
      packageVerified: false,
      downloadSha256: undefined,
      trustSignals: {
        hasSafetyNotes: true,
        hasPrivacyNotes: true,
        sourceStatus: "available",
        packageVerified: true,
        checksumPresent: true,
      },
    });

    expect(entryMatchesTrustSignal(viaSignals, "safety-notes")).toBe(true);
    expect(entryMatchesTrustSignal(viaSignals, "privacy-notes")).toBe(true);
    expect(entryMatchesTrustSignal(viaSignals, "source-backed")).toBe(true);
    expect(entryMatchesTrustSignal(viaSignals, "trusted-package")).toBe(true);
    expect(entryMatchesTrustSignal(viaSignals, "checksums")).toBe(true);
    expect(
      entryMatchesTrustSignal(
        entry({ ...viaSignals, claimStatus: "verified" }),
        "reviewed",
      ),
    ).toBe(true);
    expect(entryMatchesTrustSignal(viaSignals, "not-a-signal" as never)).toBe(
      false,
    );
  });

  it("filters installable, trust, source, and safety-note rows", () => {
    const catalog = [
      entry({
        slug: "installable",
        trust: "trusted",
        source: "source-backed",
        installCommand: "npm i fixture",
        safetyNotes: "Careful",
      }),
      entry({
        slug: "docs-only",
        trust: "limited",
        source: "unverified",
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
        safetyNotes: undefined,
      }),
    ];

    expect(
      filterSearchEntries({ installable: true }, catalog).map(
        (row) => row.slug,
      ),
    ).toEqual(["installable"]);
    expect(
      filterSearchEntries({ hasSafetyNotes: true }, catalog).map(
        (row) => row.slug,
      ),
    ).toEqual(["installable"]);
    expect(
      filterSearchEntries({ trust: ["trusted"] }, catalog).map(
        (row) => row.slug,
      ),
    ).toEqual(["installable"]);
    expect(
      filterSearchEntries({ source: ["source-backed"] }, catalog).map(
        (row) => row.slug,
      ),
    ).toEqual(["installable"]);
    expect(
      matchesSearchFilters(catalog[1]!, {
        categories: ["mcp"],
      }),
    ).toBe(false);
    expect(
      matchesSearchFilters(catalog[0]!, {
        platforms: ["cursor"],
      }),
    ).toBe(false);
  });

  it("scores query relevance through title, slug, and sort paths", () => {
    const catalog = [
      entry({
        slug: "memory-pack",
        title: "Memory Pack",
        tags: ["memory"],
        keywords: ["vector"],
        description: "Implements retrieval augmentation",
        dateAdded: "2026-06-01",
      }),
      entry({
        slug: "other",
        title: "Other",
        tags: ["hooks"],
        description: "Unrelated tooling",
        dateAdded: "2025-01-01",
      }),
    ];

    const ranked = search({ q: "memory", sort: "popular" }, catalog);
    expect(ranked[0]?.slug).toBe("memory-pack");

    const byTitle = search({ sort: "title" }, catalog);
    expect(byTitle.map((row) => row.title)).toEqual(["Memory Pack", "Other"]);

    const byNewest = search({ sort: "newest" }, catalog);
    expect(byNewest[0]?.slug).toBe("memory-pack");

    const shortToken = search({ q: "me" }, catalog);
    expect(shortToken.some((row) => row.slug === "memory-pack")).toBe(true);
  });

  it("ranks similarity by shared category and tags", () => {
    const target = entry({ slug: "target", tags: ["memory", "rag"] });
    const sameCategory = entry({
      slug: "same-category",
      tags: ["hooks"],
    });
    const sharedTags = entry({
      category: "mcp",
      slug: "shared-tags",
      tags: ["memory", "rag"],
    });

    expect(
      relatedBySimilarity(target, [target, sameCategory, sharedTags], 2).map(
        (row) => row.slug,
      ),
    ).toEqual(["shared-tags", "same-category"]);
  });

  it("returns empty related groups when no typed relations exist", () => {
    const target = entry({ slug: "target", relatedEntries: [] });
    expect(relatedGroups(target, 2)).toEqual([]);
    expect(Array.isArray(related(target, 2))).toBe(true);
    expect(ENTRIES.length).toBeGreaterThan(0);
  });

  it("returns no related guides when tags are empty or never overlap", () => {
    expect(relatedGuides(entry({ tags: [] }))).toEqual([]);
    expect(relatedGuides(entry({ tags: ["zzz-nonexistent-tag-zzz"] }))).toEqual(
      [],
    );
  });
});
