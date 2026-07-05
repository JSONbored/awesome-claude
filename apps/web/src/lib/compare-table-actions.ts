import type { Entry } from "@/types/registry";
import {
  compareSurfaceActionCells,
  compareSurfaceActionSummary,
  compareSurfaceActionsDiverge,
  compareSurfaceSharedActionIds,
  type CompareSurfaceActionCell,
} from "@/lib/compare-surface-actions-lib";

export const COMPARE_TABLE_SURFACE = "compare-table";

export type CompareTableActionCell = CompareSurfaceActionCell;

export function shouldRenderCompareTableActions(entries: Entry[], enabled: boolean): boolean {
  return enabled && entries.length >= 2;
}

export function compareTableActionCells(entries: Entry[]): CompareTableActionCell[] {
  return compareSurfaceActionCells(entries);
}

export function compareTableActionsDiverge(entries: Entry[]): boolean {
  return compareSurfaceActionsDiverge(entries);
}

export function compareTableSharedActionIds(entries: Entry[]): string[] {
  return compareSurfaceSharedActionIds(entries);
}

export function compareTableActionSummary(entries: Entry[]) {
  return compareSurfaceActionSummary(entries);
}
