import { describe, expect, it } from "vitest";

import type { DirectoryEntry } from "@/lib/content";
import {
  countTrustFilterChips,
  matchesUtilityFilter,
  normalizeUtilityFilter,
  trustFilterChips,
  utilityFilterOptions,
} from "../apps/web/src/lib/browse-utility-filters";

function makeEntry(overrides: Partial<DirectoryEntry>): DirectoryEntry {
  return {
    category: "mcp",
    slug: "fixture",
    title: "Fixture",
    description: "fixture",
    tags: [],
    keywords: [],
    author: "tester",
    dateAdded: "2026-05-21",
    installable: false,
    verificationStatus: "unverified",
    documentationUrl: "https://example.com",
    repoUrl: "https://example.com",
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
      platforms: [],
      supportLevels: [],
    },
    ...overrides,
  } as DirectoryEntry;
}

describe("normalizeUtilityFilter", () => {
  it("returns the input when it matches a known option", () => {
    for (const option of utilityFilterOptions) {
      expect(normalizeUtilityFilter(option.value)).toBe(option.value);
    }
  });

  it("falls back to 'all' for unknown or empty values", () => {
    expect(normalizeUtilityFilter(undefined)).toBe("all");
    expect(normalizeUtilityFilter("")).toBe("all");
    expect(normalizeUtilityFilter("not-a-filter")).toBe("all");
  });

  it("lowercases and trims input", () => {
    expect(normalizeUtilityFilter("  Source-Backed  ")).toBe("source-backed");
  });
});

describe("matchesUtilityFilter", () => {
  it("returns true for every entry under the 'all' selector", () => {
    const entry = makeEntry({});
    expect(matchesUtilityFilter(entry, "all")).toBe(true);
  });

  it("matches safety and privacy disclosures by note presence", () => {
    const withSafety = makeEntry({ safetyNotes: ["runs shell"] });
    const withPrivacy = makeEntry({ privacyNotes: ["reads local files"] });
    const baseline = makeEntry({});

    expect(matchesUtilityFilter(withSafety, "safety-notes")).toBe(true);
    expect(matchesUtilityFilter(baseline, "safety-notes")).toBe(false);
    expect(matchesUtilityFilter(withPrivacy, "privacy-notes")).toBe(true);
    expect(matchesUtilityFilter(baseline, "privacy-notes")).toBe(false);
  });

  it("matches source-backed entries only when sourceStatus is available", () => {
    const available = makeEntry({
      trustSignals: { ...makeEntry({}).trustSignals, sourceStatus: "available" },
    });
    const missing = makeEntry({});
    expect(matchesUtilityFilter(available, "source-backed")).toBe(true);
    expect(matchesUtilityFilter(missing, "source-backed")).toBe(false);
  });

  it("treats first-party or verified packages as trusted-package", () => {
    const firstParty = makeEntry({ downloadTrust: "first-party" });
    const verified = makeEntry({ packageVerified: true });
    const external = makeEntry({ downloadTrust: "external" });
    expect(matchesUtilityFilter(firstParty, "trusted-package")).toBe(true);
    expect(matchesUtilityFilter(verified, "trusted-package")).toBe(true);
    expect(matchesUtilityFilter(external, "trusted-package")).toBe(false);
  });

  it("marks reviewed entries with reviewer or verified claim", () => {
    const reviewed = makeEntry({ reviewedBy: "maintainer" });
    const claimed = makeEntry({ claimStatus: "verified" });
    const unreviewed = makeEntry({ claimStatus: "unclaimed" });
    expect(matchesUtilityFilter(reviewed, "reviewed")).toBe(true);
    expect(matchesUtilityFilter(claimed, "reviewed")).toBe(true);
    expect(matchesUtilityFilter(unreviewed, "reviewed")).toBe(false);
  });

  it("marks checksum-bearing entries via trustSignals", () => {
    const withChecksum = makeEntry({
      trustSignals: {
        ...makeEntry({}).trustSignals,
        checksumPresent: true,
      },
    });
    const withoutChecksum = makeEntry({});
    expect(matchesUtilityFilter(withChecksum, "checksum")).toBe(true);
    expect(matchesUtilityFilter(withoutChecksum, "checksum")).toBe(false);
  });
});

describe("countTrustFilterChips", () => {
  const fixtures: DirectoryEntry[] = [
    makeEntry({
      slug: "a",
      safetyNotes: ["network access"],
      downloadTrust: "first-party",
      trustSignals: {
        ...makeEntry({}).trustSignals,
        sourceStatus: "available",
        checksumPresent: true,
      },
      reviewedBy: "maintainer",
    }),
    makeEntry({
      slug: "b",
      privacyNotes: ["reads logs"],
      packageVerified: true,
      claimStatus: "verified",
    }),
    makeEntry({
      slug: "c",
    }),
  ];

  it("counts every chip across the loaded entry set", () => {
    const counts = countTrustFilterChips(fixtures);

    expect(counts["safety-notes"]).toBe(1);
    expect(counts["privacy-notes"]).toBe(1);
    expect(counts["source-backed"]).toBe(1);
    expect(counts["trusted-package"]).toBe(2);
    expect(counts["reviewed"]).toBe(2);
    expect(counts["checksum"]).toBe(1);
  });

  it("returns zero for chips that no entry matches", () => {
    const counts = countTrustFilterChips([
      makeEntry({ slug: "plain" }),
      makeEntry({ slug: "plain-two" }),
    ]);

    for (const chip of trustFilterChips) {
      expect(counts[chip.value]).toBe(0);
    }
  });

  it("produces a count for every defined trust chip", () => {
    const counts = countTrustFilterChips(fixtures);
    for (const chip of trustFilterChips) {
      expect(typeof counts[chip.value]).toBe("number");
    }
  });
});
