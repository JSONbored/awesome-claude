import {
  isRecord,
  normalizeStringArray,
  optionalBoolean,
  optionalNumber,
  optionalRawString,
  optionalString,
  uniqueStrings,
} from "./utils";

export const FEED_URL = "https://heyclau.de/data/raycast-index.json";
export const RAYCAST_FEED_OVERRIDE_ENV = "HEYCLAUDE_RAYCAST_FEED_URL";
export const REGISTRY_SEARCH_URL = "https://heyclau.de/api/registry/search";
export const SUBMIT_URL = "https://heyclau.de/submit";
export const CACHE_KEY = "heyclaude-raycast-index";
export const FEED_METADATA_CACHE_KEY = "heyclaude-raycast-feed-metadata";
export const DETAIL_CACHE_PREFIX = "heyclaude-raycast-detail";
export const FAVORITES_KEY = "favorite-entry-keys";
export const TRENDING_CACHE_KEY = "heyclaude-raycast-trending";
export const RECENT_UPDATES_CACHE_KEY = "heyclaude-raycast-recent-updates";
const RAYCAST_FEED_PATH = "/data/raycast-index.json";
const REGISTRY_MANIFEST_PATH = "/data/registry-manifest.json";
const REGISTRY_TRENDING_PATH = "/api/registry/trending";
const REGISTRY_DIFF_PATH = "/api/registry/diff";
const DEFAULT_DISCOVERY_LIMIT = 25;
const localFeedHostnames = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

export type DownloadTrust = "first-party" | "external" | null;
export type McpInstallTargetId =
  | "claude-code"
  | "codex"
  | "cursor"
  | "antigravity";

const mcpInstallTargetIds = new Set<McpInstallTargetId>([
  "claude-code",
  "codex",
  "cursor",
  "antigravity",
]);

export type RaycastEntry = {
  category: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  author?: string;
  brandName?: string;
  brandDomain?: string;
  brandIconUrl?: string;
  brandLogoUrl?: string;
  brandAssetSource?: string;
  brandVerifiedAt?: string;
  platformCompatibility?: string[];
  installable: boolean;
  hasInstallCommand: boolean;
  hasConfigSnippet: boolean;
  mcpInstallTargets?: McpInstallTargetId[];
  installCommand: string;
  configSnippet: string;
  copyText: string;
  copyTextLength?: number;
  copyTextTruncated?: boolean;
  detailMarkdown: string;
  detailUrl?: string;
  webUrl: string;
  canonicalUrl?: string;
  llmsUrl?: string;
  apiUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  repoUrl: string;
  documentationUrl: string;
  downloadTrust: DownloadTrust;
  verificationStatus: string;
  packageVerified?: boolean;
  safetyNotes?: string[];
  privacyNotes?: string[];
  trustSignals?: RaycastTrustSignals;
  searchScore?: number;
  searchReasons?: string[];
};

export type RaycastTrustSignals = {
  firstPartyEditorial?: boolean;
  packageVerified?: boolean;
  sourceStatus?: string;
  lastVerifiedAt?: string;
  hasSafetyNotes?: boolean;
  hasPrivacyNotes?: boolean;
  platforms?: string[];
  supportLevels?: string[];
};

export type RegistrySearchFacetBuckets = Record<string, number>;

export type RegistrySearchFacets = {
  categories: RegistrySearchFacetBuckets;
  platforms: RegistrySearchFacetBuckets;
  installable: RegistrySearchFacetBuckets;
  hasSafetyNotes: RegistrySearchFacetBuckets;
  hasPrivacyNotes: RegistrySearchFacetBuckets;
  downloadTrust: RegistrySearchFacetBuckets;
  claimStatus: RegistrySearchFacetBuckets;
  sourceStatus: RegistrySearchFacetBuckets;
};

export type RaycastDiscoveryReference = {
  key: string;
  category: string;
  slug: string;
  title: string;
  description: string;
  canonicalUrl?: string;
  dateAdded?: string;
  score?: number;
  reasons: string[];
  updatedAt?: string;
  updateKind?: string;
};

export type RaycastDiscoveryEntry = RaycastEntry & {
  discovery: RaycastDiscoveryReference;
};

export type ParsedTrendingFeed = {
  entries: RaycastDiscoveryReference[];
  category: string;
  platform: string;
  generatedAt: string;
  signalsAvailable?: {
    votes: boolean;
    community: boolean;
    intent: boolean;
  };
  refreshStatus?: "updated" | "stale";
  refreshWarning?: string;
};

export type ParsedRecentUpdatesFeed = {
  entries: RaycastDiscoveryReference[];
  generatedAt: string;
  currentSignature: string;
  refreshStatus?: "updated" | "stale";
  refreshWarning?: string;
};

function normalizeDownloadTrust(value: unknown): DownloadTrust {
  return value === "first-party" || value === "external" ? value : null;
}

function normalizePlatformCompatibility(value: unknown) {
  if (!Array.isArray(value)) return [];

  return uniqueStrings(
    value.flatMap((item) => {
      if (typeof item === "string") return item;
      if (!isRecord(item)) return [];

      const platform = optionalString(item.platform);
      const supportLevel = optionalString(item.supportLevel);
      if (!platform) return [];
      return supportLevel ? `${platform}: ${supportLevel}` : platform;
    }),
  );
}

function normalizeMcpInstallTargets(value: unknown): McpInstallTargetId[] {
  return uniqueStrings(
    normalizeStringArray(value).filter((item): item is McpInstallTargetId =>
      mcpInstallTargetIds.has(item as McpInstallTargetId),
    ),
  ) as McpInstallTargetId[];
}

function normalizeTrustSignals(
  value: unknown,
): RaycastTrustSignals | undefined {
  if (!isRecord(value)) return undefined;
  const trustSignals: RaycastTrustSignals = {
    firstPartyEditorial: optionalBoolean(value.firstPartyEditorial),
    packageVerified: optionalBoolean(value.packageVerified),
    sourceStatus: optionalString(value.sourceStatus) || undefined,
    lastVerifiedAt: optionalString(value.lastVerifiedAt) || undefined,
    hasSafetyNotes: optionalBoolean(value.hasSafetyNotes),
    hasPrivacyNotes: optionalBoolean(value.hasPrivacyNotes),
    platforms: normalizeStringArray(value.platforms),
    supportLevels: normalizeStringArray(value.supportLevels),
  };
  const compact = Object.fromEntries(
    Object.entries(trustSignals).filter(([, item]) =>
      Array.isArray(item) ? item.length > 0 : item !== undefined,
    ),
  ) as RaycastTrustSignals;
  return Object.keys(compact).length > 0 ? compact : undefined;
}

function normalizeFacetBuckets(value: unknown): RegistrySearchFacetBuckets {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(
        ([, count]) => typeof count === "number" && Number.isFinite(count),
      )
      .map(([key, count]) => [key, Math.max(0, Math.trunc(count as number))]),
  );
}

function normalizeRegistrySearchFacets(
  value: unknown,
): RegistrySearchFacets | undefined {
  if (!isRecord(value)) return undefined;
  return {
    categories: normalizeFacetBuckets(value.categories),
    platforms: normalizeFacetBuckets(value.platforms),
    installable: normalizeFacetBuckets(value.installable),
    hasSafetyNotes: normalizeFacetBuckets(value.hasSafetyNotes),
    hasPrivacyNotes: normalizeFacetBuckets(value.hasPrivacyNotes),
    downloadTrust: normalizeFacetBuckets(value.downloadTrust),
    claimStatus: normalizeFacetBuckets(value.claimStatus),
    sourceStatus: normalizeFacetBuckets(value.sourceStatus),
  };
}

export function buildEntrySummary(entry: RaycastEntry) {
  return [
    `${entry.title} — ${categoryLabel(entry.category)}`,
    entry.brandName ? `Brand: ${entry.brandName}` : "",
    entry.description,
    `URL: ${entry.webUrl}`,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Formats disclosed safety/privacy notes for an install confirmation dialog so
 * the user sees risk disclosures (config writes, process execution, network or
 * credential access) before an MCP server is installed. Shows up to three notes
 * per category; returns "" when there is nothing to disclose.
 */
/**
 * Coerces a notes value into a clean list of non-empty trimmed strings,
 * tolerating malformed payloads (non-array values or non-string items) that can
 * reach the UI since detail payloads are not strictly validated.
 */
export function normalizeNotes(notes?: string[]): string[] {
  return (Array.isArray(notes) ? notes : [])
    .map((note) => String(note).trim())
    .filter(Boolean);
}

export function buildInstallNotesSummary(
  safetyNotes?: string[],
  privacyNotes?: string[],
): string {
  const section = (label: string, notes?: string[]) => {
    const items = normalizeNotes(notes);
    if (items.length === 0) return "";
    const lines = items.slice(0, 3).map((note) => `• ${note}`);
    if (items.length > 3) {
      lines.push(`• …and ${items.length - 3} more`);
    }
    return `\n\n${label}:\n${lines.join("\n")}`;
  };
  return `${section("⚠️ Safety", safetyNotes)}${section("🔒 Privacy", privacyNotes)}`;
}

export type RaycastDetail = {
  copyText?: string;
  detailMarkdown: string;
  llmsUrl?: string;
  installable?: boolean;
  hasInstallCommand?: boolean;
  hasConfigSnippet?: boolean;
  mcpInstallTargets?: McpInstallTargetId[];
  installCommand?: string;
  configSnippet?: string;
  safetyNotes?: string[];
  privacyNotes?: string[];
  sourceUrl?: string;
  trustSignals?: RaycastTrustSignals;
};

export type ParsedFeed = {
  entries: RaycastEntry[];
  generatedAt: string;
  signature?: string;
  refreshStatus?: "updated" | "unchanged" | "stale";
  refreshWarning?: string;
};

export type ParsedRegistrySearch = {
  entries: RaycastEntry[];
  query: string;
  category: string;
  total: number;
  limit: number;
  offset: number;
  nextOffset: number | null;
  facets?: RegistrySearchFacets;
  skippedMalformedEntries?: number;
};

export type RegistrySearchUrlOptions = {
  query: string;
  category?: string;
  platform?: string;
  installable?: string;
  hasSafetyNotes?: string;
  hasPrivacyNotes?: string;
  downloadTrust?: string;
  sourceStatus?: string;
  limit?: number;
  offset?: number;
  searchUrl?: string;
};

export type RaycastFeedPreferences = {
  feedUrlOverride?: string;
};

export type FeedSnapshotMetadata = {
  generatedAt: string;
  signature: string;
  detailCacheNamespace: string;
  verifiedContentSha256?: string;
};

export type RegistryManifestSnapshot = {
  generatedAt: string;
  signature: string;
  feedSha256?: string;
};

export type CategoryOption = {
  value: string;
  title: string;
};

export type SubmissionDraft = {
  category?: string;
  title?: string;
  slug?: string;
  sourceUrl?: string;
  repoUrl?: string;
  documentationUrl?: string;
  brandName?: string;
  brandDomain?: string;
  description?: string;
  tags?: string[] | string;
};

export const categoryLabels: Record<string, string> = {
  agents: "Agents",
  mcp: "MCP Servers",
  tools: "Tools",
  skills: "Skills",
  rules: "Rules",
  commands: "Commands",
  hooks: "Hooks",
  guides: "Guides",
  collections: "Collections",
  statuslines: "Statuslines",
};

export function entryKey(entry: Pick<RaycastEntry, "category" | "slug">) {
  return `${entry.category}:${entry.slug}`;
}

export function resolveFeedUrl(value?: string | null) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return FEED_URL;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("Feed override must be a valid URL");
  }

  const isLocalHttp =
    url.protocol === "http:" && localFeedHostnames.has(url.hostname);
  if (url.protocol !== "https:" && !isLocalHttp) {
    throw new Error("Feed override must use HTTPS unless it targets localhost");
  }
  if (!url.pathname.endsWith(RAYCAST_FEED_PATH)) {
    throw new Error(`Feed override must end with ${RAYCAST_FEED_PATH}`);
  }

  url.hash = "";
  return url.toString();
}

export function resolveConfiguredFeedUrl(
  preferences: RaycastFeedPreferences = {},
  env: Record<string, string | undefined> = process.env,
) {
  return resolveFeedUrl(
    env[RAYCAST_FEED_OVERRIDE_ENV] || preferences.feedUrlOverride,
  );
}

export function scopedCacheKey(baseKey: string, feedUrl = FEED_URL) {
  const normalizedFeedUrl = resolveFeedUrl(feedUrl);
  if (normalizedFeedUrl === FEED_URL) return baseKey;
  return `${baseKey}:${encodeURIComponent(normalizedFeedUrl)}`;
}

export function feedCacheKey(feedUrl = FEED_URL) {
  return scopedCacheKey(CACHE_KEY, feedUrl);
}

export function feedMetadataCacheKey(feedUrl = FEED_URL) {
  return scopedCacheKey(FEED_METADATA_CACHE_KEY, feedUrl);
}

export function trendingCacheKey(feedUrl = FEED_URL) {
  return scopedCacheKey(TRENDING_CACHE_KEY, feedUrl);
}

export function recentUpdatesCacheKey(feedUrl = FEED_URL) {
  return scopedCacheKey(RECENT_UPDATES_CACHE_KEY, feedUrl);
}

export function detailCacheKey(
  entry: Pick<RaycastEntry, "category" | "slug">,
  feedUrl = FEED_URL,
  detailCacheNamespace = "",
) {
  const namespace = detailCacheNamespace ? `:${detailCacheNamespace}` : "";
  return scopedCacheKey(
    `${DETAIL_CACHE_PREFIX}:${entryKey(entry)}${namespace}`,
    feedUrl,
  );
}

export function categoryLabel(category: string) {
  return categoryLabels[category] ?? category;
}

export function absoluteDataUrl(value: string, baseUrl = FEED_URL) {
  return new URL(value, baseUrl).toString();
}

export function registryManifestUrl(feedUrl = FEED_URL) {
  return absoluteDataUrl(REGISTRY_MANIFEST_PATH, feedUrl);
}

export function registrySearchUrl(options: RegistrySearchUrlOptions) {
  const url = new URL(options.searchUrl || REGISTRY_SEARCH_URL);
  url.searchParams.set("q", options.query.trim());
  if (options.category) url.searchParams.set("category", options.category);
  if (options.platform) url.searchParams.set("platform", options.platform);
  if (options.installable) {
    url.searchParams.set("installable", options.installable);
  }
  if (options.hasSafetyNotes) {
    url.searchParams.set("hasSafetyNotes", options.hasSafetyNotes);
  }
  if (options.hasPrivacyNotes) {
    url.searchParams.set("hasPrivacyNotes", options.hasPrivacyNotes);
  }
  if (options.downloadTrust) {
    url.searchParams.set("downloadTrust", options.downloadTrust);
  }
  if (options.sourceStatus) {
    url.searchParams.set("sourceStatus", options.sourceStatus);
  }
  if (options.limit !== undefined) {
    url.searchParams.set("limit", String(options.limit));
  }
  if (options.offset !== undefined) {
    url.searchParams.set("offset", String(options.offset));
  }
  return url.toString();
}

function discoveryLimit(value = DEFAULT_DISCOVERY_LIMIT) {
  const finiteValue = Number(value);
  if (!Number.isFinite(finiteValue)) return DEFAULT_DISCOVERY_LIMIT;
  return Math.max(1, Math.min(50, Math.trunc(finiteValue)));
}

export function trendingFeedUrl(
  feedUrl = FEED_URL,
  limit = DEFAULT_DISCOVERY_LIMIT,
) {
  const url = new URL(REGISTRY_TRENDING_PATH, feedUrl);
  url.searchParams.set("limit", String(discoveryLimit(limit)));
  return url.toString();
}

export function recentUpdatesFeedUrl(
  feedUrl = FEED_URL,
  limit = DEFAULT_DISCOVERY_LIMIT,
) {
  const url = new URL(REGISTRY_DIFF_PATH, feedUrl);
  url.searchParams.set("limit", String(discoveryLimit(limit)));
  return url.toString();
}

function setOptionalParam(
  params: URLSearchParams,
  key: string,
  value?: string | string[],
) {
  const normalized = Array.isArray(value)
    ? value.map(String).filter(Boolean).join(", ")
    : String(value || "").trim();
  if (normalized) params.set(key, normalized);
}

export function buildContributeEntryUrl(
  entry?: Partial<RaycastEntry> | SubmissionDraft,
) {
  const url = new URL(SUBMIT_URL);
  if (entry?.category) url.searchParams.set("category", entry.category);
  if (entry?.title) url.searchParams.set("name", entry.title);
  if (entry?.slug) url.searchParams.set("slug", entry.slug);
  setOptionalParam(url.searchParams, "description", entry?.description);
  setOptionalParam(url.searchParams, "card_description", entry?.description);
  setOptionalParam(url.searchParams, "brand_name", entry?.brandName);
  setOptionalParam(url.searchParams, "brand_domain", entry?.brandDomain);
  setOptionalParam(url.searchParams, "tags", entry?.tags);
  const draft = entry as SubmissionDraft | undefined;
  const repoUrl = entry?.repoUrl || draft?.repoUrl || "";
  const docsUrl = entry?.documentationUrl || draft?.documentationUrl || "";
  const sourceUrl = draft?.sourceUrl || "";
  setOptionalParam(url.searchParams, "github_url", repoUrl);
  setOptionalParam(url.searchParams, "docs_url", docsUrl || sourceUrl);
  return url.toString();
}

export function buildSubmitPrUrl(categoryOrDraft?: string | SubmissionDraft) {
  const draft: SubmissionDraft | undefined =
    typeof categoryOrDraft === "string"
      ? { category: categoryOrDraft }
      : categoryOrDraft;
  const category = draft?.category;
  const url = new URL(SUBMIT_URL);
  if (category) url.searchParams.set("category", category);
  setOptionalParam(url.searchParams, "title", draft?.title);
  setOptionalParam(url.searchParams, "name", draft?.title);
  setOptionalParam(url.searchParams, "slug", draft?.slug);
  setOptionalParam(url.searchParams, "description", draft?.description);
  setOptionalParam(url.searchParams, "card_description", draft?.description);
  setOptionalParam(url.searchParams, "brand_name", draft?.brandName);
  setOptionalParam(url.searchParams, "brand_domain", draft?.brandDomain);
  setOptionalParam(url.searchParams, "tags", draft?.tags);
  setOptionalParam(url.searchParams, "github_url", draft?.repoUrl);
  setOptionalParam(
    url.searchParams,
    "docs_url",
    draft?.documentationUrl || draft?.sourceUrl,
  );
  return url.toString();
}

export function buildSuggestChangeUrl(entry: RaycastEntry) {
  const url = new URL(SUBMIT_URL);
  url.searchParams.set("intent", "update");
  url.searchParams.set(
    "title",
    `Update ${categoryLabel(entry.category)}: ${entry.title}`,
  );
  url.searchParams.set("name", entry.title);
  url.searchParams.set("slug", entry.slug);
  url.searchParams.set("category", entry.category);
  url.searchParams.set("description", entry.description);
  url.searchParams.set("card_description", entry.description);
  if (entry.brandName) url.searchParams.set("brand_name", entry.brandName);
  if (entry.brandDomain) {
    url.searchParams.set("brand_domain", entry.brandDomain);
  }
  if (entry.tags?.length) url.searchParams.set("tags", entry.tags.join(", "));
  if (entry.repoUrl) url.searchParams.set("github_url", entry.repoUrl);
  if (entry.documentationUrl) {
    url.searchParams.set("docs_url", entry.documentationUrl);
  }
  return url.toString();
}

export function normalizeRaycastEntry(value: unknown): RaycastEntry | null {
  if (!isRecord(value)) return null;

  const category = optionalString(value.category);
  const slug = optionalString(value.slug);
  const title = optionalString(value.title);
  const description = optionalString(value.description);
  const copyText = optionalRawString(value.copyText);
  const detailMarkdown = optionalRawString(value.detailMarkdown);
  const detailUrl = optionalString(value.detailUrl) || undefined;
  const webUrl = optionalString(value.webUrl);

  if (!category || !slug || !title || !description || !detailUrl || !webUrl) {
    return null;
  }

  const entry: RaycastEntry = {
    category,
    slug,
    title,
    description,
    tags: normalizeStringArray(value.tags),
    author: optionalString(value.author) || undefined,
    brandName: optionalString(value.brandName) || undefined,
    brandDomain: optionalString(value.brandDomain) || undefined,
    brandIconUrl: optionalString(value.brandIconUrl) || undefined,
    brandLogoUrl: optionalString(value.brandLogoUrl) || undefined,
    brandAssetSource: optionalString(value.brandAssetSource) || undefined,
    brandVerifiedAt: optionalString(value.brandVerifiedAt) || undefined,
    platformCompatibility: normalizePlatformCompatibility(
      value.platformCompatibility,
    ),
    installable: optionalBoolean(value.installable) ?? false,
    hasInstallCommand: optionalBoolean(value.hasInstallCommand) ?? false,
    hasConfigSnippet: optionalBoolean(value.hasConfigSnippet) ?? false,
    mcpInstallTargets: normalizeMcpInstallTargets(value.mcpInstallTargets),
    installCommand: optionalRawString(value.installCommand),
    configSnippet: optionalRawString(value.configSnippet),
    copyText,
    copyTextLength: optionalNumber(value.copyTextLength),
    copyTextTruncated: optionalBoolean(value.copyTextTruncated),
    detailMarkdown,
    detailUrl,
    webUrl,
    canonicalUrl: optionalString(value.canonicalUrl) || undefined,
    llmsUrl: optionalString(value.llmsUrl) || undefined,
    apiUrl: optionalString(value.apiUrl) || undefined,
    seoTitle: optionalString(value.seoTitle) || undefined,
    seoDescription: optionalString(value.seoDescription) || undefined,
    repoUrl: optionalString(value.repoUrl),
    documentationUrl: optionalString(value.documentationUrl),
    downloadTrust: normalizeDownloadTrust(value.downloadTrust),
    verificationStatus: optionalString(value.verificationStatus),
    packageVerified: optionalBoolean(value.packageVerified),
    safetyNotes: normalizeStringArray(value.safetyNotes),
    privacyNotes: normalizeStringArray(value.privacyNotes),
    trustSignals: normalizeTrustSignals(value.trustSignals),
    searchScore: optionalNumber(value.searchScore),
    searchReasons: normalizeStringArray(value.searchReasons),
  };

  if (!entry.copyText.trim()) {
    entry.copyText = buildSearchResultCopyText(entry);
    entry.copyTextLength = entry.copyText.length;
    entry.copyTextTruncated = false;
  }
  if (!entry.detailMarkdown.trim()) {
    entry.detailMarkdown = buildSearchResultDetailMarkdown(entry);
  }

  return entry;
}

export function isValidRaycastEntry(value: unknown) {
  return normalizeRaycastEntry(value) !== null;
}

function buildSearchResultDetailMarkdown(entry: RaycastEntry) {
  return [
    `# ${entry.title}`,
    "",
    entry.description,
    "",
    "## Source",
    entry.repoUrl || entry.documentationUrl || entry.webUrl,
    "",
    entry.tags.length ? "## Tags" : "",
    entry.tags.length ? entry.tags.map((tag) => `- ${tag}`).join("\n") : "",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function buildSearchResultCopyText(
  entry: Pick<RaycastEntry, "title" | "description" | "webUrl">,
) {
  return `${entry.title}\n\n${entry.description}\n\n${entry.webUrl}`;
}

export function normalizeRegistrySearchEntry(
  value: unknown,
): RaycastEntry | null {
  if (!isRecord(value)) return null;

  const category = optionalString(value.category);
  const slug = optionalString(value.slug);
  const title = optionalString(value.title);
  const description = optionalString(value.description);
  const webUrl =
    optionalString(value.canonicalUrl) ||
    optionalString(value.url) ||
    optionalString(value.webUrl);

  if (!category || !slug || !title || !description || !webUrl) {
    return null;
  }

  const entry: RaycastEntry = {
    category,
    slug,
    title,
    description,
    tags: normalizeStringArray(value.tags),
    author: optionalString(value.author) || undefined,
    brandName: optionalString(value.brandName) || undefined,
    brandDomain: optionalString(value.brandDomain) || undefined,
    brandIconUrl: optionalString(value.brandIconUrl) || undefined,
    brandLogoUrl: optionalString(value.brandLogoUrl) || undefined,
    brandAssetSource: optionalString(value.brandAssetSource) || undefined,
    brandVerifiedAt: optionalString(value.brandVerifiedAt) || undefined,
    platformCompatibility: normalizeStringArray(value.platforms),
    installable: optionalBoolean(value.installable) ?? false,
    hasInstallCommand: optionalBoolean(value.hasInstallCommand) ?? false,
    hasConfigSnippet: optionalBoolean(value.hasConfigSnippet) ?? false,
    mcpInstallTargets: normalizeMcpInstallTargets(value.mcpInstallTargets),
    installCommand: "",
    configSnippet: "",
    copyText: "",
    detailMarkdown: "",
    detailUrl: `/data/raycast/${category}/${slug}.json`,
    webUrl,
    canonicalUrl: webUrl,
    llmsUrl: optionalString(value.llmsUrl) || undefined,
    apiUrl: optionalString(value.apiUrl) || undefined,
    seoTitle: optionalString(value.seoTitle) || undefined,
    seoDescription: optionalString(value.seoDescription) || undefined,
    repoUrl: optionalString(value.repoUrl),
    documentationUrl: optionalString(value.documentationUrl),
    downloadTrust: normalizeDownloadTrust(value.downloadTrust),
    verificationStatus: optionalString(value.verificationStatus),
    packageVerified:
      optionalBoolean(value.packageVerified) ??
      normalizeTrustSignals(value.trustSignals)?.packageVerified,
    safetyNotes: normalizeStringArray(value.safetyNotes),
    privacyNotes: normalizeStringArray(value.privacyNotes),
    trustSignals: normalizeTrustSignals(value.trustSignals),
    searchScore: optionalNumber(value.searchScore),
    searchReasons: normalizeStringArray(value.searchReasons),
  };

  entry.copyText = buildSearchResultCopyText(entry);
  entry.copyTextLength = entry.copyText.length;
  entry.copyTextTruncated = false;
  entry.detailMarkdown = buildSearchResultDetailMarkdown(entry);
  return entry;
}

function readRequiredNumber(value: unknown, field: string) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  throw new Error(`Registry search payload missing numeric ${field}`);
}

function readRequiredNextOffset(value: unknown) {
  if (value === null) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  throw new Error("Registry search payload missing nextOffset");
}

export function parseRegistrySearch(value: string): ParsedRegistrySearch {
  const parsed = JSON.parse(value) as unknown;
  if (!isRecord(parsed) || !Array.isArray(parsed.results)) {
    throw new Error("Registry search payload was malformed");
  }

  const total = readRequiredNumber(parsed.total, "total");
  const limit = readRequiredNumber(parsed.limit, "limit");
  const offset = readRequiredNumber(parsed.offset, "offset");
  const nextOffset = readRequiredNextOffset(parsed.nextOffset);
  const normalizedEntries = parsed.results.map(normalizeRegistrySearchEntry);
  const entries = normalizedEntries.filter(
    (entry): entry is RaycastEntry => entry !== null,
  );
  const skippedMalformedEntries = normalizedEntries.length - entries.length;
  if (skippedMalformedEntries > 0) {
    console.warn(
      `Skipped ${skippedMalformedEntries} malformed registry search result${
        skippedMalformedEntries === 1 ? "" : "s"
      }.`,
    );
  }

  return {
    entries,
    query: optionalString(parsed.query),
    category: optionalString(parsed.category) || "all",
    total,
    limit,
    offset,
    nextOffset,
    facets: normalizeRegistrySearchFacets(parsed.facets),
    skippedMalformedEntries: skippedMalformedEntries || undefined,
  };
}

export function parseFeed(value: string): ParsedFeed {
  const parsed = JSON.parse(value) as unknown;
  const envelope = parsed as {
    schemaVersion?: unknown;
    generatedAt?: unknown;
    entries?: unknown;
  };
  if (!Array.isArray(envelope.entries)) {
    return { entries: [], generatedAt: "" };
  }

  const entries = envelope.entries
    .map(normalizeRaycastEntry)
    .filter((entry): entry is RaycastEntry => entry !== null);

  return {
    entries,
    generatedAt:
      typeof envelope.generatedAt === "string" ? envelope.generatedAt : "",
  };
}

function discoveryEnvelope(value: string) {
  const parsed = JSON.parse(value) as unknown;
  return isRecord(parsed) ? parsed : {};
}

function discoveryReferenceFromEntry(
  value: unknown,
): RaycastDiscoveryReference | null {
  if (!isRecord(value)) return null;

  const category = optionalString(value.category);
  const slug = optionalString(value.slug);
  if (!category || !slug) return null;

  const key = optionalString(value.key) || `${category}:${slug}`;
  return {
    key,
    category,
    slug,
    title: optionalString(value.title),
    description: optionalString(value.description),
    canonicalUrl: optionalString(value.canonicalUrl) || undefined,
    dateAdded: optionalString(value.dateAdded) || undefined,
    score: optionalNumber(value.score),
    reasons: normalizeStringArray(value.reasons),
    updatedAt:
      optionalString(value.updatedAt) ||
      optionalString(value.dateAdded) ||
      undefined,
    updateKind:
      optionalString(value.updateKind) ||
      optionalString(value.type) ||
      undefined,
  };
}

export function parseTrendingFeed(value: string): ParsedTrendingFeed {
  const envelope = discoveryEnvelope(value);
  const signalPayload = isRecord(envelope.signalsAvailable)
    ? envelope.signalsAvailable
    : {};
  const entries = Array.isArray(envelope.entries)
    ? envelope.entries
        .map(discoveryReferenceFromEntry)
        .filter((entry): entry is RaycastDiscoveryReference => entry !== null)
    : [];

  return {
    entries,
    category: optionalString(envelope.category) || "all",
    platform: optionalString(envelope.platform) || "all",
    generatedAt: optionalString(envelope.generatedAt),
    signalsAvailable: {
      votes: Boolean(signalPayload.votes),
      community: Boolean(signalPayload.community),
      intent: Boolean(signalPayload.intent),
    },
  };
}

export function parseRecentUpdatesFeed(value: string): ParsedRecentUpdatesFeed {
  const envelope = discoveryEnvelope(value);
  const entries = Array.isArray(envelope.entries)
    ? envelope.entries
        .map(discoveryReferenceFromEntry)
        .filter((entry): entry is RaycastDiscoveryReference => entry !== null)
    : [];

  return {
    entries,
    generatedAt: optionalString(envelope.generatedAt),
    currentSignature: optionalString(envelope.currentSignature),
  };
}

export function hasValidDiscoveryEntries(value: string) {
  const envelope = discoveryEnvelope(value);
  if (!Array.isArray(envelope.entries)) return false;
  return envelope.entries.some(
    (entry) => discoveryReferenceFromEntry(entry) !== null,
  );
}

function discoveryFallbackEntry(
  reference: RaycastDiscoveryReference,
): RaycastDiscoveryEntry {
  const title = reference.title || reference.slug;
  const webUrl =
    reference.canonicalUrl ||
    `https://heyclau.de/${reference.category}/${reference.slug}`;
  const detailMarkdown = [`# ${title}`, "", reference.description]
    .filter(Boolean)
    .join("\n");
  const copyText = [title, reference.description, webUrl]
    .filter(Boolean)
    .join("\n\n");

  return {
    category: reference.category,
    slug: reference.slug,
    title,
    description: reference.description,
    tags: [],
    installable: false,
    hasInstallCommand: false,
    hasConfigSnippet: false,
    installCommand: "",
    configSnippet: "",
    copyText,
    detailMarkdown,
    webUrl,
    canonicalUrl: reference.canonicalUrl,
    repoUrl: "",
    documentationUrl: "",
    downloadTrust: null,
    verificationStatus: "",
    discovery: reference,
  };
}

export function attachDiscoveryEntries(
  entries: RaycastEntry[],
  references: RaycastDiscoveryReference[],
  options: { fallbackForRemoved?: boolean } = {},
) {
  const byKey = new Map(entries.map((entry) => [entryKey(entry), entry]));
  return references
    .map((reference) => {
      const entry = byKey.get(entryKey(reference));
      if (entry) {
        return { ...entry, discovery: reference } as RaycastDiscoveryEntry;
      }
      if (options.fallbackForRemoved && reference.updateKind === "removed") {
        return discoveryFallbackEntry(reference);
      }
      return null;
    })
    .filter((entry): entry is RaycastDiscoveryEntry => entry !== null);
}

export function filterDiscoveryEntries(
  entries: RaycastDiscoveryEntry[],
  category: string,
  favorites: Set<string>,
) {
  return filterEntriesByCategory(entries, category, favorites);
}

export function buildFeedSnapshotMetadata(
  feed: Pick<ParsedFeed, "generatedAt">,
  manifestSnapshot?: RegistryManifestSnapshot | null,
  contentSha256?: string,
): FeedSnapshotMetadata {
  const generatedAt = manifestSnapshot?.generatedAt || feed.generatedAt || "";
  const signature = manifestSnapshot?.signature || generatedAt;
  const verifiedContentSha256 =
    manifestSnapshot?.feedSha256 &&
    contentSha256 === manifestSnapshot.feedSha256
      ? contentSha256
      : undefined;

  return {
    generatedAt,
    signature,
    detailCacheNamespace: signature || generatedAt || "unknown",
    ...(verifiedContentSha256 ? { verifiedContentSha256 } : {}),
  };
}

export function parseFeedSnapshotMetadata(
  value: string | undefined,
): FeedSnapshotMetadata | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!isRecord(parsed)) return null;

    const generatedAt = optionalString(parsed.generatedAt);
    const signature = optionalString(parsed.signature);
    const detailCacheNamespace =
      optionalString(parsed.detailCacheNamespace) || signature || generatedAt;
    const verifiedContentSha256 = optionalString(parsed.verifiedContentSha256);
    if (!signature && !generatedAt) return null;

    return {
      generatedAt,
      signature,
      detailCacheNamespace: detailCacheNamespace || "unknown",
      ...(verifiedContentSha256 ? { verifiedContentSha256 } : {}),
    };
  } catch {
    return null;
  }
}

export function parseRegistryManifestSnapshot(
  value: string,
): RegistryManifestSnapshot | null {
  const parsed = JSON.parse(value) as unknown;
  if (!isRecord(parsed)) return null;

  const generatedAt = optionalString(parsed.generatedAt);
  const contracts = isRecord(parsed.artifactContracts)
    ? parsed.artifactContracts
    : {};
  const raycastContract = isRecord(contracts["raycast-index.json"])
    ? contracts["raycast-index.json"]
    : null;
  const feedSha256 = raycastContract
    ? optionalString(raycastContract.sha256)
    : "";

  if (!feedSha256 && !generatedAt) return null;
  return {
    generatedAt,
    signature: feedSha256 || generatedAt,
    ...(feedSha256 ? { feedSha256 } : {}),
  };
}

export function isRaycastDetail(value: unknown): value is RaycastDetail {
  const detail = value as Partial<RaycastDetail>;
  return (
    Boolean(detail) &&
    typeof detail.detailMarkdown === "string" &&
    (detail.copyText === undefined || typeof detail.copyText === "string") &&
    (detail.llmsUrl === undefined || typeof detail.llmsUrl === "string") &&
    (detail.installable === undefined ||
      typeof detail.installable === "boolean") &&
    (detail.hasInstallCommand === undefined ||
      typeof detail.hasInstallCommand === "boolean") &&
    (detail.hasConfigSnippet === undefined ||
      typeof detail.hasConfigSnippet === "boolean") &&
    (detail.mcpInstallTargets === undefined ||
      (Array.isArray(detail.mcpInstallTargets) &&
        detail.mcpInstallTargets.every((item) => typeof item === "string"))) &&
    (detail.installCommand === undefined ||
      typeof detail.installCommand === "string") &&
    (detail.configSnippet === undefined ||
      typeof detail.configSnippet === "string")
  );
}

export function parseDetail(value: string): RaycastDetail | null {
  const parsed = JSON.parse(value) as unknown;
  if (!isRaycastDetail(parsed)) return null;
  return {
    ...parsed,
    mcpInstallTargets: normalizeMcpInstallTargets(parsed.mcpInstallTargets),
  };
}

export function fallbackDetail(entry: RaycastEntry): RaycastDetail {
  return {
    copyText: entry.copyText,
    detailMarkdown: entry.detailMarkdown,
    installable: entry.installable,
    hasInstallCommand: entry.hasInstallCommand,
    hasConfigSnippet: entry.hasConfigSnippet,
    mcpInstallTargets: entry.mcpInstallTargets,
    installCommand: entry.installCommand,
    configSnippet: entry.configSnippet,
    safetyNotes: entry.safetyNotes,
    privacyNotes: entry.privacyNotes,
    trustSignals: entry.trustSignals,
  };
}

export function sortedCategoryOptions(
  entries: RaycastEntry[],
): CategoryOption[] {
  const categories = [...new Set(entries.map((entry) => entry.category))].sort(
    (left, right) => categoryLabel(left).localeCompare(categoryLabel(right)),
  );

  return [
    { value: "all", title: "All Categories" },
    { value: "favorites", title: "Favorites" },
    ...categories.map((category) => ({
      value: category,
      title: categoryLabel(category),
    })),
  ];
}

export function filterEntriesByCategory<
  T extends Pick<RaycastEntry, "category" | "slug">,
>(entries: T[], category: string, favorites: Set<string>) {
  if (category === "favorites") {
    return entries.filter((entry) => favorites.has(entryKey(entry)));
  }
  if (category === "all") return entries;
  return entries.filter((entry) => entry.category === category);
}

export function filterEntriesBySearchText(
  entries: RaycastEntry[],
  searchText: string,
) {
  const query = searchText.trim().toLowerCase();
  if (!query) return entries;
  const tokens = query
    .split(/[^a-z0-9+#.-]+/i)
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return [];

  return entries.filter((entry) => {
    const haystack = [
      entry.category,
      categoryLabel(entry.category),
      entry.title,
      entry.description,
      entry.author,
      entry.brandName,
      entry.brandDomain,
      entry.verificationStatus,
      entry.downloadTrust,
      ...(entry.tags ?? []),
      ...(entry.platformCompatibility ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return tokens.every((token) => haystack.includes(token));
  });
}

export function parseFavoriteKeys(raw: string | null | undefined) {
  if (!raw) return [];

  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) return [];
  return [...new Set(parsed.map(String))].sort();
}

export function serializeFavoriteKeys(favorites: Iterable<string>) {
  return JSON.stringify([...new Set(favorites)].sort());
}
