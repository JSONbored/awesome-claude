/**
 * Pure contributor-identity helpers.
 *
 * These have no module state and no side effects: given the same input the
 * output is deterministic, so they are unit-testable in isolation. The
 * `contributor-identity.ts` module (`@/lib/contributor-identity`) re-exports
 * this surface so existing importers stay unchanged.
 */

/**
 * Normalize a handle/name into a URL-safe slug: trimmed, lowercased, a leading
 * `@` removed, runs of non-alphanumerics collapsed to single dashes, and
 * leading/trailing dashes stripped.
 */
export function contributorSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Whether an author and a submitter refer to the same contributor. Both must be
 * present and must normalize to the same non-empty slug.
 */
export function authorMatchesSubmitter(author?: string, submittedBy?: string) {
  if (!author || !submittedBy) return false;
  const authorSlug = contributorSlug(author);
  const submittedBySlug = contributorSlug(submittedBy);
  return Boolean(authorSlug && authorSlug === submittedBySlug);
}
