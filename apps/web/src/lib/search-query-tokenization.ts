/**
 * Search-query tokenization surface.
 *
 * The pure tokenization helpers live in `search-query-tokenization-lib.ts`
 * (`@/lib/search-query-tokenization-lib`). This module re-exports that surface
 * so existing `@/lib/search-query-tokenization` importers stay unchanged.
 */
export {
  MAX_QUERY_LENGTH,
  MAX_QUERY_TOKENS,
  TOKEN_SPLIT_PATTERN,
  normalizeSearchQuery,
  tokenizeSearchQuery,
} from "@/lib/search-query-tokenization-lib";
