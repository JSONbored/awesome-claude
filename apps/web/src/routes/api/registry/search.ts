import { createApiFileRoute } from "@/lib/api/file-route";

import { registrySearchQuerySchema } from "@/lib/api/contracts";
import { computeRegistrySearchFacets } from "@/lib/api/registry-search-facets";
import {
  filterEntries,
  rankSearchEntries,
  type RegistrySearchFilterState,
} from "@/lib/api/registry-search-filters";
import { createApiHandler, type InferApiQuery } from "@/lib/api/router";
import { getSearchIndex } from "@/lib/content.server";
import { cachedJsonResponse } from "@/lib/http-cache";

const MAX_OFFSET = 10_000;

export const GET = createApiHandler("registry.search", async ({ request, query: parsedQuery }) => {
  const {
    q: query,
    category,
    platform,
    hasSafetyNotes,
    hasPrivacyNotes,
    downloadTrust,
    claimStatus: requestedClaimStatus,
    sourceStatus: requestedSourceStatus,
    limit,
    offset,
  } = parsedQuery as InferApiQuery<typeof registrySearchQuerySchema>;

  const filters: RegistrySearchFilterState = {
    query,
    category,
    platform,
    hasSafetyNotes,
    hasPrivacyNotes,
    downloadTrust,
    claimStatus: requestedClaimStatus,
    sourceStatus: requestedSourceStatus,
  };

  const entries = await getSearchIndex();
  const matched = filterEntries(entries, filters);
  const ranked = rankSearchEntries(matched, query);
  const results = ranked.slice(offset, offset + limit).map((item) => ({
    ...item.entry,
    searchScore: item.score,
    searchReasons: item.reasons,
  }));
  const facets = computeRegistrySearchFacets(entries, filters);
  const pageEnd = Math.min(offset + limit, matched.length);
  const nextOffset = Math.min(pageEnd, MAX_OFFSET);

  return cachedJsonResponse(
    request,
    {
      schemaVersion: 1,
      query,
      category: category || "all",
      platform: platform || "all",
      filters: {
        hasSafetyNotes,
        hasPrivacyNotes,
        downloadTrust,
        claimStatus: requestedClaimStatus,
        sourceStatus: requestedSourceStatus,
      },
      count: results.length,
      total: matched.length,
      limit,
      offset,
      nextOffset:
        nextOffset !== offset && nextOffset === pageEnd && nextOffset < matched.length
          ? nextOffset
          : null,
      results,
      facets,
    },
    {
      headers: {
        "cache-control": "public, max-age=60, stale-while-revalidate=600",
      },
    },
  );
});

export const Route = createApiFileRoute("/api/registry/search")({
  server: {
    handlers: {
      GET: async ({ request, params }) => GET(request, { params }),
    },
  },
});
