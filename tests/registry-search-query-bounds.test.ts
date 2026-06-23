import { describe, expect, it } from "vitest";

import type { SearchDocument } from "@heyclaude/registry";

import {
  matchesQuery,
  scoreSearchEntry,
} from "../apps/web/src/lib/api/registry-search-filters";
import {
  MAX_QUERY_LENGTH,
  MAX_QUERY_TOKENS,
  normalizeSearchQuery,
  tokenizeSearchQuery,
} from "../apps/web/src/lib/search-query-tokenization";

function makeEntry(overrides: Partial<SearchDocument> = {}): SearchDocument {
  return {
    category: "mcp",
    slug: "browser-bridge",
    title: "Browser Bridge",
    description: "Runs Playwright automation for Claude Code sessions.",
    tags: ["browser-automation"],
    keywords: ["playwright", "browser automation"],
    author: "Example Maintainer",
    dateAdded: "2026-01-01",
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
      sourceStatus: "available",
      lastVerifiedAt: "",
      adapterGenerated: false,
      hasSafetyNotes: false,
      hasPrivacyNotes: false,
      platforms: ["claude-code"],
      supportLevels: [],
    },
    ...overrides,
  } as SearchDocument;
}

describe("registry search query bounds", () => {
  it("normalizes query length before registry API matching", () => {
    expect(
      normalizeSearchQuery(` ${"a".repeat(300)} `).length,
    ).toBeLessThanOrEqual(MAX_QUERY_LENGTH);
  });

  it("tokenizes delimiter-heavy queries without split allocation", () => {
    expect(tokenizeSearchQuery(",".repeat(10_000))).toEqual([]);
    expect(
      tokenizeSearchQuery(`${"browser ".repeat(20)}${"x,".repeat(10_000)}`),
    ).toHaveLength(MAX_QUERY_TOKENS);
  });

  it("matches multi-token registry queries regardless of order", () => {
    const entry = makeEntry();

    expect(matchesQuery(entry, "browser playwright")).toBe(true);
    expect(matchesQuery(entry, "playwright browser")).toBe(true);
    expect(matchesQuery(entry, "spreadsheet export")).toBe(false);
  });

  it("rejects delimiter-only registry queries and still matches long valid queries", () => {
    const entry = makeEntry();
    const longQuery = `${"browser ".repeat(20)}${"x,".repeat(10_000)}`;

    expect(matchesQuery(entry, longQuery)).toBe(true);
    expect(matchesQuery(entry, ",".repeat(10_000))).toBe(false);
  });

  it("scores ranked registry search using bounded tokenization", () => {
    const entry = makeEntry();
    const ranked = scoreSearchEntry(entry, "browser playwright");

    expect(ranked.score).toBeGreaterThan(0);
    expect(scoreSearchEntry(entry, ",".repeat(10_000))).toEqual({
      score: 0,
      reasons: [],
    });
  });

  it("expands registry query aliases added to the shared alias map", () => {
    const entry = makeEntry({
      tags: ["automation", "testing"],
      keywords: ["qa workflow"],
    });

    expect(matchesQuery(entry, "automation qa")).toBe(true);
    expect(matchesQuery(entry, "design ux")).toBe(false);
  });
});
