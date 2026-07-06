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
  matchesRegistryPlatform,
  matchesRegistryQuery,
  normalizedRegistrySearchText,
  rankRegistrySearchEntries,
  tokenizeRegistrySearchQuery,
} from "./search-ranking.js";

export * from "./schemas.js";

const DISCOVERY_RESOURCE_LIMIT = 25;

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
  intersection,
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
  contentAsset,
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

export {
  LOCAL_DRAFT_TOOL_NAMES,
  MCP_PUBLIC_POLICY,
  READ_ONLY_TOOL_NAMES,
  TOOL_DEFINITIONS,
};

export { PROMPT_DEFINITIONS, getRegistryPrompt, listRegistryPrompts };

export { RESOURCE_TEMPLATES, listRegistryResourceTemplates };

function entryMatchesQuery(entry, query) {
  return matchesRegistryQuery(entry, query);
}

function searchTokens(query) {
  return tokenizeRegistrySearchQuery(query);
}

function entrySearchText(entry) {
  return normalizedRegistrySearchText(entry);
}

function rankSearchEntries(entries, query) {
  return rankRegistrySearchEntries(entries, query);
}

function entryMatchesPlatform(entry, platform) {
  return matchesRegistryPlatform(entry, platform);
}

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

  return {
    ok: true,
    count: entries.length,
    query: args.query || "",
    category: category || "",
    platform: platform || "",
    tag: tag || "",
    filters: trustFilters,
    entries,
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
      "entry.detail",
      "entry.trust",
      "entry.compare",
      "entry.asset",
    ],
    plannerNotes: [
      "This planner is metadata review only; it is not install approval or malware scanning, and it does not execute or install entries.",
      "Each entry carries an inline install block and the recommended stack is summarized in installPlan; still review trust before running anything.",
      "Recommendations are bounded and category-diverse where matching entries allow it.",
      "Prefer source-backed entries with safety/privacy notes for risk-bearing MCP, hooks, skills, commands, and statuslines.",
      "Use entry.detail, entry.trust, entry.compare, and entry.asset before relying on any entry.",
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
      "Best-match recommendations for the task; unlike workflow.plan they are not forced to span categories.",
      "This is metadata review only — it does not execute, install, or scan entries. Review trust before running anything.",
      "Use entry.compare to weigh the top picks and entry.trust before relying on any entry.",
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
      ? compatibility.find(
          (item) => normalizePlatform(item.platform) === platform,
        ) || null
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
        mimeType: JSON_MIME_TYPE,
      },
      ...categories.map((category) => ({
        uri: `heyclaude://category/${category}`,
        name: `HeyClaude ${category} category`,
        title: `HeyClaude ${category}`,
        description: `Generated public ${category} category summary entries.`,
        mimeType: JSON_MIME_TYPE,
      })),
      ...DISCOVERY_RESOURCES,
    ],
  };
}

export async function readRegistryResource(args = {}, options = {}) {
  const uri = String(args.uri || "");
  const resourcePayload = (payload) => ({
    contents: [
      {
        uri: uri || "heyclaude://error",
        mimeType: JSON_MIME_TYPE,
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

  if (platform !== "cursor") {
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
      platform: "cursor",
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
        ? compatibility.find(
            (item) => normalizePlatform(item.platform) === platform,
          ) || null
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
    const compatibility = buildSkillPlatformCompatibility(entry);
    entries.push({
      key: `${entry.category}:${entry.slug}`,
      category: entry.category,
      slug: entry.slug,
      title: entry.title,
      canonicalUrl: entryCanonicalUrl(entry),
      selectedCompatibility: platform
        ? compatibility.find(
            (item) => normalizePlatform(item.platform) === platform,
          ) || null
        : null,
      signalCoverage: entryTrustSignalCoverage(entry),
      trust: entryTrustSummary(entry),
    });
  }

  // Deterministic ordering: higher disclosed-metadata coverage first, then a
  // stable tiebreak on key so the ranking never depends on input order.
  const ranking = entries
    .map((entry) => ({ key: entry.key, score: entry.signalCoverage.score }))
    .sort((left, right) => {
      if (left.score !== right.score) return right.score - left.score;
      return left.key.localeCompare(right.key);
    })
    .map((item, index) => ({ ...item, rank: index + 1 }));

  // Signals that no compared entry discloses, so callers can ask for them.
  const sharedGaps = TRUST_SIGNAL_KEYS.filter((key) =>
    entries.every((entry) => entry.signalCoverage.missing.includes(key)),
  );

  return {
    ok: true,
    platform: platform || "",
    count: entries.length,
    signalKeys: TRUST_SIGNAL_KEYS,
    entries,
    ranking,
    bestDocumented: ranking[0]?.key || "",
    sharedGaps,
    comparisonNotes: [
      "Coverage counts disclosed trust metadata only; it is not a malware scan, a safety verdict, or installation approval.",
      "A higher coverage score means more trust metadata is present, not that an entry is safer or recommended to install.",
      "bestDocumented is the entry with the most disclosed trust metadata, not the safest entry.",
      "Inspect commands, requested permissions, external writes, and missing signals before relying on any entry.",
      "Use entry.trust for one entry's full trust breakdown and entry.asset only after trust review.",
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
