/**
 * Pure contributor identity helpers.
 *
 * Slug derivation and submitter matching used to reconcile author handles
 * against submission credit. Given the same strings the output is fully
 * deterministic — nothing here touches the DOM, network, or clock.
 *
 * The public surface (`contributor-identity.ts` / `@/lib/contributor-identity`)
 * re-exports everything below so existing imports stay unchanged.
 */

export function contributorSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function authorMatchesSubmitter(author?: string, submittedBy?: string) {
  if (!author || !submittedBy) return false;
  const authorSlug = contributorSlug(author);
  const submittedBySlug = contributorSlug(submittedBy);
  return Boolean(authorSlug && authorSlug === submittedBySlug);
}
