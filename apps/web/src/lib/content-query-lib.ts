import type { CategorySummary, DirectoryEntry } from "@heyclaude/registry";

export const MAX_ENTRY_DETAIL_CACHE_SIZE = 512;

export function entryDetailCacheKey(category: string, slug: string) {
  return `${category}:${slug}`;
}

/** LRU-ish eviction: delete the oldest map entry when at capacity. */
export function pruneEntryDetailCache<K, V>(map: Map<K, V>, maxSize: number) {
  if (map.size >= maxSize) {
    const oldestKey = map.keys().next().value;
    if (oldestKey !== undefined) map.delete(oldestKey);
  }
}

export function buildCategorySummaries(
  entries: readonly DirectoryEntry[],
  categoryOrder: readonly string[],
  labels: Record<string, string>,
  descriptions: Record<string, string>,
): CategorySummary[] {
  return categoryOrder
    .map((category) => {
      const count = entries.filter((entry) => entry.category === category).length;
      return {
        category,
        label: labels[category],
        count,
        description: descriptions[category],
      };
    })
    .filter((entry) => entry.count > 0);
}

export function sortRecentDirectoryEntries<T extends { dateAdded?: string | null }>(
  entries: readonly T[],
  limit = 12,
): T[] {
  return [...entries]
    .filter((entry) => entry.dateAdded)
    .sort((left, right) => String(right.dateAdded).localeCompare(String(left.dateAdded)))
    .slice(0, limit);
}
