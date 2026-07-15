import { describe, expect, it } from "vitest";

import {
  SITE_URL,
  buildSkillPlatformCompatibility,
  platformFeedSlug,
} from "../packages/mcp/src/platforms-lib.js";
import {
  SITE_URL as siteUrlFromWrapper,
  buildSkillPlatformCompatibility as buildCompatibilityFromWrapper,
  platformFeedSlug as platformFeedSlugFromWrapper,
} from "../packages/mcp/src/platforms.js";

describe("platforms-lib feed slugs", () => {
  it("normalizes platform feed slugs with ampersand expansion and separators", () => {
    expect(platformFeedSlug("Claude & Cursor")).toBe("claude-and-cursor");
    expect(platformFeedSlug(" Claude---Code!! ")).toBe("claude-code");
    expect(platformFeedSlug("")).toBe("");
  });
});

describe("platforms-lib skill compatibility", () => {
  it("builds default skill compatibility while preserving explicit metadata", () => {
    expect(buildSkillPlatformCompatibility({ category: "mcp" })).toEqual([]);

    const explicit = [
      {
        platform: "Custom",
        support: "native-skill",
        artifact: "custom",
        installHint: "Use the custom installer.",
      },
    ];
    expect(
      buildSkillPlatformCompatibility({
        category: "skills",
        platformCompatibility: explicit,
      }),
    ).toBe(explicit);

    const compatibility = buildSkillPlatformCompatibility({
      category: "skills",
      slug: "branch-matrix",
    });
    expect(compatibility.map((item) => item.platform)).toEqual([
      "Claude",
      "Codex",
      "Windsurf",
      "Gemini",
      "Cursor",
      "Generic AGENTS",
    ]);
    expect(
      compatibility.find((item) => item.platform === "Cursor"),
    ).toMatchObject({
      support: "adapter",
      artifact: ".cursor/rules/branch-matrix.mdc",
      adapterUrl: "/data/skill-adapters/cursor/branch-matrix.mdc",
    });
  });
});

describe("platforms re-export compatibility", () => {
  it("keeps the public wrapper wired to the extracted lib", () => {
    expect(siteUrlFromWrapper).toBe(SITE_URL);
    expect(platformFeedSlugFromWrapper).toBe(platformFeedSlug);
    expect(buildCompatibilityFromWrapper).toBe(buildSkillPlatformCompatibility);
  });
});

describe("platforms-lib slug and compatibility edge cases", () => {
  it("keeps digits and joins ampersands adjacent to alphanumerics", () => {
    expect(platformFeedSlug("a1&b2")).toBe("a1-andb2");
    expect(platformFeedSlug("Claude 2 & Code 3")).toBe("claude-2-and-code-3");
  });

  it("builds default skill compatibility for a skills entry without a slug", () => {
    const compatibility = buildSkillPlatformCompatibility({
      category: "skills",
    });
    expect(compatibility.length).toBeGreaterThan(0);
    expect(compatibility[0].platform).toBe("Claude");
  });
});
