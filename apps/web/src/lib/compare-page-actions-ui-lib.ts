import type { Entry } from "@/types/registry";
import { resolveCompareEntryActions, type CompareAction } from "@/lib/compare-entry-actions";
import { COMPARE_PAGE_SURFACE } from "@/lib/compare-page-summary";
import {
  compareSurfaceActionCells,
  compareSurfaceActionSummary,
  compareSurfaceActionsDiverge,
  compareSurfaceSharedActionIds,
  type CompareSurfaceActionCell,
} from "@/lib/compare-surface-actions-lib";

export { COMPARE_PAGE_SURFACE };
export type { CompareAction };

export type ComparePageActionCell = CompareSurfaceActionCell;

export function comparePageEntryActions(entry: Entry): CompareAction[] {
  return resolveCompareEntryActions(entry);
}

export function comparePageActionCells(entries: Entry[]): ComparePageActionCell[] {
  return compareSurfaceActionCells(entries);
}

export function comparePageActionsDiverge(entries: Entry[]): boolean {
  return compareSurfaceActionsDiverge(entries);
}

export function comparePageSharedActionIds(entries: Entry[]): string[] {
  return compareSurfaceSharedActionIds(entries);
}

export function comparePageActionSummary(entries: Entry[]) {
  return compareSurfaceActionSummary(entries);
}
