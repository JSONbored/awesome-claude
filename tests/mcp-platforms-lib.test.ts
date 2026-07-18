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
  it("returns empty compatibility for mcp entries without install metadata", () => {
    expect(buildSkillPlatformCompatibility({ category: "mcp" })).toEqual([]);
    expect(buildSkillPlatformCompatibility({ category: "agents" })).toEqual([]);
  });

  it("builds MCP install-target compatibility from config snippets", () => {
    const compatibility = buildSkillPlatformCompatibility({
      category: "mcp",
      slug: "demo-server",
      configSnippet: JSON.stringify({
        mcpServers: {
          demo: {
            command: "npx",
            args: ["-y", "@example/demo-mcp"],
          },
        },
      }),
    });

    expect(compatibility.map((item) => item.platform)).toEqual([
      "Claude Code",
      "Codex",
      "Cursor",
      "Antigravity",
    ]);
    expect(compatibility[0]).toMatchObject({
      platform: "Claude Code",
      support: "native-mcp",
      artifact: "MCP server config",
    });
    expect(compatibility[2]).toMatchObject({
      platform: "Cursor",
      support: "mcp-config",
    });
  });

  it("excludes codex for sse configs while preserving explicit MCP metadata", () => {
    const sseCompatibility = buildSkillPlatformCompatibility({
      category: "mcp",
      slug: "sse-server",
      configSnippet: JSON.stringify({
        mcpServers: {
          sse: {
            type: "sse",
            url: "https://example.com/sse",
          },
        },
      }),
    });
    expect(sseCompatibility.map((item) => item.platform)).toEqual([
      "Claude Code",
      "Cursor",
      "Antigravity",
    ]);

    const explicit = [
      {
        platform: "Custom MCP",
        support: "manual",
        artifact: "custom",
        installHint: "Use the custom installer.",
      },
    ];
    expect(
      buildSkillPlatformCompatibility({
        category: "mcp",
        platformCompatibility: explicit,
      }),
    ).toBe(explicit);
  });

  it("builds default skill compatibility while preserving explicit metadata", () => {
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
