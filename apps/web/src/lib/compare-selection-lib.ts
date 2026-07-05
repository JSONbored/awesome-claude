/**
 * Pure compare-selection helpers.
 *
 * Maintains the "entries queued for comparison" list from URL params and toggle
 * actions. Nothing here touches the network or the DOM — given the same inputs
 * the output is deterministic.
 *
 * The public surface (`compare-selection.ts` / `@/lib/compare-selection`)
 * re-exports everything below so existing imports stay unchanged.
 */

import { entryRef, parseEntryRef, sameEntry, type EntryIdentity } from "@/lib/entry-identity";

export const DEFAULT_COMPARE_LIMIT = 4;

export function hasCompareItem(items: EntryIdentity[], entry: EntryIdentity) {
  return items.some((item) => sameEntry(item, entry));
}

export function toggleCompareItem<T extends EntryIdentity>(
  items: T[],
  entry: T,
  limit = DEFAULT_COMPARE_LIMIT,
): T[] {
  if (hasCompareItem(items, entry)) {
    return items.filter((item) => !sameEntry(item, entry));
  }
  if (items.length >= limit) return items;
  return [...items, entry];
}

export function serializeCompareItems(items: EntryIdentity[]) {
  return items.map(entryRef).join(",");
}

export function resolveCompareParam<T extends EntryIdentity>(
  entries: T[],
  param: string,
  limit = DEFAULT_COMPARE_LIMIT,
): T[] {
  if (!param) return [];

  const refs = param
    .split(",")
    .map((value) => parseEntryRef(value.trim()))
    .filter((ref): ref is EntryIdentity => Boolean(ref));

  const seen = new Set<string>();
  const out: T[] = [];
  for (const ref of refs) {
    if (out.length >= limit) break;
    const key = entryRef(ref);
    if (seen.has(key)) continue;
    const entry = entries.find((candidate) => sameEntry(candidate, ref));
    if (entry) {
      out.push(entry);
      seen.add(key);
    }
  }
  return out;
}
