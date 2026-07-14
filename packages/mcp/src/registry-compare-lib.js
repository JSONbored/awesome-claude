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
  const [first, ...rest] = comparedEntries;
  const firstTags = first.tags || [];
  // Intersect case-insensitively across every entry to find the shared keys...
  const sharedKeys = new Set(
    rest.reduce(
      (keys, entry) => intersection(keys, entry.tags || []),
      firstTags.map((tag) => String(tag).trim().toLowerCase()),
    ),
  );
  // ...but emit the first entry's original-cased tags (matching each row's
  // `tags`), deduped. This keeps sharedTags consistent with the displayed tags
  // and identical in shape for one vs. many entries.
  const seen = new Set();
  return firstTags.filter((tag) => {
    const key = String(tag).trim().toLowerCase();
    if (!key || !sharedKeys.has(key) || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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
