/**
 * Pure search-query tokenization helpers.
 *
 * These have no module state and no side effects: given the same query string
 * the output is deterministic, so they are unit-testable in isolation. The
 * `search-query-tokenization.ts` module (`@/lib/search-query-tokenization`)
 * re-exports this surface so existing importers stay unchanged.
 */

export const TOKEN_SPLIT_PATTERN = /[^a-z0-9+#.-]+/i;
export const MAX_QUERY_LENGTH = 256;
export const MAX_QUERY_TOKENS = 12;

/** Trim, lowercase, and cap query length before tokenization. */
export function normalizeSearchQuery(query: string) {
  return query.slice(0, MAX_QUERY_LENGTH).trim().toLowerCase();
}

/** Walk the query character-by-character so pathological inputs cannot force a huge split. */
export function tokenizeSearchQuery(query: string) {
  const tokens: string[] = [];
  let token = "";

  for (let index = 0; index < query.length && tokens.length < MAX_QUERY_TOKENS; index += 1) {
    const char = query[index]!;
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
