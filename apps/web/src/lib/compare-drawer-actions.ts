import type { Entry } from "@/types/registry";
import {
  compareActionSignature,
  compareActionsDiverge,
  resolveCompareEntryActions,
  type CompareAction,
} from "@/lib/compare-entry-actions";

export const COMPARE_DRAWER_SURFACE = "compare-drawer";

export type CompareDrawerActionCell = {
  entryKey: string;
  actions: CompareAction[];
};

export function compareDrawerActionCells(entries: Entry[]): CompareDrawerActionCell[] {
  return entries.map((entry) => ({
    entryKey: `${entry.category}:${entry.slug}`,
    actions: resolveCompareEntryActions(entry),
  }));
}

export function compareDrawerActionsDiverge(entries: Entry[]): boolean {
  return compareActionsDiverge(entries);
}

export function compareDrawerSharedActionIds(entries: Entry[]): string[] {
  if (entries.length === 0) return [];
  const actionSets = entries.map(
    (entry) => new Set(resolveCompareEntryActions(entry).map((action) => action.id)),
  );
  const [first, ...rest] = actionSets;
  return [...first].filter((id) => rest.every((set) => set.has(id)));
}

export function compareDrawerActionSummary(entries: Entry[]): {
  comparedCount: number;
  diverges: boolean;
  sharedActionIds: string[];
  uniqueSignatures: number;
} {
  const signatures = entries.map(compareActionSignature);
  return {
    comparedCount: entries.length,
    diverges: compareActionsDiverge(entries),
    sharedActionIds: compareDrawerSharedActionIds(entries),
    uniqueSignatures: new Set(signatures).size,
  };
}
