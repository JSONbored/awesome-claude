import type { EntryIdentity } from "@/lib/entry-identity";
import {
  comparePagePopularComparisonLinks,
  type ComparePagePopularComparisonLink,
} from "@/lib/compare-page-featured-ui-lib";

export type ComparePageFeaturedInteractiveUiState = ComparePagePopularComparisonLink[];

export function comparePageFeaturedInteractivePopularComparisonLinks(
  comparisons: ReadonlyArray<{ slug: string; heading: string; refs: string[] }>,
  catalog: EntryIdentity[],
): ComparePagePopularComparisonLink[] {
  return comparePagePopularComparisonLinks(comparisons, catalog);
}

export function comparePageFeaturedInteractiveUiState(
  comparisons: ReadonlyArray<{ slug: string; heading: string; refs: string[] }>,
  catalog: EntryIdentity[],
): ComparePageFeaturedInteractiveUiState {
  return comparePageFeaturedInteractivePopularComparisonLinks(comparisons, catalog);
}
