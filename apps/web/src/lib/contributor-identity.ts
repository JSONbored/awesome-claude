/**
 * Contributor identity surface.
 *
 * Pure helpers live in `contributor-identity-lib.ts`. This module re-exports
 * that surface so existing `@/lib/contributor-identity` imports stay unchanged.
 */
export { contributorSlug, authorMatchesSubmitter } from "@/lib/contributor-identity-lib";
