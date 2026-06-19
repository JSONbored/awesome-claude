import { describe, expect, it } from "vitest";

import {
  countSearchResults,
  filterSearchEntries,
  matchesEntryQuery,
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

  it("filters by hasSafetyNotes", () => {
    const withSafety = entry({ slug: "safe", safetyNotes: "Requires file access." });
    const withoutSafety = entry({ slug: "no-safe" });
    const entries = [withSafety, withoutSafety];

    expect(filterSearchEntries({ hasSafetyNotes: true }, entries)).toEqual([withSafety]);
    expect(filterSearchEntries({ hasSafetyNotes: false }, entries)).toEqual(entries);
    expect(countSearchResults({ hasSafetyNotes: true }, entries)).toBe(1);
  });

  it("filters by hasPrivacyNotes", () => {
    const withPrivacy = entry({ slug: "private", privacyNotes: "Sends telemetry." });
    const withoutPrivacy = entry({ slug: "no-private" });
    const entries = [withPrivacy, withoutPrivacy];

    expect(filterSearchEntries({ hasPrivacyNotes: true }, entries)).toEqual([withPrivacy]);
    expect(filterSearchEntries({ hasPrivacyNotes: false }, entries)).toEqual(entries);
    expect(countSearchResults({ hasPrivacyNotes: true }, entries)).toBe(1);
  });

  it("combines hasSafetyNotes and hasPrivacyNotes filters", () => {
    const both = entry({ slug: "both", safetyNotes: "x", privacyNotes: "y" });
    const safetyOnly = entry({ slug: "safety-only", safetyNotes: "x" });
    const privacyOnly = entry({ slug: "privacy-only", privacyNotes: "y" });
    const neither = entry({ slug: "neither" });
    const entries = [both, safetyOnly, privacyOnly, neither];

    expect(
      filterSearchEntries({ hasSafetyNotes: true, hasPrivacyNotes: true }, entries),
    ).toEqual([both]);
    expect(filterSearchEntries({ hasSafetyNotes: true }, entries)).toEqual([both, safetyOnly]);
    expect(filterSearchEntries({ hasPrivacyNotes: true }, entries)).toEqual([both, privacyOnly]);
  });
});
