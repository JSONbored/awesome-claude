/**
 * Canonical platform taxonomy surface.
 *
 * Pure platform normalization helpers live in `platforms-lib.js`. This module
 * re-exports that surface so existing `@heyclaude/registry` imports stay
 * unchanged.
 */
export {
  PLATFORM_ALIASES,
  PLATFORM_IDS,
  PLATFORM_LABELS,
  normalizePlatform,
  normalizePlatforms,
} from "./platforms-lib.js";
