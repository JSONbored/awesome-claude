import { describe, expect, it } from "vitest";

import {
  countSearchResults,
  entryMatchesTrustSignal,
  filterSearchEntries,
  matchesEntryQuery,
  normalizeSearchQuery,
  search,
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

describe("weighted search ranking", () => {
  it("prefers title and slug matches over generic body mentions", () => {
    const genericMention = entry({
      slug: "observability-notes",
      title: "Operational Notes",
      description: "Mentions browser bridge once inside long documentation.",
      tags: ["ops"],
      keywords: ["docs"],
      dateAdded: "2026-01-06",
    });
    const keywordMatch = entry({
      slug: "automation-suite",
      title: "Automation Suite",
      description: "Playwright and browser automation for test workflows.",
      tags: ["browser-automation"],
      keywords: ["browser bridge toolkit"],
      dateAdded: "2026-01-05",
    });
    const titleMatch = entry({
      slug: "browser-bridge",
      title: "Browser Bridge",
      description: "Bridge Claude to a local browser session.",
      tags: ["browser", "automation"],
      keywords: ["playwright"],
      dateAdded: "2026-01-04",
    });

    const ranked = search({ q: "browser bridge", sort: "popular" }, [
      genericMention,
      keywordMatch,
      titleMatch,
    ]);
    expect(ranked.map((item) => item.slug)).toEqual([
      "browser-bridge",
      "automation-suite",
      "observability-notes",
    ]);
  });

  it("keeps recommended-score fallback when relevance ties", () => {
    const lowerTrust = entry({
      slug: "browser-helper-a",
      title: "Browser Helper",
      description: "Browser helper for Claude.",
      source: "external",
      dateAdded: "2026-01-01",
    });
    const higherTrust = entry({
      slug: "browser-helper-b",
      title: "Browser Helper",
      description: "Browser helper for Claude.",
      source: "first-party",
      packageVerified: true,
      safetyNotes: "Requires local browser access.",
      privacyNotes: "Reads browser cookies.",
      dateAdded: "2026-01-01",
    });

    const ranked = search({ q: "browser helper", sort: "popular" }, [
      lowerTrust,
      higherTrust,
    ]);
    expect(ranked[0]?.slug).toBe("browser-helper-b");
  });

  it("boosts exact slug and category intent matches", () => {
    const slugExact = entry({
      category: "mcp",
      slug: "browser-bridge",
      title: "Bridge",
      description: "Utility bridge.",
    });
    const categoryOnly = entry({
      category: "mcp",
      slug: "helper-tool",
      title: "Helper Tool",
      description: "A helper in the MCP category.",
    });
    const weakMention = entry({
      category: "commands",
      slug: "notes",
      title: "Notes",
      description: "Mentions mcp browser bridge in passing.",
    });

    const ranked = search({ q: "mcp", sort: "popular" }, [
      weakMention,
      categoryOnly,
      slugExact,
    ]);
    expect(ranked.at(-1)?.slug).toBe("notes");
    expect(new Set(ranked.slice(0, 2).map((item) => item.slug))).toEqual(
      new Set(["browser-bridge", "helper-tool"]),
    );
  });

  it("uses author and submitted-by fields in relevance scoring", () => {
    const submittedByMatch = entry({
      slug: "submission-helper",
      title: "Submission Helper",
      submittedBy: "kiannidev",
    });
    const bodyMention = entry({
      slug: "body-mention",
      title: "Body Mention",
      description: "Created by kiannidev according to release notes.",
    });

    const ranked = search({ q: "kiannidev", sort: "popular" }, [
      bodyMention,
      submittedByMatch,
    ]);
    expect(ranked[0]?.slug).toBe("submission-helper");
  });

  it("preserves explicit newest and title sort modes", () => {
    const zebra = entry({
      slug: "zebra",
      title: "Zebra Tool",
      dateAdded: "2026-01-01",
    });
    const alpha = entry({
      slug: "alpha",
      title: "Alpha Tool",
      dateAdded: "2026-02-01",
    });

    expect(
      search({ q: "tool", sort: "newest" }, [zebra, alpha]).map(
        (item) => item.slug,
      ),
    ).toEqual(["alpha", "zebra"]);
    expect(
      search({ q: "tool", sort: "title" }, [zebra, alpha]).map(
        (item) => item.slug,
      ),
    ).toEqual(["alpha", "zebra"]);
  });
});
