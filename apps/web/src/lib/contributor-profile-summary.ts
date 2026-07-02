import { contributorForSubmitter } from "@/data/contributors";
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

export function submitterAttribution(
  entry: Pick<Entry, "submittedBy" | "submittedByUrl">,
): SubmitterAttribution | undefined {
  if (!entry.submittedBy) return undefined;

  const contributor = contributorForSubmitter(entry);
  if (contributor) {
    return { kind: "contributor", slug: contributor.slug, label: entry.submittedBy };
  }
  if (entry.submittedByUrl) {
    return { kind: "external", href: entry.submittedByUrl, label: entry.submittedBy };
  }
  return { kind: "plain", label: entry.submittedBy };
}
