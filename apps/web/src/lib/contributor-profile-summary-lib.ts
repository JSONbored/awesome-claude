/**
 * Pure contributor profile-summary helpers.
 *
 * These derive display stats from a Contributor with no module state and no
 * side effects, so they are unit-testable in isolation. The
 * `contributor-profile-summary.ts` module (`@/lib/contributor-profile-summary`)
 * re-exports them and keeps the data-coupled `submitterAttribution` surface.
 */
import type { Contributor } from "@/types/registry";

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
