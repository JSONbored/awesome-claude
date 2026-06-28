import { ENTRIES, entryByRef } from "./entries";
import { sameEntry } from "@/lib/entry-identity";
import { expandedTokenCandidates } from "@/lib/search-query-aliases";
import {
  normalizeSearchQuery,
  TOKEN_SPLIT_PATTERN,
  tokenizeSearchQuery,
} from "@/lib/search-query-tokenization";
import type {
  Category,
  Entry,
  EntryRelationType,
  Platform,
  SourceStatus,
  TrustLevel,
} from "@/types/registry";

export interface SearchFilters {
  q?: string;
  categories?: Category[];
  platforms?: Platform[];
  trust?: TrustLevel[];
  source?: SourceStatus[];
  signal?: TrustSignalFilter | "";
  installable?: boolean;
  hasSafetyNotes?: boolean;
  sort?: "popular" | "newest" | "title";
}

export const TRUST_SIGNAL_FILTERS = [
  "safety-notes",
  "privacy-notes",
  "source-backed",
  "trusted-package",
  "reviewed",
  "checksums",
] as const;

export type TrustSignalFilter = (typeof TRUST_SIGNAL_FILTERS)[number];

interface EntrySearchProfile {
  haystack: string;
  words: string[];
}

interface QuerySearchProfile {
  normalizedQuery: string;
  tokens: string[];
}

interface PreparedSearchFilters extends SearchFilters {
  queryProfile?: QuerySearchProfile | null;
}

const ENTRY_SEARCH_PROFILES = new WeakMap<Entry, EntrySearchProfile>();

export { normalizeSearchQuery } from "@/lib/search-query-tokenization";

function querySearchProfile(query: string): QuerySearchProfile | null {
  const normalizedQuery = normalizeSearchQuery(query);
  if (!normalizedQuery) return null;

  const tokens = tokenizeSearchQuery(normalizedQuery);
  if (!tokens.length) return null;

  return { normalizedQuery, tokens };
}

function normalizedSearchText(entry: Entry) {
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

function entrySearchProfile(entry: Entry) {
  let profile = ENTRY_SEARCH_PROFILES.get(entry);
  if (!profile) {
    const haystack = normalizedSearchText(entry);
    const words = [
      ...new Set(
        haystack
          .split(TOKEN_SPLIT_PATTERN)
          .map((word) => word.trim().toLowerCase())
          .filter(Boolean),
      ),
    ];
    profile = {
      haystack,
      words,
    };
    ENTRY_SEARCH_PROFILES.set(entry, profile);
  }
  return profile;
}

function candidateMatchesText(candidate: string, profile: EntrySearchProfile) {
  if (candidate.length <= 2) {
    return profile.words.some((word) => word === candidate || word.startsWith(candidate));
  }
  return (
    profile.haystack.includes(candidate) || profile.words.some((word) => word.startsWith(candidate))
  );
}

function matchesEntryQueryProfile(entry: Entry, queryProfile: QuerySearchProfile) {
  const { normalizedQuery, tokens } = queryProfile;
  const profile = entrySearchProfile(entry);
  if (
    normalizedQuery.length > 2
      ? profile.haystack.includes(normalizedQuery)
      : candidateMatchesText(normalizedQuery, profile)
  ) {
    return true;
  }

  return tokens.every((token) =>
    expandedTokenCandidates(token).some((candidate) => candidateMatchesText(candidate, profile)),
  );
}

export function matchesEntryQuery(entry: Entry, query: string) {
  const profile = querySearchProfile(query);
  if (!profile) return !normalizeSearchQuery(query);
  return matchesEntryQueryProfile(entry, profile);
}

function prepareSearchFilters(filters: SearchFilters = {}): PreparedSearchFilters {
  return {
    ...filters,
    q: filters.q ? normalizeSearchQuery(filters.q) : filters.q,
    queryProfile: filters.q ? querySearchProfile(filters.q) : null,
  };
}

export function matchesSearchFilters(entry: Entry, filters: SearchFilters = {}) {
  const prepared = filters as PreparedSearchFilters;
  if (filters.categories?.length && !filters.categories.includes(entry.category)) return false;
  if (filters.platforms?.length && !entry.platforms.some((p) => filters.platforms!.includes(p)))
    return false;
  if (filters.trust?.length && !filters.trust.includes(entry.trust)) return false;
  if (filters.source?.length && !filters.source.includes(entry.source)) return false;
  if (filters.signal && !entryMatchesTrustSignal(entry, filters.signal)) return false;
  if (filters.installable && !entry.installCommand && !entry.configSnippet && !entry.fullCopy)
    return false;
  if (filters.hasSafetyNotes && !hasSafetyNotes(entry)) return false;
  if (prepared.queryProfile && !matchesEntryQueryProfile(entry, prepared.queryProfile))
    return false;
  if (prepared.q && prepared.queryProfile === null) return false;
  if (filters.q && prepared.queryProfile === undefined && !matchesEntryQuery(entry, filters.q))
    return false;
  return true;
}

function hasSafetyNotes(entry: Entry) {
  return Boolean(entry.safetyNotes || entry.trustSignals?.hasSafetyNotes);
}

function hasPrivacyNotes(entry: Entry) {
  return Boolean(entry.privacyNotes || entry.trustSignals?.hasPrivacyNotes);
}

function hasSourceBackedSignal(entry: Entry) {
  return entry.source === "source-backed" || entry.trustSignals?.sourceStatus === "available";
}

function hasTrustedPackageSignal(entry: Entry) {
  return Boolean(
    entry.packageVerified ||
    entry.downloadTrust === "first-party" ||
    entry.trustSignals?.packageVerified ||
    entry.trustSignals?.packageTrust === "first-party",
  );
}

function hasReviewedSignal(entry: Entry) {
  return Boolean(
    entry.reviewed || entry.reviewedBy || entry.claimed || entry.claimStatus === "verified",
  );
}

function hasChecksumSignal(entry: Entry) {
  return Boolean(entry.downloadSha256 || entry.trustSignals?.checksumPresent);
}

export function entryMatchesTrustSignal(entry: Entry, signal: TrustSignalFilter) {
  if (signal === "safety-notes") return hasSafetyNotes(entry);
  if (signal === "privacy-notes") return hasPrivacyNotes(entry);
  if (signal === "source-backed") return hasSourceBackedSignal(entry);
  if (signal === "trusted-package") return hasTrustedPackageSignal(entry);
  if (signal === "reviewed") return hasReviewedSignal(entry);
  if (signal === "checksums") return hasChecksumSignal(entry);
  return false;
}

export function filterSearchEntries(filters: SearchFilters = {}, entries: Entry[] = ENTRIES) {
  const prepared = prepareSearchFilters(filters);
  return entries.filter((entry) => matchesSearchFilters(entry, prepared));
}

export function countSearchResults(filters: SearchFilters = {}, entries: Entry[] = ENTRIES) {
  const prepared = prepareSearchFilters(filters);
  let count = 0;
  for (const entry of entries) {
    if (matchesSearchFilters(entry, prepared)) count += 1;
  }
  return count;
}

export function search(filters: SearchFilters = {}): Entry[] {
  let rows = filterSearchEntries(filters);

  const sort = filters.sort ?? "popular";
  rows = [...rows].sort((a, b) => {
    if (sort === "newest") return a.dateAdded < b.dateAdded ? 1 : -1;
    if (sort === "title") return a.title.localeCompare(b.title);
    return recommendedScore(b) - recommendedScore(a);
  });
  return rows;
}

function recommendedScore(entry: Entry) {
  const dateScore = Number.isNaN(Date.parse(entry.dateAdded || ""))
    ? 0
    : Date.parse(entry.dateAdded) / 86_400_000_000_000;
  return (
    (entry.packageVerified ? 20 : 0) +
    (entry.source === "first-party" ? 12 : entry.source === "source-backed" ? 8 : 0) +
    (entry.safetyNotes ? 6 : 0) +
    (entry.privacyNotes ? 4 : 0) +
    (entry.reviewed ? 4 : 0) +
    dateScore
  );
}

export function getEntry(category: string, slug: string): Entry | undefined {
  return entryByRef(category, slug);
}

export function related(entry: Entry, limit = 4): Entry[] {
  const graphEntries = (entry.relatedEntries ?? [])
    .map((relation) => entryByRef(relation.category, relation.slug))
    .filter((candidate): candidate is Entry => Boolean(candidate))
    .filter((candidate) => candidate.category !== entry.category || candidate.slug !== entry.slug)
    .slice(0, limit);

  if (graphEntries.length > 0) return graphEntries;

  return relatedBySimilarity(entry, ENTRIES, limit);
}

export function relatedBySimilarity(entry: Entry, entries: Entry[], limit = 4): Entry[] {
  return entries
    .filter((candidate) => !sameEntry(candidate, entry))
    .map((e) => {
      let score = 0;
      if (e.category === entry.category) score += 3;
      const overlap = e.tags.filter((t) => entry.tags.includes(t)).length;
      score += overlap * 2;
      return { e, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.e);
}

/**
 * Up to `limit` guide entries that share tags with `entry`, ranked by tag
 * overlap. Deterministic and relevance-constrained — a guide must share at
 * least one tag — so entry pages can surface "how do I use this" next-step
 * links without noise. Returns [] when the entry has no tags or no guide shares
 * one. Ties break on slug for a stable order.
 */
export function relatedGuides(entry: Entry, limit = 3): Entry[] {
  const entryTags = new Set((entry.tags ?? []).map((tag) => tag.toLowerCase()));
  if (entryTags.size === 0) return [];
  return ENTRIES.filter(
    (candidate) => candidate.category === "guides" && !sameEntry(candidate, entry),
  )
    .map((guide) => ({
      guide,
      overlap: guide.tags.filter((tag) => entryTags.has(tag.toLowerCase())).length,
    }))
    .filter((scored) => scored.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || a.guide.slug.localeCompare(b.guide.slug))
    .slice(0, limit)
    .map((scored) => scored.guide);
}

// Order for surfacing relation groups (most decision-relevant first). "duplicate" is excluded.
const RELATION_ORDER: EntryRelationType[] = [
  "alternative",
  "works-with",
  "complementary",
  "extends",
  "prerequisite",
  "same-project",
  "same-ecosystem",
  "collection-member",
  "related",
];

// Group an entry's graph relations by their typed relation, so the entry page can render labeled
// "Works with" / "Alternatives" / "Prerequisites" sections. Returns [] when there's no graph
// relation data (the caller falls back to the flat related() grid).
export function relatedGroups(
  entry: Entry,
  perGroup = 6,
): { relation: EntryRelationType; entries: Entry[] }[] {
  const byRelation = new Map<EntryRelationType, Entry[]>();
  for (const rel of entry.relatedEntries ?? []) {
    if (rel.relation === "duplicate") continue;
    const candidate = entryByRef(rel.category, rel.slug);
    if (!candidate) continue;
    if (sameEntry(candidate, entry)) continue;
    const list = byRelation.get(rel.relation) ?? [];
    if (!byRelation.has(rel.relation)) byRelation.set(rel.relation, list);
    if (list.length < perGroup && !list.some((e) => sameEntry(e, candidate))) {
      list.push(candidate);
    }
  }
  return RELATION_ORDER.map((relation) => ({
    relation,
    entries: byRelation.get(relation) ?? [],
  })).filter((g) => g.entries.length > 0);
}
