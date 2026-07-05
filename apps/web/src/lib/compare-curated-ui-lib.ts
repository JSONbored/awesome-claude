import type { Entry } from "@/types/registry";
import { compareCuratedBannerTexts } from "@/lib/compare-curated-summary";
import {
  compareInteractiveLinkLabel,
  compareInteractiveSearch,
} from "@/lib/compare-interactive-link";

export function compareCuratedHeaderBannerTexts(entries: Entry[]): string[] {
  return compareCuratedBannerTexts(entries);
}

export function compareCuratedInteractiveSearch(entries: Entry[]): { ids: string } | null {
  return compareInteractiveSearch(entries);
}

export function compareCuratedInteractiveLinkLabel(entryCount: number): string {
  return compareInteractiveLinkLabel(entryCount);
}
