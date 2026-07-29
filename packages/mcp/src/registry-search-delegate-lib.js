/**
 * Thin search-ranking delegates for registry handlers.
 *
 * Keeps registry.js free of direct search-ranking imports while preserving
 * the same function names for in-module use.
 */
import {
  matchesRegistryPlatform,
  matchesRegistryQuery,
  normalizedRegistrySearchText,
  rankRegistrySearchEntries,
  tokenizeRegistrySearchQuery,
} from "./search-ranking.js";

export function entryMatchesQuery(entry, query) {
  return matchesRegistryQuery(entry, query);
}

export function searchTokens(query) {
  return tokenizeRegistrySearchQuery(query);
}

export function entrySearchText(entry) {
  return normalizedRegistrySearchText(entry);
}

export function rankSearchEntries(entries, query) {
  return rankRegistrySearchEntries(entries, query);
}

export function entryMatchesPlatform(entry, platform) {
  return matchesRegistryPlatform(entry, platform);
}

/**
 * AND-match query filter with the same token-OR fallback plan/recommend use:
 * when strict AND-match returns nothing, match entries where any query token
 * appears in the normalized search haystack.
 */
export function filterEntriesByQuery(entries, query) {
  let matched = entries.filter((entry) => entryMatchesQuery(entry, query));
  const queryTokens = searchTokens(query);
  if (!matched.length && queryTokens.length) {
    matched = entries.filter((entry) =>
      queryTokens.some((token) => entrySearchText(entry).includes(token)),
    );
  }
  return matched;
}
