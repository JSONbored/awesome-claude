import type { Entry } from "@/types/registry";
import { decisionRowDiverges, type CompareSignalValue } from "@/lib/compare-entry-signals";
import {
  comparisonDecisionRows,
  displayCompareSignal,
  signalToneClassForDisplay,
  type ComparisonDecisionRow,
} from "@/lib/compare-table-decision-rows";

export type { CompareSignalValue, ComparisonDecisionRow };
export { comparisonDecisionRows, displayCompareSignal, signalToneClassForDisplay };

export function compareTableDecisionRowDiverges(
  resolve: (entry: Entry) => CompareSignalValue | undefined,
  entries: Entry[],
): boolean {
  return decisionRowDiverges(resolve, entries);
}

export function compareTableDivergingDecisionLabels(entries: Entry[]): string[] {
  return comparisonDecisionRows()
    .filter((row) => row.diverges(entries))
    .map((row) => row.label);
}
