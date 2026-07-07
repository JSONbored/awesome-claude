import type { SearchDocument } from "@heyclaude/registry";
import {
  entryClaimStatusValue,
  entryHasPrivacyNotes,
  entryHasSafetyNotes,
  entryIsInstallable,
  entryPackageTrustValue,
  entrySourceStatusValue,
  matchesRegistryPlatform,
  matchesRegistryQuery,
  rankRegistrySearchEntries,
  scoreRegistrySearchEntry,
} from "@heyclaude/mcp/search-ranking";

export type BooleanFilterValue = "all" | "true" | "false";

export type DownloadTrustFilterValue = "all" | "first-party" | "external" | "none";

export type ClaimStatusFilterValue = "all" | "unclaimed" | "pending" | "verified";

export type SourceStatusFilterValue = "all" | "available" | "missing";

export type RegistrySearchFilterState = {
  query: string;
  category: string;
  platform: string;
  installable: BooleanFilterValue;
  hasSafetyNotes: BooleanFilterValue;
  hasPrivacyNotes: BooleanFilterValue;
  downloadTrust: DownloadTrustFilterValue;
  claimStatus: ClaimStatusFilterValue;
  sourceStatus: SourceStatusFilterValue;
};

export type RegistrySearchFilterDimension =
  | "query"
  | "category"
  | "platform"
  | "installable"
  | "hasSafetyNotes"
  | "hasPrivacyNotes"
  | "downloadTrust"
  | "claimStatus"
  | "sourceStatus";

export function matchesQuery(entry: SearchDocument, query: string) {
  return matchesRegistryQuery(entry, query);
}

export function matchesPlatform(entry: SearchDocument, platform: string) {
  return matchesRegistryPlatform(entry, platform);
}

export function matchesBooleanFilter(value: boolean, filter: BooleanFilterValue) {
  if (filter === "all") return true;
  return filter === "true" ? value : !value;
}

export function hasSafetyNotes(entry: SearchDocument) {
  return entryHasSafetyNotes(entry);
}

export function hasPrivacyNotes(entry: SearchDocument) {
  return entryHasPrivacyNotes(entry);
}

export function isInstallable(entry: SearchDocument) {
  return entryIsInstallable(entry);
}

export function packageTrustValue(entry: SearchDocument) {
  return entryPackageTrustValue(entry);
}

export function sourceStatusValue(entry: SearchDocument) {
  return entrySourceStatusValue(entry);
}

export function claimStatusValue(entry: SearchDocument) {
  return entryClaimStatusValue(entry);
}

export function entryMatchesFilters(
  entry: SearchDocument,
  filters: RegistrySearchFilterState,
  except?: ReadonlySet<RegistrySearchFilterDimension>,
) {
  const skip = (dimension: RegistrySearchFilterDimension) => except?.has(dimension) === true;

  if (!skip("category") && filters.category && entry.category !== filters.category) {
    return false;
  }
  if (!skip("platform") && !matchesPlatform(entry, filters.platform)) {
    return false;
  }
  if (!skip("installable") && !matchesBooleanFilter(isInstallable(entry), filters.installable)) {
    return false;
  }
  if (
    !skip("hasSafetyNotes") &&
    !matchesBooleanFilter(hasSafetyNotes(entry), filters.hasSafetyNotes)
  ) {
    return false;
  }
  if (
    !skip("hasPrivacyNotes") &&
    !matchesBooleanFilter(hasPrivacyNotes(entry), filters.hasPrivacyNotes)
  ) {
    return false;
  }
  if (
    !skip("downloadTrust") &&
    filters.downloadTrust !== "all" &&
    packageTrustValue(entry) !== filters.downloadTrust
  ) {
    return false;
  }
  if (
    !skip("claimStatus") &&
    filters.claimStatus !== "all" &&
    claimStatusValue(entry) !== filters.claimStatus
  ) {
    return false;
  }
  if (
    !skip("sourceStatus") &&
    filters.sourceStatus !== "all" &&
    sourceStatusValue(entry) !== filters.sourceStatus
  ) {
    return false;
  }
  if (!skip("query") && !matchesQuery(entry, filters.query)) {
    return false;
  }
  return true;
}

export function filterEntries(
  entries: ReadonlyArray<SearchDocument>,
  filters: RegistrySearchFilterState,
) {
  return entries.filter((entry) => entryMatchesFilters(entry, filters));
}

export type RankedSearchEntry = {
  entry: SearchDocument;
  score: number;
  reasons: string[];
};

export function scoreSearchEntry(
  entry: SearchDocument,
  query: string,
): Omit<RankedSearchEntry, "entry"> {
  return scoreRegistrySearchEntry(entry, query);
}

export function rankSearchEntries(
  entries: ReadonlyArray<SearchDocument>,
  query: string,
): RankedSearchEntry[] {
  return rankRegistrySearchEntries(entries, query).map(({ entry, score, reasons }) => ({
    entry,
    score,
    reasons,
  }));
}

export type RegistrySearchFacetBuckets = Record<string, number>;

export type RegistrySearchFacets = {
  categories: RegistrySearchFacetBuckets;
  platforms: RegistrySearchFacetBuckets;
  installable: RegistrySearchFacetBuckets;
  hasSafetyNotes: RegistrySearchFacetBuckets;
  hasPrivacyNotes: RegistrySearchFacetBuckets;
  downloadTrust: RegistrySearchFacetBuckets;
  claimStatus: RegistrySearchFacetBuckets;
  sourceStatus: RegistrySearchFacetBuckets;
};

const MAX_PLATFORM_BUCKETS = 32;
const MAX_CATEGORY_BUCKETS = 32;

export function increment(buckets: RegistrySearchFacetBuckets, key: string) {
  if (!key) return;
  const count = Object.hasOwn(buckets, key) ? buckets[key] : 0;
  buckets[key] = count + 1;
}

export function sortBuckets(
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
  const buckets = Object.create(null) as RegistrySearchFacetBuckets;
  for (const entry of entries) {
    if (!entryMatchesFilters(entry, filters, except)) continue;
    const bucket = bucketFor(entry);
    if (Array.isArray(bucket)) {
      for (const value of new Set(bucket)) increment(buckets, value);
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
  const platforms = tally(entries, filters, "platform", (entry) => normalizedPlatforms(entry));
  const installable = tally(entries, filters, "installable", (entry) =>
    isInstallable(entry) ? "true" : "false",
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
  const claimStatus = tally(entries, filters, "claimStatus", (entry) => claimStatusValue(entry));
  const sourceStatus = tally(entries, filters, "sourceStatus", (entry) => sourceStatusValue(entry));

  return {
    categories: sortBuckets(categories, MAX_CATEGORY_BUCKETS),
    platforms: sortBuckets(platforms, MAX_PLATFORM_BUCKETS),
    installable: sortBuckets(installable),
    hasSafetyNotes: sortBuckets(safety),
    hasPrivacyNotes: sortBuckets(privacy),
    downloadTrust: sortBuckets(downloadTrust),
    claimStatus: sortBuckets(claimStatus),
    sourceStatus: sortBuckets(sourceStatus),
  };
}
