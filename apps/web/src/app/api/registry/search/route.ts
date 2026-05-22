import { registrySearchQuerySchema } from "@/lib/api/contracts";
import { computeRegistrySearchFacets } from "@/lib/api/registry-search-facets";
import {
  filterEntries,
  type RegistrySearchFilterState,
} from "@/lib/api/registry-search-filters";
import { createApiHandler, type InferApiQuery } from "@/lib/api/router";
import { getSearchIndex } from "@/lib/content";
import { cachedJsonResponse } from "@/lib/http-cache";

export const GET = createApiHandler(
  "registry.search",
  async ({ request, query: parsedQuery }) => {
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
    const results = matched.slice(0, limit);
    const facets = computeRegistrySearchFacets(entries, filters);

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
        results,
        facets,
      },
      {
        headers: {
          "cache-control": "public, max-age=60, stale-while-revalidate=600",
        },
      },
    );
  },
);
