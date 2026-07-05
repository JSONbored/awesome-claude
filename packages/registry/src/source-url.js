/**
 * Source URL normalization surface.
 *
 * Pure URL helpers live in `source-url-lib.js`. This module re-exports that
 * surface so existing `@heyclaude/registry/source-url` imports stay unchanged.
 */
export {
  canonicalizeSourceUrl,
  hasAffiliateParam,
  hasEmbeddedUrlUserinfo,
  isAffiliateParam,
  isPublicGitHubHostUrl,
  isPublicGitHubProfileUrl,
  isPublicHttpUrl,
  isPublicHttpsUrl,
  isTrackingParam,
  publicHttpUrlHref,
  publicUrlHostname,
  stripTrackingParams,
} from "./source-url-lib.js";
