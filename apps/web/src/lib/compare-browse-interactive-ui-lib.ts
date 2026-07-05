import type { Entry } from "@/types/registry";
import { browseCompareUiState } from "@/lib/compare-browse-ui-lib";

export type BrowseCompareInteractiveUiState = NonNullable<ReturnType<typeof browseCompareUiState>>;

export function browseCompareInteractiveUiState(
  items: Entry[],
): BrowseCompareInteractiveUiState | null {
  return browseCompareUiState(items);
}
