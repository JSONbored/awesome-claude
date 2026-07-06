import { entryCanonicalUrl } from "./registry-trust-lib.js";

/**
 * Normalize a raw `/api/registry/trending` entry into the small, stable
 * shape published by the MCP `registry/trending` resource. Defends against
 * upstream field churn (missing arrays, non-numeric scores, dropped
 * `trustSignals`) so MCP clients see a predictable schema.
 *
 * @param {Record<string, unknown> & { category: string, slug: string }} entry
 * @returns {Record<string, unknown>} Normalized trending entry.
 */
export function toTrendingEntry(entry) {
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
 * Normalize a raw `/api/jobs` entry into the small, stable shape published
 * by the MCP `jobs/active` resource. Defends against upstream field churn
 * and never exposes private/admin-only fields (we only project the public
 * subset already returned by `buildPublicJobsIndex`).
 *
 * @param {Record<string, unknown>} job
 * @returns {Record<string, unknown>} Normalized public job entry.
 */
export function toJobEntry(job) {
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
