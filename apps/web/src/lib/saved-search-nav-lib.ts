// Pure mapping from a saved search to the /browse route's search-params shape,
// split out of saved-search-manager.tsx so it can be unit-tested without React
// Router.

import type { SavedSearch } from "@/lib/recents";

/**
 * Build the `/browse` search params for a saved search: each filter defaults to
 * an empty string when absent, `sort` falls back to "popular", and the results
 * always open in the row view with no active comparison.
 */
export function applyToBrowseSearch(s: SavedSearch) {
  return {
    q: s.q ?? "",
    category: s.category ?? "",
    trust: s.trust ?? "",
    source: s.source ?? "",
    platform: s.platform ?? "",
    sort: (s.sort as "popular" | "newest" | "title") ?? "popular",
    view: "row" as const,
    compare: "",
  };
}
