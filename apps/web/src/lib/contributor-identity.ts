/**
 * Contributor-identity surface.
 *
 * The pure helpers live in `contributor-identity-lib.ts`
 * (`@/lib/contributor-identity-lib`). This module re-exports that surface so
 * existing `@/lib/contributor-identity` importers stay unchanged.
 */
export { authorMatchesSubmitter, contributorSlug } from "@/lib/contributor-identity-lib";
