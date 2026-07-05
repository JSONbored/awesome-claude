import type { Entry } from "@/types/registry";
import { compareBrowseShareUrlForWindow } from "@/lib/compare-browse-share-link";
import { compareDrawerBannerTexts } from "@/lib/compare-drawer-summary";
import { compareDrawerEmptyHint } from "@/lib/compare-empty-guidance";
import { compareFullViewSearch } from "@/lib/compare-interactive-link";

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
