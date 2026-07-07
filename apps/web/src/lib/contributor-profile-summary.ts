import { contributorForSubmitter } from "@/data/contributors";
import type { Entry } from "@/types/registry";

export {
  contributorCardSummary,
  contributorProfileStats,
} from "@/lib/contributor-profile-summary-lib";

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
