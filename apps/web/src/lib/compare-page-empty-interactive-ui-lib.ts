import type { EntryIdentity } from "@/lib/entry-identity";
import { comparePageFeaturedInteractiveUiState } from "@/lib/compare-page-featured-interactive-ui-lib";
import type { ComparePageEmptyUiState } from "@/lib/compare-page-empty-ui-lib";
import {
  comparePageEmptyStateDescription,
  comparePageInvalidUrlHint,
} from "@/lib/compare-page-ui-lib";

export type { ComparePageEmptyUiState };
export type ComparePageEmptyInteractiveUiState = ComparePageEmptyUiState;

export function comparePageEmptyInteractiveUiState(
  ids: string,
  comparisons: ReadonlyArray<{ slug: string; heading: string; refs: string[] }>,
  catalog: EntryIdentity[],
): ComparePageEmptyInteractiveUiState {
  return {
    description: comparePageEmptyStateDescription(),
    invalidUrlHint: comparePageInvalidUrlHint(ids, 0),
    popularComparisonLinks: comparePageFeaturedInteractiveUiState(comparisons, catalog),
  };
}
