/**
 * Pure contributor profile-summary helpers.
 *
 * The stat rollup, the card summary string, and the submitter-attribution
 * decision are all deterministic given their inputs. The public surface
 * (`contributor-profile-summary.ts` / `@/lib/contributor-profile-summary`)
 * keeps the `contributorForSubmitter` data lookup and re-exports the helpers
 * below, resolving the contributor before delegating to `submitterAttributionFrom`.
 */
import type { Contributor, Entry } from "@/types/registry";

export function contributorProfileStats(contributor: Contributor) {
  return {
    accepted: contributor.acceptedCount,
    reviewed: contributor.reviewedCount ?? 0,
    sourceLinked: contributor.sourceSubmissionCount ?? 0,
    categories: contributor.categories?.length ?? 0,
  };
}

export function contributorCardSummary(contributor: Contributor) {
  const stats = contributorProfileStats(contributor);
  const parts = [`${stats.accepted} accepted`];
  if (stats.reviewed > 0) parts.push(`${stats.reviewed} reviewed`);
  if (stats.sourceLinked > 0) parts.push(`${stats.sourceLinked} source-linked`);
  return parts.join(" · ");
}

export type SubmitterAttribution =
  | { kind: "contributor"; slug: string; label: string }
  | { kind: "external"; href: string; label: string }
  | { kind: "plain"; label: string };

/**
 * Decide how to attribute an entry's submitter, given the already-resolved
 * contributor (or `null`/`undefined` when the submitter is not a known
 * contributor). Returns `undefined` when the entry has no submitter.
 */
export function submitterAttributionFrom(
  entry: Pick<Entry, "submittedBy" | "submittedByUrl">,
  contributor: Pick<Contributor, "slug"> | null | undefined,
): SubmitterAttribution | undefined {
  if (!entry.submittedBy) return undefined;

  if (contributor) {
    return {
      kind: "contributor",
      slug: contributor.slug,
      label: entry.submittedBy,
    };
  }
  if (entry.submittedByUrl) {
    return {
      kind: "external",
      href: entry.submittedByUrl,
      label: entry.submittedBy,
    };
  }
  return { kind: "plain", label: entry.submittedBy };
}
