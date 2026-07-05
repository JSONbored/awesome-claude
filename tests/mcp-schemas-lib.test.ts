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
