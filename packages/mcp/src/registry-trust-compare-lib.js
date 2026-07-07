/**
 * Pure MCP registry trust comparison helpers.
 *
 * Trust-compare row shaping, ranking, shared gap detection, and response
 * envelopes live here. Runtime registry handlers stay in `registry.js`.
 */

export const TRUST_COMPARE_NOTES = [
  "Coverage counts disclosed trust metadata only; it is not a malware scan, a safety verdict, or installation approval.",
  "A higher coverage score means more trust metadata is present, not that an entry is safer or recommended to install.",
  "bestDocumented is the entry with the most disclosed trust metadata, not the safest entry.",
  "Inspect commands, requested permissions, external writes, and missing signals before relying on any entry.",
  "Use entry.trust for one entry's full trust breakdown and entry.asset only after trust review.",
];

/**
 * Build one trust-compare row for entry.trust_compare.
 *
 * @param {Record<string, unknown>} entry
 * @param {string} platform
 * @param {Record<string, Function>} deps
 * @returns {Record<string, unknown>}
 */
export function buildTrustCompareRow(entry, platform, deps) {
  const {
    normalizePlatform,
    buildSkillPlatformCompatibility,
    entryCanonicalUrl,
    entryTrustSignalCoverage,
    entryTrustSummary,
  } = deps;
  const compatibility = buildSkillPlatformCompatibility(entry);
  return {
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
  };
}

/**
 * Rank trust-compare entries by disclosed-metadata coverage.
 *
 * @param {Array<Record<string, unknown>>} entries
 * @returns {Array<{ key: string, score: number, rank: number }>}
 */
export function rankTrustCompareEntries(entries) {
  return entries
    .map((entry) => ({ key: entry.key, score: entry.signalCoverage.score }))
    .sort((left, right) => {
      if (left.score !== right.score) return right.score - left.score;
      return left.key.localeCompare(right.key);
    })
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

/**
 * Find trust signals that every compared entry is missing.
 *
 * @param {Array<Record<string, unknown>>} entries
 * @param {string[]} signalKeys
 * @returns {string[]}
 */
export function sharedTrustSignalGaps(entries, signalKeys) {
  return signalKeys.filter((key) =>
    entries.every((entry) => entry.signalCoverage.missing.includes(key)),
  );
}

/**
 * Build the ok envelope for entry.trust_compare.
 *
 * @param {{
 *   platform: string,
 *   entries: Array<Record<string, unknown>>,
 *   ranking: Array<{ key: string, score: number, rank: number }>,
 *   sharedGaps: string[],
 *   signalKeys: string[],
 * }} args
 * @returns {Record<string, unknown>}
 */
export function buildTrustCompareResponse({
  platform,
  entries,
  ranking,
  sharedGaps,
  signalKeys,
}) {
  return {
    ok: true,
    platform: platform || "",
    count: entries.length,
    signalKeys,
    entries,
    ranking,
    bestDocumented: ranking[0]?.key || "",
    sharedGaps,
    comparisonNotes: TRUST_COMPARE_NOTES,
  };
}
