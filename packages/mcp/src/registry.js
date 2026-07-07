import {
  buildSkillPlatformCompatibility,
  platformFeedSlug,
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
import {
  entryMatchesPlatform,
  entryMatchesQuery,
  entrySearchText,
  rankSearchEntries,
  searchTokens,
} from "./registry-search-delegate-lib.js";

export * from "./schemas.js";

import {
  buildCategoryEntriesPageResponse,
  buildCategoryResourcePayload,
  buildDiscoveryRecentResponse,
  buildDistributionFeedsResponse,
  buildExplainEntryTrustResponse,
  buildInstallGuidanceResponse,
  buildInstallPlanFromEntries,
  buildJobsActiveResourceResponse,
  buildListRegistryResourcesResponse,
  buildPlanWorkflowResponse,
  buildPlatformAdapterAvailableResponse,
  buildPlatformAdapterUnavailableResponse,
  buildRecentUpdatesResponse,
  buildRecommendForTaskResponse,
  buildRegistryResourcePayload,
  buildRelatedEntriesGraphResponse,
  buildRelatedEntriesScoredResponse,
  buildSearchRegistryResponse,
  buildTrendingResourceResponse,
  DISCOVERY_RESOURCE_LIMIT,
  mapRecentUpdateEntries,
  paginateEntries,
  resolveGraphRelatedEntries,
  sortEntriesByUpdatedAt,
} from "./registry-handlers-lib.js";

import {
  LOCAL_DRAFT_TOOL_NAMES,
  MCP_PUBLIC_POLICY,
  READ_ONLY_TOOL_NAMES,
  TOOL_DEFINITIONS,
} from "./registry-tools-lib.js";
import {
  PROMPT_DEFINITIONS,
  getRegistryPrompt,
  listRegistryPrompts,
} from "./registry-prompts-lib.js";
import {
  normalizeLimit,
  normalizeOffset,
  normalizePlatform,
  normalizeText,
} from "./registry-normalize-lib.js";
import {
  invalid,
  invalidWithDetails,
  notFound,
  notes,
  unavailable,
  withPublicPolicy,
} from "./registry-response-lib.js";
import {
  DISCOVERY_RESOURCES,
  RESOURCE_TEMPLATES,
  listRegistryResourceTemplates,
} from "./registry-resource-metadata-lib.js";
import {
  normalizeDateFloor,
  parsedTrustArgs,
} from "./registry-collection-lib.js";
import {
  entryMatchesTag,
  entryMatchesTrustFilters,
} from "./registry-filter-lib.js";
import { projectEntryBody } from "./registry-excerpt-lib.js";
import {
  categoryPrimaryAsset,
  entryInstallComplexity,
} from "./registry-asset-lib.js";
import {
  TRUST_SIGNAL_KEYS,
  entryCanonicalUrl,
  entryTrustSignalCoverage,
  entryTrustSummary,
  sourceSummary,
} from "./registry-trust-lib.js";
import {
  selectDiverseRankedEntries,
  toolboxCategoryMix,
  toolboxCaveats,
  toolboxFitReasons,
  toolboxInstall,
  toolboxNextActions,
  toolboxTrustSummary,
} from "./registry-toolbox-lib.js";
import {
  entryUpdatedAt,
  scoreRelatedEntry,
  toEntrySummary,
  toSearchResult,
  unwrapEntries,
} from "./registry-projection-lib.js";
import { isSafePathPart } from "./registry-artifact-path-lib.js";
import {
  readEntry,
  readJsonArtifact,
  readTextArtifact,
} from "./registry-artifact-loader-lib.js";
import { fetchPublicApiJson, JSON_MIME_TYPE } from "./registry-fetch-lib.js";
import {
  toJobEntry,
  toTrendingEntry,
} from "./registry-discovery-projection-lib.js";
import { buildClientSetupResponse } from "./registry-client-setup-lib.js";
import { buildSubmissionPolicyEnvelope } from "./registry-submission-policy-lib.js";
import {
  buildCompareEntryRow,
  buildCompareEntriesResponse,
} from "./registry-compare-lib.js";
import { buildRegistryStatsResponse } from "./registry-stats-lib.js";
import {
  buildSafetyReviewRow,
  buildSafetyReviewResponse,
} from "./registry-safety-review-lib.js";
import {
  buildTrustCompareRow,
  buildTrustCompareResponse,
  rankTrustCompareEntries,
  sharedTrustSignalGaps,
} from "./registry-trust-compare-lib.js";
import {
  buildCopyableAssetResponse,
  buildEntryContentAssets,
  filterAssetsByType,
  selectPrimaryAsset,
} from "./registry-copyable-asset-lib.js";

export {
  LOCAL_DRAFT_TOOL_NAMES,
  MCP_PUBLIC_POLICY,
  READ_ONLY_TOOL_NAMES,
  TOOL_DEFINITIONS,
};

export { PROMPT_DEFINITIONS, getRegistryPrompt, listRegistryPrompts };

export { RESOURCE_TEMPLATES, listRegistryResourceTemplates };

export async function searchRegistry(args = {}, options = {}) {
  const query = normalizeText(args.query);
  const category = normalizeText(args.category);
  const platform = normalizePlatform(args.platform);
  const tag = normalizeText(args.tag);
  const limit = normalizeLimit(args.limit);
  const trustFilters = parsedTrustArgs(args);
  const searchIndex = unwrapEntries(
    await readJsonArtifact("search-index.json", options),
  );

  const matched = searchIndex
    .filter((entry) => !category || entry.category === category)
    .filter((entry) => entryMatchesPlatform(entry, platform))
    .filter((entry) => entryMatchesTag(entry, tag))
    .filter((entry) => entryMatchesQuery(entry, query))
    .filter((entry) => entryMatchesTrustFilters(entry, trustFilters));
  const entries = rankSearchEntries(matched, query)
    .slice(0, limit)
    .map((item) => toSearchResult(item.entry, item));

  return buildSearchRegistryResponse({
    entries,
    args,
    category,
    platform,
    tag,
    trustFilters,
  });
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

  const installPlan = buildInstallPlanFromEntries(selected);

  return buildPlanWorkflowResponse({
    goal,
    category,
    platform,
    selected,
    installPlan,
    categoryMix: toolboxCategoryMix(selected),
    trustSummary: toolboxTrustSummary(selected),
  });
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

  const installPlan = buildInstallPlanFromEntries(recommendations);

  return buildRecommendForTaskResponse({
    task,
    category,
    platform,
    recommendations,
    installPlan,
    trustSummary: toolboxTrustSummary(recommendations),
  });
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
  const page = paginateEntries(entries, offset, limit).map(toEntrySummary);

  return buildCategoryEntriesPageResponse({
    entries,
    category,
    platform,
    tag,
    query: args.query,
    offset,
    limit,
    page,
  });
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
  const sorted = sortEntriesByUpdatedAt(
    searchIndex
      .filter((entry) => !category || entry.category === category)
      .filter((entry) => !since || entryUpdatedAt(entry) >= since),
    entryUpdatedAt,
  );
  const entries = mapRecentUpdateEntries(
    sorted.slice(0, limit),
    toEntrySummary,
    entryUpdatedAt,
  );

  return buildRecentUpdatesResponse({ category, since, entries });
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
  const graphEntries = resolveGraphRelatedEntries({
    graphRow,
    searchIndex,
    toEntrySummary,
    limit,
  });
  if (graphEntries) {
    return buildRelatedEntriesGraphResponse({
      target,
      entries: graphEntries,
      limit,
    });
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

  return buildRelatedEntriesScoredResponse({ target, entries, limit });
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
  const allAssets = buildEntryContentAssets(entry);
  const assets = filterAssetsByType(allAssets, requestedType);
  const primary = selectPrimaryAsset(assets, entry, requestedType);
  const compatibility = buildSkillPlatformCompatibility(entry);

  return buildCopyableAssetResponse({
    entry,
    platform,
    requestedType,
    assets,
    primary,
    compatibility,
    source: sourceSummary(entry),
    trust: entryTrustSummary(entry),
    canonicalUrl: entryCanonicalUrl(entry),
  });
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

  const compared = entries.map((entry) =>
    buildCompareEntryRow(entry, platform, {
      normalizePlatform,
      buildSkillPlatformCompatibility,
      entryInstallComplexity,
      categoryPrimaryAsset,
      sourceSummary,
      entryTrustSummary,
      entryCanonicalUrl,
    }),
  );

  return buildCompareEntriesResponse({ platform, compared });
}

export async function getRegistryStats(args = {}, options = {}) {
  const [manifest, searchIndexPayload] = await Promise.all([
    readJsonArtifact("registry-manifest.json", options),
    readJsonArtifact("search-index.json", options),
  ]);
  const entries = unwrapEntries(searchIndexPayload);

  return buildRegistryStatsResponse({
    manifest,
    entries,
    packageName,
    packageVersion,
  });
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
  return buildClientSetupResponse({
    endpointUrl,
    client: args.client || "",
  });
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
  return buildDiscoveryRecentResponse({
    entries: searchIndex,
    toEntrySummary,
    entryUpdatedAt,
  });
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

  return buildTrendingResourceResponse({ payload, entries });
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

  return buildJobsActiveResourceResponse({ payload, entries });
}

export async function listRegistryResources(args = {}, options = {}) {
  const manifest = await readJsonArtifact("registry-manifest.json", options);
  const categories = Object.keys(manifest.categories || {}).sort();
  return buildListRegistryResourcesResponse({
    manifest,
    categories,
    discoveryResources: DISCOVERY_RESOURCES,
    jsonMimeType: JSON_MIME_TYPE,
  });
}

export async function readRegistryResource(args = {}, options = {}) {
  const uri = String(args.uri || "");
  const resourcePayload = (payload) =>
    buildRegistryResourcePayload(
      uri,
      payload,
      JSON_MIME_TYPE,
      withPublicPolicy,
    );
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
    );
    payload = buildCategoryResourcePayload(category, entries, toEntrySummary);
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
    ? compatibility.find(
        (item) => normalizePlatform(item.platform) === platform,
      ) || null
    : null;

  return buildInstallGuidanceResponse({
    entry,
    platform,
    selectedCompatibility,
    compatibility,
    entryCanonicalUrl,
    entryTrustSummary,
    notes,
  });
}

export async function getPlatformAdapter(args = {}, options = {}) {
  const slug = normalizeText(args.slug);
  const platform = normalizePlatform(args.platform || "cursor");
  if (!slug) return invalid("slug is required.");

  if (platform !== "cursor") {
    return buildPlatformAdapterUnavailableResponse(platform, slug);
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
    return buildPlatformAdapterAvailableResponse(slug, adapter);
  } catch {
    return notFound(`No Cursor adapter generated for ${slug}.`);
  }
}

export async function listDistributionFeeds(args = {}, options = {}) {
  const [manifest, feedIndex] = await Promise.all([
    readJsonArtifact("registry-manifest.json", options),
    readJsonArtifact("feeds/index.json", options),
  ]);

  return buildDistributionFeedsResponse({
    manifest,
    feedIndex,
    platformFeedSlug,
  });
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
  return buildSubmissionPolicyEnvelope();
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

  return buildExplainEntryTrustResponse({
    entry,
    entryCanonicalUrl,
    entryTrustSummary,
  });
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
    entries.push(
      buildSafetyReviewRow(entry, platform, {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSummary,
      }),
    );
  }

  return buildSafetyReviewResponse({ platform, entries });
}

export async function compareEntryTrust(args = {}, options = {}) {
  const requested = Array.isArray(args.entries) ? args.entries : [];
  // Schema validation already enforces 2-5 entries for the public tool path;
  // this guard keeps the function safe for direct callers too.
  if (requested.length < 2 || requested.length > 5) {
    return invalid("Provide between 2 and 5 entries to compare.");
  }
  const platform = normalizePlatform(args.platform ?? "");
  const entries = [];
  for (const target of requested) {
    const category = normalizeText(target.category);
    const slug = normalizeText(target.slug);
    const entry = await readEntry(category, slug, options);
    if (entry == null) {
      return notFound(`No HeyClaude entry found for ${category}/${slug}.`);
    }
    entries.push(
      buildTrustCompareRow(entry, platform, {
        normalizePlatform,
        buildSkillPlatformCompatibility,
        entryCanonicalUrl,
        entryTrustSignalCoverage,
        entryTrustSummary,
      }),
    );
  }

  const ranking = rankTrustCompareEntries(entries);
  const sharedGaps = sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS);

  return buildTrustCompareResponse({
    platform,
    entries,
    ranking,
    sharedGaps,
    signalKeys: TRUST_SIGNAL_KEYS,
  });
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
    case "registry.search":
      result = await searchRegistry(parsedArgs, options);
      break;
    case "registry.plan":
      result = await planWorkflowToolbox(parsedArgs, options);
      break;
    case "registry.recommend":
      result = await recommendForTask(parsedArgs, options);
      break;
    case "registry.info":
      result = await getServerInfo(parsedArgs, options);
      break;
    case "registry.list":
      result = await listCategoryEntries(parsedArgs, options);
      break;
    case "registry.updates":
      result = await getRecentUpdates(parsedArgs, options);
      break;
    case "entry.related":
      result = await getRelatedEntries(parsedArgs, options);
      break;
    case "entry.detail":
      result = await getEntryDetail(parsedArgs, options);
      break;
    case "entry.asset":
      result = await getCopyableAsset(parsedArgs, options);
      break;
    case "entry.compare":
      result = await compareEntries(parsedArgs, options);
      break;
    case "registry.stats":
      result = await getRegistryStats(parsedArgs, options);
      break;
    case "install.setup":
      result = await getClientSetup(parsedArgs, options);
      break;
    case "install.compatibility":
      result = await getCompatibility(parsedArgs, options);
      break;
    case "install.guidance":
      result = await getInstallGuidance(parsedArgs, options);
      break;
    case "install.adapter":
      result = await getPlatformAdapter(parsedArgs, options);
      break;
    case "registry.feeds":
      result = await listDistributionFeeds(parsedArgs, options);
      break;
    case "submission.schema":
      result = await getSubmissionSchema(parsedArgs, options);
      break;
    case "submission.validate":
      result = await validateSubmissionDraft(parsedArgs, options);
      break;
    case "submission.duplicates":
      result = await searchDuplicateRegistryEntries(parsedArgs, options);
      break;
    case "submission.urls":
      result = await buildSubmissionUrls(parsedArgs, options);
      break;
    case "submission.guidance":
      result = await getCategorySubmissionGuidance(parsedArgs, options);
      break;
    case "submission.prepare":
      result = await prepareSubmissionDraft(parsedArgs, options);
      break;
    case "submission.examples":
      result = await getSubmissionExamples(parsedArgs, options);
      break;
    case "submission.review":
      result = await reviewSubmissionDraft(parsedArgs, options);
      break;
    case "submission.policy":
      result = await getSubmissionPolicy(parsedArgs, options);
      break;
    case "entry.trust":
      result = await explainEntryTrust(parsedArgs, options);
      break;
    case "entry.safety":
      result = await reviewEntrySafety(parsedArgs, options);
      break;
    case "entry.coverage":
      result = await compareEntryTrust(parsedArgs, options);
      break;
  }

  return withPublicPolicy(result);
}
