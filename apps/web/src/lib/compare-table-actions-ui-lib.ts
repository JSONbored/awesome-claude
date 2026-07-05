import type { Entry } from "@/types/registry";
import { resolveCompareEntryActions, type CompareAction } from "@/lib/compare-entry-actions";
import {
  COMPARE_TABLE_SURFACE,
  compareTableActionCells,
  compareTableActionSummary,
  compareTableActionsDiverge,
  compareTableSharedActionIds,
  shouldRenderCompareTableActions,
  type CompareTableActionCell,
} from "@/lib/compare-table-actions";

export {
  COMPARE_TABLE_SURFACE,
  compareTableActionCells,
  compareTableActionSummary,
  compareTableActionsDiverge,
  compareTableSharedActionIds,
  shouldRenderCompareTableActions,
};
export type { CompareAction, CompareTableActionCell };

export function compareTableEntryActions(entry: Entry): CompareAction[] {
  return resolveCompareEntryActions(entry);
}
