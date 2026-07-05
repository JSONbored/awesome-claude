import { describe, expect, it } from "vitest";

import {
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
} from "../packages/registry/src/content-schema.js";

describe("inferStructuredFields", () => {
  it("prefers explicit copySnippet frontmatter for rules entries", () => {
    const inferred = inferStructuredFields(
      {
        copySnippet: "Full rule payload\n\n## Rule Details",
        usageSnippet: "Short usage summary",
      },
      "## Usage\n\nShort public description.",
      "rules",
    );

    expect(inferred.copySnippet).toBe("Full rule payload\n\n## Rule Details");
  });

  it("falls back to the body as copySnippet for rules entries without frontmatter copy", () => {
    const inferred = inferStructuredFields(
      {
        usageSnippet: "Short usage summary",
      },
      "## Rule Body\n\nUse these rules.",
      "rules",
    );

    expect(inferred.copySnippet).toBe("## Rule Body\n\nUse these rules.");
  });

  it("preserves explicit retrieval sources for rules entries", () => {
    const inferred = inferStructuredFields(
      {
        documentationUrl:
          "https://aws.amazon.com/architecture/well-architected/",
        retrievalSources: [
          "https://aws.amazon.com/architecture/well-architected/",
          " https://docs.aws.amazon.com/ ",
          "",
        ],
      },
      "## Usage\n\nUse AWS rules.",
      "rules",
    );

    expect(inferred.retrievalSources).toEqual([
      "https://aws.amazon.com/architecture/well-architected/",
      "https://docs.aws.amazon.com/",
    ]);
  });

  it("rejects non-HTTPS retrieval sources for non-skill entries", () => {
    const result = validateEntry("rules", {
      slug: "demo-rule",
      title: "Demo Rule",
      description: "Test rule",
      author: "JSONbored",
      dateAdded: "2026-01-01",
      retrievalSources: ["not-a-url", "ftp://attacker.invalid/source"],
    });

    expect(result.semanticErrors).toContain(
      "retrievalSources must use https URLs",
    );
  });

  it("does not infer guide code examples as install commands", () => {
    const inferred = inferStructuredFields(
      {},
      [
        "## Launching an Audit Workflow",
        "",
        "Include the keyword to run a single audit task as a dynamic workflow:",
        "",
        "```text",
        "ultracode: audit every API endpoint under src/routes/ for missing auth checks",
        "```",
      ].join("\n"),
      "guides",
    );

    expect(inferred.installCommand).toBe("");
    expect(inferred.installable).toBe(false);
  });

  it("still infers single-line install commands for installable categories", () => {
    const inferred = inferStructuredFields(
      {},
      ["## Install", "", "```bash", "npx -y example-mcp", "```"].join("\n"),
      "mcp",
    );

    expect(inferred.installCommand).toBe("npx -y example-mcp");
    expect(inferred.installable).toBe(true);
  });

  it("extracts headings, sections, and code blocks without treating fenced headings as content headings", () => {
    const markdown = [
      "Intro paragraph.",
      "",
      "## Setup - Installation",
      "",
      "```bash",
      "## Not a heading",
      "npx demo",
      "```",
      "",
      "## Setup - Installation",
      "",
      "More setup.",
    ].join("\n");

    expect(headingId("Setup - Installation!")).toBe("setup-installation");
    expect(extractCodeBlocks(markdown)).toEqual([
      { language: "bash", code: "## Not a heading\nnpx demo" },
    ]);
    expect(extractHeadings(markdown).map((heading) => heading.id)).toEqual([
      "setup-installation",
      "setup-installation-2",
    ]);
    expect(extractSections(markdown).map((section) => section.id)).toEqual([
      "overview",
      "setup-installation",
      "setup-installation-2",
    ]);
    expect(stripCodeBlocks(markdown)).not.toContain("npx demo");
  });

  it("normalizes raw scripts and infers category-specific structured fields", () => {
    const rawScript = [
      "#!/usr/bin/env bash",
      "echo ok",
      "export VALUE=1",
      "read -r input",
      'if [ -n "$input" ]; then',
      "fi",
    ].join("\n");

    expect(inferLanguageFromCategory("hooks")).toBe("bash");
    expect(looksLikeRawScript(rawScript)).toBe(true);
    expect(normalizeBody("*(No content)*", "hooks")).toBe("");
    expect(normalizeBody(rawScript, "hooks")).toContain("```bash");
    expect(inferHookTrigger("Runs on PreToolUse before Bash")).toBe(
      "PreToolUse",
    );
    expect(
      inferSectionBooleans(
        "## Prerequisites and setup\n\n## Troubleshooting Guide",
      ),
    ).toEqual({
      hasPrerequisites: true,
      hasTroubleshooting: true,
    });
    expect(
      inferRepoUrl({ documentationUrl: "https://github.com/example/repo" }),
    ).toBe("");

    expect(
      inferStructuredFields(
        { title: "/demo run" },
        ["## Usage", "", "```text", "/demo run target", "```"].join("\n"),
        "commands",
      ),
    ).toMatchObject({
      commandSyntax: "/demo run target",
      installCommand: "/demo run target",
      usageSnippet: "/demo run target",
    });

    expect(
      inferStructuredFields(
        {
          slug: "review-capability-pack",
          downloadUrl: "/downloads/skills/review.zip",
          documentationUrl: "https://docs.example/skill",
        },
        "Lead paragraph for the skill.\n\n## Usage\n\nUse it.",
        "skills",
      ),
    ).toMatchObject({
      installable: true,
      skillType: "capability-pack",
      skillLevel: "expert",
      verificationStatus: "validated",
      retrievalSources: ["https://docs.example/skill"],
      usageSnippet: "Lead paragraph for the skill.",
    });
  });

  it("reports semantic validation failures for skill, brand, provenance, notes, and tool metadata", () => {
    const skillResult = validateEntry("skills", {
      slug: "Bad Slug",
      title: "Capability Pack",
      description: "Test",
      author: "JSONbored",
      dateAdded: "2026-01-01",
      skillType: "capability-pack",
      skillLevel: "advanced",
      verificationStatus: "unknown",
      verifiedAt: "yesterday",
      testedPlatforms: [],
      retrievalSources: [],
      brandDomain: "https://bad-domain",
      brandAssetSource: "unknown",
      brandIconUrl: "http://example.com/icon.png",
      brandLogoUrl: "http://example.com/logo.png",
      brandVerifiedAt: "not-a-date",
      brandColors: ["#fff", "not-a-color"],
      repoUrl: "ftp://example.com/repo",
      submittedByUrl: "http://github.com/user",
      submittedAt: "not-a-date",
      sourceSubmissionNumber: 0,
      submittedBy: "bad user!",
      claimStatus: "done",
      safetyNotes: ["", "x".repeat(321)],
      privacyNotes: "reads files",
    });

    expect(skillResult.semanticErrors).toEqual(
      expect.arrayContaining([
        "slug must contain only lowercase letters, numbers, and single hyphens",
        "capability-pack skills must include retrievalSources",
        "capability-pack skills must use skillLevel: expert",
        "verifiedAt must be ISO date format YYYY-MM-DD",
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
        "safetyNotes cannot include blank items",
        "safetyNotes items must be 320 characters or fewer",
        "privacyNotes must be a list of non-empty strings",
      ]),
    );
    expect(skillResult.enumErrors).toContain(
      "Invalid verificationStatus: unknown",
    );

    const toolResult = validateEntry("tools", {
      slug: "tool",
      title: "Tool",
      description: "Commercial tool",
      author: "Vendor",
      dateAdded: "2026-01-01",
      websiteUrl: "http://example.com",
      affiliateUrl: "http://example.com/affiliate",
      disclosure: "affiliate",
      pricingModel: "mystery",
    });
    expect(toolResult.semanticErrors).toEqual(
      expect.arrayContaining([
        "websiteUrl must use https",
        "affiliateUrl must use https",
        "pricingModel is not recognized",
      ]),
    );
  });

  it("does not recommend package fields for non-installable skills", () => {
    const result = validateEntry("skills", {
      slug: "copy-only-capability-pack",
      title: "Copy-only Capability Pack",
      description: "Review capability pack with copyable instructions.",
      cardDescription: "Copyable review instructions.",
      installable: false,
      usageSnippet: "Use this pack during a review.",
      copySnippet: "Review checklist.",
      skillType: "capability-pack",
      skillLevel: "expert",
      verificationStatus: "validated",
      verifiedAt: "2026-01-01",
      retrievalSources: ["https://docs.example.com"],
      testedPlatforms: ["Claude"],
    });

    expect(result.missingRecommended).not.toContain("installCommand");
    expect(result.missingRecommended).not.toContain("downloadUrl");
  });

  it("rejects http and https URLs with embedded userinfo", () => {
    const result = validateEntry("mcp", {
      slug: "userinfo-urls",
      title: "Userinfo URLs",
      description: "Reject credential-bearing profile and repo URLs.",
      author: "JSONbored",
      dateAdded: "2026-01-01",
      authorProfileUrl: "https://token@github.com/victim",
      repoUrl: "http://user:pass@example.com/repo",
    });

    expect(result.semanticErrors).toEqual(
      expect.arrayContaining([
        "authorProfileUrl must use http or https",
        "repoUrl must use http or https",
      ]),
    );
  });

  it("orders frontmatter while dropping empty values and appending unknown keys", () => {
    expect(
      orderFrontmatter({
        zExtra: "kept last",
        title: "Demo",
        empty: "",
        slug: "demo",
        author: "JSONbored",
        tags: ["mcp"],
      }),
    ).toEqual({
      title: "Demo",
      slug: "demo",
      author: "JSONbored",
      tags: ["mcp"],
      zExtra: "kept last",
    });
  });
});
