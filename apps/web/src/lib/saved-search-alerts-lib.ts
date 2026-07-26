/**
 * Pure saved-search alert builders.
 *
 * This module matches registry entries against saved searches and materializes
 * in-app alert payloads from public entry events. Nothing here touches the
 * network — given the same inputs the output is deterministic.
 *
 * The public surface (`saved-search-alerts.ts` / `@/lib/saved-search-alerts`)
 * re-exports everything below so existing imports stay unchanged.
 */

import type { AlertCadence, AlertChannel } from "@/lib/recents";
import { expandedTokenCandidates } from "@/lib/search-query-aliases";
import {
  normalizeSearchQuery,
  TOKEN_SPLIT_PATTERN,
  tokenizeSearchQuery,
} from "@/lib/search-query-tokenization";
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
  submittedBy?: string;
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
  /**
   * Optional match fields for removal fallbacks. The GitHub webhook path
   * classifier (`classifyRegistryPath`) only emits category/slug/action/date
   * today, so these are usually absent on real removal events. When a producer
   * does supply them, trust/source/platform-filtered saved searches can match
   * removals the same way category/query searches already do.
   */
  trust?: string;
  source?: string;
  platforms?: Array<Platform | string>;
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

function normalizedEntryText(entry: SavedSearchAlertEntry) {
  return [
    entry.category,
    entry.slug,
    entry.title,
    entry.description,
    entry.cardDescription,
    entry.author,
    entry.submittedBy,
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
  const normalizedQuery = normalizeSearchQuery(query ?? "");
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

/**
 * Build the synthetic entry used when a removed event has no live detail JSON.
 * Carries category/slug/title (always present on entry events) plus any
 * trust/source/platforms the event producer attached.
 */
export function removedEntryFromEvent(event: SavedSearchAlertEvent): SavedSearchAlertEntry {
  const platforms = (event.platforms ?? [])
    .map((platform) => String(platform || "").trim())
    .filter(Boolean);
  const trust = String(event.trust || "").trim();
  const source = String(event.source || "").trim();
  return {
    category: event.category ?? "",
    slug: event.slug ?? "",
    title: event.title ?? "",
    ...(trust ? { trust } : {}),
    ...(source ? { source } : {}),
    ...(platforms.length ? { platforms } : {}),
  };
}

/**
 * Whether a removal synthetic entry can satisfy a search's trust/source/platform
 * filters. Category/query-only searches always can; filtered searches require
 * the event to actually carry the matching field(s). Without this gate,
 * `savedSearchMatchesEntry` would silently reject (entry field undefined ≠
 * filter), contradicting the "match against carried fields" comment.
 */
export function removalEventSupportsSearchFilters(
  search: SavedSearchAlertSearch,
  entry: SavedSearchAlertEntry,
): boolean {
  if (search.trust && (entry.trust == null || entry.trust === "")) return false;
  if (search.source && (entry.source == null || entry.source === "")) return false;
  if (search.platform && !(entry.platforms ?? []).length) return false;
  return true;
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

    const action = eventAction(event);
    // A removed entry's detail JSON is gone, so `entriesByRef` never has it.
    // Match "removed" events against the event's own carried fields instead of
    // requiring a live fetch:
    // - category / slug / title are always available from the path classifier
    //   and power category- + query-only saved searches (unchanged).
    // - trust / source / platforms are NOT emitted by `classifyRegistryPath` /
    //   the GitHub webhook today (path-only push payload). Searches that filter
    //   on those dimensions are explicitly skipped for synthetic removals unless
    //   a producer enriched the event — see `removalEventSupportsSearchFilters`.
    // Added/updated events keep needing the live entry.
    const liveEntry = entriesByRef.get(ref);
    const usingRemovalFallback = action === "removed" && !liveEntry;
    const entry: SavedSearchAlertEntry | null =
      liveEntry ?? (action === "removed" ? removedEntryFromEvent(event) : null);
    if (!entry) continue;

    for (const search of activeSearches) {
      if (usingRemovalFallback && !removalEventSupportsSearchFilters(search, entry)) {
        continue;
      }
      if (!savedSearchMatchesEntry(search, entry)) continue;
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
