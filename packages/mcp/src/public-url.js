/**
 * MCP public URL validation surface.
 *
 * Pure public URL helpers live in `public-url-lib.js`. This module re-exports
 * that surface so existing `@heyclaude/mcp/public-url` imports stay unchanged.
 */
export {
  hasEmbeddedUrlUserinfo,
  isPublicGitHubProfileUrl,
  isPublicHttpsUrl,
  publicUrlHostname,
} from "./public-url-lib.js";
