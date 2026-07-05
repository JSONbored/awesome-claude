import type { Entry } from "@/types/registry";
import {
  compareSurfaceActionCells,
  compareSurfaceActionSummary,
  compareSurfaceActionsDiverge,
  compareSurfaceSharedActionIds,
  type CompareSurfaceActionCell,
} from "@/lib/compare-surface-actions-lib";

export const COMPARE_DRAWER_SURFACE = "compare-drawer";

export type CompareDrawerActionCell = CompareSurfaceActionCell;

export function compareDrawerActionCells(entries: Entry[]): CompareDrawerActionCell[] {
  return compareSurfaceActionCells(entries);
}

export function compareDrawerActionsDiverge(entries: Entry[]): boolean {
  return compareSurfaceActionsDiverge(entries);
}

export function compareDrawerSharedActionIds(entries: Entry[]): string[] {
  return compareSurfaceSharedActionIds(entries);
}

export function compareDrawerActionSummary(entries: Entry[]) {
  return compareSurfaceActionSummary(entries);
}
