/**
 * npm package spec parsing surface.
 *
 * Pure package spec helpers live in `package-spec-lib.js`. This module
 * re-exports that surface so existing `@heyclaude/registry/package-spec`
 * imports stay unchanged.
 */
export { isPinnedPackageSpec, parsePackageSpec } from "./package-spec-lib.js";
