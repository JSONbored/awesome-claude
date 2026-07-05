/**
 * Safe frontmatter parsing surface.
 *
 * Pure frontmatter helpers live in `frontmatter-lib.js`. This module re-exports
 * that surface so existing `@heyclaude/registry/frontmatter` imports stay
 * unchanged.
 */
export {
  SAFE_MATTER_OPTIONS,
  UNSAFE_FRONTMATTER_LANGUAGE_ERROR,
  parseSafeFrontmatter,
} from "./frontmatter-lib.js";
