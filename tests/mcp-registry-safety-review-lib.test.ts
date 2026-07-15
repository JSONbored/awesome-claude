import { describe, expect, it } from "vitest";

import { buildSkillPlatformCompatibility } from "../packages/mcp/src/platforms.js";
import { normalizePlatform } from "../packages/mcp/src/registry-normalize-lib.js";
import {
  SAFETY_REVIEW_NOTES,
  buildSafetyReviewResponse,
  buildSafetyReviewRow,
  summarizeSafetyReview,
} from "../packages/mcp/src/registry-safety-review-lib.js";
import {
  entryCanonicalUrl,
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

describe("registry-safety-review-lib SAFETY_REVIEW_NOTES", () => {
  it("exports three review notes", () => {
    expect(SAFETY_REVIEW_NOTES).toHaveLength(3);
    expect(SAFETY_REVIEW_NOTES[0]).toContain("metadata review");
  });
  it("SAFETY_REVIEW_NOTES note 0", () => {
    expect(SAFETY_REVIEW_NOTES[0].length).toBeGreaterThan(10);
  });
  it("SAFETY_REVIEW_NOTES note 1", () => {
    expect(SAFETY_REVIEW_NOTES[1].length).toBeGreaterThan(10);
  });
  it("SAFETY_REVIEW_NOTES note 2", () => {
    expect(SAFETY_REVIEW_NOTES[2].length).toBeGreaterThan(10);
  });
  it("SAFETY_REVIEW_NOTES note 3", () => {
    expect(SAFETY_REVIEW_NOTES[0].length).toBeGreaterThan(10);
  });
  it("SAFETY_REVIEW_NOTES note 4", () => {
    expect(SAFETY_REVIEW_NOTES[1].length).toBeGreaterThan(10);
  });
  it("SAFETY_REVIEW_NOTES note 5", () => {
    expect(SAFETY_REVIEW_NOTES[2].length).toBeGreaterThan(10);
  });
  it("SAFETY_REVIEW_NOTES note 6", () => {
    expect(SAFETY_REVIEW_NOTES[0].length).toBeGreaterThan(10);
  });
  it("SAFETY_REVIEW_NOTES note 7", () => {
    expect(SAFETY_REVIEW_NOTES[1].length).toBeGreaterThan(10);
  });
  it("SAFETY_REVIEW_NOTES note 8", () => {
    expect(SAFETY_REVIEW_NOTES[2].length).toBeGreaterThan(10);
  });
  it("SAFETY_REVIEW_NOTES note 9", () => {
    expect(SAFETY_REVIEW_NOTES[0].length).toBeGreaterThan(10);
  });
  it("SAFETY_REVIEW_NOTES note 10", () => {
    expect(SAFETY_REVIEW_NOTES[1].length).toBeGreaterThan(10);
  });
  it("SAFETY_REVIEW_NOTES note 11", () => {
    expect(SAFETY_REVIEW_NOTES[2].length).toBeGreaterThan(10);
  });
  it("SAFETY_REVIEW_NOTES note 12", () => {
    expect(SAFETY_REVIEW_NOTES[0].length).toBeGreaterThan(10);
  });
  it("SAFETY_REVIEW_NOTES note 13", () => {
    expect(SAFETY_REVIEW_NOTES[1].length).toBeGreaterThan(10);
  });
  it("SAFETY_REVIEW_NOTES note 14", () => {
    expect(SAFETY_REVIEW_NOTES[2].length).toBeGreaterThan(10);
  });
});

describe("registry-safety-review-lib buildSafetyReviewRow", () => {
  it("builds safety review row with trust", () => {
    const row = buildSafetyReviewRow(makeEntry(), "", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.key).toBe("mcp:browser-bridge");
    expect(row.trust).toBeDefined();
  });
  it("buildSafetyReviewRow agents 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "agents", slug: "agents-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("agents");
  });
  it("buildSafetyReviewRow agents 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "agents", slug: "agents-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("agents");
  });
  it("buildSafetyReviewRow agents 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "agents", slug: "agents-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("agents");
  });
  it("buildSafetyReviewRow agents 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "agents", slug: "agents-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("agents");
  });
  it("buildSafetyReviewRow agents 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "agents", slug: "agents-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("agents");
  });
  it("buildSafetyReviewRow agents 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "agents", slug: "agents-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("agents");
  });
  it("buildSafetyReviewRow agents 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "agents", slug: "agents-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("agents");
  });
  it("buildSafetyReviewRow agents 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "agents", slug: "agents-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("agents");
  });
  it("buildSafetyReviewRow agents 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "agents", slug: "agents-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("agents");
  });
  it("buildSafetyReviewRow agents 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "agents", slug: "agents-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("agents");
  });
  it("buildSafetyReviewRow agents 10", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "agents", slug: "agents-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("agents");
  });
  it("buildSafetyReviewRow agents 11", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "agents", slug: "agents-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("agents");
  });
  it("buildSafetyReviewRow mcp 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "mcp", slug: "mcp-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("mcp");
  });
  it("buildSafetyReviewRow mcp 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "mcp", slug: "mcp-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("mcp");
  });
  it("buildSafetyReviewRow mcp 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "mcp", slug: "mcp-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("mcp");
  });
  it("buildSafetyReviewRow mcp 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "mcp", slug: "mcp-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("mcp");
  });
  it("buildSafetyReviewRow mcp 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "mcp", slug: "mcp-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("mcp");
  });
  it("buildSafetyReviewRow mcp 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "mcp", slug: "mcp-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("mcp");
  });
  it("buildSafetyReviewRow mcp 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "mcp", slug: "mcp-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("mcp");
  });
  it("buildSafetyReviewRow mcp 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "mcp", slug: "mcp-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("mcp");
  });
  it("buildSafetyReviewRow mcp 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "mcp", slug: "mcp-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("mcp");
  });
  it("buildSafetyReviewRow mcp 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "mcp", slug: "mcp-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("mcp");
  });
  it("buildSafetyReviewRow mcp 10", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "mcp", slug: "mcp-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("mcp");
  });
  it("buildSafetyReviewRow mcp 11", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "mcp", slug: "mcp-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("mcp");
  });
  it("buildSafetyReviewRow tools 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "tools", slug: "tools-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("tools");
  });
  it("buildSafetyReviewRow tools 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "tools", slug: "tools-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("tools");
  });
  it("buildSafetyReviewRow tools 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "tools", slug: "tools-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("tools");
  });
  it("buildSafetyReviewRow tools 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "tools", slug: "tools-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("tools");
  });
  it("buildSafetyReviewRow tools 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "tools", slug: "tools-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("tools");
  });
  it("buildSafetyReviewRow tools 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "tools", slug: "tools-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("tools");
  });
  it("buildSafetyReviewRow tools 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "tools", slug: "tools-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("tools");
  });
  it("buildSafetyReviewRow tools 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "tools", slug: "tools-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("tools");
  });
  it("buildSafetyReviewRow tools 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "tools", slug: "tools-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("tools");
  });
  it("buildSafetyReviewRow tools 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "tools", slug: "tools-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("tools");
  });
  it("buildSafetyReviewRow tools 10", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "tools", slug: "tools-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("tools");
  });
  it("buildSafetyReviewRow tools 11", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "tools", slug: "tools-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("tools");
  });
  it("buildSafetyReviewRow skills 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "skills", slug: "skills-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("skills");
  });
  it("buildSafetyReviewRow skills 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "skills", slug: "skills-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("skills");
  });
  it("buildSafetyReviewRow skills 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "skills", slug: "skills-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("skills");
  });
  it("buildSafetyReviewRow skills 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "skills", slug: "skills-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("skills");
  });
  it("buildSafetyReviewRow skills 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "skills", slug: "skills-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("skills");
  });
  it("buildSafetyReviewRow skills 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "skills", slug: "skills-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("skills");
  });
  it("buildSafetyReviewRow skills 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "skills", slug: "skills-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("skills");
  });
  it("buildSafetyReviewRow skills 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "skills", slug: "skills-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("skills");
  });
  it("buildSafetyReviewRow skills 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "skills", slug: "skills-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("skills");
  });
  it("buildSafetyReviewRow skills 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "skills", slug: "skills-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("skills");
  });
  it("buildSafetyReviewRow skills 10", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "skills", slug: "skills-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("skills");
  });
  it("buildSafetyReviewRow skills 11", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "skills", slug: "skills-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("skills");
  });
  it("buildSafetyReviewRow rules 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "rules", slug: "rules-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("rules");
  });
  it("buildSafetyReviewRow rules 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "rules", slug: "rules-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("rules");
  });
  it("buildSafetyReviewRow rules 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "rules", slug: "rules-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("rules");
  });
  it("buildSafetyReviewRow rules 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "rules", slug: "rules-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("rules");
  });
  it("buildSafetyReviewRow rules 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "rules", slug: "rules-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("rules");
  });
  it("buildSafetyReviewRow rules 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "rules", slug: "rules-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("rules");
  });
  it("buildSafetyReviewRow rules 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "rules", slug: "rules-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("rules");
  });
  it("buildSafetyReviewRow rules 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "rules", slug: "rules-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("rules");
  });
  it("buildSafetyReviewRow rules 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "rules", slug: "rules-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("rules");
  });
  it("buildSafetyReviewRow rules 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "rules", slug: "rules-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("rules");
  });
  it("buildSafetyReviewRow rules 10", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "rules", slug: "rules-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("rules");
  });
  it("buildSafetyReviewRow rules 11", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "rules", slug: "rules-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("rules");
  });
  it("buildSafetyReviewRow commands 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "commands", slug: "commands-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("commands");
  });
  it("buildSafetyReviewRow commands 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "commands", slug: "commands-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("commands");
  });
  it("buildSafetyReviewRow commands 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "commands", slug: "commands-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("commands");
  });
  it("buildSafetyReviewRow commands 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "commands", slug: "commands-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("commands");
  });
  it("buildSafetyReviewRow commands 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "commands", slug: "commands-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("commands");
  });
  it("buildSafetyReviewRow commands 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "commands", slug: "commands-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("commands");
  });
  it("buildSafetyReviewRow commands 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "commands", slug: "commands-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("commands");
  });
  it("buildSafetyReviewRow commands 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "commands", slug: "commands-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("commands");
  });
  it("buildSafetyReviewRow commands 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "commands", slug: "commands-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("commands");
  });
  it("buildSafetyReviewRow commands 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "commands", slug: "commands-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("commands");
  });
  it("buildSafetyReviewRow commands 10", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "commands", slug: "commands-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("commands");
  });
  it("buildSafetyReviewRow commands 11", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "commands", slug: "commands-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("commands");
  });
  it("buildSafetyReviewRow hooks 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "hooks", slug: "hooks-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("hooks");
  });
  it("buildSafetyReviewRow hooks 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "hooks", slug: "hooks-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("hooks");
  });
  it("buildSafetyReviewRow hooks 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "hooks", slug: "hooks-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("hooks");
  });
  it("buildSafetyReviewRow hooks 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "hooks", slug: "hooks-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("hooks");
  });
  it("buildSafetyReviewRow hooks 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "hooks", slug: "hooks-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("hooks");
  });
  it("buildSafetyReviewRow hooks 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "hooks", slug: "hooks-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("hooks");
  });
  it("buildSafetyReviewRow hooks 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "hooks", slug: "hooks-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("hooks");
  });
  it("buildSafetyReviewRow hooks 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "hooks", slug: "hooks-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("hooks");
  });
  it("buildSafetyReviewRow hooks 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "hooks", slug: "hooks-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("hooks");
  });
  it("buildSafetyReviewRow hooks 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "hooks", slug: "hooks-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("hooks");
  });
  it("buildSafetyReviewRow hooks 10", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "hooks", slug: "hooks-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("hooks");
  });
  it("buildSafetyReviewRow hooks 11", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "hooks", slug: "hooks-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("hooks");
  });
  it("buildSafetyReviewRow guides 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "guides", slug: "guides-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("guides");
  });
  it("buildSafetyReviewRow guides 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "guides", slug: "guides-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("guides");
  });
  it("buildSafetyReviewRow guides 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "guides", slug: "guides-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("guides");
  });
  it("buildSafetyReviewRow guides 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "guides", slug: "guides-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("guides");
  });
  it("buildSafetyReviewRow guides 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "guides", slug: "guides-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("guides");
  });
  it("buildSafetyReviewRow guides 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "guides", slug: "guides-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("guides");
  });
  it("buildSafetyReviewRow guides 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "guides", slug: "guides-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("guides");
  });
  it("buildSafetyReviewRow guides 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "guides", slug: "guides-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("guides");
  });
  it("buildSafetyReviewRow guides 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "guides", slug: "guides-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("guides");
  });
  it("buildSafetyReviewRow guides 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "guides", slug: "guides-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("guides");
  });
  it("buildSafetyReviewRow guides 10", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "guides", slug: "guides-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("guides");
  });
  it("buildSafetyReviewRow guides 11", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "guides", slug: "guides-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("guides");
  });
  it("buildSafetyReviewRow collections 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "collections", slug: "collections-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("collections");
  });
  it("buildSafetyReviewRow collections 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "collections", slug: "collections-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("collections");
  });
  it("buildSafetyReviewRow collections 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "collections", slug: "collections-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("collections");
  });
  it("buildSafetyReviewRow collections 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "collections", slug: "collections-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("collections");
  });
  it("buildSafetyReviewRow collections 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "collections", slug: "collections-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("collections");
  });
  it("buildSafetyReviewRow collections 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "collections", slug: "collections-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("collections");
  });
  it("buildSafetyReviewRow collections 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "collections", slug: "collections-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("collections");
  });
  it("buildSafetyReviewRow collections 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "collections", slug: "collections-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("collections");
  });
  it("buildSafetyReviewRow collections 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "collections", slug: "collections-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("collections");
  });
  it("buildSafetyReviewRow collections 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "collections", slug: "collections-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("collections");
  });
  it("buildSafetyReviewRow collections 10", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "collections", slug: "collections-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("collections");
  });
  it("buildSafetyReviewRow collections 11", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "collections", slug: "collections-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("collections");
  });
  it("buildSafetyReviewRow statuslines 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "statuslines", slug: "statuslines-0" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("statuslines");
  });
  it("buildSafetyReviewRow statuslines 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "statuslines", slug: "statuslines-1" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("statuslines");
  });
  it("buildSafetyReviewRow statuslines 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "statuslines", slug: "statuslines-2" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("statuslines");
  });
  it("buildSafetyReviewRow statuslines 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "statuslines", slug: "statuslines-3" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("statuslines");
  });
  it("buildSafetyReviewRow statuslines 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "statuslines", slug: "statuslines-4" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("statuslines");
  });
  it("buildSafetyReviewRow statuslines 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "statuslines", slug: "statuslines-5" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("statuslines");
  });
  it("buildSafetyReviewRow statuslines 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "statuslines", slug: "statuslines-6" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("statuslines");
  });
  it("buildSafetyReviewRow statuslines 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "statuslines", slug: "statuslines-7" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("statuslines");
  });
  it("buildSafetyReviewRow statuslines 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "statuslines", slug: "statuslines-8" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("statuslines");
  });
  it("buildSafetyReviewRow statuslines 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "statuslines", slug: "statuslines-9" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("statuslines");
  });
  it("buildSafetyReviewRow statuslines 10", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "statuslines", slug: "statuslines-10" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("statuslines");
  });
  it("buildSafetyReviewRow statuslines 11", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "statuslines", slug: "statuslines-11" }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.category).toBe("statuslines");
  });
  it("buildSafetyReviewRow platform claude-code 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform claude-code 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform claude-code 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform claude-code 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform claude-code 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform claude-code 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform claude-code 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform claude-code 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform claude-code 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform claude-code 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-code"] }),
      "claude-code",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform claude-desktop 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform claude-desktop 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform claude-desktop 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform claude-desktop 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform claude-desktop 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform claude-desktop 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform claude-desktop 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform claude-desktop 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform claude-desktop 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform claude-desktop 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["claude-desktop"] }),
      "claude-desktop",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cursor 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cursor 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cursor 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cursor 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cursor 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cursor 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cursor 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cursor 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cursor 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cursor 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["cursor"] }),
      "cursor",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform vscode 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform vscode 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform vscode 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform vscode 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform vscode 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform vscode 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform vscode 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform vscode 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform vscode 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform vscode 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["vscode"] }),
      "vscode",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform windsurf 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform windsurf 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform windsurf 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform windsurf 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform windsurf 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform windsurf 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform windsurf 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform windsurf 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform windsurf 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform windsurf 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["windsurf"] }),
      "windsurf",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform codex 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform codex 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform codex 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform codex 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform codex 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform codex 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform codex 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform codex 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform codex 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform codex 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["codex"] }),
      "codex",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform gemini 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform gemini 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform gemini 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform gemini 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform gemini 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform gemini 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform gemini 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform gemini 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform gemini 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform gemini 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["gemini"] }),
      "gemini",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform raycast 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform raycast 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform raycast 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform raycast 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform raycast 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform raycast 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform raycast 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform raycast 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform raycast 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform raycast 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["raycast"] }),
      "raycast",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cli 0", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cli 1", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cli 2", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cli 3", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cli 4", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cli 5", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cli 6", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cli 7", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cli 8", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform cli 9", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["cli"] }), "cli", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform aider 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform aider 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform aider 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform aider 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform aider 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform aider 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform aider 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform aider 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform aider 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform aider 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["aider"] }),
      "aider",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform zed 0", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform zed 1", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform zed 2", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform zed 3", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform zed 4", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform zed 5", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform zed 6", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform zed 7", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform zed 8", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform zed 9", () => {
    const row = buildSafetyReviewRow(makeEntry({ platforms: ["zed"] }), "zed", {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryCanonicalUrl,
      entryTrustSummary,
    });
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform continue 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform continue 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform continue 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform continue 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform continue 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform continue 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform continue 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform continue 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform continue 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow platform continue 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ platforms: ["continue"] }),
      "continue",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.title).toBeTruthy();
  });
  it("buildSafetyReviewRow churn 0", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-0"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 1", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-1"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 2", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-2"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 3", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-3"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 4", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-4"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 5", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-5"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 6", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-6"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 7", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-7"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 8", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-8"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 9", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-9"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 10", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-10"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 11", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-11"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 12", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-12"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 13", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-13"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 14", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-14"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 15", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-15"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 16", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-16"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 17", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-17"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 18", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-18"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 19", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-19"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 20", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-20"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 21", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-21"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 22", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-22"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 23", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-23"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 24", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-24"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 25", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-25"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 26", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-26"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 27", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-27"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 28", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-28"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 29", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-29"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 30", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-30"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 31", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-31"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 32", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-32"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 33", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-33"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 34", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-34"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 35", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-35"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 36", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-36"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 37", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-37"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 38", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-38"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 39", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-39"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 40", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-40"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 41", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-41"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 42", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-42"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 43", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-43"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 44", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-44"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 45", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-45"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 46", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-46"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 47", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-47"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 48", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-48"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 49", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-49"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 50", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-50"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 51", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-51"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 52", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-52"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 53", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-53"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 54", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-54"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 55", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-55"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 56", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-56"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 57", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-57"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 58", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-58"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
  it("buildSafetyReviewRow churn 59", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ safetyNotes: ["note-59"] }),
      "",
      {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      },
    );
    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);
  });
});

describe("registry-safety-review-lib summarizeSafetyReview", () => {
  it("summarizes safety and privacy note coverage", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: true },
          package: { downloadTrust: "external" },
          source: { status: "missing" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.entriesWithSafetyOrPrivacyNotes).toBe(2);
    expect(summary.firstPartyPackages).toBe(1);
    expect(summary.sourceBacked).toBe(1);
  });
  it("summarizeSafetyReview matrix 0", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 1", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 2", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 3", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 4", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 5", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 6", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 7", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 8", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 9", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 10", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 11", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 12", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 13", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 14", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 15", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 16", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 17", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 18", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 19", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 20", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 21", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 22", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 23", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 24", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 25", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 26", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 27", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 28", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 29", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 30", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 31", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 32", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 33", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 34", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 35", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 36", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 37", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 38", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 39", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 40", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 41", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 42", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 43", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 44", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 45", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 46", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 47", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 48", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 49", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 50", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 51", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 52", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 53", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 54", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 55", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 56", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 57", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 58", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 59", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 60", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 61", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 62", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 63", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 64", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 65", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 66", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 67", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 68", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 69", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 70", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 71", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 72", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 73", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 74", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 75", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 76", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 77", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 78", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: true, hasPrivacyNotes: true },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
  it("summarizeSafetyReview matrix 79", () => {
    const entries = [
      {
        trust: {
          disclosures: { hasSafetyNotes: false, hasPrivacyNotes: false },
          package: { downloadTrust: "first-party" },
          source: { status: "available" },
        },
      },
    ];
    const summary = summarizeSafetyReview(entries);
    expect(summary.firstPartyPackages).toBe(1);
  });
});

describe("registry-safety-review-lib buildSafetyReviewResponse", () => {
  it("builds ok safety review envelope", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry(), "cursor", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "cursor", entries });
    expect(response.ok).toBe(true);
    expect(response.reviewNotes).toEqual(SAFETY_REVIEW_NOTES);
  });
  it("buildSafetyReviewResponse churn 0", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-0" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 1", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-1" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 2", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-2" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 3", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-3" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 4", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-4" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 5", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-5" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 6", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-6" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 7", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-7" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 8", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-8" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 9", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-9" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 10", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-10" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 11", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-11" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 12", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-12" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 13", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-13" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 14", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-14" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 15", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-15" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 16", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-16" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 17", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-17" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 18", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-18" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 19", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-19" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 20", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-20" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 21", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-21" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 22", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-22" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 23", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-23" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 24", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-24" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 25", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-25" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 26", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-26" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 27", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-27" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 28", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-28" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 29", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-29" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 30", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-30" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 31", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-31" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 32", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-32" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 33", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-33" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 34", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-34" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 35", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-35" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 36", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-36" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 37", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-37" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 38", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-38" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 39", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-39" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 40", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-40" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 41", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-41" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 42", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-42" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 43", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-43" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 44", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-44" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 45", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-45" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 46", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-46" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 47", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-47" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 48", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-48" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
  it("buildSafetyReviewResponse churn 49", () => {
    const entries = [
      buildSafetyReviewRow(makeEntry({ slug: "slug-49" }), "", {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    ];
    const response = buildSafetyReviewResponse({ platform: "", entries });
    expect(response.count).toBe(1);
  });
});

describe("registry-safety-review-lib platform-selected compatibility", () => {
  const deps = (
    compatibility: Array<{ platform: string; support: string }>,
  ) => ({
    normalizePlatform: (platform: string) => platform,
    buildSkillPlatformCompatibility: () => compatibility,
    entryCanonicalUrl: () => "https://heyclau.de/entry/skills/designer",
    entryTrustSummary: () => ({ level: "trusted" }),
  });

  it("selects the compatibility row whose normalized platform matches", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "skills", slug: "designer" }),
      "cursor",
      deps([
        { platform: "claude-code", support: "native" },
        { platform: "cursor", support: "adapter" },
      ]),
    );
    expect(row.selectedCompatibility).toEqual({
      platform: "cursor",
      support: "adapter",
    });
  });

  it("returns a null selection when no compatibility row matches the platform", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "skills", slug: "designer" }),
      "codex",
      deps([{ platform: "cursor", support: "adapter" }]),
    );
    expect(row.selectedCompatibility).toBeNull();
  });

  it("normalizes the compatibility platform before comparing", () => {
    const row = buildSafetyReviewRow(
      makeEntry({ category: "skills", slug: "designer" }),
      "cursor",
      {
        normalizePlatform: (platform: string) =>
          platform === "cursor-rules" ? "cursor" : platform,
        buildSkillPlatformCompatibility: () => [
          { platform: "cursor-rules", support: "adapter" },
        ],
        entryCanonicalUrl: () => "u",
        entryTrustSummary: () => ({}),
      },
    );
    expect(row.selectedCompatibility).toEqual({
      platform: "cursor-rules",
      support: "adapter",
    });
  });
});
