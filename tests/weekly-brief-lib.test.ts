import { describe, expect, it } from "vitest";

import { SITE_URL } from "../packages/registry/src/artifacts.js";
import {
  WEEKLY_BRIEF_SCHEMA_VERSION,
  DEFAULT_LIMITS,
  text,
  list,
  keyFor,
  httpUrl,
  siteUrlBase,
  entryUrl,
  entryDescription,
  isoDate,
  isoTimestamp,
  daysBetween,
  normalizeDays,
  markdownText,
  markdownUrl,
  sourceUrls,
  hasSource,
  hasInstallSurface,
  hasSaferInstallSignal,
  hasSafetyNotes,
  hasPrivacyNotes,
  trustScore,
  richnessScore,
  sortEntries,
  itemFromEntry,
  newEntryReasons,
  sourceBackedReasons,
  saferInstallReasons,
  selectEntries,
  changelogItem,
  selectChangelogChanges,
  CATEGORY_NOUNS,
  categoryNoun,
  briefTheme,
  buildWeeklyBrief,
  bullet,
  changeBullet,
  section,
  renderWeeklyBriefMarkdown,
} from "../packages/registry/src/weekly-brief-lib.js";

function entry(overrides: Record<string, unknown> = {}) {
  return {
    category: "mcp",
    slug: "alpha",
    title: "Alpha",
    description: "A registry entry description.",
    dateAdded: "2026-05-28",
    ...overrides,
  };
}

describe("constants", () => {
  it("exposes schema version, default limits, and category nouns", () => {
    expect(WEEKLY_BRIEF_SCHEMA_VERSION).toBe(1);
    expect(DEFAULT_LIMITS).toEqual({
      newEntries: 8,
      sourceBacked: 6,
      saferInstalls: 6,
      notableChanges: 8,
    });
    expect(CATEGORY_NOUNS.mcp).toEqual(["MCP server", "MCP servers"]);
  });
});

describe("text helpers", () => {
  it("trims and coerces text values", () => {
    expect(text("  hi ")).toBe("hi");
    expect(text(null)).toBe("");
    expect(text(undefined)).toBe("");
  });

  it("normalizes lists and drops non-arrays", () => {
    expect(list([" a ", "", "b"])).toEqual(["a", "b"]);
    expect(list(null)).toEqual([]);
    expect(list("nope")).toEqual([]);
  });

  it("builds entry keys only when category and slug are present", () => {
    expect(keyFor(entry())).toBe("mcp:alpha");
    expect(keyFor({ category: "mcp" })).toBe("");
    expect(keyFor({ slug: "alpha" })).toBe("");
  });
});

describe("url and date helpers", () => {
  it("accepts http(s) urls and rejects others", () => {
    expect(httpUrl("https://example.com/path")).toBe(
      "https://example.com/path",
    );
    expect(httpUrl("http://example.com")).toBe("http://example.com/");
    expect(httpUrl("ftp://example.com")).toBe("");
    expect(httpUrl("not a url")).toBe("");
    expect(httpUrl("")).toBe("");
  });

  it("normalizes site bases and entry urls", () => {
    expect(siteUrlBase("https://example.com/")).toBe("https://example.com");
    expect(siteUrlBase("bad")).toBe(SITE_URL);
    expect(
      entryUrl(entry({ canonicalUrl: "https://canonical.example/x" })),
    ).toBe("https://canonical.example/x");
    expect(
      entryUrl(
        entry({ category: "skills", slug: "beta" }),
        "https://site.test",
      ),
    ).toBe("https://site.test/entry/skills/beta");
  });

  it("prefers cardDescription and truncates descriptions", () => {
    expect(entryDescription(entry({ cardDescription: "Card copy" }))).toBe(
      "Card copy",
    );
    expect(
      entryDescription(entry({ description: "D".repeat(300) })).length,
    ).toBeLessThanOrEqual(180);
    expect(entryDescription({})).toBe("");
  });

  it("validates iso dates and timestamps", () => {
    expect(isoDate("2026-05-28T12:00:00.000Z")).toBe("2026-05-28");
    expect(isoDate("2026-02-30")).toBe("");
    expect(isoDate("nope")).toBe("");
    expect(isoTimestamp("2026-05-28")).toBe("2026-05-28T00:00:00.000Z");
    expect(isoTimestamp("bad")).toBe("");
  });

  it("computes day deltas and normalizes day windows", () => {
    expect(daysBetween("2026-05-01", "2026-05-08")).toBe(7);
    expect(daysBetween("bad", "2026-05-08")).toBeNull();
    expect(normalizeDays(3)).toBe(3);
    expect(normalizeDays(0)).toBe(1);
    expect(normalizeDays(100)).toBe(31);
    expect(normalizeDays("nope")).toBe(7);
  });
});

describe("markdown helpers", () => {
  it("escapes markdown metacharacters and control chars", () => {
    expect(markdownText("a [b] (c) `d` <e>\\")).toBe(
      "a \\[b\\] \\(c\\) \\`d\\` \\<e\\>\\\\",
    );
    // Control chars are stripped, then remaining whitespace is collapsed.
    expect(markdownText("a\u0001b\nc")).toBe("ab c");
  });

  it("wraps urls for markdown autolinks", () => {
    expect(markdownUrl("https://example.com")).toBe("<https://example.com/>");
    expect(markdownUrl("bad")).toBe(`<${SITE_URL}>`);
  });
});

describe("signal helpers", () => {
  it("collects source urls from entry fields and trust signals", () => {
    expect(
      sourceUrls(
        entry({
          repoUrl: "https://github.com/a/b",
          githubUrl: "not-a-url",
          documentationUrl: "https://docs.example",
          websiteUrl: "https://example.com",
          trustSignals: { sourceUrls: ["https://trust.example", "bad"] },
        }),
      ),
    ).toEqual([
      "https://github.com/a/b",
      "https://docs.example/",
      "https://example.com/",
      "https://trust.example/",
    ]);
    expect(sourceUrls(entry({ trustSignals: { sourceUrls: "nope" } }))).toEqual(
      [],
    );
  });

  it("detects source, install surface, and safer-install signals", () => {
    expect(
      hasSource(entry({ trustSignals: { sourceStatus: "available" } })),
    ).toBe(true);
    expect(hasSource(entry({ repoUrl: "https://github.com/a/b" }))).toBe(true);
    expect(hasSource(entry())).toBe(false);

    expect(hasInstallSurface(entry({ installable: true }))).toBe(true);
    expect(hasInstallSurface(entry({ installCommand: "npm i x" }))).toBe(true);
    expect(hasInstallSurface(entry({ configSnippet: "{}" }))).toBe(true);
    expect(hasInstallSurface(entry({ commandSyntax: "x" }))).toBe(true);
    expect(
      hasInstallSurface(entry({ downloadUrl: "https://cdn.example/x" })),
    ).toBe(true);
    expect(hasInstallSurface(entry())).toBe(false);

    expect(hasSaferInstallSignal(entry({ downloadTrust: "first-party" }))).toBe(
      true,
    );
    expect(hasSaferInstallSignal(entry({ packageVerified: true }))).toBe(true);
    expect(
      hasSaferInstallSignal(entry({ trustSignals: { packageVerified: true } })),
    ).toBe(true);
    expect(hasSaferInstallSignal(entry({ downloadSha256: "abc" }))).toBe(true);
    expect(
      hasSaferInstallSignal(entry({ trustSignals: { checksumPresent: true } })),
    ).toBe(true);
    expect(
      hasSaferInstallSignal(entry({ repoUrl: "https://github.com/a/b" })),
    ).toBe(true);
    expect(
      hasSaferInstallSignal(
        entry({
          repoUrl: "https://github.com/a/b",
          downloadUrl: "https://cdn.example/x",
        }),
      ),
    ).toBe(false);
  });

  it("reads safety and privacy notes from arrays or trust flags", () => {
    expect(hasSafetyNotes(entry({ safetyNotes: ["note"] }))).toBe(true);
    expect(
      hasSafetyNotes(entry({ trustSignals: { hasSafetyNotes: true } })),
    ).toBe(true);
    expect(hasSafetyNotes(entry())).toBe(false);
    expect(hasPrivacyNotes(entry({ privacyNotes: ["note"] }))).toBe(true);
    expect(
      hasPrivacyNotes(entry({ trustSignals: { hasPrivacyNotes: true } })),
    ).toBe(true);
    expect(hasPrivacyNotes(entry())).toBe(false);
  });
});

describe("scoring and sorting", () => {
  it("scores trust and richness dimensions", () => {
    const rich = entry({
      repoUrl: "https://github.com/a/b",
      downloadTrust: "first-party",
      safetyNotes: ["s"],
      privacyNotes: ["p"],
      claimStatus: "verified",
      cardDescription: "D".repeat(200),
      trustSignals: {
        sourceUrlCount: 10,
        firstPartyEditorial: true,
        lastVerifiedAt: "2026-05-01",
      },
    });
    expect(trustScore(rich)).toBe(8 + 6 + 3 + 3 + 2);
    expect(richnessScore(rich)).toBeGreaterThan(richnessScore(entry()));
    expect(trustScore(entry({ reviewedBy: "maintainer" }))).toBe(2);
    expect(richnessScore(entry({ verifiedAt: "2026-01-01" }))).toBe(1);
    expect(
      richnessScore({
        trustSignals: null,
        cardDescription: "",
        description: "",
      }),
    ).toBe(0);
  });

  it("sorts by date, trust, richness, then title", () => {
    const older = entry({
      slug: "older",
      title: "Older",
      dateAdded: "2026-05-01",
    });
    const newer = entry({
      slug: "newer",
      title: "Newer",
      dateAdded: "2026-05-28",
    });
    expect(sortEntries(older, newer)).toBeGreaterThan(0);

    const trusted = entry({
      slug: "trusted",
      title: "Trusted",
      dateAdded: "2026-05-28",
      repoUrl: "https://github.com/a/b",
    });
    const plain = entry({
      slug: "plain",
      title: "Plain",
      dateAdded: "2026-05-28",
    });
    expect(sortEntries(plain, trusted)).toBeGreaterThan(0);

    const rich = entry({
      slug: "rich",
      title: "Rich",
      dateAdded: "2026-05-28",
      description: "D".repeat(200),
    });
    const thin = entry({
      slug: "thin",
      title: "Thin",
      dateAdded: "2026-05-28",
      description: "short",
    });
    expect(sortEntries(thin, rich)).toBeGreaterThan(0);

    const a = entry({ slug: "a", title: "Alpha", dateAdded: "2026-05-28" });
    const b = entry({ slug: "b", title: "Beta", dateAdded: "2026-05-28" });
    expect(sortEntries(a, b)).toBeLessThan(0);
  });
});

describe("reason builders and selection", () => {
  it("builds new-entry, source-backed, and safer-install reasons", () => {
    expect(newEntryReasons(entry())).toContain("added 2026-05-28");
    expect(newEntryReasons(entry({ dateAdded: "bad" }))).toEqual([
      "new registry entry",
    ]);
    expect(
      newEntryReasons(
        entry({
          repoUrl: "https://github.com/a/b",
          safetyNotes: ["s"],
          privacyNotes: ["p"],
        }),
      ),
    ).toEqual(
      expect.arrayContaining([
        "source-backed",
        "has safety notes",
        "has privacy notes",
      ]),
    );

    expect(
      sourceBackedReasons(
        entry({
          safetyNotes: ["s"],
          privacyNotes: ["p"],
          claimStatus: "verified",
          reviewedBy: "maintainer",
        }),
      ),
    ).toEqual([
      "source-backed",
      "safety notes present",
      "privacy notes present",
      "verified claim",
      "reviewed metadata",
    ]);

    expect(
      saferInstallReasons(
        entry({
          downloadTrust: "first-party",
          packageVerified: true,
          downloadSha256: "abc",
        }),
      ),
    ).toEqual(
      expect.arrayContaining([
        "first-party package",
        "package verified",
        "checksum present",
      ]),
    );
    expect(
      saferInstallReasons(
        entry({
          trustSignals: { checksumPresent: true },
          repoUrl: "https://github.com/a/b",
        }),
      ),
    ).toEqual(
      expect.arrayContaining([
        "checksum present",
        "source-backed copy/install path",
      ]),
    );
    expect(saferInstallReasons(entry({ installCommand: "x" }))).toEqual([
      "reviewable install metadata",
    ]);
  });

  it("materializes items and selects unique entries up to a limit", () => {
    const item = itemFromEntry(
      entry({
        packageVerified: true,
        downloadTrust: "first-party",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
      }),
      ["reason"],
      "https://site.test",
    );
    expect(item).toMatchObject({
      key: "mcp:alpha",
      packageVerified: true,
      downloadTrust: "first-party",
      safetyNotesCount: 1,
      privacyNotesCount: 1,
      reasons: ["reason"],
    });

    const seen = new Set<string>();
    const selected = selectEntries(
      [
        entry({ slug: "one", title: "One", dateAdded: "2026-05-28" }),
        entry({ slug: "one", title: "One Dup", dateAdded: "2026-05-28" }),
        entry({ slug: "two", title: "Two", dateAdded: "2026-05-27" }),
        entry({ category: "", slug: "missing", title: "Missing" }),
      ],
      () => true,
      1,
      () => ["picked"],
      SITE_URL,
      seen,
    );
    expect(selected).toHaveLength(1);
    expect(selected[0].slug).toBe("one");
    expect(seen.has("mcp:one")).toBe(true);
  });
});

describe("changelog selection", () => {
  it("uses explicit changelog entries when provided", () => {
    const selected = selectChangelogChanges(
      [
        {
          category: "skills",
          slug: "new",
          title: "New",
          type: "updated",
          dateAdded: "2026-05-28",
          canonicalUrl: "https://example.com/change",
        },
        {
          category: "skills",
          slug: "old",
          title: "Old",
          dateAdded: "2026-01-01",
        },
        {
          category: "skills",
          slug: "bad",
          title: "Bad",
          dateAdded: "bad",
        },
      ],
      [],
      {
        days: 7,
        referenceDate: "2026-05-30",
        limit: 5,
        siteUrl: SITE_URL,
      },
    );
    expect(selected).toHaveLength(1);
    expect(selected[0]).toMatchObject({
      type: "updated",
      url: "https://example.com/change",
    });
  });

  it("falls back to entries as added changes and sorts by date then title", () => {
    const selected = selectChangelogChanges(
      undefined,
      [
        entry({ slug: "b", title: "B", dateAdded: "2026-05-28" }),
        entry({ slug: "a", title: "A", dateAdded: "2026-05-28" }),
        entry({ slug: "c", title: "C", dateAdded: "2026-05-29" }),
      ],
      {
        days: 7,
        referenceDate: "2026-05-30",
        limit: 10,
        siteUrl: SITE_URL,
      },
    );
    expect(selected.map((item) => item.slug)).toEqual(["c", "a", "b"]);
    expect(selected[0].type).toBe("added");
  });

  it("defaults changelog type to added when missing", () => {
    expect(
      changelogItem(
        { category: "mcp", slug: "x", title: "X", dateAdded: "2026-05-28" },
        SITE_URL,
      ).type,
    ).toBe("added");
  });
});

describe("theme and category nouns", () => {
  it("pluralizes known and unknown categories", () => {
    expect(categoryNoun("mcp", 1)).toBe("MCP server");
    expect(categoryNoun("mcp", 2)).toBe("MCP servers");
    expect(categoryNoun("unknown", 1)).toBe("entry");
    expect(categoryNoun("unknown", 2)).toBe("entries");
  });

  it("builds quieter and led-by themes with singular/plural tails", () => {
    expect(
      briefTheme([], {
        newEntryCount: 0,
        sourceBackedCount: 1,
        saferInstallCount: 1,
      }),
    ).toBe(
      "A quieter week — 1 source-backed pick and 1 safer install reviewed.",
    );

    expect(
      briefTheme(
        [
          { category: "mcp" },
          { category: "mcp" },
          { category: "skills" },
          { category: "" },
        ],
        {
          newEntryCount: 3,
          sourceBackedCount: 2,
          saferInstallCount: 2,
        },
      ),
    ).toContain("led by 2 MCP servers");

    expect(
      briefTheme([{ category: "skills" }], {
        newEntryCount: 1,
        sourceBackedCount: 0,
        saferInstallCount: 0,
      }),
    ).toBe(
      "1 new this week — plus 0 source-backed picks and 0 safer installs, all metadata-reviewed for source and safety.",
    );

    // Equal category counts break ties alphabetically; empty categories are ignored.
    expect(
      briefTheme(
        [
          { category: "skills" },
          { category: "agents" },
          { category: "skills" },
          { category: "agents" },
          { category: "" },
        ],
        {
          newEntryCount: 4,
          sourceBackedCount: 0,
          saferInstallCount: 0,
        },
      ),
    ).toContain("led by 2 agents");

    expect(
      briefTheme([{ category: "" }, { category: "" }], {
        newEntryCount: 2,
        sourceBackedCount: 0,
        saferInstallCount: 0,
      }),
    ).toBe(
      "2 new this week — plus 0 source-backed picks and 0 safer installs, all metadata-reviewed for source and safety.",
    );
  });
});

describe("buildWeeklyBrief", () => {
  it("returns an empty draft for non-array input", () => {
    const brief = buildWeeklyBrief(null as unknown as [], {
      generatedAt: "2026-05-30",
    });
    expect(brief.summary.totalEntries).toBe(0);
    expect(brief.theme).toContain("quieter week");
    expect(brief.note).toBe("");
    expect(brief.publishPolicy.manualReviewRequired).toBe(true);
  });

  it("filters incomplete entries and applies custom limits", () => {
    const brief = buildWeeklyBrief(
      [
        entry({
          slug: "new-one",
          title: "New One",
          dateAdded: "2026-05-28",
          repoUrl: "https://github.com/a/b",
          installCommand: "install",
          downloadTrust: "first-party",
          safetyNotes: ["s"],
        }),
        entry({
          slug: "older-source",
          title: "Older Source",
          dateAdded: "2026-01-01",
          documentationUrl: "https://docs.example",
        }),
        entry({
          slug: "safer",
          title: "Safer",
          dateAdded: "2026-01-02",
          installCommand: "install",
          packageVerified: true,
        }),
        entry({ slug: "no-title", title: "", dateAdded: "2026-05-28" }),
        entry({ category: "", slug: "no-key", title: "No Key" }),
      ],
      {
        generatedAt: "2026-05-30",
        days: 7,
        siteUrl: "https://site.test",
        limits: {
          newEntries: 1,
          sourceBacked: 1,
          saferInstalls: 1,
          notableChanges: 1,
        },
      },
    );

    expect(brief.schemaVersion).toBe(1);
    expect(brief.kind).toBe("weekly-brief-draft");
    expect(brief.summary.totalEntries).toBe(3);
    expect(brief.sections.newEntries).toHaveLength(1);
    expect(brief.sections.sourceBacked).toHaveLength(1);
    expect(brief.sections.saferInstalls).toHaveLength(1);
    expect(brief.sections.notableChanges).toHaveLength(1);
    expect(brief.sections.newEntries[0].url).toContain(
      "https://site.test/entry/",
    );
  });

  it("uses changelog entries when provided and defaults days/siteUrl", () => {
    const brief = buildWeeklyBrief(
      [entry({ slug: "x", title: "X", dateAdded: "2026-05-28" })],
      {
        generatedAt: "2026-05-30T00:00:00.000Z",
        changelogEntries: [
          {
            category: "skills",
            slug: "change",
            title: "Change",
            type: "updated",
            dateAdded: "2026-05-29",
          },
        ],
      },
    );
    expect(brief.period.days).toBe(7);
    expect(brief.sections.notableChanges[0].title).toBe("Change");
  });

  it("falls back to generatedAtForEntries and current time when needed", () => {
    const fromEntries = buildWeeklyBrief([entry({ dateAdded: "2026-05-20" })]);
    expect(fromEntries.generatedAt).toBe("2026-05-20T00:00:00.000Z");

    const empty = buildWeeklyBrief([]);
    expect(empty.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/);
  });
});

describe("markdown rendering", () => {
  it("renders bullets with optional description and reasons", () => {
    expect(
      bullet({
        title: "Title",
        url: "https://example.com",
        category: "mcp",
        description: "Desc",
        reasons: ["one", "two"],
      }),
    ).toContain("Signals: one; two");
    expect(
      bullet({
        title: "Title",
        url: "https://example.com",
        category: "mcp",
      }),
    ).not.toContain("Signals:");
  });

  it("renders change bullets with optional dates", () => {
    expect(
      changeBullet({
        title: "Title",
        url: "https://example.com",
        category: "mcp",
        type: "updated",
        dateAdded: "2026-05-28",
      }),
    ).toContain("on 2026-05-28");
    expect(
      changeBullet({
        title: "Title",
        url: "https://example.com",
        category: "mcp",
        type: "added",
      }),
    ).not.toContain(" on ");
  });

  it("renders empty and populated sections", () => {
    const emptyLines: string[] = [];
    section(emptyLines, "Empty", [], bullet, "nothing here");
    expect(emptyLines.join("\n")).toContain("nothing here");

    const filled: string[] = [];
    section(
      filled,
      "Filled",
      [
        {
          title: "Title",
          url: "https://example.com",
          category: "mcp",
        },
      ],
      bullet,
      "nothing here",
    );
    expect(filled.join("\n")).toContain("[Title]");
  });

  it("renders a full markdown draft with empty-section fallbacks", () => {
    const brief = buildWeeklyBrief([], { generatedAt: "2026-05-30" });
    const markdown = renderWeeklyBriefMarkdown(brief);
    expect(markdown).toContain("# Weekly Claude workflow brief - 2026-05-30");
    expect(markdown).toContain(
      "No new registry entries matched this brief window.",
    );
    expect(markdown).toContain("No source-backed picks were selected.");
    expect(markdown).toContain("No safer install picks were selected.");
    expect(markdown).toContain(
      "No registry changelog entries matched this brief window.",
    );
    expect(markdown).toContain("Manual publishing is required.");
    expect(markdown.endsWith("\n")).toBe(true);
  });

  it("renders populated sections from a real brief", () => {
    const brief = buildWeeklyBrief(
      [
        entry({
          slug: "new-one",
          title: "New One",
          dateAdded: "2026-05-28",
          description: "Useful description",
          repoUrl: "https://github.com/a/b",
          installCommand: "install",
          downloadTrust: "first-party",
          safetyNotes: ["safe"],
        }),
      ],
      { generatedAt: "2026-05-30" },
    );
    const markdown = renderWeeklyBriefMarkdown(brief);
    expect(markdown).toContain("New One");
    expect(markdown).toContain("Signals:");
  });
});

describe("public wrapper re-exports", () => {
  it("keeps the weekly-brief.js surface identical to the lib", async () => {
    const wrapper = await import("../packages/registry/src/weekly-brief.js");
    expect(wrapper.buildWeeklyBrief).toBe(buildWeeklyBrief);
    expect(wrapper.renderWeeklyBriefMarkdown).toBe(renderWeeklyBriefMarkdown);
    expect(wrapper.WEEKLY_BRIEF_SCHEMA_VERSION).toBe(
      WEEKLY_BRIEF_SCHEMA_VERSION,
    );
  });
});
