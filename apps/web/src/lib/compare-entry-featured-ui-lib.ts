import type { BestListPickRef } from "@/lib/compare-best-summary";
import {
  compareBestListInteractiveLinkLabel,
  compareBestListInteractiveSearch,
} from "@/lib/compare-best-summary";
import {
  compareFeaturedInteractiveLinkLabel,
  compareFeaturedInteractiveSearch,
  resolveComparisonRefs,
} from "@/lib/compare-featured-link";
import type { EntryIdentity } from "@/lib/entry-identity";

export type CompareEntryFeaturedComparisonLink = {
  slug: string;
  search: { ids: string } | null;
  label: string;
};

export type CompareEntryFeaturedBestListLink = {
  slug: string;
  search: { ids: string } | null;
  label: string;
};

export function compareEntryFeaturedComparisonLinks(
  comparisons: ReadonlyArray<{ slug: string; refs: string[] }>,
  catalog: EntryIdentity[],
): CompareEntryFeaturedComparisonLink[] {
  return comparisons.map((comparison) => {
    const resolved = resolveComparisonRefs(comparison.refs, catalog);
    return {
      slug: comparison.slug,
      search: compareFeaturedInteractiveSearch(comparison.refs, catalog),
      label: compareFeaturedInteractiveLinkLabel(resolved.length),
    };
  });
}

export function compareEntryFeaturedBestListLinks(
  lists: ReadonlyArray<{ slug: string; picks: BestListPickRef[] }>,
  catalog: EntryIdentity[],
): CompareEntryFeaturedBestListLink[] {
  return lists.map((list) => ({
    slug: list.slug,
    search: compareBestListInteractiveSearch(list.picks, catalog),
    label: compareBestListInteractiveLinkLabel(list.picks, catalog),
  }));
}
