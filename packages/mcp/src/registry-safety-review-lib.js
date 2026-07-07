/**
 * Pure MCP registry safety review helpers.
 *
 * Safety-review row shaping, summary tallies, and response envelopes live
 * here. Runtime registry handlers stay in `registry.js`.
 */

export const SAFETY_REVIEW_NOTES = [
  "This is a metadata review, not a malware scan or install verdict.",
  "Prefer source-backed entries and first-party maintainer-built downloads when installing packages.",
  "Inspect commands, requested permissions, and external writes before running any copied content.",
];

/**
 * Build one safety-review row for entry.safety.
 *
 * @param {Record<string, unknown>} entry
 * @param {string} platform
 * @param {Record<string, Function>} deps
 * @returns {Record<string, unknown>}
 */
export function buildSafetyReviewRow(entry, platform, deps) {
  const {
    normalizePlatform,
    buildSkillPlatformCompatibility,
    entryCanonicalUrl,
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
    trust: entryTrustSummary(entry),
  };
}

/**
 * Summarize safety-review metadata across compared entries.
 *
 * @param {Array<Record<string, unknown>>} entries
 * @returns {Record<string, number>}
 */
export function summarizeSafetyReview(entries) {
  const entriesWithNotes = entries.filter(
    (entry) =>
      entry.trust.disclosures.hasSafetyNotes ||
      entry.trust.disclosures.hasPrivacyNotes,
  );
  return {
    entriesWithSafetyOrPrivacyNotes: entriesWithNotes.length,
    firstPartyPackages: entries.filter(
      (entry) => entry.trust.package.downloadTrust === "first-party",
    ).length,
    sourceBacked: entries.filter(
      (entry) => entry.trust.source.status === "available",
    ).length,
  };
}

/**
 * Build the ok envelope for entry.safety.
 *
 * @param {{ platform: string, entries: Array<Record<string, unknown>> }} args
 * @returns {Record<string, unknown>}
 */
export function buildSafetyReviewResponse({ platform, entries }) {
  return {
    ok: true,
    platform: platform || "",
    count: entries.length,
    entries,
    summary: summarizeSafetyReview(entries),
    reviewNotes: SAFETY_REVIEW_NOTES,
  };
}
