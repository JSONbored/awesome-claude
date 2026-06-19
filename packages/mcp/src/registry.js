import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildSkillPlatformCompatibility,
  platformFeedSlug,
  SITE_URL,
} from "./platforms.js";
import {
  DEFAULT_REMOTE_MCP_URL,
  normalizeEndpointUrl,
} from "./endpoint-url.js";
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

export * from "./schemas.js";

const safePathPartPattern = /^[a-z0-9-]+$/;
const jsonMimeType = "application/json";
const DISCOVERY_RESOURCE_LIMIT = 25;
const DISCOVERY_FETCH_TIMEOUT_MS = 5000;

function entryCanonicalUrl(entry) {
  return (
    entry.canonicalUrl ||
    entry.url ||
    `${SITE_URL}/entry/${entry.category}/${entry.slug}`
  );
}

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
  "plan_workflow_toolbox",
  "recommend_for_task",
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
  "get_submission_policy",
  "explain_entry_trust",
  "review_entry_safety",
];

export const LOCAL_DRAFT_TOOL_NAMES = [
  "validate_submission_draft",
  "build_submission_urls",
  "prepare_submission_draft",
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
    name: "plan_workflow_toolbox",
    description:
      "Plan a read-only Claude or Codex workflow toolbox from ranked HeyClaude registry entries. Each entry includes an inline install block (install command, config snippet, download URL) and the recommended stack is summarized as a copy-pasteable installPlan, alongside trust and follow-up guidance.",
    inputSchema: jsonSchemaForTool("plan_workflow_toolbox"),
    outputSchema: jsonSchemaForToolOutput("plan_workflow_toolbox"),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "recommend_for_task",
    description:
      "Answer 'what should I use to do X' in one call. Given a plain-language task (and optional platform/category), returns the best-match HeyClaude entries ranked by fit — each with why it fits, trust summary, disclosed safety/privacy notes, and an inline install block — plus a topPick and a consolidated installPlan. Unlike plan_workflow_toolbox it does not force category diversity; it returns the genuinely best matches. Collapses the search → compare → detail → asset loop into a single answer-shaped response.",
    inputSchema: jsonSchemaForTool("recommend_for_task"),
    outputSchema: jsonSchemaForToolOutput("recommend_for_task"),
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
      "Fetch a read-only HeyClaude registry entry detail payload by category and slug. By default (bodyMode='excerpt') the body markdown is trimmed to a short lead and large copyable fields are omitted to conserve context, with bodyChars/bodyTruncated/omittedFields describing what was dropped; pass bodyMode='full' for the complete content or 'none' to drop the body entirely. Use get_copyable_asset to retrieve omitted install/script content.",
    inputSchema: jsonSchemaForTool("get_entry_detail"),
  },
  {
    name: "get_copyable_asset",
    description:
      "Fetch the category-aware copy/install asset for a HeyClaude entry without writing local files. Pass assetType (e.g. 'install_command', 'config_snippet') to return only that asset and avoid the full_content/script payloads when you do not need them.",
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
      "Fetch read-only HeyClaude submission schemas for PR-first intake by category.",
    inputSchema: jsonSchemaForTool("get_submission_schema"),
  },
  {
    name: "validate_submission_draft",
    description:
      "Validate a HeyClaude content submission draft locally without creating GitHub issues, pull requests, or publishing content.",
    inputSchema: jsonSchemaForTool("validate_submission_draft"),
  },
  {
    name: "search_duplicate_entries",
    description:
      "Search generated registry artifacts for likely duplicate entries before a user opens a submission PR.",
    inputSchema: jsonSchemaForTool("search_duplicate_entries"),
  },
  {
    name: "build_submission_urls",
    description:
      "Build prefilled HeyClaude submit and review URLs for a validated PR-first submission draft without making write calls.",
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
      "Build a read-only maintainer-reviewed HeyClaude submission draft with canonical PR text and URLs.",
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
  {
    name: "get_submission_policy",
    description:
      "Fetch HeyClaude's read-only submission, artifact, import, and maintainer-review policy for contributors and agents.",
    inputSchema: jsonSchemaForTool("get_submission_policy"),
  },
  {
    name: "explain_entry_trust",
    description:
      "Explain deterministic trust, source, package, safety, privacy, and review metadata signals for one HeyClaude entry. This is a metadata review only and does not provide malware scanning, automatic safety guarantees, or installation approval.",
    inputSchema: jsonSchemaForTool("explain_entry_trust"),
  },
  {
    name: "review_entry_safety",
    description:
      "Review 1-5 HeyClaude entries for source, package, safety, and privacy metadata fit before install or recommendation. This is a metadata review only and does not provide malware scanning, automatic safety guarantees, or installation approval.",
    inputSchema: jsonSchemaForTool("review_entry_safety"),
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
  const envDataDir =
    typeof process !== "undefined" ? process.env?.HEYCLAUDE_DATA_DIR : "";
  if (options.dataDir || envDataDir) {
    return options.dataDir || envDataDir;
  }

  const moduleUrl = import.meta.url;
  if (!moduleUrl) {
    throw new Error(
      "HEYCLAUDE_DATA_DIR or readTextArtifact is required outside the Node package runtime.",
    );
  }

  const repoRoot = path.resolve(
    path.dirname(fileURLToPath(moduleUrl)),
    "../../..",
  );
  return path.join(repoRoot, "apps", "web", "public", "data");
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
    ...notes(entry.safetyNotes),
    ...notes(entry.privacyNotes),
    ...(entry.tags || []),
    ...(entry.keywords || []),
  ]
    .map(normalizeText)
    .join(" ");
  return haystack.includes(query);
}

function searchTokens(query) {
  return normalizeText(query)
    .split(/[^a-z0-9+#.-]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2)
    .slice(0, 12);
}

function entrySearchText(entry) {
  return [
    entry.title,
    entry.description,
    entry.cardDescription,
    entry.category,
    entry.slug,
    entry.author,
    entry.submittedBy,
    entry.brandName,
    entry.brandDomain,
    ...notes(entry.safetyNotes),
    ...notes(entry.privacyNotes),
    ...(entry.tags || []),
    ...(entry.keywords || []),
  ]
    .map(normalizeText)
    .join(" ")
    .toLowerCase();
}

function scoreSearchEntry(entry, query) {
  const normalizedQuery = normalizeText(query);
  const tokens = searchTokens(normalizedQuery);
  if (!tokens.length) return { score: 0, reasons: [] };

  const title = normalizeText(entry.title);
  const category = normalizeText(entry.category);
  const tags = new Set((entry.tags || []).map(normalizeText));
  const keywords = new Set((entry.keywords || []).map(normalizeText));
  const haystack = entrySearchText(entry);
  const reasons = new Set();
  let score = 0;

  if (title.includes(normalizedQuery)) {
    score += 90;
    reasons.add("title phrase");
  }
  if (category === normalizedQuery) {
    score += 45;
    reasons.add("category match");
  }

  for (const token of tokens) {
    if (title.includes(token)) {
      score += 35;
      reasons.add("title term");
    }
    if (tags.has(token)) {
      score += 24;
      reasons.add("tag match");
    }
    if (keywords.has(token)) {
      score += 18;
      reasons.add("keyword match");
    }
    if (category.includes(token)) {
      score += 12;
      reasons.add("category term");
    }
    if (haystack.includes(token)) score += 4;
  }

  if (entrySourceStatus(entry) === "available") {
    score += 8;
    reasons.add("source-backed");
  }
  if (
    entryPackageTrust(entry) === "first-party" ||
    entry.packageVerified ||
    entry.trustSignals?.packageVerified
  ) {
    score += 8;
    reasons.add("trusted package");
  }
  if (notes(entry.safetyNotes).length) {
    score += 4;
    reasons.add("safety notes");
  }
  if (notes(entry.privacyNotes).length) {
    score += 4;
    reasons.add("privacy notes");
  }
  if (entry.claimStatus === "verified" || entry.reviewedBy) {
    score += 4;
    reasons.add("reviewed");
  }

  return { score, reasons: [...reasons].slice(0, 6) };
}

function rankSearchEntries(entries, query) {
  return entries
    .map((entry, index) => ({
      entry,
      index,
      ...scoreSearchEntry(entry, query),
    }))
    .sort((left, right) => {
      if (left.score !== right.score) return right.score - left.score;
      const dateCompare = String(right.entry.dateAdded || "").localeCompare(
        String(left.entry.dateAdded || ""),
      );
      if (dateCompare !== 0) return dateCompare;
      return left.index - right.index;
    });
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

function booleanFilterMatches(value, filter = "all") {
  if (!filter || filter === "all") return true;
  return filter === "true" ? Boolean(value) : !value;
}

function entryPackageTrust(entry) {
  return entry.downloadTrust || (entry.downloadUrl ? "external" : "none");
}

function entryClaimStatus(entry) {
  return entry.claimStatus || "unclaimed";
}

function entrySourceStatus(entry) {
  const sourceUrls = [
    entry.documentationUrl,
    entry.repoUrl,
    entry.githubUrl,
    entry.sourceUrl,
  ].filter((value) => String(value || "").trim());
  return (
    entry.trustSignals?.sourceStatus ||
    (sourceUrls.length ? "available" : "missing")
  );
}

function entryMatchesTrustFilters(entry, args = {}) {
  if (
    !booleanFilterMatches(
      notes(entry.safetyNotes).length > 0,
      args.hasSafetyNotes,
    )
  ) {
    return false;
  }
  if (
    !booleanFilterMatches(
      notes(entry.privacyNotes).length > 0,
      args.hasPrivacyNotes,
    )
  ) {
    return false;
  }
  if (
    args.downloadTrust &&
    args.downloadTrust !== "all" &&
    entryPackageTrust(entry) !== args.downloadTrust
  ) {
    return false;
  }
  if (
    args.claimStatus &&
    args.claimStatus !== "all" &&
    entryClaimStatus(entry) !== args.claimStatus
  ) {
    return false;
  }
  if (
    args.sourceStatus &&
    args.sourceStatus !== "all" &&
    entrySourceStatus(entry) !== args.sourceStatus
  ) {
    return false;
  }
  return true;
}

function parsedTrustArgs(args = {}) {
  return {
    hasSafetyNotes: args.hasSafetyNotes || "all",
    hasPrivacyNotes: args.hasPrivacyNotes || "all",
    downloadTrust: args.downloadTrust || "all",
    claimStatus: args.claimStatus || "all",
    sourceStatus: args.sourceStatus || "all",
  };
}

function toSearchResult(entry, ranking = null) {
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
    downloadTrust: entry.downloadTrust || null,
    safetyNotes: notes(entry.safetyNotes),
    privacyNotes: notes(entry.privacyNotes),
    url: entry.url || entryCanonicalUrl(entry),
    canonicalUrl: entryCanonicalUrl(entry),
    searchScore: ranking?.score ?? 0,
    searchReasons: ranking?.reasons ?? [],
    trust: entryTrustSummary(entry),
  };
}

function toEntrySummary(entry) {
  return {
    ...toSearchResult(entry),
    dateAdded: entry.dateAdded || "",
    repoUpdatedAt: entry.repoUpdatedAt || null,
    verificationStatus: entry.verificationStatus || "",
    installable: Boolean(entry.installable),
    safetyNotes: notes(entry.safetyNotes),
    privacyNotes: notes(entry.privacyNotes),
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

function notes(values) {
  return Array.isArray(values)
    ? values.map((value) => String(value || "").trim()).filter(Boolean)
    : [];
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

function entryTrustRecommendations(entry) {
  const recommendations = [];
  const safetyNotes = notes(entry.safetyNotes);
  const privacyNotes = notes(entry.privacyNotes);
  const packageTrust = entryPackageTrust(entry);
  const source = sourceSummary(entry);

  if (!source.repoUrl && !source.documentationUrl) {
    recommendations.push(
      "Verify a canonical source before relying on this entry.",
    );
  }
  if (packageTrust === "external") {
    recommendations.push(
      "Review the upstream package source and checksum before installing.",
    );
  }
  if (entry.downloadUrl && packageTrust !== "first-party") {
    recommendations.push(
      "Treat the download as external unless maintainers have rebuilt and verified it.",
    );
  }
  if (!safetyNotes.length) {
    recommendations.push(
      "No structured safety notes are present; inspect commands and permissions manually.",
    );
  }
  if (!privacyNotes.length) {
    recommendations.push(
      "No structured privacy notes are present; review file, credential, telemetry, and network behavior manually.",
    );
  }
  return unique(recommendations).slice(0, 6);
}

function entryTrustSummary(entry) {
  const safetyNotes = notes(entry.safetyNotes);
  const privacyNotes = notes(entry.privacyNotes);
  const source = sourceSummary(entry);
  const packageTrust = entryPackageTrust(entry);
  const claimStatus = entryClaimStatus(entry);
  return {
    source: {
      status: entrySourceStatus(entry),
      repoUrl: source.repoUrl,
      documentationUrl: source.documentationUrl,
      sourceHosts: source.sourceHosts,
      githubStars: source.githubStars,
      githubForks: source.githubForks,
      repoUpdatedAt: source.repoUpdatedAt,
    },
    package: {
      downloadUrl: source.downloadUrl,
      downloadTrust: packageTrust,
      packageVerified: Boolean(
        entry.packageVerified || entry.trustSignals?.packageVerified,
      ),
      checksum:
        entry.checksum ||
        entry.packageChecksum ||
        entry.downloadSha256 ||
        entry.skillPackage?.sha256 ||
        "",
    },
    disclosures: {
      safetyNotes,
      privacyNotes,
      hasSafetyNotes: safetyNotes.length > 0,
      hasPrivacyNotes: privacyNotes.length > 0,
    },
    review: {
      claimStatus,
      reviewedBy: entry.reviewedBy || "",
      reviewedAt: entry.reviewedAt || "",
      submittedBy: entry.submittedBy || "",
      sourceSubmissionUrl: entry.sourceSubmissionUrl || "",
    },
    recommendations: entryTrustRecommendations(entry),
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
  const trustFilters = parsedTrustArgs(args);
  const searchIndex = unwrapEntries(
    await readJsonArtifact("search-index.json", options),
  );

  const matched = searchIndex
    .filter((entry) => !category || entry.category === category)
    .filter((entry) => entryMatchesPlatform(entry, platform))
    .filter((entry) => entryMatchesQuery(entry, query))
    .filter((entry) => entryMatchesTrustFilters(entry, trustFilters));
  const entries = rankSearchEntries(matched, query)
    .slice(0, limit)
    .map((item) => toSearchResult(item.entry, item));

  return {
    ok: true,
    count: entries.length,
    query: args.query || "",
    category: category || "",
    platform: platform || "",
    filters: trustFilters,
    entries,
  };
}

function selectDiverseRankedEntries(ranked, limit) {
  const selected = [];
  const byCategory = new Map();

  for (const item of ranked) {
    const category = item.entry.category || "";
    const current = byCategory.get(category) || 0;
    if (current >= 2) continue;
    selected.push(item);
    byCategory.set(category, current + 1);
    if (selected.length >= limit) return selected;
  }

  for (const item of ranked) {
    if (selected.includes(item)) continue;
    selected.push(item);
    if (selected.length >= limit) return selected;
  }

  return selected;
}

function toolboxFitReasons(entry, ranking) {
  const reasons = [...(ranking.reasons || []).slice(0, 4)];
  if (entry.category) {
    reasons.push(`${entry.category} workflow surface`);
  }
  if (entrySourceStatus(entry) === "available") {
    reasons.push("source-backed metadata");
  }
  if (
    entryPackageTrust(entry) === "first-party" ||
    entry.packageVerified ||
    entry.trustSignals?.packageVerified
  ) {
    reasons.push("first-party or verified package signal");
  }
  if (notes(entry.safetyNotes).length && notes(entry.privacyNotes).length) {
    reasons.push("safety and privacy notes present");
  } else if (notes(entry.safetyNotes).length) {
    reasons.push("safety notes present");
  } else if (notes(entry.privacyNotes).length) {
    reasons.push("privacy notes present");
  }
  if (entry.installCommand || entry.downloadUrl || entry.configSnippet) {
    reasons.push("actionable setup surface");
  }
  if ((entry.platforms || []).length) {
    reasons.push(
      `platform compatibility: ${(entry.platforms || []).slice(0, 3).join(", ")}`,
    );
  }
  if ((entry.supportLevels || []).length) {
    reasons.push("support levels documented");
  }
  if (entry.claimStatus === "verified" || entry.reviewedBy) {
    reasons.push("review/provenance metadata");
  }
  return unique(reasons).slice(0, 8);
}

function toolboxCaveats(entry) {
  const caveats = [];
  const packageTrust = entryPackageTrust(entry);
  const safetyNotes = notes(entry.safetyNotes);
  const privacyNotes = notes(entry.privacyNotes);
  if (entrySourceStatus(entry) !== "available") {
    caveats.push("Source metadata is missing or incomplete.");
  }
  if (packageTrust === "external") {
    caveats.push("Package/download is external; verify upstream before use.");
  }
  if (entry.downloadUrl && !entryTrustSummary(entry).package.checksum) {
    caveats.push("Download checksum metadata is not present.");
  }
  if (!safetyNotes.length) {
    caveats.push("No structured safety notes are present.");
  }
  if (!privacyNotes.length) {
    caveats.push("No structured privacy notes are present.");
  }
  if (
    ["mcp", "hooks", "commands", "skills", "statuslines"].includes(
      entry.category,
    )
  ) {
    caveats.push(
      "Risk-bearing workflow surface; inspect commands, permissions, and data access before use.",
    );
  }
  return unique(caveats).slice(0, 5);
}

function toolboxNextActions(entry) {
  return [
    `Inspect get_entry_detail with category=${entry.category} and slug=${entry.slug}.`,
    `Run explain_entry_trust with category=${entry.category} and slug=${entry.slug}; this is still metadata review only.`,
    "Use compare_entries with nearby candidates before recommending a final stack.",
    `Use get_copyable_asset with category=${entry.category} and slug=${entry.slug} only after trust review.`,
  ];
}

const TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT = 600;

// Distills the ready-to-run install surface for a toolbox entry from its full
// payload so the planner returns copy-pasteable commands instead of pointing at
// more tool calls. Large config snippets are summarized rather than inlined to
// preserve the lean response contract (callers use get_copyable_asset for them).
function toolboxInstall(entry) {
  if (!entry) return null;
  const installCommand = String(
    entry.installCommand || entry.commandSyntax || "",
  ).trim();
  const configSnippet = String(entry.configSnippet || "").trim();
  const downloadUrl = String(entry.downloadUrl || "").trim();
  const usageSnippet = String(entry.usageSnippet || "").trim();

  const install = {
    installable: Boolean(entry.installable),
    primaryAssetType: categoryPrimaryAsset(entry)?.type || "",
  };
  if (installCommand) install.installCommand = installCommand;
  if (downloadUrl) install.downloadUrl = downloadUrl;
  if (usageSnippet) install.usageSnippet = usageSnippet;
  if (configSnippet) {
    if (configSnippet.length <= TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
      install.configSnippet = configSnippet;
    } else {
      install.configSnippetChars = configSnippet.length;
      install.configHint =
        "Config snippet is large; call get_copyable_asset for the full snippet.";
    }
  }
  if (!installCommand && !downloadUrl && !configSnippet && !usageSnippet) {
    install.note =
      "No install command published; use the source or canonical URL.";
  }
  return install;
}

function toolboxCategoryMix(entries) {
  const counts = new Map();
  for (const entry of entries) {
    const category = entry.category || "unknown";
    counts.set(category, (counts.get(category) || 0) + 1);
  }
  return [...counts]
    .map(([category, count]) => ({ category, count }))
    .sort((left, right) => left.category.localeCompare(right.category));
}

function toolboxTrustSummary(entries) {
  return {
    sourceBacked: entries.filter(
      (entry) => entry.trust?.source?.status === "available",
    ).length,
    firstPartyOrVerifiedPackages: entries.filter(
      (entry) =>
        entry.trust?.package?.downloadTrust === "first-party" ||
        entry.trust?.package?.packageVerified,
    ).length,
    entriesWithSafetyNotes: entries.filter(
      (entry) => entry.trust?.disclosures?.hasSafetyNotes,
    ).length,
    entriesWithPrivacyNotes: entries.filter(
      (entry) => entry.trust?.disclosures?.hasPrivacyNotes,
    ).length,
    externalPackages: entries.filter(
      (entry) => entry.trust?.package?.downloadTrust === "external",
    ).length,
    missingSource: entries.filter(
      (entry) => entry.trust?.source?.status !== "available",
    ).length,
  };
}

export async function planWorkflowToolbox(args = {}, options = {}) {
  const goal = String(args.goal || "").trim();
  if (goal.length < 2) {
    return invalid("Planner goal must be at least 2 characters.");
  }
  const query = normalizeText(goal);
  const category = normalizeText(args.category);
  const platform = normalizePlatform(args.platform);
  const limit = Math.min(10, normalizeLimit(args.limit, 6));
  const searchIndex = unwrapEntries(
    await readJsonArtifact("search-index.json", options),
  );
  const scoped = searchIndex
    .filter((entry) => !category || entry.category === category)
    .filter((entry) => entryMatchesPlatform(entry, platform));
  let matched = scoped.filter((entry) => entryMatchesQuery(entry, query));
  const queryTokens = searchTokens(query);
  if (!matched.length && queryTokens.length) {
    matched = scoped.filter((entry) =>
      queryTokens.some((token) => entrySearchText(entry).includes(token)),
    );
  }
  const ranked = rankSearchEntries(matched, query);
  // Read the full payload for each selected entry so the planner can inline
  // ready-to-run install commands; fall back to the search-index summary if a
  // detail read fails so one bad entry never breaks the whole plan.
  const selected = await Promise.all(
    selectDiverseRankedEntries(ranked, limit).map(async (item) => {
      const full = await readEntry(
        item.entry.category,
        item.entry.slug,
        options,
      ).catch(() => null);
      return {
        ...toEntrySummary(item.entry),
        searchScore: item.score,
        searchReasons: item.reasons,
        toolboxReasons: toolboxFitReasons(item.entry, item),
        caveats: toolboxCaveats(item.entry),
        install: toolboxInstall(full || item.entry),
        nextActions: toolboxNextActions(item.entry),
      };
    }),
  );

  // Consolidated, ordered install commands for the recommended stack.
  const installPlan = selected
    .filter((entry) => entry.install?.installCommand)
    .map((entry) => ({
      key: entry.key,
      title: entry.title,
      category: entry.category,
      installCommand: entry.install.installCommand,
    }));

  return {
    ok: true,
    goal,
    category: category || "",
    platform: platform || "",
    count: selected.length,
    entries: selected,
    installPlan,
    categoryMix: toolboxCategoryMix(selected),
    trustSummary: toolboxTrustSummary(selected),
    recommendedNextTools: [
      "get_entry_detail",
      "explain_entry_trust",
      "compare_entries",
      "get_copyable_asset",
    ],
    plannerNotes: [
      "This planner is metadata review only; it is not install approval or malware scanning, and it does not execute or install entries.",
      "Each entry carries an inline install block and the recommended stack is summarized in installPlan; still review trust before running anything.",
      "Recommendations are bounded and category-diverse where matching entries allow it.",
      "Prefer source-backed entries with safety/privacy notes for risk-bearing MCP, hooks, skills, commands, and statuslines.",
      "Use get_entry_detail, explain_entry_trust, compare_entries, and get_copyable_asset before relying on any entry.",
    ],
  };
}

export async function recommendForTask(args = {}, options = {}) {
  const task = String(args.task || "").trim();
  if (task.length < 2) {
    return invalid("Task description must be at least 2 characters.");
  }
  const query = normalizeText(task);
  const category = normalizeText(args.category);
  const platform = normalizePlatform(args.platform);
  const limit = Math.min(5, normalizeLimit(args.limit, 3));
  const searchIndex = unwrapEntries(
    await readJsonArtifact("search-index.json", options),
  );
  const scoped = searchIndex
    .filter((entry) => !category || entry.category === category)
    .filter((entry) => entryMatchesPlatform(entry, platform));
  let matched = scoped.filter((entry) => entryMatchesQuery(entry, query));
  const queryTokens = searchTokens(query);
  if (!matched.length && queryTokens.length) {
    matched = scoped.filter((entry) =>
      queryTokens.some((token) => entrySearchText(entry).includes(token)),
    );
  }
  // Best-match ranking, top-N — unlike the toolbox planner this does NOT force
  // category diversity; it returns the genuinely closest entries for the task.
  const ranked = rankSearchEntries(matched, query).slice(0, limit);
  const recommendations = await Promise.all(
    ranked.map(async (item) => {
      const full = await readEntry(
        item.entry.category,
        item.entry.slug,
        options,
      ).catch(() => null);
      return {
        ...toEntrySummary(item.entry),
        searchScore: item.score,
        searchReasons: item.reasons,
        why: toolboxFitReasons(item.entry, item),
        caveats: toolboxCaveats(item.entry),
        install: toolboxInstall(full || item.entry),
      };
    }),
  );

  const installPlan = recommendations
    .filter((entry) => entry.install?.installCommand)
    .map((entry) => ({
      key: entry.key,
      title: entry.title,
      category: entry.category,
      installCommand: entry.install.installCommand,
    }));

  return {
    ok: true,
    task,
    category: category || "",
    platform: platform || "",
    count: recommendations.length,
    topPick: recommendations[0]?.key || "",
    recommendations,
    installPlan,
    trustSummary: toolboxTrustSummary(recommendations),
    notes: [
      "Best-match recommendations for the task; unlike plan_workflow_toolbox they are not forced to span categories.",
      "This is metadata review only — it does not execute, install, or scan entries. Review trust before running anything.",
      "Use compare_entries to weigh the top picks and explain_entry_trust before relying on any entry.",
    ],
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

  const graph = await readJsonArtifact("relation-graph.json", options).catch(
    () => null,
  );
  const graphRow = Array.isArray(graph?.entries)
    ? graph.entries.find((entry) => entry.key === `${category}:${slug}`)
    : null;
  if (graphRow?.related?.length) {
    const searchByKey = new Map(
      searchIndex.map((entry) => [`${entry.category}:${entry.slug}`, entry]),
    );
    const entries = graphRow.related
      .map((relation) => {
        const entry = searchByKey.get(relation.key);
        if (!entry) return null;
        return {
          ...toEntrySummary(entry),
          relation: relation.relation,
          relatedScore: relation.score,
          relatedReasons: relation.reasons || [],
        };
      })
      .filter(Boolean)
      .slice(0, limit);

    return {
      ok: true,
      key: `${target.category}:${target.slug}`,
      relationGraph: true,
      count: entries.length,
      entries,
    };
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

const ENTRY_BODY_EXCERPT_CHARS = 1200;

// Large copyable-content fields that largely duplicate the body or the install
// asset. In non-full modes they are omitted (and surfaced via omittedFields)
// because the caller should pull them from get_copyable_asset when needed,
// rather than paying for tens of kilobytes on every detail lookup.
const ENTRY_ASSET_FIELDS = ["scriptBody", "fullCopyableContent", "copySnippet"];

function excerptText(text, limit) {
  if (text.length <= limit) {
    return text;
  }
  const slice = text.slice(0, limit);
  // Back off to the last paragraph/sentence/word boundary so the excerpt does
  // not end mid-word; fall back to the hard cut if no decent boundary exists.
  const boundary = Math.max(
    slice.lastIndexOf("\n\n"),
    slice.lastIndexOf("\n"),
    slice.lastIndexOf(". "),
    slice.lastIndexOf(" "),
  );
  const cut = boundary > limit * 0.6 ? slice.slice(0, boundary) : slice;
  return `${cut.trimEnd()}…`;
}

// Projects an entry's heavy content to the requested verbosity so the default
// get_entry_detail response stays token-efficient. Returns the (possibly
// trimmed) entry plus body metadata describing exactly what was returned.
function projectEntryBody(entry, requestedMode) {
  const mode =
    requestedMode === "none" || requestedMode === "full"
      ? requestedMode
      : "excerpt";
  const body = typeof entry.body === "string" ? entry.body : "";
  const bodyChars = body.length;

  if (mode === "full") {
    return {
      entry,
      bodyMeta: {
        bodyMode: "full",
        bodyChars,
        bodyTruncated: false,
        omittedFields: [],
      },
    };
  }

  // Lean modes: drop large copyable asset fields, keep small useful ones.
  const projected = { ...entry };
  const omittedFields = [];
  for (const field of ENTRY_ASSET_FIELDS) {
    const value = projected[field];
    const size = typeof value === "string" ? value.length : 0;
    if (size > ENTRY_BODY_EXCERPT_CHARS) {
      delete projected[field];
      omittedFields.push({ field, chars: size });
    }
  }

  if (mode === "none") {
    delete projected.body;
    return {
      entry: projected,
      bodyMeta: withAssetHint({
        bodyMode: "none",
        bodyChars,
        bodyTruncated: bodyChars > 0,
        omittedFields,
      }),
    };
  }

  if (bodyChars > ENTRY_BODY_EXCERPT_CHARS) {
    projected.body = excerptText(body, ENTRY_BODY_EXCERPT_CHARS);
    return {
      entry: projected,
      bodyMeta: withAssetHint({
        bodyMode: "excerpt",
        bodyChars,
        bodyTruncated: true,
        omittedFields,
      }),
    };
  }

  return {
    entry: projected,
    bodyMeta: withAssetHint({
      bodyMode: "excerpt",
      bodyChars,
      bodyTruncated: false,
      omittedFields,
    }),
  };
}

function withAssetHint(bodyMeta) {
  if (bodyMeta.omittedFields.length > 0) {
    bodyMeta.assetHint =
      "Large copyable fields were omitted to save context; call get_copyable_asset for the full script or snippet.";
  }
  return bodyMeta;
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

  const normalizedEntry = {
    ...entry,
    safetyNotes: notes(entry.safetyNotes),
    privacyNotes: notes(entry.privacyNotes),
  };
  const { entry: projectedEntry, bodyMeta } = projectEntryBody(
    normalizedEntry,
    args.bodyMode,
  );

  return {
    ok: true,
    key: `${entry.category}:${entry.slug}`,
    canonicalUrl: entryCanonicalUrl(entry),
    ...bodyMeta,
    entry: projectedEntry,
    trust: entryTrustSummary(entry),
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

  const requestedType = normalizeText(args.assetType);
  const allAssets = [
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
  // When a specific assetType is requested, return only that asset so the
  // caller does not pay for the (potentially tens-of-KB) full_content/script
  // payloads it did not ask for.
  const assets = requestedType
    ? allAssets.filter((asset) => asset.type === requestedType)
    : allAssets;
  const primary = requestedType
    ? assets[0] || null
    : categoryPrimaryAsset(entry);
  const compatibility = buildSkillPlatformCompatibility(entry);

  return {
    ok: true,
    key: `${entry.category}:${entry.slug}`,
    category: entry.category,
    slug: entry.slug,
    title: entry.title,
    canonicalUrl: entryCanonicalUrl(entry),
    platform: platform || "",
    requestedAssetType: requestedType || "",
    primaryAsset: primary,
    assets,
    installCommand: entry.installCommand || "",
    configSnippet: entry.configSnippet || "",
    usageSnippet: entry.usageSnippet || "",
    downloadUrl: entry.downloadUrl || "",
    safetyNotes: notes(entry.safetyNotes),
    privacyNotes: notes(entry.privacyNotes),
    platformCompatibility: compatibility,
    source: sourceSummary(entry),
    trust: entryTrustSummary(entry),
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
      canonicalUrl: entryCanonicalUrl(entry),
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
      trust: entryTrustSummary(entry),
    };
  });
  const sharedTags = compared.length
    ? compared
        .slice(1)
        .reduce(
          (tags, entry) => intersection(tags, entry.tags || []),
          compared[0].tags || [],
        )
    : [];

  return {
    ok: true,
    platform: platform || "",
    count: compared.length,
    sharedTags,
    entries: compared,
    comparisonNotes: [
      "Prefer exact category fit before source popularity.",
      "Treat GitHub stars/forks as source signals only when present; absence is not a negative ranking.",
      "Install complexity is derived from available install/config/download/prerequisite metadata.",
      "Safety/privacy notes are disclosure metadata, not a malware verdict.",
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
  let endpointUrl;
  try {
    const rawEndpointUrl = Object.prototype.hasOwnProperty.call(
      args,
      "endpointUrl",
    )
      ? args.endpointUrl
      : DEFAULT_REMOTE_MCP_URL;
    endpointUrl = normalizeEndpointUrl(rawEndpointUrl).toString();
  } catch (error) {
    return invalid(error?.message || "Invalid endpoint URL.");
  }
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
      "Submission tools prepare maintainer-reviewed PR-first drafts; they do not open GitHub issues.",
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

/**
 * Static MCP resource descriptors for the bounded discovery surfaces
 * exposed alongside the directory and category feeds. Appended to
 * {@link listRegistryResources} output and routed by
 * {@link readRegistryResource}.
 *
 * @type {Array<{ uri: string, name: string, title: string, description: string, mimeType: string }>}
 */
const DISCOVERY_RESOURCES = [
  {
    uri: "heyclaude://registry/recent",
    name: "HeyClaude recent registry updates",
    title: "HeyClaude recent registry updates",
    description:
      "Bounded list of recently added or upstream-updated HeyClaude entries from the generated search index.",
    mimeType: jsonMimeType,
  },
  {
    uri: "heyclaude://registry/trending",
    name: "HeyClaude trending registry entries",
    title: "HeyClaude trending registry entries",
    description:
      "Bounded list of trending HeyClaude entries from the public /api/registry/trending endpoint; degrades gracefully when dynamic state is unavailable.",
    mimeType: jsonMimeType,
  },
  {
    uri: "heyclaude://jobs/active",
    name: "HeyClaude active jobs",
    title: "HeyClaude active jobs",
    description:
      "Bounded list of active public job listings from the public /api/jobs endpoint; degrades gracefully when dynamic state is unavailable.",
    mimeType: jsonMimeType,
  },
];

/**
 * Resolve the public HeyClaude API base URL. Prefers an explicit override
 * on `options.publicApiBaseUrl`, then the `HEYCLAUDE_PUBLIC_API_URL`
 * environment variable, then falls back to the canonical site URL.
 *
 * @param {{ publicApiBaseUrl?: string }} [options]
 * @returns {string} Base URL used to build `/api/...` requests.
 */
function publicApiBaseUrl(options = {}) {
  return (
    options.publicApiBaseUrl || process.env.HEYCLAUDE_PUBLIC_API_URL || SITE_URL
  );
}

/**
 * Remove trailing slashes without using a potentially expensive regex on
 * caller-controlled API base URL overrides.
 *
 * @param {string} value
 * @returns {string}
 */
function stripTrailingSlashes(value) {
  let end = value.length;
  while (end > 0 && value.charCodeAt(end - 1) === 47) {
    end -= 1;
  }
  return value.slice(0, end);
}

/**
 * Fetch JSON from a public HeyClaude API path. Tests inject a deterministic
 * fetcher via `options.fetchPublicApi`; production uses `fetch()` with a
 * bounded {@link DISCOVERY_FETCH_TIMEOUT_MS} timeout, `redirect: "error"`,
 * and a JSON `accept` header. Throws on non-2xx responses so callers can
 * convert failures into the "unavailable" graceful-degradation envelope.
 *
 * @param {string} apiPath API path beginning with `/api/...`.
 * @param {{
 *   publicApiBaseUrl?: string,
 *   fetchPublicApi?: (apiPath: string) => Promise<unknown>,
 * }} [options]
 * @returns {Promise<unknown>} Parsed JSON body from the upstream response.
 */
async function fetchPublicApiJson(apiPath, options = {}) {
  if (typeof options.fetchPublicApi === "function") {
    return options.fetchPublicApi(apiPath);
  }
  const baseUrl = stripTrailingSlashes(publicApiBaseUrl(options));
  const url = `${baseUrl}${apiPath.startsWith("/") ? "" : "/"}${apiPath}`;
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    DISCOVERY_FETCH_TIMEOUT_MS,
  );
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { accept: jsonMimeType },
      redirect: "error",
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Public API ${apiPath} returned ${response.status}.`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Build the standard "unavailable" error envelope used when a dynamic
 * resource cannot be loaded. Distinct from `notFound` / `invalid` so MCP
 * clients can tell apart "endpoint failed" from "no such resource" and
 * keep the surface read-only.
 *
 * @param {string} message Human-readable explanation.
 * @param {string} [details] Optional underlying error message.
 * @returns {{ ok: false, error: { code: "unavailable", message: string, details?: string } }}
 */
function unavailable(message, details) {
  return {
    ok: false,
    error: {
      code: "unavailable",
      message,
      ...(details ? { details } : {}),
    },
  };
}

/**
 * Build the `heyclaude://registry/recent` resource payload. Reads the
 * generated `search-index.json` artifact, sorts entries by `repoUpdatedAt`
 * (falling back to `updatedAt` / `dateAdded`) descending, and bounds
 * output to {@link DISCOVERY_RESOURCE_LIMIT} entries. Each entry carries
 * the standard `toEntrySummary` shape plus `updatedAt` and `updateKind`.
 *
 * @param {import("./registry.d.ts").RegistryArtifactLoaders} [options]
 * @returns {Promise<import("./registry.d.ts").RegistryToolResult>}
 */
export async function listRegistryRecent(options = {}) {
  const searchIndex = unwrapEntries(
    await readJsonArtifact("search-index.json", options),
  );
  const entries = searchIndex
    .slice()
    .sort((left, right) => {
      const dateCompare = entryUpdatedAt(right).localeCompare(
        entryUpdatedAt(left),
      );
      if (dateCompare !== 0) return dateCompare;
      return String(left.title || "").localeCompare(String(right.title || ""));
    })
    .slice(0, DISCOVERY_RESOURCE_LIMIT)
    .map((entry) => ({
      ...toEntrySummary(entry),
      updatedAt: entryUpdatedAt(entry),
      updateKind: entry.repoUpdatedAt ? "upstream_update" : "added",
    }));

  return {
    ok: true,
    kind: "registry-recent",
    schemaVersion: 1,
    limit: DISCOVERY_RESOURCE_LIMIT,
    count: entries.length,
    entries,
  };
}

/**
 * Normalize a raw `/api/registry/trending` entry into the small, stable
 * shape published by the MCP `registry/trending` resource. Defends against
 * upstream field churn (missing arrays, non-numeric scores, dropped
 * `trustSignals`) so MCP clients see a predictable schema.
 *
 * @param {Record<string, unknown> & { category: string, slug: string }} entry
 * @returns {Record<string, unknown>} Normalized trending entry.
 */
function toTrendingEntry(entry) {
  return {
    key: `${entry.category}:${entry.slug}`,
    category: entry.category,
    slug: entry.slug,
    title: entry.title || "",
    description: entry.description || "",
    canonicalUrl: entryCanonicalUrl(entry),
    platforms: Array.isArray(entry.platforms) ? entry.platforms : [],
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    dateAdded: entry.dateAdded || "",
    score: typeof entry.score === "number" ? entry.score : 0,
    reasons: Array.isArray(entry.reasons) ? entry.reasons : [],
    trustSignals: entry.trustSignals || { sourceStatus: "missing" },
  };
}

/**
 * Build the `heyclaude://registry/trending` resource payload. Reuses the
 * public `/api/registry/trending` endpoint (no DB access from the MCP
 * package). Returns an `unavailable` envelope when the upstream fetch
 * fails so MCP clients degrade gracefully. Output is bounded to
 * {@link DISCOVERY_RESOURCE_LIMIT} entries and forwards `signalsAvailable`
 * when present so consumers can tell which scoring signals applied.
 *
 * @param {import("./registry.d.ts").RegistryArtifactLoaders & {
 *   publicApiBaseUrl?: string,
 *   fetchPublicApi?: (apiPath: string) => Promise<unknown>,
 * }} [options]
 * @returns {Promise<import("./registry.d.ts").RegistryToolResult>}
 */
export async function listRegistryTrending(options = {}) {
  let payload;
  try {
    payload = await fetchPublicApiJson(
      `/api/registry/trending?limit=${DISCOVERY_RESOURCE_LIMIT}`,
      options,
    );
  } catch (error) {
    return unavailable(
      "Trending registry state is currently unavailable.",
      String(error?.message || error || ""),
    );
  }

  if (!payload || !Array.isArray(payload.entries)) {
    return unavailable(
      "Trending registry state is currently unavailable.",
      "Upstream payload is missing the expected entries array.",
    );
  }
  const entries = payload.entries
    .slice(0, DISCOVERY_RESOURCE_LIMIT)
    .map(toTrendingEntry);

  return {
    ok: true,
    kind: "registry-trending",
    schemaVersion: payload?.schemaVersion ?? 1,
    category: payload?.category || "all",
    platform: payload?.platform || "all",
    limit: DISCOVERY_RESOURCE_LIMIT,
    count: entries.length,
    signalsAvailable:
      payload?.signalsAvailable && typeof payload.signalsAvailable === "object"
        ? payload.signalsAvailable
        : null,
    source: "public-api",
    entries,
  };
}

/**
 * Normalize a raw `/api/jobs` entry into the small, stable shape published
 * by the MCP `jobs/active` resource. Defends against upstream field churn
 * and never exposes private/admin-only fields (we only project the public
 * subset already returned by `buildPublicJobsIndex`).
 *
 * @param {Record<string, unknown>} job
 * @returns {Record<string, unknown>} Normalized public job entry.
 */
function toJobEntry(job) {
  return {
    id: job.id || job.slug || "",
    title: job.title || "",
    company: job.company || "",
    location: job.location || "",
    type: job.type || "",
    isRemote: Boolean(job.isRemote),
    tier: job.tier || "",
    applyUrl: job.applyUrl || job.url || "",
    sourceLabel: job.sourceLabel || "",
    postedAt: job.postedAt || job.publishedAt || "",
    labels: Array.isArray(job.labels) ? job.labels : [],
  };
}

/**
 * Build the `heyclaude://jobs/active` resource payload. Reuses the public
 * `/api/jobs` endpoint (no DB access from the MCP package) and returns an
 * `unavailable` envelope when the upstream fetch fails. Output is bounded
 * to {@link DISCOVERY_RESOURCE_LIMIT} entries and forwards `totalAvailable`
 * when the upstream reports it.
 *
 * @param {import("./registry.d.ts").RegistryArtifactLoaders & {
 *   publicApiBaseUrl?: string,
 *   fetchPublicApi?: (apiPath: string) => Promise<unknown>,
 * }} [options]
 * @returns {Promise<import("./registry.d.ts").RegistryToolResult>}
 */
export async function listJobsActive(options = {}) {
  let payload;
  try {
    payload = await fetchPublicApiJson(
      `/api/jobs?limit=${DISCOVERY_RESOURCE_LIMIT}`,
      options,
    );
  } catch (error) {
    return unavailable(
      "Active jobs state is currently unavailable.",
      String(error?.message || error || ""),
    );
  }

  if (!payload || !Array.isArray(payload.entries)) {
    return unavailable(
      "Active jobs state is currently unavailable.",
      "Upstream payload is missing the expected entries array.",
    );
  }
  const entries = payload.entries
    .slice(0, DISCOVERY_RESOURCE_LIMIT)
    .map(toJobEntry);

  return {
    ok: true,
    kind: "jobs-active",
    schemaVersion: payload?.schemaVersion ?? 1,
    limit: DISCOVERY_RESOURCE_LIMIT,
    count: entries.length,
    totalAvailable:
      typeof payload?.totalAvailable === "number"
        ? payload.totalAvailable
        : null,
    source: "public-api",
    entries,
  };
}

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
      "Guide a user through drafting a maintainer-reviewed HeyClaude submission without opening a PR automatically.",
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
    name: "review_submission_before_pr",
    title: "Review submission before opening PR",
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
      ...DISCOVERY_RESOURCES,
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
    // Resource reads return the full document; only the tool defaults to a
    // token-efficient excerpt.
    const detail = await getEntryDetail(
      { category, slug, bodyMode: "full" },
      options,
    );
    payload = detail;
  } else if (
    parsed.hostname === "registry" &&
    parts.length === 1 &&
    parts[0] === "recent"
  ) {
    payload = await listRegistryRecent(options);
  } else if (
    parsed.hostname === "registry" &&
    parts.length === 1 &&
    parts[0] === "trending"
  ) {
    payload = await listRegistryTrending(options);
  } else if (
    parsed.hostname === "jobs" &&
    parts.length === 1 &&
    parts[0] === "active"
  ) {
    payload = await listJobsActive(options);
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

Use get_submission_schema, get_submission_examples, prepare_submission_draft, review_submission_draft, and search_duplicate_entries. Return missing fields and the canonical PR-first submit URL/body. Do not create GitHub issues or publish content.`,
    review_submission_before_pr: `Review this HeyClaude submission draft before a PR is opened:

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
    canonicalUrl: entryCanonicalUrl(entry),
    title: entry.title,
    installCommand: entry.installCommand || entry.commandSyntax || "",
    configSnippet: entry.configSnippet || "",
    usageSnippet: entry.usageSnippet || "",
    downloadUrl: entry.downloadUrl || "",
    documentationUrl: entry.documentationUrl || "",
    repoUrl: entry.repoUrl || "",
    safetyNotes: notes(entry.safetyNotes),
    privacyNotes: notes(entry.privacyNotes),
    trust: entryTrustSummary(entry),
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

export async function getSubmissionPolicy() {
  return {
    ok: true,
    publicPolicy: MCP_PUBLIC_POLICY,
    reviewModel: {
      prFirst: true,
      maintainerReviewRequired: true,
      autoMerge: "content_only_private_gate",
      autoMergeRequires: [
        "single content file only",
        "validate-content",
        "Superagent Security Scan",
        "private maintainer-agent review",
      ],
      mutatingAutomationOwner: "private submission gate",
    },
    artifactPolicy: {
      communityHostedArchivesAllowed: false,
      communityZipHostingAllowed: false,
      communityMcpbHostingAllowed: false,
      maintainerBuiltDownloadsOnly: true,
      firstPartyDownloadsRequireVerification: true,
    },
    submissionGuidance: [
      "Use source-backed or copyable-content submissions for community content.",
      "Do not request public HeyClaude /downloads hosting for community ZIP/MCPB artifacts.",
      "Add safety_notes when a submission runs code, writes externally, uses permissions, or starts background workers.",
      "Add privacy_notes when a submission reads local files, logs, credentials, telemetry, or third-party user data.",
      "Commercial, affiliate, sponsored, or paid product listings go through maintainer review and disclosure, not the free content queue.",
    ],
  };
}

export async function explainEntryTrust(args = {}, options = {}) {
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
    title: entry.title,
    canonicalUrl: entryCanonicalUrl(entry),
    trust: entryTrustSummary(entry),
  };
}

export async function reviewEntrySafety(args = {}, options = {}) {
  const platform = normalizePlatform(args.platform);
  const entries = [];
  for (const target of args.entries || []) {
    const category = normalizeText(target.category);
    const slug = normalizeText(target.slug);
    const entry = await readEntry(category, slug, options);
    if (!entry) {
      return notFound(`No HeyClaude entry found for ${category}/${slug}.`);
    }
    const compatibility = buildSkillPlatformCompatibility(entry);
    entries.push({
      key: `${entry.category}:${entry.slug}`,
      category: entry.category,
      slug: entry.slug,
      title: entry.title,
      canonicalUrl: entryCanonicalUrl(entry),
      selectedCompatibility: platform
        ? compatibility.find((item) => item.platform === platform) || null
        : null,
      trust: entryTrustSummary(entry),
    });
  }

  const entriesWithNotes = entries.filter(
    (entry) =>
      entry.trust.disclosures.hasSafetyNotes ||
      entry.trust.disclosures.hasPrivacyNotes,
  );

  return {
    ok: true,
    platform: platform || "",
    count: entries.length,
    entries,
    summary: {
      entriesWithSafetyOrPrivacyNotes: entriesWithNotes.length,
      firstPartyPackages: entries.filter(
        (entry) => entry.trust.package.downloadTrust === "first-party",
      ).length,
      sourceBacked: entries.filter(
        (entry) => entry.trust.source.status === "available",
      ).length,
    },
    reviewNotes: [
      "This is a metadata review, not a malware scan or install verdict.",
      "Prefer source-backed entries and first-party maintainer-built downloads when installing packages.",
      "Inspect commands, requested permissions, and external writes before running any copied content.",
    ],
  };
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
    case "plan_workflow_toolbox":
      result = await planWorkflowToolbox(parsedArgs, options);
      break;
    case "recommend_for_task":
      result = await recommendForTask(parsedArgs, options);
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
    case "get_submission_policy":
      result = await getSubmissionPolicy(parsedArgs, options);
      break;
    case "explain_entry_trust":
      result = await explainEntryTrust(parsedArgs, options);
      break;
    case "review_entry_safety":
      result = await reviewEntrySafety(parsedArgs, options);
      break;
  }

  return withPublicPolicy(result);
}
