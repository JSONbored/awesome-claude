import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildSkillPlatformCompatibility,
  platformFeedSlug,
  SITE_URL,
} from "./platforms.js";
import { DEFAULT_REMOTE_MCP_URL } from "./endpoint-url.js";
import { packageName, packageVersion } from "./package-metadata.js";
import {
  formatZodError,
  jsonSchemaForTool,
  jsonSchemaForToolOutput,
  parseToolArguments,
} from "./schemas.js";
import {
  buildSubmissionUrlsFromSpec,
  getSubmissionExamplesFromSpec,
  getCategorySubmissionGuidanceFromSpec,
  prepareSubmissionDraftFromSpec,
  getSubmissionSchemaFromSpec,
  reviewSubmissionDraftFromSpec,
  searchDuplicateEntries,
  validateSubmissionDraftFromSpec,
} from "./submissions.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const defaultDataDir = path.join(repoRoot, "apps", "web", "public", "data");
const safePathPartPattern = /^[a-z0-9-]+$/;
const jsonMimeType = "application/json";

export const MCP_PUBLIC_POLICY = {
  apiKeyRequired: false,
  readOnly: true,
  createsIssues: false,
  createsPullRequests: false,
  publishesContent: false,
  writesLocalFiles: false,
  note: "HeyClaude MCP tools only read public registry artifacts or prepare maintainer-reviewed submission drafts.",
};

const platformAliases = new Map([
  ["claude", "Claude"],
  ["codex", "Codex"],
  ["openai", "Codex"],
  ["windsurf", "Windsurf"],
  ["gemini", "Gemini"],
  ["cursor", "Cursor"],
  ["cursor-rules", "Cursor"],
  ["generic-agents", "Generic AGENTS"],
  ["agents", "Generic AGENTS"],
  ["agents-context", "Generic AGENTS"],
  ["agents-md", "Generic AGENTS"],
]);

export const READ_ONLY_TOOL_NAMES = [
  "search_registry",
  "server_info",
  "list_category_entries",
  "get_recent_updates",
  "get_related_entries",
  "get_entry_detail",
  "get_copyable_asset",
  "compare_entries",
  "get_registry_stats",
  "get_client_setup",
  "get_compatibility",
  "get_install_guidance",
  "get_platform_adapter",
  "list_distribution_feeds",
  "get_submission_schema",
  "validate_submission_draft",
  "search_duplicate_entries",
  "build_submission_urls",
  "get_category_submission_guidance",
  "prepare_submission_draft",
  "get_submission_examples",
  "review_submission_draft",
];

export const TOOL_DEFINITIONS = [
  {
    name: "search_registry",
    description:
      "Search read-only HeyClaude registry entries by query, category, and skill platform compatibility.",
    inputSchema: jsonSchemaForTool("search_registry"),
    outputSchema: jsonSchemaForToolOutput("search_registry"),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "server_info",
    description:
      "Fetch read-only HeyClaude MCP package, registry, tool, and public rate-limit metadata.",
    inputSchema: jsonSchemaForTool("server_info"),
  },
  {
    name: "list_category_entries",
    description:
      "List read-only HeyClaude entries with bounded pagination and optional category, platform, tag, and query filters.",
    inputSchema: jsonSchemaForTool("list_category_entries"),
  },
  {
    name: "get_recent_updates",
    description:
      "List recently added or upstream-updated HeyClaude entries from generated registry metadata.",
    inputSchema: jsonSchemaForTool("get_recent_updates"),
  },
  {
    name: "get_related_entries",
    description:
      "Fetch read-only related HeyClaude entries based on category, tags, platforms, keywords, and source metadata.",
    inputSchema: jsonSchemaForTool("get_related_entries"),
  },
  {
    name: "get_entry_detail",
    description:
      "Fetch a read-only HeyClaude registry entry detail payload by category and slug.",
    inputSchema: jsonSchemaForTool("get_entry_detail"),
  },
  {
    name: "get_copyable_asset",
    description:
      "Fetch the category-aware copy/install asset for a HeyClaude entry without writing local files.",
    inputSchema: jsonSchemaForTool("get_copyable_asset"),
  },
  {
    name: "compare_entries",
    description:
      "Compare 2-5 read-only HeyClaude entries by fit, category, platforms, source metadata, and install complexity.",
    inputSchema: jsonSchemaForTool("compare_entries"),
  },
  {
    name: "get_registry_stats",
    description:
      "Fetch aggregate read-only registry stats, freshness, category counts, and real source-signal coverage.",
    inputSchema: jsonSchemaForTool("get_registry_stats"),
  },
  {
    name: "get_client_setup",
    description:
      "Fetch read-only MCP client setup snippets for Codex, Claude Desktop, Cursor, Windsurf, or remote HTTP clients.",
    inputSchema: jsonSchemaForTool("get_client_setup"),
  },
  {
    name: "get_compatibility",
    description:
      "Fetch platform compatibility metadata for a HeyClaude skill entry.",
    inputSchema: jsonSchemaForTool("get_compatibility"),
  },
  {
    name: "get_install_guidance",
    description:
      "Fetch read-only install, config, usage, and package guidance for a HeyClaude entry.",
    inputSchema: jsonSchemaForTool("get_install_guidance"),
  },
  {
    name: "get_platform_adapter",
    description:
      "Fetch generated read-only platform adapter content, currently Cursor rule adapters for skill packages.",
    inputSchema: jsonSchemaForTool("get_platform_adapter"),
  },
  {
    name: "list_distribution_feeds",
    description:
      "List read-only HeyClaude registry feeds, category feeds, platform feeds, and artifact locations.",
    inputSchema: jsonSchemaForTool("list_distribution_feeds"),
  },
  {
    name: "get_submission_schema",
    description:
      "Fetch read-only HeyClaude submission schemas and GitHub issue template fields by category.",
    inputSchema: jsonSchemaForTool("get_submission_schema"),
  },
  {
    name: "validate_submission_draft",
    description:
      "Validate a HeyClaude content submission draft locally without creating GitHub issues or publishing content.",
    inputSchema: jsonSchemaForTool("validate_submission_draft"),
  },
  {
    name: "search_duplicate_entries",
    description:
      "Search generated registry artifacts for likely duplicate entries before a user opens a submission issue.",
    inputSchema: jsonSchemaForTool("search_duplicate_entries"),
  },
  {
    name: "build_submission_urls",
    description:
      "Build prefilled HeyClaude submit and GitHub issue URLs for a validated submission draft without making write calls.",
    inputSchema: jsonSchemaForTool("build_submission_urls"),
  },
  {
    name: "get_category_submission_guidance",
    description:
      "Fetch category-specific HeyClaude contribution guidance, required fields, and review expectations.",
    inputSchema: jsonSchemaForTool("get_category_submission_guidance"),
  },
  {
    name: "prepare_submission_draft",
    description:
      "Build a read-only maintainer-reviewed HeyClaude submission draft with canonical issue text and URLs.",
    inputSchema: jsonSchemaForTool("prepare_submission_draft"),
  },
  {
    name: "get_submission_examples",
    description:
      "Fetch read-only category examples and templates for faster, more accurate HeyClaude submissions.",
    inputSchema: jsonSchemaForTool("get_submission_examples"),
  },
  {
    name: "review_submission_draft",
    description:
      "Review a HeyClaude submission draft locally for schema errors, duplicate risk, and maintainer checklist items without writing to GitHub.",
    inputSchema: jsonSchemaForTool("review_submission_draft"),
  },
];

for (const tool of TOOL_DEFINITIONS) {
  tool.outputSchema ||= jsonSchemaForToolOutput(tool.name);
  tool.annotations ||= {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  };
}

function dataDirFromOptions(options = {}) {
  return options.dataDir || process.env.HEYCLAUDE_DATA_DIR || defaultDataDir;
}

function isSafePathPart(value) {
  return safePathPartPattern.test(String(value || ""));
}

function safeRelativePath(relativePath) {
  const parts = String(relativePath || "").split("/");
  if (
    !parts.length ||
    parts.some((part) => !part || part === "." || part === "..")
  ) {
    throw new Error(`Unsafe registry artifact path: ${relativePath}`);
  }
  return parts.join(path.sep);
}

async function readTextArtifact(relativePath, options = {}) {
  if (typeof options.readTextArtifact === "function") {
    return options.readTextArtifact(relativePath);
  }

  const dataDir = dataDirFromOptions(options);
  const filePath = path.join(dataDir, safeRelativePath(relativePath));
  return readFile(filePath, "utf8");
}

async function readJsonArtifact(relativePath, options = {}) {
  if (typeof options.readJsonArtifact === "function") {
    return options.readJsonArtifact(relativePath);
  }

  return JSON.parse(await readTextArtifact(relativePath, options));
}

function unwrapEntries(payload) {
  if (!payload || !Array.isArray(payload.entries)) {
    throw new Error("Expected registry artifact envelope with entries array.");
  }
  return payload.entries;
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function normalizeLimit(value, fallback = 10) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(1, Math.min(25, Math.trunc(numeric)));
}

function normalizeOffset(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(5000, Math.trunc(numeric)));
}

function normalizePlatform(value) {
  const normalized = normalizeText(value).replace(/[^a-z0-9]+/g, "-");
  if (!normalized) return "";
  return platformAliases.get(normalized) || String(value || "").trim();
}

function entryMatchesQuery(entry, query) {
  if (!query) return true;
  const haystack = [
    entry.title,
    entry.description,
    entry.cardDescription,
    entry.category,
    entry.slug,
    entry.author,
    entry.submittedBy,
    entry.brandName,
    entry.brandDomain,
    ...(entry.tags || []),
    ...(entry.keywords || []),
  ]
    .map(normalizeText)
    .join(" ");
  return haystack.includes(query);
}

function entryMatchesPlatform(entry, platform) {
  if (!platform) return true;
  return (entry.platforms || []).some((candidate) => candidate === platform);
}

function entryMatchesTag(entry, tag) {
  if (!tag) return true;
  return (entry.tags || []).some(
    (candidate) => normalizeText(candidate) === tag,
  );
}

function toSearchResult(entry) {
  return {
    key: `${entry.category}:${entry.slug}`,
    category: entry.category,
    slug: entry.slug,
    title: entry.title,
    description: entry.description,
    tags: entry.tags || [],
    platforms: entry.platforms || [],
    brandName: entry.brandName || "",
    brandDomain: entry.brandDomain || "",
    submittedBy: entry.submittedBy || "",
    claimStatus: entry.claimStatus || "",
    url: entry.url || `${SITE_URL}/${entry.category}/${entry.slug}`,
    canonicalUrl:
      entry.canonicalUrl ||
      entry.url ||
      `${SITE_URL}/${entry.category}/${entry.slug}`,
  };
}

function toEntrySummary(entry) {
  return {
    ...toSearchResult(entry),
    dateAdded: entry.dateAdded || "",
    repoUpdatedAt: entry.repoUpdatedAt || null,
    verificationStatus: entry.verificationStatus || "",
    installable: Boolean(entry.installable),
    supportLevels: entry.supportLevels || [],
  };
}

function entryUpdatedAt(entry) {
  return String(
    entry.repoUpdatedAt || entry.updatedAt || entry.dateAdded || "",
  );
}

function sourceHost(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  try {
    return new URL(text).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function entrySourceHosts(entry) {
  return [
    entry.documentationUrl,
    entry.repoUrl,
    entry.url,
    entry.canonicalUrl,
    entry.llmsUrl,
    entry.apiUrl,
  ]
    .map(sourceHost)
    .filter(Boolean);
}

function intersection(left = [], right = [], normalize = normalizeText) {
  const rightValues = new Set((right || []).map(normalize).filter(Boolean));
  return (left || [])
    .map(normalize)
    .filter((value, index, values) => value && values.indexOf(value) === index)
    .filter((value) => rightValues.has(value));
}

function unique(values = []) {
  return values.filter(
    (value, index, list) => value && list.indexOf(value) === index,
  );
}

function normalizeDateFloor(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const timestamp = Date.parse(text);
  if (!Number.isFinite(timestamp)) return "";
  return new Date(timestamp).toISOString().slice(0, 10);
}

function withPublicPolicy(result) {
  if (!result || typeof result !== "object" || Array.isArray(result)) {
    return result;
  }
  if (result.policy) return result;
  return { ...result, policy: MCP_PUBLIC_POLICY };
}

function sourceSummary(entry) {
  return {
    repoUrl: entry.repoUrl || entry.githubUrl || "",
    documentationUrl: entry.documentationUrl || "",
    downloadUrl: entry.downloadUrl || "",
    sourceHosts: unique(entrySourceHosts(entry)),
    githubStars:
      typeof entry.githubStars === "number" ? entry.githubStars : null,
    githubForks:
      typeof entry.githubForks === "number" ? entry.githubForks : null,
    repoUpdatedAt: entry.repoUpdatedAt || null,
    downloadTrust: entry.downloadTrust || null,
  };
}

function contentAsset(type, label, content, format = "markdown") {
  const text =
    content && typeof content === "object"
      ? JSON.stringify(content, null, 2)
      : String(content || "").trim();
  if (!text) return null;
  return {
    type,
    label,
    format,
    content: text,
    length: text.length,
  };
}

function categoryPrimaryAsset(entry) {
  const assets = [
    contentAsset(
      "full_content",
      "Full usable entry content",
      entry.fullCopyableContent || entry.copySnippet || entry.body,
    ),
    contentAsset(
      "install_command",
      "Install command",
      entry.installCommand,
      "shell",
    ),
    contentAsset(
      "config_snippet",
      "Configuration snippet",
      entry.configSnippet,
      "text",
    ),
    contentAsset("script", "Script body", entry.scriptBody, "text"),
    contentAsset(
      "command_syntax",
      "Command syntax",
      entry.commandSyntax,
      "text",
    ),
    contentAsset("usage", "Usage snippet", entry.usageSnippet, "markdown"),
    contentAsset("items", "Collection items", entry.items, "json"),
  ].filter(Boolean);

  const preferredByCategory = {
    agents: ["full_content", "usage"],
    rules: ["full_content", "script", "usage"],
    hooks: ["config_snippet", "script", "install_command", "usage"],
    mcp: ["config_snippet", "install_command", "usage"],
    skills: ["install_command", "full_content", "usage"],
    statuslines: ["config_snippet", "script", "full_content", "usage"],
    commands: ["command_syntax", "install_command", "full_content", "usage"],
    collections: ["items", "full_content", "usage"],
    guides: ["full_content", "usage"],
  };
  const preferred = preferredByCategory[entry.category] || ["full_content"];
  return (
    preferred
      .map((type) => assets.find((asset) => asset.type === type))
      .find(Boolean) ||
    assets[0] ||
    null
  );
}

function entryInstallComplexity(entry) {
  const pieces = [
    entry.installCommand,
    entry.configSnippet,
    entry.downloadUrl,
    entry.prerequisites,
  ].filter((value) => String(value || "").trim());
  if (pieces.length >= 3) return "higher";
  if (pieces.length === 2) return "medium";
  if (pieces.length === 1) return "low";
  return "unknown";
}

async function readEntry(category, slug, options = {}) {
  if (!isSafePathPart(category) || !isSafePathPart(slug)) {
    return null;
  }
  try {
    const payload = await readJsonArtifact(
      `entries/${category}/${slug}.json`,
      options,
    );
    return payload?.entry || null;
  } catch {
    return null;
  }
}

function notFound(message) {
  return { ok: false, error: { code: "not_found", message } };
}

function invalid(message) {
  return { ok: false, error: { code: "invalid_request", message } };
}

function invalidWithDetails(message, details) {
  return { ok: false, error: { code: "invalid_request", message, details } };
}

export async function searchRegistry(args = {}, options = {}) {
  const query = normalizeText(args.query);
  const category = normalizeText(args.category);
  const platform = normalizePlatform(args.platform);
  const limit = normalizeLimit(args.limit);
  const searchIndex = unwrapEntries(
    await readJsonArtifact("search-index.json", options),
  );

  const entries = searchIndex
    .filter((entry) => !category || entry.category === category)
    .filter((entry) => entryMatchesPlatform(entry, platform))
    .filter((entry) => entryMatchesQuery(entry, query))
    .slice(0, limit)
    .map(toSearchResult);

  return {
    ok: true,
    count: entries.length,
    query: args.query || "",
    category: category || "",
    platform: platform || "",
    entries,
  };
}

export async function getServerInfo(args = {}, options = {}) {
  const manifest = await readJsonArtifact("registry-manifest.json", options);
  return {
    ok: true,
    package: {
      name: packageName,
      version: packageVersion,
    },
    endpoint: {
      url: DEFAULT_REMOTE_MCP_URL,
      auth: "none",
      transport: "streamable-http",
      stdioBridge: "npx -y @heyclaude/mcp",
      requestBodyLimitBytes: 64 * 1024,
      rateLimit: {
        scope: "mcp-streamable",
        limit: 60,
        windowSeconds: 60,
        binding: "API_MCP_RATE_LIMIT",
        note: "Cloudflare enforces the durable production limit when the binding is available; local/dev falls back to an in-process limiter.",
      },
    },
    registry: {
      schemaVersion: manifest.schemaVersion,
      generatedAt: manifest.generatedAt,
      totalEntries: manifest.totalEntries,
      categories: manifest.categories || {},
    },
    tools: READ_ONLY_TOOL_NAMES,
    policy: MCP_PUBLIC_POLICY,
  };
}

export async function listCategoryEntries(args = {}, options = {}) {
  const category = normalizeText(args.category);
  const platform = normalizePlatform(args.platform);
  const tag = normalizeText(args.tag);
  const query = normalizeText(args.query);
  const offset = normalizeOffset(args.offset);
  const limit = normalizeLimit(args.limit, 20);
  const searchIndex = unwrapEntries(
    await readJsonArtifact("search-index.json", options),
  );

  const entries = searchIndex
    .filter((entry) => !category || entry.category === category)
    .filter((entry) => entryMatchesPlatform(entry, platform))
    .filter((entry) => entryMatchesTag(entry, tag))
    .filter((entry) => entryMatchesQuery(entry, query));
  const page = entries.slice(offset, offset + limit).map(toEntrySummary);

  return {
    ok: true,
    category: category || "",
    platform: platform || "",
    tag: tag || "",
    query: args.query || "",
    total: entries.length,
    count: page.length,
    offset,
    limit,
    nextOffset: offset + limit < entries.length ? offset + limit : null,
    entries: page,
  };
}

export async function getRecentUpdates(args = {}, options = {}) {
  const category = normalizeText(args.category);
  const since = args.since ? normalizeDateFloor(args.since) : "";
  if (args.since && !since) {
    return invalid("since must be a parseable date such as 2026-05-01.");
  }
  const limit = normalizeLimit(args.limit, 10);
  const searchIndex = unwrapEntries(
    await readJsonArtifact("search-index.json", options),
  );
  const entries = searchIndex
    .filter((entry) => !category || entry.category === category)
    .filter((entry) => !since || entryUpdatedAt(entry) >= since)
    .slice()
    .sort((left, right) => {
      const dateCompare = entryUpdatedAt(right).localeCompare(
        entryUpdatedAt(left),
      );
      if (dateCompare !== 0) return dateCompare;
      return String(left.title || "").localeCompare(String(right.title || ""));
    })
    .slice(0, limit)
    .map((entry) => ({
      ...toEntrySummary(entry),
      updatedAt: entryUpdatedAt(entry),
      updateKind: entry.repoUpdatedAt ? "upstream_update" : "added",
    }));

  return {
    ok: true,
    category: category || "",
    since,
    count: entries.length,
    entries,
  };
}

function scoreRelatedEntry(target, candidate) {
  if (
    target.category === candidate.category &&
    target.slug === candidate.slug
  ) {
    return null;
  }

  const sharedTags = intersection(target.tags, candidate.tags);
  const sharedKeywords = intersection(target.keywords, candidate.keywords);
  const sharedPlatforms = intersection(
    target.platforms,
    candidate.platforms,
    (value) => String(value || ""),
  );
  const sharedHosts = intersection(
    entrySourceHosts(target),
    entrySourceHosts(candidate),
    (value) => String(value || ""),
  );
  const score =
    (target.category === candidate.category ? 4 : 0) +
    sharedTags.length * 3 +
    Math.min(sharedKeywords.length, 6) +
    sharedPlatforms.length +
    sharedHosts.length * 2;

  if (score <= 0) return null;
  return {
    score,
    reasons: [
      ...(target.category === candidate.category ? ["same_category"] : []),
      ...sharedTags.map((tag) => `tag:${tag}`),
      ...sharedPlatforms.map((platform) => `platform:${platform}`),
      ...sharedHosts.map((host) => `source:${host}`),
    ],
  };
}

export async function getRelatedEntries(args = {}, options = {}) {
  const category = normalizeText(args.category);
  const slug = normalizeText(args.slug);
  const limit = normalizeLimit(args.limit, 8);
  const searchIndex = unwrapEntries(
    await readJsonArtifact("search-index.json", options),
  );
  const target = searchIndex.find(
    (entry) => entry.category === category && entry.slug === slug,
  );
  if (!target) {
    return notFound(`No HeyClaude entry found for ${category}/${slug}.`);
  }

  const entries = searchIndex
    .map((entry) => {
      const related = scoreRelatedEntry(target, entry);
      return related ? { entry, related } : null;
    })
    .filter(Boolean)
    .sort((left, right) => {
      const scoreCompare = right.related.score - left.related.score;
      if (scoreCompare !== 0) return scoreCompare;
      return entryUpdatedAt(right.entry).localeCompare(
        entryUpdatedAt(left.entry),
      );
    })
    .slice(0, limit)
    .map(({ entry, related }) => ({
      ...toEntrySummary(entry),
      relatedScore: related.score,
      relatedReasons: related.reasons,
    }));

  return {
    ok: true,
    key: `${target.category}:${target.slug}`,
    count: entries.length,
    entries,
  };
}

export async function getEntryDetail(args = {}, options = {}) {
  const category = normalizeText(args.category);
  const slug = normalizeText(args.slug);
  if (!category || !slug) {
    return invalid("category and slug are required.");
  }

  const entry = await readEntry(category, slug, options);
  if (!entry) {
    return notFound(`No HeyClaude entry found for ${category}/${slug}.`);
  }

  return {
    ok: true,
    key: `${entry.category}:${entry.slug}`,
    canonicalUrl: `${SITE_URL}/${entry.category}/${entry.slug}`,
    entry,
  };
}

export async function getCopyableAsset(args = {}, options = {}) {
  const category = normalizeText(args.category);
  const slug = normalizeText(args.slug);
  const platform = normalizePlatform(args.platform);
  if (!category || !slug) {
    return invalid("category and slug are required.");
  }

  const entry = await readEntry(category, slug, options);
  if (!entry) {
    return notFound(`No HeyClaude entry found for ${category}/${slug}.`);
  }

  const primary = categoryPrimaryAsset(entry);
  const assets = [
    contentAsset(
      "full_content",
      "Full usable entry content",
      entry.fullCopyableContent || entry.copySnippet || entry.body,
    ),
    contentAsset(
      "install_command",
      "Install command",
      entry.installCommand,
      "shell",
    ),
    contentAsset(
      "config_snippet",
      "Configuration snippet",
      entry.configSnippet,
      "text",
    ),
    contentAsset("script", "Script body", entry.scriptBody, "text"),
    contentAsset(
      "command_syntax",
      "Command syntax",
      entry.commandSyntax,
      "text",
    ),
    contentAsset("usage", "Usage snippet", entry.usageSnippet, "markdown"),
    contentAsset("items", "Collection items", entry.items, "json"),
  ].filter(Boolean);
  const compatibility = buildSkillPlatformCompatibility(entry);

  return {
    ok: true,
    key: `${entry.category}:${entry.slug}`,
    category: entry.category,
    slug: entry.slug,
    title: entry.title,
    canonicalUrl: `${SITE_URL}/${entry.category}/${entry.slug}`,
    platform: platform || "",
    primaryAsset: primary,
    assets,
    installCommand: entry.installCommand || "",
    configSnippet: entry.configSnippet || "",
    usageSnippet: entry.usageSnippet || "",
    downloadUrl: entry.downloadUrl || "",
    platformCompatibility: compatibility,
    source: sourceSummary(entry),
  };
}

export async function compareEntries(args = {}, options = {}) {
  const platform = normalizePlatform(args.platform);
  const entries = [];
  for (const target of args.entries || []) {
    const category = normalizeText(target.category);
    const slug = normalizeText(target.slug);
    const entry = await readEntry(category, slug, options);
    if (!entry) {
      return notFound(`No HeyClaude entry found for ${category}/${slug}.`);
    }
    entries.push(entry);
  }

  const compared = entries.map((entry) => {
    const compatibility = buildSkillPlatformCompatibility(entry);
    const selectedCompatibility = platform
      ? compatibility.find((item) => item.platform === platform) || null
      : null;
    return {
      key: `${entry.category}:${entry.slug}`,
      category: entry.category,
      slug: entry.slug,
      title: entry.title,
      description: entry.description,
      canonicalUrl: `${SITE_URL}/${entry.category}/${entry.slug}`,
      tags: entry.tags || [],
      platforms: entry.platforms || [],
      selectedCompatibility,
      installComplexity: entryInstallComplexity(entry),
      copyableAssetTypes: [
        categoryPrimaryAsset(entry)?.type,
        entry.configSnippet ? "config_snippet" : "",
        entry.installCommand ? "install_command" : "",
        entry.scriptBody ? "script" : "",
      ].filter(Boolean),
      source: sourceSummary(entry),
    };
  });

  return {
    ok: true,
    platform: platform || "",
    count: compared.length,
    sharedTags: intersection(
      compared[0]?.tags || [],
      compared.slice(1).flatMap((entry) => entry.tags || []),
    ),
    entries: compared,
    comparisonNotes: [
      "Prefer exact category fit before source popularity.",
      "Treat GitHub stars/forks as source signals only when present; absence is not a negative ranking.",
      "Install complexity is derived from available install/config/download/prerequisite metadata.",
    ],
  };
}

export async function getRegistryStats(args = {}, options = {}) {
  const [manifest, searchIndexPayload] = await Promise.all([
    readJsonArtifact("registry-manifest.json", options),
    readJsonArtifact("search-index.json", options),
  ]);
  const entries = unwrapEntries(searchIndexPayload);
  const platformCounts = new Map();
  const tagCounts = new Map();
  for (const entry of entries) {
    for (const platform of entry.platforms || []) {
      platformCounts.set(platform, (platformCounts.get(platform) || 0) + 1);
    }
    for (const tag of entry.tags || []) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }

  return {
    ok: true,
    package: {
      name: packageName,
      version: packageVersion,
    },
    registry: {
      schemaVersion: manifest.schemaVersion,
      generatedAt: manifest.generatedAt,
      totalEntries: manifest.totalEntries,
      categories: manifest.categories || {},
    },
    freshness: {
      entriesWithRepoUpdatedAt: entries.filter((entry) => entry.repoUpdatedAt)
        .length,
      entriesAddedLast30Days: entries.filter((entry) => {
        const added = Date.parse(entry.dateAdded || "");
        return (
          Number.isFinite(added) &&
          Date.now() - added <= 30 * 24 * 60 * 60 * 1000
        );
      }).length,
    },
    sourceSignals: {
      entriesWithGithubStats: entries.filter(
        (entry) => typeof entry.githubStars === "number",
      ).length,
      installableEntries: entries.filter((entry) => entry.installable).length,
    },
    platforms: Object.fromEntries(
      [...platformCounts.entries()].sort((left, right) =>
        left[0].localeCompare(right[0]),
      ),
    ),
    topTags: [...tagCounts.entries()]
      .sort(
        (left, right) => right[1] - left[1] || left[0].localeCompare(right[0]),
      )
      .slice(0, 20)
      .map(([tag, count]) => ({ tag, count })),
  };
}

export async function getClientSetup(args = {}) {
  const endpointUrl = args.endpointUrl || DEFAULT_REMOTE_MCP_URL;
  const snippets = {
    codex: {
      label: "Codex stdio bridge",
      config: {
        mcpServers: {
          heyclaude: {
            command: "npx",
            args: ["-y", "@heyclaude/mcp"],
          },
        },
      },
    },
    "claude-desktop": {
      label: "Claude Desktop stdio bridge",
      config: {
        mcpServers: {
          heyclaude: {
            command: "npx",
            args: ["-y", "@heyclaude/mcp"],
          },
        },
      },
    },
    cursor: {
      label: "Cursor remote MCP",
      config: {
        mcpServers: {
          heyclaude: {
            url: endpointUrl,
          },
        },
      },
    },
    windsurf: {
      label: "Windsurf remote MCP",
      config: {
        mcpServers: {
          heyclaude: {
            serverUrl: endpointUrl,
          },
        },
      },
    },
    "remote-http": {
      label: "Streamable HTTP endpoint",
      endpointUrl,
      headers: {
        accept: "application/json, text/event-stream",
        "content-type": "application/json",
      },
    },
  };
  const client = args.client || "";
  return {
    ok: true,
    endpointUrl,
    apiKeyRequired: false,
    selectedClient: client,
    snippets: client ? { [client]: snippets[client] } : snippets,
    notes: [
      "The public endpoint is read-only and does not need an API key.",
      "Submission tools prepare maintainer-reviewed drafts; they do not open GitHub issues.",
      "Use --url only when testing a custom preview or deployment.",
    ],
  };
}

export const RESOURCE_TEMPLATES = [
  {
    uriTemplate: "heyclaude://entry/{category}/{slug}",
    name: "HeyClaude entry detail",
    title: "HeyClaude entry detail",
    description:
      "Read a single generated HeyClaude entry detail artifact as JSON.",
    mimeType: jsonMimeType,
  },
  {
    uriTemplate: "heyclaude://category/{category}",
    name: "HeyClaude category entries",
    title: "HeyClaude category entries",
    description:
      "Read generated summary entries for one HeyClaude category as JSON.",
    mimeType: jsonMimeType,
  },
];

export const PROMPT_DEFINITIONS = [
  {
    name: "find_best_asset",
    title: "Find the best Claude asset",
    description:
      "Guide a client through searching, comparing, and recommending HeyClaude entries for a use case.",
    arguments: [
      {
        name: "use_case",
        description: "The task, workflow, or problem the user wants to solve.",
        required: true,
      },
      {
        name: "category",
        description: "Optional HeyClaude category to constrain discovery.",
      },
      {
        name: "platform",
        description:
          "Optional client/platform such as Claude, Codex, Cursor, or Windsurf.",
      },
    ],
  },
  {
    name: "prepare_submission",
    title: "Prepare a HeyClaude submission",
    description:
      "Guide a user through drafting a maintainer-reviewed HeyClaude submission without opening an issue automatically.",
    arguments: [
      { name: "category", description: "Submission category.", required: true },
      { name: "name", description: "Submission name or title." },
      {
        name: "source_url",
        description: "Primary source, docs, package, or repo URL.",
      },
    ],
  },
  {
    name: "review_submission_before_issue",
    title: "Review submission before opening issue",
    description:
      "Check a draft for schema gaps, duplicate risk, source review, and maintainer checklist items.",
    arguments: [
      {
        name: "draft",
        description: "A concise description or JSON-shaped draft fields.",
        required: true,
      },
    ],
  },
  {
    name: "install_asset_safely",
    title: "Install a HeyClaude asset safely",
    description:
      "Guide installation/use of one entry while keeping source and secret-handling checks explicit.",
    arguments: [
      { name: "category", description: "Entry category.", required: true },
      { name: "slug", description: "Entry slug.", required: true },
      { name: "platform", description: "Optional target client/platform." },
    ],
  },
];

export async function listRegistryResources(args = {}, options = {}) {
  const manifest = await readJsonArtifact("registry-manifest.json", options);
  const categories = Object.keys(manifest.categories || {}).sort();
  return {
    resources: [
      {
        uri: "heyclaude://feeds/directory",
        name: "HeyClaude directory index",
        title: "HeyClaude directory index",
        description: "Generated public directory index artifact.",
        mimeType: jsonMimeType,
      },
      ...categories.map((category) => ({
        uri: `heyclaude://category/${category}`,
        name: `HeyClaude ${category} category`,
        title: `HeyClaude ${category}`,
        description: `Generated public ${category} category summary entries.`,
        mimeType: jsonMimeType,
      })),
    ],
  };
}

export function listRegistryResourceTemplates() {
  return {
    resourceTemplates: RESOURCE_TEMPLATES,
  };
}

export async function readRegistryResource(args = {}, options = {}) {
  const uri = String(args.uri || "");
  const resourcePayload = (payload) => ({
    contents: [
      {
        uri: uri || "heyclaude://error",
        mimeType: jsonMimeType,
        text: JSON.stringify(withPublicPolicy(payload), null, 2),
      },
    ],
  });
  let parsed;
  try {
    parsed = new URL(uri);
  } catch {
    return resourcePayload(
      notFound(`Unsupported HeyClaude resource URI: ${uri}`),
    );
  }
  if (parsed.protocol !== "heyclaude:") {
    return resourcePayload(
      notFound(`Unsupported HeyClaude resource URI: ${uri}`),
    );
  }

  const parts = parsed.pathname.split("/").filter(Boolean);
  let payload;
  if (parsed.hostname === "feeds" && parts[0] === "directory") {
    payload = await readJsonArtifact("directory-index.json", options);
  } else if (parsed.hostname === "category" && parts.length === 1) {
    const category = normalizeText(parts[0]);
    if (!isSafePathPart(category)) {
      return resourcePayload(
        invalid("Category resource path is not slug-safe."),
      );
    }
    const entries = unwrapEntries(
      await readJsonArtifact("search-index.json", options),
    )
      .filter((entry) => entry.category === category)
      .map(toEntrySummary);
    payload = {
      ok: true,
      category,
      total: entries.length,
      entries,
    };
  } else if (parsed.hostname === "entry" && parts.length === 2) {
    const [category, slug] = parts.map(normalizeText);
    const detail = await getEntryDetail({ category, slug }, options);
    payload = detail;
  } else {
    return resourcePayload(
      notFound(`Unsupported HeyClaude resource URI: ${uri}`),
    );
  }

  return resourcePayload(payload);
}

function promptArgument(args, name) {
  return String(args?.[name] || "").trim();
}

export function listRegistryPrompts() {
  return {
    prompts: PROMPT_DEFINITIONS,
  };
}

export function getRegistryPrompt(args = {}) {
  const name = String(args.name || "");
  const prompt = PROMPT_DEFINITIONS.find(
    (candidate) => candidate.name === name,
  );
  if (!prompt) {
    return {
      description: "Unknown HeyClaude MCP prompt.",
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Unknown HeyClaude MCP prompt: ${name}`,
          },
        },
      ],
    };
  }
  const values = args.arguments || {};
  const useCase = promptArgument(values, "use_case");
  const category = promptArgument(values, "category");
  const platform = promptArgument(values, "platform");
  const slug = promptArgument(values, "slug");
  const sourceUrl = promptArgument(values, "source_url");
  const draft = promptArgument(values, "draft");

  const promptTextByName = {
    find_best_asset: `Find the best HeyClaude asset for this use case: ${useCase || "(not provided)"}.

Use the read-only HeyClaude MCP tools. Start with search_registry or list_category_entries${category ? ` in category ${category}` : ""}${platform ? ` for platform ${platform}` : ""}. Compare credible candidates with compare_entries, inspect details with get_entry_detail, and cite exact category/slug pairs. Do not invent popularity metrics when source stats are absent.`,
    prepare_submission: `Prepare a HeyClaude submission draft${category ? ` for category ${category}` : ""}${promptArgument(values, "name") ? ` named ${promptArgument(values, "name")}` : ""}${sourceUrl ? ` from ${sourceUrl}` : ""}.

Use get_submission_schema, get_submission_examples, prepare_submission_draft, review_submission_draft, and search_duplicate_entries. Return missing fields and the canonical issue draft URL/body. Do not create a GitHub issue or publish content.`,
    review_submission_before_issue: `Review this HeyClaude submission draft before an issue is opened:

${draft || "(draft not provided)"}

Use review_submission_draft and search_duplicate_entries where structured fields are available. Treat schema-valid as not publish-valid, call out source-review needs, and keep the result maintainer-reviewed.`,
    install_asset_safely: `Help install or use the HeyClaude entry ${category || "(category)"}/${slug || "(slug)"}${platform ? ` for ${platform}` : ""}.

Use get_install_guidance and get_copyable_asset. Include source links, config/install text exactly as returned, and secret-handling cautions where relevant. Do not write local files or claim the install was completed.`,
  };

  return {
    description: prompt.description,
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: promptTextByName[name],
        },
      },
    ],
  };
}

export async function getCompatibility(args = {}, options = {}) {
  const category = normalizeText(args.category || "skills");
  const slug = normalizeText(args.slug);
  if (!slug) return invalid("slug is required.");

  const entry = await readEntry(category, slug, options);
  if (!entry) {
    return notFound(`No HeyClaude entry found for ${category}/${slug}.`);
  }

  return {
    ok: true,
    key: `${entry.category}:${entry.slug}`,
    category: entry.category,
    slug: entry.slug,
    platformCompatibility: buildSkillPlatformCompatibility(entry),
  };
}

export async function getInstallGuidance(args = {}, options = {}) {
  const category = normalizeText(args.category);
  const slug = normalizeText(args.slug);
  const platform = normalizePlatform(args.platform);
  if (!category || !slug) {
    return invalid("category and slug are required.");
  }

  const entry = await readEntry(category, slug, options);
  if (!entry) {
    return notFound(`No HeyClaude entry found for ${category}/${slug}.`);
  }

  const compatibility = buildSkillPlatformCompatibility(entry);
  const selectedCompatibility = platform
    ? compatibility.find((item) => item.platform === platform) || null
    : null;

  return {
    ok: true,
    key: `${entry.category}:${entry.slug}`,
    canonicalUrl: `${SITE_URL}/${entry.category}/${entry.slug}`,
    title: entry.title,
    installCommand: entry.installCommand || entry.commandSyntax || "",
    configSnippet: entry.configSnippet || "",
    usageSnippet: entry.usageSnippet || "",
    downloadUrl: entry.downloadUrl || "",
    documentationUrl: entry.documentationUrl || "",
    repoUrl: entry.repoUrl || "",
    platform: platform || "",
    selectedCompatibility,
    platformCompatibility: compatibility,
  };
}

export async function getPlatformAdapter(args = {}, options = {}) {
  const slug = normalizeText(args.slug);
  const platform = normalizePlatform(args.platform || "cursor");
  if (!slug) return invalid("slug is required.");

  if (platform !== "Cursor") {
    return {
      ok: true,
      platform,
      slug,
      adapterAvailable: false,
      message:
        "Native Agent Skill platforms use the SKILL.md package directly; generated adapters are currently provided for Cursor rules.",
    };
  }

  const entry = await readEntry("skills", slug, options);
  if (!entry) {
    return notFound(`No HeyClaude skill found for ${slug}.`);
  }

  try {
    const adapter = await readTextArtifact(
      `skill-adapters/cursor/${slug}.mdc`,
      options,
    );
    return {
      ok: true,
      platform: "Cursor",
      slug,
      adapterAvailable: true,
      adapterPath: `/data/skill-adapters/cursor/${slug}.mdc`,
      content: adapter,
    };
  } catch {
    return notFound(`No Cursor adapter generated for ${slug}.`);
  }
}

export async function listDistributionFeeds(args = {}, options = {}) {
  const [manifest, feedIndex] = await Promise.all([
    readJsonArtifact("registry-manifest.json", options),
    readJsonArtifact("feeds/index.json", options),
  ]);

  return {
    ok: true,
    schemaVersion: manifest.schemaVersion,
    generatedAt: manifest.generatedAt,
    artifacts: manifest.artifacts,
    categories: feedIndex.categories || [],
    platforms: (feedIndex.platforms || []).map((platform) => ({
      ...platform,
      feedSlug: platformFeedSlug(platform.platform),
    })),
  };
}

async function readSubmissionSpec(options = {}) {
  return readJsonArtifact("submission-spec.json", options);
}

export async function getSubmissionSchema(args = {}, options = {}) {
  return getSubmissionSchemaFromSpec(await readSubmissionSpec(options), args);
}

export async function validateSubmissionDraft(args = {}, options = {}) {
  return validateSubmissionDraftFromSpec(
    await readSubmissionSpec(options),
    args,
  );
}

export async function searchDuplicateRegistryEntries(args = {}, options = {}) {
  const searchIndex = unwrapEntries(
    await readJsonArtifact("search-index.json", options),
  );
  return searchDuplicateEntries(searchIndex, args);
}

export async function buildSubmissionUrls(args = {}, options = {}) {
  return buildSubmissionUrlsFromSpec(await readSubmissionSpec(options), args);
}

export async function getCategorySubmissionGuidance(args = {}, options = {}) {
  return getCategorySubmissionGuidanceFromSpec(
    await readSubmissionSpec(options),
    args,
  );
}

export async function prepareSubmissionDraft(args = {}, options = {}) {
  return prepareSubmissionDraftFromSpec(
    await readSubmissionSpec(options),
    args,
  );
}

export async function getSubmissionExamples(args = {}, options = {}) {
  return getSubmissionExamplesFromSpec(await readSubmissionSpec(options), args);
}

export async function reviewSubmissionDraft(args = {}, options = {}) {
  const [spec, searchIndex] = await Promise.all([
    readSubmissionSpec(options),
    readJsonArtifact("search-index.json", options),
  ]);
  return reviewSubmissionDraftFromSpec(spec, args, unwrapEntries(searchIndex));
}

export async function callRegistryTool(name, args = {}, options = {}) {
  if (!READ_ONLY_TOOL_NAMES.includes(name)) {
    return invalid(`Unknown read-only HeyClaude MCP tool: ${name}`);
  }

  let parsedArgs;
  try {
    parsedArgs = parseToolArguments(name, args);
  } catch (error) {
    const details = formatZodError(error);
    if (details) {
      return invalidWithDetails(
        "Invalid HeyClaude MCP tool arguments.",
        details,
      );
    }
    throw error;
  }

  let result;
  switch (name) {
    case "search_registry":
      result = await searchRegistry(parsedArgs, options);
      break;
    case "server_info":
      result = await getServerInfo(parsedArgs, options);
      break;
    case "list_category_entries":
      result = await listCategoryEntries(parsedArgs, options);
      break;
    case "get_recent_updates":
      result = await getRecentUpdates(parsedArgs, options);
      break;
    case "get_related_entries":
      result = await getRelatedEntries(parsedArgs, options);
      break;
    case "get_entry_detail":
      result = await getEntryDetail(parsedArgs, options);
      break;
    case "get_copyable_asset":
      result = await getCopyableAsset(parsedArgs, options);
      break;
    case "compare_entries":
      result = await compareEntries(parsedArgs, options);
      break;
    case "get_registry_stats":
      result = await getRegistryStats(parsedArgs, options);
      break;
    case "get_client_setup":
      result = await getClientSetup(parsedArgs, options);
      break;
    case "get_compatibility":
      result = await getCompatibility(parsedArgs, options);
      break;
    case "get_install_guidance":
      result = await getInstallGuidance(parsedArgs, options);
      break;
    case "get_platform_adapter":
      result = await getPlatformAdapter(parsedArgs, options);
      break;
    case "list_distribution_feeds":
      result = await listDistributionFeeds(parsedArgs, options);
      break;
    case "get_submission_schema":
      result = await getSubmissionSchema(parsedArgs, options);
      break;
    case "validate_submission_draft":
      result = await validateSubmissionDraft(parsedArgs, options);
      break;
    case "search_duplicate_entries":
      result = await searchDuplicateRegistryEntries(parsedArgs, options);
      break;
    case "build_submission_urls":
      result = await buildSubmissionUrls(parsedArgs, options);
      break;
    case "get_category_submission_guidance":
      result = await getCategorySubmissionGuidance(parsedArgs, options);
      break;
    case "prepare_submission_draft":
      result = await prepareSubmissionDraft(parsedArgs, options);
      break;
    case "get_submission_examples":
      result = await getSubmissionExamples(parsedArgs, options);
      break;
    case "review_submission_draft":
      result = await reviewSubmissionDraft(parsedArgs, options);
      break;
  }

  return withPublicPolicy(result);
}
