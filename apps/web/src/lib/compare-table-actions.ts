import type { Entry } from "@/types/registry";
import {
  compareActionSignature,
  compareActionsDiverge,
  resolveCompareEntryActions,
  type CompareAction,
} from "@/lib/compare-entry-actions";

export const COMPARE_TABLE_SURFACE = "compare-table";

export type CompareTableActionCell = {
  entryKey: string;
  actions: CompareAction[];
};

export function shouldRenderCompareTableActions(entries: Entry[], enabled: boolean): boolean {
  return enabled && entries.length >= 2;
}

export function compareTableActionCells(entries: Entry[]): CompareTableActionCell[] {
  return entries.map((entry) => ({
    entryKey: `${entry.category}:${entry.slug}`,
    actions: resolveCompareEntryActions(entry),
  }));
}

export function compareTableActionsDiverge(entries: Entry[]): boolean {
  return compareActionsDiverge(entries);
}

export function compareTableSharedActionIds(entries: Entry[]): string[] {
  if (entries.length === 0) return [];
  const actionSets = entries.map(
    (entry) => new Set(resolveCompareEntryActions(entry).map((action) => action.id)),
  );
  const [first, ...rest] = actionSets;
  return [...first].filter((id) => rest.every((set) => set.has(id)));
}

export function compareTableActionSummary(entries: Entry[]): {
  comparedCount: number;
  diverges: boolean;
  sharedActionIds: string[];
  uniqueSignatures: number;
} {
  const signatures = entries.map(compareActionSignature);
  return {
    comparedCount: entries.length,
    diverges: compareActionsDiverge(entries),
    sharedActionIds: compareTableSharedActionIds(entries),
    uniqueSignatures: new Set(signatures).size,
  };
}
