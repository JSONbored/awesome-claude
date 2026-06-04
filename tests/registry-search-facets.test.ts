import { describe, expect, it } from "vitest";

import type { SearchDocument } from "@heyclaude/registry";

import { computeRegistrySearchFacets } from "../apps/web/src/lib/api/registry-search-facets";
import {
  filterEntries,
  type RegistrySearchFilterState,
} from "../apps/web/src/lib/api/registry-search-filters";

function makeEntry(overrides: Partial<SearchDocument>): SearchDocument {
  return {
    category: "mcp",
    slug: "fixture",
    title: "Fixture entry",
    description: "fixture description",
    tags: [],
    keywords: [],
    author: "tester",
    dateAdded: "2026-05-21",
    installable: false,
    downloadTrust: null,
    verificationStatus: "unverified",
    documentationUrl: "https://example.com/docs",
    repoUrl: "https://example.com/repo",
    url: "https://example.com",
    canonicalUrl: "https://example.com",
    llmsUrl: "https://example.com/llms.txt",
    apiUrl: "https://example.com/api",
    trustSignals: {
      firstPartyEditorial: false,
      packageVerified: false,
      packageTrust: null,
      packageChecksum: "",
      checksumPresent: false,
      sourceUrlCount: 0,
      sourceUrls: [],
      sourceStatus: "missing",
      lastVerifiedAt: "",
      adapterGenerated: false,
      hasSafetyNotes: false,
      hasPrivacyNotes: false,
      platforms: [],
      supportLevels: [],
    },
    ...overrides,
  } as SearchDocument;
}

const defaultFilters: RegistrySearchFilterState = {
  query: "",
  category: "",
  platform: "",
  hasSafetyNotes: "all",
  hasPrivacyNotes: "all",
  downloadTrust: "all",
  claimStatus: "all",
  sourceStatus: "all",
};

const fixtures: SearchDocument[] = [
  makeEntry({
    slug: "mcp-a",
    category: "mcp",
    platforms: ["claude-code", "cursor"],
    safetyNotes: ["network access"],
    downloadTrust: "first-party",
    claimStatus: "verified",
    trustSignals: {
      ...makeEntry({}).trustSignals,
      sourceStatus: "available",
      hasSafetyNotes: true,
    },
  }),
  makeEntry({
    slug: "mcp-b",
    category: "mcp",
    platforms: ["claude-code"],
    downloadTrust: "external",
    claimStatus: "unclaimed",
    trustSignals: {
      ...makeEntry({}).trustSignals,
      sourceStatus: "missing",
    },
  }),
  makeEntry({
    slug: "skill-a",
    category: "skills",
    platforms: ["cursor"],
    privacyNotes: ["reads local files"],
    downloadTrust: "first-party",
    claimStatus: "verified",
    trustSignals: {
      ...makeEntry({}).trustSignals,
      sourceStatus: "available",
      hasPrivacyNotes: true,
    },
  }),
  makeEntry({
    slug: "hook-a",
    category: "hooks",
    platforms: ["claude-code"],
    safetyNotes: ["runs shell"],
    privacyNotes: ["logs commands"],
    downloadTrust: "external",
    claimStatus: "pending",
    trustSignals: {
      ...makeEntry({}).trustSignals,
      sourceStatus: "available",
      hasSafetyNotes: true,
      hasPrivacyNotes: true,
    },
  }),
];

describe("computeRegistrySearchFacets", () => {
  it("counts every dimension across the unfiltered set", () => {
    const facets = computeRegistrySearchFacets(fixtures, defaultFilters);

    expect(facets.categories).toEqual({ mcp: 2, hooks: 1, skills: 1 });
    expect(facets.platforms).toEqual({ "claude-code": 3, cursor: 2 });
    expect(facets.hasSafetyNotes).toEqual({ false: 2, true: 2 });
    expect(facets.hasPrivacyNotes).toEqual({ false: 2, true: 2 });
    expect(facets.downloadTrust).toEqual({
      "first-party": 2,
      external: 2,
    });
    expect(facets.claimStatus).toEqual({
      verified: 2,
      pending: 1,
      unclaimed: 1,
    });
    expect(facets.sourceStatus).toEqual({ available: 3, missing: 1 });
  });

  it("applies other filters but excludes the dimension being faceted", () => {
    const filters: RegistrySearchFilterState = {
      ...defaultFilters,
      category: "mcp",
    };

    const facets = computeRegistrySearchFacets(fixtures, filters);

    expect(facets.categories).toEqual({ mcp: 2, hooks: 1, skills: 1 });

    expect(facets.platforms).toEqual({ "claude-code": 2, cursor: 1 });
    expect(facets.downloadTrust).toEqual({ "first-party": 1, external: 1 });
    expect(facets.claimStatus).toEqual({ verified: 1, unclaimed: 1 });
  });

  it("returns deterministic, bounded buckets sorted by count then key", () => {
    const facets = computeRegistrySearchFacets(fixtures, defaultFilters);

    const platformEntries = Object.entries(facets.platforms);
    expect(platformEntries).toEqual([
      ["claude-code", 3],
      ["cursor", 2],
    ]);

    const categoryEntries = Object.entries(facets.categories);
    expect(categoryEntries[0]?.[0]).toBe("mcp");
    expect(categoryEntries.slice(1).map(([key]) => key)).toEqual(
      ["hooks", "skills"].sort(),
    );
  });

  it("omits empty buckets and preserves the active filter selection", () => {
    const filters: RegistrySearchFilterState = {
      ...defaultFilters,
      downloadTrust: "first-party",
    };

    const facets = computeRegistrySearchFacets(fixtures, filters);

    expect(facets.downloadTrust).toEqual({ "first-party": 2, external: 2 });
    expect(facets.categories).toEqual({ mcp: 1, skills: 1 });
    expect(facets.categories).not.toHaveProperty("hooks");
  });

  it("treats every entry as either true or false for boolean dimensions", () => {
    const facets = computeRegistrySearchFacets(fixtures, defaultFilters);
    const safetyTotal =
      (facets.hasSafetyNotes.true ?? 0) + (facets.hasSafetyNotes.false ?? 0);
    const privacyTotal =
      (facets.hasPrivacyNotes.true ?? 0) + (facets.hasPrivacyNotes.false ?? 0);
    expect(safetyTotal).toBe(fixtures.length);
    expect(privacyTotal).toBe(fixtures.length);
  });

  it("keeps filterEntries and facet counts consistent for the active selection", () => {
    const filters: RegistrySearchFilterState = {
      ...defaultFilters,
      hasSafetyNotes: "true",
    };

    const matched = filterEntries(fixtures, filters);
    const facets = computeRegistrySearchFacets(fixtures, filters);

    expect(matched).toHaveLength(2);
    expect(facets.hasSafetyNotes.true).toBe(2);
  });

  it("uses compact trust-signal booleans when full note text is omitted", () => {
    const compact = makeEntry({
      slug: "compact-notes",
      trustSignals: {
        ...makeEntry({}).trustSignals,
        hasSafetyNotes: true,
        hasPrivacyNotes: true,
      },
    });

    expect(
      filterEntries([compact], {
        ...defaultFilters,
        hasSafetyNotes: "true",
      }),
    ).toHaveLength(1);
    expect(
      computeRegistrySearchFacets([compact], defaultFilters),
    ).toMatchObject({
      hasSafetyNotes: { true: 1 },
      hasPrivacyNotes: { true: 1 },
    });
  });
});
