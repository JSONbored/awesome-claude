import { describe, expect, it } from "vitest";

import {
  buildSkillPlatformCompatibility,
  platformFeedSlug,
} from "../packages/mcp/src/platforms.js";

describe("MCP platform helpers", () => {
  it("normalizes platform feed slugs with ampersand expansion and separators", () => {
    expect(platformFeedSlug("Claude & Cursor")).toBe("claude-and-cursor");
    expect(platformFeedSlug(" Claude---Code!! ")).toBe("claude-code");
    expect(platformFeedSlug("")).toBe("");
  });

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
