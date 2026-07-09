// Pure extraction of a saved-search query from URL params, split out of the
// per-slug feed route so the param mapping can be unit-tested without the
// handler. The type-only import keeps this decoupled from the feed runtime.

import type { SavedSearchQuery } from "@/lib/feeds";

/** Build a SavedSearchQuery from feed URL params (absent params -> undefined). */
export function savedSearchQueryFromParams(params: URLSearchParams): SavedSearchQuery {
  return {
    q: params.get("q") ?? undefined,
    category: params.get("category") ?? undefined,
    trust: params.get("trust") ?? undefined,
    source: params.get("source") ?? undefined,
    platform: params.get("platform") ?? undefined,
  };
}
