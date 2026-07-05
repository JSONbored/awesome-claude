import type { Entry } from "@/types/registry";
import { resolveCompareEntryActions, type CompareAction } from "@/lib/compare-entry-actions";
import {
  COMPARE_DRAWER_SURFACE,
  compareDrawerActionCells,
  compareDrawerActionSummary,
  compareDrawerActionsDiverge,
  compareDrawerSharedActionIds,
  type CompareDrawerActionCell,
} from "@/lib/compare-drawer-actions";

export {
  COMPARE_DRAWER_SURFACE,
  compareDrawerActionCells,
  compareDrawerActionSummary,
  compareDrawerActionsDiverge,
  compareDrawerSharedActionIds,
};
export type { CompareAction, CompareDrawerActionCell };

export function compareDrawerEntryActions(entry: Entry): CompareAction[] {
  return resolveCompareEntryActions(entry);
}
