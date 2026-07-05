import type { Entry } from "@/types/registry";
import { compareCuratedBannerTexts } from "@/lib/compare-curated-summary";
import { resolveComparisonRefs } from "@/lib/compare-featured-link";
import {
  compareInteractiveLinkLabel,
  compareInteractiveSearch,
} from "@/lib/compare-interactive-link";
import type { EntryIdentity } from "@/lib/entry-identity";

export function compareCuratedResolvedEntries(refs: string[], catalog: EntryIdentity[]): Entry[] {
  return resolveComparisonRefs(refs, catalog) as Entry[];
}

export function compareCuratedHasRenderableEntries(
  refs: string[],
  catalog: EntryIdentity[],
): boolean {
  return compareCuratedResolvedEntries(refs, catalog).length >= 2;
}

export function compareCuratedHeaderBannerTexts(entries: Entry[]): string[] {
  return compareCuratedBannerTexts(entries);
}

export function compareCuratedInteractiveSearch(entries: Entry[]): { ids: string } | null {
  return compareInteractiveSearch(entries);
}

export function compareCuratedInteractiveLinkLabel(entryCount: number): string {
  return compareInteractiveLinkLabel(entryCount);
}

export type CompareCuratedUiState = {
  entries: Entry[];
  bannerTexts: string[];
  interactiveSearch: { ids: string } | null;
  interactiveLinkLabel: string;
};

export function compareCuratedUiState(
  refs: string[],
  catalog: EntryIdentity[],
): CompareCuratedUiState {
  const entries = compareCuratedResolvedEntries(refs, catalog);
  return {
    entries,
    bannerTexts: compareCuratedBannerTexts(entries),
    interactiveSearch: compareInteractiveSearch(entries),
    interactiveLinkLabel: compareInteractiveLinkLabel(entries.length),
  };
}
