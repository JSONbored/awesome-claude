// Pure serialization of a saved-search list into a stable signature string,
// split out of the watch provider so the change-detection key can be unit-tested
// without React. The type-only import keeps this decoupled at runtime.

import type { SavedSearchAlertSearch } from "@/lib/saved-search-alerts";

/**
 * Escape the `\t` / `\n` delimiters (and the `\` escape character itself) so a
 * field's content cannot shift across a field or entry boundary and forge
 * another list's signature. Fields containing none of these characters are
 * returned unchanged, so existing delimiter-free signatures stay identical.
 */
function escapeField(value: string | undefined): string {
  return (value ?? "").replaceAll("\\", "\\\\").replaceAll("\t", "\\t").replaceAll("\n", "\\n");
}

/**
 * Stable, tab/newline-delimited signature of the alert-relevant fields of each
 * saved search. Used as a memo/effect key so the watch provider only refetches
 * when a search's alert configuration actually changes. Each field is
 * delimiter-escaped first, so content cannot shift across a boundary and make
 * two different configurations share a signature.
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
      ]
        .map(escapeField)
        .join("\t"),
    )
    .join("\n");
}
