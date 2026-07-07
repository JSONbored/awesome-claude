/**
 * Pure response-building helpers for MCP registry tool handlers.
 */

export const DISCOVERY_RESOURCE_LIMIT = 25;

export function buildSearchRegistryResponse({
  entries,
  args,
  category,
  platform,
  tag,
  trustFilters,
}) {
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

export function buildInstallPlanFromEntries(entries) {
  return entries
    .filter((entry) => entry.install?.installCommand)
    .map((entry) => ({
      key: entry.key,
      title: entry.title,
      category: entry.category,
      installCommand: entry.install.installCommand,
    }));
}

export function buildPlanWorkflowResponse({
  goal,
  category,
  platform,
  selected,
  installPlan,
  categoryMix,
  trustSummary,
}) {
  return {
    ok: true,
    goal,
    category: category || "",
    platform: platform || "",
    count: selected.length,
    entries: selected,
    installPlan,
    categoryMix,
    trustSummary,
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

export function buildRecommendForTaskResponse({
  task,
  category,
  platform,
  recommendations,
  installPlan,
  trustSummary,
}) {
  return {
    ok: true,
    task,
    category: category || "",
    platform: platform || "",
    count: recommendations.length,
    topPick: recommendations[0]?.key || "",
    recommendations,
    installPlan,
    trustSummary,
    notes: [
      "Best-match recommendations for the task; unlike workflow.plan they are not forced to span categories.",
      "This is metadata review only — it does not execute, install, or scan entries. Review trust before running anything.",
      "Use entry.compare to weigh the top picks and entry.trust before relying on any entry.",
    ],
  };
}

export function buildCategoryEntriesPageResponse({
  entries,
  category,
  platform,
  tag,
  query,
  offset,
  limit,
  page,
}) {
  return {
    ok: true,
    category: category || "",
    platform: platform || "",
    tag: tag || "",
    query: query || "",
    total: entries.length,
    count: page.length,
    offset,
    limit,
    nextOffset: offset + limit < entries.length ? offset + limit : null,
    entries: page,
  };
}

export function sortEntriesByUpdatedAt(entries, entryUpdatedAt) {
  return entries.slice().sort((left, right) => {
    const dateCompare = entryUpdatedAt(right).localeCompare(
      entryUpdatedAt(left),
    );
    if (dateCompare !== 0) return dateCompare;
    return String(left.title || "").localeCompare(String(right.title || ""));
  });
}

export function buildRecentUpdatesResponse({ category, since, entries }) {
  return {
    ok: true,
    category: category || "",
    since,
    count: entries.length,
    entries,
  };
}

export function mapRecentUpdateEntries(
  entries,
  toEntrySummary,
  entryUpdatedAt,
) {
  return entries.map((entry) => ({
    ...toEntrySummary(entry),
    updatedAt: entryUpdatedAt(entry),
    updateKind: entry.repoUpdatedAt ? "upstream_update" : "added",
  }));
}

export function buildRelatedEntriesGraphResponse({ target, entries, limit }) {
  return {
    ok: true,
    key: `${target.category}:${target.slug}`,
    relationGraph: true,
    count: entries.length,
    entries: entries.slice(0, limit),
  };
}

export function buildRelatedEntriesScoredResponse({ target, entries, limit }) {
  return {
    ok: true,
    key: `${target.category}:${target.slug}`,
    count: entries.length,
    entries: entries.slice(0, limit),
  };
}

export function resolveGraphRelatedEntries({
  graphRow,
  searchIndex,
  toEntrySummary,
  limit,
}) {
  if (!graphRow?.related?.length) return null;
  const searchByKey = new Map(
    searchIndex.map((entry) => [`${entry.category}:${entry.slug}`, entry]),
  );
  return graphRow.related
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
    .filter(Boolean);
}

export function buildDiscoveryRecentResponse({
  entries,
  toEntrySummary,
  entryUpdatedAt,
  limit = DISCOVERY_RESOURCE_LIMIT,
}) {
  const sorted = sortEntriesByUpdatedAt(entries, entryUpdatedAt);
  const mapped = mapRecentUpdateEntries(
    sorted.slice(0, limit),
    toEntrySummary,
    entryUpdatedAt,
  );
  return {
    ok: true,
    kind: "registry-recent",
    schemaVersion: 1,
    limit,
    count: mapped.length,
    entries: mapped,
  };
}

export function buildTrendingResourceResponse({
  payload,
  entries,
  limit = DISCOVERY_RESOURCE_LIMIT,
}) {
  return {
    ok: true,
    kind: "registry-trending",
    schemaVersion: payload?.schemaVersion ?? 1,
    category: payload?.category || "all",
    platform: payload?.platform || "all",
    limit,
    count: entries.length,
    signalsAvailable:
      payload?.signalsAvailable && typeof payload.signalsAvailable === "object"
        ? payload.signalsAvailable
        : null,
    source: "public-api",
    entries,
  };
}

export function buildJobsActiveResourceResponse({
  payload,
  entries,
  limit = DISCOVERY_RESOURCE_LIMIT,
}) {
  return {
    ok: true,
    kind: "jobs-active",
    schemaVersion: payload?.schemaVersion ?? 1,
    limit,
    count: entries.length,
    totalAvailable:
      typeof payload?.totalAvailable === "number"
        ? payload.totalAvailable
        : null,
    source: "public-api",
    entries,
  };
}

export function buildRegistryResourcePayload(
  uri,
  payload,
  jsonMimeType,
  withPublicPolicy,
) {
  return {
    contents: [
      {
        uri: uri || "heyclaude://error",
        mimeType: jsonMimeType,
        text: JSON.stringify(withPublicPolicy(payload), null, 2),
      },
    ],
  };
}

export function buildCategoryResourcePayload(
  category,
  entries,
  toEntrySummary,
) {
  const summaries = entries
    .filter((entry) => entry.category === category)
    .map(toEntrySummary);
  return {
    ok: true,
    category,
    total: summaries.length,
    entries: summaries,
  };
}

export function buildListRegistryResourcesResponse({
  manifest,
  categories,
  discoveryResources,
  jsonMimeType,
}) {
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
      ...discoveryResources,
    ],
  };
}

export function buildInstallGuidanceResponse({
  entry,
  platform,
  selectedCompatibility,
  compatibility,
  entryCanonicalUrl,
  entryTrustSummary,
  notes,
}) {
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

export function buildPlatformAdapterUnavailableResponse(platform, slug) {
  return {
    ok: true,
    platform,
    slug,
    adapterAvailable: false,
    message:
      "Native Agent Skill platforms use the SKILL.md package directly; generated adapters are currently provided for Cursor rules.",
  };
}

export function buildPlatformAdapterAvailableResponse(slug, adapter) {
  return {
    ok: true,
    platform: "cursor",
    slug,
    adapterAvailable: true,
    adapterPath: `/data/skill-adapters/cursor/${slug}.mdc`,
    content: adapter,
  };
}

export function buildCompatibilityResponse(entry) {
  return {
    ok: true,
    key: `${entry.category}:${entry.slug}`,
    category: entry.category,
    slug: entry.slug,
    platformCompatibility: entry.platformCompatibility,
  };
}

export function buildExplainEntryTrustResponse({
  entry,
  entryCanonicalUrl,
  entryTrustSummary,
}) {
  return {
    ok: true,
    key: `${entry.category}:${entry.slug}`,
    title: entry.title,
    canonicalUrl: entryCanonicalUrl(entry),
    trust: entryTrustSummary(entry),
  };
}

export function buildDistributionFeedsResponse({
  manifest,
  feedIndex,
  platformFeedSlug,
}) {
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

export function paginateEntries(entries, offset, limit) {
  return entries.slice(offset, offset + limit);
}

export function computeNextOffset(total, offset, limit) {
  return offset + limit < total ? offset + limit : null;
}
