import type { Entry } from "@/types/registry";
import { compareCuratedSummary } from "@/lib/compare-curated-summary";

export const BROWSE_COMPARE_MIN_ITEMS = 2;

export function shouldShowBrowseCompareHint(items: Entry[]): boolean {
  return items.length >= BROWSE_COMPARE_MIN_ITEMS;
}

export function browseCompareSummary(items: Entry[]) {
  return compareCuratedSummary(items);
}

export function browseCompareHintText(items: Entry[]): string | null {
  if (!shouldShowBrowseCompareHint(items)) return null;
  const summary = browseCompareSummary(items);
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
