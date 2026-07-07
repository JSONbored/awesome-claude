/**
 * Pure MCP registry entry comparison helpers.
 *
 * Compare-row shaping, shared tag intersection, and response envelopes live
 * here. Runtime registry handlers stay in `registry.js`.
 */
import { intersection } from "./registry-collection-lib.js";

export const COMPARE_ENTRIES_NOTES = [
  "Prefer exact category fit before source popularity.",
  "Treat GitHub stars/forks as source signals only when present; absence is not a negative ranking.",
  "Install complexity is derived from available install/config/download/prerequisite metadata.",
  "Safety/privacy notes are disclosure metadata, not a malware verdict.",
];

/**
 * Build one compared-entry row for entry.compare.
 *
 * @param {Record<string, unknown>} entry
 * @param {string} platform
 * @param {Record<string, Function>} deps
 * @returns {Record<string, unknown>}
 */
export function buildCompareEntryRow(entry, platform, deps) {
  const {
    normalizePlatform,
    buildSkillPlatformCompatibility,
    entryInstallComplexity,
    categoryPrimaryAsset,
    sourceSummary,
    entryTrustSummary,
    entryCanonicalUrl,
  } = deps;
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
}

/**
 * Intersect tags across compared entries.
 *
 * @param {Array<Record<string, unknown>>} comparedEntries
 * @returns {string[]}
 */
export function sharedCompareTags(comparedEntries) {
  if (!comparedEntries.length) return [];
  return comparedEntries
    .slice(1)
    .reduce(
      (tags, entry) => intersection(tags, entry.tags || []),
      comparedEntries[0].tags || [],
    );
}

/**
 * Build the ok envelope for entry.compare.
 *
 * @param {{ platform: string, compared: Array<Record<string, unknown>> }} args
 * @returns {Record<string, unknown>}
 */
export function buildCompareEntriesResponse({ platform, compared }) {
  return {
    ok: true,
    platform: platform || "",
    count: compared.length,
    sharedTags: sharedCompareTags(compared),
    entries: compared,
    comparisonNotes: COMPARE_ENTRIES_NOTES,
  };
}
