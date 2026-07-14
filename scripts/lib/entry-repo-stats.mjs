// Pure projection behind scripts/build-content-index.mjs: turn a previously
// generated entry-detail JSON payload into a [key, repoStats] pair for the
// carry-forward stats map, so a regeneration can reuse GitHub star/fork/updated
// values without refetching. Split out from the filesystem walk so the payload
// shaping can be unit-tested.

/**
 * Project GitHub repo stats off any source object (an entry or the site-stats
 * payload) into `{ stars, forks, updatedAt }`, carrying each value only when it
 * has the expected type.
 */
export function pickRepoStats(source) {
  const s = source ?? {};
  return {
    stars: typeof s.githubStars === "number" ? s.githubStars : undefined,
    forks: typeof s.githubForks === "number" ? s.githubForks : undefined,
    updatedAt:
      typeof s.repoUpdatedAt === "string" ? s.repoUpdatedAt : undefined,
  };
}

/**
 * Map an entry-detail payload to `["<category>:<slug>", { stars, forks,
 * updatedAt }]`, or null when the payload has no usable entry (missing
 * category/slug).
 */
export function entryRepoStatsEntry(payload) {
  const entry = payload?.entry;
  if (!entry?.category || !entry?.slug) return null;
  return [`${entry.category}:${entry.slug}`, pickRepoStats(entry)];
}
