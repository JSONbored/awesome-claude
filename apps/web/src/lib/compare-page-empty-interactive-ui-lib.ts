import type { EntryIdentity } from "@/lib/entry-identity";
import type { ComparePagePopularComparisonLink } from "@/lib/compare-page-featured-ui-lib";
import { comparePageFeaturedInteractivePopularComparisonLinks } from "@/lib/compare-page-featured-interactive-ui-lib";
import type { ComparePageEmptyUiState } from "@/lib/compare-page-empty-ui-lib";
import {
  comparePageEmptyStateDescription,
  comparePageInvalidUrlHint,
} from "@/lib/compare-page-ui-lib";

export type { ComparePageEmptyUiState };
export type ComparePageEmptyInteractiveUiState = ComparePageEmptyUiState;

export function comparePageEmptyInteractiveDescription(): string {
  return comparePageEmptyStateDescription();
}

export function comparePageEmptyInteractiveInvalidUrlHint(ids: string): string | null {
  return comparePageInvalidUrlHint(ids, 0);
}

export function comparePageEmptyInteractivePopularComparisonLinks(
  comparisons: ReadonlyArray<{ slug: string; heading: string; refs: string[] }>,
  catalog: EntryIdentity[],
): ComparePagePopularComparisonLink[] {
  return comparePageFeaturedInteractivePopularComparisonLinks(comparisons, catalog);
}

export function comparePageEmptyInteractiveUiState(
  ids: string,
  comparisons: ReadonlyArray<{ slug: string; heading: string; refs: string[] }>,
  catalog: EntryIdentity[],
): ComparePageEmptyInteractiveUiState {
  return {
    description: comparePageEmptyInteractiveDescription(),
    invalidUrlHint: comparePageEmptyInteractiveInvalidUrlHint(ids),
    popularComparisonLinks: comparePageEmptyInteractivePopularComparisonLinks(comparisons, catalog),
  };
}
