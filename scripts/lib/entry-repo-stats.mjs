// Pure projection behind scripts/build-content-index.mjs: turn a previously
// generated entry-detail JSON payload into a [key, repoStats] pair for the
// carry-forward stats map, so a regeneration can reuse GitHub star/fork/updated
// values without refetching. Split out from the filesystem walk so the payload
// shaping can be unit-tested.

/**
 * Map an entry-detail payload to `["<category>:<slug>", { stars, forks,
 * updatedAt }]`, or null when the payload has no usable entry (missing
 * category/slug). Each stat is carried only when it has the expected type.
 */
export function entryRepoStatsEntry(payload) {
  const entry = payload?.entry;
  if (!entry?.category || !entry?.slug) return null;
  return [
    `${entry.category}:${entry.slug}`,
    {
      stars:
        typeof entry.githubStars === "number" ? entry.githubStars : undefined,
      forks:
        typeof entry.githubForks === "number" ? entry.githubForks : undefined,
      updatedAt:
        typeof entry.repoUpdatedAt === "string"
          ? entry.repoUpdatedAt
          : undefined,
    },
  ];
}
