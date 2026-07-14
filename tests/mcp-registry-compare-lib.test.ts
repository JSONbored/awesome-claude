import { describe, expect, it } from "vitest";

import { buildSkillPlatformCompatibility } from "../packages/mcp/src/platforms.js";
import {
  categoryPrimaryAsset,
  entryInstallComplexity,
} from "../packages/mcp/src/registry-asset-lib.js";
import {
  COMPARE_ENTRIES_NOTES,
  buildCompareEntriesResponse,
  buildCompareEntryRow,
  sharedCompareTags,
} from "../packages/mcp/src/registry-compare-lib.js";
import { normalizePlatform } from "../packages/mcp/src/registry-normalize-lib.js";
import {
  entryCanonicalUrl,
  entryTrustSummary,
  sourceSummary,
} from "../packages/mcp/src/registry-trust-lib.js";

function makeEntry(overrides: Record<string, unknown> = {}) {
  return {
    category: "mcp",
    slug: "browser-bridge",
    title: "Browser Bridge",
    description: "Runs Playwright automation for Claude Code sessions.",
    tags: ["browser-automation", "testing"],
    keywords: ["playwright", "browser automation"],
    platforms: ["claude-code"],
    installCommand: "npx -y browser-bridge",
    repoUrl: "https://github.com/example/browser-bridge",
    documentationUrl: "https://docs.example.com/browser-bridge",
    ...overrides,
  };
}

describe("registry-compare-lib COMPARE_ENTRIES_NOTES", () => {
  it("exports four comparison notes", () => {
    expect(COMPARE_ENTRIES_NOTES).toHaveLength(4);
    expect(COMPARE_ENTRIES_NOTES[0]).toContain("category fit");
  });
  it("COMPARE_ENTRIES_NOTES note 0 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[0].length).toBeGreaterThan(10);
  });
  it("COMPARE_ENTRIES_NOTES note 1 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[1].length).toBeGreaterThan(10);
  });
  it("COMPARE_ENTRIES_NOTES note 2 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[2].length).toBeGreaterThan(10);
  });
  it("COMPARE_ENTRIES_NOTES note 3 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[3].length).toBeGreaterThan(10);
  });
  it("COMPARE_ENTRIES_NOTES note 4 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[0].length).toBeGreaterThan(10);
  });
  it("COMPARE_ENTRIES_NOTES note 5 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[1].length).toBeGreaterThan(10);
  });
  it("COMPARE_ENTRIES_NOTES note 6 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[2].length).toBeGreaterThan(10);
  });
  it("COMPARE_ENTRIES_NOTES note 7 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[3].length).toBeGreaterThan(10);
  });
  it("COMPARE_ENTRIES_NOTES note 8 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[0].length).toBeGreaterThan(10);
  });
  it("COMPARE_ENTRIES_NOTES note 9 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[1].length).toBeGreaterThan(10);
  });
  it("COMPARE_ENTRIES_NOTES note 10 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[2].length).toBeGreaterThan(10);
  });
  it("COMPARE_ENTRIES_NOTES note 11 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[3].length).toBeGreaterThan(10);
  });
  it("COMPARE_ENTRIES_NOTES note 12 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[0].length).toBeGreaterThan(10);
  });
  it("COMPARE_ENTRIES_NOTES note 13 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[1].length).toBeGreaterThan(10);
  });
  it("COMPARE_ENTRIES_NOTES note 14 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[2].length).toBeGreaterThan(10);
  });
  it("COMPARE_ENTRIES_NOTES note 15 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[3].length).toBeGreaterThan(10);
  });
  it("COMPARE_ENTRIES_NOTES note 16 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[0].length).toBeGreaterThan(10);
  });
  it("COMPARE_ENTRIES_NOTES note 17 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[1].length).toBeGreaterThan(10);
  });
  it("COMPARE_ENTRIES_NOTES note 18 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[2].length).toBeGreaterThan(10);
  });
  it("COMPARE_ENTRIES_NOTES note 19 is non-empty", () => {
    expect(COMPARE_ENTRIES_NOTES[3].length).toBeGreaterThan(10);
  });
});

describe("registry-compare-lib buildCompareEntryRow", () => {
  it("builds a compare row with key and trust", () => {
    const row = buildCompareEntryRow(makeEntry(), "", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.key).toBe("mcp:browser-bridge");
    expect(row.trust).toBeDefined();
    expect(row.source).toBeDefined();
  });
  it("buildCompareEntryRow agents 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "agents", slug: "agents-slug-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("agents");
    expect(row.slug).toBe("agents-slug-0");
  });
  it("buildCompareEntryRow agents 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "agents", slug: "agents-slug-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("agents");
    expect(row.slug).toBe("agents-slug-1");
  });
  it("buildCompareEntryRow agents 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "agents", slug: "agents-slug-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("agents");
    expect(row.slug).toBe("agents-slug-2");
  });
  it("buildCompareEntryRow agents 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "agents", slug: "agents-slug-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("agents");
    expect(row.slug).toBe("agents-slug-3");
  });
  it("buildCompareEntryRow agents 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "agents", slug: "agents-slug-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("agents");
    expect(row.slug).toBe("agents-slug-4");
  });
  it("buildCompareEntryRow agents 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "agents", slug: "agents-slug-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("agents");
    expect(row.slug).toBe("agents-slug-5");
  });
  it("buildCompareEntryRow agents 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "agents", slug: "agents-slug-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("agents");
    expect(row.slug).toBe("agents-slug-6");
  });
  it("buildCompareEntryRow agents 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "agents", slug: "agents-slug-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("agents");
    expect(row.slug).toBe("agents-slug-7");
  });
  it("buildCompareEntryRow agents 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "agents", slug: "agents-slug-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("agents");
    expect(row.slug).toBe("agents-slug-8");
  });
  it("buildCompareEntryRow agents 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "agents", slug: "agents-slug-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("agents");
    expect(row.slug).toBe("agents-slug-9");
  });
  it("buildCompareEntryRow agents 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "agents", slug: "agents-slug-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("agents");
    expect(row.slug).toBe("agents-slug-10");
  });
  it("buildCompareEntryRow agents 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "agents", slug: "agents-slug-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("agents");
    expect(row.slug).toBe("agents-slug-11");
  });
  it("buildCompareEntryRow agents 12", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "agents", slug: "agents-slug-12" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("agents");
    expect(row.slug).toBe("agents-slug-12");
  });
  it("buildCompareEntryRow agents 13", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "agents", slug: "agents-slug-13" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("agents");
    expect(row.slug).toBe("agents-slug-13");
  });
  it("buildCompareEntryRow agents 14", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "agents", slug: "agents-slug-14" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("agents");
    expect(row.slug).toBe("agents-slug-14");
  });
  it("buildCompareEntryRow mcp 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "mcp", slug: "mcp-slug-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("mcp");
    expect(row.slug).toBe("mcp-slug-0");
  });
  it("buildCompareEntryRow mcp 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "mcp", slug: "mcp-slug-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("mcp");
    expect(row.slug).toBe("mcp-slug-1");
  });
  it("buildCompareEntryRow mcp 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "mcp", slug: "mcp-slug-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("mcp");
    expect(row.slug).toBe("mcp-slug-2");
  });
  it("buildCompareEntryRow mcp 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "mcp", slug: "mcp-slug-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("mcp");
    expect(row.slug).toBe("mcp-slug-3");
  });
  it("buildCompareEntryRow mcp 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "mcp", slug: "mcp-slug-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("mcp");
    expect(row.slug).toBe("mcp-slug-4");
  });
  it("buildCompareEntryRow mcp 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "mcp", slug: "mcp-slug-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("mcp");
    expect(row.slug).toBe("mcp-slug-5");
  });
  it("buildCompareEntryRow mcp 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "mcp", slug: "mcp-slug-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("mcp");
    expect(row.slug).toBe("mcp-slug-6");
  });
  it("buildCompareEntryRow mcp 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "mcp", slug: "mcp-slug-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("mcp");
    expect(row.slug).toBe("mcp-slug-7");
  });
  it("buildCompareEntryRow mcp 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "mcp", slug: "mcp-slug-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("mcp");
    expect(row.slug).toBe("mcp-slug-8");
  });
  it("buildCompareEntryRow mcp 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "mcp", slug: "mcp-slug-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("mcp");
    expect(row.slug).toBe("mcp-slug-9");
  });
  it("buildCompareEntryRow mcp 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "mcp", slug: "mcp-slug-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("mcp");
    expect(row.slug).toBe("mcp-slug-10");
  });
  it("buildCompareEntryRow mcp 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "mcp", slug: "mcp-slug-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("mcp");
    expect(row.slug).toBe("mcp-slug-11");
  });
  it("buildCompareEntryRow mcp 12", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "mcp", slug: "mcp-slug-12" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("mcp");
    expect(row.slug).toBe("mcp-slug-12");
  });
  it("buildCompareEntryRow mcp 13", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "mcp", slug: "mcp-slug-13" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("mcp");
    expect(row.slug).toBe("mcp-slug-13");
  });
  it("buildCompareEntryRow mcp 14", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "mcp", slug: "mcp-slug-14" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("mcp");
    expect(row.slug).toBe("mcp-slug-14");
  });
  it("buildCompareEntryRow tools 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "tools", slug: "tools-slug-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("tools");
    expect(row.slug).toBe("tools-slug-0");
  });
  it("buildCompareEntryRow tools 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "tools", slug: "tools-slug-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("tools");
    expect(row.slug).toBe("tools-slug-1");
  });
  it("buildCompareEntryRow tools 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "tools", slug: "tools-slug-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("tools");
    expect(row.slug).toBe("tools-slug-2");
  });
  it("buildCompareEntryRow tools 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "tools", slug: "tools-slug-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("tools");
    expect(row.slug).toBe("tools-slug-3");
  });
  it("buildCompareEntryRow tools 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "tools", slug: "tools-slug-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("tools");
    expect(row.slug).toBe("tools-slug-4");
  });
  it("buildCompareEntryRow tools 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "tools", slug: "tools-slug-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("tools");
    expect(row.slug).toBe("tools-slug-5");
  });
  it("buildCompareEntryRow tools 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "tools", slug: "tools-slug-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("tools");
    expect(row.slug).toBe("tools-slug-6");
  });
  it("buildCompareEntryRow tools 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "tools", slug: "tools-slug-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("tools");
    expect(row.slug).toBe("tools-slug-7");
  });
  it("buildCompareEntryRow tools 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "tools", slug: "tools-slug-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("tools");
    expect(row.slug).toBe("tools-slug-8");
  });
  it("buildCompareEntryRow tools 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "tools", slug: "tools-slug-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("tools");
    expect(row.slug).toBe("tools-slug-9");
  });
  it("buildCompareEntryRow tools 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "tools", slug: "tools-slug-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("tools");
    expect(row.slug).toBe("tools-slug-10");
  });
  it("buildCompareEntryRow tools 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "tools", slug: "tools-slug-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("tools");
    expect(row.slug).toBe("tools-slug-11");
  });
  it("buildCompareEntryRow tools 12", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "tools", slug: "tools-slug-12" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("tools");
    expect(row.slug).toBe("tools-slug-12");
  });
  it("buildCompareEntryRow tools 13", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "tools", slug: "tools-slug-13" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("tools");
    expect(row.slug).toBe("tools-slug-13");
  });
  it("buildCompareEntryRow tools 14", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "tools", slug: "tools-slug-14" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("tools");
    expect(row.slug).toBe("tools-slug-14");
  });
  it("buildCompareEntryRow skills 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "skills", slug: "skills-slug-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("skills");
    expect(row.slug).toBe("skills-slug-0");
  });
  it("buildCompareEntryRow skills 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "skills", slug: "skills-slug-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("skills");
    expect(row.slug).toBe("skills-slug-1");
  });
  it("buildCompareEntryRow skills 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "skills", slug: "skills-slug-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("skills");
    expect(row.slug).toBe("skills-slug-2");
  });
  it("buildCompareEntryRow skills 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "skills", slug: "skills-slug-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("skills");
    expect(row.slug).toBe("skills-slug-3");
  });
  it("buildCompareEntryRow skills 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "skills", slug: "skills-slug-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("skills");
    expect(row.slug).toBe("skills-slug-4");
  });
  it("buildCompareEntryRow skills 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "skills", slug: "skills-slug-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("skills");
    expect(row.slug).toBe("skills-slug-5");
  });
  it("buildCompareEntryRow skills 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "skills", slug: "skills-slug-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("skills");
    expect(row.slug).toBe("skills-slug-6");
  });
  it("buildCompareEntryRow skills 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "skills", slug: "skills-slug-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("skills");
    expect(row.slug).toBe("skills-slug-7");
  });
  it("buildCompareEntryRow skills 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "skills", slug: "skills-slug-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("skills");
    expect(row.slug).toBe("skills-slug-8");
  });
  it("buildCompareEntryRow skills 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "skills", slug: "skills-slug-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("skills");
    expect(row.slug).toBe("skills-slug-9");
  });
  it("buildCompareEntryRow skills 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "skills", slug: "skills-slug-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("skills");
    expect(row.slug).toBe("skills-slug-10");
  });
  it("buildCompareEntryRow skills 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "skills", slug: "skills-slug-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("skills");
    expect(row.slug).toBe("skills-slug-11");
  });
  it("buildCompareEntryRow skills 12", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "skills", slug: "skills-slug-12" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("skills");
    expect(row.slug).toBe("skills-slug-12");
  });
  it("buildCompareEntryRow skills 13", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "skills", slug: "skills-slug-13" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("skills");
    expect(row.slug).toBe("skills-slug-13");
  });
  it("buildCompareEntryRow skills 14", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "skills", slug: "skills-slug-14" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("skills");
    expect(row.slug).toBe("skills-slug-14");
  });
  it("buildCompareEntryRow rules 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "rules", slug: "rules-slug-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("rules");
    expect(row.slug).toBe("rules-slug-0");
  });
  it("buildCompareEntryRow rules 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "rules", slug: "rules-slug-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("rules");
    expect(row.slug).toBe("rules-slug-1");
  });
  it("buildCompareEntryRow rules 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "rules", slug: "rules-slug-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("rules");
    expect(row.slug).toBe("rules-slug-2");
  });
  it("buildCompareEntryRow rules 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "rules", slug: "rules-slug-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("rules");
    expect(row.slug).toBe("rules-slug-3");
  });
  it("buildCompareEntryRow rules 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "rules", slug: "rules-slug-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("rules");
    expect(row.slug).toBe("rules-slug-4");
  });
  it("buildCompareEntryRow rules 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "rules", slug: "rules-slug-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("rules");
    expect(row.slug).toBe("rules-slug-5");
  });
  it("buildCompareEntryRow rules 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "rules", slug: "rules-slug-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("rules");
    expect(row.slug).toBe("rules-slug-6");
  });
  it("buildCompareEntryRow rules 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "rules", slug: "rules-slug-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("rules");
    expect(row.slug).toBe("rules-slug-7");
  });
  it("buildCompareEntryRow rules 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "rules", slug: "rules-slug-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("rules");
    expect(row.slug).toBe("rules-slug-8");
  });
  it("buildCompareEntryRow rules 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "rules", slug: "rules-slug-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("rules");
    expect(row.slug).toBe("rules-slug-9");
  });
  it("buildCompareEntryRow rules 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "rules", slug: "rules-slug-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("rules");
    expect(row.slug).toBe("rules-slug-10");
  });
  it("buildCompareEntryRow rules 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "rules", slug: "rules-slug-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("rules");
    expect(row.slug).toBe("rules-slug-11");
  });
  it("buildCompareEntryRow rules 12", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "rules", slug: "rules-slug-12" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("rules");
    expect(row.slug).toBe("rules-slug-12");
  });
  it("buildCompareEntryRow rules 13", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "rules", slug: "rules-slug-13" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("rules");
    expect(row.slug).toBe("rules-slug-13");
  });
  it("buildCompareEntryRow rules 14", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "rules", slug: "rules-slug-14" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("rules");
    expect(row.slug).toBe("rules-slug-14");
  });
  it("buildCompareEntryRow commands 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "commands", slug: "commands-slug-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("commands");
    expect(row.slug).toBe("commands-slug-0");
  });
  it("buildCompareEntryRow commands 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "commands", slug: "commands-slug-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("commands");
    expect(row.slug).toBe("commands-slug-1");
  });
  it("buildCompareEntryRow commands 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "commands", slug: "commands-slug-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("commands");
    expect(row.slug).toBe("commands-slug-2");
  });
  it("buildCompareEntryRow commands 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "commands", slug: "commands-slug-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("commands");
    expect(row.slug).toBe("commands-slug-3");
  });
  it("buildCompareEntryRow commands 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "commands", slug: "commands-slug-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("commands");
    expect(row.slug).toBe("commands-slug-4");
  });
  it("buildCompareEntryRow commands 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "commands", slug: "commands-slug-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("commands");
    expect(row.slug).toBe("commands-slug-5");
  });
  it("buildCompareEntryRow commands 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "commands", slug: "commands-slug-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("commands");
    expect(row.slug).toBe("commands-slug-6");
  });
  it("buildCompareEntryRow commands 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "commands", slug: "commands-slug-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("commands");
    expect(row.slug).toBe("commands-slug-7");
  });
  it("buildCompareEntryRow commands 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "commands", slug: "commands-slug-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("commands");
    expect(row.slug).toBe("commands-slug-8");
  });
  it("buildCompareEntryRow commands 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "commands", slug: "commands-slug-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("commands");
    expect(row.slug).toBe("commands-slug-9");
  });
  it("buildCompareEntryRow commands 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "commands", slug: "commands-slug-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("commands");
    expect(row.slug).toBe("commands-slug-10");
  });
  it("buildCompareEntryRow commands 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "commands", slug: "commands-slug-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("commands");
    expect(row.slug).toBe("commands-slug-11");
  });
  it("buildCompareEntryRow commands 12", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "commands", slug: "commands-slug-12" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("commands");
    expect(row.slug).toBe("commands-slug-12");
  });
  it("buildCompareEntryRow commands 13", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "commands", slug: "commands-slug-13" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("commands");
    expect(row.slug).toBe("commands-slug-13");
  });
  it("buildCompareEntryRow commands 14", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "commands", slug: "commands-slug-14" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("commands");
    expect(row.slug).toBe("commands-slug-14");
  });
  it("buildCompareEntryRow hooks 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "hooks", slug: "hooks-slug-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("hooks");
    expect(row.slug).toBe("hooks-slug-0");
  });
  it("buildCompareEntryRow hooks 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "hooks", slug: "hooks-slug-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("hooks");
    expect(row.slug).toBe("hooks-slug-1");
  });
  it("buildCompareEntryRow hooks 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "hooks", slug: "hooks-slug-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("hooks");
    expect(row.slug).toBe("hooks-slug-2");
  });
  it("buildCompareEntryRow hooks 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "hooks", slug: "hooks-slug-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("hooks");
    expect(row.slug).toBe("hooks-slug-3");
  });
  it("buildCompareEntryRow hooks 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "hooks", slug: "hooks-slug-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("hooks");
    expect(row.slug).toBe("hooks-slug-4");
  });
  it("buildCompareEntryRow hooks 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "hooks", slug: "hooks-slug-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("hooks");
    expect(row.slug).toBe("hooks-slug-5");
  });
  it("buildCompareEntryRow hooks 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "hooks", slug: "hooks-slug-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("hooks");
    expect(row.slug).toBe("hooks-slug-6");
  });
  it("buildCompareEntryRow hooks 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "hooks", slug: "hooks-slug-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("hooks");
    expect(row.slug).toBe("hooks-slug-7");
  });
  it("buildCompareEntryRow hooks 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "hooks", slug: "hooks-slug-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("hooks");
    expect(row.slug).toBe("hooks-slug-8");
  });
  it("buildCompareEntryRow hooks 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "hooks", slug: "hooks-slug-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("hooks");
    expect(row.slug).toBe("hooks-slug-9");
  });
  it("buildCompareEntryRow hooks 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "hooks", slug: "hooks-slug-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("hooks");
    expect(row.slug).toBe("hooks-slug-10");
  });
  it("buildCompareEntryRow hooks 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "hooks", slug: "hooks-slug-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("hooks");
    expect(row.slug).toBe("hooks-slug-11");
  });
  it("buildCompareEntryRow hooks 12", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "hooks", slug: "hooks-slug-12" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("hooks");
    expect(row.slug).toBe("hooks-slug-12");
  });
  it("buildCompareEntryRow hooks 13", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "hooks", slug: "hooks-slug-13" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("hooks");
    expect(row.slug).toBe("hooks-slug-13");
  });
  it("buildCompareEntryRow hooks 14", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "hooks", slug: "hooks-slug-14" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("hooks");
    expect(row.slug).toBe("hooks-slug-14");
  });
  it("buildCompareEntryRow guides 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "guides", slug: "guides-slug-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("guides");
    expect(row.slug).toBe("guides-slug-0");
  });
  it("buildCompareEntryRow guides 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "guides", slug: "guides-slug-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("guides");
    expect(row.slug).toBe("guides-slug-1");
  });
  it("buildCompareEntryRow guides 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "guides", slug: "guides-slug-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("guides");
    expect(row.slug).toBe("guides-slug-2");
  });
  it("buildCompareEntryRow guides 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "guides", slug: "guides-slug-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("guides");
    expect(row.slug).toBe("guides-slug-3");
  });
  it("buildCompareEntryRow guides 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "guides", slug: "guides-slug-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("guides");
    expect(row.slug).toBe("guides-slug-4");
  });
  it("buildCompareEntryRow guides 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "guides", slug: "guides-slug-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("guides");
    expect(row.slug).toBe("guides-slug-5");
  });
  it("buildCompareEntryRow guides 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "guides", slug: "guides-slug-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("guides");
    expect(row.slug).toBe("guides-slug-6");
  });
  it("buildCompareEntryRow guides 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "guides", slug: "guides-slug-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("guides");
    expect(row.slug).toBe("guides-slug-7");
  });
  it("buildCompareEntryRow guides 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "guides", slug: "guides-slug-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("guides");
    expect(row.slug).toBe("guides-slug-8");
  });
  it("buildCompareEntryRow guides 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "guides", slug: "guides-slug-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("guides");
    expect(row.slug).toBe("guides-slug-9");
  });
  it("buildCompareEntryRow guides 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "guides", slug: "guides-slug-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("guides");
    expect(row.slug).toBe("guides-slug-10");
  });
  it("buildCompareEntryRow guides 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "guides", slug: "guides-slug-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("guides");
    expect(row.slug).toBe("guides-slug-11");
  });
  it("buildCompareEntryRow guides 12", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "guides", slug: "guides-slug-12" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("guides");
    expect(row.slug).toBe("guides-slug-12");
  });
  it("buildCompareEntryRow guides 13", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "guides", slug: "guides-slug-13" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("guides");
    expect(row.slug).toBe("guides-slug-13");
  });
  it("buildCompareEntryRow guides 14", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "guides", slug: "guides-slug-14" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("guides");
    expect(row.slug).toBe("guides-slug-14");
  });
  it("buildCompareEntryRow collections 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "collections", slug: "collections-slug-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("collections");
    expect(row.slug).toBe("collections-slug-0");
  });
  it("buildCompareEntryRow collections 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "collections", slug: "collections-slug-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("collections");
    expect(row.slug).toBe("collections-slug-1");
  });
  it("buildCompareEntryRow collections 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "collections", slug: "collections-slug-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("collections");
    expect(row.slug).toBe("collections-slug-2");
  });
  it("buildCompareEntryRow collections 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "collections", slug: "collections-slug-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("collections");
    expect(row.slug).toBe("collections-slug-3");
  });
  it("buildCompareEntryRow collections 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "collections", slug: "collections-slug-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("collections");
    expect(row.slug).toBe("collections-slug-4");
  });
  it("buildCompareEntryRow collections 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "collections", slug: "collections-slug-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("collections");
    expect(row.slug).toBe("collections-slug-5");
  });
  it("buildCompareEntryRow collections 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "collections", slug: "collections-slug-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("collections");
    expect(row.slug).toBe("collections-slug-6");
  });
  it("buildCompareEntryRow collections 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "collections", slug: "collections-slug-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("collections");
    expect(row.slug).toBe("collections-slug-7");
  });
  it("buildCompareEntryRow collections 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "collections", slug: "collections-slug-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("collections");
    expect(row.slug).toBe("collections-slug-8");
  });
  it("buildCompareEntryRow collections 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "collections", slug: "collections-slug-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("collections");
    expect(row.slug).toBe("collections-slug-9");
  });
  it("buildCompareEntryRow collections 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "collections", slug: "collections-slug-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("collections");
    expect(row.slug).toBe("collections-slug-10");
  });
  it("buildCompareEntryRow collections 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "collections", slug: "collections-slug-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("collections");
    expect(row.slug).toBe("collections-slug-11");
  });
  it("buildCompareEntryRow collections 12", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "collections", slug: "collections-slug-12" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("collections");
    expect(row.slug).toBe("collections-slug-12");
  });
  it("buildCompareEntryRow collections 13", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "collections", slug: "collections-slug-13" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("collections");
    expect(row.slug).toBe("collections-slug-13");
  });
  it("buildCompareEntryRow collections 14", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "collections", slug: "collections-slug-14" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("collections");
    expect(row.slug).toBe("collections-slug-14");
  });
  it("buildCompareEntryRow statuslines 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "statuslines", slug: "statuslines-slug-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("statuslines");
    expect(row.slug).toBe("statuslines-slug-0");
  });
  it("buildCompareEntryRow statuslines 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "statuslines", slug: "statuslines-slug-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("statuslines");
    expect(row.slug).toBe("statuslines-slug-1");
  });
  it("buildCompareEntryRow statuslines 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "statuslines", slug: "statuslines-slug-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("statuslines");
    expect(row.slug).toBe("statuslines-slug-2");
  });
  it("buildCompareEntryRow statuslines 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "statuslines", slug: "statuslines-slug-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("statuslines");
    expect(row.slug).toBe("statuslines-slug-3");
  });
  it("buildCompareEntryRow statuslines 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "statuslines", slug: "statuslines-slug-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("statuslines");
    expect(row.slug).toBe("statuslines-slug-4");
  });
  it("buildCompareEntryRow statuslines 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "statuslines", slug: "statuslines-slug-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("statuslines");
    expect(row.slug).toBe("statuslines-slug-5");
  });
  it("buildCompareEntryRow statuslines 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "statuslines", slug: "statuslines-slug-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("statuslines");
    expect(row.slug).toBe("statuslines-slug-6");
  });
  it("buildCompareEntryRow statuslines 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "statuslines", slug: "statuslines-slug-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("statuslines");
    expect(row.slug).toBe("statuslines-slug-7");
  });
  it("buildCompareEntryRow statuslines 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "statuslines", slug: "statuslines-slug-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("statuslines");
    expect(row.slug).toBe("statuslines-slug-8");
  });
  it("buildCompareEntryRow statuslines 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "statuslines", slug: "statuslines-slug-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("statuslines");
    expect(row.slug).toBe("statuslines-slug-9");
  });
  it("buildCompareEntryRow statuslines 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "statuslines", slug: "statuslines-slug-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("statuslines");
    expect(row.slug).toBe("statuslines-slug-10");
  });
  it("buildCompareEntryRow statuslines 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "statuslines", slug: "statuslines-slug-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("statuslines");
    expect(row.slug).toBe("statuslines-slug-11");
  });
  it("buildCompareEntryRow statuslines 12", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "statuslines", slug: "statuslines-slug-12" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("statuslines");
    expect(row.slug).toBe("statuslines-slug-12");
  });
  it("buildCompareEntryRow statuslines 13", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "statuslines", slug: "statuslines-slug-13" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("statuslines");
    expect(row.slug).toBe("statuslines-slug-13");
  });
  it("buildCompareEntryRow statuslines 14", () => {
    const row = buildCompareEntryRow(
      makeEntry({ category: "statuslines", slug: "statuslines-slug-14" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.category).toBe("statuslines");
    expect(row.slug).toBe("statuslines-slug-14");
  });
  it("buildCompareEntryRow platform claude-code 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-code");
  });
  it("buildCompareEntryRow platform claude-code 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-code");
  });
  it("buildCompareEntryRow platform claude-code 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-code");
  });
  it("buildCompareEntryRow platform claude-code 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-code");
  });
  it("buildCompareEntryRow platform claude-code 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-code");
  });
  it("buildCompareEntryRow platform claude-code 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-code");
  });
  it("buildCompareEntryRow platform claude-code 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-code");
  });
  it("buildCompareEntryRow platform claude-code 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-code");
  });
  it("buildCompareEntryRow platform claude-code 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-code");
  });
  it("buildCompareEntryRow platform claude-code 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-code");
  });
  it("buildCompareEntryRow platform claude-code 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-code");
  });
  it("buildCompareEntryRow platform claude-code 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-code");
  });
  it("buildCompareEntryRow platform claude-desktop 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-desktop");
  });
  it("buildCompareEntryRow platform claude-desktop 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-desktop");
  });
  it("buildCompareEntryRow platform claude-desktop 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-desktop");
  });
  it("buildCompareEntryRow platform claude-desktop 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-desktop");
  });
  it("buildCompareEntryRow platform claude-desktop 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-desktop");
  });
  it("buildCompareEntryRow platform claude-desktop 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-desktop");
  });
  it("buildCompareEntryRow platform claude-desktop 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-desktop");
  });
  it("buildCompareEntryRow platform claude-desktop 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-desktop");
  });
  it("buildCompareEntryRow platform claude-desktop 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-desktop");
  });
  it("buildCompareEntryRow platform claude-desktop 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-desktop");
  });
  it("buildCompareEntryRow platform claude-desktop 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-desktop");
  });
  it("buildCompareEntryRow platform claude-desktop 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("claude-desktop");
  });
  it("buildCompareEntryRow platform cursor 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("cursor");
  });
  it("buildCompareEntryRow platform cursor 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("cursor");
  });
  it("buildCompareEntryRow platform cursor 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("cursor");
  });
  it("buildCompareEntryRow platform cursor 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("cursor");
  });
  it("buildCompareEntryRow platform cursor 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("cursor");
  });
  it("buildCompareEntryRow platform cursor 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("cursor");
  });
  it("buildCompareEntryRow platform cursor 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("cursor");
  });
  it("buildCompareEntryRow platform cursor 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("cursor");
  });
  it("buildCompareEntryRow platform cursor 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("cursor");
  });
  it("buildCompareEntryRow platform cursor 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("cursor");
  });
  it("buildCompareEntryRow platform cursor 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("cursor");
  });
  it("buildCompareEntryRow platform cursor 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("cursor");
  });
  it("buildCompareEntryRow platform vscode 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("vscode");
  });
  it("buildCompareEntryRow platform vscode 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("vscode");
  });
  it("buildCompareEntryRow platform vscode 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("vscode");
  });
  it("buildCompareEntryRow platform vscode 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("vscode");
  });
  it("buildCompareEntryRow platform vscode 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("vscode");
  });
  it("buildCompareEntryRow platform vscode 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("vscode");
  });
  it("buildCompareEntryRow platform vscode 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("vscode");
  });
  it("buildCompareEntryRow platform vscode 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("vscode");
  });
  it("buildCompareEntryRow platform vscode 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("vscode");
  });
  it("buildCompareEntryRow platform vscode 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("vscode");
  });
  it("buildCompareEntryRow platform vscode 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("vscode");
  });
  it("buildCompareEntryRow platform vscode 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("vscode");
  });
  it("buildCompareEntryRow platform windsurf 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("windsurf");
  });
  it("buildCompareEntryRow platform windsurf 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("windsurf");
  });
  it("buildCompareEntryRow platform windsurf 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("windsurf");
  });
  it("buildCompareEntryRow platform windsurf 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("windsurf");
  });
  it("buildCompareEntryRow platform windsurf 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("windsurf");
  });
  it("buildCompareEntryRow platform windsurf 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("windsurf");
  });
  it("buildCompareEntryRow platform windsurf 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("windsurf");
  });
  it("buildCompareEntryRow platform windsurf 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("windsurf");
  });
  it("buildCompareEntryRow platform windsurf 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("windsurf");
  });
  it("buildCompareEntryRow platform windsurf 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("windsurf");
  });
  it("buildCompareEntryRow platform windsurf 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("windsurf");
  });
  it("buildCompareEntryRow platform windsurf 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("windsurf");
  });
  it("buildCompareEntryRow platform codex 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("codex");
  });
  it("buildCompareEntryRow platform codex 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("codex");
  });
  it("buildCompareEntryRow platform codex 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("codex");
  });
  it("buildCompareEntryRow platform codex 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("codex");
  });
  it("buildCompareEntryRow platform codex 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("codex");
  });
  it("buildCompareEntryRow platform codex 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("codex");
  });
  it("buildCompareEntryRow platform codex 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("codex");
  });
  it("buildCompareEntryRow platform codex 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("codex");
  });
  it("buildCompareEntryRow platform codex 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("codex");
  });
  it("buildCompareEntryRow platform codex 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("codex");
  });
  it("buildCompareEntryRow platform codex 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("codex");
  });
  it("buildCompareEntryRow platform codex 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("codex");
  });
  it("buildCompareEntryRow platform gemini 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("gemini");
  });
  it("buildCompareEntryRow platform gemini 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("gemini");
  });
  it("buildCompareEntryRow platform gemini 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("gemini");
  });
  it("buildCompareEntryRow platform gemini 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("gemini");
  });
  it("buildCompareEntryRow platform gemini 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("gemini");
  });
  it("buildCompareEntryRow platform gemini 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("gemini");
  });
  it("buildCompareEntryRow platform gemini 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("gemini");
  });
  it("buildCompareEntryRow platform gemini 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("gemini");
  });
  it("buildCompareEntryRow platform gemini 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("gemini");
  });
  it("buildCompareEntryRow platform gemini 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("gemini");
  });
  it("buildCompareEntryRow platform gemini 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("gemini");
  });
  it("buildCompareEntryRow platform gemini 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("gemini");
  });
  it("buildCompareEntryRow platform raycast 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("raycast");
  });
  it("buildCompareEntryRow platform raycast 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("raycast");
  });
  it("buildCompareEntryRow platform raycast 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("raycast");
  });
  it("buildCompareEntryRow platform raycast 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("raycast");
  });
  it("buildCompareEntryRow platform raycast 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("raycast");
  });
  it("buildCompareEntryRow platform raycast 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("raycast");
  });
  it("buildCompareEntryRow platform raycast 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("raycast");
  });
  it("buildCompareEntryRow platform raycast 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("raycast");
  });
  it("buildCompareEntryRow platform raycast 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("raycast");
  });
  it("buildCompareEntryRow platform raycast 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("raycast");
  });
  it("buildCompareEntryRow platform raycast 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("raycast");
  });
  it("buildCompareEntryRow platform raycast 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("raycast");
  });
  it("buildCompareEntryRow platform cli 0", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("cli");
  });
  it("buildCompareEntryRow platform cli 1", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("cli");
  });
  it("buildCompareEntryRow platform cli 2", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("cli");
  });
  it("buildCompareEntryRow platform cli 3", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("cli");
  });
  it("buildCompareEntryRow platform cli 4", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("cli");
  });
  it("buildCompareEntryRow platform cli 5", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("cli");
  });
  it("buildCompareEntryRow platform cli 6", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("cli");
  });
  it("buildCompareEntryRow platform cli 7", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("cli");
  });
  it("buildCompareEntryRow platform cli 8", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("cli");
  });
  it("buildCompareEntryRow platform cli 9", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("cli");
  });
  it("buildCompareEntryRow platform cli 10", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("cli");
  });
  it("buildCompareEntryRow platform cli 11", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("cli");
  });
  it("buildCompareEntryRow platform aider 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("aider");
  });
  it("buildCompareEntryRow platform aider 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("aider");
  });
  it("buildCompareEntryRow platform aider 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("aider");
  });
  it("buildCompareEntryRow platform aider 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("aider");
  });
  it("buildCompareEntryRow platform aider 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("aider");
  });
  it("buildCompareEntryRow platform aider 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("aider");
  });
  it("buildCompareEntryRow platform aider 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("aider");
  });
  it("buildCompareEntryRow platform aider 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("aider");
  });
  it("buildCompareEntryRow platform aider 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("aider");
  });
  it("buildCompareEntryRow platform aider 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("aider");
  });
  it("buildCompareEntryRow platform aider 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("aider");
  });
  it("buildCompareEntryRow platform aider 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("aider");
  });
  it("buildCompareEntryRow platform zed 0", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("zed");
  });
  it("buildCompareEntryRow platform zed 1", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("zed");
  });
  it("buildCompareEntryRow platform zed 2", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("zed");
  });
  it("buildCompareEntryRow platform zed 3", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("zed");
  });
  it("buildCompareEntryRow platform zed 4", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("zed");
  });
  it("buildCompareEntryRow platform zed 5", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("zed");
  });
  it("buildCompareEntryRow platform zed 6", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("zed");
  });
  it("buildCompareEntryRow platform zed 7", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("zed");
  });
  it("buildCompareEntryRow platform zed 8", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("zed");
  });
  it("buildCompareEntryRow platform zed 9", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("zed");
  });
  it("buildCompareEntryRow platform zed 10", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("zed");
  });
  it("buildCompareEntryRow platform zed 11", () => {
    const row = buildCompareEntryRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    });
    expect(row.platforms).toContain("zed");
  });
  it("buildCompareEntryRow platform continue 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("continue");
  });
  it("buildCompareEntryRow platform continue 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("continue");
  });
  it("buildCompareEntryRow platform continue 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("continue");
  });
  it("buildCompareEntryRow platform continue 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("continue");
  });
  it("buildCompareEntryRow platform continue 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("continue");
  });
  it("buildCompareEntryRow platform continue 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("continue");
  });
  it("buildCompareEntryRow platform continue 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("continue");
  });
  it("buildCompareEntryRow platform continue 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("continue");
  });
  it("buildCompareEntryRow platform continue 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("continue");
  });
  it("buildCompareEntryRow platform continue 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("continue");
  });
  it("buildCompareEntryRow platform continue 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("continue");
  });
  it("buildCompareEntryRow platform continue 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.platforms).toContain("continue");
  });
  it("buildCompareEntryRow churn 0", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-0", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-0");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 1", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-1", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-1");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 2", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-2", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-2");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 3", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-3", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-3");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 4", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-4", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-4");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 5", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-5", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-5");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 6", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-6", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-6");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 7", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-7", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-7");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 8", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-8", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-8");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 9", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-9", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-9");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 10", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-10", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-10");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 11", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-11", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-11");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 12", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-12", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-12");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 13", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-13", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-13");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 14", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-14", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-14");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 15", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-15", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-15");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 16", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-16", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-16");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 17", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-17", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-17");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 18", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-18", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-18");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 19", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-19", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-19");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 20", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-20", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-20");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 21", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-21", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-21");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 22", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-22", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-22");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 23", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-23", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-23");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 24", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-24", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-24");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 25", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-25", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-25");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 26", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-26", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-26");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 27", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-27", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-27");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 28", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-28", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-28");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 29", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-29", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-29");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 30", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-30", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-30");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 31", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-31", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-31");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 32", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-32", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-32");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 33", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-33", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-33");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 34", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-34", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-34");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 35", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-35", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-35");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 36", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-36", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-36");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 37", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-37", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-37");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 38", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-38", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-38");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 39", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-39", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-39");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 40", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-40", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-40");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 41", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-41", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-41");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 42", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-42", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-42");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 43", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-43", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-43");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 44", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-44", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-44");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 45", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-45", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-45");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 46", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-46", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-46");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 47", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-47", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-47");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 48", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-48", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-48");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 49", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-49", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-49");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 50", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-50", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-50");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 51", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-51", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-51");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 52", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-52", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-52");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 53", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-53", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-53");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 54", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-54", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-54");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 55", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-55", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-55");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 56", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-56", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-56");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 57", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-57", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-57");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 58", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-58", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-58");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 59", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-59", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-59");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 60", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-60", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-60");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 61", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-61", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-61");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 62", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-62", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-62");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 63", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-63", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-63");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 64", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-64", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-64");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 65", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-65", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-65");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 66", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-66", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-66");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 67", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-67", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-67");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 68", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-68", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-68");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 69", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-69", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-69");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 70", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-70", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-70");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 71", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-71", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-71");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 72", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-72", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-72");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 73", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-73", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-73");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 74", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-74", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-74");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 75", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-75", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-75");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 76", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-76", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-76");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 77", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-77", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-77");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 78", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-78", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-78");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 79", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-79", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-79");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 80", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-80", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-80");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 81", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-81", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-81");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 82", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-82", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-82");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 83", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-83", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-83");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 84", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-84", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-84");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 85", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-85", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-85");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 86", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-86", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-86");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 87", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-87", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-87");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 88", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-88", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-88");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 89", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-89", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-89");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 90", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-90", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-90");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 91", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-91", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-91");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 92", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-92", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-92");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 93", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-93", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-93");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 94", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-94", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-94");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 95", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-95", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-95");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 96", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-96", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-96");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 97", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-97", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-97");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 98", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-98", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-98");
    expect(row.installComplexity).toBeTruthy();
  });
  it("buildCompareEntryRow churn 99", () => {
    const row = buildCompareEntryRow(
      makeEntry({ tags: ["tag-99", "shared"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      },
    );
    expect(row.tags).toContain("tag-99");
    expect(row.installComplexity).toBeTruthy();
  });
});

describe("registry-compare-lib sharedCompareTags", () => {
  it("returns empty for no entries", () => {
    expect(sharedCompareTags([])).toEqual([]);
  });
  it("intersects tags across entries", () => {
    const compared = [
      { tags: ["a", "b", "c"] },
      { tags: ["b", "c", "d"] },
      { tags: ["b", "c", "e"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(["b", "c"]);
  });
  it("intersects case-insensitively but keeps the first entry's casing", () => {
    const compared = [
      { tags: ["Code-Review", "Testing"] },
      { tags: ["code-review", "  Testing  "] },
    ];
    expect(sharedCompareTags(compared)).toEqual(["Code-Review", "Testing"]);
  });
  it("dedupes a single entry's tags without lowercasing", () => {
    expect(sharedCompareTags([{ tags: ["Alpha", "Beta", "Alpha"] }])).toEqual([
      "Alpha",
      "Beta",
    ]);
  });
  it("sharedCompareTags matrix 0", () => {
    const shared = ["shared-0", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 1", () => {
    const shared = ["shared-1", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 2", () => {
    const shared = ["shared-2", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 3", () => {
    const shared = ["shared-3", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 4", () => {
    const shared = ["shared-4", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 5", () => {
    const shared = ["shared-0", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 6", () => {
    const shared = ["shared-1", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 7", () => {
    const shared = ["shared-2", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 8", () => {
    const shared = ["shared-3", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 9", () => {
    const shared = ["shared-4", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 10", () => {
    const shared = ["shared-0", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 11", () => {
    const shared = ["shared-1", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 12", () => {
    const shared = ["shared-2", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 13", () => {
    const shared = ["shared-3", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 14", () => {
    const shared = ["shared-4", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 15", () => {
    const shared = ["shared-0", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 16", () => {
    const shared = ["shared-1", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 17", () => {
    const shared = ["shared-2", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 18", () => {
    const shared = ["shared-3", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 19", () => {
    const shared = ["shared-4", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 20", () => {
    const shared = ["shared-0", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 21", () => {
    const shared = ["shared-1", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 22", () => {
    const shared = ["shared-2", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 23", () => {
    const shared = ["shared-3", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 24", () => {
    const shared = ["shared-4", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 25", () => {
    const shared = ["shared-0", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 26", () => {
    const shared = ["shared-1", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 27", () => {
    const shared = ["shared-2", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 28", () => {
    const shared = ["shared-3", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 29", () => {
    const shared = ["shared-4", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 30", () => {
    const shared = ["shared-0", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 31", () => {
    const shared = ["shared-1", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 32", () => {
    const shared = ["shared-2", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 33", () => {
    const shared = ["shared-3", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 34", () => {
    const shared = ["shared-4", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 35", () => {
    const shared = ["shared-0", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 36", () => {
    const shared = ["shared-1", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 37", () => {
    const shared = ["shared-2", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 38", () => {
    const shared = ["shared-3", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 39", () => {
    const shared = ["shared-4", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 40", () => {
    const shared = ["shared-0", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 41", () => {
    const shared = ["shared-1", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 42", () => {
    const shared = ["shared-2", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 43", () => {
    const shared = ["shared-3", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 44", () => {
    const shared = ["shared-4", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 45", () => {
    const shared = ["shared-0", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 46", () => {
    const shared = ["shared-1", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 47", () => {
    const shared = ["shared-2", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 48", () => {
    const shared = ["shared-3", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 49", () => {
    const shared = ["shared-4", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 50", () => {
    const shared = ["shared-0", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 51", () => {
    const shared = ["shared-1", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 52", () => {
    const shared = ["shared-2", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 53", () => {
    const shared = ["shared-3", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 54", () => {
    const shared = ["shared-4", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 55", () => {
    const shared = ["shared-0", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 56", () => {
    const shared = ["shared-1", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 57", () => {
    const shared = ["shared-2", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 58", () => {
    const shared = ["shared-3", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 59", () => {
    const shared = ["shared-4", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 60", () => {
    const shared = ["shared-0", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 61", () => {
    const shared = ["shared-1", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 62", () => {
    const shared = ["shared-2", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 63", () => {
    const shared = ["shared-3", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 64", () => {
    const shared = ["shared-4", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 65", () => {
    const shared = ["shared-0", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 66", () => {
    const shared = ["shared-1", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 67", () => {
    const shared = ["shared-2", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 68", () => {
    const shared = ["shared-3", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 69", () => {
    const shared = ["shared-4", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 70", () => {
    const shared = ["shared-0", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 71", () => {
    const shared = ["shared-1", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 72", () => {
    const shared = ["shared-2", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 73", () => {
    const shared = ["shared-3", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 74", () => {
    const shared = ["shared-4", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 75", () => {
    const shared = ["shared-0", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 76", () => {
    const shared = ["shared-1", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 77", () => {
    const shared = ["shared-2", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 78", () => {
    const shared = ["shared-3", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
  it("sharedCompareTags matrix 79", () => {
    const shared = ["shared-4", "common"];
    const compared = [
      { tags: [...shared, "only-a"] },
      { tags: [...shared, "only-b"] },
    ];
    expect(sharedCompareTags(compared)).toEqual(shared);
  });
});

describe("registry-compare-lib buildCompareEntriesResponse", () => {
  it("builds ok envelope with shared tags", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ tags: ["a", "b"] }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
      buildCompareEntryRow(makeEntry({ slug: "other", tags: ["b", "c"] }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({
      platform: "cursor",
      compared,
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(2);
    expect(response.sharedTags).toEqual(["b"]);
    expect(response.comparisonNotes).toEqual(COMPARE_ENTRIES_NOTES);
  });
  it("buildCompareEntriesResponse churn 0", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-0" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 1", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-1" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 2", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-2" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 3", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-3" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 4", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-4" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 5", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-5" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 6", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-6" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 7", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-7" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 8", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-8" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 9", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-9" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 10", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-10" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 11", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-11" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 12", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-12" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 13", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-13" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 14", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-14" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 15", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-15" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 16", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-16" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 17", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-17" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 18", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-18" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 19", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-19" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 20", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-20" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 21", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-21" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 22", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-22" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 23", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-23" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 24", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-24" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 25", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-25" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 26", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-26" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 27", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-27" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 28", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-28" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 29", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-29" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 30", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-30" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 31", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-31" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 32", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-32" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 33", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-33" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 34", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-34" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 35", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-35" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 36", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-36" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 37", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-37" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 38", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-38" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 39", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-39" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 40", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-40" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 41", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-41" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 42", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-42" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 43", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-43" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 44", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-44" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 45", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-45" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 46", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-46" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 47", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-47" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 48", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-48" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 49", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-49" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 50", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-50" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 51", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-51" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 52", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-52" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 53", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-53" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 54", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-54" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 55", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-55" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 56", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-56" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 57", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-57" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 58", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-58" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 59", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-59" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 60", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-60" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 61", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-61" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 62", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-62" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 63", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-63" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 64", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-64" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 65", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-65" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 66", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-66" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 67", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-67" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 68", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-68" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 69", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-69" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 70", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-70" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 71", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-71" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 72", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-72" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 73", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-73" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 74", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-74" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 75", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-75" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 76", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-76" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 77", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-77" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 78", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-78" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
  it("buildCompareEntriesResponse churn 79", () => {
    const compared = [
      buildCompareEntryRow(makeEntry({ slug: "slug-79" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryInstallComplexity,
        categoryPrimaryAsset,
        sourceSummary,
        entryTrustSummary,
        entryCanonicalUrl,
      }),
    ];
    const response = buildCompareEntriesResponse({ platform: "", compared });
    expect(response.count).toBe(1);
    expect(response.entries).toHaveLength(1);
  });
});
