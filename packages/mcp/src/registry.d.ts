export type RegistryToolResult = {
  ok: boolean;
  [key: string]: unknown;
};

export type RegistryArtifactLoaders = {
  dataDir?: string;
  readJsonArtifact?: <T = unknown>(relativePath: string) => Promise<T>;
  readTextArtifact?: (relativePath: string) => Promise<string>;
  /**
   * Opt-in cache for parsed JSON artifacts, keyed by absolute file path. The
   * default filesystem loader memoizes immutable registry artifacts into this
   * map so a long-lived process parses each one once. Ignored when a custom
   * `readJsonArtifact` loader is supplied. `createHeyClaudeMcpServer` provides
   * a fresh per-instance map automatically.
   */
  artifactCache?: Map<string, unknown>;
};

export const READ_ONLY_TOOL_NAMES: string[];
export const LOCAL_DRAFT_TOOL_NAMES: string[];
export const TOOL_DEFINITIONS: Array<{
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  annotations: Record<string, unknown>;
}>;

export const MCP_PUBLIC_POLICY: Record<string, unknown>;
export const RESOURCE_TEMPLATES: Array<Record<string, unknown>>;
export const PROMPT_DEFINITIONS: Array<Record<string, unknown>>;

export function searchRegistry(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function planWorkflowToolbox(
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

export function getCopyableAsset(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function compareEntries(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function getRegistryStats(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function getClientSetup(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function listRegistryResources(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<Record<string, unknown>>;

export function listRegistryResourceTemplates(): Record<string, unknown>;

export function readRegistryResource(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders & {
    publicApiBaseUrl?: string;
    fetchPublicApi?: (apiPath: string) => Promise<unknown>;
  },
): Promise<Record<string, unknown>>;

export function listRegistryPrompts(): Record<string, unknown>;

export function getRegistryPrompt(
  args?: Record<string, unknown>,
): Record<string, unknown>;

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

export function getSubmissionPolicy(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function explainEntryTrust(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function reviewEntrySafety(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export function listRegistryRecent(
  options?: RegistryArtifactLoaders & {
    publicApiBaseUrl?: string;
    fetchPublicApi?: (apiPath: string) => Promise<unknown>;
  },
): Promise<RegistryToolResult>;

export function listRegistryTrending(
  options?: RegistryArtifactLoaders & {
    publicApiBaseUrl?: string;
    fetchPublicApi?: (apiPath: string) => Promise<unknown>;
  },
): Promise<RegistryToolResult>;

export function listJobsActive(
  options?: RegistryArtifactLoaders & {
    publicApiBaseUrl?: string;
    fetchPublicApi?: (apiPath: string) => Promise<unknown>;
  },
): Promise<RegistryToolResult>;

export function callRegistryTool(
  name: string,
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistryToolResult>;

export {
  SearchRegistryInputSchema,
  PlanWorkflowToolboxInputSchema,
  ServerInfoInputSchema,
  ListCategoryEntriesInputSchema,
  RecentUpdatesInputSchema,
  RelatedEntriesInputSchema,
  EntryDetailInputSchema,
  CopyableAssetInputSchema,
  CompareEntriesInputSchema,
  RegistryStatsInputSchema,
  ClientSetupInputSchema,
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
  SubmissionPolicyInputSchema,
  ExplainEntryTrustInputSchema,
  ReviewEntrySafetyInputSchema,
  TOOL_INPUT_SCHEMAS,
  jsonSchemaForTool,
  jsonSchemaForToolOutput,
  parseToolArguments,
  formatZodError,
} from "./schemas.js";
