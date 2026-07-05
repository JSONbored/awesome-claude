import type { Entry } from "@/types/registry";
import {
  browseCompareHintText,
  browseCompareOverflowHint,
  browseCompareSelectedEntries,
  shouldShowBrowseCompareHint,
} from "@/lib/compare-browse-summary";
import { compareFullViewSearch } from "@/lib/compare-interactive-link";

export function browseCompareUiState(items: Entry[]): {
  search: { ids: string };
  selectedCount: number;
  hint: string | null;
  overflowHint: string | null;
} | null {
  if (!shouldShowBrowseCompareHint(items)) return null;
  const capped = browseCompareSelectedEntries(items);
  const search = compareFullViewSearch(capped)!;
  return {
    search,
    selectedCount: capped.length,
    hint: browseCompareHintText(items),
    overflowHint: browseCompareOverflowHint(items.length, capped.length),
  };
}
