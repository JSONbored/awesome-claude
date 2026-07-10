import type { EntryIdentity } from "@/lib/entry-identity";
import {
  compareCuratedHasRenderableEntries,
  compareCuratedHeaderBannerTexts,
  compareCuratedInteractiveLinkLabel,
  compareCuratedInteractiveSearch,
  compareCuratedResolvedEntries,
  type CompareCuratedUiState,
} from "@/lib/compare-curated-ui-lib";

export type CompareCuratedInteractiveUiState = CompareCuratedUiState & {
  renderable: boolean;
};

export function compareCuratedInteractivePageRenderable(
  refs: string[],
  catalog: EntryIdentity[],
): boolean {
  return compareCuratedHasRenderableEntries(refs, catalog);
}

export function compareCuratedInteractiveUiState(
  refs: string[],
  catalog: EntryIdentity[],
): CompareCuratedInteractiveUiState {
  const entries = compareCuratedResolvedEntries(refs, catalog);
  return {
    entries,
    bannerTexts: compareCuratedHeaderBannerTexts(entries),
    interactiveSearch: compareCuratedInteractiveSearch(entries),
    interactiveLinkLabel: compareCuratedInteractiveLinkLabel(entries.length),
    renderable: compareCuratedInteractivePageRenderable(refs, catalog),
  };
}
