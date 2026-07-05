import {
  comparePageEmptyStateDescription,
  comparePageInvalidUrlHint,
} from "@/lib/compare-page-ui-lib";
import type { ComparePagePopularComparisonLink } from "@/lib/compare-page-featured-ui-lib";
import { comparePagePopularComparisonLinks } from "@/lib/compare-page-featured-ui-lib";
import type { EntryIdentity } from "@/lib/entry-identity";

export type ComparePageEmptyUiState = {
  description: string;
  invalidUrlHint: string | null;
  popularComparisonLinks: ComparePagePopularComparisonLink[];
};

export function comparePageEmptyUiState(
  ids: string,
  comparisons: ReadonlyArray<{ slug: string; heading: string; refs: string[] }>,
  catalog: EntryIdentity[],
): ComparePageEmptyUiState {
  return {
    description: comparePageEmptyStateDescription(),
    invalidUrlHint: comparePageInvalidUrlHint(ids, 0),
    popularComparisonLinks: comparePagePopularComparisonLinks(comparisons, catalog),
  };
}
