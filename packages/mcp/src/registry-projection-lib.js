import { intersection } from "./registry-collection-lib.js";
import { notes } from "./registry-response-lib.js";
import {
  entryCanonicalUrl,
  entrySourceHosts,
  entryTrustSummary,
} from "./registry-trust-lib.js";

export function unwrapEntries(payload) {
  if (!payload || !Array.isArray(payload.entries)) {
    throw new Error("Expected registry artifact envelope with entries array.");
  }
  return payload.entries;
}

export function entryUpdatedAt(entry) {
  return String(
    entry.repoUpdatedAt || entry.updatedAt || entry.dateAdded || "",
  );
}

export function toSearchResult(entry, ranking = null) {
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

export function toEntrySummary(entry) {
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

export function scoreRelatedEntry(target, candidate) {
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
      ...sharedKeywords.map((keyword) => `keyword:${keyword}`),
      ...sharedPlatforms.map((platform) => `platform:${platform}`),
      ...sharedHosts.map((host) => `source:${host}`),
    ],
  };
}
