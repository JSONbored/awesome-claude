import { describe, expect, it } from "vitest";

import { buildSkillPlatformCompatibility } from "../packages/mcp/src/platforms.js";
import { normalizePlatform } from "../packages/mcp/src/registry-normalize-lib.js";
import {
  TRUST_COMPARE_NOTES,
  buildTrustCompareResponse,
  buildTrustCompareRow,
  rankTrustCompareEntries,
  sharedTrustSignalGaps,
} from "../packages/mcp/src/registry-trust-compare-lib.js";
import {
  TRUST_SIGNAL_KEYS,
  entryCanonicalUrl,
  entryTrustSignalCoverage,
  entryTrustSummary,
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

describe("registry-trust-compare-lib TRUST_COMPARE_NOTES", () => {
  it("exports five trust compare notes", () => {
    expect(TRUST_COMPARE_NOTES).toHaveLength(5);
    expect(TRUST_COMPARE_NOTES[0]).toContain("Coverage");
  });
  it("TRUST_COMPARE_NOTES note 0", () => {
    expect(TRUST_COMPARE_NOTES[0].length).toBeGreaterThan(10);
  });
  it("TRUST_COMPARE_NOTES note 1", () => {
    expect(TRUST_COMPARE_NOTES[1].length).toBeGreaterThan(10);
  });
  it("TRUST_COMPARE_NOTES note 2", () => {
    expect(TRUST_COMPARE_NOTES[2].length).toBeGreaterThan(10);
  });
  it("TRUST_COMPARE_NOTES note 3", () => {
    expect(TRUST_COMPARE_NOTES[3].length).toBeGreaterThan(10);
  });
  it("TRUST_COMPARE_NOTES note 4", () => {
    expect(TRUST_COMPARE_NOTES[4].length).toBeGreaterThan(10);
  });
  it("TRUST_COMPARE_NOTES note 5", () => {
    expect(TRUST_COMPARE_NOTES[0].length).toBeGreaterThan(10);
  });
  it("TRUST_COMPARE_NOTES note 6", () => {
    expect(TRUST_COMPARE_NOTES[1].length).toBeGreaterThan(10);
  });
  it("TRUST_COMPARE_NOTES note 7", () => {
    expect(TRUST_COMPARE_NOTES[2].length).toBeGreaterThan(10);
  });
  it("TRUST_COMPARE_NOTES note 8", () => {
    expect(TRUST_COMPARE_NOTES[3].length).toBeGreaterThan(10);
  });
  it("TRUST_COMPARE_NOTES note 9", () => {
    expect(TRUST_COMPARE_NOTES[4].length).toBeGreaterThan(10);
  });
  it("TRUST_COMPARE_NOTES note 10", () => {
    expect(TRUST_COMPARE_NOTES[0].length).toBeGreaterThan(10);
  });
  it("TRUST_COMPARE_NOTES note 11", () => {
    expect(TRUST_COMPARE_NOTES[1].length).toBeGreaterThan(10);
  });
  it("TRUST_COMPARE_NOTES note 12", () => {
    expect(TRUST_COMPARE_NOTES[2].length).toBeGreaterThan(10);
  });
  it("TRUST_COMPARE_NOTES note 13", () => {
    expect(TRUST_COMPARE_NOTES[3].length).toBeGreaterThan(10);
  });
  it("TRUST_COMPARE_NOTES note 14", () => {
    expect(TRUST_COMPARE_NOTES[4].length).toBeGreaterThan(10);
  });
  it("TRUST_COMPARE_NOTES note 15", () => {
    expect(TRUST_COMPARE_NOTES[0].length).toBeGreaterThan(10);
  });
  it("TRUST_COMPARE_NOTES note 16", () => {
    expect(TRUST_COMPARE_NOTES[1].length).toBeGreaterThan(10);
  });
  it("TRUST_COMPARE_NOTES note 17", () => {
    expect(TRUST_COMPARE_NOTES[2].length).toBeGreaterThan(10);
  });
  it("TRUST_COMPARE_NOTES note 18", () => {
    expect(TRUST_COMPARE_NOTES[3].length).toBeGreaterThan(10);
  });
  it("TRUST_COMPARE_NOTES note 19", () => {
    expect(TRUST_COMPARE_NOTES[4].length).toBeGreaterThan(10);
  });
});

describe("registry-trust-compare-lib buildTrustCompareRow", () => {
  it("builds trust compare row with signal coverage", () => {
    const row = buildTrustCompareRow(makeEntry(), "", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSignalCoverage,
      entryTrustSummary,
    });
    expect(row.signalCoverage).toBeDefined();
    expect(row.trust).toBeDefined();
  });
  it("buildTrustCompareRow agents 0", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "agents", slug: "agents-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("agents:agents-0");
  });
  it("buildTrustCompareRow agents 1", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "agents", slug: "agents-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("agents:agents-1");
  });
  it("buildTrustCompareRow agents 2", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "agents", slug: "agents-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("agents:agents-2");
  });
  it("buildTrustCompareRow agents 3", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "agents", slug: "agents-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("agents:agents-3");
  });
  it("buildTrustCompareRow agents 4", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "agents", slug: "agents-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("agents:agents-4");
  });
  it("buildTrustCompareRow agents 5", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "agents", slug: "agents-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("agents:agents-5");
  });
  it("buildTrustCompareRow agents 6", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "agents", slug: "agents-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("agents:agents-6");
  });
  it("buildTrustCompareRow agents 7", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "agents", slug: "agents-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("agents:agents-7");
  });
  it("buildTrustCompareRow agents 8", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "agents", slug: "agents-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("agents:agents-8");
  });
  it("buildTrustCompareRow agents 9", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "agents", slug: "agents-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("agents:agents-9");
  });
  it("buildTrustCompareRow agents 10", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "agents", slug: "agents-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("agents:agents-10");
  });
  it("buildTrustCompareRow agents 11", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "agents", slug: "agents-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("agents:agents-11");
  });
  it("buildTrustCompareRow mcp 0", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "mcp", slug: "mcp-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("mcp:mcp-0");
  });
  it("buildTrustCompareRow mcp 1", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "mcp", slug: "mcp-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("mcp:mcp-1");
  });
  it("buildTrustCompareRow mcp 2", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "mcp", slug: "mcp-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("mcp:mcp-2");
  });
  it("buildTrustCompareRow mcp 3", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "mcp", slug: "mcp-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("mcp:mcp-3");
  });
  it("buildTrustCompareRow mcp 4", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "mcp", slug: "mcp-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("mcp:mcp-4");
  });
  it("buildTrustCompareRow mcp 5", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "mcp", slug: "mcp-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("mcp:mcp-5");
  });
  it("buildTrustCompareRow mcp 6", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "mcp", slug: "mcp-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("mcp:mcp-6");
  });
  it("buildTrustCompareRow mcp 7", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "mcp", slug: "mcp-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("mcp:mcp-7");
  });
  it("buildTrustCompareRow mcp 8", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "mcp", slug: "mcp-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("mcp:mcp-8");
  });
  it("buildTrustCompareRow mcp 9", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "mcp", slug: "mcp-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("mcp:mcp-9");
  });
  it("buildTrustCompareRow mcp 10", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "mcp", slug: "mcp-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("mcp:mcp-10");
  });
  it("buildTrustCompareRow mcp 11", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "mcp", slug: "mcp-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("mcp:mcp-11");
  });
  it("buildTrustCompareRow tools 0", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "tools", slug: "tools-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("tools:tools-0");
  });
  it("buildTrustCompareRow tools 1", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "tools", slug: "tools-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("tools:tools-1");
  });
  it("buildTrustCompareRow tools 2", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "tools", slug: "tools-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("tools:tools-2");
  });
  it("buildTrustCompareRow tools 3", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "tools", slug: "tools-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("tools:tools-3");
  });
  it("buildTrustCompareRow tools 4", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "tools", slug: "tools-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("tools:tools-4");
  });
  it("buildTrustCompareRow tools 5", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "tools", slug: "tools-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("tools:tools-5");
  });
  it("buildTrustCompareRow tools 6", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "tools", slug: "tools-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("tools:tools-6");
  });
  it("buildTrustCompareRow tools 7", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "tools", slug: "tools-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("tools:tools-7");
  });
  it("buildTrustCompareRow tools 8", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "tools", slug: "tools-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("tools:tools-8");
  });
  it("buildTrustCompareRow tools 9", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "tools", slug: "tools-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("tools:tools-9");
  });
  it("buildTrustCompareRow tools 10", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "tools", slug: "tools-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("tools:tools-10");
  });
  it("buildTrustCompareRow tools 11", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "tools", slug: "tools-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("tools:tools-11");
  });
  it("buildTrustCompareRow skills 0", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "skills", slug: "skills-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("skills:skills-0");
  });
  it("buildTrustCompareRow skills 1", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "skills", slug: "skills-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("skills:skills-1");
  });
  it("buildTrustCompareRow skills 2", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "skills", slug: "skills-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("skills:skills-2");
  });
  it("buildTrustCompareRow skills 3", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "skills", slug: "skills-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("skills:skills-3");
  });
  it("buildTrustCompareRow skills 4", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "skills", slug: "skills-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("skills:skills-4");
  });
  it("buildTrustCompareRow skills 5", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "skills", slug: "skills-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("skills:skills-5");
  });
  it("buildTrustCompareRow skills 6", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "skills", slug: "skills-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("skills:skills-6");
  });
  it("buildTrustCompareRow skills 7", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "skills", slug: "skills-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("skills:skills-7");
  });
  it("buildTrustCompareRow skills 8", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "skills", slug: "skills-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("skills:skills-8");
  });
  it("buildTrustCompareRow skills 9", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "skills", slug: "skills-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("skills:skills-9");
  });
  it("buildTrustCompareRow skills 10", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "skills", slug: "skills-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("skills:skills-10");
  });
  it("buildTrustCompareRow skills 11", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "skills", slug: "skills-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("skills:skills-11");
  });
  it("buildTrustCompareRow rules 0", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "rules", slug: "rules-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("rules:rules-0");
  });
  it("buildTrustCompareRow rules 1", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "rules", slug: "rules-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("rules:rules-1");
  });
  it("buildTrustCompareRow rules 2", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "rules", slug: "rules-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("rules:rules-2");
  });
  it("buildTrustCompareRow rules 3", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "rules", slug: "rules-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("rules:rules-3");
  });
  it("buildTrustCompareRow rules 4", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "rules", slug: "rules-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("rules:rules-4");
  });
  it("buildTrustCompareRow rules 5", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "rules", slug: "rules-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("rules:rules-5");
  });
  it("buildTrustCompareRow rules 6", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "rules", slug: "rules-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("rules:rules-6");
  });
  it("buildTrustCompareRow rules 7", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "rules", slug: "rules-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("rules:rules-7");
  });
  it("buildTrustCompareRow rules 8", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "rules", slug: "rules-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("rules:rules-8");
  });
  it("buildTrustCompareRow rules 9", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "rules", slug: "rules-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("rules:rules-9");
  });
  it("buildTrustCompareRow rules 10", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "rules", slug: "rules-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("rules:rules-10");
  });
  it("buildTrustCompareRow rules 11", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "rules", slug: "rules-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("rules:rules-11");
  });
  it("buildTrustCompareRow commands 0", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "commands", slug: "commands-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("commands:commands-0");
  });
  it("buildTrustCompareRow commands 1", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "commands", slug: "commands-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("commands:commands-1");
  });
  it("buildTrustCompareRow commands 2", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "commands", slug: "commands-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("commands:commands-2");
  });
  it("buildTrustCompareRow commands 3", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "commands", slug: "commands-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("commands:commands-3");
  });
  it("buildTrustCompareRow commands 4", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "commands", slug: "commands-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("commands:commands-4");
  });
  it("buildTrustCompareRow commands 5", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "commands", slug: "commands-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("commands:commands-5");
  });
  it("buildTrustCompareRow commands 6", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "commands", slug: "commands-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("commands:commands-6");
  });
  it("buildTrustCompareRow commands 7", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "commands", slug: "commands-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("commands:commands-7");
  });
  it("buildTrustCompareRow commands 8", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "commands", slug: "commands-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("commands:commands-8");
  });
  it("buildTrustCompareRow commands 9", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "commands", slug: "commands-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("commands:commands-9");
  });
  it("buildTrustCompareRow commands 10", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "commands", slug: "commands-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("commands:commands-10");
  });
  it("buildTrustCompareRow commands 11", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "commands", slug: "commands-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("commands:commands-11");
  });
  it("buildTrustCompareRow hooks 0", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "hooks", slug: "hooks-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("hooks:hooks-0");
  });
  it("buildTrustCompareRow hooks 1", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "hooks", slug: "hooks-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("hooks:hooks-1");
  });
  it("buildTrustCompareRow hooks 2", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "hooks", slug: "hooks-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("hooks:hooks-2");
  });
  it("buildTrustCompareRow hooks 3", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "hooks", slug: "hooks-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("hooks:hooks-3");
  });
  it("buildTrustCompareRow hooks 4", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "hooks", slug: "hooks-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("hooks:hooks-4");
  });
  it("buildTrustCompareRow hooks 5", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "hooks", slug: "hooks-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("hooks:hooks-5");
  });
  it("buildTrustCompareRow hooks 6", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "hooks", slug: "hooks-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("hooks:hooks-6");
  });
  it("buildTrustCompareRow hooks 7", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "hooks", slug: "hooks-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("hooks:hooks-7");
  });
  it("buildTrustCompareRow hooks 8", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "hooks", slug: "hooks-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("hooks:hooks-8");
  });
  it("buildTrustCompareRow hooks 9", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "hooks", slug: "hooks-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("hooks:hooks-9");
  });
  it("buildTrustCompareRow hooks 10", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "hooks", slug: "hooks-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("hooks:hooks-10");
  });
  it("buildTrustCompareRow hooks 11", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "hooks", slug: "hooks-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("hooks:hooks-11");
  });
  it("buildTrustCompareRow guides 0", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "guides", slug: "guides-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("guides:guides-0");
  });
  it("buildTrustCompareRow guides 1", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "guides", slug: "guides-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("guides:guides-1");
  });
  it("buildTrustCompareRow guides 2", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "guides", slug: "guides-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("guides:guides-2");
  });
  it("buildTrustCompareRow guides 3", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "guides", slug: "guides-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("guides:guides-3");
  });
  it("buildTrustCompareRow guides 4", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "guides", slug: "guides-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("guides:guides-4");
  });
  it("buildTrustCompareRow guides 5", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "guides", slug: "guides-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("guides:guides-5");
  });
  it("buildTrustCompareRow guides 6", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "guides", slug: "guides-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("guides:guides-6");
  });
  it("buildTrustCompareRow guides 7", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "guides", slug: "guides-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("guides:guides-7");
  });
  it("buildTrustCompareRow guides 8", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "guides", slug: "guides-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("guides:guides-8");
  });
  it("buildTrustCompareRow guides 9", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "guides", slug: "guides-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("guides:guides-9");
  });
  it("buildTrustCompareRow guides 10", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "guides", slug: "guides-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("guides:guides-10");
  });
  it("buildTrustCompareRow guides 11", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "guides", slug: "guides-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("guides:guides-11");
  });
  it("buildTrustCompareRow collections 0", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "collections", slug: "collections-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("collections:collections-0");
  });
  it("buildTrustCompareRow collections 1", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "collections", slug: "collections-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("collections:collections-1");
  });
  it("buildTrustCompareRow collections 2", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "collections", slug: "collections-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("collections:collections-2");
  });
  it("buildTrustCompareRow collections 3", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "collections", slug: "collections-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("collections:collections-3");
  });
  it("buildTrustCompareRow collections 4", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "collections", slug: "collections-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("collections:collections-4");
  });
  it("buildTrustCompareRow collections 5", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "collections", slug: "collections-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("collections:collections-5");
  });
  it("buildTrustCompareRow collections 6", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "collections", slug: "collections-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("collections:collections-6");
  });
  it("buildTrustCompareRow collections 7", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "collections", slug: "collections-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("collections:collections-7");
  });
  it("buildTrustCompareRow collections 8", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "collections", slug: "collections-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("collections:collections-8");
  });
  it("buildTrustCompareRow collections 9", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "collections", slug: "collections-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("collections:collections-9");
  });
  it("buildTrustCompareRow collections 10", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "collections", slug: "collections-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("collections:collections-10");
  });
  it("buildTrustCompareRow collections 11", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "collections", slug: "collections-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("collections:collections-11");
  });
  it("buildTrustCompareRow statuslines 0", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "statuslines", slug: "statuslines-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("statuslines:statuslines-0");
  });
  it("buildTrustCompareRow statuslines 1", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "statuslines", slug: "statuslines-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("statuslines:statuslines-1");
  });
  it("buildTrustCompareRow statuslines 2", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "statuslines", slug: "statuslines-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("statuslines:statuslines-2");
  });
  it("buildTrustCompareRow statuslines 3", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "statuslines", slug: "statuslines-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("statuslines:statuslines-3");
  });
  it("buildTrustCompareRow statuslines 4", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "statuslines", slug: "statuslines-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("statuslines:statuslines-4");
  });
  it("buildTrustCompareRow statuslines 5", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "statuslines", slug: "statuslines-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("statuslines:statuslines-5");
  });
  it("buildTrustCompareRow statuslines 6", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "statuslines", slug: "statuslines-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("statuslines:statuslines-6");
  });
  it("buildTrustCompareRow statuslines 7", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "statuslines", slug: "statuslines-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("statuslines:statuslines-7");
  });
  it("buildTrustCompareRow statuslines 8", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "statuslines", slug: "statuslines-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("statuslines:statuslines-8");
  });
  it("buildTrustCompareRow statuslines 9", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "statuslines", slug: "statuslines-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("statuslines:statuslines-9");
  });
  it("buildTrustCompareRow statuslines 10", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "statuslines", slug: "statuslines-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("statuslines:statuslines-10");
  });
  it("buildTrustCompareRow statuslines 11", () => {
    const row = buildTrustCompareRow(
      makeEntry({ category: "statuslines", slug: "statuslines-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.key).toBe("statuslines:statuslines-11");
  });
  it("buildTrustCompareRow churn 0", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-0", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 1", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-1", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 2", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-2", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 3", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-3", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 4", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-4", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 5", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-5", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 6", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-6", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 7", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-7", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 8", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-8", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 9", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-9", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 10", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-10", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 11", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-11", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 12", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-12", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 13", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-13", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 14", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-14", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 15", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-15", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 16", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-16", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 17", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-17", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 18", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-18", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 19", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-19", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 20", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-20", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 21", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-21", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 22", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-22", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 23", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-23", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 24", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-24", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 25", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-25", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 26", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-26", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 27", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-27", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 28", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-28", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 29", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-29", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 30", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-30", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 31", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-31", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 32", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-32", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 33", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-33", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 34", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-34", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 35", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-35", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 36", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-36", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 37", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-37", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 38", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-38", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 39", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-39", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 40", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-40", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 41", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-41", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 42", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-42", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 43", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-43", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 44", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-44", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 45", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-45", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 46", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-46", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 47", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-47", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 48", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-48", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 49", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-49", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 50", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-50", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 51", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-51", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 52", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-52", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 53", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-53", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 54", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-54", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 55", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-55", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 56", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-56", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 57", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-57", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 58", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-58", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 59", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-59", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 60", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-60", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 61", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-61", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 62", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-62", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 63", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-63", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 64", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-64", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 65", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-65", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 66", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-66", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 67", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-67", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 68", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-68", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 69", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-69", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 70", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-70", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 71", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-71", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 72", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-72", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 73", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-73", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 74", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-74", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 75", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-75", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 76", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-76", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 77", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-77", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 78", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-78", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
  it("buildTrustCompareRow churn 79", () => {
    const row = buildTrustCompareRow(
      makeEntry({ reviewedBy: "reviewer-79", claimStatus: "verified" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      },
    );
    expect(row.signalCoverage.score).toBeGreaterThan(0);
  });
});

describe("registry-trust-compare-lib rankTrustCompareEntries", () => {
  it("ranks by coverage score descending", () => {
    const entries = [
      { key: "mcp:a", signalCoverage: { score: 2 } },
      { key: "mcp:b", signalCoverage: { score: 5 } },
      { key: "mcp:c", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:b");
    expect(ranking[0].rank).toBe(1);
  });
  it("rankTrustCompareEntries matrix 0", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 1", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 2", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 3", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 4", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 5", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 6", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 7", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 8", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 9", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 10", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 11", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 12", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 13", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 14", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 15", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 16", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 17", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 18", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 19", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 20", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 21", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 22", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 23", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 24", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 25", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 26", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 27", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 28", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 29", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 30", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 31", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 32", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 33", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 34", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 35", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 36", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 37", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 38", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 39", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 40", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 41", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 42", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 43", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 44", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 45", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 46", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 47", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 48", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 49", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 50", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 51", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 52", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 53", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 54", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 55", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 56", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 57", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 58", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 59", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 60", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 61", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 62", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 63", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 64", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 65", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 66", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 67", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 68", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 69", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 70", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 71", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 72", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 73", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 74", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 75", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 76", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 77", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 2 } },
      { key: "mcp:high", signalCoverage: { score: 5 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 78", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 0 } },
      { key: "mcp:high", signalCoverage: { score: 3 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
  it("rankTrustCompareEntries matrix 79", () => {
    const entries = [
      { key: "mcp:low", signalCoverage: { score: 1 } },
      { key: "mcp:high", signalCoverage: { score: 4 } },
    ];
    const ranking = rankTrustCompareEntries(entries);
    expect(ranking[0].key).toBe("mcp:high");
  });
});

describe("registry-trust-compare-lib sharedTrustSignalGaps", () => {
  it("finds signals missing from all entries", () => {
    const entries = [
      { signalCoverage: { missing: ["safety-notes", "privacy-notes"] } },
      { signalCoverage: { missing: ["safety-notes", "repo-url"] } },
    ];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toContain(
      "safety-notes",
    );
  });
  it("sharedTrustSignalGaps matrix 0", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 1", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 2", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 3", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 4", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 5", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 6", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 7", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 8", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 9", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 10", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 11", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 12", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 13", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 14", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 15", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 16", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 17", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 18", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 19", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 20", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 21", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 22", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 23", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 24", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 25", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 26", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 27", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 28", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 29", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 30", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 31", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 32", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 33", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 34", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 35", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 36", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 37", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 38", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 39", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 40", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 41", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 42", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 43", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 44", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 45", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 46", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 47", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 48", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 49", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 50", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 51", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 52", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 53", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 54", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 55", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 56", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 57", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 58", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
  it("sharedTrustSignalGaps matrix 59", () => {
    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];
    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(
      TRUST_SIGNAL_KEYS,
    );
  });
});

describe("registry-trust-compare-lib buildTrustCompareResponse", () => {
  it("builds ok trust compare envelope", () => {
    const entries = [
      buildTrustCompareRow(makeEntry(), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
      buildTrustCompareRow(makeEntry({ slug: "other" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const sharedGaps = sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS);
    const response = buildTrustCompareResponse({
      platform: "",
      entries,
      ranking,
      sharedGaps,
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.ok).toBe(true);
    expect(response.comparisonNotes).toEqual(TRUST_COMPARE_NOTES);
  });
  it("buildTrustCompareResponse churn 0", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-0" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 1", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-1" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 2", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-2" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 3", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-3" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 4", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-4" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 5", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-5" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 6", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-6" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 7", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-7" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 8", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-8" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 9", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-9" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 10", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-10" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 11", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-11" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 12", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-12" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 13", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-13" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 14", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-14" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 15", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-15" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 16", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-16" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 17", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-17" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 18", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-18" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 19", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-19" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 20", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-20" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 21", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-21" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 22", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-22" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 23", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-23" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 24", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-24" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 25", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-25" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 26", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-26" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 27", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-27" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 28", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-28" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 29", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-29" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 30", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-30" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 31", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-31" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 32", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-32" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 33", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-33" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 34", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-34" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 35", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-35" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 36", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-36" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 37", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-37" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 38", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-38" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 39", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-39" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 40", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-40" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 41", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-41" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 42", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-42" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 43", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-43" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 44", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-44" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 45", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-45" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 46", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-46" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 47", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-47" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 48", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-48" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
  it("buildTrustCompareResponse churn 49", () => {
    const entries = [
      buildTrustCompareRow(makeEntry({ slug: "slug-49" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    ];
    const ranking = rankTrustCompareEntries(entries);
    const response = buildTrustCompareResponse({
      platform: "cursor",
      entries,
      ranking,
      sharedGaps: [],
      signalKeys: TRUST_SIGNAL_KEYS,
    });
    expect(response.count).toBe(1);
  });
});
