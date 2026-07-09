// Pure serialization of a saved-search list into a stable signature string,
// split out of the watch provider so the change-detection key can be unit-tested
// without React. The type-only import keeps this decoupled at runtime.

import type { SavedSearchAlertSearch } from "@/lib/saved-search-alerts";

/**
 * Stable, tab/newline-delimited signature of the alert-relevant fields of each
 * saved search. Used as a memo/effect key so the watch provider only refetches
 * when a search's alert configuration actually changes.
 */
export function savedSearchSignature(searches: SavedSearchAlertSearch[]): string {
  return searches
    .map((search) =>
      [
        search.id,
        search.label,
        search.q,
        search.category,
        search.trust,
        search.source,
        search.platform,
        search.alerts?.enabled ? "1" : "0",
        search.alerts?.channels?.join(",") ?? "",
      ].join("\t"),
    )
    .join("\n");
}
