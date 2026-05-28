import type { SearchDocument } from "@heyclaude/registry";

export type BooleanFilterValue = "all" | "true" | "false";

export type DownloadTrustFilterValue =
  | "all"
  | "first-party"
  | "external"
  | "none";

export type ClaimStatusFilterValue =
  | "all"
  | "unclaimed"
  | "pending"
  | "verified";

export type SourceStatusFilterValue = "all" | "available" | "missing";

export type RegistrySearchFilterState = {
  query: string;
  category: string;
  platform: string;
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
  | "hasSafetyNotes"
  | "hasPrivacyNotes"
  | "downloadTrust"
  | "claimStatus"
  | "sourceStatus";

const TOKEN_SPLIT_PATTERN = /[^a-z0-9+#.-]+/i;

function tokenizeSearchQuery(query: string) {
  return query
    .split(TOKEN_SPLIT_PATTERN)
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length >= 2)
    .slice(0, 12);
}

function normalizedSearchText(entry: SearchDocument) {
  return [
    entry.category,
    entry.title,
    entry.description,
    entry.author,
    entry.submittedBy,
    entry.brandName,
    entry.brandDomain,
    entry.verificationStatus,
    entry.downloadTrust,
    ...(entry.tags ?? []),
    ...(entry.keywords ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function matchesQuery(entry: SearchDocument, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  const haystack = normalizedSearchText(entry);
  return haystack.includes(normalizedQuery);
}

export function matchesPlatform(entry: SearchDocument, platform: string) {
  if (!platform) return true;
  return (entry.platforms ?? []).some(
    (item) => String(item).trim().toLowerCase() === platform,
  );
}

export function matchesBooleanFilter(
  value: boolean,
  filter: BooleanFilterValue,
) {
  if (filter === "all") return true;
  return filter === "true" ? value : !value;
}

export function hasSafetyNotes(entry: SearchDocument) {
  return Boolean(entry.safetyNotes?.length);
}

export function hasPrivacyNotes(entry: SearchDocument) {
  return Boolean(entry.privacyNotes?.length);
}

export function packageTrustValue(entry: SearchDocument) {
  return entry.downloadTrust || (entry.downloadUrl ? "external" : "none");
}

export function sourceStatusValue(entry: SearchDocument) {
  return entry.trustSignals?.sourceStatus || "missing";
}

export function claimStatusValue(entry: SearchDocument) {
  return entry.claimStatus || "unclaimed";
}

export function entryMatchesFilters(
  entry: SearchDocument,
  filters: RegistrySearchFilterState,
  except?: ReadonlySet<RegistrySearchFilterDimension>,
) {
  const skip = (dimension: RegistrySearchFilterDimension) =>
    except?.has(dimension) === true;

  if (
    !skip("category") &&
    filters.category &&
    entry.category !== filters.category
  ) {
    return false;
  }
  if (!skip("platform") && !matchesPlatform(entry, filters.platform)) {
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
  const normalizedQuery = query.trim().toLowerCase();
  const tokens = tokenizeSearchQuery(normalizedQuery);
  if (!tokens.length) return { score: 0, reasons: [] };

  const title = entry.title.toLowerCase();
  const category = entry.category.toLowerCase();
  const tags = new Set((entry.tags ?? []).map((tag) => tag.toLowerCase()));
  const keywords = new Set(
    (entry.keywords ?? []).map((keyword) => keyword.toLowerCase()),
  );
  const haystack = normalizedSearchText(entry);
  let score = 0;
  const reasons = new Set<string>();

  if (title.includes(normalizedQuery)) {
    score += 90;
    reasons.add("title phrase");
  }
  if (category === normalizedQuery) {
    score += 45;
    reasons.add("category match");
  }

  for (const token of tokens) {
    if (title.includes(token)) {
      score += 35;
      reasons.add("title term");
    }
    if (tags.has(token)) {
      score += 24;
      reasons.add("tag match");
    }
    if (keywords.has(token)) {
      score += 18;
      reasons.add("keyword match");
    }
    if (category.includes(token)) {
      score += 12;
      reasons.add("category term");
    }
    if (haystack.includes(token)) {
      score += 4;
    }
  }

  if (entry.trustSignals?.sourceStatus === "available") {
    score += 8;
    reasons.add("source-backed");
  }
  if (
    entry.downloadTrust === "first-party" ||
    entry.trustSignals?.packageVerified === true
  ) {
    score += 8;
    reasons.add("trusted package");
  }
  if (hasSafetyNotes(entry)) {
    score += 4;
    reasons.add("safety notes");
  }
  if (hasPrivacyNotes(entry)) {
    score += 4;
    reasons.add("privacy notes");
  }
  if (entry.claimStatus === "verified" || entry.reviewedBy) {
    score += 4;
    reasons.add("reviewed");
  }

  return {
    score,
    reasons: [...reasons].slice(0, 6),
  };
}

export function rankSearchEntries(
  entries: ReadonlyArray<SearchDocument>,
  query: string,
): RankedSearchEntry[] {
  return entries
    .map((entry, index) => ({
      entry,
      index,
      ...scoreSearchEntry(entry, query),
    }))
    .sort((left, right) => {
      if (left.score !== right.score) return right.score - left.score;
      const dateDelta = String(right.entry.dateAdded ?? "").localeCompare(
        String(left.entry.dateAdded ?? ""),
      );
      if (dateDelta !== 0) return dateDelta;
      return left.index - right.index;
    })
    .map(({ entry, score, reasons }) => ({ entry, score, reasons }));
}
