/**
 * Pure MCP registry stats helpers.
 *
 * Platform/tag counting, freshness metrics, source-signal tallies, and response
 * envelopes live here. Runtime registry handlers stay in `registry.js`.
 */

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Count platform and tag occurrences across registry entries.
 *
 * @param {Array<Record<string, unknown>>} entries
 * @returns {{ platformCounts: Map<string, number>, tagCounts: Map<string, number> }}
 */
export function countPlatformsAndTags(entries) {
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
  return { platformCounts, tagCounts };
}

/**
 * Compute registry freshness metrics from entry metadata.
 *
 * @param {Array<Record<string, unknown>>} entries
 * @param {number} [nowMs]
 * @returns {{ entriesWithRepoUpdatedAt: number, entriesAddedLast30Days: number }}
 */
export function computeRegistryFreshness(entries, nowMs = Date.now()) {
  return {
    entriesWithRepoUpdatedAt: entries.filter((entry) => entry.repoUpdatedAt)
      .length,
    entriesAddedLast30Days: entries.filter((entry) => {
      const added = Date.parse(entry.dateAdded || "");
      return Number.isFinite(added) && nowMs - added <= THIRTY_DAYS_MS;
    }).length,
  };
}

/**
 * Count source-signal coverage across registry entries.
 *
 * @param {Array<Record<string, unknown>>} entries
 * @returns {{ entriesWithGithubStats: number, installableEntries: number }}
 */
export function computeSourceSignalCounts(entries) {
  return {
    entriesWithGithubStats: entries.filter(
      (entry) => typeof entry.githubStars === "number",
    ).length,
    installableEntries: entries.filter((entry) => entry.installable).length,
  };
}

/**
 * Build the ok envelope for registry.stats.
 *
 * @param {{
 *   manifest: Record<string, unknown>,
 *   entries: Array<Record<string, unknown>>,
 *   packageName: string,
 *   packageVersion: string,
 * }} args
 * @returns {Record<string, unknown>}
 */
export function buildRegistryStatsResponse({
  manifest,
  entries,
  packageName,
  packageVersion,
}) {
  const { platformCounts, tagCounts } = countPlatformsAndTags(entries);
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
    freshness: computeRegistryFreshness(entries),
    sourceSignals: computeSourceSignalCounts(entries),
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
