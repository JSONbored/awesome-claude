import type { Entry } from "@/types/registry";
import { compareSingleItemHintText } from "@/lib/compare-empty-guidance";
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
