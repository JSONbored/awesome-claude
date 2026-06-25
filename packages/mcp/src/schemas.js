import { z } from "zod";

const pathPart = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9-]+$/, "Use lowercase slug-safe path parts only.");

const platform = z.string().trim().min(1).max(80);
const trustBooleanFilter = z.enum(["all", "true", "false"]);
const downloadTrustFilter = z.enum(["all", "first-party", "external", "none"]);
const claimStatusFilter = z.enum(["all", "unclaimed", "pending", "verified"]);
const sourceStatusFilter = z.enum(["all", "available", "missing"]);
const clientName = z.enum([
  "codex",
  "claude-desktop",
  "cursor",
  "windsurf",
  "remote-http",
]);
const submissionCategory = z.enum([
  "agents",
  "rules",
  "mcp",
  "skills",
  "hooks",
  "commands",
  "statuslines",
  "collections",
  "guides",
]);
const optionalText = z.string().trim().max(4000).optional();
const optionalLongText = z.string().trim().max(24000).optional();
const notesShape = z
  .string()
  .trim()
  .refine((value) => {
    const lines = value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    return lines.length <= 8 && lines.every((line) => line.length <= 320);
  }, "Use at most 8 non-empty lines, 320 characters per line.")
  .optional();
const optionalTags = z
  .union([
    z.string().trim().max(1000),
    z.array(z.string().trim().min(1).max(80)).max(20),
  ])
  .optional();

export const SubmissionFieldsSchema = z
  .object({
    name: optionalText,
    title: optionalText,
    slug: pathPart.optional(),
    category: submissionCategory.optional(),
    github_url: optionalText,
    docs_url: optionalText,
    source_url: optionalText,
    brand_name: optionalText,
    brand_domain: optionalText,
    author: optionalText,
    contact_email: optionalText,
    tags: optionalTags,
    description: optionalLongText,
    card_description: optionalText,
    full_copyable_content: optionalLongText,
    install_command: optionalText,
    usage_snippet: optionalLongText,
    command_syntax: optionalText,
    trigger: optionalText,
    guide_content: optionalLongText,
    items: optionalLongText,
    script_language: optionalText,
    skill_type: optionalText,
    skill_level: optionalText,
    verification_status: optionalText,
    verified_at: optionalText,
    download_url: optionalText,
    config_snippet: optionalLongText,
    retrieval_sources: optionalLongText,
    tested_platforms: optionalText,
    prerequisites: optionalLongText,
    safety_notes: notesShape,
    privacy_notes: notesShape,
    troubleshooting_section: optionalLongText,
    installation_order: optionalText,
    estimated_setup_time: optionalText,
    difficulty: optionalText,
  })
  .strict();

export const SearchRegistryInputSchema = z
  .object({
    query: z
      .string()
      .trim()
      .max(240)
      .optional()
      .describe(
        "Keywords to search for in entry titles, descriptions, and tags.",
      ),
    category: pathPart
      .optional()
      .describe(
        "Restrict results to this category (e.g. 'mcp', 'skills', 'hooks').",
      ),
    platform: platform
      .optional()
      .describe(
        "Restrict to entries compatible with this platform (e.g. 'claude-desktop', 'cursor').",
      ),
    tag: z
      .string()
      .trim()
      .min(1)
      .max(80)
      .optional()
      .describe("Return only entries carrying this exact tag."),
    hasSafetyNotes: trustBooleanFilter
      .optional()
      .describe(
        "Filter by whether entries include safety notes ('true', 'false', or 'all').",
      ),
    hasPrivacyNotes: trustBooleanFilter
      .optional()
      .describe(
        "Filter by whether entries include privacy notes ('true', 'false', or 'all').",
      ),
    downloadTrust: downloadTrustFilter
      .optional()
      .describe(
        "Filter by package download trust level ('first-party', 'external', 'none', or 'all').",
      ),
    claimStatus: claimStatusFilter
      .optional()
      .describe(
        "Filter by claim or verification status ('unclaimed', 'pending', 'verified', or 'all').",
      ),
    sourceStatus: sourceStatusFilter
      .optional()
      .describe(
        "Filter by whether the entry's source URL is reachable ('available', 'missing', or 'all').",
      ),
    limit: z
      .number()
      .int()
      .min(1)
      .max(25)
      .optional()
      .describe("Maximum number of results to return (1–25, default 10)."),
  })
  .strict();

export const PlanWorkflowToolboxInputSchema = z
  .object({
    goal: z
      .string()
      .trim()
      .min(2)
      .max(240)
      .describe(
        "Plain-language description of the workflow or goal to build a toolbox for.",
      ),
    category: pathPart
      .optional()
      .describe(
        "Constrain recommendations to a single category (e.g. 'mcp', 'skills').",
      ),
    platform: platform
      .optional()
      .describe(
        "Target platform or client for the toolbox (e.g. 'claude-desktop', 'cursor').",
      ),
    limit: z
      .number()
      .int()
      .min(1)
      .max(10)
      .optional()
      .describe(
        "Maximum number of recommendations to include (1–10, default 6).",
      ),
  })
  .strict();

export const RecommendForTaskInputSchema = z
  .object({
    task: z
      .string()
      .trim()
      .min(2)
      .max(240)
      .describe(
        "Plain-language description of what you want to accomplish, e.g. 'review pull requests in Claude Code' or 'connect to a Postgres database'.",
      ),
    category: pathPart
      .optional()
      .describe("Restrict recommendations to a single category."),
    platform: platform
      .optional()
      .describe("Restrict to entries compatible with this platform."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(5)
      .optional()
      .describe("Maximum recommendations to return (default 3)."),
  })
  .strict();

export const GetServerInfoInputSchema = z.object({}).strict();

export const ListCategoryEntriesInputSchema = z
  .object({
    category: pathPart
      .optional()
      .describe(
        "Category to list entries from (e.g. 'mcp', 'skills', 'agents').",
      ),
    platform: platform
      .optional()
      .describe("Filter to entries compatible with this platform."),
    tag: z
      .string()
      .trim()
      .min(1)
      .max(80)
      .optional()
      .describe("Filter to entries carrying this exact tag."),
    query: z
      .string()
      .trim()
      .max(240)
      .optional()
      .describe("Keyword search to narrow the listing."),
    offset: z
      .number()
      .int()
      .min(0)
      .max(5000)
      .optional()
      .describe("Pagination offset for large result sets (0–5000)."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(25)
      .optional()
      .describe("Number of entries per page (1–25, default 20)."),
  })
  .strict();

export const RecentUpdatesInputSchema = z
  .object({
    category: pathPart
      .optional()
      .describe("Restrict to a single category (e.g. 'mcp', 'hooks')."),
    since: z
      .string()
      .trim()
      .min(4)
      .max(40)
      .optional()
      .describe(
        "Return only entries updated after this date, e.g. '2026-05-01'.",
      ),
    limit: z
      .number()
      .int()
      .min(1)
      .max(25)
      .optional()
      .describe("Maximum entries to return (1–25, default 10)."),
  })
  .strict();

export const RelatedEntriesInputSchema = z
  .object({
    category: pathPart.describe(
      "Category of the reference entry (e.g. 'mcp', 'skills').",
    ),
    slug: pathPart.describe(
      "Slug of the reference entry to find related entries for.",
    ),
    limit: z
      .number()
      .int()
      .min(1)
      .max(25)
      .optional()
      .describe("Maximum related entries to return (1–25, default 8)."),
  })
  .strict();

export const EntryDetailInputSchema = z
  .object({
    category: pathPart.describe(
      "Category of the entry (e.g. 'mcp', 'skills', 'agents').",
    ),
    slug: pathPart.describe("Slug of the entry to fetch."),
    bodyMode: z
      .enum(["none", "excerpt", "full"])
      .describe(
        "How much entry content to return. 'excerpt' (default) trims the body markdown to a short lead and omits large copyable fields (scriptBody, fullCopyableContent, copySnippet), reporting what was dropped via bodyChars/bodyTruncated/omittedFields; 'none' also drops the body; 'full' returns everything. Use entry.asset for omitted install/script content, and request 'full' only when you truly need the complete inline content — it can be tens of kilobytes.",
      )
      .optional(),
  })
  .strict();

export const CopyableAssetInputSchema = z
  .object({
    category: pathPart.describe(
      "Category of the entry (e.g. 'mcp', 'skills').",
    ),
    slug: pathPart.describe("Slug of the entry to fetch the asset for."),
    platform: platform
      .optional()
      .describe(
        "Target platform to tailor the install command or config snippet.",
      ),
    assetType: z
      .enum([
        "full_content",
        "install_command",
        "config_snippet",
        "script",
        "command_syntax",
        "usage",
        "items",
      ])
      .optional()
      .describe(
        "Return only this asset type instead of every asset. Use it to avoid paying for the full_content or script payload (up to tens of KB) when you only need, e.g., the install_command or config_snippet.",
      ),
  })
  .strict();

export const CompareEntriesInputSchema = z
  .object({
    entries: z
      .array(
        z
          .object({
            category: pathPart.describe(
              "Category of the entry (e.g. 'mcp', 'skills').",
            ),
            slug: pathPart.describe("Slug of the entry."),
          })
          .strict(),
      )
      .min(2)
      .max(5)
      .describe(
        "2–5 entries to compare, each identified by category and slug.",
      ),
    platform: platform
      .optional()
      .describe(
        "Target platform for the comparison (affects install steps shown).",
      ),
  })
  .strict();

export const RegistryStatsInputSchema = z.object({}).strict();

export const ClientSetupInputSchema = z
  .object({
    client: clientName
      .optional()
      .describe(
        "MCP client to generate a setup snippet for (e.g. 'claude-desktop', 'cursor').",
      ),
    endpointUrl: z
      .string()
      .trim()
      .url()
      .max(500)
      .optional()
      .describe(
        "Override the default remote MCP endpoint URL in the generated snippet.",
      ),
  })
  .strict();

export const CompatibilityInputSchema = z
  .object({
    category: pathPart
      .optional()
      .describe("Entry category (defaults to 'skills')."),
    slug: pathPart.describe(
      "Slug of the skill entry to check compatibility for.",
    ),
  })
  .strict();

export const InstallGuidanceInputSchema = z
  .object({
    category: pathPart.describe(
      "Category of the entry (e.g. 'mcp', 'skills').",
    ),
    slug: pathPart.describe("Slug of the entry to get install guidance for."),
    platform: platform
      .optional()
      .describe(
        "Target platform to tailor the install steps (e.g. 'claude-desktop', 'cursor').",
      ),
  })
  .strict();

export const PlatformAdapterInputSchema = z
  .object({
    slug: pathPart.describe(
      "Slug of the skill to generate a platform adapter for.",
    ),
    platform: platform
      .optional()
      .describe("Target platform for the adapter (defaults to 'cursor')."),
  })
  .strict();

export const ListDistributionFeedsInputSchema = z.object({}).strict();

export const GetSubmissionSchemaInputSchema = z
  .object({
    category: submissionCategory
      .optional()
      .describe(
        "Submission category to fetch the schema for. Returns all schemas if omitted.",
      ),
  })
  .strict();

export const ValidateSubmissionDraftInputSchema = z
  .object({
    fields: SubmissionFieldsSchema.describe(
      "Submission field values to validate against the HeyClaude content schema.",
    ),
  })
  .strict();

export const SearchDuplicateEntriesInputSchema = z
  .object({
    category: pathPart
      .optional()
      .describe("Category to scope the duplicate search."),
    slug: pathPart
      .optional()
      .describe("Slug to check for an exact existing entry."),
    name: z
      .string()
      .trim()
      .min(1)
      .max(240)
      .optional()
      .describe("Tool or resource name to search for near-duplicates."),
    title: z
      .string()
      .trim()
      .min(1)
      .max(240)
      .optional()
      .describe("Display title to search for near-duplicates."),
    sourceUrl: z
      .string()
      .trim()
      .min(1)
      .max(500)
      .optional()
      .describe("Primary source URL to check against existing entries."),
    sourceUrls: z
      .array(z.string().trim().min(1).max(500))
      .max(10)
      .optional()
      .describe(
        "Multiple source URLs to check (e.g. GitHub repo + docs site).",
      ),
    githubUrl: z
      .string()
      .trim()
      .min(1)
      .max(500)
      .optional()
      .describe("GitHub repository URL to check for duplicates."),
    docsUrl: z
      .string()
      .trim()
      .min(1)
      .max(500)
      .optional()
      .describe("Documentation URL to check for duplicates."),
    downloadUrl: z
      .string()
      .trim()
      .min(1)
      .max(500)
      .optional()
      .describe("Download or release URL to check for duplicates."),
    websiteUrl: z
      .string()
      .trim()
      .min(1)
      .max(500)
      .optional()
      .describe("Homepage or product URL to check for duplicates."),
    brandDomain: z
      .string()
      .trim()
      .min(1)
      .max(255)
      .optional()
      .describe(
        "Brand's canonical domain (e.g. 'example.com') to check for duplicates.",
      ),
    limit: z
      .number()
      .int()
      .min(1)
      .max(10)
      .optional()
      .describe("Maximum number of duplicate candidates to return (1–10)."),
  })
  .strict();

export const BuildSubmissionUrlsInputSchema = z
  .object({
    fields: SubmissionFieldsSchema.describe(
      "Validated submission field values to encode into submit and review URLs.",
    ),
    includePrBody: z
      .boolean()
      .optional()
      .describe("Include a pre-filled PR body in the returned URL."),
  })
  .strict();

export const CategorySubmissionGuidanceInputSchema = z
  .object({
    category: submissionCategory
      .optional()
      .describe(
        "Category to fetch contribution guidelines for. Returns general guidance if omitted.",
      ),
  })
  .strict();

export const PrepareSubmissionDraftInputSchema = z
  .object({
    fields: SubmissionFieldsSchema.describe(
      "Submission field values to compile into a canonical maintainer-reviewed PR draft.",
    ),
  })
  .strict();

export const GetSubmissionExamplesInputSchema = z
  .object({
    category: submissionCategory
      .optional()
      .describe(
        "Category to fetch submission examples for. Returns cross-category examples if omitted.",
      ),
  })
  .strict();

export const ReviewSubmissionDraftInputSchema = z
  .object({
    fields: SubmissionFieldsSchema.describe(
      "Submission field values to review for schema errors and maintainer checklist items.",
    ),
    duplicateLimit: z
      .number()
      .int()
      .min(1)
      .max(10)
      .optional()
      .describe(
        "Maximum number of duplicate candidates to include in the review.",
      ),
  })
  .strict();

export const SubmissionPolicyInputSchema = z.object({}).strict();

export const ExplainEntryTrustInputSchema = z
  .object({
    category: pathPart.describe(
      "Category of the entry (e.g. 'mcp', 'skills', 'agents').",
    ),
    slug: pathPart.describe("Slug of the entry to explain trust signals for."),
  })
  .strict();

export const ReviewEntrySafetyInputSchema = z
  .object({
    entries: z
      .array(
        z
          .object({
            category: pathPart.describe("Category of the entry."),
            slug: pathPart.describe("Slug of the entry."),
          })
          .strict(),
      )
      .min(1)
      .max(5)
      .describe(
        "1–5 entries to review for safety and privacy metadata, each identified by category and slug.",
      ),
    platform: platform
      .optional()
      .describe(
        "Target platform to contextualize safety and compatibility notes.",
      ),
  })
  .strict();

export const TOOL_INPUT_SCHEMAS = {
  "registry.search": SearchRegistryInputSchema,
  "workflow.plan": PlanWorkflowToolboxInputSchema,
  "registry.recommend": RecommendForTaskInputSchema,
  "server.info": GetServerInfoInputSchema,
  "registry.list": ListCategoryEntriesInputSchema,
  "registry.updates": RecentUpdatesInputSchema,
  "entry.related": RelatedEntriesInputSchema,
  "entry.detail": EntryDetailInputSchema,
  "entry.asset": CopyableAssetInputSchema,
  "entry.compare": CompareEntriesInputSchema,
  "registry.stats": RegistryStatsInputSchema,
  "install.setup": ClientSetupInputSchema,
  "install.compatibility": CompatibilityInputSchema,
  "install.guidance": InstallGuidanceInputSchema,
  "install.adapter": PlatformAdapterInputSchema,
  "feeds.list": ListDistributionFeedsInputSchema,
  "submission.schema": GetSubmissionSchemaInputSchema,
  "submission.validate": ValidateSubmissionDraftInputSchema,
  "submission.duplicates": SearchDuplicateEntriesInputSchema,
  "submission.urls": BuildSubmissionUrlsInputSchema,
  "submission.guidance": CategorySubmissionGuidanceInputSchema,
  "submission.prepare": PrepareSubmissionDraftInputSchema,
  "submission.examples": GetSubmissionExamplesInputSchema,
  "submission.review": ReviewSubmissionDraftInputSchema,
  "submission.policy": SubmissionPolicyInputSchema,
  "entry.trust": ExplainEntryTrustInputSchema,
  "entry.safety": ReviewEntrySafetyInputSchema,
};

function stripUnsupportedJsonSchemaFields(value) {
  if (Array.isArray(value)) {
    return value.map(stripUnsupportedJsonSchemaFields);
  }
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== "$schema")
      .map(([key, nested]) => [key, stripUnsupportedJsonSchemaFields(nested)]),
  );
}

export function jsonSchemaForTool(name) {
  const schema = TOOL_INPUT_SCHEMAS[name];
  if (!schema) {
    throw new Error(`Unknown HeyClaude MCP tool schema: ${name}`);
  }
  return stripUnsupportedJsonSchemaFields(z.toJSONSchema(schema));
}

export function jsonSchemaForToolOutput(name) {
  if (!TOOL_INPUT_SCHEMAS[name]) {
    throw new Error(`Unknown HeyClaude MCP tool output schema: ${name}`);
  }

  return {
    type: "object",
    properties: {
      ok: { type: "boolean" },
      policy: {
        type: "object",
        additionalProperties: true,
      },
    },
    required: ["ok"],
    additionalProperties: true,
  };
}

export function parseToolArguments(name, args = {}) {
  const schema = TOOL_INPUT_SCHEMAS[name];
  if (!schema) {
    throw new Error(`Unknown HeyClaude MCP tool schema: ${name}`);
  }
  return schema.parse(args || {});
}

export function formatZodError(error) {
  if (!(error instanceof z.ZodError)) return null;
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));
}
