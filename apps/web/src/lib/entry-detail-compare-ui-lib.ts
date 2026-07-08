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

export function entryDetailCompareCtaState(
  inCompare: boolean,
  compareCount: number,
  maxCount = ENTRY_DETAIL_COMPARE_MAX,
): EntryDetailCompareCtaState {
  const disabledReason = entryDetailCompareDisabledReason(inCompare, compareCount, maxCount);

  return {
    label: entryDetailCompareToggleLabel(inCompare),
    disabled: Boolean(disabledReason),
    hint: disabledReason,
    showOpenCompare: entryDetailCompareDrawerEnabled(compareCount),
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
