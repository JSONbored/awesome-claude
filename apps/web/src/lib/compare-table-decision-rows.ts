import type { Entry } from "@/types/registry";
import {
  COMPARE_DECISION_ROWS,
  compareSignalToneClass,
  decisionRowDiverges,
  resolveCompareSignal,
  type CompareSignalValue,
} from "@/lib/compare-entry-signals";

export type ComparisonDecisionRow = {
  label: string;
  resolve: (entry: Entry) => CompareSignalValue | undefined;
  diverges: (entries: Entry[]) => boolean;
};

export function comparisonDecisionRows(): ComparisonDecisionRow[] {
  return COMPARE_DECISION_ROWS.map((row) => ({
    label: row.label,
    resolve: row.resolve,
    diverges: (entries: Entry[]) => decisionRowDiverges(row.resolve, entries),
  }));
}

export function divergingDecisionRowLabels(entries: Entry[]): string[] {
  if (entries.length < 2) return [];
  return comparisonDecisionRows()
    .filter((row) => row.diverges(entries))
    .map((row) => row.label);
}

export function hasCompareDecisionDivergence(entries: Entry[]): boolean {
  return divergingDecisionRowLabels(entries).length > 0;
}

export function compareDecisionSummary(entries: Entry[]): {
  comparedCount: number;
  divergingCount: number;
  divergingLabels: string[];
} {
  const divergingLabels = divergingDecisionRowLabels(entries);
  return {
    comparedCount: entries.length,
    divergingCount: divergingLabels.length,
    divergingLabels,
  };
}

export function displayCompareSignal(value: CompareSignalValue | undefined): CompareSignalValue {
  return resolveCompareSignal(value);
}

export function signalToneClassForDisplay(value: CompareSignalValue | undefined): string {
  return compareSignalToneClass(displayCompareSignal(value).tone);
}
