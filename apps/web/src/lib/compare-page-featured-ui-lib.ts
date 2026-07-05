import {
  compareFeaturedInteractiveLinkLabel,
  compareFeaturedInteractiveSearch,
  resolveComparisonRefs,
} from "@/lib/compare-featured-link";
import type { EntryIdentity } from "@/lib/entry-identity";

export type ComparePagePopularComparisonLink = {
  slug: string;
  heading: string;
  interactiveSearch: { ids: string } | null;
  interactiveLabel: string;
};

export function comparePagePopularComparisonLinks(
  comparisons: ReadonlyArray<{ slug: string; heading: string; refs: string[] }>,
  catalog: EntryIdentity[],
): ComparePagePopularComparisonLink[] {
  return comparisons.map((comparison) => {
    const resolvedCount = resolveComparisonRefs(comparison.refs, catalog).length;
    return {
      slug: comparison.slug,
      heading: comparison.heading,
      interactiveSearch: compareFeaturedInteractiveSearch(comparison.refs, catalog),
      interactiveLabel: compareFeaturedInteractiveLinkLabel(resolvedCount),
    };
  });
}
