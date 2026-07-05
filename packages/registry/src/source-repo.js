/**
 * GitHub source-repo parsing surface.
 *
 * Pure repo URL helpers live in `source-repo-lib.js`. This module re-exports
 * that surface so existing `@heyclaude/registry/source-repo` imports stay
 * unchanged.
 */
export { parseGitHubRepoUrl } from "./source-repo-lib.js";
