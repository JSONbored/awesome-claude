import { describe, expect, it } from "vitest";
import path from "node:path";

import {
  buildCollectionSequence,
  compactCount,
  extractConfigCommand,
  firstUsefulLine,
  getCopyText,
  getDistributionBadges,
  getEntryAccessSummary,
  getPreviewLine,
  parseAbbreviatedCount,
} from "../packages/registry/src/presentation.js";
import {
  buildContentEntryFromMdx,
  buildGitHubUrl,
  isFirstPartyPackage,
  isLocalDownloadUrl,
  localDownloadSourcePath,
  normalizeDateAdded,
  normalizeDownloadUrl,
  parseGitHubRepo,
} from "../packages/registry/src/content-builder.js";

const repoRoot = path.join(process.cwd(), "repo");
const contentRoot = path.join(repoRoot, "content");

describe("registry presentation helpers", () => {
  it("formats compact counts and extracts useful command lines", () => {
    expect(compactCount(999)).toBe("999");
    expect(compactCount(1_250)).toBe("1.3k");
    expect(compactCount(12_500)).toBe("13k");
    expect(parseAbbreviatedCount("1.5k")).toBe(1500);
    expect(parseAbbreviatedCount("2m")).toBe(2_000_000);
    expect(parseAbbreviatedCount("bad")).toBeNull();
    expect(
      firstUsefulLine(
        ["# Title", "```json", "{", "  npx example", "```"].join("\n"),
      ),
    ).toBe("npx example");
    expect(extractConfigCommand('{ "command": "npx", "args": ["demo"] }')).toBe(
      "npx",
    );
    expect(extractConfigCommand("claude mcp add demo")).toBe(
      "claude mcp add demo",
    );
  });

  it("builds category-specific preview lines", () => {
    expect(
      getPreviewLine({
        category: "agents",
        body: "# Agent\n\nYou are a careful reviewer.",
      }),
    ).toBe("You are a careful reviewer.");
    expect(
      getPreviewLine({
        category: "hooks",
        configSnippet: '{ "command": "node" }',
      }),
    ).toBe("node");
    expect(
      getPreviewLine({
        category: "statuslines",
        usageSnippet: "Run the statusline script",
      }),
    ).toBe("Run the statusline script");
    expect(
      getPreviewLine({
        category: "collections",
        items: [
          { category: "agents", slug: "reviewer" },
          { category: "mcp", slug: "postgres" },
          { category: "skills", slug: "planner" },
          { category: "rules", slug: "extra" },
        ],
      }),
    ).toBe("Start with `reviewer` -> `postgres` -> `planner`");
    expect(
      getPreviewLine({
        category: "mcp",
        installCommand: "claude mcp add demo -- npx demo",
      }),
    ).toBe("claude mcp add demo -- npx demo");
    expect(
      getPreviewLine({
        category: "tools",
        documentationUrl: "https://docs.example",
      }),
    ).toBe("See docs for setup");
    expect(
      getPreviewLine({
        category: "tools",
        githubUrl: "https://github.com/example/tool",
      }),
    ).toBe("See GitHub for instructions");
  });

  it("builds copy text and distribution badges across entry categories", () => {
    expect(getCopyText({ category: "agents", body: "Full prompt" })).toBe(
      "Full prompt",
    );
    expect(
      getCopyText({
        category: "hooks",
        trigger: "PreToolUse",
        installCommand: "npm i hook",
        configSnippet: "{}",
        scriptBody: "echo hook",
      }),
    ).toContain("Hook script:");
    expect(
      getCopyText({
        category: "mcp",
        title: "Demo MCP",
        installCommand: "claude mcp add demo",
        configSnippet: "{}",
        usageSnippet: "Ask Claude to use demo.",
      }),
    ).toContain("Install:");
    expect(
      getCopyText({
        category: "commands",
        commandSyntax: "/demo",
        copySnippet: "Run /demo",
      }),
    ).toContain("Command:");
    expect(
      getCopyText({
        category: "collections",
        description: "Collection",
        items: [{ category: "mcp", slug: "postgres" }],
      }),
    ).toContain("Included items:");
    expect(
      getCopyText({
        category: "tools",
        title: "Tool",
        categoryLabel: "Tool",
        slug: "demo-tool",
      }),
    ).toContain("https://heyclau.de/entry/tools/demo-tool");

    const badges = getDistributionBadges({
      category: "skills",
      downloadUrl: "/downloads/skills/demo.zip",
      downloadTrust: "first-party",
      documentationUrl: "https://docs.example",
      repoUrl: "https://github.com/example/demo",
      brandDomain: "example.com",
      trustSignals: { checksumPresent: true, adapterGenerated: true },
      safetyNotes: ["Runs commands."],
      privacyNotes: ["Reads files."],
      reviewedBy: "JSONbored",
    }).map((badge) => badge.label);
    expect(badges).toEqual(
      expect.arrayContaining([
        "Raycast",
        "ZIP",
        "docs",
        "source",
        "brand",
        "checksum",
        "adapter",
        "safety notes",
        "privacy notes",
        "reviewed",
      ]),
    );
    expect(getEntryAccessSummary({ commandSyntax: "/demo" }).hasInstall).toBe(
      true,
    );
  });
});

describe("registry content-builder helpers", () => {
  it("normalizes repository, date, and local package paths", () => {
    expect(
      buildGitHubUrl(path.join(repoRoot, "content/mcp/demo.mdx"), repoRoot),
    ).toBe(
      "https://github.com/JSONbored/awesome-claude/blob/main/content/mcp/demo.mdx",
    );
    expect(parseGitHubRepo("git@github.com:Owner/Repo.git")).toMatchObject({
      owner: "Owner",
      repo: "Repo",
      key: "Owner/Repo",
      url: "https://github.com/Owner/Repo",
    });
    expect(parseGitHubRepo("not a repo")).toBeNull();
    expect(normalizeDownloadUrl(undefined)).toBe("");
    expect(normalizeDownloadUrl("/downloads/skills/demo.zip")).toBe(
      "/downloads/skills/demo.zip",
    );
    expect(normalizeDateAdded(new Date("2026-01-02T03:04:05.000Z"))).toBe(
      "2026-01-02",
    );
    expect(normalizeDateAdded("2026-01-03T04:05:06Z")).toBe("2026-01-03");
    expect(isFirstPartyPackage({ packageVerified: true })).toBe(true);
    expect(isLocalDownloadUrl("/downloads/mcp/demo.mcpb")).toBe(true);
    expect(
      localDownloadSourcePath("/downloads/skills/demo.zip", contentRoot),
    ).toBe(path.join(contentRoot, "skills", "demo.zip"));
    expect(
      localDownloadSourcePath("/external/demo.zip", contentRoot),
    ).toBeNull();
  });

  it("builds normalized skill entries from MDX frontmatter and body", () => {
    const filePath = path.join(contentRoot, "skills/demo-skill.mdx");
    const entry = buildContentEntryFromMdx({
      category: "skills",
      fileName: "demo-skill.mdx",
      filePath,
      repoRoot,
      contentRoot,
      contentUpdatedAt: "2026-01-04T00:00:00.000Z",
      getLocalDownloadSha256: (assetPath: string) =>
        assetPath.endsWith("demo-skill.zip") ? "sha256-demo" : null,
      source: [
        "---",
        "title: Demo Skill",
        "description: Demo skill for testing normalized registry output.",
        "author: JSONbored",
        "slug: demo-skill",
        "dateAdded: 2026-01-03T04:05:06Z",
        "downloadUrl: /downloads/skills/demo-skill.zip",
        "packageVerified: true",
        "repositoryUrl: https://github.com/example/demo-skill",
        "sourceUrls:",
        "  - https://github.com/example/demo-skill",
        '  - ""',
        "tags: [testing, skills]",
        "safetyNotes:",
        "  - Runs local commands.",
        "privacyNotes:",
        "  - Reads project files.",
        "prerequisites:",
        "  - Claude Code",
        "claimStatus: verified",
        "sourceSubmissionNumber: 42",
        "importPrNumber: 43",
        "---",
        "",
        "## Install",
        "",
        "```bash",
        "claude skills install demo-skill",
        "```",
        "",
        "## Troubleshooting",
        "",
        "Check the logs.",
      ].join("\n"),
    });

    expect(entry).toMatchObject({
      category: "skills",
      slug: "demo-skill",
      title: "Demo Skill",
      dateAdded: "2026-01-03",
      downloadTrust: "first-party",
      downloadSha256: "sha256-demo",
      skillPackage: {
        format: "agent-skill",
        entrypoint: "SKILL.md",
        downloadUrl: "/downloads/skills/demo-skill.zip",
        sha256: "sha256-demo",
      },
      hasPrerequisites: true,
      hasTroubleshooting: true,
      claimStatus: "verified",
      sourceSubmissionNumber: 42,
      importPrNumber: 43,
    });
    expect(entry.platformCompatibility.map((item) => item.platform)).toEqual(
      expect.arrayContaining(["Claude", "Codex", "Cursor", "Generic AGENTS"]),
    );
    expect(entry.githubUrl).toBe(
      "https://github.com/JSONbored/awesome-claude/blob/main/content/skills/demo-skill.mdx",
    );
    expect(entry.sections.some((section) => section.id === "install")).toBe(
      true,
    );
  });
});
