import type { Entry } from "@/types/registry";
import {
  COMPARE_DECISION_ROWS,
  compareSignalToneClass,
  decisionRowDiverges,
  type CompareSignalValue,
} from "@/lib/compare-entry-signals";

export type { CompareSignalValue };
export { compareSignalToneClass };

export type CompareDrawerDecisionRow = {
  label: string;
  resolve: (entry: Entry) => CompareSignalValue | undefined;
};

export function compareDrawerDecisionRows(): readonly CompareDrawerDecisionRow[] {
  return COMPARE_DECISION_ROWS;
}

export function compareDrawerDecisionRowDiverges(
  resolve: (entry: Entry) => CompareSignalValue | undefined,
  items: Entry[],
): boolean {
  return decisionRowDiverges(resolve, items);
}

export function compareDrawerDivergingDecisionLabels(items: Entry[]): string[] {
  return COMPARE_DECISION_ROWS.filter((row) => decisionRowDiverges(row.resolve, items)).map(
    (row) => row.label,
  );
}
