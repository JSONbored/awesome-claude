import type { Entry } from "@/types/registry";
import { compareBestBannerTexts, shouldShowBestCompareSection } from "@/lib/compare-best-summary";
import {
  compareInteractiveLinkLabel,
  compareInteractiveSearch,
} from "@/lib/compare-interactive-link";

export function compareBestHeaderBannerTexts(entries: Entry[]): string[] {
  return compareBestBannerTexts(entries);
}

export function compareBestInteractiveSearch(entries: Entry[]): { ids: string } | null {
  return compareInteractiveSearch(entries);
}

export function compareBestInteractiveLinkLabel(entryCount: number): string {
  return compareInteractiveLinkLabel(entryCount);
}

export function compareBestShowCompareSection(entries: Entry[]): boolean {
  return shouldShowBestCompareSection(entries);
}
