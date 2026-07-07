import type { Entry } from "@/types/registry";
import { compareDrawerActionsDiverge } from "@/lib/compare-drawer-actions";
import { compareBrowseShareUrlForWindow } from "@/lib/compare-browse-share-link";
import { compareDrawerBannerTexts } from "@/lib/compare-drawer-summary";
import { compareDrawerEmptyHint } from "@/lib/compare-empty-guidance";
import { compareFullViewSearch } from "@/lib/compare-interactive-link";

export type CompareDrawerUiState = {
  actionRowDiverges: boolean;
  bannerTexts: string[];
  fullViewSearch: { ids: string } | null;
};

export function compareDrawerUiState(items: Entry[]): CompareDrawerUiState {
  return {
    actionRowDiverges: compareDrawerUiActionsDiverge(items),
    bannerTexts: compareDrawerHeaderBannerTexts(items),
    fullViewSearch: compareDrawerFullViewSearch(items),
  };
}

export function compareDrawerUiActionsDiverge(items: Entry[]): boolean {
  return compareDrawerActionsDiverge(items);
}

export function compareDrawerShareUrl(items: Entry[]): string {
  return compareBrowseShareUrlForWindow(items);
}

export function compareDrawerFullViewSearch(items: Entry[]): { ids: string } | null {
  return compareFullViewSearch(items);
}

export function compareDrawerHeaderBannerTexts(items: Entry[]): string[] {
  return compareDrawerBannerTexts(items);
}

export function compareDrawerEmptyStateHint(): string {
  return compareDrawerEmptyHint();
}
