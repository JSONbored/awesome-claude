import type { Entry } from "@/types/registry";
import { shouldShowBrowseCompareHint } from "@/lib/compare-browse-summary";
import { browseCompareUiState } from "@/lib/compare-browse-ui-lib";

export type BrowseCompareInteractiveUiState = NonNullable<
  ReturnType<typeof browseCompareUiState>
> & {
  showHint: boolean;
};

export function browseCompareInteractiveUiShowsHint(items: Entry[]): boolean {
  return shouldShowBrowseCompareHint(items);
}

export function browseCompareInteractiveBundledState(
  items: Entry[],
): ReturnType<typeof browseCompareUiState> {
  return browseCompareUiState(items);
}

export function browseCompareInteractiveUiState(
  items: Entry[],
): BrowseCompareInteractiveUiState | null {
  const bundled = browseCompareInteractiveBundledState(items);
  if (!bundled) return null;
  return {
    ...bundled,
    showHint: browseCompareInteractiveUiShowsHint(items),
  };
}
