/**
 * MCP platform helpers surface.
 *
 * Pure platform helpers live in `platforms-lib.js`. This module re-exports
 * that surface so existing `./platforms.js` imports stay unchanged.
 */
export {
  SITE_URL,
  buildSkillPlatformCompatibility,
  platformFeedSlug,
} from "./platforms-lib.js";
