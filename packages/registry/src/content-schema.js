/**
 * Content schema surface.
 *
 * Pure content schema helpers live in `content-schema-lib.js`. This module
 * re-exports that surface so existing `@heyclaude/registry/content-schema`
 * imports stay unchanged.
 */
export {
  CATEGORY_SCHEMAS,
  CLAIM_STATUS_VALUES,
  DEFAULT_DIRECTORY_REPO_URL,
  FORBIDDEN_CONTENT_FIELDS,
  SAFE_CONTENT_SLUG_PATTERN,
  SKILL_LEVEL_VALUES,
  SKILL_TYPE_VALUES,
  VERIFICATION_STATUS_VALUES,
  deriveCardDescription,
  deriveSeoFields,
  extractCodeBlocks,
  extractHeadings,
  extractSections,
  headingId,
  inferHookTrigger,
  inferLanguageFromCategory,
  inferRepoUrl,
  inferSectionBooleans,
  inferStructuredFields,
  looksLikeRawScript,
  normalizeBody,
  orderFrontmatter,
  stripCodeBlocks,
  validateEntry,
} from "./content-schema-lib.js";
