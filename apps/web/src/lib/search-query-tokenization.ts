/**
 * Search query tokenization surface.
 *
 * Pure helpers live in `search-query-tokenization-lib.ts`. This module
 * re-exports that surface so existing `@/lib/search-query-tokenization` imports
 * stay unchanged.
 */
export {
  TOKEN_SPLIT_PATTERN,
  MAX_QUERY_LENGTH,
  MAX_QUERY_TOKENS,
  normalizeSearchQuery,
  tokenizeSearchQuery,
} from "@/lib/search-query-tokenization-lib";
