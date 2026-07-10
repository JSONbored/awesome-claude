/**
 * Pure entry detail compare CTA helpers.
 *
 * Builds compare tray labels and disabled states for the entry command
 * center without touching compare context or network calls.
 */

export const ENTRY_DETAIL_COMPARE_MAX = 4;

export type EntryDetailCompareCtaState = {
  label: string;
  disabled: boolean;
  hint: string | null;
  showOpenCompare: boolean;
  showOpenFullCompare: boolean;
  compareSearch: { ids: string } | null;
};

export type EntryDetailMobileCompareAction = {
  id: "compare";
  label: string;
  disabled: boolean;
  hint: string | null;
  inCompare: boolean;
  compareCount: number;
  maxCount: number;
};

export function entryDetailCompareToggleLabel(inCompare: boolean): string {
  return inCompare ? "Remove from compare" : "Add to compare";
}

export function entryDetailMobileCompareLabel(inCompare: boolean): string {
  return inCompare ? "In compare" : "Compare";
}

export function entryDetailCompareDisabledReason(
  inCompare: boolean,
  compareCount: number,
  maxCount = ENTRY_DETAIL_COMPARE_MAX,
): string | null {
  if (inCompare || compareCount < maxCount) return null;
  return `Compare is full (${maxCount}/${maxCount}). Remove an entry to add this one.`;
}

export function entryDetailCompareDrawerEnabled(compareCount: number): boolean {
  return compareCount >= 2;
}

export function entryDetailCompareFullSearch(compareIds: string): { ids: string } | null {
  const count = compareIds.split(",").filter((id) => id.trim()).length;
  if (count < 2) return null;
  return { ids: compareIds };
}

export function entryDetailCompareCtaState(
  inCompare: boolean,
  compareCount: number,
  compareIds = "",
  maxCount = ENTRY_DETAIL_COMPARE_MAX,
): EntryDetailCompareCtaState {
  const disabledReason = entryDetailCompareDisabledReason(inCompare, compareCount, maxCount);
  const showOpenCompare = entryDetailCompareDrawerEnabled(compareCount);
  const compareSearch = showOpenCompare ? entryDetailCompareFullSearch(compareIds) : null;

  return {
    label: entryDetailCompareToggleLabel(inCompare),
    disabled: Boolean(disabledReason),
    hint: disabledReason,
    showOpenCompare,
    showOpenFullCompare: Boolean(compareSearch),
    compareSearch,
  };
}

export function entryDetailMobileCompareAction(
  inCompare: boolean,
  compareCount: number,
  maxCount = ENTRY_DETAIL_COMPARE_MAX,
): EntryDetailMobileCompareAction {
  const disabledReason = entryDetailCompareDisabledReason(inCompare, compareCount, maxCount);

  return {
    id: "compare",
    label: entryDetailMobileCompareLabel(inCompare),
    disabled: Boolean(disabledReason),
    hint: disabledReason,
    inCompare,
    compareCount,
    maxCount,
  };
}
