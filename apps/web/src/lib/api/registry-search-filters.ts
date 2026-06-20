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
  automation: ["automate", "automated", "qa", "testing"],
  browser: ["chrome", "playwright", "web"],
  cc: ["claude", "claude-code"],
  claude: ["claude-code"],
  design: ["ux", "ui"],
  gh: ["github"],
  ms: ["microsoft"],
  mcp: ["model-context-protocol"],
  msteams: ["teams", "microsoft-teams"],
  repo: ["repository", "github"],
  repos: ["repository", "github"],
  safe: ["safety", "security", "secure", "trust", "privacy"],
  security: ["safe", "safety", "secure", "trust"],
  skill: ["skills"],
  skills: ["skill"],
  statusline: ["statuslines", "status"],
  statuslines: ["statusline", "status"],
};

type QueryIntentProfile = {
  id: string;
  tokens: string[];
  categories?: string[];
  platforms?: string[];
  tags?: string[];
  keywords?: string[];
  titleTerms?: string[];
  trustWeighted?: boolean;
};

type EntrySearchSignals = {
  title: string;
  slug: string;
  category: string;
  tags: Set<string>;
  keywords: Set<string>;
  platforms: Set<string>;
  haystack: string;
  words: Set<string>;
};

const QUERY_INTENT_PROFILES: QueryIntentProfile[] = [
  {
    id: "code review",
    tokens: ["code", "review"],
    categories: ["agents", "commands", "tools", "skills"],
    tags: ["code-review", "review", "pull-request", "quality"],
    keywords: ["code review", "code-review", "pr review", "repository review"],
    titleTerms: ["code review", "review"],
    trustWeighted: true,
  },
  {
    id: "browser automation",
    tokens: ["browser", "automation"],
    categories: ["mcp", "agents", "tools", "guides"],
    platforms: ["claude-code"],
    tags: ["browser-automation", "browser", "chrome", "playwright", "web-testing"],
    keywords: ["browser automation", "playwright", "chrome", "web qa", "screenshots"],
    titleTerms: ["browser automation", "browser", "playwright", "chrome"],
    trustWeighted: true,
  },
  {
    id: "safe mcp",
    tokens: ["safe", "mcp"],
    categories: ["mcp", "guides", "skills"],
    tags: ["security", "safety", "privacy", "least-privilege", "trust", "mcp"],
    keywords: ["safe mcp", "mcp security", "least privilege", "trust review"],
    titleTerms: ["mcp security", "safe mcp", "trust"],
    trustWeighted: true,
  },
  {
    id: "design skill",
    tokens: ["design", "skill"],
    categories: ["skills", "agents", "rules"],
    tags: ["design", "ux", "ui", "frontend", "visual-qa"],
    keywords: ["design skill", "ux", "ui", "frontend design", "visual qa"],
    titleTerms: ["design", "ux", "ui"],
  },
  {
    id: "statusline",
    tokens: ["statusline"],
    categories: ["statuslines"],
    tags: ["statusline", "monitoring", "observability", "context", "usage"],
    keywords: ["statusline", "claude code statusline", "workflow visibility"],
    titleTerms: ["statusline"],
    trustWeighted: true,
  },
  {
    id: "raycast",
    tokens: ["raycast"],
    platforms: ["raycast"],
    tags: ["raycast", "launcher", "extension", "productivity"],
    keywords: ["raycast", "raycast extension", "launcher"],
    titleTerms: ["raycast"],
    trustWeighted: true,
  },
];

const SEARCH_REASON_PRIORITY = [
  "query intent",
  "title phrase",
  "slug phrase",
  "intent title",
  "intent tag",
  "intent keyword",
  "intent category",
  "trust intent",
  "source-backed",
  "trusted package",
  "safety notes",
  "privacy notes",
  "title term",
  "slug term",
  "tag match",
  "keyword match",
  "category match",
  "category term",
  "platform match",
  "installable",
  "reviewed",
];

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

function expandedTokenSet(tokens: ReadonlyArray<string>) {
  return new Set(tokens.flatMap((token) => expandedTokenCandidates(token)));
}

function normalizedSet(values: ReadonlyArray<unknown> | undefined) {
  return new Set(
    (values ?? [])
      .map((value) => String(value).trim().toLowerCase())
      .filter(Boolean),
  );
}

function normalizedSearchText(entry: SearchDocument) {
  const mcpInstallTargets = (entry as { mcpInstallTargets?: string[] }).mcpInstallTargets;
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
    ...(entry.platforms ?? []),
    ...(entry.supportLevels ?? []),
    ...(mcpInstallTargets ?? []),
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

function buildEntrySearchSignals(entry: SearchDocument): EntrySearchSignals {
  return {
    title: entry.title.toLowerCase(),
    slug: entry.slug.toLowerCase(),
    category: entry.category.toLowerCase(),
    tags: normalizedSet(entry.tags),
    keywords: normalizedSet(entry.keywords),
    platforms: normalizedSet(entry.platforms),
    haystack: normalizedSearchText(entry),
    words: entryWordSet(entry),
  };
}

function valueMatchesCandidate(
  value: string,
  candidate: string,
  words = new Set(
    value
      .split(TOKEN_SPLIT_PATTERN)
      .map((word) => word.trim().toLowerCase())
      .filter(Boolean),
  ),
) {
  return candidateMatchesText(candidate, value, words);
}

function setMatchesCandidates(values: ReadonlySet<string>, candidates: ReadonlyArray<string>) {
  return [...values].some((value) =>
    candidates.some((candidate) => valueMatchesCandidate(value, candidate)),
  );
}

function matchingIntentProfiles(tokens: ReadonlyArray<string>) {
  const candidates = expandedTokenSet(tokens);
  return QUERY_INTENT_PROFILES.filter((profile) =>
    profile.tokens.every((token) => candidates.has(token)),
  );
}

function scoreIntentProfile(
  entry: SearchDocument,
  signals: EntrySearchSignals,
  profile: QueryIntentProfile,
) {
  let score = 0;
  const reasons = new Set<string>();
  const titleTerms = profile.titleTerms ?? [];

  if (profile.categories?.includes(signals.category)) {
    score += 28;
    reasons.add("intent category");
  }
  if (profile.platforms && setMatchesCandidates(signals.platforms, profile.platforms)) {
    score += 24;
    reasons.add("platform match");
  }
  if (profile.tags && setMatchesCandidates(signals.tags, profile.tags)) {
    score += 26;
    reasons.add("intent tag");
  }
  if (profile.keywords && setMatchesCandidates(signals.keywords, profile.keywords)) {
    score += 22;
    reasons.add("intent keyword");
  }
  if (titleTerms.some((term) => valueMatchesCandidate(signals.title, term))) {
    score += 24;
    reasons.add("intent title");
  }
  if (profile.trustWeighted) {
    let trustScore = 0;
    if (entry.trustSignals?.sourceStatus === "available") trustScore += 8;
    if (hasSafetyNotes(entry)) trustScore += 8;
    if (hasPrivacyNotes(entry)) trustScore += 6;
    if (entry.downloadTrust === "first-party" || entry.trustSignals?.packageVerified === true) {
      trustScore += 6;
    }
    score += trustScore;
    if (trustScore > 0) reasons.add("trust intent");
  }
  if (score > 0) reasons.add("query intent");

  return { score, reasons };
}

function rankedSearchReasons(reasons: ReadonlySet<string>) {
  const priority = new Map(SEARCH_REASON_PRIORITY.map((reason, index) => [reason, index]));
  return [...reasons]
    .sort((left, right) => (priority.get(left) ?? 999) - (priority.get(right) ?? 999))
    .slice(0, 12);
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
  const platforms = normalizedSet(entry.platforms);
  const signals = buildEntrySearchSignals(entry);
  const haystack = signals.haystack;
  const words = signals.words;
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
    if (candidates.some((candidate) => setMatchesCandidates(platforms, [candidate]))) {
      score += 20;
      reasons.add("platform match");
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
  for (const profile of matchingIntentProfiles(tokens)) {
    const intent = scoreIntentProfile(entry, signals, profile);
    score += intent.score;
    for (const reason of intent.reasons) reasons.add(reason);
  }

  return {
    score,
    reasons: rankedSearchReasons(reasons),
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
