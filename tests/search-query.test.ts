import { describe, expect, it } from "vitest";

import {
  countSearchResults,
  entryMatchesTrustSignal,
  filterSearchEntries,
  matchesEntryQuery,
  normalizeSearchQuery,
} from "../apps/web/src/data/search";
import type { Entry } from "../apps/web/src/types/registry";

function entry(overrides: Partial<Entry>): Entry {
  return {
    category: "mcp",
    slug: "example",
    title: "Example",
    description: "Example description",
    author: "Example",
    tags: [],
    platforms: ["claude-code"],
    installType: "manual",
    trust: "unverified",
    source: "unverified",
    dateAdded: "2026-01-01",
    ...overrides,
  };
}

describe("entry query matching", () => {
  it("matches multi-token queries regardless of term order", () => {
    const browserEntry = entry({
      title: "Browser Bridge",
      description: "Runs Playwright automation for Claude Code sessions.",
      tags: ["browser-automation"],
      keywords: ["model-context-protocol"],
    });

    expect(matchesEntryQuery(browserEntry, "browser playwright")).toBe(true);
    expect(matchesEntryQuery(browserEntry, "playwright browser")).toBe(true);
    expect(matchesEntryQuery(browserEntry, "model protocol")).toBe(true);
    expect(matchesEntryQuery(browserEntry, "spreadsheet export")).toBe(false);
  });

  it("expands common query aliases", () => {
    const githubEntry = entry({
      title: "Repository Review",
      description: "Reviews pull requests for Claude Code.",
      tags: ["github", "code-review"],
      keywords: ["repository review"],
    });

    expect(matchesEntryQuery(githubEntry, "gh review")).toBe(true);
    expect(matchesEntryQuery(githubEntry, "cc review")).toBe(true);
  });

  it("bounds query normalization and token matching work", () => {
    const browserEntry = entry({
      title: "Browser Bridge",
      description: "Runs Playwright automation for Claude Code sessions.",
      tags: ["browser-automation"],
    });
    const longQuery = `${"browser ".repeat(20)}${"x,".repeat(10_000)}`;

    expect(
      normalizeSearchQuery(` ${"a".repeat(300)} `).length,
    ).toBeLessThanOrEqual(256);
    expect(matchesEntryQuery(browserEntry, longQuery)).toBe(true);
    expect(matchesEntryQuery(browserEntry, ",".repeat(10_000))).toBe(false);
  });
});

describe("entry search filters", () => {
  it("shares query matching across filtering and count-only paths", () => {
    const browserEntry = entry({
      category: "mcp",
      slug: "browser",
      title: "Browser Bridge",
      description: "Playwright browser automation.",
      tags: ["browser-automation"],
      source: "source-backed",
    });
    const safetySkill = entry({
      category: "skills",
      slug: "safety-review",
      title: "Safety Review",
      description: "Privacy guardrails for safe agent workflows.",
      tags: ["security", "privacy"],
      trust: "trusted",
      source: "first-party",
    });
    const unrelated = entry({
      category: "commands",
      slug: "notes",
      title: "Notes Export",
      description: "Exports notes to markdown.",
      tags: ["notes"],
    });
    const entries = [browserEntry, safetySkill, unrelated];

    const filters = {
      q: "privacy safe",
      categories: ["skills" as const],
      trust: ["trusted" as const],
    };

    expect(filterSearchEntries(filters, entries)).toEqual([safetySkill]);
    expect(countSearchResults(filters, entries)).toBe(1);
  });

  it("filters entries by trust signal quick chips", () => {
    const sourceBacked = entry({
      slug: "source-backed",
      source: "source-backed",
    });
    const sourceSignal = entry({
      slug: "source-signal",
      source: "external",
      trustSignals: {
        sourceStatus: "available",
      },
    });
    const external = entry({
      slug: "external",
      source: "external",
    });
    const disclosed = entry({
      slug: "disclosed",
      safetyNotes: "Runs local shell commands.",
      privacyNotes: "Reads local project files.",
      trustSignals: {
        hasSafetyNotes: true,
        hasPrivacyNotes: true,
      },
    });
    const packageEntry = entry({
      slug: "package",
      downloadSha256: "abc123",
      packageVerified: true,
      downloadTrust: "first-party",
      trustSignals: {
        checksumPresent: true,
        packageTrust: "first-party",
        packageVerified: true,
      },
    });
    const reviewed = entry({
      slug: "reviewed",
      reviewed: true,
      claimStatus: "verified",
    });
    const entries = [
      sourceBacked,
      sourceSignal,
      external,
      disclosed,
      packageEntry,
      reviewed,
    ];

    expect(entryMatchesTrustSignal(disclosed, "safety-notes")).toBe(true);
    expect(entryMatchesTrustSignal(external, "source-backed")).toBe(false);
    expect(filterSearchEntries({ signal: "privacy-notes" }, entries)).toEqual([
      disclosed,
    ]);
    expect(filterSearchEntries({ signal: "source-backed" }, entries)).toEqual([
      sourceBacked,
      sourceSignal,
    ]);
    expect(filterSearchEntries({ signal: "trusted-package" }, entries)).toEqual(
      [packageEntry],
    );
    expect(filterSearchEntries({ signal: "checksums" }, entries)).toEqual([
      packageEntry,
    ]);
    expect(countSearchResults({ signal: "reviewed" }, entries)).toBe(1);
  });
});
