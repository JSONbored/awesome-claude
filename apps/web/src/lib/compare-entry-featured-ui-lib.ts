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

export function compareEntryFeaturedShowsFeaturedLinks(
  comparisons: ReadonlyArray<{ slug: string; refs: string[] }>,
  lists: ReadonlyArray<{ slug: string; picks: BestListPickRef[] }>,
  catalog: EntryIdentity[],
): boolean {
  return (
    compareEntryFeaturedComparisonLinks(comparisons, catalog).length > 0 ||
    compareEntryFeaturedBestListLinks(lists, catalog).length > 0
  );
}

export type CompareEntryFeaturedUiState = {
  comparisonLinks: CompareEntryFeaturedComparisonLink[];
  bestListLinks: CompareEntryFeaturedBestListLink[];
  hasFeaturedLinks: boolean;
};

export function compareEntryFeaturedUiState(
  comparisons: ReadonlyArray<{ slug: string; refs: string[] }>,
  lists: ReadonlyArray<{ slug: string; picks: BestListPickRef[] }>,
  catalog: EntryIdentity[],
): CompareEntryFeaturedUiState {
  const comparisonLinks = compareEntryFeaturedComparisonLinks(comparisons, catalog);
  const bestListLinks = compareEntryFeaturedBestListLinks(lists, catalog);
  return {
    comparisonLinks,
    bestListLinks,
    hasFeaturedLinks: compareEntryFeaturedShowsFeaturedLinks(comparisons, lists, catalog),
  };
}
