import type { SearchDocument } from "@heyclaude/registry";

import {
  claimStatusValue,
  entryMatchesFilters,
  hasPrivacyNotes,
  hasSafetyNotes,
  packageTrustValue,
  sourceStatusValue,
  type RegistrySearchFilterDimension,
  type RegistrySearchFilterState,
} from "./registry-search-filters";

export type RegistrySearchFacetBuckets = Record<string, number>;

export type RegistrySearchFacets = {
  categories: RegistrySearchFacetBuckets;
  platforms: RegistrySearchFacetBuckets;
  hasSafetyNotes: RegistrySearchFacetBuckets;
  hasPrivacyNotes: RegistrySearchFacetBuckets;
  downloadTrust: RegistrySearchFacetBuckets;
  claimStatus: RegistrySearchFacetBuckets;
  sourceStatus: RegistrySearchFacetBuckets;
};

const MAX_PLATFORM_BUCKETS = 32;
const MAX_CATEGORY_BUCKETS = 32;

function increment(buckets: RegistrySearchFacetBuckets, key: string) {
  if (!key) return;
  buckets[key] = (buckets[key] ?? 0) + 1;
}

function sortBuckets(
  buckets: RegistrySearchFacetBuckets,
  limit?: number,
): RegistrySearchFacetBuckets {
  const entries = Object.entries(buckets).sort((a, b) => {
    if (a[1] !== b[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });
  const trimmed = typeof limit === "number" ? entries.slice(0, limit) : entries;
  return Object.fromEntries(trimmed);
}

function tally(
  entries: ReadonlyArray<SearchDocument>,
  filters: RegistrySearchFilterState,
  dimension: RegistrySearchFilterDimension,
  bucketFor: (entry: SearchDocument) => string | ReadonlyArray<string>,
): RegistrySearchFacetBuckets {
  const except = new Set<RegistrySearchFilterDimension>([dimension]);
  const buckets: RegistrySearchFacetBuckets = {};
  for (const entry of entries) {
    if (!entryMatchesFilters(entry, filters, except)) continue;
    const bucket = bucketFor(entry);
    if (Array.isArray(bucket)) {
      for (const value of bucket) increment(buckets, value);
    } else if (typeof bucket === "string") {
      increment(buckets, bucket);
    }
  }
  return buckets;
}

function normalizedPlatforms(entry: SearchDocument): ReadonlyArray<string> {
  return (entry.platforms ?? [])
    .map((value) => String(value).trim().toLowerCase())
    .filter((value) => value.length > 0);
}

export function computeRegistrySearchFacets(
  entries: ReadonlyArray<SearchDocument>,
  filters: RegistrySearchFilterState,
): RegistrySearchFacets {
  const categories = tally(entries, filters, "category", (entry) =>
    entry.category ? entry.category : "",
  );
  const platforms = tally(
    entries,
    filters,
    "platform",
    (entry) => normalizedPlatforms(entry),
  );
  const safety = tally(entries, filters, "hasSafetyNotes", (entry) =>
    hasSafetyNotes(entry) ? "true" : "false",
  );
  const privacy = tally(entries, filters, "hasPrivacyNotes", (entry) =>
    hasPrivacyNotes(entry) ? "true" : "false",
  );
  const downloadTrust = tally(entries, filters, "downloadTrust", (entry) =>
    packageTrustValue(entry),
  );
  const claimStatus = tally(entries, filters, "claimStatus", (entry) =>
    claimStatusValue(entry),
  );
  const sourceStatus = tally(entries, filters, "sourceStatus", (entry) =>
    sourceStatusValue(entry),
  );

  return {
    categories: sortBuckets(categories, MAX_CATEGORY_BUCKETS),
    platforms: sortBuckets(platforms, MAX_PLATFORM_BUCKETS),
    hasSafetyNotes: sortBuckets(safety),
    hasPrivacyNotes: sortBuckets(privacy),
    downloadTrust: sortBuckets(downloadTrust),
    claimStatus: sortBuckets(claimStatus),
    sourceStatus: sortBuckets(sourceStatus),
  };
}
