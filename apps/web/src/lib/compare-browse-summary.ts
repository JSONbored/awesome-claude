import type { Entry } from "@/types/registry";
import { compareCuratedSummary } from "@/lib/compare-curated-summary";
import { COMPARE_INTERACTIVE_MAX, compareFullViewSearch } from "@/lib/compare-interactive-link";

export const BROWSE_COMPARE_MIN_ITEMS = 2;

export function shouldShowBrowseCompareHint(items: Entry[]): boolean {
  return items.length >= BROWSE_COMPARE_MIN_ITEMS;
}

export function browseCompareSelectedEntries(items: Entry[]): Entry[] {
  return items.slice(0, COMPARE_INTERACTIVE_MAX);
}

export function browseCompareSummary(items: Entry[]) {
  return compareCuratedSummary(items);
}

export function browseCompareOverflowHint(totalCount: number, openCount: number): string | null {
  if (totalCount <= openCount) return null;
  return `Opening ${openCount} of ${totalCount} selected in compare.`;
}

export function browseCompareHintText(items: Entry[]): string | null {
  const capped = browseCompareSelectedEntries(items);
  if (!shouldShowBrowseCompareHint(capped)) return null;
  const summary = browseCompareSummary(capped);
  if (!summary.hasAnyDivergence) {
    return "Open compare to review trust and next steps side by side.";
  }
  const parts: string[] = [];
  if (summary.decision.divergingCount > 0) {
    const signalWord = summary.decision.divergingCount === 1 ? "signal" : "signals";
    parts.push(`${summary.decision.divergingCount} trust ${signalWord} differ`);
  }
  if (summary.actionsDiverge) {
    parts.push("next steps differ");
  }
  return `${parts.join(" · ")} — open compare for details.`;
}

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
