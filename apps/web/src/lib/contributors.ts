import { cache } from "react";

import { getDirectoryEntries } from "@/lib/content.server";
import { contributorSlug } from "@/lib/contributor-identity-lib";
import { groupContributorSummaries, type ContributorSummary } from "@/lib/contributors-rollup-lib";

// `contributorSlug` is the canonical handle->slug normalizer and already lives
// (unit-tested) in contributor-identity-lib. Re-export it here so existing
// `@/lib/contributors` consumers keep working without a second, drifting copy.
export { contributorSlug };
export type { ContributorSummary };

export const getContributors = cache(async () => {
  const entries = await getDirectoryEntries();
  return groupContributorSummaries(entries);
});

export const getContributor = cache(async (slug: string) => {
  const contributors = await getContributors();
  return contributors.find((contributor) => contributor.slug === slug) ?? null;
});
