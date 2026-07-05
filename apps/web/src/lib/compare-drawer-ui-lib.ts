import type { Entry } from "@/types/registry";
import { compareBrowseShareUrlForWindow } from "@/lib/compare-browse-share-link";
import { compareFullViewSearch } from "@/lib/compare-interactive-link";

export function compareDrawerShareUrl(items: Entry[]): string {
  return compareBrowseShareUrlForWindow(items);
}

export function compareDrawerFullViewSearch(items: Entry[]): { ids: string } | null {
  return compareFullViewSearch(items);
}
