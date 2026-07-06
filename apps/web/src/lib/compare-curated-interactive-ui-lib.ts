import type { EntryIdentity } from "@/lib/entry-identity";
import {
  compareCuratedHasRenderableEntries,
  compareCuratedUiState,
  type CompareCuratedUiState,
} from "@/lib/compare-curated-ui-lib";

export type CompareCuratedInteractiveUiState = CompareCuratedUiState & {
  renderable: boolean;
};

export function compareCuratedInteractiveUiState(
  refs: string[],
  catalog: EntryIdentity[],
): CompareCuratedInteractiveUiState {
  return {
    ...compareCuratedUiState(refs, catalog),
    renderable: compareCuratedHasRenderableEntries(refs, catalog),
  };
}

export function compareCuratedInteractivePageRenderable(
  refs: string[],
  catalog: EntryIdentity[],
): boolean {
  return compareCuratedInteractiveUiState(refs, catalog).renderable;
}
