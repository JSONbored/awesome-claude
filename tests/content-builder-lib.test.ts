import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  DEFAULT_DIRECTORY_REPO_URL,
  buildGitHubUrl,
  parseGitHubRepo,
  normalizeDownloadUrl,
  normalizeDateAdded,
  normalizeTextField,
  normalizeStringList,
  normalizeDateTimeField,
  normalizePositiveInteger,
  normalizeClaimStatus,
  buildProvenanceFields,
  isFirstPartyPackage,
  isLocalDownloadUrl,
  localDownloadSourcePath,
  buildDefaultSkillPlatformCompatibility,
  normalizePlatformCompatibility,
  buildContentEntryFromMdx,
} from "../packages/registry/src/content-builder-lib.js";

const repoRoot = process.cwd();
const contentRoot = path.join(repoRoot, "content");

function mdx(frontmatter: string, body = "Body content for the entry.") {
  return `---\n${frontmatter}\n---\n\n${body}\n`;
}

function buildEntry(
  overrides: {
    category?: string;
    fileName?: string;
    source?: string;
    contentUpdatedAt?: string;
    getLocalDownloadSha256?: (assetPath: string) => string | null;
  } = {},
) {
  const category = overrides.category ?? "skills";
  const fileName = overrides.fileName ?? "demo-entry.mdx";
  return buildContentEntryFromMdx({
    category,
    fileName,
    filePath: path.join(contentRoot, category, fileName),
    repoRoot,
    contentRoot,
    contentUpdatedAt: overrides.contentUpdatedAt,
    getLocalDownloadSha256: overrides.getLocalDownloadSha256 ?? (() => null),
    source:
      overrides.source ??
      mdx(
        [
          "title: Demo Entry",
          "slug: demo-entry",
          "description: Demo entry for content-builder coverage.",
          "dateAdded: 2026-01-03",
        ].join("\n"),
      ),
  });
}

describe("constants and path helpers", () => {
  it("exposes the directory repo url and builds github blob urls", () => {
    expect(DEFAULT_DIRECTORY_REPO_URL).toBe(
      "https://github.com/JSONbored/awesome-claude",
    );
    expect(
      buildGitHubUrl(path.join(repoRoot, "content/mcp/demo.mdx"), repoRoot),
    ).toBe(
      "https://github.com/JSONbored/awesome-claude/blob/main/content/mcp/demo.mdx",
    );
  });

  it("parses github repos and rejects invalid urls", () => {
    expect(parseGitHubRepo("git@github.com:Owner/Repo.git")).toMatchObject({
      owner: "Owner",
      repo: "Repo",
      key: "Owner/Repo",
      url: "https://github.com/Owner/Repo",
    });
    expect(parseGitHubRepo("https://github.com/a/b")).toMatchObject({
      owner: "a",
      repo: "b",
    });
    expect(parseGitHubRepo("not a repo")).toBeNull();
    expect(parseGitHubRepo("")).toBeNull();
  });

  it("normalizes download urls and local package paths", () => {
    expect(normalizeDownloadUrl(undefined)).toBe("");
    expect(normalizeDownloadUrl("/downloads/skills/demo.zip")).toBe(
      "/downloads/skills/demo.zip",
    );
    expect(isLocalDownloadUrl("/downloads/mcp/demo.mcpb")).toBe(true);
    expect(isLocalDownloadUrl("https://cdn.example/x.zip")).toBe(false);
    expect(isLocalDownloadUrl(undefined)).toBe(false);
    expect(
      localDownloadSourcePath("/downloads/skills/demo.zip", contentRoot),
    ).toBe(path.join(contentRoot, "skills", "demo.zip"));
    expect(
      localDownloadSourcePath("/downloads/mcp/demo.mcpb", contentRoot),
    ).toBe(path.join(contentRoot, "mcp", "demo.mcpb"));
    expect(
      localDownloadSourcePath("/external/demo.zip", contentRoot),
    ).toBeNull();
    expect(localDownloadSourcePath(undefined, contentRoot)).toBeNull();
  });
});

describe("field normalizers", () => {
  it("normalizes text fields", () => {
    expect(normalizeTextField("  hi ")).toBe("hi");
    expect(normalizeTextField("")).toBeUndefined();
    expect(normalizeTextField(null)).toBeUndefined();
    expect(normalizeTextField(undefined)).toBeUndefined();
  });

  it("normalizes string lists", () => {
    expect(normalizeStringList([" a ", "", "b"])).toEqual(["a", "b"]);
    expect(normalizeStringList([])).toBeUndefined();
    expect(normalizeStringList("nope")).toBeUndefined();
    expect(normalizeStringList(null)).toBeUndefined();
  });

  it("normalizes dates and date-times", () => {
    expect(normalizeDateAdded(undefined)).toBeUndefined();
    expect(normalizeDateAdded("")).toBeUndefined();
    expect(normalizeDateAdded(new Date("2026-01-02T03:04:05.000Z"))).toBe(
      "2026-01-02",
    );
    // Invalid Date objects fall through to String(value), which is "Invalid Date".
    expect(normalizeDateAdded(new Date("invalid"))).toBe("Invalid Date");
    expect(normalizeDateAdded("2026-01-03T04:05:06Z")).toBe("2026-01-03");
    expect(normalizeDateAdded("not-a-date")).toBe("not-a-date");

    expect(normalizeDateTimeField(undefined)).toBeUndefined();
    expect(normalizeDateTimeField("2026-01-03")).toBe("2026-01-03");
    expect(normalizeDateTimeField("2026-01-03T04:05:06.000Z")).toBe(
      "2026-01-03T04:05:06.000Z",
    );
    expect(normalizeDateTimeField("not-a-date")).toBe("not-a-date");
  });

  it("normalizes positive integers and claim statuses", () => {
    expect(normalizePositiveInteger(undefined)).toBeUndefined();
    expect(normalizePositiveInteger(null)).toBeUndefined();
    expect(normalizePositiveInteger("")).toBeUndefined();
    expect(normalizePositiveInteger(0)).toBeUndefined();
    expect(normalizePositiveInteger(-1)).toBeUndefined();
    expect(normalizePositiveInteger(1.5)).toBeUndefined();
    expect(normalizePositiveInteger("12")).toBe(12);
    expect(normalizePositiveInteger(12)).toBe(12);

    expect(normalizeClaimStatus("Verified")).toBe("verified");
    expect(normalizeClaimStatus("pending")).toBe("pending");
    expect(normalizeClaimStatus("unclaimed")).toBe("unclaimed");
    expect(normalizeClaimStatus("nope")).toBeUndefined();
    expect(normalizeClaimStatus("")).toBeUndefined();
  });

  it("builds provenance fields from mixed inputs", () => {
    expect(
      buildProvenanceFields({
        submittedBy: " Ada ",
        submittedByUrl: "https://github.com/ada",
        submittedAt: "2026-01-02T00:00:00.000Z",
        sourceSubmissionNumber: "42",
        sourceSubmissionUrl: "https://example.com/sub/42",
        importPrNumber: 43,
        importPrUrl: "https://github.com/org/repo/pull/43",
        reviewedBy: "Bob",
        reviewedAt: "2026-01-03",
        claimStatus: "verified",
        claimedBy: "Ada",
        claimedByUrl: "https://github.com/ada",
        claimedAt: "2026-01-04T00:00:00.000Z",
      }),
    ).toMatchObject({
      submittedBy: "Ada",
      sourceSubmissionNumber: 42,
      importPrNumber: 43,
      claimStatus: "verified",
      reviewedAt: "2026-01-03",
    });
    expect(buildProvenanceFields()).toMatchObject({
      submittedBy: undefined,
      claimStatus: undefined,
    });
  });

  it("detects first-party packages", () => {
    expect(isFirstPartyPackage({ packageVerified: true })).toBe(true);
    expect(isFirstPartyPackage({ packageVerified: false })).toBe(false);
    expect(isFirstPartyPackage()).toBe(false);
  });
});

describe("platform compatibility", () => {
  it("builds default skill platform compatibility", () => {
    const platforms = buildDefaultSkillPlatformCompatibility(
      { slug: "demo", dateAdded: "2026-01-03" },
      { verifiedAt: "2026-02-01" },
    );
    expect(platforms).toHaveLength(6);
    expect(platforms[0]).toMatchObject({
      platform: "Claude",
      supportLevel: "native-skill",
      verifiedAt: "2026-02-01",
    });
    expect(platforms[4]).toMatchObject({
      platform: "Cursor",
      supportLevel: "adapter",
      adapterPath: "/data/skill-adapters/cursor/demo.mdc",
    });
  });

  it("falls back to dateAdded and a default slug", () => {
    const platforms = buildDefaultSkillPlatformCompatibility({}, {});
    expect(platforms[0].verifiedAt).toBe("");
    expect(platforms[4].adapterPath).toBe(
      "/data/skill-adapters/cursor/skill.mdc",
    );
  });

  it("normalizes explicit platform compatibility arrays", () => {
    expect(
      normalizePlatformCompatibility(
        [
          {
            platform: " Claude ",
            supportLevel: " native-skill ",
            installPath: " .claude/skills/x ",
            adapterPath: "/data/x.mdc",
            verifiedAt: "2026-01-01",
          },
          null,
          "nope",
          { platform: "", supportLevel: "native-skill" },
          { platform: "Codex", supportLevel: "" },
          { platform: "Windsurf", supportLevel: "native-skill" },
        ],
        {},
        {},
      ),
    ).toEqual([
      {
        platform: "Claude",
        supportLevel: "native-skill",
        installPath: ".claude/skills/x",
        adapterPath: "/data/x.mdc",
        verifiedAt: "2026-01-01",
      },
      {
        platform: "Windsurf",
        supportLevel: "native-skill",
        installPath: "",
        adapterPath: undefined,
        verifiedAt: undefined,
      },
    ]);
  });

  it("falls back to defaults for empty or non-array compatibility", () => {
    const defaults = buildDefaultSkillPlatformCompatibility(
      { slug: "x", dateAdded: "2026-01-01" },
      {},
    );
    expect(
      normalizePlatformCompatibility(
        [],
        { slug: "x", dateAdded: "2026-01-01" },
        {},
      ),
    ).toEqual(defaults);
    expect(
      normalizePlatformCompatibility(
        undefined,
        { slug: "x", dateAdded: "2026-01-01" },
        {},
      ),
    ).toEqual(defaults);
  });
});

describe("buildContentEntryFromMdx", () => {
  it("builds a minimal entry with filename fallbacks", () => {
    const entry = buildEntry({
      source: mdx("description: Minimal entry without title or slug."),
      fileName: "fallback-name.mdx",
    });
    expect(entry.title).toBe("fallback-name");
    expect(entry.slug).toBe("fallback-name");
    expect(entry.downloadTrust).toBeNull();
    expect(entry.skillPackage).toBeUndefined();
    expect(entry.platformCompatibility).toBeDefined();
    expect(entry.githubUrl).toContain("content/skills/fallback-name.mdx");
    expect(entry.repoUrl).toBeNull();
  });

  it("builds a first-party skill package with sha256 and defaults", () => {
    const entry = buildEntry({
      source: mdx(
        [
          "title: Demo Skill",
          "slug: demo-skill",
          "description: Demo skill for testing normalized registry output.",
          "author: JSONbored",
          "authorProfileUrl: https://github.com/JSONbored",
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
          "readingTime: 4",
          "difficultyScore: 2",
          "hasPrerequisites: true",
          "hasTroubleshooting: true",
          "hasBreakingChanges: false",
          "robotsIndex: true",
          "robotsFollow: true",
        ].join("\n"),
        [
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
      ),
      contentUpdatedAt: "2026-01-04T00:00:00.000Z",
      getLocalDownloadSha256: (assetPath) =>
        assetPath.endsWith("demo-skill.zip") ? "sha256-demo" : null,
    });

    expect(entry.downloadTrust).toBe("first-party");
    expect(entry.downloadSha256).toBe("sha256-demo");
    expect(entry.skillPackage).toEqual({
      format: "agent-skill",
      entrypoint: "SKILL.md",
      downloadUrl: "/downloads/skills/demo-skill.zip",
      sha256: "sha256-demo",
    });
    expect(entry.author).toBe("JSONbored");
    expect(entry.authorProfileUrl).toBe("https://github.com/JSONbored");
    expect(entry.readingTime).toBe(4);
    expect(entry.difficultyScore).toBe(2);
    expect(entry.hasPrerequisites).toBe(true);
    expect(entry.hasTroubleshooting).toBe(true);
    expect(entry.hasBreakingChanges).toBe(false);
    expect(entry.robotsIndex).toBe(true);
    expect(entry.robotsFollow).toBe(true);
    expect(entry.packageVerified).toBe(true);
    expect(entry.claimStatus).toBe("verified");
    expect(entry.sourceSubmissionNumber).toBe(42);
    expect(entry.importPrNumber).toBe(43);
    expect(entry.sections.length).toBeGreaterThan(0);
    expect(entry.codeBlocks.length).toBeGreaterThan(0);
  });

  it("marks external downloads when the package is not first-party", () => {
    const entry = buildEntry({
      source: mdx(
        [
          "title: External Skill",
          "slug: external-skill",
          "description: External package download.",
          "dateAdded: 2026-01-03",
          "downloadUrl: /downloads/skills/external-skill.zip",
          "packageVerified: false",
        ].join("\n"),
      ),
    });
    expect(entry.downloadTrust).toBe("external");
    expect(entry.downloadSha256).toBeNull();
  });

  it("marks remote downloads as external without a local path", () => {
    const entry = buildEntry({
      source: mdx(
        [
          "title: Remote Skill",
          "slug: remote-skill",
          "description: Remote package download.",
          "dateAdded: 2026-01-03",
          "downloadUrl: https://cdn.example/remote-skill.zip",
          "packageVerified: true",
        ].join("\n"),
      ),
    });
    expect(entry.downloadTrust).toBe("external");
    expect(entry.skillPackage?.sha256).toBeNull();
  });

  it("builds tool entries with affiliate and pricing fields", () => {
    const entry = buildEntry({
      category: "tools",
      fileName: "demo-tool.mdx",
      source: mdx(
        [
          "title: Demo Tool",
          "slug: demo-tool",
          "description: A commercial tool listing.",
          "dateAdded: 2026-01-03",
          "websiteUrl: https://tool.example",
          "affiliateUrl: https://tool.example/aff",
          "pricingModel: freemium",
          "disclosure: sponsored",
          "applicationCategory: DeveloperApplication",
          "operatingSystem: Web",
          "documentationUrl: https://docs.tool.example",
          "docsUrl: https://docs.tool.example/start",
          "sourceUrl: https://github.com/example/tool",
          "packageUrl: https://npmjs.com/package/tool",
          "repositoryUrl: https://github.com/example/tool",
        ].join("\n"),
      ),
    });
    expect(entry.affiliateUrl).toBe("https://tool.example/aff");
    expect(entry.pricingModel).toBe("freemium");
    expect(entry.disclosure).toBe("sponsored");
    expect(entry.applicationCategory).toBe("DeveloperApplication");
    expect(entry.operatingSystem).toBe("Web");
    expect(entry.platformCompatibility).toBeUndefined();
    expect(entry.skillPackage).toBeUndefined();
  });

  it("does not attach affiliate urls outside tools", () => {
    const entry = buildEntry({
      source: mdx(
        [
          "title: Skill",
          "slug: skill",
          "description: Not a tool.",
          "dateAdded: 2026-01-03",
          "affiliateUrl: https://tool.example/aff",
        ].join("\n"),
      ),
    });
    expect(entry.affiliateUrl).toBeUndefined();
  });

  it("honors explicit platform compatibility and collection items", () => {
    const entry = buildEntry({
      category: "collections",
      fileName: "pack.mdx",
      source: mdx(
        [
          "title: Pack",
          "slug: pack",
          "description: A collection of entries.",
          "dateAdded: 2026-01-03",
          "items:",
          "  - slug: demo-skill",
          "    category: skills",
          "installationOrder:",
          "  - demo-skill",
          "estimatedSetupTime: 10 minutes",
          "difficulty: easy",
          "commandSyntax: /pack",
          "argumentHint: optional",
          "allowedTools:",
          "  - Bash",
        ].join("\n"),
      ),
    });
    expect(entry.items).toEqual([{ slug: "demo-skill", category: "skills" }]);
    expect(entry.installationOrder).toEqual(["demo-skill"]);
    expect(entry.estimatedSetupTime).toBe("10 minutes");
    expect(entry.difficulty).toBe("easy");
    expect(entry.commandSyntax).toBe("/pack");
    expect(entry.argumentHint).toBe("optional");
    expect(entry.allowedTools).toEqual(["Bash"]);
    expect(entry.platformCompatibility).toBeUndefined();
  });

  it("uses explicit skill platform compatibility when provided", () => {
    const entry = buildEntry({
      source: mdx(
        [
          "title: Custom Platforms",
          "slug: custom-platforms",
          "description: Skill with explicit platforms.",
          "dateAdded: 2026-01-03",
          "platformCompatibility:",
          "  - platform: Claude",
          "    supportLevel: native-skill",
          "    installPath: .claude/skills/x/SKILL.md",
        ].join("\n"),
      ),
    });
    expect(entry.platformCompatibility).toEqual([
      {
        platform: "Claude",
        supportLevel: "native-skill",
        installPath: ".claude/skills/x/SKILL.md",
        adapterPath: undefined,
        verifiedAt: undefined,
      },
    ]);
  });

  it("infers section flags when frontmatter booleans are absent", () => {
    const entry = buildEntry({
      source: mdx(
        [
          "title: Flags",
          "slug: flags",
          "description: Infer section flags from body headings.",
          "dateAdded: 2026-01-03",
          "prerequisites:",
          "  - Node.js",
        ].join("\n"),
        [
          "## Prerequisites",
          "",
          "Need Node.",
          "",
          "## Troubleshooting",
          "",
          "Check logs.",
        ].join("\n"),
      ),
    });
    expect(entry.hasPrerequisites).toBe(true);
    expect(entry.hasTroubleshooting).toBe(true);
    expect(entry.hasBreakingChanges).toBeUndefined();
    expect(entry.robotsIndex).toBeUndefined();
    expect(entry.robotsFollow).toBeUndefined();
    expect(entry.packageVerified).toBeUndefined();
    expect(entry.readingTime).toBeUndefined();
    expect(entry.difficultyScore).toBeUndefined();
  });

  it("prefers frontmatter contentUpdatedAt over the build-time stamp", () => {
    const entry = buildEntry({
      contentUpdatedAt: "2026-01-04T00:00:00.000Z",
      source: mdx(
        [
          "title: Updated",
          "slug: updated",
          "description: Explicit content updated at.",
          "dateAdded: 2026-01-03",
          'contentUpdatedAt: "2026-02-01T00:00:00.000Z"',
        ].join("\n"),
      ),
    });
    expect(entry.contentUpdatedAt).toBe("2026-02-01T00:00:00.000Z");
  });

  it("uses the build-time contentUpdatedAt when frontmatter omits it", () => {
    const entry = buildEntry({
      contentUpdatedAt: "2026-01-04T00:00:00.000Z",
    });
    expect(entry.contentUpdatedAt).toBe("2026-01-04T00:00:00.000Z");
  });

  it("leaves contentUpdatedAt undefined when neither source provides it", () => {
    const entry = buildEntry();
    expect(entry.contentUpdatedAt).toBeUndefined();
  });

  it("defaults getLocalDownloadSha256 when omitted", () => {
    const entry = buildContentEntryFromMdx({
      category: "skills",
      fileName: "no-sha.mdx",
      filePath: path.join(contentRoot, "skills/no-sha.mdx"),
      repoRoot,
      contentRoot,
      source: mdx(
        [
          "title: No Sha",
          "slug: no-sha",
          "description: Defaults the sha callback.",
          "dateAdded: 2026-01-03",
          "downloadUrl: /downloads/skills/no-sha.zip",
          "packageVerified: true",
        ].join("\n"),
      ),
    });
    expect(entry.downloadSha256).toBeNull();
  });
});

describe("public wrapper re-exports", () => {
  it("keeps the content-builder.js surface identical to the lib", async () => {
    const wrapper = await import("../packages/registry/src/content-builder.js");
    expect(wrapper.buildContentEntryFromMdx).toBe(buildContentEntryFromMdx);
    expect(wrapper.parseGitHubRepo).toBe(parseGitHubRepo);
    expect(wrapper.normalizePlatformCompatibility).toBe(
      normalizePlatformCompatibility,
    );
    expect(wrapper.DEFAULT_DIRECTORY_REPO_URL).toBe(DEFAULT_DIRECTORY_REPO_URL);
  });
});
