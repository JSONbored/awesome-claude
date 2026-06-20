import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import {
  buildSubmissionPrBody,
  buildSubmissionPrDraft,
  buildSubmissionPrTitle,
  isLikelyAffiliateUrl,
  looksLikeSubmissionPrDraft,
  normalizeCategory,
  normalizeHeading,
  normalizeSubmissionPayloadFields,
  normalizeValue,
  parseSubmissionPrBody,
  slugify,
  validateSubmission,
} from "../packages/registry/src/submission.js";
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

const spec = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "apps/web/public/data/submission-spec.json"),
    "utf8",
  ),
);

const validMcpFields = {
  category: "mcp",
  name: "Demo MCP Server",
  slug: "demo-mcp-server",
  github_url: "https://github.com/example/demo-mcp-server",
  docs_url: "https://example.com/demo/docs",
  author: "@example",
  contact_email: "@example",
  tags: ["mcp", "demo"],
  description:
    "A source-backed MCP server that demonstrates submission builder validation and review output.",
  card_description: "Source-backed MCP server demo.",
  safety_notes: ["Runs only the configured read-only demo tools."],
  privacy_notes: ["Sends demo prompts to the configured MCP client."],
  install_command: "npx -y demo-mcp-server",
  usage_snippet: "Add the server to a Claude-compatible MCP client.",
  config_snippet: '{"mcpServers":{"demo":{"command":"npx"}}}',
};

describe("registry submission parsing and validation", () => {
  it("normalizes headings, values, categories, slugs, and payload arrays", () => {
    expect(normalizeHeading("GitHub URL!")).toBe("github-url");
    expect(normalizeValue("_No response_")).toBe("");
    expect(normalizeCategory("Claude MCP Server")).toBe("mcp");
    expect(slugify("Demo's MCP Server")).toBe("demos-mcp-server");
    expect(isLikelyAffiliateUrl("https://example.com?utm_source=x")).toBe(true);
    expect(
      normalizeSubmissionPayloadFields({
        name: "Demo MCP Server",
        slug: "demo-mcp-server",
        category: "MCP",
        githubUrl: "https://github.com/example/demo",
        tags: ["mcp", "demo"],
        safetyNotes: ["Reads files", "Calls APIs"],
      }),
    ).toMatchObject({
      name: "Demo MCP Server",
      category: "mcp",
      githubUrl: "https://github.com/example/demo",
      tags: "mcp, demo",
      safetyNotes: "Reads files\nCalls APIs",
      slug: "demo-mcp-server",
    });
  });

  it("parses markdown sections, bold fields, bullets, and JSON payloads into canonical fields", () => {
    const parsed = parseSubmissionPrBody(
      [
        "### JSON Data",
        "",
        "```json",
        JSON.stringify({
          title: "JSON MCP",
          category: "mcp",
          repoUrl: "https://github.com/example/json-mcp",
          tags: ["json", "mcp"],
        }),
        "```",
        "",
        "### Docs URL",
        "",
        "https://example.com/docs",
        "",
        "### Safety notes",
        "",
        "Reads local files.",
        "Only after user confirmation.",
        "",
        "### Privacy notes",
        "",
        "Sends prompts to the selected model.",
        "",
        "### Contact email",
        "",
        "@example",
      ].join("\n"),
    );

    expect(parsed).toMatchObject({
      name: "JSON MCP",
      category: "mcp",
      github_url: "https://github.com/example/json-mcp",
      docs_url: "https://example.com/docs",
      safety_notes: "Reads local files.\nOnly after user confirmation.",
      privacy_notes: "Sends prompts to the selected model.",
      contact_email: "@example",
    });

    expect(
      parseSubmissionPrBody(
        [
          "**Privacy notes:** Sends prompts to the selected model.",
          "",
          "Contact email:",
          "@example",
        ].join("\n"),
      ),
    ).toMatchObject({
      privacy_notes: "Sends prompts to the selected model.",
      contact_email: "@example",
    });

    expect(
      parseSubmissionPrBody(
        [
          "- Category: MCP",
          "- Name: Bullet MCP",
          "- GitHub URL: https://github.com/example/bullet-mcp",
          "- Safety notes: Runs local tools.",
          "  Only after user confirmation.",
        ].join("\n"),
      ),
    ).toMatchObject({
      category: "mcp",
      name: "Bullet MCP",
      github_url: "https://github.com/example/bullet-mcp",
      safety_notes: "Runs local tools.\nOnly after user confirmation.",
    });
  });

  it("builds PR drafts and validates risky submissions with clear errors", () => {
    const draft = buildSubmissionPrDraft(validMcpFields);
    expect(buildSubmissionPrTitle(validMcpFields)).toBe(
      "Add MCP Server: Demo MCP Server",
    );
    expect(buildSubmissionPrBody(validMcpFields)).toContain("### Safety notes");
    expect(parseSubmissionPrBody(draft.body)).toMatchObject({
      contact_email: "@example",
    });
    expect(looksLikeSubmissionPrDraft(draft)).toBe(true);
    expect(
      validateSubmission({ title: "Add MCP server: Demo", body: draft.body }),
    ).toMatchObject({
      ok: true,
      skipped: false,
      category: "mcp",
    });

    const invalid = validateSubmission({
      title: "Add Skill: Bad",
      body: buildSubmissionPrBody({
        category: "skills",
        name: "Bad Skill",
        slug: "Bad Skill",
        github_url: "https://github.com/example/bad/tree/main",
        download_url: "https://github.com/example/bad/blob/main/SKILL.md",
        install_command: "./scripts/install.sh",
        description:
          "A deliberately risky skill submission used to validate guardrails.",
        card_description: "Risky skill validation fixture.",
        usage_snippet: "Run the local installer script.",
        safety_notes: "n/a",
        privacy_notes: "n/a",
        skill_type: "capability-pack",
        skill_level: "advanced",
        verification_status: "unknown",
        retrieval_sources: "http://example.com/source",
        full_copyable_content: "viewCount: 10",
      }),
    });

    expect(invalid.ok).toBe(false);
    expect(invalid.errors).toEqual(
      expect.arrayContaining([
        'safety_notes must explain the relevant behavior, or use "Not applicable: ..." with a specific reason',
        'privacy_notes must explain the relevant behavior, or use "Not applicable: ..." with a specific reason',
        "download_url must point to a package, archive, or release download; use github_url or retrieval_sources for GitHub source tree/blob paths",
        "Invalid verification_status: unknown",
        "capability-pack skills require verified_at",
        "capability-pack skills must use skill_level=expert",
        "retrieval_sources must use https URLs: http://example.com/source",
        "Forbidden counters detected in full_copyable_content",
      ]),
    );

    expect(
      validateSubmission({
        title: "Add Skill: Local Installer",
        body: buildSubmissionPrBody({
          category: "skills",
          name: "Local Installer",
          slug: "local-installer",
          github_url: "https://github.com/example/bad/tree/main",
          install_command: "./scripts/install.sh",
          description:
            "A risky local installer skill used to validate installer-source guardrails.",
          card_description: "Local installer guardrail fixture.",
          usage_snippet: "Run the local installer script.",
          safety_notes: "Runs a local installer script.",
          privacy_notes: "Reads local project files during setup.",
          skill_type: "workflow",
          skill_level: "intermediate",
          verification_status: "validated",
          verified_at: "2026-05-17",
          tested_platforms: "Claude Code",
        }),
      }).errors,
    ).toEqual(
      expect.arrayContaining([
        "Skills install_command references a local installer script; include the exact installer source URL in retrieval_sources or provide full_copyable_content",
      ]),
    );

    for (const contact_email of [
      "user@example.com@attacker.com",
      "user@.example.com",
      "user@example.com.",
    ]) {
      expect(
        validateSubmission({
          title: "Add MCP server: Bad contact",
          body: buildSubmissionPrBody({
            ...validMcpFields,
            contact_email,
          }),
        }).errors,
      ).toEqual(
        expect.arrayContaining([
          expect.stringContaining("Invalid public contact"),
        ]),
      );
    }
  });
});

describe("MCP submission builder helpers", () => {
  it("normalizes fields and builds submission URLs with PR previews", () => {
    const normalized = normalizeSubmissionFields({
      title: "Demo MCP Server",
      category: "mcp",
      source_url: "https://github.com/example/demo-mcp-server",
      brand_domain: "https://www.example.com/path",
      tags: ["mcp", "demo"],
      description: "A long enough description for review.",
    });
    expect(normalized).toMatchObject({
      name: "Demo MCP Server",
      slug: "demo-mcp-server",
      github_url: "https://github.com/example/demo-mcp-server",
      brand_domain: "example.com",
      tags: "mcp, demo",
    });

    const urls = buildSubmissionUrlsFromSpec(spec, {
      fields: validMcpFields,
      includePrBody: true,
    });
    expect(urls).toMatchObject({
      ok: true,
      valid: true,
      category: "mcp",
      slug: "demo-mcp-server",
    });
    expect(urls.submitUrl).toContain("category=mcp");
    expect(urls.prDraft.body).toContain("### Safety notes");
  });

  it("returns schemas, examples, validation previews, prepared drafts, and guidance", () => {
    expect(
      getSubmissionSchemaFromSpec(spec, { category: "missing" }),
    ).toMatchObject({
      ok: false,
      error: { code: "not_found" },
    });
    expect(
      getSubmissionSchemaFromSpec(spec, { category: "mcp" }),
    ).toMatchObject({
      ok: true,
      category: "mcp",
    });
    expect(
      getSubmissionExamplesFromSpec(spec, { category: "mcp" }),
    ).toMatchObject({
      ok: true,
      categories: [expect.objectContaining({ category: "mcp" })],
    });
    expect(
      getCategorySubmissionGuidanceFromSpec(spec, { category: "mcp" }),
    ).toMatchObject({
      ok: true,
      categories: [expect.objectContaining({ category: "mcp" })],
    });

    const validation = validateSubmissionDraftFromSpec(spec, {
      fields: validMcpFields,
    });
    expect(validation).toMatchObject({
      ok: true,
      valid: true,
      category: "mcp",
      prPreview: { title: "Add MCP Server: Demo MCP Server" },
    });
    expect(
      prepareSubmissionDraftFromSpec(spec, { fields: validMcpFields }),
    ).toMatchObject({
      ok: true,
      valid: true,
      prDraft: { title: "Add MCP Server: Demo MCP Server" },
    });
    expect(buildPrDraftFromSpec(spec, validMcpFields).body).toContain(
      "### Safety notes",
    );
  });

  it("builds category-specific examples and reports invalid draft fields", () => {
    const examples = getSubmissionExamplesFromSpec(spec, {});
    expect(examples.ok).toBe(true);
    expect(examples.categories.map((category) => category.category)).toEqual(
      expect.arrayContaining([
        "collections",
        "commands",
        "guides",
        "hooks",
        "mcp",
        "skills",
        "statuslines",
      ]),
    );
    expect(
      examples.categories.find((category) => category.category === "skills")
        ?.completeFields,
    ).toMatchObject({
      full_copyable_content: expect.stringContaining(
        "copyable public artifact",
      ),
      retrieval_sources: "- https://example.com/docs",
      tested_platforms: "Claude Code, Codex, Cursor",
    });
    expect(
      examples.categories.find((category) => category.category === "commands")
        ?.completeFields,
    ).toMatchObject({
      command_syntax: "/example-commands <input>",
      full_copyable_content: expect.stringContaining("Example Command"),
    });
    expect(
      examples.categories.find((category) => category.category === "hooks")
        ?.completeFields,
    ).toMatchObject({
      trigger: "PostToolUse",
    });
    expect(
      examples.categories.find(
        (category) => category.category === "statuslines",
      )?.completeFields,
    ).toMatchObject({
      script_language: "bash",
    });
    expect(
      examples.categories.find((category) => category.category === "guides")
        ?.completeFields,
    ).toMatchObject({
      guide_content: expect.stringContaining("verification"),
    });
    expect(
      examples.categories.find(
        (category) => category.category === "collections",
      )?.completeFields,
    ).toMatchObject({
      items: expect.stringContaining("Source-backed companion resource"),
    });

    expect(
      validateSubmissionDraftFromSpec(spec, {
        fields: { category: "missing" },
      }),
    ).toMatchObject({
      valid: false,
      errors: ["Missing or unsupported submission category."],
    });

    const invalidMcp = validateSubmissionDraftFromSpec(spec, {
      fields: {
        category: "mcp",
        name: "Bad MCP",
        slug: "Bad MCP",
        description: "Too short",
        card_description: "Tiny",
        install_command: "npx bad",
        usage_snippet: "Use it.",
        safety_notes: "Runs.",
        privacy_notes: "Logs.",
        contact_email: "not a contact",
        github_url: "http://example.com/source",
        docs_url: "https://example.com/docs?utm_source=newsletter",
        brand_domain: "-bad-domain",
      },
    });
    expect(invalidMcp.errors).toEqual(
      expect.arrayContaining([
        "Invalid slug format: expected kebab-case.",
        "Description is too short for review.",
        "Card description is too short for review.",
        "Invalid public contact: use a GitHub handle, GitHub profile URL, or email.",
        "github_url must be a valid https URL.",
        "Contributor submissions cannot include affiliate/referral URLs: docs_url.",
        "brand_domain must be a canonical domain such as asana.com.",
      ]),
    );

    const invalidSkill = validateSubmissionDraftFromSpec(spec, {
      fields: {
        category: "skills",
        name: "Capability Pack",
        slug: "capability-pack",
        description:
          "Capability pack submission with deliberately incomplete verification metadata.",
        card_description: "Capability pack fixture.",
        full_copyable_content: "Useful prompt content.",
        skill_type: "capability-pack",
        skill_level: "intermediate",
        verification_status: "validated",
        verified_at: "not-a-date",
        safety_notes: "Runs local workflow instructions.",
        privacy_notes: "Reads user-provided project context.",
      },
    });
    expect(invalidSkill.errors).toEqual(
      expect.arrayContaining([
        "verified_at must use YYYY-MM-DD format.",
        "capability-pack skills require retrieval_sources.",
        "capability-pack skills must use skill_level=expert.",
      ]),
    );
  });

  it("reviews duplicate candidates across slug, title, brand, and normalized source URLs", () => {
    const entries = [
      {
        category: "mcp",
        slug: "demo-mcp-server",
        title: "Demo MCP Server",
        description: "Existing entry",
        brandName: "Demo",
        brandDomain: "example.com",
        repoUrl: "https://github.com/example/demo-mcp-server",
        trustSignals: {
          sourceUrls: ["https://example.com/docs?utm_source=newsletter"],
        },
        canonicalUrl: "https://heyclau.de/entry/mcp/demo-mcp-server",
      },
    ];

    expect(
      searchDuplicateEntries(entries, {
        category: "mcp",
        slug: "demo-mcp-server",
        title: "Demo MCP Server",
        brandDomain: "https://www.example.com",
        sourceUrls: [
          "https://github.com/example/demo-mcp-server/",
          "https://example.com/docs?ref=affiliate#section",
        ],
      }),
    ).toMatchObject({
      ok: true,
      count: 1,
      matches: [
        expect.objectContaining({
          reasons: expect.arrayContaining([
            "slug",
            "title",
            "brand_domain",
            "source_url",
          ]),
        }),
      ],
    });

    expect(
      reviewSubmissionDraftFromSpec(
        spec,
        {
          fields: validMcpFields,
          duplicateLimit: 3,
        },
        entries,
      ),
    ).toMatchObject({
      ok: true,
      valid: true,
      recommendedAction: "review_possible_duplicate",
      duplicateReview: { count: 1 },
    });
  });
});
