export type RegistryToolResult = {
  ok: boolean;
  [key: string]: unknown;
};

export type RegistryArtifactLoaders = {
  dataDir?: string;
  readJsonArtifact?: <T = unknown>(relativePath: string) => Promise<T>;
  readTextArtifact?: (relativePath: string) => Promise<string>;
};

export const READ_ONLY_TOOL_NAMES: string[];
export const TOOL_DEFINITIONS: Array<{
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}>;

export function searchRegistry(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function getServerInfo(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function listCategoryEntries(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function getRecentUpdates(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function getRelatedEntries(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function getEntryDetail(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function getCompatibility(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function getInstallGuidance(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function getPlatformAdapter(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function listDistributionFeeds(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function getSubmissionSchema(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function validateSubmissionDraft(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function searchDuplicateRegistryEntries(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function buildSubmissionUrls(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function getCategorySubmissionGuidance(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function prepareSubmissionDraft(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function getSubmissionExamples(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function reviewSubmissionDraft(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function callRegistryTool(
  name: string,
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export {
  SearchRegistryInputSchema,
  ServerInfoInputSchema,
  ListCategoryEntriesInputSchema,
  RecentUpdatesInputSchema,
  RelatedEntriesInputSchema,
  EntryDetailInputSchema,
  CompatibilityInputSchema,
  InstallGuidanceInputSchema,
  PlatformAdapterInputSchema,
  ListDistributionFeedsInputSchema,
  SubmissionFieldsSchema,
  GetSubmissionSchemaInputSchema,
  ValidateSubmissionDraftInputSchema,
  SearchDuplicateEntriesInputSchema,
  BuildSubmissionUrlsInputSchema,
  CategorySubmissionGuidanceInputSchema,
  PrepareSubmissionDraftInputSchema,
  GetSubmissionExamplesInputSchema,
  ReviewSubmissionDraftInputSchema,
  TOOL_INPUT_SCHEMAS,
  jsonSchemaForTool,
  parseToolArguments,
  formatZodError,
} from "./schemas.js";
