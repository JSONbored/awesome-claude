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
    query: z.string().trim().max(240).optional(),
    category: pathPart.optional(),
    platform: platform.optional(),
    tag: z.string().trim().min(1).max(80).optional(),
    hasSafetyNotes: trustBooleanFilter.optional(),
    hasPrivacyNotes: trustBooleanFilter.optional(),
    downloadTrust: downloadTrustFilter.optional(),
    claimStatus: claimStatusFilter.optional(),
    sourceStatus: sourceStatusFilter.optional(),
    limit: z.number().int().min(1).max(25).optional(),
  })
  .strict();

export const PlanWorkflowToolboxInputSchema = z
  .object({
    goal: z.string().trim().min(2).max(240),
    category: pathPart.optional(),
    platform: platform.optional(),
    limit: z.number().int().min(1).max(10).optional(),
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

export const ServerInfoInputSchema = z.object({}).strict();

export const ListCategoryEntriesInputSchema = z
  .object({
    category: pathPart.optional(),
    platform: platform.optional(),
    tag: z.string().trim().min(1).max(80).optional(),
    query: z.string().trim().max(240).optional(),
    offset: z.number().int().min(0).max(5000).optional(),
    limit: z.number().int().min(1).max(25).optional(),
  })
  .strict();

export const RecentUpdatesInputSchema = z
  .object({
    category: pathPart.optional(),
    since: z.string().trim().min(4).max(40).optional(),
    limit: z.number().int().min(1).max(25).optional(),
  })
  .strict();

export const RelatedEntriesInputSchema = z
  .object({
    category: pathPart,
    slug: pathPart,
    limit: z.number().int().min(1).max(25).optional(),
  })
  .strict();

export const EntryDetailInputSchema = z
  .object({
    category: pathPart,
    slug: pathPart,
    bodyMode: z
      .enum(["none", "excerpt", "full"])
      .describe(
        "How much entry content to return. 'excerpt' (default) trims the body markdown to a short lead and omits large copyable fields (scriptBody, fullCopyableContent, copySnippet), reporting what was dropped via bodyChars/bodyTruncated/omittedFields; 'none' also drops the body; 'full' returns everything. Use get_copyable_asset for omitted install/script content, and request 'full' only when you truly need the complete inline content — it can be tens of kilobytes.",
      )
      .optional(),
  })
  .strict();

export const CopyableAssetInputSchema = z
  .object({
    category: pathPart,
    slug: pathPart,
    platform: platform.optional(),
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
            category: pathPart,
            slug: pathPart,
          })
          .strict(),
      )
      .min(2)
      .max(5),
    platform: platform.optional(),
  })
  .strict();

export const RegistryStatsInputSchema = z.object({}).strict();

export const ClientSetupInputSchema = z
  .object({
    client: clientName.optional(),
    endpointUrl: z.string().trim().url().max(500).optional(),
  })
  .strict();

export const CompatibilityInputSchema = z
  .object({
    category: pathPart.optional(),
    slug: pathPart,
  })
  .strict();

export const InstallGuidanceInputSchema = z
  .object({
    category: pathPart,
    slug: pathPart,
    platform: platform.optional(),
  })
  .strict();

export const PlatformAdapterInputSchema = z
  .object({
    slug: pathPart,
    platform: platform.optional(),
  })
  .strict();

export const ListDistributionFeedsInputSchema = z.object({}).strict();

export const GetSubmissionSchemaInputSchema = z
  .object({
    category: submissionCategory.optional(),
  })
  .strict();

export const ValidateSubmissionDraftInputSchema = z
  .object({
    fields: SubmissionFieldsSchema,
  })
  .strict();

export const SearchDuplicateEntriesInputSchema = z
  .object({
    category: pathPart.optional(),
    slug: pathPart.optional(),
    name: z.string().trim().min(1).max(240).optional(),
    title: z.string().trim().min(1).max(240).optional(),
    sourceUrl: z.string().trim().min(1).max(500).optional(),
    sourceUrls: z.array(z.string().trim().min(1).max(500)).max(10).optional(),
    githubUrl: z.string().trim().min(1).max(500).optional(),
    docsUrl: z.string().trim().min(1).max(500).optional(),
    downloadUrl: z.string().trim().min(1).max(500).optional(),
    websiteUrl: z.string().trim().min(1).max(500).optional(),
    brandDomain: z.string().trim().min(1).max(255).optional(),
    limit: z.number().int().min(1).max(10).optional(),
  })
  .strict();

export const BuildSubmissionUrlsInputSchema = z
  .object({
    fields: SubmissionFieldsSchema,
    includePrBody: z.boolean().optional(),
  })
  .strict();

export const CategorySubmissionGuidanceInputSchema = z
  .object({
    category: submissionCategory.optional(),
  })
  .strict();

export const PrepareSubmissionDraftInputSchema = z
  .object({
    fields: SubmissionFieldsSchema,
  })
  .strict();

export const GetSubmissionExamplesInputSchema = z
  .object({
    category: submissionCategory.optional(),
  })
  .strict();

export const ReviewSubmissionDraftInputSchema = z
  .object({
    fields: SubmissionFieldsSchema,
    duplicateLimit: z.number().int().min(1).max(10).optional(),
  })
  .strict();

export const SubmissionPolicyInputSchema = z.object({}).strict();

export const ExplainEntryTrustInputSchema = z
  .object({
    category: pathPart,
    slug: pathPart,
  })
  .strict();

export const ReviewEntrySafetyInputSchema = z
  .object({
    entries: z
      .array(
        z
          .object({
            category: pathPart,
            slug: pathPart,
          })
          .strict(),
      )
      .min(1)
      .max(5),
    platform: platform.optional(),
  })
  .strict();

export const TOOL_INPUT_SCHEMAS = {
  search_registry: SearchRegistryInputSchema,
  plan_workflow_toolbox: PlanWorkflowToolboxInputSchema,
  recommend_for_task: RecommendForTaskInputSchema,
  server_info: ServerInfoInputSchema,
  list_category_entries: ListCategoryEntriesInputSchema,
  get_recent_updates: RecentUpdatesInputSchema,
  get_related_entries: RelatedEntriesInputSchema,
  get_entry_detail: EntryDetailInputSchema,
  get_copyable_asset: CopyableAssetInputSchema,
  compare_entries: CompareEntriesInputSchema,
  get_registry_stats: RegistryStatsInputSchema,
  get_client_setup: ClientSetupInputSchema,
  get_compatibility: CompatibilityInputSchema,
  get_install_guidance: InstallGuidanceInputSchema,
  get_platform_adapter: PlatformAdapterInputSchema,
  list_distribution_feeds: ListDistributionFeedsInputSchema,
  get_submission_schema: GetSubmissionSchemaInputSchema,
  validate_submission_draft: ValidateSubmissionDraftInputSchema,
  search_duplicate_entries: SearchDuplicateEntriesInputSchema,
  build_submission_urls: BuildSubmissionUrlsInputSchema,
  get_category_submission_guidance: CategorySubmissionGuidanceInputSchema,
  prepare_submission_draft: PrepareSubmissionDraftInputSchema,
  get_submission_examples: GetSubmissionExamplesInputSchema,
  review_submission_draft: ReviewSubmissionDraftInputSchema,
  get_submission_policy: SubmissionPolicyInputSchema,
  explain_entry_trust: ExplainEntryTrustInputSchema,
  review_entry_safety: ReviewEntrySafetyInputSchema,
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
