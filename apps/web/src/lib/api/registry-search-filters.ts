import type { SearchDocument } from "@heyclaude/registry";

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

const TOKEN_SPLIT_PATTERN = /[^a-z0-9+#.-]+/i;
const QUERY_ALIASES: Record<string, string[]> = {
  cc: ["claude", "claude-code"],
  claude: ["claude-code"],
  gh: ["github"],
  ms: ["microsoft"],
  msteams: ["teams", "microsoft-teams"],
  repo: ["repository", "github"],
  repos: ["repository", "github"],
};

function tokenizeSearchQuery(query: string) {
  return query
    .split(TOKEN_SPLIT_PATTERN)
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length >= 2)
    .slice(0, 12);
}

function expandedTokenCandidates(token: string) {
  return [token, ...(QUERY_ALIASES[token] ?? [])];
}

function normalizedSearchText(entry: SearchDocument) {
  return [
    entry.category,
    entry.slug,
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

function entryWordSet(entry: SearchDocument) {
  return new Set(
    normalizedSearchText(entry)
      .split(TOKEN_SPLIT_PATTERN)
      .map((token) => token.trim().toLowerCase())
      .filter(Boolean),
  );
}

function candidateMatchesText(candidate: string, haystack: string, words: ReadonlySet<string>) {
  if (candidate.length <= 2) {
    return [...words].some((word) => word === candidate || word.startsWith(candidate));
  }
  return haystack.includes(candidate) || [...words].some((word) => word.startsWith(candidate));
}

export function matchesQuery(entry: SearchDocument, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  const haystack = normalizedSearchText(entry);
  const tokens = tokenizeSearchQuery(normalizedQuery);
  if (!tokens.length) return false;
  const words = entryWordSet(entry);
  if (
    normalizedQuery.length > 2
      ? haystack.includes(normalizedQuery)
      : candidateMatchesText(normalizedQuery, haystack, words)
  ) {
    return true;
  }
  return tokens.every((token) =>
    expandedTokenCandidates(token).some((candidate) =>
      candidateMatchesText(candidate, haystack, words),
    ),
  );
}

export function matchesPlatform(entry: SearchDocument, platform: string) {
  if (!platform) return true;
  return (entry.platforms ?? []).some((item) => String(item).trim().toLowerCase() === platform);
}

export function matchesBooleanFilter(value: boolean, filter: BooleanFilterValue) {
  if (filter === "all") return true;
  return filter === "true" ? value : !value;
}

export function hasSafetyNotes(entry: SearchDocument) {
  return Boolean(entry.trustSignals?.hasSafetyNotes || entry.safetyNotes?.length);
}

export function hasPrivacyNotes(entry: SearchDocument) {
  return Boolean(entry.trustSignals?.hasPrivacyNotes || entry.privacyNotes?.length);
}

export function isInstallable(entry: SearchDocument) {
  return Boolean(entry.installable || entry.downloadUrl);
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
  const normalizedQuery = query.trim().toLowerCase();
  const tokens = tokenizeSearchQuery(normalizedQuery);
  if (!tokens.length) return { score: 0, reasons: [] };

  const title = entry.title.toLowerCase();
  const slug = entry.slug.toLowerCase();
  const category = entry.category.toLowerCase();
  const tags = new Set((entry.tags ?? []).map((tag) => tag.toLowerCase()));
  const keywords = new Set((entry.keywords ?? []).map((keyword) => keyword.toLowerCase()));
  const haystack = normalizedSearchText(entry);
  const words = entryWordSet(entry);
  let score = 0;
  const reasons = new Set<string>();

  if (title.includes(normalizedQuery)) {
    score += 90;
    reasons.add("title phrase");
  }
  if (slug.includes(normalizedQuery)) {
    score += 65;
    reasons.add("slug phrase");
  }
  if (category === normalizedQuery) {
    score += 45;
    reasons.add("category match");
  }

  for (const token of tokens) {
    const candidates = expandedTokenCandidates(token);
    const hasCandidate = (value: string) =>
      candidates.some((candidate) =>
        candidateMatchesText(
          candidate,
          value,
          new Set(
            value
              .split(TOKEN_SPLIT_PATTERN)
              .map((word) => word.trim().toLowerCase())
              .filter(Boolean),
          ),
        ),
      );
    const hasPrefixCandidate = [...words].some((word) =>
      candidates.some((candidate) => word.startsWith(candidate)),
    );

    if (hasCandidate(title)) {
      score += 35;
      reasons.add("title term");
    }
    if (hasCandidate(slug)) {
      score += 28;
      reasons.add("slug term");
    }
    if (candidates.some((candidate) => tags.has(candidate))) {
      score += 24;
      reasons.add("tag match");
    }
    if (candidates.some((candidate) => keywords.has(candidate))) {
      score += 18;
      reasons.add("keyword match");
    }
    if (hasCandidate(category)) {
      score += 12;
      reasons.add("category term");
    }
    if (candidates.some((candidate) => candidateMatchesText(candidate, haystack, words))) {
      score += 4;
    }
    if (hasPrefixCandidate) score += 2;
  }

  if (isInstallable(entry)) {
    score += 4;
    reasons.add("installable");
  }
  if (entry.trustSignals?.sourceStatus === "available") {
    score += 8;
    reasons.add("source-backed");
  }
  if (entry.downloadTrust === "first-party" || entry.trustSignals?.packageVerified === true) {
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
