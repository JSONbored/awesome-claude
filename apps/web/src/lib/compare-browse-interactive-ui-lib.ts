import type { Entry } from "@/types/registry";
import { shouldShowBrowseCompareHint } from "@/lib/compare-browse-summary";
import { browseCompareUiState } from "@/lib/compare-browse-ui-lib";

export type BrowseCompareInteractiveUiState = NonNullable<
  ReturnType<typeof browseCompareUiState>
> & {
  showHint: boolean;
};

export function browseCompareInteractiveUiState(
  items: Entry[],
): BrowseCompareInteractiveUiState | null {
  if (!shouldShowBrowseCompareHint(items)) return null;
  return {
    ...browseCompareUiState(items)!,
    showHint: browseCompareInteractiveUiShowsHint(items),
  };
}

export function browseCompareInteractiveUiShowsHint(items: Entry[]): boolean {
  return shouldShowBrowseCompareHint(items);
}
