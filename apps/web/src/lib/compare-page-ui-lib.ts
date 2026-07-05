import type { Entry } from "@/types/registry";
import { compareActionsDiverge } from "@/lib/compare-entry-actions";
import {
  compareEmptyStateDescription,
  compareInvalidUrlHint,
  compareSingleItemHintText,
} from "@/lib/compare-empty-guidance";
import { comparePageBannerTexts } from "@/lib/compare-page-summary";
import { comparePageShareUrlForWindow } from "@/lib/compare-share-link";

export function comparePageShareUrl(items: Entry[]): string {
  return comparePageShareUrlForWindow(items);
}

export function comparePageHeaderBannerTexts(items: Entry[]): string[] {
  return comparePageBannerTexts(items);
}

export function comparePageSelectionHint(itemCount: number): string | null {
  return compareSingleItemHintText(itemCount);
}

export function comparePageActionsDiverge(items: Entry[]): boolean {
  return compareActionsDiverge(items);
}

export function comparePageEmptyStateDescription(): string {
  return compareEmptyStateDescription();
}

export function comparePageInvalidUrlHint(ids: string, resolvedCount: number): string | null {
  return compareInvalidUrlHint(ids, resolvedCount);
}

export type ComparePageUiState = {
  actionRowDiverges: boolean;
  bannerTexts: string[];
  singleItemHint: string | null;
  shareUrl: string;
};

export function comparePageUiState(items: Entry[]): ComparePageUiState {
  return {
    actionRowDiverges: compareActionsDiverge(items),
    bannerTexts: comparePageBannerTexts(items),
    singleItemHint: compareSingleItemHintText(items.length),
    shareUrl: comparePageShareUrlForWindow(items),
  };
}
