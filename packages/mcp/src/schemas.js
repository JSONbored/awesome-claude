/**
 * MCP tool Zod schemas surface.
 *
 * Pure schema helpers live in `schemas-lib.js`. This module re-exports that
 * surface so existing `./schemas.js` imports stay unchanged.
 */
export {
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
} from "./schemas-lib.js";
