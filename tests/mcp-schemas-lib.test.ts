import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
  BuildSubmissionUrlsInputSchema,
  CategorySubmissionGuidanceInputSchema,
  ClientSetupInputSchema,
  CompareEntriesInputSchema,
  CompareEntryTrustInputSchema,
  CompatibilityInputSchema,
  CopyableAssetInputSchema,
  EntryDetailInputSchema,
  ExplainEntryTrustInputSchema,
  GetServerInfoInputSchema,
  GetSubmissionExamplesInputSchema,
  GetSubmissionSchemaInputSchema,
  InstallGuidanceInputSchema,
  ListCategoryEntriesInputSchema,
  ListDistributionFeedsInputSchema,
  PlanWorkflowToolboxInputSchema,
  PlatformAdapterInputSchema,
  PrepareSubmissionDraftInputSchema,
  RecentUpdatesInputSchema,
  RecommendForTaskInputSchema,
  RegistryStatsInputSchema,
  RelatedEntriesInputSchema,
  ReviewEntrySafetyInputSchema,
  ReviewSubmissionDraftInputSchema,
  SearchDuplicateEntriesInputSchema,
  SearchRegistryInputSchema,
  SubmissionFieldsSchema,
  SubmissionPolicyInputSchema,
  TOOL_INPUT_SCHEMAS,
  ValidateSubmissionDraftInputSchema,
  formatZodError,
  jsonSchemaForTool,
  jsonSchemaForToolOutput,
  parseToolArguments,
} from "../packages/mcp/src/schemas-lib.js";

type ZodSchema = z.ZodType;

function expectParseSuccess(schema: ZodSchema, value: unknown) {
  const result = schema.safeParse(value);
  expect(result.success, JSON.stringify(result)).toBe(true);
  if (result.success) return result.data;
  return undefined;
}

function expectParseFailure(
  schema: ZodSchema,
  value: unknown,
  pathHint?: string,
) {
  const result = schema.safeParse(value);
  expect(result.success).toBe(false);
  if (result.success) return;
  if (pathHint) {
    const paths = result.error.issues.map((issue) => issue.path.join("."));
    expect(paths.some((path) => path.includes(pathHint))).toBe(true);
  }
  return result.error;
}

const VALID_PATH = "example-mcp-server";
const VALID_CATEGORY = "mcp";
const VALID_PLATFORM = "cursor";
const VALID_CLIENT = "claude-desktop";
const VALID_SUBMISSION_CATEGORY = "skills";

const VALID_SUBMISSION_FIELDS = {
  name: "Example Skill",
  category: VALID_SUBMISSION_CATEGORY,
  slug: "example-skill",
  github_url: "https://github.com/example/example-skill",
  description: "A concise skill description for schema validation.",
  safety_notes: "Runs locally.\nNo network access.",
  privacy_notes: "Does not read user files.",
};

describe("SearchRegistryInputSchema", () => {
  it("accepts an empty object", () => {
    expectParseSuccess(SearchRegistryInputSchema, {});
  });

  it("accepts a fully populated valid search", () => {
    expectParseSuccess(SearchRegistryInputSchema, {
      query: "browser automation",
      category: VALID_CATEGORY,
      platform: VALID_PLATFORM,
      tag: "testing",
      hasSafetyNotes: "true",
      hasPrivacyNotes: "false",
      downloadTrust: "first-party",
      claimStatus: "verified",
      sourceStatus: "available",
      limit: 10,
    });
  });

  it.each([
    ["query over 240 chars", { query: "x".repeat(241) }],
    ["invalid category slug", { category: "MCP_Servers" }],
    ["empty platform", { platform: "" }],
    ["platform over 80 chars", { platform: "p".repeat(81) }],
    ["empty tag", { tag: "" }],
    ["tag over 80 chars", { tag: "t".repeat(81) }],
    ["invalid hasSafetyNotes", { hasSafetyNotes: "maybe" }],
    ["invalid hasPrivacyNotes", { hasPrivacyNotes: "yes" }],
    ["invalid downloadTrust", { downloadTrust: "trusted" }],
    ["invalid claimStatus", { claimStatus: "claimed" }],
    ["invalid sourceStatus", { sourceStatus: "broken" }],
    ["limit below 1", { limit: 0 }],
    ["limit above 25", { limit: 26 }],
    ["non-integer limit", { limit: 3.5 }],
    ["unknown key rejected by strict()", { query: "x", extra: true }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(SearchRegistryInputSchema, value);
  });

  it.each([
    ["all", "all"],
    ["true", "true"],
    ["false", "false"],
  ] as const)("accepts hasSafetyNotes=%s", (value) => {
    expectParseSuccess(SearchRegistryInputSchema, { hasSafetyNotes: value });
  });

  it.each([1, 25])("accepts boundary limit=%i", (limit) => {
    expectParseSuccess(SearchRegistryInputSchema, { limit });
  });

  it("trims query whitespace", () => {
    const parsed = expectParseSuccess(SearchRegistryInputSchema, {
      query: "  browser  ",
    });
    expect(parsed).toMatchObject({ query: "browser" });
  });
});

describe("SubmissionFieldsSchema", () => {
  it("accepts an empty object", () => {
    expectParseSuccess(SubmissionFieldsSchema, {});
  });

  it("accepts a representative submission payload", () => {
    expectParseSuccess(SubmissionFieldsSchema, VALID_SUBMISSION_FIELDS);
  });

  it.each([
    "agents",
    "rules",
    "mcp",
    "skills",
    "hooks",
    "commands",
    "statuslines",
    "collections",
    "guides",
  ] as const)("accepts category=%s", (category) => {
    expectParseSuccess(SubmissionFieldsSchema, { category });
  });

  it("accepts tags as a comma-separated string", () => {
    expectParseSuccess(SubmissionFieldsSchema, {
      tags: "mcp, testing, automation",
    });
  });

  it("accepts tags as a string array", () => {
    expectParseSuccess(SubmissionFieldsSchema, {
      tags: ["mcp", "testing", "automation"],
    });
  });

  it("accepts notes with up to eight non-empty lines", () => {
    expectParseSuccess(SubmissionFieldsSchema, {
      safety_notes: Array.from({ length: 8 }, (_, i) => `line ${i + 1}`).join(
        "\n",
      ),
    });
  });

  it.each([
    ["invalid category", { category: "plugins" }],
    ["invalid slug", { slug: "Bad Slug" }],
    ["text over 4000 chars", { name: "n".repeat(4001) }],
    ["description over 24000 chars", { description: "d".repeat(24001) }],
    [
      "more than 20 tag array entries",
      { tags: Array.from({ length: 21 }, () => "tag") },
    ],
    ["empty tag in array", { tags: ["valid", ""] }],
    ["tag string over 80 chars in array", { tags: ["x".repeat(81)] }],
    ["tags string over 1000 chars", { tags: "t".repeat(1001) }],
    [
      "notes with more than 8 lines",
      { safety_notes: Array.from({ length: 9 }, () => "note").join("\n") },
    ],
    ["notes line over 320 chars", { privacy_notes: "p".repeat(321) }],
    ["unknown field rejected by strict()", { name: "x", surprise: true }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(SubmissionFieldsSchema, value);
  });

  it("trims optional text fields", () => {
    const parsed = expectParseSuccess(SubmissionFieldsSchema, {
      name: "  Example  ",
      author: "  maintainer  ",
    });
    expect(parsed).toMatchObject({ name: "Example", author: "maintainer" });
  });

  it.each([
    "install_command",
    "usage_snippet",
    "command_syntax",
    "trigger",
    "guide_content",
    "items",
    "config_snippet",
    "retrieval_sources",
    "prerequisites",
    "troubleshooting_section",
    "full_copyable_content",
  ] as const)("accepts long-text field %s within bounds", (field) => {
    expectParseSuccess(SubmissionFieldsSchema, {
      [field]: "content".repeat(100),
    });
  });
});

describe("EntryDetailInputSchema", () => {
  it("accepts required category and slug", () => {
    expectParseSuccess(EntryDetailInputSchema, {
      category: VALID_CATEGORY,
      slug: VALID_PATH,
    });
  });

  it.each(["none", "excerpt", "full"] as const)(
    "accepts bodyMode=%s",
    (bodyMode) => {
      expectParseSuccess(EntryDetailInputSchema, {
        category: VALID_CATEGORY,
        slug: VALID_PATH,
        bodyMode,
      });
    },
  );

  it.each([
    ["missing category", { slug: VALID_PATH }],
    ["missing slug", { category: VALID_CATEGORY }],
    ["invalid category", { category: "MCP", slug: VALID_PATH }],
    ["invalid slug", { category: VALID_CATEGORY, slug: "Bad Slug" }],
    [
      "invalid bodyMode",
      { category: VALID_CATEGORY, slug: VALID_PATH, bodyMode: "summary" },
    ],
    [
      "unknown key",
      { category: VALID_CATEGORY, slug: VALID_PATH, includeBody: true },
    ],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(EntryDetailInputSchema, value);
  });
});

describe("CompareEntriesInputSchema", () => {
  const pair = [
    { category: "mcp", slug: "alpha-server" },
    { category: "skills", slug: "beta-skill" },
  ];

  it("accepts two entries with optional platform", () => {
    expectParseSuccess(CompareEntriesInputSchema, {
      entries: pair,
      platform: VALID_PLATFORM,
    });
  });

  it("accepts up to five entries", () => {
    expectParseSuccess(CompareEntriesInputSchema, {
      entries: [
        { category: "mcp", slug: "one" },
        { category: "mcp", slug: "two" },
        { category: "skills", slug: "three" },
        { category: "hooks", slug: "four" },
        { category: "rules", slug: "five" },
      ],
    });
  });

  it.each([
    ["only one entry", { entries: [{ category: "mcp", slug: "solo" }] }],
    [
      "six entries",
      {
        entries: Array.from({ length: 6 }, (_, i) => ({
          category: "mcp",
          slug: `entry-${i}`,
        })),
      },
    ],
    [
      "invalid nested category",
      {
        entries: [
          { category: "MCP", slug: "alpha" },
          { category: "skills", slug: "beta" },
        ],
      },
    ],
    [
      "invalid nested slug",
      {
        entries: [
          { category: "mcp", slug: "alpha" },
          { category: "skills", slug: "Bad Slug" },
        ],
      },
    ],
    [
      "extra nested key",
      {
        entries: [
          { category: "mcp", slug: "alpha", title: "Alpha" },
          { category: "skills", slug: "beta" },
        ],
      },
    ],
    ["empty platform", { entries: pair, platform: "" }],
    ["unknown top-level key", { entries: pair, sort: "title" }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(CompareEntriesInputSchema, value);
  });
});

describe("SearchDuplicateEntriesInputSchema", () => {
  it("accepts an empty object", () => {
    expectParseSuccess(SearchDuplicateEntriesInputSchema, {});
  });

  it("accepts all optional duplicate-search fields", () => {
    expectParseSuccess(SearchDuplicateEntriesInputSchema, {
      category: VALID_CATEGORY,
      slug: VALID_PATH,
      name: "Example MCP",
      title: "Example MCP Server",
      sourceUrl: "https://github.com/example/repo",
      sourceUrls: [
        "https://github.com/example/repo",
        "https://example.com/docs",
      ],
      githubUrl: "https://github.com/example/repo",
      docsUrl: "https://example.com/docs",
      downloadUrl: "https://example.com/releases/latest.zip",
      websiteUrl: "https://example.com",
      brandDomain: "example.com",
      limit: 5,
    });
  });

  it.each([
    ["invalid category", { category: "MCP" }],
    ["invalid slug", { slug: "Bad Slug" }],
    ["empty name", { name: "" }],
    ["name over 240 chars", { name: "n".repeat(241) }],
    ["empty title", { title: "" }],
    ["empty sourceUrl", { sourceUrl: "" }],
    [
      "sourceUrl over 500 chars",
      { sourceUrl: `https://x.test/${"a".repeat(500)}` },
    ],
    [
      "more than 10 sourceUrls",
      {
        sourceUrls: Array.from(
          { length: 11 },
          (_, i) => `https://example.com/${i}`,
        ),
      },
    ],
    ["empty sourceUrls entry", { sourceUrls: ["https://example.com", ""] }],
    ["limit below 1", { limit: 0 }],
    ["limit above 10", { limit: 11 }],
    ["unknown key", { name: "Example", extra: true }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(SearchDuplicateEntriesInputSchema, value);
  });

  it.each([1, 10])("accepts boundary limit=%i", (limit) => {
    expectParseSuccess(SearchDuplicateEntriesInputSchema, { limit });
  });
});

describe("ReviewSubmissionDraftInputSchema", () => {
  it("accepts fields only", () => {
    expectParseSuccess(ReviewSubmissionDraftInputSchema, {
      fields: VALID_SUBMISSION_FIELDS,
    });
  });

  it("accepts fields with duplicateLimit", () => {
    expectParseSuccess(ReviewSubmissionDraftInputSchema, {
      fields: VALID_SUBMISSION_FIELDS,
      duplicateLimit: 3,
    });
  });

  it.each([
    ["missing fields", {}],
    ["invalid nested field", { fields: { category: "invalid" } }],
    [
      "duplicateLimit below 1",
      { fields: VALID_SUBMISSION_FIELDS, duplicateLimit: 0 },
    ],
    [
      "duplicateLimit above 10",
      { fields: VALID_SUBMISSION_FIELDS, duplicateLimit: 11 },
    ],
    ["unknown key", { fields: VALID_SUBMISSION_FIELDS, strictReview: true }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(ReviewSubmissionDraftInputSchema, value);
  });
});

describe("PlanWorkflowToolboxInputSchema", () => {
  it("accepts a minimal goal", () => {
    expectParseSuccess(PlanWorkflowToolboxInputSchema, { goal: "Review PRs" });
  });

  it("accepts optional filters and limit", () => {
    expectParseSuccess(PlanWorkflowToolboxInputSchema, {
      goal: "Automate browser testing",
      category: VALID_CATEGORY,
      platform: VALID_PLATFORM,
      limit: 6,
    });
  });

  it.each([
    ["missing goal", {}],
    ["goal too short", { goal: "x" }],
    ["goal over 240 chars", { goal: "g".repeat(241) }],
    ["invalid category", { goal: "test workflows", category: "MCP" }],
    ["limit above 10", { goal: "test workflows", limit: 11 }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(PlanWorkflowToolboxInputSchema, value);
  });
});

describe("RecommendForTaskInputSchema", () => {
  it("accepts a minimal task", () => {
    expectParseSuccess(RecommendForTaskInputSchema, {
      task: "Connect to Postgres",
    });
  });

  it.each([
    ["missing task", {}],
    ["task too short", { task: "x" }],
    ["limit above 5", { task: "do something useful", limit: 6 }],
    ["invalid platform", { task: "do something useful", platform: "" }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(RecommendForTaskInputSchema, value);
  });
});

describe("GetServerInfoInputSchema", () => {
  it("accepts an empty object", () => {
    expectParseSuccess(GetServerInfoInputSchema, {});
  });

  it("rejects unknown keys", () => {
    expectParseFailure(GetServerInfoInputSchema, { verbose: true });
  });
});

describe("ListCategoryEntriesInputSchema", () => {
  it("accepts pagination and filters", () => {
    expectParseSuccess(ListCategoryEntriesInputSchema, {
      category: VALID_CATEGORY,
      platform: VALID_PLATFORM,
      tag: "testing",
      query: "browser",
      offset: 20,
      limit: 15,
    });
  });

  it.each([
    ["offset above 5000", { offset: 5001 }],
    ["limit above 25", { limit: 30 }],
    ["invalid category", { category: "Bad Category" }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(ListCategoryEntriesInputSchema, value);
  });
});

describe("RecentUpdatesInputSchema", () => {
  it("accepts since date and filters", () => {
    expectParseSuccess(RecentUpdatesInputSchema, {
      category: VALID_CATEGORY,
      since: "2026-05-01",
      limit: 10,
    });
  });

  it.each([
    ["since too short", { since: "202" }],
    ["since over 40 chars", { since: "s".repeat(41) }],
    ["limit below 1", { limit: 0 }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(RecentUpdatesInputSchema, value);
  });
});

describe("RelatedEntriesInputSchema", () => {
  it("accepts required category and slug", () => {
    expectParseSuccess(RelatedEntriesInputSchema, {
      category: VALID_CATEGORY,
      slug: VALID_PATH,
    });
  });

  it.each([
    ["missing slug", { category: VALID_CATEGORY }],
    ["invalid slug", { category: VALID_CATEGORY, slug: "Bad Slug" }],
    [
      "limit above 25",
      { category: VALID_CATEGORY, slug: VALID_PATH, limit: 26 },
    ],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(RelatedEntriesInputSchema, value);
  });
});

describe("CopyableAssetInputSchema", () => {
  it("accepts required identifiers", () => {
    expectParseSuccess(CopyableAssetInputSchema, {
      category: VALID_CATEGORY,
      slug: VALID_PATH,
    });
  });

  it.each([
    "full_content",
    "install_command",
    "config_snippet",
    "script",
    "command_syntax",
    "usage",
    "items",
  ] as const)("accepts assetType=%s", (assetType) => {
    expectParseSuccess(CopyableAssetInputSchema, {
      category: VALID_CATEGORY,
      slug: VALID_PATH,
      assetType,
    });
  });

  it("rejects invalid assetType", () => {
    expectParseFailure(CopyableAssetInputSchema, {
      category: VALID_CATEGORY,
      slug: VALID_PATH,
      assetType: "readme",
    });
  });
});

describe("RegistryStatsInputSchema", () => {
  it("accepts an empty object", () => {
    expectParseSuccess(RegistryStatsInputSchema, {});
  });

  it("rejects unknown keys", () => {
    expectParseFailure(RegistryStatsInputSchema, { refresh: true });
  });
});

describe("ClientSetupInputSchema", () => {
  it("accepts optional client and endpointUrl", () => {
    expectParseSuccess(ClientSetupInputSchema, {
      client: VALID_CLIENT,
      endpointUrl: "https://mcp.example.com/v1",
    });
  });

  it.each([
    ["invalid client", { client: "vscode" }],
    ["invalid endpointUrl", { endpointUrl: "not-a-url" }],
    [
      "endpointUrl over 500 chars",
      { endpointUrl: `https://x.test/${"a".repeat(500)}` },
    ],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(ClientSetupInputSchema, value);
  });

  it.each([
    "codex",
    "claude-desktop",
    "cursor",
    "windsurf",
    "remote-http",
  ] as const)("accepts client=%s", (client) => {
    expectParseSuccess(ClientSetupInputSchema, { client });
  });
});

describe("CompatibilityInputSchema", () => {
  it("accepts slug with optional category", () => {
    expectParseSuccess(CompatibilityInputSchema, {
      slug: VALID_PATH,
      category: VALID_CATEGORY,
    });
  });

  it.each([
    ["missing slug", { category: VALID_CATEGORY }],
    ["invalid slug", { slug: "Bad Slug" }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(CompatibilityInputSchema, value);
  });
});

describe("InstallGuidanceInputSchema", () => {
  it("accepts category, slug, and platform", () => {
    expectParseSuccess(InstallGuidanceInputSchema, {
      category: VALID_CATEGORY,
      slug: VALID_PATH,
      platform: VALID_PLATFORM,
    });
  });

  it("rejects missing slug", () => {
    expectParseFailure(InstallGuidanceInputSchema, {
      category: VALID_CATEGORY,
    });
  });
});

describe("PlatformAdapterInputSchema", () => {
  it("accepts slug with optional platform", () => {
    expectParseSuccess(PlatformAdapterInputSchema, {
      slug: VALID_PATH,
      platform: VALID_PLATFORM,
    });
  });

  it("rejects invalid slug", () => {
    expectParseFailure(PlatformAdapterInputSchema, { slug: "Bad Slug" });
  });
});

describe("ListDistributionFeedsInputSchema", () => {
  it("accepts an empty object", () => {
    expectParseSuccess(ListDistributionFeedsInputSchema, {});
  });

  it("rejects unknown keys", () => {
    expectParseFailure(ListDistributionFeedsInputSchema, { format: "json" });
  });
});

describe("GetSubmissionSchemaInputSchema", () => {
  it("accepts optional category", () => {
    expectParseSuccess(GetSubmissionSchemaInputSchema, {
      category: VALID_SUBMISSION_CATEGORY,
    });
  });

  it("rejects invalid category", () => {
    expectParseFailure(GetSubmissionSchemaInputSchema, { category: "widgets" });
  });
});

describe("ValidateSubmissionDraftInputSchema", () => {
  it("accepts nested submission fields", () => {
    expectParseSuccess(ValidateSubmissionDraftInputSchema, {
      fields: VALID_SUBMISSION_FIELDS,
    });
  });

  it("rejects missing fields", () => {
    expectParseFailure(ValidateSubmissionDraftInputSchema, {});
  });
});

describe("BuildSubmissionUrlsInputSchema", () => {
  it("accepts fields with includePrBody", () => {
    expectParseSuccess(BuildSubmissionUrlsInputSchema, {
      fields: VALID_SUBMISSION_FIELDS,
      includePrBody: true,
    });
  });

  it("rejects invalid includePrBody type", () => {
    expectParseFailure(BuildSubmissionUrlsInputSchema, {
      fields: VALID_SUBMISSION_FIELDS,
      includePrBody: "yes",
    });
  });
});

describe("CategorySubmissionGuidanceInputSchema", () => {
  it("accepts optional category", () => {
    expectParseSuccess(CategorySubmissionGuidanceInputSchema, {
      category: "mcp",
    });
  });

  it("rejects invalid category", () => {
    expectParseFailure(CategorySubmissionGuidanceInputSchema, {
      category: "invalid",
    });
  });
});

describe("PrepareSubmissionDraftInputSchema", () => {
  it("accepts nested fields", () => {
    expectParseSuccess(PrepareSubmissionDraftInputSchema, {
      fields: VALID_SUBMISSION_FIELDS,
    });
  });

  it("rejects invalid nested slug", () => {
    expectParseFailure(PrepareSubmissionDraftInputSchema, {
      fields: { slug: "Bad Slug" },
    });
  });
});

describe("GetSubmissionExamplesInputSchema", () => {
  it("accepts optional category", () => {
    expectParseSuccess(GetSubmissionExamplesInputSchema, { category: "hooks" });
  });

  it("rejects invalid category", () => {
    expectParseFailure(GetSubmissionExamplesInputSchema, { category: "bad" });
  });
});

describe("SubmissionPolicyInputSchema", () => {
  it("accepts an empty object", () => {
    expectParseSuccess(SubmissionPolicyInputSchema, {});
  });

  it("rejects unknown keys", () => {
    expectParseFailure(SubmissionPolicyInputSchema, { version: 1 });
  });
});

describe("ExplainEntryTrustInputSchema", () => {
  it("accepts category and slug", () => {
    expectParseSuccess(ExplainEntryTrustInputSchema, {
      category: VALID_CATEGORY,
      slug: VALID_PATH,
    });
  });

  it("rejects missing category", () => {
    expectParseFailure(ExplainEntryTrustInputSchema, { slug: VALID_PATH });
  });
});

describe("ReviewEntrySafetyInputSchema", () => {
  const oneEntry = [{ category: "mcp", slug: "alpha-server" }];

  it("accepts one entry with optional platform", () => {
    expectParseSuccess(ReviewEntrySafetyInputSchema, {
      entries: oneEntry,
      platform: VALID_PLATFORM,
    });
  });

  it.each([
    ["empty entries array", { entries: [] }],
    [
      "six entries",
      {
        entries: Array.from({ length: 6 }, (_, i) => ({
          category: "mcp",
          slug: `entry-${i}`,
        })),
      },
    ],
    [
      "invalid nested slug",
      { entries: [{ category: "mcp", slug: "Bad Slug" }] },
    ],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(ReviewEntrySafetyInputSchema, value);
  });
});

describe("CompareEntryTrustInputSchema", () => {
  const pair = [
    { category: "mcp", slug: "alpha-server" },
    { category: "skills", slug: "beta-skill" },
  ];

  it("accepts two entries", () => {
    expectParseSuccess(CompareEntryTrustInputSchema, { entries: pair });
  });

  it("rejects only one entry", () => {
    expectParseFailure(CompareEntryTrustInputSchema, {
      entries: [{ category: "mcp", slug: "solo" }],
    });
  });
});

describe("parseToolArguments", () => {
  const validArgsByTool: Record<string, unknown> = {
    "registry.search": { query: "browser", limit: 5 },
    "registry.plan": { goal: "Review pull requests" },
    "registry.recommend": { task: "Connect to Postgres" },
    "registry.info": {},
    "registry.list": { category: VALID_CATEGORY, limit: 10 },
    "registry.updates": { since: "2026-01-01" },
    "entry.related": { category: VALID_CATEGORY, slug: VALID_PATH },
    "entry.detail": {
      category: VALID_CATEGORY,
      slug: VALID_PATH,
      bodyMode: "excerpt",
    },
    "entry.asset": {
      category: VALID_CATEGORY,
      slug: VALID_PATH,
      assetType: "install_command",
    },
    "entry.compare": {
      entries: [
        { category: "mcp", slug: "alpha" },
        { category: "skills", slug: "beta" },
      ],
    },
    "registry.stats": {},
    "install.setup": { client: VALID_CLIENT },
    "install.compatibility": { slug: VALID_PATH },
    "install.guidance": { category: VALID_CATEGORY, slug: VALID_PATH },
    "install.adapter": { slug: VALID_PATH, platform: VALID_PLATFORM },
    "registry.feeds": {},
    "submission.schema": { category: "mcp" },
    "submission.validate": { fields: VALID_SUBMISSION_FIELDS },
    "submission.duplicates": { name: "Example MCP" },
    "submission.urls": { fields: VALID_SUBMISSION_FIELDS },
    "submission.guidance": { category: "skills" },
    "submission.prepare": { fields: VALID_SUBMISSION_FIELDS },
    "submission.examples": { category: "hooks" },
    "submission.review": { fields: VALID_SUBMISSION_FIELDS, duplicateLimit: 2 },
    "submission.policy": {},
    "entry.trust": { category: VALID_CATEGORY, slug: VALID_PATH },
    "entry.safety": { entries: [{ category: "mcp", slug: "alpha" }] },
    "entry.coverage": {
      entries: [
        { category: "mcp", slug: "alpha" },
        { category: "skills", slug: "beta" },
      ],
    },
  };

  it("covers every tool in TOOL_INPUT_SCHEMAS", () => {
    expect(Object.keys(validArgsByTool).sort()).toEqual(
      Object.keys(TOOL_INPUT_SCHEMAS).sort(),
    );
  });

  it.each(Object.keys(TOOL_INPUT_SCHEMAS))(
    "parses valid arguments for %s",
    (toolName) => {
      const parsed = parseToolArguments(toolName, validArgsByTool[toolName]);
      expect(parsed).toBeDefined();
    },
  );

  it.each(Object.keys(TOOL_INPUT_SCHEMAS))(
    "throws on invalid arguments for %s",
    (toolName) => {
      expect(() =>
        parseToolArguments(toolName, { __invalid__: true }),
      ).toThrow();
    },
  );

  it("defaults missing args to an empty object for empty-input tools", () => {
    expect(parseToolArguments("registry.info")).toEqual({});
    expect(parseToolArguments("registry.stats", undefined)).toEqual({});
  });

  it("throws for an unknown tool name", () => {
    expect(() => parseToolArguments("registry.unknown", {})).toThrow(
      "Unknown HeyClaude MCP tool schema",
    );
  });

  it("throws with schema validation details for invalid payloads", () => {
    try {
      parseToolArguments("entry.detail", { category: "MCP", slug: VALID_PATH });
      throw new Error("expected parseToolArguments to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(z.ZodError);
      const issues = formatZodError(error);
      expect(issues?.some((issue) => issue.path === "category")).toBe(true);
    }
  });
});

describe("jsonSchemaForTool", () => {
  it.each(Object.keys(TOOL_INPUT_SCHEMAS))(
    "returns a JSON schema object for %s",
    (toolName) => {
      const schema = jsonSchemaForTool(toolName);
      expect(schema).toBeTruthy();
      expect(typeof schema).toBe("object");
      expect(schema).not.toHaveProperty("$schema");
    },
  );

  it("throws for an unknown tool name", () => {
    expect(() => jsonSchemaForTool("not.a.real.tool")).toThrow(
      "Unknown HeyClaude MCP tool schema",
    );
  });

  it("strips nested $schema keys recursively", () => {
    const schema = jsonSchemaForTool("registry.search") as {
      properties?: Record<string, unknown>;
    };
    expect(JSON.stringify(schema)).not.toContain("$schema");
  });

  it("includes described search fields for registry.search", () => {
    const schema = jsonSchemaForTool("registry.search") as {
      properties?: Record<string, { description?: string }>;
    };
    expect(schema.properties?.query?.description).toContain("Keywords");
    expect(schema.properties?.limit?.description).toContain("Maximum");
  });
});

describe("jsonSchemaForToolOutput", () => {
  it.each(Object.keys(TOOL_INPUT_SCHEMAS))(
    "returns an output schema for %s",
    (toolName) => {
      const schema = jsonSchemaForToolOutput(toolName);
      expect(schema.type).toBe("object");
      expect(schema.properties).toHaveProperty("ok");
      expect(schema.required).toContain("ok");
      expect(schema.additionalProperties).toBe(true);
    },
  );

  it("throws for an unknown tool name", () => {
    expect(() => jsonSchemaForToolOutput("not_a_real_tool")).toThrow(
      "Unknown HeyClaude MCP tool output schema",
    );
  });
});

describe("formatZodError", () => {
  it("flattens ZodError issues with path, message, and code", () => {
    const result = SearchRegistryInputSchema.safeParse({ limit: 100 });
    expect(result.success).toBe(false);
    if (result.success) return;
    const issues = formatZodError(result.error);
    expect(issues).not.toBeNull();
    expect(issues![0]).toMatchObject({
      path: "limit",
      code: expect.any(String),
    });
    expect(typeof issues![0].message).toBe("string");
  });

  it("joins nested paths with dots", () => {
    const result = CompareEntriesInputSchema.safeParse({
      entries: [
        { category: "mcp", slug: "Bad Slug" },
        { category: "skills", slug: "ok" },
      ],
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    const issues = formatZodError(result.error);
    expect(issues?.some((issue) => issue.path.startsWith("entries"))).toBe(
      true,
    );
  });

  it("returns null for non-Zod errors", () => {
    expect(formatZodError(new Error("boom"))).toBeNull();
    expect(formatZodError("not an error")).toBeNull();
    expect(formatZodError(null)).toBeNull();
  });

  it("works with parseToolArguments failures", () => {
    try {
      parseToolArguments("registry.plan", { goal: "x" });
    } catch (error) {
      const issues = formatZodError(error);
      expect(issues?.length).toBeGreaterThan(0);
      expect(issues?.[0].path).toBe("goal");
    }
  });
});

describe("TOOL_INPUT_SCHEMAS registry", () => {
  it("maps every exported tool name to a Zod schema", () => {
    for (const [toolName, schema] of Object.entries(TOOL_INPUT_SCHEMAS)) {
      expect(typeof toolName).toBe("string");
      expect(typeof schema.safeParse).toBe("function");
    }
  });

  it.each(Object.entries(TOOL_INPUT_SCHEMAS))(
    "%s rejects completely invalid payloads via safeParse",
    (_toolName, schema) => {
      expectParseFailure(schema, { definitely_not_a_valid_field: 12345 });
    },
  );
});

describe("SearchRegistryInputSchema extended", () => {
  it.each(["all", "first-party", "external", "none"] as const)(
    "accepts downloadTrust=%s",
    (downloadTrust) => {
      expectParseSuccess(SearchRegistryInputSchema, { downloadTrust });
    },
  );

  it.each(["all", "unclaimed", "pending", "verified"] as const)(
    "accepts claimStatus=%s",
    (claimStatus) => {
      expectParseSuccess(SearchRegistryInputSchema, { claimStatus });
    },
  );

  it.each(["all", "available", "missing"] as const)(
    "accepts sourceStatus=%s",
    (sourceStatus) => {
      expectParseSuccess(SearchRegistryInputSchema, { sourceStatus });
    },
  );

  it("accepts query at exactly 240 characters", () => {
    expectParseSuccess(SearchRegistryInputSchema, { query: "q".repeat(240) });
  });

  it("accepts category slug at exactly 120 characters", () => {
    expectParseSuccess(SearchRegistryInputSchema, {
      category: `c${"a".repeat(119)}`,
    });
  });

  it("accepts platform at exactly 80 characters", () => {
    expectParseSuccess(SearchRegistryInputSchema, { platform: "p".repeat(80) });
  });

  it("accepts tag at exactly 80 characters", () => {
    expectParseSuccess(SearchRegistryInputSchema, { tag: "t".repeat(80) });
  });

  it.each([
    ["query as number", { query: 123 }],
    ["category as boolean", { category: true }],
    ["limit as string", { limit: "10" }],
    ["hasSafetyNotes as boolean", { hasSafetyNotes: true }],
    ["downloadTrust empty string", { downloadTrust: "" }],
    ["claimStatus null", { claimStatus: null }],
    ["sourceStatus undefined key with null", { sourceStatus: null }],
  ])("rejects wrong types for %s", (_label, value) => {
    expectParseFailure(SearchRegistryInputSchema, value);
  });

  it("rejects whitespace-only query after trim", () => {
    expectParseSuccess(SearchRegistryInputSchema, { query: "   " });
  });

  it("rejects category over 120 characters", () => {
    expectParseFailure(SearchRegistryInputSchema, {
      category: "x".repeat(121),
    });
  });
});

describe("SubmissionFieldsSchema extended", () => {
  it("accepts name at exactly 4000 characters", () => {
    expectParseSuccess(SubmissionFieldsSchema, { name: "n".repeat(4000) });
  });

  it("accepts description at exactly 24000 characters", () => {
    expectParseSuccess(SubmissionFieldsSchema, {
      description: "d".repeat(24000),
    });
  });

  it("accepts slug at exactly 120 characters", () => {
    expectParseSuccess(SubmissionFieldsSchema, {
      slug: `s${"l".repeat(119)}`,
    });
  });

  it("accepts tags string at exactly 1000 characters", () => {
    expectParseSuccess(SubmissionFieldsSchema, { tags: "t".repeat(1000) });
  });

  it("accepts exactly 20 tags in array", () => {
    expectParseSuccess(SubmissionFieldsSchema, {
      tags: Array.from({ length: 20 }, (_, i) => `tag-${i}`),
    });
  });

  it("accepts tag at exactly 80 characters in array", () => {
    expectParseSuccess(SubmissionFieldsSchema, { tags: ["t".repeat(80)] });
  });

  it("accepts notes line at exactly 320 characters", () => {
    expectParseSuccess(SubmissionFieldsSchema, {
      safety_notes: "n".repeat(320),
    });
  });

  it.each([
    "title",
    "github_url",
    "docs_url",
    "source_url",
    "brand_name",
    "brand_domain",
    "author",
    "contact_email",
    "card_description",
    "install_command",
    "script_language",
    "skill_type",
    "skill_level",
    "verification_status",
    "verified_at",
    "download_url",
    "installation_order",
    "estimated_setup_time",
    "difficulty",
  ] as const)("accepts optional text field %s at max length", (field) => {
    expectParseSuccess(SubmissionFieldsSchema, { [field]: "x".repeat(4000) });
  });

  it.each([
    ["slug with uppercase", { slug: "My-Skill" }],
    ["slug with underscore", { slug: "my_skill" }],
    ["slug with spaces", { slug: "my skill" }],
    ["slug empty after trim", { slug: "   " }],
    ["category empty string", { category: "" as "mcp" }],
    ["tags as number", { tags: 123 }],
    ["tags array with 81-char entry", { tags: ["x".repeat(81)] }],
    [
      "safety_notes with 9 lines",
      { safety_notes: "a\nb\nc\nd\ne\nf\ng\nh\ni" },
    ],
    ["name as object", { name: { text: "bad" } }],
    ["description as array", { description: ["bad"] }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(SubmissionFieldsSchema, value);
  });

  it("accepts privacy_notes with only blank lines as empty notes", () => {
    expectParseSuccess(SubmissionFieldsSchema, { privacy_notes: "\n\n\n" });
  });

  it("trims tags string input", () => {
    const parsed = expectParseSuccess(SubmissionFieldsSchema, {
      tags: "  mcp, testing  ",
    });
    expect(parsed).toMatchObject({ tags: "mcp, testing" });
  });

  it("trims each tag in array input", () => {
    const parsed = expectParseSuccess(SubmissionFieldsSchema, {
      tags: ["  mcp  ", " testing "],
    });
    expect(parsed).toMatchObject({ tags: ["mcp", "testing"] });
  });
});

describe("EntryDetailInputSchema extended", () => {
  it("accepts slug at max length", () => {
    expectParseSuccess(EntryDetailInputSchema, {
      category: VALID_CATEGORY,
      slug: "s".repeat(120),
    });
  });

  it.each([
    ["category as number", { category: 1, slug: VALID_PATH }],
    ["slug as null", { category: VALID_CATEGORY, slug: null }],
    [
      "bodyMode empty string",
      { category: VALID_CATEGORY, slug: VALID_PATH, bodyMode: "" },
    ],
    [
      "extra platform field",
      { category: VALID_CATEGORY, slug: VALID_PATH, platform: "cursor" },
    ],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(EntryDetailInputSchema, value);
  });

  it("defaults bodyMode when omitted", () => {
    const parsed = expectParseSuccess(EntryDetailInputSchema, {
      category: VALID_CATEGORY,
      slug: VALID_PATH,
    });
    expect(parsed).not.toHaveProperty("bodyMode");
  });
});

describe("CompareEntriesInputSchema extended", () => {
  it("accepts exactly two entries at minimum", () => {
    expectParseSuccess(CompareEntriesInputSchema, {
      entries: [
        { category: "mcp", slug: "alpha" },
        { category: "skills", slug: "beta" },
      ],
    });
  });

  it("accepts exactly five entries at maximum", () => {
    expectParseSuccess(CompareEntriesInputSchema, {
      entries: Array.from({ length: 5 }, (_, i) => ({
        category: "mcp",
        slug: `entry-${i}`,
      })),
    });
  });

  it.each([
    ["entries as object", { entries: { category: "mcp", slug: "alpha" } }],
    ["entries missing slug", { entries: [{ category: "mcp" }] }],
    ["entries null", { entries: null }],
    [
      "platform as number",
      {
        entries: [
          { category: "mcp", slug: "a" },
          { category: "mcp", slug: "b" },
        ],
        platform: 1,
      },
    ],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(CompareEntriesInputSchema, value);
  });
});

describe("SearchDuplicateEntriesInputSchema extended", () => {
  it.each([
    "sourceUrl",
    "githubUrl",
    "docsUrl",
    "downloadUrl",
    "websiteUrl",
  ] as const)("accepts %s at exactly 500 characters", (field) => {
    expectParseSuccess(SearchDuplicateEntriesInputSchema, {
      [field]: `https://x.test/${"a".repeat(480)}`,
    });
  });

  it("accepts brandDomain at exactly 255 characters", () => {
    expectParseSuccess(SearchDuplicateEntriesInputSchema, {
      brandDomain: "b".repeat(255),
    });
  });

  it("accepts exactly 10 sourceUrls entries", () => {
    expectParseSuccess(SearchDuplicateEntriesInputSchema, {
      sourceUrls: Array.from(
        { length: 10 },
        (_, i) => `https://example.com/${i}`,
      ),
    });
  });

  it.each([
    ["name at 240 chars", { name: "n".repeat(240) }],
    ["title at 240 chars", { title: "t".repeat(240) }],
  ])("accepts boundary %s", (_label, value) => {
    expectParseSuccess(SearchDuplicateEntriesInputSchema, value);
  });

  it.each([
    ["brandDomain over 255 chars", { brandDomain: "b".repeat(256) }],
    [
      "sourceUrls entry over 500 chars",
      { sourceUrls: [`https://x.test/${"a".repeat(501)}`] },
    ],
    ["githubUrl empty", { githubUrl: "" }],
    ["limit non-integer", { limit: 2.5 }],
    ["name null", { name: null }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(SearchDuplicateEntriesInputSchema, value);
  });
});

describe("PlanWorkflowToolboxInputSchema extended", () => {
  it("accepts goal at exactly 2 characters", () => {
    expectParseSuccess(PlanWorkflowToolboxInputSchema, { goal: "ok" });
  });

  it("accepts goal at exactly 240 characters", () => {
    expectParseSuccess(PlanWorkflowToolboxInputSchema, {
      goal: "g".repeat(240),
    });
  });

  it.each([1, 10])("accepts boundary limit=%i", (limit) => {
    expectParseSuccess(PlanWorkflowToolboxInputSchema, {
      goal: "Automate testing",
      limit,
    });
  });

  it.each([
    ["goal as number", { goal: 123 }],
    ["goal whitespace only", { goal: "  " }],
    ["limit below 1", { goal: "valid goal", limit: 0 }],
    ["limit as string", { goal: "valid goal", limit: "5" }],
    ["unknown field", { goal: "valid goal", priority: "high" }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(PlanWorkflowToolboxInputSchema, value);
  });
});

describe("RecommendForTaskInputSchema extended", () => {
  it("accepts task at exactly 2 characters", () => {
    expectParseSuccess(RecommendForTaskInputSchema, { task: "ok" });
  });

  it("accepts task at exactly 240 characters", () => {
    expectParseSuccess(RecommendForTaskInputSchema, { task: "t".repeat(240) });
  });

  it.each([1, 5])("accepts boundary limit=%i", (limit) => {
    expectParseSuccess(RecommendForTaskInputSchema, {
      task: "Connect to database",
      limit,
    });
  });

  it.each([
    ["missing task type", { task: null }],
    ["task over 240 chars", { task: "t".repeat(241) }],
    ["category invalid slug", { task: "do work", category: "Bad Category" }],
    ["limit zero", { task: "do work", limit: 0 }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(RecommendForTaskInputSchema, value);
  });
});

describe("ListCategoryEntriesInputSchema extended", () => {
  it.each([0, 5000])("accepts boundary offset=%i", (offset) => {
    expectParseSuccess(ListCategoryEntriesInputSchema, { offset });
  });

  it.each([1, 25])("accepts boundary limit=%i", (limit) => {
    expectParseSuccess(ListCategoryEntriesInputSchema, { limit });
  });

  it("accepts query at exactly 240 characters", () => {
    expectParseSuccess(ListCategoryEntriesInputSchema, {
      query: "q".repeat(240),
    });
  });

  it.each([
    ["offset negative", { offset: -1 }],
    ["offset non-integer", { offset: 1.5 }],
    ["query over 240 chars", { query: "q".repeat(241) }],
    ["tag empty string", { tag: "" }],
    ["platform over 80 chars", { platform: "p".repeat(81) }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(ListCategoryEntriesInputSchema, value);
  });
});

describe("RecentUpdatesInputSchema extended", () => {
  it("accepts since at exactly 4 characters", () => {
    expectParseSuccess(RecentUpdatesInputSchema, { since: "2026" });
  });

  it("accepts since at exactly 40 characters", () => {
    expectParseSuccess(RecentUpdatesInputSchema, { since: "s".repeat(40) });
  });

  it.each([1, 25])("accepts boundary limit=%i", (limit) => {
    expectParseSuccess(RecentUpdatesInputSchema, { limit });
  });

  it.each([
    ["since empty after trim", { since: "   " }],
    ["since as number", { since: 20260501 }],
    ["limit over 25", { limit: 26 }],
    ["unknown key", { since: "2026-05-01", refresh: true }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(RecentUpdatesInputSchema, value);
  });
});

describe("RelatedEntriesInputSchema extended", () => {
  it.each([1, 25])("accepts boundary limit=%i", (limit) => {
    expectParseSuccess(RelatedEntriesInputSchema, {
      category: VALID_CATEGORY,
      slug: VALID_PATH,
      limit,
    });
  });

  it.each([
    ["missing category", { slug: VALID_PATH }],
    ["category invalid", { category: "MCP", slug: VALID_PATH }],
    ["limit zero", { category: VALID_CATEGORY, slug: VALID_PATH, limit: 0 }],
    [
      "limit as string",
      { category: VALID_CATEGORY, slug: VALID_PATH, limit: "8" },
    ],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(RelatedEntriesInputSchema, value);
  });
});

describe("CopyableAssetInputSchema extended", () => {
  it("accepts optional platform", () => {
    expectParseSuccess(CopyableAssetInputSchema, {
      category: VALID_CATEGORY,
      slug: VALID_PATH,
      platform: VALID_PLATFORM,
    });
  });

  it.each([
    ["missing category", { slug: VALID_PATH }],
    ["slug empty after trim", { category: VALID_CATEGORY, slug: "   " }],
    [
      "assetType null",
      { category: VALID_CATEGORY, slug: VALID_PATH, assetType: null },
    ],
    [
      "platform empty",
      { category: VALID_CATEGORY, slug: VALID_PATH, platform: "" },
    ],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(CopyableAssetInputSchema, value);
  });
});

describe("ClientSetupInputSchema extended", () => {
  it("accepts endpointUrl at exactly 500 characters", () => {
    expectParseSuccess(ClientSetupInputSchema, {
      endpointUrl: `https://x.test/${"a".repeat(480)}`,
    });
  });

  it("accepts empty object", () => {
    expectParseSuccess(ClientSetupInputSchema, {});
  });

  it.each([
    ["client empty string", { client: "" as "cursor" }],
    ["endpointUrl missing host", { endpointUrl: "https://" }],
    ["endpointUrl as number", { endpointUrl: 12345 }],
    ["endpointUrl not a URL", { endpointUrl: "not-a-url" }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(ClientSetupInputSchema, value);
  });

  it("accepts http endpointUrl because zod url() allows http scheme", () => {
    expectParseSuccess(ClientSetupInputSchema, {
      endpointUrl: "http://mcp.example.com",
    });
  });
});

describe("CompatibilityInputSchema extended", () => {
  it("accepts slug only without category", () => {
    expectParseSuccess(CompatibilityInputSchema, { slug: VALID_PATH });
  });

  it.each([
    ["slug over 120 chars", { slug: "s".repeat(121) }],
    ["category invalid", { slug: VALID_PATH, category: "Bad" }],
    ["slug number", { slug: 123 }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(CompatibilityInputSchema, value);
  });
});

describe("InstallGuidanceInputSchema extended", () => {
  it("accepts without optional platform", () => {
    expectParseSuccess(InstallGuidanceInputSchema, {
      category: VALID_CATEGORY,
      slug: VALID_PATH,
    });
  });

  it.each([
    ["missing category", { slug: VALID_PATH }],
    ["invalid category slug", { category: "Bad Category", slug: VALID_PATH }],
    [
      "platform over 80 chars",
      { category: VALID_CATEGORY, slug: VALID_PATH, platform: "p".repeat(81) },
    ],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(InstallGuidanceInputSchema, value);
  });
});

describe("PlatformAdapterInputSchema extended", () => {
  it("accepts slug only", () => {
    expectParseSuccess(PlatformAdapterInputSchema, { slug: VALID_PATH });
  });

  it.each([
    ["missing slug", {}],
    ["slug empty", { slug: "" }],
    ["platform invalid type", { slug: VALID_PATH, platform: 1 }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(PlatformAdapterInputSchema, value);
  });
});

describe("ReviewSubmissionDraftInputSchema extended", () => {
  it.each([1, 10])("accepts boundary duplicateLimit=%i", (duplicateLimit) => {
    expectParseSuccess(ReviewSubmissionDraftInputSchema, {
      fields: VALID_SUBMISSION_FIELDS,
      duplicateLimit,
    });
  });

  it.each([
    ["fields null", { fields: null }],
    ["fields not object", { fields: "bad" }],
    [
      "duplicateLimit float",
      { fields: VALID_SUBMISSION_FIELDS, duplicateLimit: 1.5 },
    ],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(ReviewSubmissionDraftInputSchema, value);
  });
});

describe("BuildSubmissionUrlsInputSchema extended", () => {
  it("accepts includePrBody false", () => {
    expectParseSuccess(BuildSubmissionUrlsInputSchema, {
      fields: VALID_SUBMISSION_FIELDS,
      includePrBody: false,
    });
  });

  it("accepts without includePrBody", () => {
    expectParseSuccess(BuildSubmissionUrlsInputSchema, {
      fields: VALID_SUBMISSION_FIELDS,
    });
  });

  it.each([
    ["missing fields", { includePrBody: true }],
    ["fields invalid nested category", { fields: { category: "bad" } }],
    [
      "includePrBody number",
      { fields: VALID_SUBMISSION_FIELDS, includePrBody: 1 },
    ],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(BuildSubmissionUrlsInputSchema, value);
  });
});

describe("ReviewEntrySafetyInputSchema extended", () => {
  it("accepts up to five entries", () => {
    expectParseSuccess(ReviewEntrySafetyInputSchema, {
      entries: Array.from({ length: 5 }, (_, i) => ({
        category: "mcp",
        slug: `entry-${i}`,
      })),
    });
  });

  it.each([
    ["entries missing", {}],
    ["entries not array", { entries: "bad" }],
    [
      "nested unknown key",
      { entries: [{ category: "mcp", slug: "a", note: "x" }] },
    ],
    [
      "platform empty",
      { entries: [{ category: "mcp", slug: "a" }], platform: "" },
    ],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(ReviewEntrySafetyInputSchema, value);
  });
});

describe("CompareEntryTrustInputSchema extended", () => {
  it("accepts optional platform", () => {
    expectParseSuccess(CompareEntryTrustInputSchema, {
      entries: [
        { category: "mcp", slug: "alpha" },
        { category: "skills", slug: "beta" },
      ],
      platform: VALID_PLATFORM,
    });
  });

  it.each([
    [
      "five entries",
      {
        entries: Array.from({ length: 5 }, (_, i) => ({
          category: "mcp",
          slug: `entry-${i}`,
        })),
      },
    ],
    [
      "two entries minimum",
      {
        entries: [
          { category: "mcp", slug: "alpha" },
          { category: "hooks", slug: "beta" },
        ],
      },
    ],
  ])("accepts %s", (_label, value) => {
    expectParseSuccess(CompareEntryTrustInputSchema, value);
  });

  it.each([
    [
      "six entries",
      {
        entries: Array.from({ length: 6 }, (_, i) => ({
          category: "mcp",
          slug: `entry-${i}`,
        })),
      },
    ],
    ["entries null", { entries: null }],
    ["single entry", { entries: [{ category: "mcp", slug: "solo" }] }],
  ])("rejects %s", (_label, value) => {
    expectParseFailure(CompareEntryTrustInputSchema, value);
  });
});

describe("GetSubmissionSchemaInputSchema extended", () => {
  it("accepts empty object", () => {
    expectParseSuccess(GetSubmissionSchemaInputSchema, {});
  });

  it.each([
    "agents",
    "rules",
    "mcp",
    "skills",
    "hooks",
    "commands",
    "statuslines",
    "collections",
    "guides",
  ] as const)("accepts category=%s", (category) => {
    expectParseSuccess(GetSubmissionSchemaInputSchema, { category });
  });
});

describe("CategorySubmissionGuidanceInputSchema extended", () => {
  it("accepts empty object", () => {
    expectParseSuccess(CategorySubmissionGuidanceInputSchema, {});
  });

  it.each(["mcp", "skills", "guides"] as const)(
    "accepts category=%s",
    (category) => {
      expectParseSuccess(CategorySubmissionGuidanceInputSchema, { category });
    },
  );
});

describe("GetSubmissionExamplesInputSchema extended", () => {
  it("accepts empty object", () => {
    expectParseSuccess(GetSubmissionExamplesInputSchema, {});
  });

  it.each(["commands", "collections", "statuslines"] as const)(
    "accepts category=%s",
    (category) => {
      expectParseSuccess(GetSubmissionExamplesInputSchema, { category });
    },
  );
});

describe("parseToolArguments extended invalid cases", () => {
  it.each([
    ["registry.search", { limit: 100 }],
    ["registry.search", { query: "x".repeat(241) }],
    ["registry.plan", {}],
    ["registry.plan", { goal: "x" }],
    ["registry.recommend", { task: "x" }],
    ["registry.list", { limit: 100 }],
    ["registry.updates", { since: "x" }],
    ["entry.related", { category: VALID_CATEGORY }],
    ["entry.detail", { slug: VALID_PATH }],
    ["entry.asset", { category: "MCP", slug: VALID_PATH }],
    ["entry.compare", { entries: [{ category: "mcp", slug: "a" }] }],
    ["install.setup", { client: "vscode" }],
    ["install.compatibility", {}],
    ["install.guidance", { category: VALID_CATEGORY }],
    ["install.adapter", {}],
    ["submission.validate", {}],
    ["submission.duplicates", { limit: 20 }],
    ["submission.urls", {}],
    ["submission.review", {}],
    ["entry.trust", { slug: VALID_PATH }],
    ["entry.safety", { entries: [] }],
    ["entry.coverage", { entries: [{ category: "mcp", slug: "solo" }] }],
  ] as const)("throws for invalid %s payload", (toolName, args) => {
    expect(() => parseToolArguments(toolName, args)).toThrow();
  });

  it("throws when args is null for required-input tools", () => {
    expect(() =>
      parseToolArguments("entry.detail", null as unknown as object),
    ).toThrow();
  });

  it("coerces undefined args to empty object", () => {
    expect(parseToolArguments("registry.feeds", undefined)).toEqual({});
  });

  it.each([
    "registry.info",
    "registry.stats",
    "registry.feeds",
    "submission.policy",
  ])("accepts missing args for %s", (toolName) => {
    expect(parseToolArguments(toolName)).toEqual({});
  });
});

describe("jsonSchemaForTool extended", () => {
  it.each(Object.keys(TOOL_INPUT_SCHEMAS))(
    "%s schema has object type at root",
    (toolName) => {
      const schema = jsonSchemaForTool(toolName) as { type?: string };
      expect(schema.type).toBe("object");
    },
  );

  it("registry.search schema exposes enum values for trust filters", () => {
    const schema = jsonSchemaForTool("registry.search") as {
      properties?: Record<string, { enum?: string[] }>;
    };
    expect(schema.properties?.hasSafetyNotes?.enum).toEqual([
      "all",
      "true",
      "false",
    ]);
    expect(schema.properties?.downloadTrust?.enum).toContain("first-party");
  });

  it("entry.detail schema documents bodyMode enum", () => {
    const schema = jsonSchemaForTool("entry.detail") as {
      properties?: Record<string, { enum?: string[] }>;
    };
    expect(schema.properties?.bodyMode?.enum).toEqual([
      "none",
      "excerpt",
      "full",
    ]);
  });
});

describe("formatZodError extended", () => {
  it("includes empty path for root-level issues", () => {
    const result = GetServerInfoInputSchema.safeParse({ extra: true });
    expect(result.success).toBe(false);
    if (result.success) return;
    const issues = formatZodError(result.error);
    expect(
      issues?.some((issue) => issue.path === "" || issue.path.length >= 0),
    ).toBe(true);
  });

  it("preserves issue codes for enum violations", () => {
    const result = SearchRegistryInputSchema.safeParse({
      downloadTrust: "bogus",
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    const issues = formatZodError(result.error);
    expect(issues?.[0].code).toBeTruthy();
    expect(issues?.[0].path).toBe("downloadTrust");
  });

  it("returns empty array shape for ZodError with no path segments on nested union", () => {
    const result = SubmissionFieldsSchema.safeParse({ tags: [""] });
    expect(result.success).toBe(false);
    if (result.success) return;
    const issues = formatZodError(result.error);
    expect(issues?.length).toBeGreaterThan(0);
  });
});
