import { describe, expect, it } from "vitest";

import categorySpec from "../packages/registry/src/category-spec.json";
import {
  buildSubmissionPrBody,
  buildSubmissionPrDraft,
  buildSubmissionPrTitle,
  CATEGORY_REQUIREMENTS,
  COMMON_REQUIRED_FIELDS,
  CORE_CATEGORIES,
  HEADING_KEY_MAP,
  isLikelyAffiliateUrl,
  looksLikeSubmissionPrDraft,
  normalizeCategory,
  normalizeHeading,
  normalizeParsedFields,
  normalizeSubmissionPayloadFields,
  normalizeValue,
  parseSubmissionPrBody,
  slugify,
  validateSubmission,
} from "../packages/registry/src/submission-lib.js";

const longDescription =
  "A sufficiently long description for submission review validation testing.";
const shortCard = "Short card preview text.";
const baseFields = {
  github_url: "https://github.com/example/demo",
  docs_url: "https://example.com/docs",
  contact_email: "@example",
  description: longDescription,
  card_description: shortCard,
};

const validMcpFields = {
  ...baseFields,
  category: "mcp",
  name: "Demo MCP Server",
  slug: "demo-mcp-server",
  github_url: "https://github.com/example/demo-mcp-server",
  docs_url: "https://example.com/demo/docs",
  author: "@example",
  tags: ["mcp", "demo"],
  card_description: "Source-backed MCP server demo.",
  description:
    "A source-backed MCP server that demonstrates submission builder validation and review output.",
  safety_notes: ["Runs only the configured read-only demo tools."],
  privacy_notes: ["Sends demo prompts to the configured MCP client."],
  install_command: "npx -y demo-mcp-server",
  usage_snippet: "Add the server to a Claude-compatible MCP client.",
  config_snippet: '{"mcpServers":{"demo":{"command":"npx"}}}',
};

const validAgentsFields = {
  ...baseFields,
  category: "agents",
  name: "Demo Agent",
  slug: "demo-agent",
  full_copyable_content:
    "You are a helpful demo agent with scoped responsibilities.",
};

const validSkillsFields = {
  ...baseFields,
  category: "skills",
  name: "Demo Skill",
  slug: "demo-skill",
  usage_snippet: "Invoke the skill for documented workflow steps only.",
  skill_type: "general",
  skill_level: "foundational",
  verification_status: "validated",
  safety_notes: ["Runs only the documented workflow instructions."],
  privacy_notes: ["Reads user-provided project context during execution."],
  full_copyable_content:
    "Useful copyable skill content for Claude-compatible clients.",
  tested_platforms: "Claude Code, Cursor",
};

const validRulesFields = {
  ...baseFields,
  category: "rules",
  name: "Demo Rule",
  slug: "demo-rule",
  full_copyable_content:
    "Always confirm destructive actions before proceeding.",
};

const validCommandsFields = {
  ...baseFields,
  category: "commands",
  name: "Demo Command",
  slug: "demo-command",
  command_syntax: "/demo-command <input>",
  usage_snippet: "Run the command against a safe test input first.",
  full_copyable_content:
    "Example Command\n\nUse /demo-command to process input.",
  safety_notes: ["Runs only against user-provided input."],
  privacy_notes: ["Does not persist command output by default."],
};

const validHooksFields = {
  ...baseFields,
  category: "hooks",
  name: "Demo Hook",
  slug: "demo-hook",
  trigger: "PostToolUse",
  usage_snippet: "Install the hook and trigger it manually before broad use.",
  full_copyable_content: "#!/bin/bash\necho hook ran",
  safety_notes: ["Runs only when the configured trigger fires."],
  privacy_notes: ["Logs trigger metadata locally during testing."],
};

const validGuidesFields = {
  ...baseFields,
  category: "guides",
  name: "Demo Guide",
  slug: "demo-guide",
  guide_content:
    "## Prerequisites\n\nInstall Claude Code.\n\n## Steps\n\nFollow the verification checklist.",
};

const validCollectionsFields = {
  ...baseFields,
  category: "collections",
  name: "Demo Collection",
  slug: "demo-collection",
  items: "demo-skill, demo-command, demo-hook",
};

const validStatuslinesFields = {
  ...baseFields,
  category: "statuslines",
  name: "Demo Statusline",
  slug: "demo-statusline",
  script_language: "bash",
  usage_snippet: "Copy the config and run the script in your shell first.",
  full_copyable_content:
    "#!/bin/bash\necho branch: $(git branch --show-current)",
  safety_notes: ["Reads local git metadata only."],
  privacy_notes: ["Does not transmit shell output externally."],
};

const validToolsFields = {
  ...baseFields,
  category: "tools",
  name: "Demo Tool",
  slug: "demo-tool",
  website_url: "https://example.com",
  pricing_model: "free",
  disclosure: "editorial",
  application_category: "DeveloperApplication",
  operating_system: "macOS, Windows",
};

function buildValidBody(fields: Record<string, unknown>) {
  return buildSubmissionPrBody(fields);
}

describe("exported constants", () => {
  it("CORE_CATEGORIES matches category-spec categoryOrder", () => {
    expect(CORE_CATEGORIES).toEqual(categorySpec.categoryOrder);
  });

  it("COMMON_REQUIRED_FIELDS matches category-spec commonIssueRequiredFields", () => {
    expect(COMMON_REQUIRED_FIELDS).toEqual(
      categorySpec.commonIssueRequiredFields,
    );
  });

  it.each(CORE_CATEGORIES)(
    "CATEGORY_REQUIREMENTS[%s] matches category-spec submissionRequired",
    (category) => {
      expect(CATEGORY_REQUIREMENTS[category]).toEqual(
        categorySpec.categories[
          category as keyof typeof categorySpec.categories
        ].submissionRequired,
      );
    },
  );

  it.each(Object.entries(HEADING_KEY_MAP))(
    "HEADING_KEY_MAP maps alias %s to field %s",
    (alias, fieldKey) => {
      expect(HEADING_KEY_MAP[alias as keyof typeof HEADING_KEY_MAP]).toBe(
        fieldKey,
      );
    },
  );
});

describe("normalizeHeading", () => {
  it.each([
    ["GitHub URL", "github-url"],
    ["GitHub URL!", "github-url"],
    ["  Docs URL  ", "docs-url"],
    ["Contact Email", "contact-email"],
    ["What it does", "what-it-does"],
    ["Full copyable content", "full-copyable-content"],
    ["Install / Usage", "install-usage"],
    ["Install & Usage", "install-usage"],
    ["Brand Name", "brand-name"],
    ["Content-Type", "content-type"],
    ["JSON Data", "json-data"],
    ["Safety notes (optional)", "safety-notes-optional"],
    ["Privacy notes (optional)", "privacy-notes-optional"],
    ["Verified date (YYYY-MM-DD)", "verified-date-yyyy-mm-dd"],
    ["Items (category slug list)", "items-category-slug-list"],
    ["Guide content (markdown)", "guide-content-markdown"],
    ["Config snippet (optional)", "config-snippet-optional"],
    ["Download URL (optional)", "download-url-optional"],
    [
      "Auth requirements / env vars (optional)",
      "auth-requirements-env-vars-optional",
    ],
    [
      "Install command (required unless download URL is provided)",
      "install-command-required-unless-download-url-is-provided",
    ],
    ["Card description (short preview)", "card-description-short-preview"],
    ["Description (1-3 sentences)", "description-1-3-sentences"],
    ["Copy snippet / full usable asset", "copy-snippet-full-usable-asset"],
    [
      "Copy snippet / full usable asset (optional)",
      "copy-snippet-full-usable-asset-optional",
    ],
    [
      "Full copyable agent prompt / config",
      "full-copyable-agent-prompt-config",
    ],
    ["Full copyable command content", "full-copyable-command-content"],
    ["Full copyable hook script / config", "full-copyable-hook-script-config"],
    ["Full copyable rule content", "full-copyable-rule-content"],
    [
      "Full copyable statusline script / config",
      "full-copyable-statusline-script-config",
    ],
    ["Script language (optional)", "script-language-optional"],
    ["Verification steps (optional)", "verification-steps-optional"],
    ["Canonical product URL", "canonical-product-url"],
    ["Author profile URL", "author-profile-url"],
    ["Submitted via", "submitted-via"],
    ["Public contact", "public-contact"],
    ["Public email", "public-email"],
    ["Troubleshooting section", "troubleshooting-section"],
    ["Installation order", "installation-order"],
    ["Estimated setup time", "estimated-setup-time"],
    ["Difficulty", "difficulty"],
    ["", ""],
    ["!!!", ""],
    ["123 Test", "123-test"],
    ["UPPER CASE LABEL", "upper-case-label"],
  ])("normalizes %j to %j", (input, expected) => {
    expect(normalizeHeading(input)).toBe(expected);
  });
});

describe("normalizeValue", () => {
  it.each([
    ["_No response_", ""],
    ["  _No response_  ", ""],
    ["", ""],
    ["   ", ""],
    [null, ""],
    [undefined, ""],
    ["hello", "hello"],
    ["  trimmed  ", "trimmed"],
    ["line one\nline two", "line one\nline two"],
    ["value with tabs\tinside", "value with tabs\tinside"],
    ["0", "0"],
    ["false", "false"],
    ["Actual content", "Actual content"],
    ["Not _No response_ exactly", "Not _No response_ exactly"],
  ])("normalizeValue(%j) -> %j", (input, expected) => {
    expect(normalizeValue(input)).toBe(expected);
  });
});

describe("slugify", () => {
  it.each([
    ["Demo's MCP Server", "demos-mcp-server"],
    [`Demo "Quoted" Server`, "demo-quoted-server"],
    ["Hello World", "hello-world"],
    ["  Spaced Out  ", "spaced-out"],
    ["Special!@#$%Chars", "special-chars"],
    ["Already-kebab", "already-kebab"],
    ["Multiple   Spaces", "multiple-spaces"],
    ["Apostrophe's Rule", "apostrophes-rule"],
    ["O'Brien Tool", "obrien-tool"],
    ["", ""],
    ["!!!", ""],
    ["123 Numeric Start", "123-numeric-start"],
    ["Trailing Dash---", "trailing-dash"],
    ["Mixed CASE Slug", "mixed-case-slug"],
    ["foo/bar/baz", "foo-bar-baz"],
    ["under_score", "under-score"],
    ["dots.and.periods", "dots-and-periods"],
    ["emoji 🚀 rocket", "emoji-rocket"],
    ["tab\tseparated", "tab-separated"],
    ["double''quotes", "doublequotes"],
    [`single''and"double"`, "singleanddouble"],
    ["end-with-quote'", "end-with-quote"],
    ["'start-with-quote", "start-with-quote"],
    ["CamelCaseValue", "camelcasevalue"],
    ["MCP Server v2.0", "mcp-server-v2-0"],
    ["status_line_name", "status-line-name"],
  ])("slugify(%j) -> %j", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });
});

describe("normalizeCategory", () => {
  it.each(Object.entries(categorySpec.aliases))(
    "maps alias %s to canonical category %s",
    (alias, canonical) => {
      expect(normalizeCategory(alias)).toBe(canonical);
    },
  );

  it.each([
    ["Claude MCP Server", "mcp"],
    ["My MCP Integration", "mcp"],
    ["custom-mcp-bridge", "mcp"],
    ["foo-mcp-bar", "mcp"],
    ["MCP Server Submission", "mcp"],
    ["unknown-category", ""],
    ["", ""],
    ["   ", ""],
    ["blog post", ""],
    ["random text", ""],
  ])("normalizeCategory(%j) -> %j", (input, expected) => {
    expect(normalizeCategory(input)).toBe(expected);
  });
});

describe("isLikelyAffiliateUrl", () => {
  it.each([
    ["https://example.com?utm_source=newsletter", true],
    ["https://example.com?ref=affiliate", true],
    ["https://example.com?affiliate_id=123", true],
    ["https://example.com?via=promo", true],
    ["https://example.com", false],
    ["https://example.com/docs", false],
    ["", false],
    ["_No response_", false],
    ["not-a-url", false],
    ["https://example.com?page=2", false],
    ["  https://example.com?utm_campaign=x  ", true],
    ["http://example.com?ref=x", true],
  ])("isLikelyAffiliateUrl(%j) -> %j", (input, expected) => {
    expect(isLikelyAffiliateUrl(input)).toBe(expected);
  });
});

describe("normalizeParsedFields", () => {
  it("normalizes category aliases and slugifies slug source", () => {
    expect(
      normalizeParsedFields({
        category: "MCP Server",
        name: "Demo Server",
      }),
    ).toMatchObject({
      category: "mcp",
      slug: "demo-server",
    });
  });

  it("derives card_description from long description when absent", () => {
    const longDescription = "A".repeat(200);
    const normalized = normalizeParsedFields({ description: longDescription });
    expect(normalized.card_description).toHaveLength(140);
    expect(normalized.card_description?.endsWith("...")).toBe(true);
  });

  it("keeps short description as card_description", () => {
    expect(
      normalizeParsedFields({ description: "Short enough description." })
        .card_description,
    ).toBe("Short enough description.");
  });

  it("copies install_or_usage into usage_snippet and install_command", () => {
    expect(
      normalizeParsedFields({ install_or_usage: "npm install demo" }),
    ).toMatchObject({
      usage_snippet: "npm install demo",
      install_command: "npm install demo",
    });
  });

  it("does not overwrite existing usage_snippet or install_command", () => {
    expect(
      normalizeParsedFields({
        install_or_usage: "ignored",
        usage_snippet: "keep usage",
        install_command: "keep install",
      }),
    ).toMatchObject({
      usage_snippet: "keep usage",
      install_command: "keep install",
    });
  });

  it("normalizes brand_domain through canonicalization", () => {
    expect(
      normalizeParsedFields({ brand_domain: "https://www.example.com/path" })
        .brand_domain,
    ).toBe("example.com");
  });

  it.each([
    ["agents", "Demo Agent"],
    ["skills", "Demo Skill"],
    ["rules", "Demo Rule"],
  ])("preserves explicit slug for %s submissions", (category, name) => {
    expect(
      normalizeParsedFields({
        category,
        name,
        slug: "explicit-slug",
      }).slug,
    ).toBe("explicit-slug");
  });
});

describe("normalizeSubmissionPayloadFields", () => {
  it("joins tag arrays with commas and note arrays with newlines", () => {
    expect(
      normalizeSubmissionPayloadFields({
        name: "Demo MCP Server",
        category: "MCP",
        tags: ["mcp", "demo"],
        safetyNotes: ["Reads files", "Calls APIs"],
        privacy_notes: ["No telemetry", "Local only"],
      }),
    ).toMatchObject({
      name: "Demo MCP Server",
      category: "mcp",
      tags: "mcp, demo",
      safetyNotes: "Reads files\nCalls APIs",
      privacy_notes: "No telemetry\nLocal only",
    });
  });

  it("skips null, undefined, and nested object values", () => {
    expect(
      normalizeSubmissionPayloadFields({
        name: "Demo",
        category: "mcp",
        ignored: null,
        alsoIgnored: undefined,
        nested: { foo: "bar" },
      }),
    ).toEqual({
      name: "Demo",
      category: "mcp",
      slug: "demo",
    });
  });
});

describe("parseSubmissionPrBody", () => {
  it("parses markdown ### headings into canonical fields", () => {
    expect(
      parseSubmissionPrBody(
        [
          "### Category",
          "",
          "mcp",
          "",
          "### Name",
          "",
          "Heading MCP",
          "",
          "### GitHub URL",
          "",
          "https://github.com/example/heading-mcp",
        ].join("\n"),
      ),
    ).toMatchObject({
      category: "mcp",
      name: "Heading MCP",
      github_url: "https://github.com/example/heading-mcp",
    });
  });

  it("parses JSON code blocks and merges mapped aliases", () => {
    expect(
      parseSubmissionPrBody(
        [
          "### JSON Data",
          "",
          "```json",
          JSON.stringify({
            title: "JSON MCP",
            category: "mcp",
            repoUrl: "https://github.com/example/json-mcp",
            tags: ["json", "mcp"],
            contactEmail: "user@example.com",
          }),
          "```",
        ].join("\n"),
      ),
    ).toMatchObject({
      name: "JSON MCP",
      category: "mcp",
      github_url: "https://github.com/example/json-mcp",
      tags: "json, mcp",
      contact_email: "user@example.com",
    });
  });

  it("parses bold field lines", () => {
    expect(
      parseSubmissionPrBody(
        [
          "**Category:** MCP",
          "",
          "**Name:** Bold MCP",
          "",
          "**Privacy notes:** Sends prompts to the selected model.",
        ].join("\n"),
      ),
    ).toMatchObject({
      category: "mcp",
      name: "Bold MCP",
      privacy_notes: "Sends prompts to the selected model.",
    });
  });

  it("parses bullet list field format with continuation lines", () => {
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

  it("parses plain label lines with following content", () => {
    expect(
      parseSubmissionPrBody(
        [
          "Contact email:",
          "@example",
          "",
          "Description:",
          "A long enough description for review.",
        ].join("\n"),
      ),
    ).toMatchObject({
      contact_email: "@example",
      description: "A long enough description for review.",
    });
  });

  it("treats prototype property heading names as literal field keys", () => {
    expect(parseSubmissionPrBody("### Constructor\n\nbuilder")).toEqual({
      constructor: "builder",
    });
  });

  it.each([
    ["GitHub URL", "github_url"],
    ["Docs URL", "docs_url"],
    ["Safety notes", "safety_notes"],
    ["Privacy notes", "privacy_notes"],
    ["Install command", "install_command"],
    ["Usage snippet", "usage_snippet"],
    ["Command syntax", "command_syntax"],
    ["Guide content (markdown)", "guide_content"],
    ["Items (category slug list)", "items"],
    ["Script language", "script_language"],
    ["Pricing model", "pricing_model"],
    ["Website URL", "website_url"],
  ])("maps markdown heading %s to %s", (heading, fieldKey) => {
    const parsed = parseSubmissionPrBody(`### ${heading}\n\ntest-value`);
    expect(parsed[fieldKey as keyof typeof parsed]).toBe("test-value");
  });
});

describe("buildSubmissionPrTitle", () => {
  it.each([
    ["mcp", "Demo MCP Server", "Add MCP Server: Demo MCP Server"],
    ["agents", "Demo Agent", "Add Agent: Demo Agent"],
    ["skills", "Demo Skill", "Add Skill: Demo Skill"],
    ["rules", "Demo Rule", "Add Rule: Demo Rule"],
    ["commands", "Demo Command", "Add Command: Demo Command"],
    ["hooks", "Demo Hook", "Add Hook: Demo Hook"],
    ["guides", "Demo Guide", "Add Guide: Demo Guide"],
    ["collections", "Demo Collection", "Add Collection: Demo Collection"],
    ["statuslines", "Demo Statusline", "Add Statusline: Demo Statusline"],
    ["tools", "Demo Tool", "Add Tool: Demo Tool"],
  ])(
    "builds singular title for %s category",
    (category, name, expectedTitle) => {
      expect(buildSubmissionPrTitle({ category, name })).toBe(expectedTitle);
    },
  );

  it("falls back when name is missing", () => {
    expect(buildSubmissionPrTitle({ category: "mcp" })).toBe(
      "Add MCP Server: New directory entry",
    );
  });
});

describe("buildSubmissionPrBody and buildSubmissionPrDraft", () => {
  it("builds MCP body with safety and install sections", () => {
    const body = buildSubmissionPrBody(validMcpFields);
    expect(body).toContain("### Safety notes");
    expect(body).toContain("### Install command");
    expect(body).toContain("### Usage snippet");
  });

  it("builds a round-trippable draft", () => {
    const draft = buildSubmissionPrDraft(validMcpFields);
    expect(draft.title).toBe("Add MCP Server: Demo MCP Server");
    expect(parseSubmissionPrBody(draft.body)).toMatchObject({
      category: "mcp",
      name: "Demo MCP Server",
      contact_email: "@example",
    });
  });

  it.each([
    ["agents", validAgentsFields],
    ["skills", validSkillsFields],
    ["rules", validRulesFields],
    ["commands", validCommandsFields],
    ["hooks", validHooksFields],
    ["guides", validGuidesFields],
    ["collections", validCollectionsFields],
    ["statuslines", validStatuslinesFields],
    ["tools", validToolsFields],
  ])("builds non-empty body for %s submissions", (category, fields) => {
    const body = buildSubmissionPrBody(fields);
    expect(body).toContain("### Category");
    expect(body.length).toBeGreaterThan(20);
    expect(normalizeCategory(parseSubmissionPrBody(body).category)).toBe(
      category,
    );
  });
});

describe("looksLikeSubmissionPrDraft", () => {
  it.each([
    [{ title: "[Submit] Demo MCP", body: "" }, true],
    [{ title: "Submit: Demo MCP", body: "" }, true],
    [{ title: "submit demo", body: "" }, true],
    [
      {
        title: "Add MCP Server: Demo",
        body: "### Category\n\nmcp\n\n### Name\n\nDemo",
      },
      true,
    ],
    [
      { title: "Random PR", body: "### Category\n\nmcp\n\n### Name\n\nDemo" },
      true,
    ],
    [{ title: "Random PR", body: "**Category:** mcp\n\n**Name:** Demo" }, true],
    [{ title: "Random PR", body: "category: mcp\n\nname: Demo" }, true],
    [
      {
        title: "Random PR",
        body: "### Content type\n\nmcp\n\n### GitHub URL\n\nhttps://example.com",
      },
      true,
    ],
    [{ title: "Random PR", body: "### JSON Data\n\n{}" }, false],
    [{ title: "Random PR", body: "Hello world" }, false],
    [{ title: "Fix typo", body: "### Category\n\nmcp" }, false],
    [{ title: "Fix typo", body: "### Name\n\nDemo" }, false],
    [{ title: "", body: "" }, false],
  ])("looksLikeSubmissionPrDraft(%j) -> %j", (draft, expected) => {
    expect(looksLikeSubmissionPrDraft(draft)).toBe(expected);
  });
});

describe("validateSubmission skipped and non-core categories", () => {
  it.each([
    ["", "non_core_category_submission"],
    ["blog", "non_core_category_submission"],
    ["unknown", "non_core_category_submission"],
  ])("skips validation for unsupported category %j", (category, reason) => {
    const result = validateSubmission({
      title: "Add Entry: Demo",
      body: buildSubmissionPrBody({
        category,
        name: "Demo",
        description: "x".repeat(20),
        card_description: "Long enough card.",
      }),
    });
    expect(result.skipped).toBe(true);
    expect(result.reason).toBe(reason);
    expect(result.ok).toBe(true);
  });
});

describe("validateSubmission mcp", () => {
  it("accepts a complete MCP submission", () => {
    const body = buildValidBody(validMcpFields);
    expect(
      validateSubmission({ title: "Add MCP Server: Demo", body }),
    ).toMatchObject({
      ok: true,
      skipped: false,
      category: "mcp",
      errors: [],
    });
  });

  it.each(["name", "install_command", "usage_snippet"])(
    "reports missing required MCP field %s",
    (field) => {
      const fields = { ...validMcpFields, [field]: "" };
      const result = validateSubmission({
        title: "Add MCP Server: Demo",
        body: buildValidBody(fields),
      });
      expect(result.ok).toBe(false);
      expect(result.errors).toContain(`Missing required field: ${field}`);
    },
  );

  it("reports missing description and card_description when both are absent", () => {
    const result = validateSubmission({
      title: "Add MCP Server: Demo",
      body: buildValidBody({
        ...validMcpFields,
        description: "",
        card_description: "",
      }),
    });
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("Missing required field: description");
    expect(result.errors).toContain("Missing required field: card_description");
  });

  it("derives slug from name when slug is omitted", () => {
    const result = validateSubmission({
      title: "Add MCP Server: Demo",
      body: buildValidBody({ ...validMcpFields, slug: "" }),
    });
    expect(result.fields.slug).toBe("demo-mcp-server");
    expect(result.errors).not.toContain("Missing required field: slug");
  });

  it.each(["n/a", "none", "no"])(
    "rejects low-detail MCP %s disclosure notes",
    (note) => {
      const result = validateSubmission({
        title: "Add MCP Server: Demo",
        body: buildValidBody({
          ...validMcpFields,
          safety_notes: note,
          privacy_notes: note,
        }),
      });
      expect(result.errors).toEqual(
        expect.arrayContaining([
          'safety_notes must explain the relevant behavior, or use "Not applicable: ..." with a specific reason',
          'privacy_notes must explain the relevant behavior, or use "Not applicable: ..." with a specific reason',
        ]),
      );
    },
  );

  it("rejects affiliate params in github_url and docs_url", () => {
    const result = validateSubmission({
      title: "Add MCP Server: Demo",
      body: buildValidBody({
        ...validMcpFields,
        docs_url: "https://example.com/docs?utm_source=newsletter",
      }),
    });
    expect(result.errors).toContain(
      "Contributor submissions cannot include affiliate/referral URLs: docs_url",
    );
  });

  it("rejects local /downloads hosting on heyclau.de", () => {
    const result = validateSubmission({
      title: "Add MCP Server: Demo",
      body: buildValidBody({
        ...validMcpFields,
        download_url: "https://heyclau.de/downloads/demo.zip",
      }),
    });
    expect(result.errors).toContain(
      "Community submissions cannot request local /downloads hosting",
    );
  });
});

describe("validateSubmission skills", () => {
  it("accepts a complete skills submission", () => {
    const result = validateSubmission({
      title: "Add Skill: Demo",
      body: buildValidBody(validSkillsFields),
    });
    expect(result).toMatchObject({ ok: true, category: "skills" });
  });

  it.each([
    "usage_snippet",
    "skill_type",
    "skill_level",
    "verification_status",
  ])("reports missing required skills field %s", (field) => {
    const result = validateSubmission({
      title: "Add Skill: Demo",
      body: buildValidBody({ ...validSkillsFields, [field]: "" }),
    });
    expect(result.errors).toContain(`Missing required field: ${field}`);
  });

  it("requires an install path when all sources are removed", () => {
    const result = validateSubmission({
      title: "Add Skill: Demo",
      body: buildValidBody({
        ...validSkillsFields,
        install_command: "",
        github_url: "",
        docs_url: "",
        full_copyable_content: "",
        retrieval_sources: "",
      }),
    });
    expect(result.errors).toContain(
      "Skills submissions require install_command, source URL, retrieval_sources, or full_copyable_content",
    );
  });

  it("rejects GitHub blob download_url paths", () => {
    const result = validateSubmission({
      title: "Add Skill: Demo",
      body: buildValidBody({
        ...validSkillsFields,
        download_url: "https://github.com/example/bad/blob/main/SKILL.md",
      }),
    });
    expect(result.errors).toContain(
      "download_url must point to a package, archive, or release download; use github_url or retrieval_sources for GitHub source tree/blob paths",
    );
  });

  it.each([
    [
      "capability-pack",
      "advanced",
      "validated",
      "",
      "capability-pack skills require verified_at",
    ],
    [
      "capability-pack",
      "advanced",
      "validated",
      "2026-01-01",
      "capability-pack skills require retrieval_sources",
    ],
    [
      "capability-pack",
      "intermediate",
      "validated",
      "2026-01-01",
      "capability-pack skills must use skill_level=expert",
    ],
    [
      "general",
      "foundational",
      "unknown",
      "",
      "Invalid verification_status: unknown",
    ],
  ])(
    "validates skill metadata for type=%s level=%s status=%s verifiedAt=%s",
    (
      skill_type,
      skill_level,
      verification_status,
      verified_at,
      expectedError,
    ) => {
      const result = validateSubmission({
        title: "Add Skill: Demo",
        body: buildValidBody({
          ...validSkillsFields,
          skill_type,
          skill_level,
          verification_status,
          verified_at,
          retrieval_sources:
            skill_type === "capability-pack" &&
            expectedError.includes("retrieval")
              ? ""
              : "https://example.com/docs",
        }),
      });
      expect(result.errors).toContain(expectedError);
    },
  );

  it("rejects forbidden counters in full_copyable_content", () => {
    const result = validateSubmission({
      title: "Add Skill: Demo",
      body: buildValidBody({
        ...validSkillsFields,
        full_copyable_content: "viewCount: 10",
      }),
    });
    expect(result.errors).toContain(
      "Forbidden counters detected in full_copyable_content",
    );
  });
});

describe("validateSubmission tools", () => {
  it("accepts a maintainer-approved tools listing", () => {
    const result = validateSubmission({
      title: "Add Tool: Demo",
      body: buildValidBody(validToolsFields),
      labels: ["accepted"],
    });
    expect(result).toMatchObject({ ok: true, category: "tools" });
  });

  it("requires maintainer approval label", () => {
    const result = validateSubmission({
      title: "Add Tool: Demo",
      body: buildValidBody(validToolsFields),
    });
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.join(" ").toLowerCase()).toContain("approval");
  });

  it.each([
    "websiteUrl",
    "documentationUrl",
    "pricingModel",
    "disclosure",
    "applicationCategory",
    "operatingSystem",
  ])("reports missing tools review field %s", (field) => {
    const result = validateSubmission({
      title: "Add Tool: Demo",
      body: buildValidBody({
        ...validToolsFields,
        website_url: "",
        docs_url: "",
        pricing_model: "",
        disclosure: "",
        application_category: "",
        operating_system: "",
      }),
      labels: ["accepted"],
    });
    expect(result.errors.some((error) => error.includes(field))).toBe(true);
  });

  it.each([
    ["enterprise-only", "pricing_model is not recognized"],
    [
      "paid-partnership",
      "disclosure must be editorial, heyclaude_pick, affiliate, sponsored, or claimed",
    ],
    ["affiliate", "affiliate tools listings require affiliate_url"],
  ])("validates tools pricing/disclosure combo %s", (value, expectedError) => {
    const isPricing = expectedError.includes("pricing_model");
    const result = validateSubmission({
      title: "Add Tool: Demo",
      body: buildValidBody({
        ...validToolsFields,
        pricing_model: isPricing ? value : "free",
        disclosure: isPricing ? "editorial" : value,
        affiliate_url: "",
      }),
      labels: ["accepted"],
    });
    expect(result.errors).toContain(expectedError);
  });

  it("allows affiliate_url for tools with affiliate disclosure", () => {
    const result = validateSubmission({
      title: "Add Tool: Demo",
      body: buildValidBody({
        ...validToolsFields,
        disclosure: "affiliate",
        affiliate_url: "https://example.com?ref=partner",
      }),
      labels: ["accepted"],
    });
    expect(result.errors).not.toContain(
      "Contributor submissions cannot include affiliate_url outside maintainer-reviewed tools listings",
    );
  });

  it("rejects affiliate_url outside tools category", () => {
    const result = validateSubmission({
      title: "Add MCP Server: Demo",
      body: buildValidBody({
        ...validMcpFields,
        affiliate_url: "https://example.com?ref=partner",
      }),
    });
    expect(result.errors).toContain(
      "Contributor submissions cannot include affiliate_url outside maintainer-reviewed tools listings",
    );
  });
});

describe("validateSubmission hooks", () => {
  it("accepts a complete hooks submission", () => {
    expect(
      validateSubmission({
        title: "Add Hook: Demo",
        body: buildValidBody(validHooksFields),
      }),
    ).toMatchObject({ ok: true, category: "hooks" });
  });

  it.each(["trigger", "usage_snippet", "full_copyable_content"])(
    "reports missing required hooks field %s",
    (field) => {
      const result = validateSubmission({
        title: "Add Hook: Demo",
        body: buildValidBody({ ...validHooksFields, [field]: "" }),
      });
      expect(result.errors).toContain(`Missing required field: ${field}`);
    },
  );
});

describe("validateSubmission rules", () => {
  it("accepts a complete rules submission", () => {
    expect(
      validateSubmission({
        title: "Add Rule: Demo",
        body: buildValidBody(validRulesFields),
      }),
    ).toMatchObject({ ok: true, category: "rules" });
  });

  it("reports missing full_copyable_content", () => {
    const result = validateSubmission({
      title: "Add Rule: Demo",
      body: buildValidBody({ ...validRulesFields, full_copyable_content: "" }),
    });
    expect(result.errors).toContain(
      "Missing required field: full_copyable_content",
    );
  });
});

describe("validateSubmission commands", () => {
  it("accepts a complete commands submission", () => {
    expect(
      validateSubmission({
        title: "Add Command: Demo",
        body: buildValidBody(validCommandsFields),
      }),
    ).toMatchObject({ ok: true, category: "commands" });
  });

  it.each(["command_syntax", "usage_snippet", "full_copyable_content"])(
    "reports missing required commands field %s",
    (field) => {
      const result = validateSubmission({
        title: "Add Command: Demo",
        body: buildValidBody({ ...validCommandsFields, [field]: "" }),
      });
      expect(result.errors).toContain(`Missing required field: ${field}`);
    },
  );
});

describe("validateSubmission agents", () => {
  it("accepts a complete agents submission", () => {
    expect(
      validateSubmission({
        title: "Add Agent: Demo",
        body: buildValidBody(validAgentsFields),
      }),
    ).toMatchObject({ ok: true, category: "agents" });
  });

  it("reports missing full_copyable_content", () => {
    const result = validateSubmission({
      title: "Add Agent: Demo",
      body: buildValidBody({ ...validAgentsFields, full_copyable_content: "" }),
    });
    expect(result.errors).toContain(
      "Missing required field: full_copyable_content",
    );
  });
});

describe("validateSubmission guides", () => {
  it("accepts a complete guides submission", () => {
    const body = [
      buildValidBody(validGuidesFields),
      "",
      "### Guide content (markdown)",
      "",
      validGuidesFields.guide_content,
    ].join("\n");
    expect(
      validateSubmission({
        title: "Add Guide: Demo",
        body,
      }),
    ).toMatchObject({ ok: true, category: "guides" });
  });

  it("reports missing guide_content", () => {
    const result = validateSubmission({
      title: "Add Guide: Demo",
      body: buildValidBody({ ...validGuidesFields, guide_content: "" }),
    });
    expect(result.errors).toContain("Guide submissions require guide_content");
  });
});

describe("validateSubmission collections", () => {
  it("accepts a complete collections submission", () => {
    expect(
      validateSubmission({
        title: "Add Collection: Demo",
        body: buildValidBody(validCollectionsFields),
      }),
    ).toMatchObject({ ok: true, category: "collections" });
  });

  it("reports missing items", () => {
    const result = validateSubmission({
      title: "Add Collection: Demo",
      body: buildValidBody({ ...validCollectionsFields, items: "" }),
    });
    expect(result.errors).toContain("Collections submissions require items");
  });
});

describe("validateSubmission statuslines", () => {
  it("accepts a complete statuslines submission", () => {
    expect(
      validateSubmission({
        title: "Add Statusline: Demo",
        body: buildValidBody(validStatuslinesFields),
      }),
    ).toMatchObject({ ok: true, category: "statuslines" });
  });

  it.each(["script_language", "usage_snippet", "full_copyable_content"])(
    "reports missing required statuslines field %s",
    (field) => {
      const result = validateSubmission({
        title: "Add Statusline: Demo",
        body: buildValidBody({ ...validStatuslinesFields, [field]: "" }),
      });
      expect(result.errors).toContain(`Missing required field: ${field}`);
    },
  );
});

describe("validateSubmission shared guardrails", () => {
  it.each([
    "user@example.com@attacker.com",
    "user@.example.com",
    "user@example.com.",
    "not a contact",
  ])("rejects invalid public contact %j", (contact_email) => {
    const result = validateSubmission({
      title: "Add MCP Server: Demo",
      body: buildValidBody({ ...validMcpFields, contact_email }),
    });
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "Invalid public contact: use a GitHub handle, GitHub profile URL, or email",
      ]),
    );
  });

  it("rejects GitHub profile contact URLs with embedded userinfo", () => {
    const result = validateSubmission({
      title: "Add MCP Server: Demo",
      body: buildValidBody({
        ...validMcpFields,
        contact_email: "https://token@github.com/victim",
      }),
    });
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "Invalid public contact: use a GitHub handle, GitHub profile URL, or email",
      ]),
    );
  });

  it("auto-normalizes slug to kebab-case during parsing", () => {
    const result = validateSubmission({
      title: "Add MCP Server: Demo",
      body: buildValidBody({ ...validMcpFields, slug: "Bad Slug" }),
    });
    expect(result.fields.slug).toBe("bad-slug");
    expect(result.errors).not.toContain(
      "Invalid slug format: expected kebab-case",
    );
  });

  it("rejects short description and card_description", () => {
    const result = validateSubmission({
      title: "Add MCP Server: Demo",
      body: buildValidBody({
        ...validMcpFields,
        description: "Too short",
        card_description: "Tiny",
      }),
    });
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "Description is too short for review",
        "Card description is too short for review",
      ]),
    );
  });

  it("rejects invalid brand_domain", () => {
    const result = validateSubmission({
      title: "Add MCP Server: Demo",
      body: buildValidBody({ ...validMcpFields, brand_domain: "-bad-domain" }),
    });
    expect(result.errors).toContain(
      "brand_domain must be a canonical domain such as asana.com",
    );
  });

  it("routes commercial language in non-tools submissions to tools flow", () => {
    const result = validateSubmission({
      title: "Add Skill: Demo",
      body: buildValidBody({
        ...validSkillsFields,
        description:
          "A hosted SaaS platform with subscription pricing and a dashboard for teams.",
      }),
    });
    expect(result.errors.some((error) => error.includes("tools"))).toBe(true);
  });

  it("accepts protected submission labels as objects", () => {
    const result = validateSubmission({
      title: "Add Tool: Demo",
      body: buildValidBody(validToolsFields),
      labels: [{ name: "accepted" }],
    });
    expect(result.ok).toBe(true);
  });

  it("warns when github_url and docs_url are both absent", () => {
    const result = validateSubmission({
      title: "Add Agent: Demo",
      body: buildValidBody({
        ...validAgentsFields,
        github_url: "",
        docs_url: "",
      }),
    });
    expect(result.warnings).toContain("No github_url/docs_url provided");
  });

  it("limits safety_notes and privacy_notes list size and item length", () => {
    const longNote = "x".repeat(321);
    const manyNotes = Array.from(
      { length: 9 },
      (_, index) => `Note ${index + 1}`,
    );
    const result = validateSubmission({
      title: "Add MCP Server: Demo",
      body: buildValidBody({
        ...validMcpFields,
        safety_notes: [longNote, ...manyNotes].join("\n"),
      }),
    });
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "safety_notes must include 8 items or fewer",
        "safety_notes items must be 320 characters or fewer",
      ]),
    );
  });

  it("rejects non-https URLs", () => {
    const result = validateSubmission({
      title: "Add MCP Server: Demo",
      body: buildValidBody({
        ...validMcpFields,
        github_url: "http://example.com/source",
      }),
    });
    expect(result.errors).toContain("github_url must be a valid https URL");
  });

  it("rejects https URLs with embedded userinfo credentials", () => {
    const result = validateSubmission({
      title: "Add MCP Server: Demo",
      body: buildValidBody({
        ...validMcpFields,
        github_url: "https://github.com@evil.example.com/owner/repo",
        docs_url: "https://token@example.com/docs",
      }),
    });
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "github_url must be a valid https URL",
        "docs_url must be a valid https URL",
      ]),
    );
  });

  it("accepts Not applicable disclosure notes with specific reasons", () => {
    const result = validateSubmission({
      title: "Add MCP Server: Demo",
      body: buildValidBody({
        ...validMcpFields,
        safety_notes:
          "Not applicable: this MCP server exposes read-only demo tools.",
        privacy_notes:
          "Not applicable: no external data leaves the local client.",
      }),
    });
    expect(result.ok).toBe(true);
  });
});
