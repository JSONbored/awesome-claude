import { describe, expect, it } from "vitest";

import {
  booleanFilterMatches,
  entryMatchesTag,
  entryMatchesTrustFilters,
} from "../packages/mcp/src/registry-filter-lib.js";

describe("registry-filter-lib boolean filters", () => {
  it("passes through when filter is all or empty", () => {
    expect(booleanFilterMatches(true, "all")).toBe(true);
    expect(booleanFilterMatches(false, "all")).toBe(true);
    expect(booleanFilterMatches(true)).toBe(true);
  });

  it("matches explicit true and false filters", () => {
    expect(booleanFilterMatches(true, "true")).toBe(true);
    expect(booleanFilterMatches(false, "true")).toBe(false);
    expect(booleanFilterMatches(false, "false")).toBe(true);
    expect(booleanFilterMatches(true, "false")).toBe(false);
  });
});

describe("registry-filter-lib tag matching", () => {
  it("accepts entries with normalized tag matches", () => {
    const entry = { tags: ["MCP", "browser-bridge"] };
    expect(entryMatchesTag(entry, "")).toBe(true);
    expect(entryMatchesTag(entry, "mcp")).toBe(true);
    expect(entryMatchesTag(entry, "missing")).toBe(false);
  });
});

describe("registry-filter-lib trust filters", () => {
  const entry = {
    safetyNotes: [{ text: "Runs shell commands" }],
    privacyNotes: [],
    downloadTrust: "first-party",
    claimStatus: "verified",
    sourceStatus: "available",
  };

  it("accepts entries when trust filters are all", () => {
    expect(
      entryMatchesTrustFilters(entry, {
        hasSafetyNotes: "all",
        hasPrivacyNotes: "all",
        downloadTrust: "all",
        claimStatus: "all",
        sourceStatus: "all",
      }),
    ).toBe(true);
  });

  it("rejects entries that fail boolean or enum trust filters", () => {
    expect(entryMatchesTrustFilters(entry, { hasSafetyNotes: "false" })).toBe(
      false,
    );
    expect(entryMatchesTrustFilters(entry, { downloadTrust: "external" })).toBe(
      false,
    );
    expect(entryMatchesTrustFilters(entry, { claimStatus: "unclaimed" })).toBe(
      false,
    );
  });
});

describe("registry-filter edge cases", () => {
  it("does not match a tag for an entry with no tags", () => {
    expect(entryMatchesTag({}, "foo")).toBe(false);
  });

  it("rejects entries that fail an individual trust filter", () => {
    // hasPrivacyNotes: require present, entry has none
    expect(
      entryMatchesTrustFilters(
        { privacyNotes: [] },
        { hasPrivacyNotes: "true" },
      ),
    ).toBe(false);
    // downloadTrust mismatch
    expect(
      entryMatchesTrustFilters(
        { downloadTrust: "community" },
        { downloadTrust: "verified" },
      ),
    ).toBe(false);
    // claimStatus mismatch
    expect(
      entryMatchesTrustFilters(
        { claimStatus: "unclaimed" },
        { claimStatus: "verified" },
      ),
    ).toBe(false);
    // sourceStatus mismatch
    expect(
      entryMatchesTrustFilters(
        { trustSignals: { sourceStatus: "verified" } },
        { sourceStatus: "unverified" },
      ),
    ).toBe(false);
  });
});
