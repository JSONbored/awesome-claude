/**
 * Public registry relation surface.
 *
 * Pure scoring, URL/token normalization, and inverted-index graph building live
 * in `relationships-lib.js`. This module re-exports that surface so existing
 * `@heyclaude/registry` and `artifacts.js` imports stay unchanged.
 */
export {
  REGISTRY_RELATION_TYPES,
  DEFAULT_RELATION_LIMIT,
  GENERIC_SOURCE_DOMAINS,
  STOP_WORDS,
  entryKey,
  entryUrl,
  normalizeToken,
  unique,
  normalizeUrl,
  sourceDomain,
  sourceUrls,
  sourceDomains,
  githubRepoKey,
  textTokens,
  collectionRefs,
  categoryPairKind,
  relationTypeFor,
  scoreCandidate,
  intersection,
  buildEntryRelations,
  buildRegistryRelationGraph,
  relationLookupFromGraph,
} from "./relationships-lib.js";
