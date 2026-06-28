const TOKEN_SPLIT_PATTERN = /[^a-z0-9+#.-]+/i;
const MAX_QUERY_LENGTH = 256;
const MAX_QUERY_TOKENS = 12;

const QUERY_ALIASES = {
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

const PLATFORM_ALIASES = new Map([
  ["claude", "claude-code"],
  ["claude-code", "claude-code"],
  ["claude-desktop", "claude-desktop"],
  ["codex", "codex"],
  ["openai", "codex"],
  ["windsurf", "windsurf"],
  ["gemini", "gemini"],
  ["cursor", "cursor"],
  ["cursor-rules", "cursor"],
  ["vscode", "vscode"],
  ["vs-code", "vscode"],
  ["raycast", "raycast"],
  ["aider", "aider"],
  ["zed", "zed"],
  ["continue", "continue"],
  ["cli", "cli"],
  ["generic-agents", "cli"],
  ["agents", "cli"],
  ["agents-context", "cli"],
  ["agents-md", "cli"],
]);

const QUERY_INTENT_PROFILES = [
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
    tags: [
      "browser-automation",
      "browser",
      "chrome",
      "playwright",
      "web-testing",
    ],
    keywords: [
      "browser automation",
      "playwright",
      "chrome",
      "web qa",
      "screenshots",
    ],
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

function text(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function textValues(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }
  const normalized = String(value || "").trim();
  return normalized ? [normalized] : [];
}

function hasTextLikeValue(value) {
  return textValues(value).length > 0;
}

function expandedTokenCandidates(token) {
  return [token, ...(QUERY_ALIASES[token] ?? [])];
}

function expandedTokenSet(tokens) {
  return new Set(tokens.flatMap((token) => expandedTokenCandidates(token)));
}

function normalizedSet(values) {
  return new Set((values ?? []).map((value) => text(value)).filter(Boolean));
}

function wordSet(value) {
  return new Set(
    text(value)
      .split(TOKEN_SPLIT_PATTERN)
      .map((word) => word.trim().toLowerCase())
      .filter(Boolean),
  );
}

function candidateMatchesText(candidate, haystack, words) {
  if (candidate.length <= 2) {
    return [...words].some(
      (word) => word === candidate || word.startsWith(candidate),
    );
  }
  return (
    haystack.includes(candidate) ||
    [...words].some((word) => word.startsWith(candidate))
  );
}

function valueMatchesCandidate(value, candidate) {
  return candidateMatchesText(candidate, value, wordSet(value));
}

function setMatchesCandidates(values, candidates) {
  return [...values].some((value) =>
    candidates.some((candidate) => valueMatchesCandidate(value, candidate)),
  );
}

function matchingIntentProfiles(tokens) {
  const candidates = expandedTokenSet(tokens);
  return QUERY_INTENT_PROFILES.filter((profile) =>
    profile.tokens.every((token) => candidates.has(token)),
  );
}

function sourceUrls(entry) {
  return [
    entry.documentationUrl,
    entry.docsUrl,
    entry.repoUrl,
    entry.githubUrl,
    entry.sourceUrl,
  ].filter((value) => String(value || "").trim());
}

function buildEntrySearchSignals(entry) {
  const haystack = normalizedRegistrySearchText(entry);
  return {
    title: text(entry.title),
    slug: text(entry.slug),
    category: text(entry.category),
    tags: normalizedSet(entry.tags),
    keywords: normalizedSet(entry.keywords),
    platforms: normalizedSet(entry.platforms),
    haystack,
    words: wordSet(haystack),
  };
}

function scoreIntentProfile(entry, signals, profile) {
  let score = 0;
  const reasons = new Set();
  const titleTerms = profile.titleTerms ?? [];

  if (profile.categories?.includes(signals.category)) {
    score += 28;
    reasons.add("intent category");
  }
  if (
    profile.platforms &&
    setMatchesCandidates(signals.platforms, profile.platforms)
  ) {
    score += 24;
    reasons.add("platform match");
  }
  if (profile.tags && setMatchesCandidates(signals.tags, profile.tags)) {
    score += 26;
    reasons.add("intent tag");
  }
  if (
    profile.keywords &&
    setMatchesCandidates(signals.keywords, profile.keywords)
  ) {
    score += 22;
    reasons.add("intent keyword");
  }
  if (titleTerms.some((term) => valueMatchesCandidate(signals.title, term))) {
    score += 24;
    reasons.add("intent title");
  }
  if (profile.trustWeighted) {
    let trustScore = 0;
    if (entrySourceStatusValue(entry) === "available") trustScore += 8;
    if (entryHasSafetyNotes(entry)) trustScore += 8;
    if (entryHasPrivacyNotes(entry)) trustScore += 6;
    if (
      entryPackageTrustValue(entry) === "first-party" ||
      entry.trustSignals?.packageVerified
    ) {
      trustScore += 6;
    }
    score += trustScore;
    if (trustScore > 0) reasons.add("trust intent");
  }
  if (score > 0) reasons.add("query intent");

  return { score, reasons };
}

function rankedSearchReasons(reasons) {
  const priority = new Map(
    SEARCH_REASON_PRIORITY.map((reason, index) => [reason, index]),
  );
  return [...reasons]
    .sort(
      (left, right) =>
        (priority.get(left) ?? 999) - (priority.get(right) ?? 999),
    )
    .slice(0, 12);
}

export function normalizeRegistrySearchQuery(query) {
  return String(query || "")
    .slice(0, MAX_QUERY_LENGTH)
    .trim()
    .toLowerCase();
}

export function tokenizeRegistrySearchQuery(query) {
  const normalized = normalizeRegistrySearchQuery(query);
  const tokens = [];
  let token = "";

  for (
    let index = 0;
    index < normalized.length && tokens.length < MAX_QUERY_TOKENS;
    index += 1
  ) {
    const char = normalized[index];
    if (/[a-z0-9+#.-]/i.test(char)) {
      token += char.toLowerCase();
      continue;
    }

    if (token.length >= 2) tokens.push(token);
    token = "";
  }

  if (tokens.length < MAX_QUERY_TOKENS && token.length >= 2) tokens.push(token);
  return tokens;
}

export function normalizeRegistryPlatform(value) {
  const normalized = text(value).replace(/[^a-z0-9]+/g, "-");
  if (!normalized) return "";
  return PLATFORM_ALIASES.get(normalized) || String(value || "").trim();
}

export function normalizedRegistrySearchText(entry) {
  const mcpInstallTargets = entry?.mcpInstallTargets;
  return [
    entry?.category,
    entry?.slug,
    entry?.title,
    entry?.description,
    entry?.cardDescription,
    entry?.author,
    entry?.submittedBy,
    entry?.brandName,
    entry?.brandDomain,
    entry?.verificationStatus,
    entry?.downloadTrust,
    entry?.trust,
    entry?.source,
    ...textValues(entry?.safetyNotes),
    ...textValues(entry?.privacyNotes),
    ...(entry?.platforms ?? []),
    ...(entry?.supportLevels ?? []),
    ...(mcpInstallTargets ?? []),
    ...(entry?.tags ?? []),
    ...(entry?.keywords ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function matchesRegistryQuery(entry, query) {
  const normalizedQuery = normalizeRegistrySearchQuery(query);
  if (!normalizedQuery) return true;
  const tokens = tokenizeRegistrySearchQuery(normalizedQuery);
  if (!tokens.length) return false;

  const haystack = normalizedRegistrySearchText(entry);
  const words = wordSet(haystack);
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

export function matchesRegistryPlatform(entry, platform) {
  const target = normalizeRegistryPlatform(platform);
  if (!target) return true;
  return (entry?.platforms ?? []).some((item) => text(item) === text(target));
}

export function entryHasSafetyNotes(entry) {
  return Boolean(
    entry?.trustSignals?.hasSafetyNotes || hasTextLikeValue(entry?.safetyNotes),
  );
}

export function entryHasPrivacyNotes(entry) {
  return Boolean(
    entry?.trustSignals?.hasPrivacyNotes ||
    hasTextLikeValue(entry?.privacyNotes),
  );
}

export function entryIsInstallable(entry) {
  return Boolean(
    entry?.installable ||
    entry?.downloadUrl ||
    entry?.installCommand ||
    entry?.configSnippet,
  );
}

export function entryPackageTrustValue(entry) {
  return entry?.downloadTrust || (entry?.downloadUrl ? "external" : "none");
}

export function entrySourceStatusValue(entry) {
  return (
    entry?.trustSignals?.sourceStatus ||
    (sourceUrls(entry ?? {}).length ? "available" : "missing")
  );
}

export function entryClaimStatusValue(entry) {
  return entry?.claimStatus || "unclaimed";
}

export function scoreRegistrySearchEntry(entry, query) {
  const normalizedQuery = normalizeRegistrySearchQuery(query);
  const tokens = tokenizeRegistrySearchQuery(normalizedQuery);
  if (!tokens.length) return { score: 0, reasons: [] };

  const signals = buildEntrySearchSignals(entry);
  let score = 0;
  const reasons = new Set();

  if (signals.title.includes(normalizedQuery)) {
    score += 90;
    reasons.add("title phrase");
  }
  if (signals.slug.includes(normalizedQuery)) {
    score += 65;
    reasons.add("slug phrase");
  }
  if (signals.category === normalizedQuery) {
    score += 45;
    reasons.add("category match");
  }

  for (const token of tokens) {
    const candidates = expandedTokenCandidates(token);
    const hasCandidate = (value) =>
      candidates.some((candidate) =>
        candidateMatchesText(candidate, value, wordSet(value)),
      );
    const hasPrefixCandidate = [...signals.words].some((word) =>
      candidates.some((candidate) => word.startsWith(candidate)),
    );

    if (hasCandidate(signals.title)) {
      score += 35;
      reasons.add("title term");
    }
    if (hasCandidate(signals.slug)) {
      score += 28;
      reasons.add("slug term");
    }
    if (candidates.some((candidate) => signals.tags.has(candidate))) {
      score += 24;
      reasons.add("tag match");
    }
    if (candidates.some((candidate) => signals.keywords.has(candidate))) {
      score += 18;
      reasons.add("keyword match");
    }
    if (hasCandidate(signals.category)) {
      score += 12;
      reasons.add("category term");
    }
    if (
      candidates.some((candidate) =>
        setMatchesCandidates(signals.platforms, [candidate]),
      )
    ) {
      score += 20;
      reasons.add("platform match");
    }
    if (
      candidates.some((candidate) =>
        candidateMatchesText(candidate, signals.haystack, signals.words),
      )
    ) {
      score += 4;
    }
    if (hasPrefixCandidate) score += 2;
  }

  if (entryIsInstallable(entry)) {
    score += 4;
    reasons.add("installable");
  }
  if (entrySourceStatusValue(entry) === "available") {
    score += 8;
    reasons.add("source-backed");
  }
  if (
    entryPackageTrustValue(entry) === "first-party" ||
    entry?.trustSignals?.packageVerified
  ) {
    score += 8;
    reasons.add("trusted package");
  }
  if (entryHasSafetyNotes(entry)) {
    score += 4;
    reasons.add("safety notes");
  }
  if (entryHasPrivacyNotes(entry)) {
    score += 4;
    reasons.add("privacy notes");
  }
  if (entryClaimStatusValue(entry) === "verified" || entry?.reviewedBy) {
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

export function rankRegistrySearchEntries(entries, query) {
  return entries
    .map((entry, index) => ({
      entry,
      index,
      ...scoreRegistrySearchEntry(entry, query),
    }))
    .sort((left, right) => {
      if (left.score !== right.score) return right.score - left.score;
      const dateDelta = String(right.entry?.dateAdded ?? "").localeCompare(
        String(left.entry?.dateAdded ?? ""),
      );
      if (dateDelta !== 0) return dateDelta;
      return left.index - right.index;
    });
}
