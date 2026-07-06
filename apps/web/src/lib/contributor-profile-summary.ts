/**
 * Contributor profile-summary surface.
 *
 * The pure helpers live in `contributor-profile-summary-lib.ts`. This module
 * keeps the `contributorForSubmitter` data lookup and re-exports the helpers so
 * existing `@/lib/contributor-profile-summary` imports stay unchanged.
 */
import { contributorForSubmitter } from "@/data/contributors";
import { submitterAttributionFrom } from "@/lib/contributor-profile-summary-lib";
import type { Entry } from "@/types/registry";

export {
  contributorCardSummary,
  contributorProfileStats,
  submitterAttributionFrom,
  type SubmitterAttribution,
} from "@/lib/contributor-profile-summary-lib";

export function submitterAttribution(entry: Pick<Entry, "submittedBy" | "submittedByUrl">) {
  return submitterAttributionFrom(entry, contributorForSubmitter(entry));
}
