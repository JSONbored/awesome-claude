import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  buildWeeklyBrief,
  renderWeeklyBriefMarkdown,
  type DirectoryEntry,
} from "@heyclaude/registry";

const DEFAULT_TRUST_SIGNALS: NonNullable<DirectoryEntry["trustSignals"]> = {
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
};

function entry(
  slug: string,
  overrides: Partial<DirectoryEntry> = {},
): Partial<DirectoryEntry> {
  return {
    category: "mcp",
    slug,
    title: slug
      .split("-")
      .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
      .join(" "),
    description: `Registry entry for ${slug}.`,
    dateAdded: "2026-05-01",
    canonicalUrl: `https://heyclau.de/entry/mcp/${slug}`,
    tags: [],
    keywords: [],
    trustSignals: {
      ...DEFAULT_TRUST_SIGNALS,
    },
    ...overrides,
  };
}

describe("weekly brief generation", () => {
  it("selects deterministic new, source-backed, safer-install, and changelog sections", () => {
    const brief = buildWeeklyBrief(
      [
        entry("new-weak", {
          dateAdded: "2026-05-29",
        }),
        entry("new-source-backed", {
          dateAdded: "2026-05-28",
          documentationUrl: "https://example.com/new-source-backed/docs",
          safetyNotes: ["Uses network access."],
          privacyNotes: ["Reads configured account metadata."],
          trustSignals: {
            ...DEFAULT_TRUST_SIGNALS,
            sourceStatus: "available",
            sourceUrls: ["https://example.com/new-source-backed/docs"],
          },
        }),
        entry("older-source", {
          dateAdded: "2026-05-10",
          repoUrl: "https://github.com/example/older-source",
          trustSignals: {
            ...DEFAULT_TRUST_SIGNALS,
            sourceStatus: "available",
            sourceUrls: ["https://github.com/example/older-source"],
          },
        }),
        entry("safer-install", {
          dateAdded: "2026-05-09",
          installable: true,
          installCommand: "npx -y safer-install",
          downloadTrust: "first-party",
          packageVerified: true,
        }),
      ],
      {
        generatedAt: "2026-05-30T00:00:00.000Z",
        days: 7,
        limits: {
          newEntries: 3,
          sourceBacked: 2,
          saferInstalls: 2,
          notableChanges: 2,
        },
        changelogEntries: [
          {
            category: "mcp",
            slug: "older-source",
            title: "Older Source",
            type: "added",
            dateAdded: "2026-05-10",
          },
          {
            category: "mcp",
            slug: "new-source-backed",
            title: "New Source Backed",
            type: "added",
            dateAdded: "2026-05-28",
          },
        ],
      },
    );

    expect(brief.summary).toMatchObject({
      totalEntries: 4,
      newEntryCount: 2,
      sourceBackedCount: 1,
      saferInstallCount: 1,
      notableChangeCount: 1,
    });
    expect(brief.sections.newEntries.map((item) => item.key)).toEqual([
      "mcp:new-weak",
      "mcp:new-source-backed",
    ]);
    expect(brief.sections.sourceBacked.map((item) => item.key)).toEqual([
      "mcp:older-source",
    ]);
    expect(brief.sections.saferInstalls.map((item) => item.key)).toEqual([
      "mcp:safer-install",
    ]);
    expect(brief.sections.notableChanges.map((item) => item.key)).toEqual([
      "mcp:new-source-backed",
    ]);
  });

  it("handles low-signal data without inventing picks", () => {
    const brief = buildWeeklyBrief(
      [
        entry("old-unsourced", {
          dateAdded: "2026-01-01",
          trustSignals: {
            ...DEFAULT_TRUST_SIGNALS,
            sourceStatus: "missing",
          },
        }),
      ],
      {
        generatedAt: "2026-05-30T00:00:00.000Z",
        days: 7,
        changelogEntries: [],
      },
    );
    const markdown = renderWeeklyBriefMarkdown(brief);

    expect(brief.sections.newEntries).toEqual([]);
    expect(brief.sections.sourceBacked).toEqual([]);
    expect(brief.sections.saferInstalls).toEqual([]);
    expect(brief.sections.notableChanges).toEqual([]);
    expect(markdown).toContain(
      "No new registry entries matched this brief window.",
    );
    expect(markdown).toContain("No source-backed picks were selected.");
  });

  it("defaults invalid day windows instead of leaking non-finite output", () => {
    const brief = buildWeeklyBrief([], {
      generatedAt: "2026-05-30T00:00:00.000Z",
      days: Number.NaN,
    });

    expect(brief.period.days).toBe(7);
  });

  it("normalizes malformed generatedAt values before emitting the brief", () => {
    const brief = buildWeeklyBrief(
      [
        entry("newer-source", {
          dateAdded: "2026-05-29",
        }),
      ],
      {
        generatedAt: "2026-99-99T12:00:00.000Z",
        days: 7,
      },
    );

    expect(brief.generatedAt).toBe("2026-05-29T00:00:00.000Z");
    expect(brief.period.through).toBe("2026-05-29");
  });

  it("escapes markdown text and drops unsafe canonical URLs", () => {
    const brief = buildWeeklyBrief(
      [
        entry("unsafe-link", {
          title: "Bad](javascript:alert(1))",
          description: "Line one\n[click](javascript:alert(2))",
          canonicalUrl: "javascript:alert(3)",
          dateAdded: "2026-05-29",
          trustSignals: {
            ...DEFAULT_TRUST_SIGNALS,
            sourceUrls: ["javascript:alert(4)"],
          },
        }),
        entry("unsafe-source-only", {
          dateAdded: "2026-05-10",
          trustSignals: {
            ...DEFAULT_TRUST_SIGNALS,
            sourceUrls: ["javascript:alert(5)"],
          },
        }),
      ],
      {
        generatedAt: "2026-05-30T00:00:00.000Z",
        days: 7,
        changelogEntries: [
          {
            category: "mcp",
            slug: "unsafe-link",
            title: "Bad](javascript:alert(1))",
            type: "added",
            dateAdded: "2026-05-29",
            canonicalUrl: "javascript:alert(6)",
          },
        ],
      },
    );
    const markdown = renderWeeklyBriefMarkdown(brief);

    expect(brief.sections.newEntries[0]?.url).toBe(
      "https://heyclau.de/entry/mcp/unsafe-link",
    );
    expect(brief.sections.newEntries[0]?.sourceUrls).toEqual([]);
    expect(brief.sections.sourceBacked).toEqual([]);
    expect(brief.sections.notableChanges[0]?.url).toBe(
      "https://heyclau.de/entry/mcp/unsafe-link",
    );
    expect(markdown).toContain(
      "[Bad\\]\\(javascript:alert\\(1\\)\\)](<https://heyclau.de/entry/mcp/unsafe-link>)",
    );
    expect(markdown).not.toContain("](javascript:alert");
  });

  it("keeps publishing conservative and excludes private or popularity claims", () => {
    const brief = buildWeeklyBrief([entry("plain-entry")], {
      generatedAt: "2026-05-30T00:00:00.000Z",
      days: 7,
    });
    const markdown = renderWeeklyBriefMarkdown(brief);

    expect(brief.publishPolicy).toEqual({
      manualReviewRequired: true,
      automatedPublishing: false,
      popularityClaims: false,
      privateScoringIncluded: false,
    });
    expect(markdown).toContain("Draft for manual review.");
    expect(markdown).toContain("no email, GitHub post, or social post");
    expect(markdown).not.toMatch(/most popular|trending|Gittensor|reward/i);
  });

  it("reports clean CLI artifact errors without stack traces", () => {
    const dataDir = mkdtempSync(join(tmpdir(), "weekly-brief-"));

    try {
      writeFileSync(
        join(dataDir, "directory-index.json"),
        "{ bad json",
        "utf8",
      );
      writeFileSync(
        join(dataDir, "registry-changelog.json"),
        JSON.stringify({ entries: [] }),
        "utf8",
      );

      const result = spawnSync(
        process.execPath,
        ["scripts/generate-weekly-brief.mjs", `--data-dir=${dataDir}`],
        {
          cwd: process.cwd(),
          encoding: "utf8",
        },
      );

      expect(result.status).toBe(1);
      expect(result.stderr).toContain("Unable to read directory-index.json");
      expect(result.stderr).toContain("Original error:");
      expect(result.stderr).not.toContain("SyntaxError");
      expect(result.stderr).not.toContain("    at ");
    } finally {
      rmSync(dataDir, { recursive: true, force: true });
    }
  });
});
