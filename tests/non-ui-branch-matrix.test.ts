import { describe, expect, it } from "vitest";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  analyzeDirectContentRisk,
  analyzeSubmissionDraftRisk,
  directContentRequestChangesReasons,
  formatSubmissionRiskMarkdown,
} from "@heyclaude/registry/submission-risk";
import {
  buildSubmissionPrBody,
  buildSubmissionPrDraft,
  buildSubmissionPrTitle,
  looksLikeSubmissionPrDraft,
  normalizeCategory,
  normalizeHeading,
  normalizeParsedFields,
  normalizeSubmissionPayloadFields,
  normalizeValue,
  parseSubmissionPrBody,
  slugify,
  validateSubmission,
} from "@heyclaude/registry/submission";
import {
  deriveCardDescription,
  deriveSeoFields,
  extractCodeBlocks,
  extractHeadings,
  extractSections,
  headingId,
  inferHookTrigger,
  inferLanguageFromCategory,
  inferRepoUrl,
  inferSectionBooleans,
  inferStructuredFields,
  looksLikeRawScript,
  normalizeBody,
  orderFrontmatter,
  stripCodeBlocks,
  validateEntry,
} from "@heyclaude/registry/content-schema";
import {
  buildArtifactEnvelope,
  buildArtifactHash,
  buildArtifactManifestV2,
  buildCategoryDistributionFeed,
  buildContentPromptArtifact,
  buildContentQualityArtifact,
  buildCollectionSequence,
  buildCorpusLlmsArtifact,
  buildBreadcrumbJsonLd,
  buildCursorSkillAdapter,
  buildDirectoryEntries,
  buildDistributionFeedIndex,
  buildEntryDetail,
  buildEntryCitationFacts,
  buildEntryLlmsArtifact,
  buildEntryTrustSignals,
  buildEnvelopeEntries,
  buildJsonLdSnapshots,
  buildMcpRegistryFeed,
  buildCollectionPageJsonLd,
  buildEntryJsonLd,
  buildItemListJsonLd,
  buildJobPostingJsonLd,
  buildOrganizationJsonLd,
  buildPlatformDistributionFeed,
  buildPluginExportFeed,
  buildRaycastDetailMarkdown,
  buildRaycastEnvelope,
  buildRaycastDetail,
  buildRaycastEntries,
  buildReadOnlyEcosystemFeed,
  buildRegistryArtifactSet,
  buildRegistryChangelogFeed,
  buildRegistryManifest,
  buildRegistryTrustReport,
  buildSearchActionJsonLd,
  buildToolSoftwareApplicationJsonLd,
  buildWebPageJsonLd,
  buildWebsiteJsonLd,
  buildWeeklyBrief,
  buildSkillPlatformCompatibility,
  compactCount,
  buildSearchEntries,
  dataUrl,
  extractConfigCommand,
  extractMcpServerConfig,
  firstUsefulLine,
  formatMcpConfigSnippet,
  generatedAtForEntries,
  getCopyText,
  getDistributionBadges,
  getEntryAccessSummary,
  getPreviewLine,
  mcpConfigSupportsTarget,
  mcpInstallTargetsForConfig,
  parseAbbreviatedCount,
  platformFeedSlug,
  renderCorpusLlms,
  renderEntryLlms,
  renderWeeklyBriefMarkdown,
  resolveMcpInstallConfig,
  truncateText,
  normalizeMcpServerConfig,
  absoluteSiteUrl,
} from "@heyclaude/registry";
import {
  buildContentEntryFromMdx,
  isLocalDownloadUrl,
  localDownloadSourcePath,
  normalizeDateAdded,
  normalizeDownloadUrl,
  parseGitHubRepo,
} from "../packages/registry/src/content-builder.js";
import {
  buildPlacementRenewalReminder,
  compareToolListings,
  evaluateJobSourceLifecycle,
  isPaidOrAffiliateDisclosure,
  isPlacementActive,
  linkRelForDisclosure,
  nextLeadStatus,
  normalizeCommercialStatus,
  normalizeCommercialTier,
  normalizeDisclosure,
  normalizeLeadKind,
  normalizePricingModel,
  summarizePlacementExpiry,
  toolPlacementRank,
  validateJobPublicExposure,
  validateJobPublicationQuality,
  validateListingLeadPayload,
} from "@heyclaude/registry/commercial";
import { scanDangerousShellPatterns } from "@heyclaude/registry/command-safety";
import {
  GitHubApiError,
  buildGitHubAppAuthorizeUrl,
  getCommitValidationState,
  githubJson,
  githubRetryDelaySeconds,
  isGitHubRateLimitError,
  parseRepo,
} from "../apps/submission-gate/src/github";
import {
  approvalReviewBody,
  defaultManualDecision,
  duplicateEvidenceContractExhaustedDecision,
  enforceAutoMergeConfidenceFloor,
  isRetryableGateDecision,
  markerComment,
  normalizePrivateGateDecisionPayload,
  parsePrivateGateDecisionResponseBody,
  privateReviewErrorDecision,
  retryingReviewComment,
  supersededReviewComment,
  validationFailedDecision,
} from "../apps/submission-gate/src/review";
import {
  getDueApprovedBriefs,
  getLatestDraft,
  listPublishedBriefs,
} from "../apps/web/src/lib/brief-issues.server";
import {
  allFeedHealth,
  applySavedSearch,
  buildAtom,
  buildRss,
  categoryItems,
  changelogStreamItems,
  origin,
  respondFeed,
  siteWideItems,
  trendingItems,
} from "../apps/web/src/lib/feeds";
import {
  buildEntry,
  type RegistryEntry,
} from "../apps/web/src/data/entry-normalize";
import * as registryMcp from "../packages/mcp/src/registry.js";
import {
  buildPrDraftFromSpec,
  buildSubmissionUrlsFromSpec,
  getCategorySubmissionGuidanceFromSpec,
  getSubmissionExamplesFromSpec,
  getSubmissionSchemaFromSpec,
  normalizeSubmissionFields,
  prepareSubmissionDraftFromSpec,
  reviewSubmissionDraftFromSpec,
  searchDuplicateEntries,
  validateSubmissionDraftFromSpec,
} from "../packages/mcp/src/submissions.js";
import { dataRoot, loadContentEntries } from "./helpers/registry-fixtures";

const mcpOptions = { dataDir: dataRoot };

const validMcpFields = {
  category: "mcp",
  name: "Branch Matrix MCP",
  slug: "branch-matrix-mcp",
  github_url: "https://github.com/example/branch-matrix-mcp",
  docs_url: "https://example.com/branch-matrix",
  description:
    "Source-backed MCP server fixture used to exercise branch coverage.",
  install_command: "npx -y branch-matrix-mcp",
  usage_snippet: "claude mcp add branch-matrix -- npx -y branch-matrix-mcp",
  safety_notes: "Runs a local MCP server process.",
  privacy_notes: "Only handles user-selected project context.",
  tags: "mcp, testing",
};

function entry(category: string, overrides: Record<string, unknown> = {}) {
  return {
    category,
    slug: `${category}-branch-matrix`,
    title: `${category} Branch Matrix`,
    description: `A ${category} fixture with enough metadata for artifact helpers.`,
    body: "## Install\n\n```bash\nclaude mcp add demo\n```\n\n## Usage\n\nUse it carefully.",
    tags: ["testing", category],
    keywords: ["branch", "matrix"],
    platforms: ["claude-code", "cursor"],
    dateAdded: "2026-01-01",
    updatedAt: "2026-01-02",
    repoUrl: "https://github.com/example/branch-matrix",
    documentationUrl: "https://example.com/docs",
    installCommand: "claude mcp add branch-matrix -- npx demo",
    configSnippet: '{"mcpServers":{"demo":{"command":"npx"}}}',
    usageSnippet: "Ask Claude to use the demo server.",
    safetyNotes: ["Runs a local command."],
    privacyNotes: ["Reads selected project files."],
    claimStatus: "verified",
    reviewedBy: "JSONbored",
    downloadUrl: "/downloads/skills/branch-matrix.zip",
    downloadTrust: "first-party",
    downloadSha256: "sha256-branch-matrix",
    packageVerified: true,
    trustSignals: {
      sourceStatus: "available",
      checksumPresent: true,
      packageVerified: true,
    },
    ...overrides,
  };
}

const artifactEntries = [
  entry("mcp"),
  entry("skills", {
    skillPackage: { format: "agent-skill", sha256: "sha256-skill" },
  }),
  entry("hooks", {
    trigger: "PreToolUse",
    scriptBody: "#!/usr/bin/env bash\necho hook",
  }),
  entry("commands", {
    commandSyntax: "/branch-matrix",
    copySnippet: "/branch-matrix --safe",
  }),
  entry("collections", {
    items: [
      { category: "mcp", slug: "mcp-branch-matrix" },
      { category: "skills", slug: "skills-branch-matrix" },
    ],
  }),
  entry("tools", {
    pricingModel: "paid",
    disclosure: "affiliate",
    downloadUrl: "",
    packageVerified: false,
  }),
];

function draftMdx(overrides: Record<string, unknown> = {}) {
  const data = {
    title: "Branch Matrix MCP",
    slug: "branch-matrix-mcp",
    category: "mcp",
    description: "Source-backed content fixture for branch matrix tests.",
    repoUrl: "https://github.com/example/branch-matrix-mcp",
    installCommand: "npx -y branch-matrix-mcp",
    safetyNotes: ["Runs a local MCP process."],
    privacyNotes: ["Handles selected project context."],
    submittedBy: "branch-contributor",
    submittedByUrl: "https://github.com/branch-contributor",
    ...overrides,
  };
  return [
    "---",
    ...Object.entries(data).flatMap(([key, value]) =>
      Array.isArray(value)
        ? [`${key}:`, ...value.map((item) => `  - ${item}`)]
        : [`${key}: ${JSON.stringify(value)}`],
    ),
    "---",
    "",
    "Useful setup notes.",
  ].join("\n");
}

describe("non-UI branch matrix", () => {
  it("exercises registry submission parsing, normalization, and validation edge cases", () => {
    expect(normalizeHeading("### Repository URL")).toBe("repository-url");
    expect(normalizeValue([" a ", "", "b"])).toBe("a ,,b");
    expect(normalizeValue({ raw: true })).toBe("[object Object]");
    expect(slugify("  Branch Matrix MCP!  ")).toBe("branch-matrix-mcp");
    expect(normalizeCategory("mcp")).toBe("mcp");
    expect(normalizeCategory("Model Context Protocol")).toBe("");
    expect(normalizeCategory("unknown-category")).toBe("");

    const parsed = parseSubmissionPrBody(
      [
        "### Category",
        "MCP",
        "### Name",
        "Branch Matrix MCP",
        "### Source URL",
        "https://github.com/example/branch-matrix-mcp",
        "### Safety Notes",
        "- Runs a local server",
      ].join("\n"),
    );
    expect(normalizeParsedFields(parsed)).toMatchObject({
      category: "mcp",
      name: "Branch Matrix MCP",
    });
    expect(
      normalizeSubmissionPayloadFields({
        ...validMcpFields,
        source_urls: ["https://example.com/a", " ", "https://example.com/b"],
      }),
    ).toMatchObject({
      category: "mcp",
      source_urls: "https://example.com/a,  , https://example.com/b",
    });

    const draft = buildSubmissionPrDraft(validMcpFields);
    expect(buildSubmissionPrTitle(validMcpFields)).toContain(
      "Branch Matrix MCP",
    );
    expect(buildSubmissionPrBody(validMcpFields)).toContain("Safety notes");
    expect(looksLikeSubmissionPrDraft(draft)).toBe(true);
    expect(looksLikeSubmissionPrDraft({ title: "Missing body" })).toBe(false);
    expect(validateSubmission(draft).ok).toBe(true);
    expect(
      validateSubmission({
        title: "Thin promo",
        body: "Buy now",
        fields: {},
      }),
    ).toMatchObject({
      ok: true,
      skipped: true,
      reason: "non_core_category_submission",
    });
  });

  it("covers category-specific submission validation branches", () => {
    const draftFromFields = (
      fields: Record<string, unknown>,
      labels: Array<string | { name: string }> = [],
    ) => ({
      ...buildSubmissionPrDraft(fields),
      labels,
    });
    const usefulNotes = {
      safety_notes: "Runs local commands only after explicit user approval.",
      privacy_notes:
        "Reads only user-selected project files and stores no data.",
    };

    const cases = [
      {
        name: "mcp invalid urls and disclosures",
        draft: draftFromFields({
          category: "mcp",
          name: "Bad MCP",
          description: "short",
          card_description: "short",
          github_url: "http://github.com/example/bad",
          docs_url: "not a url",
          download_url: "/downloads/mcp/bad.mcpb",
          affiliate_url: "https://example.com/?ref=partner",
          contact_email: "not a contact",
          install_command: "npx bad",
          safety_notes: "N/A",
          privacy_notes: "N/A",
        }),
        expectedErrors: [
          "github_url must be a valid https URL",
          "docs_url must be a valid https URL",
          "Community submissions cannot request local /downloads hosting",
          "Contributor submissions cannot include affiliate_url outside maintainer-reviewed tools listings",
        ],
      },
      {
        name: "tools listing requires approval metadata",
        draft: draftFromFields({
          category: "tools",
          name: "Commercial Tool",
          description:
            "Hosted commercial Claude workflow product with paid team plan.",
          website_url: "https://example.com",
          docs_url: "https://example.com/docs",
          pricing_model: "enterprise-only",
          disclosure: "paid-partner",
        }),
        expectedErrors: [
          "not merged from the free resource queue without maintainer approval",
          "pricing_model is not recognized",
          "disclosure must be editorial",
        ],
      },
      {
        name: "tools affiliate listings require affiliate url",
        draft: draftFromFields(
          {
            category: "tools",
            name: "Affiliate Tool",
            description:
              "Maintainer-reviewed editorial tool listing with affiliate disclosure.",
            website_url: "https://example.com",
            docs_url: "https://example.com/docs",
            pricing_model: "paid",
            disclosure: "affiliate",
            application_category: "developer-tools",
            operating_system: "web",
          },
          ["accepted"],
        ),
        expectedErrors: ["affiliate tools listings require affiliate_url"],
      },
      {
        name: "skills capability pack metadata",
        draft: draftFromFields({
          category: "skills",
          name: "Capability Pack",
          description:
            "Capability pack skill with intentionally invalid verification metadata.",
          github_url: "https://github.com/example/repo/tree/main/skills/demo",
          download_url: "https://github.com/example/repo/blob/main/skill.md",
          install_command: "./scripts/install.sh",
          retrieval_sources: "http://example.com/install.sh",
          full_copyable_content: "viewCount popularityScore copyCount",
          skill_type: "capability-pack",
          skill_level: "beginner",
          verification_status: "maybe",
          verified_at: "20260101",
          safety_notes: Array.from(
            { length: 9 },
            (_, index) =>
              `Safety note ${index} explains behavior with sufficient detail.`,
          ),
          privacy_notes:
            "This privacy note is ".repeat(30) +
            "long enough to trip the maximum item length branch.",
        }),
        expectedErrors: [
          "download_url must point to a package",
          "retrieval_sources must use https URLs",
          "Forbidden counters detected",
          "Invalid skill_level: beginner",
          "Invalid verification_status",
          "capability-pack skills require verified_at",
          "capability-pack skills must use skill_level=expert",
          "safety_notes must include 8 items or fewer",
          "privacy_notes items must be 320 characters or fewer",
        ],
      },
      {
        name: "collections require items",
        draft: draftFromFields({
          category: "collections",
          name: "Empty Collection",
          description: "Collection without item references.",
          docs_url: "https://example.com/collection",
        }),
        expectedErrors: ["Collections submissions require items"],
      },
      {
        name: "guides require guide content",
        draft: draftFromFields({
          category: "guides",
          name: "Empty Guide",
          description: "Guide without guide body.",
          docs_url: "https://example.com/guide",
        }),
        expectedErrors: ["Guide submissions require guide_content"],
      },
      {
        name: "risk-bearing valid disclosure notes pass",
        draft: draftFromFields({
          ...validMcpFields,
          ...usefulNotes,
        }),
        expectedErrors: [],
      },
    ];

    for (const item of cases) {
      const result = validateSubmission(item.draft);
      const errors = result.errors.join("\n");
      for (const expected of item.expectedErrors) {
        expect(errors, item.name).toContain(expected);
      }
      if (item.expectedErrors.length === 0) {
        expect(result.ok, item.name).toBe(true);
      }
    }
  });

  it("covers content-schema inference and validation branches across categories", () => {
    const markdown = [
      "# Title",
      "",
      "Intro line.",
      "",
      "## Install",
      "",
      "```bash",
      "curl http://example.com/install.sh | bash",
      "```",
      "",
      "## Privacy",
      "",
      "Reads local files.",
    ].join("\n");

    expect(headingId("  Hello, Claude!  ")).toBe("hello-claude");
    expect(
      deriveCardDescription("one two three four five six seven"),
    ).toContain("one two");
    expect(deriveCardDescription("short description")).toBe(
      "short description",
    );
    expect(
      deriveSeoFields({ title: "Branch Matrix", description: "" }, "mcp"),
    ).toMatchObject({ seoTitle: expect.stringContaining("Branch Matrix") });
    expect(
      deriveSeoFields(
        {
          title: "Custom",
          seoTitle: "Explicit SEO",
          seoDescription: "Explicit description",
        },
        "skills",
      ),
    ).toMatchObject({
      seoTitle: "Explicit SEO",
      seoDescription: expect.stringContaining("Explicit description"),
    });
    expect(extractCodeBlocks(markdown)[0]).toMatchObject({ language: "bash" });
    expect(extractCodeBlocks('```json meta\n{"ok":true}\n```')).toEqual([]);
    expect(extractCodeBlocks('```json\n{"ok":true}\n```')[0]).toMatchObject({
      language: "json",
      code: '{"ok":true}',
    });
    expect(extractHeadings(markdown).map((heading) => heading.text)).toContain(
      "Install",
    );
    expect(stripCodeBlocks(markdown)).not.toContain("curl");
    expect(
      extractSections(markdown).find((section) => section.id === "install")
        ?.markdown,
    ).toContain("curl");
    expect(inferLanguageFromCategory("hooks")).toBe("bash");
    expect(inferLanguageFromCategory("commands")).toBe("text");
    expect(looksLikeRawScript("#!/usr/bin/env bash\necho ok")).toBe(true);
    expect(
      looksLikeRawScript(
        [
          "echo ok",
          "export A=1",
          "read -r input",
          'if [ -n "$input" ]; then',
        ].join("\n"),
      ),
    ).toBe(true);
    expect(looksLikeRawScript("plain markdown")).toBe(false);
    expect(normalizeBody("#!/usr/bin/env bash\necho ok", "hooks")).toContain(
      "```bash",
    );
    expect(normalizeBody("*(No content)*", "mcp")).toBe("");
    expect(normalizeBody("Already markdown", "mcp")).toBe("Already markdown");
    expect(inferRepoUrl({ repoUrl: "https://github.com/example/repo" })).toBe(
      "https://github.com/example/repo",
    );
    expect(
      inferRepoUrl({
        repoUrl: "https://github.com/JSONbored/awesome-claude",
        documentationUrl: "https://github.com/example/from-docs",
      }),
    ).toBe("");
    expect(inferSectionBooleans(markdown)).toMatchObject({
      hasPrerequisites: false,
      hasTroubleshooting: false,
    });
    expect(
      inferSectionBooleans(
        "## Prerequisites and setup\n\nx\n\n## Troubleshooting Guide",
      ),
    ).toEqual({ hasPrerequisites: true, hasTroubleshooting: true });
    expect(inferHookTrigger("Runs on PreToolUse")).toBe("PreToolUse");

    const inferred = inferStructuredFields(
      {
        title: "Branch Matrix Hook",
        category: "hooks",
        description: "Hook fixture.",
      },
      `${markdown}\n\nRuns on PreToolUse.`,
      "hooks",
    );
    expect(inferred).toMatchObject({ trigger: "PreToolUse" });
    expect(
      inferStructuredFields(
        { title: "/branch-command", category: "commands" },
        "Use the command.\n\n```text\n/branch-command input\n```",
        "commands",
      ),
    ).toMatchObject({
      commandSyntax: "/branch-command",
      installCommand: "/branch-command",
    });
    expect(
      inferStructuredFields(
        {
          title: "Capability",
          slug: "demo-capability-pack",
          category: "skills",
          downloadUrl: "/downloads/skills/capability.zip",
          dateAdded: "2026-01-01",
        },
        "Skill lead paragraph.\n\n```bash\nclaude skill install capability\n```",
        "skills",
      ),
    ).toMatchObject({
      skillType: "capability-pack",
      skillLevel: "expert",
      verificationStatus: "validated",
      verifiedAt: "2026-01-01",
      testedPlatforms: expect.arrayContaining(["Claude", "Codex"]),
      installCommand: expect.stringContaining("curl -L"),
    });
    expect(
      inferStructuredFields(
        { title: "Agent", category: "agents" },
        "Lead paragraph for an agent.\n\nMore detail.",
        "agents",
      ),
    ).toMatchObject({
      usageSnippet: "Lead paragraph for an agent.",
      copySnippet: expect.stringContaining("Lead paragraph"),
    });

    expect(
      validateEntry(
        "mcp",
        {
          title: "Branch Matrix MCP",
          slug: "branch-matrix-mcp",
          description: "Valid MCP entry.",
          repoUrl: "https://github.com/example/branch-matrix",
          installCommand: "npx -y branch-matrix",
          safetyNotes: ["Runs locally."],
          privacyNotes: ["Reads selected files."],
        },
        {},
      ).missingRequired,
    ).toContain("cardDescription");
    expect(
      validateEntry(
        "skills",
        {
          title: "",
          slug: "Bad Slug",
          description: "",
          downloadUrl: "/downloads/skills/bad.zip",
          packageVerified: true,
        },
        {},
      ).missingRequired.length,
    ).toBeGreaterThan(0);
    const invalidSkill = validateEntry(
      "skills",
      {
        title: "Invalid Skill",
        slug: "Invalid Skill",
        description: "Invalid skill metadata.",
        skillType: "capability-pack",
        skillLevel: "beginner",
        verificationStatus: "unknown",
        verifiedAt: "20260101",
        retrievalSources: [],
        testedPlatforms: [],
        brandDomain: "bad domain",
        brandAssetSource: "unknown",
        brandIconUrl: "ftp://example.com/icon.png",
        brandLogoUrl: "http://example.com/logo.png",
        brandVerifiedAt: "20260101",
        brandColors: ["#796eff", "not-a-color"],
        repoUrl: "notaurl",
        submittedByUrl: "http://github.com/contributor",
        submittedAt: "bad date",
        sourceSubmissionNumber: 0,
        submittedBy: "bad login!",
        claimStatus: "claimed",
        safetyNotes: ["", 1, "x".repeat(400)],
        privacyNotes: Array.from({ length: 9 }, (_, index) => `note ${index}`),
      },
      {},
    );
    expect(invalidSkill.semanticErrors).toEqual(
      expect.arrayContaining([
        "slug must contain only lowercase letters, numbers, and single hyphens",
        "capability-pack skills must include retrievalSources",
        "capability-pack skills must use skillLevel: expert",
        "skills must define testedPlatforms",
        "brandDomain must be a canonical domain such as asana.com",
        "brandAssetSource must be one of brandfetch, manual, website, github, none",
        "brandIconUrl must be HTTPS and served by Brandfetch, HeyClaude, or a local asset path",
        "brandLogoUrl must be HTTPS and served by Brandfetch, HeyClaude, or a local asset path",
        "brandVerifiedAt must be ISO date format YYYY-MM-DD",
        "brandColors must be hex colors such as #796eff",
        "repoUrl must use http or https",
        "submittedByUrl must use https",
        "submittedAt must be an ISO date or datetime",
        "sourceSubmissionNumber must be a positive integer",
        "submittedBy must be a GitHub username",
        "claimStatus must be one of unclaimed, pending, verified",
      ]),
    );
    expect(invalidSkill.enumErrors).toEqual(
      expect.arrayContaining([
        "Invalid skillLevel: beginner",
        "Invalid verificationStatus: unknown",
      ]),
    );
    const invalidTool = validateEntry(
      "tools",
      {
        title: "Tool",
        slug: "tool",
        description: "Invalid tool listing.",
        websiteUrl: "http://tool.example.com",
        affiliateUrl: "",
        disclosure: "affiliate",
        pricingModel: "trial",
      },
      {},
    );
    expect(invalidTool.semanticErrors).toEqual(
      expect.arrayContaining([
        "websiteUrl must use https",
        "affiliate tool listings must include affiliateUrl",
        "pricingModel is not recognized",
      ]),
    );
    expect(orderFrontmatter({ z: 1, title: "Title", slug: "slug" })).toEqual(
      expect.objectContaining({ title: "Title", slug: "slug", z: 1 }),
    );
  });

  it("covers content builder normalization for local packages and sparse frontmatter", () => {
    expect(parseGitHubRepo("git@github.com:Example/Repo.git")).toMatchObject({
      key: "Example/Repo",
      url: "https://github.com/Example/Repo",
    });
    expect(parseGitHubRepo("not a repo")).toBeNull();
    expect(normalizeDateAdded(new Date("2026-01-02T03:04:05Z"))).toBe(
      "2026-01-02",
    );
    expect(normalizeDateAdded("2026-01-03T04:05:06Z")).toBe("2026-01-03");
    expect(normalizeDownloadUrl(null)).toBe("");
    expect(isLocalDownloadUrl("/downloads/skills/demo.zip")).toBe(true);
    expect(
      localDownloadSourcePath("/downloads/mcp/demo.mcpb", "/workspace/content"),
    ).toBe(path.join("/workspace/content", "mcp", "demo.mcpb"));

    const skill = buildContentEntryFromMdx({
      category: "skills",
      fileName: "branch-skill.mdx",
      filePath: "/workspace/content/skills/branch-skill.mdx",
      repoRoot: "/workspace",
      contentRoot: "/workspace/content",
      contentUpdatedAt: "2026-01-04T00:00:00Z",
      getLocalDownloadSha256: (downloadPath: string) =>
        downloadPath.endsWith("branch-skill.zip") ? "sha256-local" : null,
      source: [
        "---",
        'title: "Branch Skill"',
        'slug: "branch-skill"',
        'description: "Reusable skill package fixture."',
        'repoUrl: "https://github.com/Example/Repo"',
        "dateAdded: 2026-01-01",
        'downloadUrl: "/downloads/skills/branch-skill.zip"',
        "packageVerified: true",
        'submittedBy: "Contributor"',
        "sourceSubmissionNumber: 12",
        'claimStatus: "verified"',
        "platformCompatibility:",
        "  - platform: Cursor",
        "    supportLevel: adapter",
        "    installPath: .cursor/rules/branch-skill.mdc",
        "  - platform: ''",
        "    supportLevel: ''",
        "prerequisites:",
        "  - Claude Code installed",
        "safetyNotes:",
        "  - Runs local shell commands after review.",
        "privacyNotes:",
        "  - Reads selected repository files.",
        "---",
        "",
        "Use https://github.com/Example/Repo for setup.",
        "",
        "## Usage",
        "",
        "```bash",
        "claude skill run branch-skill",
        "```",
        "",
        "## Troubleshooting",
        "",
        "Check logs.",
      ].join("\n"),
    });
    expect(skill.downloadTrust).toBe("first-party");
    expect(skill.skillPackage).toMatchObject({ sha256: "sha256-local" });
    expect(skill.repoUrl).toBe("https://github.com/Example/Repo");
    expect(skill.platformCompatibility).toEqual([
      expect.objectContaining({ platform: "Cursor", supportLevel: "adapter" }),
    ]);
    expect(skill.hasPrerequisites).toBe(true);
    expect(skill.hasTroubleshooting).toBe(true);

    const tool = buildContentEntryFromMdx({
      category: "tools",
      fileName: "branch-tool.mdx",
      filePath: "/workspace/content/tools/branch-tool.mdx",
      repoRoot: "/workspace",
      contentRoot: "/workspace/content",
      source: [
        "---",
        'title: "Branch Tool"',
        'description: "Hosted tool listing fixture."',
        'websiteUrl: "https://tool.example.com"',
        'affiliateUrl: "https://tool.example.com/?ref=heyclaude"',
        'pricingModel: "paid"',
        'disclosure: "affiliate"',
        "hasPrerequisites: false",
        "hasTroubleshooting: false",
        "robotsIndex: false",
        "---",
        "",
        "Hosted setup guide.",
      ].join("\n"),
    });
    expect(tool.affiliateUrl).toContain("ref=heyclaude");
    expect(tool.downloadTrust).toBeNull();
    expect(tool.hasPrerequisites).toBe(false);
    expect(tool.githubUrl).toContain("content/tools/branch-tool.mdx");
  });

  it("covers registry artifact builders with sparse, trusted, and commercial entries", () => {
    expect(truncateText("abcdef", 4)).toBe("a...");
    expect(generatedAtForEntries([])).toMatch(/T/);
    expect(dataUrl("entries", "mcp", "demo.json")).toBe(
      "/data/entries/mcp/demo.json",
    );

    const directory = buildDirectoryEntries(artifactEntries);
    const search = buildSearchEntries(artifactEntries);
    expect(directory).toHaveLength(artifactEntries.length);
    expect(search).toHaveLength(artifactEntries.length);
    expect(buildEntryTrustSignals(artifactEntries[0]).sourceStatus).toBe(
      "available",
    );
    expect(buildCursorSkillAdapter(artifactEntries[1])).toContain(
      "Branch Matrix",
    );
    expect(buildRaycastEntries(artifactEntries).length).toBeGreaterThan(0);
    expect(buildRaycastDetail(artifactEntries[0])).toMatchObject({
      schemaVersion: 2,
    });
    expect(buildEntryDetail(artifactEntries[0]).entry.slug).toBe(
      "mcp-branch-matrix",
    );
    expect(buildArtifactEnvelope("test", artifactEntries).count).toBe(
      artifactEntries.length,
    );
    expect(buildEnvelopeEntries({ entries: artifactEntries })).toHaveLength(
      artifactEntries.length,
    );
    expect(buildReadOnlyEcosystemFeed(artifactEntries).entries.length).toBe(
      artifactEntries.length,
    );
    expect(
      buildMcpRegistryFeed(artifactEntries).servers.length,
    ).toBeGreaterThan(0);
    expect(
      buildPluginExportFeed(artifactEntries).plugins.length,
    ).toBeGreaterThan(0);
    expect(buildRegistryChangelogFeed(artifactEntries).entries.length).toBe(
      artifactEntries.length,
    );
    expect(
      buildCategoryDistributionFeed(artifactEntries, "mcp").entries,
    ).toHaveLength(1);
    expect(
      buildPlatformDistributionFeed(artifactEntries, "Claude").entries,
    ).not.toHaveLength(0);
    expect(
      buildDistributionFeedIndex(artifactEntries).categories.length,
    ).toBeGreaterThan(0);
    expect(platformFeedSlug("Claude Code")).toBe("claude-code");
    expect(buildRegistryManifest(artifactEntries).totalEntries).toBe(
      artifactEntries.length,
    );
    expect(buildArtifactManifestV2(artifactEntries).routes.length).toBe(
      artifactEntries.length,
    );
    expect(buildContentQualityArtifact(artifactEntries).entries.length).toBe(
      artifactEntries.length,
    );
    expect(buildContentPromptArtifact(artifactEntries).prompts.length).toBe(
      artifactEntries.length,
    );
    expect(buildJsonLdSnapshots(artifactEntries).entries.length).toBe(
      artifactEntries.length,
    );
    expect(buildEntryLlmsArtifact(artifactEntries[0])).toContain(
      "Branch Matrix",
    );
    expect(buildCorpusLlmsArtifact(artifactEntries)).toContain(
      "HeyClaude Full Corpus",
    );
    expect(buildRegistryArtifactSet(artifactEntries).length).toBeGreaterThan(0);
    expect(
      buildRegistryTrustReport(artifactEntries).summary.sourceAvailableCount,
    ).toBeGreaterThan(0);
  });

  it("covers presentation and artifact fallback branches", () => {
    expect(compactCount(999)).toBe("999");
    expect(compactCount(12_500)).toBe("13k");
    expect(parseAbbreviatedCount("1.2k")).toBe(1200);
    expect(parseAbbreviatedCount("2m")).toBe(2_000_000);
    expect(parseAbbreviatedCount("3b")).toBe(3_000_000_000);
    expect(parseAbbreviatedCount("")).toBeNull();
    expect(parseAbbreviatedCount("bad")).toBeNull();
    expect(firstUsefulLine("")).toBe("");
    expect(
      firstUsefulLine(
        [
          "# Heading",
          "```",
          "// ignored",
          "```",
          "<!-- ignored -->",
          "Useful line",
        ].join("\n"),
      ),
    ).toBe("Useful line");
    expect(extractConfigCommand('{"command":"node"}')).toBe("node");
    expect(extractConfigCommand("{'command':'uvx'}")).toBe("uvx");
    expect(extractConfigCommand("run fallback")).toBe("run fallback");
    expect(buildCollectionSequence({ items: [] })).toBe("");
    expect(
      buildCollectionSequence({
        items: [
          { category: "mcp", slug: "one" },
          { category: "skills", slug: "two" },
          { category: "hooks", slug: "three" },
          { category: "commands", slug: "four" },
        ],
      }),
    ).toBe("`one` -> `two` -> `three`");

    const presentationEntries = [
      entry("agents", { body: "# Agent\n\nDo the workflow." }),
      entry("rules", { body: "", copySnippet: "Always check sources." }),
      entry("hooks", {
        installCommand: "",
        configSnippet: '{"hooks":[{"command":"uvx hook"}]}',
        trigger: "PostToolUse",
        scriptBody: "#!/usr/bin/env bash\necho hook",
      }),
      entry("hooks", {
        installCommand: "",
        configSnippet: "",
        trigger: "Notification",
        scriptBody: "",
        copySnippet: "",
      }),
      entry("statuslines", {
        configSnippet: '{"command":"statusline"}',
        copySnippet: "statusline --json",
        usageSnippet: "Show repo status.",
      }),
      entry("statuslines", {
        configSnippet: "",
        copySnippet: "",
        usageSnippet: "Show repo status.",
      }),
      entry("collections", {
        usageSnippet: "",
        items: [
          { category: "mcp", slug: "one" },
          { category: "skills", slug: "two" },
        ],
      }),
      entry("collections", { usageSnippet: "Start here.", items: [] }),
      entry("commands", {
        installCommand: "",
        commandSyntax: "",
        configSnippet: "claude command add demo",
        copySnippet: "/demo",
      }),
      entry("guides", {
        body: "",
        copySnippet: "",
        usageSnippet: "Read this guide first.",
      }),
      entry("tools", {
        copySnippet: "",
        installCommand: "",
        usageSnippet: "",
        body: "",
        documentationUrl: "https://example.com/docs",
        downloadUrl: "",
      }),
      entry("tools", {
        copySnippet: "",
        installCommand: "",
        usageSnippet: "",
        body: "",
        documentationUrl: "",
        githubUrl: "https://github.com/example/tool",
      }),
      entry("tools", {
        copySnippet: "",
        installCommand: "",
        usageSnippet: "",
        body: "",
        documentationUrl: "",
        githubUrl: "",
        downloadUrl: "https://example.com/tool.zip",
      }),
      entry("tools", {
        copySnippet: "",
        installCommand: "",
        usageSnippet: "",
        body: "",
        documentationUrl: "",
        githubUrl: "",
        downloadUrl: "",
        codeBlocks: [{ code: "copy from code block" }],
      }),
    ];

    for (const item of presentationEntries) {
      expect(getPreviewLine(item)).toBeTruthy();
      expect(getCopyText(item)).toBeTruthy();
      expect(getEntryAccessSummary(item)).toMatchObject({
        copyOnly: expect.any(Boolean),
      });
    }

    const rich = entry("skills", {
      brandDomain: "example.com",
      brandIconUrl: "https://example.com/icon.png",
      trustSignals: { checksumPresent: true, adapterGenerated: true },
      claimStatus: "verified",
      reviewedBy: "",
      downloadTrust: "external",
    });
    expect(getDistributionBadges(rich).map((badge) => badge.label)).toEqual(
      expect.arrayContaining([
        "ZIP",
        "brand",
        "checksum",
        "adapter",
        "claimed",
      ]),
    );
    expect(
      getDistributionBadges(
        entry("tools", {
          installCommand: "",
          configSnippet: "",
          downloadUrl: "",
          documentationUrl: "",
          repoUrl: "",
          githubUrl: "",
          downloadSha256: "",
          trustSignals: {},
          safetyNotes: [],
          privacyNotes: [],
          reviewedBy: "Maintainer",
          claimStatus: "",
        }),
      ).map((badge) => badge.label),
    ).toEqual(["Raycast", "copy-only", "reviewed"]);
    expect(buildRaycastDetailMarkdown(rich)).toContain("## Trust");
    expect(buildRaycastEnvelope([rich])).toMatchObject({
      kind: "raycast-index",
      count: 1,
    });
    expect(buildArtifactHash({ ok: true })).toMatch(/^[a-f0-9]{64}$/);
    expect(buildSkillPlatformCompatibility(entry("mcp"))).toEqual([]);
  });

  it("covers commercial policy helpers and command safety classifications", () => {
    expect(normalizeCommercialTier("Sponsored")).toBe("sponsored");
    expect(normalizeLeadKind("job")).toBe("job");
    expect(normalizeDisclosure("affiliate")).toBe("affiliate");
    expect(normalizeDisclosure("paid affiliate")).toBe("editorial");
    expect(isPaidOrAffiliateDisclosure("sponsored")).toBe(true);
    expect(normalizePricingModel("subscription")).toBe("subscription");
    expect(normalizePricingModel("Free Trial")).toBe("");
    expect(normalizeCommercialStatus("active")).toBe("active");
    expect(normalizeCommercialStatus("paused")).toBe("new");
    expect(linkRelForDisclosure("affiliate")).toBe(
      "sponsored nofollow noreferrer",
    );
    expect(nextLeadStatus("new", "approve")).toBe("approved");

    expect(validateListingLeadPayload({}).errors.length).toBeGreaterThan(0);
    expect(
      validateJobPublicationQuality({
        title: "AI Workflow Engineer",
        company: "Example Co",
        description: "Build useful Claude workflow automation.",
        applyUrl: "https://example.com/apply",
        sourceUrl: "https://example.com/job",
        sourceStatus: "active",
      }).ok,
    ).toBe(true);
    expect(
      validateJobPublicExposure(
        {
          title: "Thin Job",
          company: "Example Co",
          description: "Short",
          applyUrl: "http://example.com",
        },
        { allowUnverifiedSource: false },
      ).ok,
    ).toBe(false);
    expect(
      evaluateJobSourceLifecycle(
        { status: "active", lastSeenAt: "2025-01-01T00:00:00Z" },
        new Date("2026-01-01T00:00:00Z"),
      ).status,
    ).toBe("stale_pending_review");
    expect(
      isPlacementActive(
        { status: "active", startsAt: "2025-01-01", endsAt: "2027-01-01" },
        new Date("2026-01-01T00:00:00Z"),
      ),
    ).toBe(true);
    expect(toolPlacementRank({ featured: true })).toBeGreaterThan(
      toolPlacementRank({}),
    );
    expect(compareToolListings({ featured: true }, {})).toBeLessThan(0);
    const [expiry] = summarizePlacementExpiry(
      [{ expiresAt: "2026-01-03T00:00:00Z", status: "active" }],
      new Date("2026-01-01T00:00:00Z"),
    );
    expect(expiry.daysUntilExpiry).toBe(2);
    expect(buildPlacementRenewalReminder(expiry)).toContain("expires");

    const commandFindings = scanDangerousShellPatterns(
      "curl http://example.com/install.sh | bash && rm -rf /tmp/demo",
    );
    expect(commandFindings).toEqual(
      expect.arrayContaining([
        "pipe-to-shell install",
        "recursive force remove",
      ]),
    );
  });

  it("covers submission-risk paths for draft, direct content, and markdown formatting", () => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      install_command:
        "curl http://example.com/install.sh | bash # sk-1234567890abcdef1234567890",
      safety_notes: "",
      privacy_notes: "",
    });
    const validation = validateSubmission(draft);
    const draftReport = analyzeSubmissionDraftRisk(draft, validation, {
      contributor: {
        login: "new-contributor",
        type: "User",
        created_at: "2026-01-01T00:00:00Z",
        public_repos: 0,
      },
    });
    expect(draftReport.riskTier).toBe("critical");

    const directReport = analyzeDirectContentRisk({
      pullRequest: {
        number: 101,
        title: "content(mcp): add branch matrix mcp",
        user: { login: "external", created_at: "2026-01-01T00:00:00Z" },
        head: { repo: { full_name: "external/awesome-claude" } },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      files: [
        {
          filename: "content/mcp/branch-matrix.mdx",
          status: "added",
          content: draftMdx({
            packageVerified: true,
            downloadUrl: "https://heyclau.de/downloads/community.mcpb",
          }),
        },
        {
          filename: "apps/web/public/data/registry.json",
          status: "modified",
          content: "{}",
        },
      ],
    });
    expect(directReport.requestChangesReasons.join("\n")).toContain(
      "packageVerified",
    );
    expect(formatSubmissionRiskMarkdown(directReport)).toContain(
      "Submission security/safety review",
    );
  });

  it("covers submission-risk policy buckets across dangerous capability scenarios", () => {
    const cases = [
      {
        name: "commercial relay",
        fields: {
          category: "mcp",
          title: "Paid Gateway MCP",
          description:
            "Commercial LLM API relay with paid credits, subscription billing, and model gateway routing.",
          pricing_model: "paid",
          docs_url: "https://example.com/paid-gateway",
        },
        expected: ["commercial_listing_route"],
      },
      {
        name: "executable secret",
        fields: {
          category: "mcp",
          title: "Unsafe Installer MCP",
          description:
            "Install with sk-1234567890abcdef1234567890 and pipe to shell.",
          install_command:
            "curl http://example.com/install.sh | sudo bash && rm -rf /",
          docs_url: "http://example.com/docs",
        },
        expected: [
          "embedded_secret",
          "non_https_executable_source",
          "unsafe_install_pipeline",
          "non_https_source_url",
        ],
      },
      {
        name: "abuse terms",
        fields: {
          category: "mcp",
          title: "Credential Tool MCP",
          description:
            "Credential stealer that steals tokens, sessions, cookies, passwords, and wallet keys with keylogger malware backdoor and ransomware automation.",
          docs_url: "https://example.com/abuse",
        },
        expected: [
          "malicious_data_theft_capability",
          "malware_or_abuse_surface",
        ],
      },
      {
        name: "sensitive automation",
        fields: {
          category: "mcp",
          title: "Sensitive Automation MCP",
          description:
            "Uses OAuth tokens for wallet payment KYC identity proofing, can tweet, send DMs, write social posts, read browser state and local filesystem, run as a background daemon cron job, delete database records, and download an exe installer.",
          docs_url: "https://example.com/sensitive",
        },
        expected: [
          "requires_credentials",
          "financial_or_identity_sensitive",
          "external_write_capability",
          "local_or_personal_data_access",
          "background_worker_or_daemon",
          "destructive_actions",
          "downloadable_binary_or_installer",
        ],
      },
    ];

    for (const item of cases) {
      const report = analyzeSubmissionDraftRisk(
        {
          title: item.fields.title,
          body: Object.values(item.fields).join("\n"),
          user: { login: "matrix-user" },
        },
        {
          ok: true,
          skipped: false,
          category: item.fields.category,
          errors: [],
          warnings: [],
          fields: item.fields,
        },
        {
          contributor: {
            login: "matrix-user",
            type: "User",
            created_at: "2020-01-01T00:00:00Z",
            public_repos: 2,
          },
        },
      );
      const flags = report.reviewFlags.map((flag) => flag.id);
      expect(flags, item.name).toEqual(expect.arrayContaining(item.expected));
    }
  });

  it("covers direct-content provenance, generated artifact, and frontmatter blockers", () => {
    const report = analyzeDirectContentRisk({
      pullRequest: {
        number: 202,
        title: "content(mcp): add risky content",
        user: { login: "external-author" },
        head: { repo: { full_name: "external/awesome-claude" } },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      files: [
        {
          filename: "content/skills/wrong-category.mdx",
          status: "added",
          content: draftMdx({
            category: "mcp",
            submittedBy: "someone-else",
            submittedByUrl: "https://github.com/someone-else",
            downloadUrl: "/downloads/skills/community.zip",
            packageVerified: true,
          }),
        },
        {
          filename: "content/mcp/broken-frontmatter.mdx",
          status: "added",
          content: "---\n: broken\n---\n",
        },
        {
          filename: "README.md",
          status: "modified",
          content: "generated readme",
        },
        {
          filename: "apps/web/public/data/directory-index.json",
          status: "modified",
          content: "{}",
        },
        {
          filename: "apps/web/public/downloads/community.zip",
          status: "added",
          content: "",
        },
        {
          filename: "content/skills/community.zip",
          status: "added",
          content: "",
        },
        {
          filename: "content/mcp/missing-content.mdx",
          status: "added",
        },
      ],
    });

    expect(report.provenanceStatus).toBe("failed");
    expect(report.reviewFlags.map((flag) => flag.id)).toEqual(
      expect.arrayContaining([
        "invalid_frontmatter",
        "missing_pr_file_content",
        "community_local_download_request",
      ]),
    );
    expect(report.classificationWarnings.map((warning) => warning.id)).toEqual(
      expect.arrayContaining([
        "category_path_mismatch",
        "generated_readme_change",
        "generated_registry_artifact_change",
        "community_package_artifact_change",
        "unsafe_package_verified_true",
      ]),
    );
    expect(directContentRequestChangesReasons(report).length).toBeGreaterThan(
      0,
    );
  });

  it("covers submission-gate review normalization and comment branches", () => {
    expect(
      parsePrivateGateDecisionResponseBody('{"decision":{"verdict":"manual"}}'),
    ).toMatchObject({ verdict: "manual" });
    expect(normalizePrivateGateDecisionPayload("not-json").error?.code).toBe(
      "invalid_private_response",
    );
    expect(
      normalizePrivateGateDecisionPayload({
        error: { code: "github_rate_limited", retryable: true },
      }).error,
    ).toMatchObject({ code: "github_rate_limited" });
    expect(
      normalizePrivateGateDecisionPayload({
        schemaVersion: 2,
        verdict: "manual",
        confidence: 0.9,
        summary: "Manual review required.",
        labels: ["submission-manual-review", ""],
        checks: [{ name: "validate-content", status: "passed" }],
        sections: [{ id: "summary", title: "Summary", bullets: ["Review."] }],
      }).decision,
    ).toMatchObject({ verdict: "manual" });
    expect(
      normalizePrivateGateDecisionPayload({
        schemaVersion: 2,
        verdict: "manual",
        confidence: 0.8,
        summary: "AI maintainer review returned an unexpected payload",
        labels: [],
        checks: [],
        sections: [{ id: "summary", bullets: ["parse failure"] }],
      }).error?.code,
    ).toBe("invalid_private_response");

    const retryable = privateReviewErrorDecision(
      "Temporary review outage.",
      "private_reviewer_unavailable",
    );
    expect(isRetryableGateDecision(retryable)).toBe(true);
    expect(markerComment()).toContain("Public validation running");
    expect(markerComment(defaultManualDecision("Manual review"))).toContain(
      "Manual review",
    );
    expect(retryingReviewComment(undefined, { stage: "validation" })).toContain(
      "Public validation",
    );
    expect(
      retryingReviewComment(undefined, {
        code: "private_reviewer_unavailable",
        attempt: 2,
        maxAttempts: 5,
        nextReviewAt: "2026-01-01T00:01:00Z",
        summary: "temporary outage",
      }),
    ).toContain("private_reviewer_unavailable");
    expect(
      supersededReviewComment(undefined, "https://example.com/comment"),
    ).toContain("https://example.com/comment");
    expect(approvalReviewBody()).toContain("Approved");
    expect(
      duplicateEvidenceContractExhaustedDecision({
        decision: defaultManualDecision("duplicate conflict"),
        duplicateSummary: "no strict duplicate",
      }).errors?.[0].retryable,
    ).toBe(false);
    expect(
      enforceAutoMergeConfidenceFloor({
        verdict: "merge",
        confidence: 0.5,
        labels: ["submission-merged-by-gate"],
        summary: "Looks okay.",
      }).verdict,
    ).toBe("manual");
    expect(validationFailedDecision("validate-content failed").close).toBe(
      true,
    );
  });

  it("covers GitHub helper branches with mocked API responses", async () => {
    expect(parseRepo("owner/repo")).toEqual({ owner: "owner", repo: "repo" });
    expect(() => parseRepo("bad")).toThrow("Expected owner/repo");
    expect(
      buildGitHubAppAuthorizeUrl({
        clientId: "client",
        callbackUrl: "https://example.com/callback",
        state: "state",
      }),
    ).toContain("client_id=client");

    const rateLimit = new GitHubApiError(403, "secondary rate limit", {
      rateLimitRemaining: 0,
      retryAfterSeconds: 30,
    });
    expect(isGitHubRateLimitError(rateLimit)).toBe(true);
    expect(githubRetryDelaySeconds(rateLimit, 15)).toBe(30);
    expect(githubRetryDelaySeconds(new Error("nope"), 15)).toBe(15);

    const originalFetch = globalThis.fetch;
    const calls: string[] = [];
    globalThis.fetch = (async (url: string) => {
      calls.push(url);
      if (url.includes("check-runs")) {
        return new Response(
          JSON.stringify({
            check_runs: [
              {
                name: "validate-web",
                status: "completed",
                conclusion: "success",
                app: { slug: "github-actions" },
                completed_at: "2026-01-01T00:00:00Z",
              },
              {
                name: "coverage",
                status: "completed",
                conclusion: "failure",
                app: { slug: "github-actions" },
                completed_at: "2026-01-01T00:01:00Z",
              },
              {
                name: "Contributor trust",
                status: "completed",
                conclusion: "neutral",
                app: { slug: "superagent" },
              },
            ],
          }),
          { status: 200 },
        );
      }
      return new Response(
        JSON.stringify({
          statuses: [{ context: "CodeRabbit", state: "pending" }],
        }),
        { status: 200 },
      );
    }) as typeof fetch;
    try {
      await expect(
        githubJson("https://api.github.com/test", { token: "token" }),
      ).resolves.toBeDefined();
      const state = await getCommitValidationState({
        token: "token",
        repo: { owner: "owner", repo: "repo" },
        ref: "sha",
        requiredChecks: [
          "validate-web",
          "coverage",
          "missing-check",
          "Contributor trust",
        ],
        requiredStatusContexts: ["CodeRabbit"],
      });
      expect(state.state).toBe("failed");
      expect(state.summary).toContain("coverage");
      expect(calls.some((url) => url.includes("check-runs"))).toBe(true);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("covers MCP registry tools, resources, prompts, and submission helpers", async () => {
    const realEntries = loadContentEntries();
    const skill = realEntries.find(
      (candidate) => candidate.category === "skills",
    );
    const other = realEntries.find(
      (candidate) =>
        candidate.category === skill?.category && candidate.slug !== skill.slug,
    );
    expect(skill).toBeTruthy();
    expect(other).toBeTruthy();

    const calls = [
      registryMcp.searchRegistry(
        {
          query: "mcp",
          category: "mcp",
          platform: "Claude Code",
          hasSafetyNotes: "true",
          hasPrivacyNotes: "false",
          downloadTrust: "all",
          claimStatus: "verified",
          sourceStatus: "available",
          limit: "2",
        },
        mcpOptions,
      ),
      registryMcp.planWorkflowToolbox({ goal: "x" }, mcpOptions),
      registryMcp.planWorkflowToolbox(
        { goal: "code review automation", platform: "cursor", limit: 20 },
        mcpOptions,
      ),
      registryMcp.recommendForTask({ task: "x" }, mcpOptions),
      registryMcp.recommendForTask(
        { task: "source-backed MCP review", category: "mcp" },
        mcpOptions,
      ),
      registryMcp.getServerInfo({}, mcpOptions),
      registryMcp.listCategoryEntries(
        { category: "mcp", tag: "testing", offset: -5, limit: 2 },
        mcpOptions,
      ),
      registryMcp.getRecentUpdates({ since: "not-a-date" }, mcpOptions),
      registryMcp.getRecentUpdates(
        { since: "2025-01-01", limit: 3 },
        mcpOptions,
      ),
      registryMcp.getRelatedEntries(
        { category: skill!.category, slug: skill!.slug, limit: 3 },
        mcpOptions,
      ),
      registryMcp.getRelatedEntries(
        { category: "missing", slug: "missing" },
        mcpOptions,
      ),
      registryMcp.getEntryDetail({}, mcpOptions),
      registryMcp.getEntryDetail(
        { category: skill!.category, slug: skill!.slug, bodyMode: "none" },
        mcpOptions,
      ),
      registryMcp.getEntryDetail(
        { category: skill!.category, slug: skill!.slug, bodyMode: "full" },
        mcpOptions,
      ),
      registryMcp.getCopyableAsset(
        { category: skill!.category, slug: skill!.slug, assetType: "missing" },
        mcpOptions,
      ),
      registryMcp.compareEntries(
        {
          platform: "Claude Code",
          entries: [
            { category: skill!.category, slug: skill!.slug },
            { category: other!.category, slug: other!.slug },
          ],
        },
        mcpOptions,
      ),
      registryMcp.getRegistryStats({}, mcpOptions),
      registryMcp.getClientSetup({ client: "cursor", endpointUrl: "bad url" }),
      registryMcp.getClientSetup({
        client: "remote-http",
        endpointUrl: "https://example.com/mcp",
      }),
      registryMcp.getCompatibility({}, mcpOptions),
      registryMcp.getCompatibility({ slug: skill!.slug }, mcpOptions),
      registryMcp.getInstallGuidance(
        { category: skill!.category, slug: skill!.slug, platform: "cursor" },
        mcpOptions,
      ),
      registryMcp.getPlatformAdapter(
        { slug: skill!.slug, platform: "claude" },
        mcpOptions,
      ),
      registryMcp.getPlatformAdapter(
        { slug: "missing", platform: "cursor" },
        mcpOptions,
      ),
      registryMcp.listDistributionFeeds({}, mcpOptions),
      registryMcp.listRegistryRecent(mcpOptions),
      registryMcp.listRegistryTrending({
        fetchPublicApi: async () => ({
          schemaVersion: 2,
          category: "mcp",
          entries: [
            {
              category: "mcp",
              slug: "demo",
              title: "Demo",
              score: 12,
              reasons: ["recent"],
            },
          ],
        }),
      }),
      registryMcp.listRegistryTrending({
        fetchPublicApi: async () => ({ ok: true }),
      }),
      registryMcp.listJobsActive({
        fetchPublicApi: async () => ({
          schemaVersion: 1,
          totalAvailable: 1,
          entries: [{ slug: "job", title: "Job", labels: ["remote"] }],
        }),
      }),
      registryMcp.listJobsActive({
        fetchPublicApi: async () => {
          throw new Error("offline");
        },
      }),
      registryMcp.listRegistryResources({}, mcpOptions),
      registryMcp.readRegistryResource({ uri: "not-a-uri" }, mcpOptions),
      registryMcp.readRegistryResource(
        { uri: "https://example.com/not-heyclaude" },
        mcpOptions,
      ),
      registryMcp.readRegistryResource(
        { uri: "heyclaude://category/../bad" },
        mcpOptions,
      ),
      registryMcp.readRegistryResource(
        { uri: `heyclaude://entry/${skill!.category}/${skill!.slug}` },
        mcpOptions,
      ),
      registryMcp.readRegistryResource(
        { uri: "heyclaude://registry/trending" },
        {
          fetchPublicApi: async () => ({
            entries: [{ category: "mcp", slug: "demo" }],
          }),
        },
      ),
      registryMcp.readRegistryResource(
        { uri: "heyclaude://jobs/active" },
        { fetchPublicApi: async () => ({ entries: [{ slug: "job" }] }) },
      ),
      registryMcp.explainEntryTrust({}, mcpOptions),
      registryMcp.explainEntryTrust(
        { category: skill!.category, slug: skill!.slug },
        mcpOptions,
      ),
      registryMcp.reviewEntrySafety(
        {
          platform: "Claude Code",
          entries: [{ category: skill!.category, slug: skill!.slug }],
        },
        mcpOptions,
      ),
      registryMcp.callRegistryTool("unknown", {}, mcpOptions),
      registryMcp.callRegistryTool(
        "entry.detail",
        { category: skill!.category, slug: skill!.slug },
        mcpOptions,
      ),
      registryMcp.callRegistryTool(
        "entry.detail",
        { category: "", slug: "" },
        mcpOptions,
      ),
    ];

    const results = await Promise.all(calls);
    expect(results.length).toBe(calls.length);
    expect(results.some((result: any) => result.ok === false)).toBe(true);
    expect(registryMcp.listRegistryPrompts().prompts.length).toBeGreaterThan(0);
    expect(
      registryMcp.getRegistryPrompt({ name: "unknown" }).messages[0].content
        .text,
    ).toContain("Unknown");
    expect(
      registryMcp.getRegistryPrompt({
        name: "asset.find",
        arguments: {
          use_case: "review PRs",
          category: "mcp",
          platform: "Codex",
        },
      }).messages[0].content.text,
    ).toContain("review PRs");
  });

  it("covers MCP registry edge helpers with synthetic artifacts", async () => {
    const entries = [
      {
        category: "skills",
        slug: "alpha-skill",
        title: "Alpha Skill",
        description: "Alpha skill with full trust metadata.",
        body: "Alpha body.",
        tags: ["lint", "review"],
        keywords: ["branch", "matrix"],
        platforms: ["claude-code", "cursor"],
        dateAdded: "2026-01-01",
        updatedAt: "2026-01-03",
        repoUrl: "https://github.com/example/alpha-skill",
        documentationUrl: "https://docs.example.com/alpha",
        safetyNotes: ["Runs local commands."],
        privacyNotes: ["Reads selected project files."],
        downloadUrl: "https://example.com/alpha.zip",
        downloadTrust: "first-party",
        packageVerified: true,
        claimStatus: "verified",
        reviewedBy: "JSONbored",
      },
      {
        category: "skills",
        slug: "beta-skill",
        title: "Beta Skill",
        description: "Beta skill with partial metadata.",
        body: "Beta body.",
        tags: ["lint"],
        keywords: ["branch"],
        platforms: ["cursor"],
        dateAdded: "2026-01-02",
        updatedAt: "2026-01-02",
        sourceUrl: "https://docs.example.com/beta",
        safetyNotes: [],
        privacyNotes: ["Reads workspace files."],
        claimStatus: "unclaimed",
      },
      {
        category: "mcp",
        slug: "gamma-mcp",
        title: "Gamma MCP",
        description: "MCP entry without source metadata.",
        body: "Gamma body.",
        tags: [],
        keywords: [],
        platforms: [],
        dateAdded: "2026-01-02",
        safetyNotes: [],
        privacyNotes: [],
      },
    ];
    const syntheticOptions = {
      async readJsonArtifact(relativePath: string) {
        if (relativePath === "search-index.json") return { entries };
        if (relativePath === "relation-graph.json") {
          throw new Error("relation graph missing");
        }
        const entryMatch = relativePath.match(
          /^entries\/([^/]+)\/([^/]+)\.json$/,
        );
        if (entryMatch) {
          const [, category, slug] = entryMatch;
          const entry = entries.find(
            (candidate) =>
              candidate.category === category && candidate.slug === slug,
          );
          if (entry) return { entry };
        }
        throw new Error(`unexpected json artifact ${relativePath}`);
      },
      async readTextArtifact(relativePath: string) {
        if (relativePath === "skill-adapters/cursor/alpha-skill.mdc") {
          return "# Alpha Cursor adapter";
        }
        throw new Error(`unexpected text artifact ${relativePath}`);
      },
    };

    await expect(
      registryMcp.searchRegistry({ hasSafetyNotes: "true" }, syntheticOptions),
    ).resolves.toMatchObject({ count: 1 });
    await expect(
      registryMcp.searchRegistry(
        { hasPrivacyNotes: "false" },
        syntheticOptions,
      ),
    ).resolves.toMatchObject({ count: 1 });
    await expect(
      registryMcp.searchRegistry(
        { downloadTrust: "first-party" },
        syntheticOptions,
      ),
    ).resolves.toMatchObject({ count: 1 });
    await expect(
      registryMcp.searchRegistry({ claimStatus: "verified" }, syntheticOptions),
    ).resolves.toMatchObject({ count: 1 });
    await expect(
      registryMcp.searchRegistry({ sourceStatus: "missing" }, syntheticOptions),
    ).resolves.toMatchObject({
      entries: [expect.objectContaining({ slug: "gamma-mcp" })],
    });

    await expect(
      registryMcp.getRelatedEntries(
        { category: "skills", slug: "alpha-skill", limit: 5 },
        syntheticOptions,
      ),
    ).resolves.toMatchObject({
      ok: true,
      entries: [
        expect.objectContaining({
          slug: "beta-skill",
          relatedReasons: expect.arrayContaining(["same_category", "tag:lint"]),
        }),
      ],
    });
    await expect(
      registryMcp.getRelatedEntries(
        { category: "skills", slug: "missing" },
        syntheticOptions,
      ),
    ).resolves.toMatchObject({ ok: false, error: { code: "not_found" } });

    await expect(
      registryMcp.readRegistryResource(
        { uri: "heyclaude://category/bad!" },
        syntheticOptions,
      ),
    ).resolves.toMatchObject({
      contents: [expect.objectContaining({ mimeType: "application/json" })],
    });
    await expect(
      registryMcp.readRegistryResource(
        { uri: "heyclaude://unsupported/path" },
        syntheticOptions,
      ),
    ).resolves.toMatchObject({ contents: [expect.any(Object)] });

    await expect(
      registryMcp.getCompatibility({}, syntheticOptions),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "invalid_request" },
    });
    await expect(
      registryMcp.getCompatibility({ slug: "alpha-skill" }, syntheticOptions),
    ).resolves.toMatchObject({
      ok: true,
      platformCompatibility: expect.arrayContaining([
        expect.objectContaining({ platform: "Cursor" }),
      ]),
    });
    await expect(
      registryMcp.getInstallGuidance({}, syntheticOptions),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "invalid_request" },
    });
    await expect(
      registryMcp.getInstallGuidance(
        { category: "skills", slug: "alpha-skill", platform: "Cursor" },
        syntheticOptions,
      ),
    ).resolves.toMatchObject({
      ok: true,
      selectedCompatibility: expect.objectContaining({ platform: "Cursor" }),
    });
    await expect(
      registryMcp.getPlatformAdapter(
        { slug: "alpha-skill", platform: "Claude" },
        syntheticOptions,
      ),
    ).resolves.toMatchObject({ ok: true, adapterAvailable: false });
    await expect(
      registryMcp.getPlatformAdapter(
        { slug: "beta-skill", platform: "Cursor" },
        syntheticOptions,
      ),
    ).resolves.toMatchObject({ ok: false, error: { code: "not_found" } });
    await expect(
      registryMcp.explainEntryTrust(
        { category: "skills", slug: "missing" },
        syntheticOptions,
      ),
    ).resolves.toMatchObject({ ok: false, error: { code: "not_found" } });
    await expect(
      registryMcp.reviewEntrySafety(
        { entries: [{ category: "skills", slug: "missing" }] },
        syntheticOptions,
      ),
    ).resolves.toMatchObject({ ok: false, error: { code: "not_found" } });
    await expect(
      registryMcp.callRegistryTool(
        "registry.search",
        { limit: 0 },
        syntheticOptions,
      ),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "invalid_request", details: expect.any(Array) },
    });
  });

  it("covers MCP registry public API fetch URL normalization and failures", async () => {
    const originalFetch = globalThis.fetch;
    const originalBase = process.env.HEYCLAUDE_PUBLIC_API_URL;
    try {
      const calls: string[] = [];
      globalThis.fetch = (async (url: URL | string, init?: RequestInit) => {
        calls.push(String(url));
        expect(init).toMatchObject({
          method: "GET",
          redirect: "error",
        });
        expect(init?.headers).toEqual({ accept: "application/json" });
        expect(init?.signal).toBeInstanceOf(AbortSignal);

        if (String(url).includes("/api/registry/trending")) {
          return Response.json({
            schemaVersion: 2,
            category: "",
            platform: "",
            signalsAvailable: { votes: true },
            entries: [
              {
                category: "mcp",
                slug: "trending-mcp",
                title: "Trending MCP",
                score: 7,
                reasons: ["votes"],
              },
            ],
          });
        }
        if (String(url).includes("/api/jobs")) {
          return Response.json({
            schemaVersion: 1,
            totalAvailable: "unknown",
            entries: [
              {
                slug: "job-1",
                title: "Job",
                url: "https://example.com/job",
                labels: "remote",
              },
            ],
          });
        }
        return new Response("down", { status: 503 });
      }) as typeof fetch;

      await expect(
        registryMcp.listRegistryTrending({
          publicApiBaseUrl: "https://api.example.com///",
        }),
      ).resolves.toMatchObject({
        ok: true,
        category: "all",
        platform: "all",
        signalsAvailable: { votes: true },
      });

      process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env.example.com///";
      await expect(registryMcp.listJobsActive()).resolves.toMatchObject({
        ok: true,
        totalAvailable: null,
        entries: [expect.objectContaining({ labels: [] })],
      });

      globalThis.fetch = (async () =>
        new Response("down", { status: 503 })) as typeof fetch;
      await expect(
        registryMcp.listRegistryTrending({
          publicApiBaseUrl: "https://api.example.com",
        }),
      ).resolves.toMatchObject({
        ok: false,
        error: { code: "unavailable" },
      });

      expect(calls).toEqual([
        "https://api.example.com/api/registry/trending?limit=25",
        "https://env.example.com/api/jobs?limit=25",
      ]);
    } finally {
      globalThis.fetch = originalFetch;
      if (originalBase === undefined) {
        delete process.env.HEYCLAUDE_PUBLIC_API_URL;
      } else {
        process.env.HEYCLAUDE_PUBLIC_API_URL = originalBase;
      }
    }
  });

  it("covers MCP submission spec helpers with valid, invalid, and duplicate payloads", async () => {
    const specUrl = pathToFileURL(
      path.join(dataRoot, "submission-spec.json"),
    ).href;
    const spec = await import(specUrl, {
      with: { type: "json" },
    }).then((module) => module.default);
    const entries = loadContentEntries();

    expect(
      normalizeSubmissionFields({
        tags: ["one", "two"],
        source_url: "https://example.com",
      }),
    ).toMatchObject({
      tags: "one, two",
      docs_url: "https://example.com",
    });
    expect(getSubmissionSchemaFromSpec(spec, { category: "mcp" }).ok).toBe(
      true,
    );
    expect(getSubmissionSchemaFromSpec(spec, { category: "missing" }).ok).toBe(
      false,
    );
    expect(
      validateSubmissionDraftFromSpec(spec, { fields: validMcpFields }).valid,
    ).toBe(true);
    expect(
      validateSubmissionDraftFromSpec(spec, { fields: { category: "mcp" } })
        .valid,
    ).toBe(false);
    expect(buildPrDraftFromSpec(spec, validMcpFields).body).toContain(
      "Branch Matrix",
    );
    expect(
      buildSubmissionUrlsFromSpec(spec, { fields: validMcpFields }).ok,
    ).toBe(true);
    expect(
      getCategorySubmissionGuidanceFromSpec(spec, { category: "mcp" }).ok,
    ).toBe(true);
    expect(
      getSubmissionExamplesFromSpec(spec, { category: "mcp" }).categories
        .length,
    ).toBeGreaterThan(0);
    expect(
      prepareSubmissionDraftFromSpec(spec, { fields: validMcpFields }).ok,
    ).toBe(true);
    expect(
      reviewSubmissionDraftFromSpec(spec, { fields: validMcpFields }, entries)
        .ok,
    ).toBe(true);
    expect(
      searchDuplicateEntries(entries, {
        category: entries[0].category,
        slug: entries[0].slug,
        title: entries[0].title,
        url: entries[0].repoUrl,
      }).matches.length,
    ).toBeGreaterThan(0);
  });

  it("covers MCP install config normalization and target invariants", () => {
    const stdio = normalizeMcpServerConfig({
      command: "npx",
      args: [1, true, "@example/mcp"],
      env: { PORT: 3000, DEBUG: false },
    });
    expect(stdio).toMatchObject({
      type: "stdio",
      command: "npx",
      args: ["1", "true", "@example/mcp"],
    });
    expect(mcpInstallTargetsForConfig(stdio)).toEqual([
      "claude-code",
      "codex",
      "cursor",
      "antigravity",
    ]);
    expect(
      normalizeMcpServerConfig({ command: "uvx", args: ["example-mcp"] }),
    ).toMatchObject({ type: "stdio", command: "uvx" });
    expect(
      normalizeMcpServerConfig({ command: "node", args: ["server.js"] }),
    ).toMatchObject({ type: "stdio", command: "node" });
    expect(
      mcpInstallTargetsForConfig({ command: "node", args: ["server.js"] }),
    ).toEqual(["claude-code", "codex", "cursor", "antigravity"]);

    const remoteWithHeaders = {
      type: "http",
      url: "https://example.com/mcp",
      headers: { "x-api-key": "static" },
    };
    expect(mcpConfigSupportsTarget(remoteWithHeaders, "codex")).toBe(false);
    expect(
      mcpConfigSupportsTarget(
        { ...remoteWithHeaders, bearer_token_env_var: "MCP_TOKEN" },
        "codex",
      ),
    ).toBe(true);
    expect(
      mcpInstallTargetsForConfig({
        type: "sse",
        url: "https://example.com/sse",
      }),
    ).not.toContain("codex");
    expect(
      normalizeMcpServerConfig({
        type: "sse",
        url: "http://localhost:3000/sse",
        env_http_headers: { Authorization: "MCP_TOKEN" },
      }),
    ).toMatchObject({ type: "sse" });

    expect(normalizeMcpServerConfig(null)).toBeNull();
    expect(
      normalizeMcpServerConfig({
        transport: "streamable-http",
        url: "https://example.com/mcp",
      }),
    ).toBeNull();
    expect(normalizeMcpServerConfig({ serverUrl: " " })).toBeNull();
    expect(
      normalizeMcpServerConfig({ type: "http", url: "http://example.com" }),
    ).toBeNull();
    expect(normalizeMcpServerConfig({ command: "npx", args: [{}] })).toBeNull();
    expect(
      normalizeMcpServerConfig({
        command: "npx",
        headers: { Authorization: { secret: true } },
      }),
    ).toBeNull();
    expect(
      extractMcpServerConfig({
        mcpServers: {
          one: { command: "node" },
          two: { command: "node" },
        },
      }),
    ).toBeNull();
    expect(() => extractMcpServerConfig("not json")).toThrow();
    expect(formatMcpConfigSnippet("", { command: "node" })).toContain(
      '"heyclaude-mcp"',
    );
    expect(
      resolveMcpInstallConfig({
        category: "skills",
        configSnippet: '{"mcpServers":{"demo":{"command":"node"}}}',
      }),
    ).toBeNull();
  });

  it("covers LLM, weekly brief, and JSON-LD artifact fallback branches", () => {
    const llmEntry = entry("mcp", {
      slug: "llm-rich",
      title: "LLM Rich",
      author: "Example Author",
      authorProfileUrl: "https://github.com/example",
      submittedBy: "Contributor",
      sourceSubmissionUrl:
        "https://github.com/JSONbored/awesome-claude/issues/1",
      importPrUrl: "https://github.com/JSONbored/awesome-claude/pull/2",
      verifiedAt: "2026-01-02",
      contentUpdatedAt: "",
      repoUpdatedAt: "",
      brandName: "Example",
      brandDomain: "example.com",
      brandAssetSource: "manual",
      license: "MIT",
      robotsIndex: false,
      platformCompatibility: [
        { platform: "Claude Code", supportLevel: "native" },
      ],
      sections: [
        {
          title: "Code",
          markdown: "",
          codeBlocks: [{ language: "", code: "console.log('ok')" }],
        },
        { title: "Usage", markdown: "Use it carefully.", codeBlocks: [] },
      ],
    });
    expect(buildEntryCitationFacts(llmEntry)).toContain("Robots: noindex");
    expect(
      renderEntryLlms(llmEntry, { siteUrl: "https://example.com/" }),
    ).toContain("```text\nconsole.log('ok')\n```");
    expect(
      renderEntryLlms(
        { ...llmEntry, tags: [], sections: [], body: "" },
        { siteUrl: "https://example.com" },
      ),
    ).toContain("- none");
    expect(
      renderCorpusLlms([llmEntry], { siteUrl: "https://example.com/" }),
    ).toContain("Base URL: https://example.com");

    const weeklyEntries = [
      llmEntry,
      entry("skills", {
        slug: "weekly-skill",
        title: "Weekly Skill",
        canonicalUrl: "https://example.com/custom-weekly-skill",
        dateAdded: "2026-01-09",
        downloadUrl: "",
        downloadTrust: "",
        packageVerified: false,
        trustSignals: {
          sourceStatus: "available",
          sourceUrls: [
            "https://docs.example.com/weekly",
            "notaurl",
            "https://docs.example.com/weekly",
          ],
        },
        safetyNotes: ["Escapes [markdown] safely."],
        privacyNotes: [],
      }),
      entry("tools", {
        slug: "weekly-tool",
        title: "Weekly Tool",
        dateAdded: "2025-12-01",
        repoUrl: "",
        documentationUrl: "",
        websiteUrl: "https://tool.example.com",
        installCommand: "",
        configSnippet: "",
        commandSyntax: "",
        downloadUrl: "https://tool.example.com/tool.zip",
        packageVerified: true,
        safetyNotes: [],
        privacyNotes: ["No retained user data."],
      }),
      { category: "", slug: "", title: "" },
    ];
    const brief = buildWeeklyBrief(weeklyEntries, {
      generatedAt: "2026-01-10",
      days: 99,
      siteUrl: "https://example.com/",
      limits: {
        newEntries: 3,
        sourceBacked: 3,
        saferInstalls: 3,
        notableChanges: 3,
      },
      changelogEntries: [
        {
          type: "",
          category: "mcp",
          slug: "llm-rich",
          title: "LLM Rich",
          canonicalUrl: "bad url",
          dateAdded: "2026-01-08",
        },
        {
          type: "removed",
          category: "mcp",
          slug: "old",
          title: "Old",
          dateAdded: "not-a-date",
        },
      ],
    });
    expect(brief.period.days).toBe(31);
    expect(brief.summary.totalEntries).toBe(3);
    expect(brief.sections.newEntries.length).toBeGreaterThan(0);
    expect(brief.sections.notableChanges[0]).toMatchObject({
      type: "added",
      slug: "llm-rich",
    });
    expect(renderWeeklyBriefMarkdown(brief)).toContain(
      "Weekly Claude workflow brief",
    );
    expect(
      renderWeeklyBriefMarkdown(buildWeeklyBrief([], { days: 0 })),
    ).toContain("No new registry entries matched this brief window.");

    expect(absoluteSiteUrl("https://example.com/base/", "../entry")).toBe(
      "https://example.com/entry",
    );
    expect(
      buildOrganizationJsonLd({
        siteUrl: "https://example.com/",
        logo: "/logo.png",
        githubUrl: "https://github.com/JSONbored/awesome-claude",
        twitterUrl: "https://github.com/JSONbored/awesome-claude",
      }).sameAs,
    ).toEqual(["https://github.com/JSONbored/awesome-claude"]);
    expect(
      buildWebsiteJsonLd({ siteUrl: "https://example.com/" }).potentialAction
        .target.urlTemplate,
    ).toContain("/browse?q=");
    expect(buildSearchActionJsonLd().target.urlTemplate).toContain(
      "heyclau.de",
    );
    expect(
      buildWebPageJsonLd({
        siteUrl: "https://example.com",
        path: "/browse",
        name: "Browse",
        breadcrumbId: "https://example.com/browse#breadcrumb",
      }).breadcrumb,
    ).toMatchObject({ "@id": "https://example.com/browse#breadcrumb" });
    expect(buildCollectionPageJsonLd({ name: "Collection" })["@type"]).toBe(
      "CollectionPage",
    );
    expect(buildBreadcrumbJsonLd([])["@id"]).toBeUndefined();
    expect(
      buildItemListJsonLd([{ title: "Entry", url: "https://example.com/e" }])
        .numberOfItems,
    ).toBe(1);
    expect(buildEntryJsonLd({ ...llmEntry, category: "guides" })["@type"]).toBe(
      "TechArticle",
    );
    expect(
      buildToolSoftwareApplicationJsonLd({
        slug: "tool",
        title: "Tool",
        description: "Tool description.",
        websiteUrl: "https://tool.example.com",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        pricingModel: "open-source",
        disclosure: "affiliate",
      }),
    ).toMatchObject({ "@type": "SoftwareApplication" });
    expect(buildToolSoftwareApplicationJsonLd({ slug: "thin" })).toBeNull();
    expect(
      buildJobPostingJsonLd(
        {
          slug: "job",
          title: "AI Engineer",
          company: "Example Co",
          description:
            "Build useful AI workflow infrastructure for production teams, maintain source-backed automation, and document operational support paths.",
          descriptionMd:
            "## Details\n\nBuild source-backed AI workflow tooling, maintain deployment systems, improve developer operations, and document production support practices for internal platform users.",
          responsibilities: [
            "Maintain source-backed automation workflows.",
            "Improve deployment and support tooling.",
          ],
          requirements: [
            "Experience operating production developer tools.",
            "Clear documentation and incident follow-through.",
          ],
          postedAt: "2026-01-01",
          expiresAt: "2026-02-01",
          applyUrl: "https://example.com/apply",
          sourceUrl: "https://example.com/job",
          sourceStatus: "active",
          sourceCheckedAt: "2026-01-02",
          type: "FULL_TIME",
          isRemote: false,
          isWorldwide: false,
          location: "Phoenix, AZ",
          compensation: "$120k - $160k",
          benefits: ["Health", ""],
        },
        { siteUrl: "https://example.com" },
      )?.baseSalary?.value,
    ).toMatchObject({ minValue: 120000, maxValue: 160000 });
    expect(
      buildJobPostingJsonLd({
        slug: "closed",
        title: "Closed",
        company: "Example Co",
        description: "Closed job.",
        postedAt: "2026-01-01",
        expiresAt: "2026-02-01",
        applyUrl: "https://example.com/apply",
        status: "closed",
      }),
    ).toBeNull();
  });

  it("covers submission parsing, policy, and review contract edge cases", () => {
    const jsonDraft = {
      title: "[submit] JSON entry",
      body: [
        "### JSON Data",
        "",
        "```json",
        JSON.stringify({
          title: "JSON Tool",
          category: "tools",
          websiteUrl: "https://tool.example.com?utm_source=x",
          docsUrl: "https://tool.example.com/docs",
          brandDomain: "www.Tool.Example.com",
          tags: ["ai", "workflow"],
        }),
        "```",
      ].join("\n"),
    };
    expect(parseSubmissionPrBody(jsonDraft.body)).toMatchObject({
      name: "JSON Tool",
      category: "tools",
      brand_domain: "tool.example.com",
      tags: "ai, workflow",
    });
    expect(
      parseSubmissionPrBody(
        [
          "- Name: Bullet MCP",
          "  continued line",
          "- Category: MCP",
          "**Documentation:** https://example.com/docs",
          "**Safety notes:** Runs locally with review.",
        ].join("\n"),
      ),
    ).toMatchObject({
      name: "Bullet MCP\ncontinued line",
      category: "mcp",
      docs_url: "https://example.com/docs",
    });
    expect(looksLikeSubmissionPrDraft({ title: "Add: thing", body: "" })).toBe(
      true,
    );
    expect(looksLikeSubmissionPrDraft({ title: "Title", body: "" })).toBe(
      false,
    );

    const skippedReport = analyzeSubmissionDraftRisk(
      { title: "Submit unknown", body: "Category: unknown" },
      {
        ok: true,
        skipped: true,
        category: "",
        errors: [],
        warnings: [],
        fields: { category: "", title: "Unknown" },
      },
      { contributor: { login: "bad login!" } },
    );
    expect(skippedReport.policyMatrix.schema.status).toBe("block");
    expect(skippedReport.contributorAnalysis.reviewSignals).toContain(
      "identity_unresolved",
    );

    const invalidReport = analyzeSubmissionDraftRisk(
      {
        title: "Defensive Security Skill",
        body: "Detect and redact credential leaks before exposing secrets.",
        user: { login: "dependabot[bot]" },
      },
      {
        ok: false,
        skipped: false,
        category: "skills",
        errors: ["Missing required field: safety_notes"],
        warnings: [],
        fields: {
          category: "skills",
          title: "Defensive Security Skill",
          docs_url: "https://example.com/docs",
          description:
            "Detect and redact credential leaks before exposing secrets.",
        },
      },
      {
        contributor: {
          login: "dependabot[bot]",
          type: "Bot",
          error: "api offline",
        },
      },
    );
    expect(invalidReport.policyMatrix.schema.status).toBe("block");
    expect(invalidReport.reviewFlags.map((flag) => flag.id)).not.toContain(
      "malicious_data_theft_capability",
    );
    expect(invalidReport.contributorAnalysis.reviewSignals).toEqual(
      expect.arrayContaining(["bot_account", "profile_metadata_unavailable"]),
    );

    const validClose = normalizePrivateGateDecisionPayload({
      schemaVersion: 2,
      verdict: "close",
      confidence: 0.99,
      summary: "Strict duplicate.",
      labels: ["submission-close"],
      reasonCode: "strict_duplicate",
      checks: [{ name: "validate-content", status: "passed" }],
      sections: [{ id: "summary", bullets: ["Duplicate found."] }],
      evidence: [
        {
          duplicatePath: "content/mcp/existing.mdx",
          duplicateUrl: "https://example.com/source",
        },
      ],
      scope: {
        filePath: "content/mcp/new.mdx",
        category: "mcp",
        slug: "new",
      },
    });
    expect(validClose.decision?.verdict).toBe("close");
    expect(markerComment(validClose.decision)).toContain("duplicate path");
    expect(
      normalizePrivateGateDecisionPayload({
        schemaVersion: 2,
        verdict: "close",
        confidence: 0.99,
        summary: "Unsafe pipeline.",
        labels: [],
        reasonCode: "unsafe_install_pipeline",
        checks: [{ name: "validate-content", status: "passed" }],
        sections: [{ title: "Safety", bullets: ["curl pipe shell"] }],
        evidence: [
          {
            ruleId: "unsafe_install_pipeline",
            snippet: "curl http://example.com/install.sh | bash",
          },
        ],
      }).error?.message,
    ).toContain("whyNotDefensive");
    expect(
      markerComment({
        verdict: "ignore",
        labels: [],
        summary: "Summary:\nIgnored.",
      }),
    ).not.toContain("Automation notes");
    expect(
      markerComment({
        verdict: "merge",
        labels: [],
        summary:
          "Summary:\nAccepted.\nRecommended Action:\nMerge after checks.",
        confidence: 0.92,
        checks: [{ name: "coverage", status: "pending", details: "waiting" }],
      }),
    ).toContain("coverage");
  });

  it("covers web feed, brief, and entry normalization branches without UI rendering", async () => {
    const feedOpts = {
      title: "Feed",
      description: "Feed description",
      link: "https://example.com",
      selfLink: "https://example.com/feed.xml",
      items: [],
    };
    expect(buildRss(feedOpts)).toContain("<rss");
    expect(buildAtom(feedOpts)).toContain("<feed");
    const response = await respondFeed(
      new Request("https://example.com/feed.xml"),
      "<rss />",
      "application/rss+xml",
    );
    expect(response.headers.get("etag")).toBeTruthy();
    expect(origin(new Request("https://example.com/path"))).toBe(
      "https://example.com",
    );
    expect(siteWideItems().length).toBeGreaterThan(0);
    expect(
      categoryItems("mcp").every((item) => item.link.includes("/entry/")),
    ).toBe(true);
    expect(changelogStreamItems("release").length).toBeGreaterThan(0);
    await expect(trendingItems()).resolves.toBeDefined();
    expect(
      applySavedSearch({ q: "mcp", category: "mcp" }).length,
    ).toBeGreaterThan(0);
    await expect(allFeedHealth("https://example.com")).resolves.toBeDefined();
    await expect(listPublishedBriefs(0)).resolves.toEqual([]);
    await expect(getLatestDraft()).resolves.toBeNull();
    await expect(getDueApprovedBriefs("2026-01-01T00:00:00Z")).resolves.toEqual(
      [],
    );

    const normalized = buildEntry({
      category: "mcp",
      slug: "branch-matrix",
      title: "Branch Matrix",
      description: "Entry normalization fixture.",
      dateAdded: "2026-01-01",
      tags: ["mcp"],
      platforms: ["Claude Code"],
      trustSignals: { sourceStatus: "available" },
      body: "",
    } as RegistryEntry);
    expect(normalized.slug).toBe("branch-matrix");
    expect(normalized.sourceUrl).toBeUndefined();

    const normalizedVariants = [
      buildEntry({
        category: "unknown",
        slug: "package-tool",
        title: "Package Tool",
        description: "Unknown categories normalize to tools.",
        downloadUrl: "https://example.com/tool.zip",
        downloadSha256: "sha256-tool",
        packageVerified: true,
        trustSignals: { firstPartyEditorial: true },
        platformCompatibility: [{ platform: "Unknown", support: "native" }],
        items: ["mcp/demo", { category: "skills", slug: "skill-demo" }],
        relatedEntries: [
          {
            category: "mcp",
            slug: "demo",
            title: "Demo",
            relation: "works-with",
            score: 0.9,
            reasons: ["same source"],
          },
          { category: "bad", slug: "", title: "" },
        ],
      } as RegistryEntry),
      buildEntry({
        category: "hooks",
        slug: "hook-entry",
        title: "Hook Entry",
        description: "Hook entry with unsupported trigger.",
        configSnippet: '{"command":"uvx hook"}',
        scriptLanguage: "ruby",
        trigger: "BadTrigger",
        safetyNotes: "Runs locally.",
        privacyNotes: ["Reads logs."],
        repoStats: {
          repository: "example/repo",
          stars: 10,
          forks: 2,
          updatedAt: "2026-01-01T00:00:00Z",
        },
        claimStatus: "pending",
      } as RegistryEntry),
      buildEntry({
        category: "skills",
        slug: "skill-entry",
        title: "Skill Entry",
        description: "Skill entry with compatibility rows.",
        body: "Copy me",
        tags: ["cursor", "codex"],
        platformCompatibility: [
          {
            platform: "Cursor",
            supportLevel: "adapter",
            installPath: ".cursor/rules/skill-entry.mdc",
          },
          { platform: "Claude Desktop", support: "unsupported" },
        ],
        skillType: "capability-pack",
        skillLevel: "expert",
        verificationStatus: "production",
        allowedTools: ["Read", ""],
        retrievalSources: ["https://example.com/source"],
        testedPlatforms: ["Aider"],
      } as RegistryEntry),
      buildEntry({
        category: "tools",
        slug: "manual-tool",
        title: "Manual Tool",
        description: "Manual tool without source links.",
        tags: [],
        keywords: [],
        safetyNotes: [],
        privacyNotes: [],
        repoUrl: null,
        githubStars: null,
        githubForks: null,
        repoUpdatedAt: null,
        claimStatus: "bad-status",
      } as RegistryEntry),
    ];
    expect(normalizedVariants.map((item) => item.installType)).toEqual([
      "package",
      "config",
      "copy",
      "manual",
    ]);
    expect(normalizedVariants[0]).toMatchObject({
      category: "tools",
      trust: "trusted",
      source: "first-party",
      claimed: false,
    });
    expect(normalizedVariants[0].relatedEntries).toEqual([
      expect.objectContaining({ relation: "works-with" }),
    ]);
    expect(normalizedVariants[1]).toMatchObject({
      trigger: undefined,
      scriptLanguage: undefined,
      claimStatus: "pending",
    });
    expect(normalizedVariants[2].platformCompatibility).toEqual([
      expect.objectContaining({ platform: "cursor", support: "adapter" }),
      expect.objectContaining({
        platform: "claude-desktop",
        support: "unsupported",
      }),
    ]);
    expect(normalizedVariants[3]).toMatchObject({
      source: "unverified",
      trust: "limited",
      claimStatus: "unclaimed",
    });
  });
});
