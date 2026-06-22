import type { AlertCadence, AlertChannel } from "@/lib/recents";
import type { Category, Platform, SourceStatus, TrustLevel } from "@/types/registry";

export interface SavedSearchAlertSchedule {
  enabled?: boolean;
  channels?: AlertChannel[];
  cadence?: AlertCadence;
  lastNotifiedAt?: string;
}

export interface SavedSearchAlertSearch {
  id: string;
  label: string;
  q?: string;
  category?: string;
  trust?: string;
  source?: string;
  platform?: string;
  alerts?: SavedSearchAlertSchedule;
}

export interface SavedSearchAlertEntry {
  category: Category | string;
  slug: string;
  title: string;
  description?: string;
  cardDescription?: string;
  author?: string;
  tags?: string[];
  keywords?: string[];
  platforms?: Array<Platform | string>;
  trust?: TrustLevel | string;
  source?: SourceStatus | string;
}

export interface SavedSearchAlertEvent {
  id?: string;
  kind?: string;
  category?: string;
  slug?: string;
  action?: string;
  date?: string;
  title?: string;
}

export type SavedSearchAlertSeverity = "info" | "warning" | "blocker";

export interface SavedSearchAlert {
  id: string;
  targetId: string;
  kind: "saved-search";
  title: string;
  body: string;
  severity: SavedSearchAlertSeverity;
  href?: string;
  date: string;
}

const TOKEN_SPLIT_PATTERN = /[^a-z0-9+#.-]+/i;

const QUERY_ALIASES: Record<string, string[]> = {
  browser: ["chrome", "playwright", "web"],
  cc: ["claude", "claude-code"],
  claude: ["claude-code"],
  gh: ["github"],
  mcp: ["model-context-protocol"],
  repo: ["repository", "github"],
  repos: ["repository", "github"],
  safe: ["safety", "security", "secure", "trust", "privacy"],
  security: ["safe", "safety", "secure", "trust"],
  skill: ["skills"],
  skills: ["skill"],
  statusline: ["statuslines", "status"],
  statuslines: ["statusline", "status"],
};

export function savedSearchAlertTargetId(search: Pick<SavedSearchAlertSearch, "id">) {
  return `saved-search:${search.id}`;
}

export function activeInAppSavedSearches(
  searches: SavedSearchAlertSearch[],
): SavedSearchAlertSearch[] {
  return searches.filter(
    (search) => search.alerts?.enabled && search.alerts.channels?.includes("inapp"),
  );
}

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

function normalizedEntryText(entry: SavedSearchAlertEntry) {
  return [
    entry.category,
    entry.slug,
    entry.title,
    entry.description,
    entry.cardDescription,
    entry.author,
    entry.trust,
    entry.source,
    ...(entry.platforms ?? []),
    ...(entry.tags ?? []),
    ...(entry.keywords ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function candidateMatchesText(candidate: string, haystack: string, words: string[]) {
  if (candidate.length <= 2) {
    return words.some((word) => word === candidate || word.startsWith(candidate));
  }
  return haystack.includes(candidate) || words.some((word) => word.startsWith(candidate));
}

export function savedSearchQueryMatchesEntry(
  entry: SavedSearchAlertEntry,
  query: string | undefined,
) {
  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  if (!normalizedQuery) return true;

  const tokens = tokenizeSearchQuery(normalizedQuery);
  if (tokens.length === 0) return false;

  const haystack = normalizedEntryText(entry);
  const words = [
    ...new Set(
      haystack
        .split(TOKEN_SPLIT_PATTERN)
        .map((word) => word.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];

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

export function savedSearchMatchesEntry(
  search: SavedSearchAlertSearch,
  entry: SavedSearchAlertEntry,
) {
  if (search.category && entry.category !== search.category) return false;
  if (search.trust && entry.trust !== search.trust) return false;
  if (search.source && entry.source !== search.source) return false;
  if (
    search.platform &&
    !(entry.platforms ?? []).some((platform) => platform === search.platform)
  ) {
    return false;
  }
  return savedSearchQueryMatchesEntry(entry, search.q);
}

function eventRef(event: SavedSearchAlertEvent) {
  if (event.kind !== "entry" || !event.category || !event.slug) return null;
  return `${event.category}/${event.slug}`;
}

function eventAction(event: SavedSearchAlertEvent) {
  return event.action === "removed" ? "removed" : event.action === "added" ? "added" : "updated";
}

export function buildSavedSearchAlerts(
  searches: SavedSearchAlertSearch[],
  events: SavedSearchAlertEvent[],
  entriesByRef: ReadonlyMap<string, SavedSearchAlertEntry>,
): SavedSearchAlert[] {
  const activeSearches = activeInAppSavedSearches(searches);
  if (activeSearches.length === 0) return [];

  const alerts: SavedSearchAlert[] = [];
  for (const event of events) {
    const ref = eventRef(event);
    if (!ref || !event.date) continue;

    const entry = entriesByRef.get(ref);
    if (!entry) continue;

    for (const search of activeSearches) {
      if (!savedSearchMatchesEntry(search, entry)) continue;
      const action = eventAction(event);
      const title = event.title || entry.title;
      alerts.push({
        id: `saved-search:${search.id}:${ref}:${event.date}:${action}`,
        targetId: savedSearchAlertTargetId(search),
        kind: "saved-search",
        title: `${title} ${action}`,
        body: `Matches saved search "${search.label}".`,
        severity: action === "removed" ? "warning" : "info",
        href: `/entry/${ref}`,
        date: event.date,
      });
    }
  }

  return alerts.sort((left, right) => right.date.localeCompare(left.date));
}
