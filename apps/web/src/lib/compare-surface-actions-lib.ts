/**
 * Shared compare surface action helpers.
 *
 * Builds per-column next-action cells and divergence summaries for compare
 * drawer and table surfaces. Nothing here touches the network — given the same
 * entry metadata the output is deterministic.
 */

import type { Entry } from "@/types/registry";
import {
  compareActionSignature,
  compareActionsDiverge,
  resolveCompareEntryActions,
  type CompareAction,
} from "@/lib/compare-entry-actions";

export type CompareSurfaceActionCell = {
  entryKey: string;
  actions: CompareAction[];
};

export function compareSurfaceActionCells(entries: Entry[]): CompareSurfaceActionCell[] {
  return entries.map((entry) => ({
    entryKey: `${entry.category}:${entry.slug}`,
    actions: resolveCompareEntryActions(entry),
  }));
}

export function compareSurfaceActionsDiverge(entries: Entry[]): boolean {
  return compareActionsDiverge(entries);
}

export function compareSurfaceSharedActionIds(entries: Entry[]): string[] {
  if (entries.length === 0) return [];
  const actionSets = entries.map(
    (entry) => new Set(resolveCompareEntryActions(entry).map((action) => action.id)),
  );
  const [first, ...rest] = actionSets;
  return [...first].filter((id) => rest.every((set) => set.has(id)));
}

export function compareSurfaceActionSummary(entries: Entry[]): {
  comparedCount: number;
  diverges: boolean;
  sharedActionIds: string[];
  uniqueSignatures: number;
} {
  const signatures = entries.map(compareActionSignature);
  return {
    comparedCount: entries.length,
    diverges: compareActionsDiverge(entries),
    sharedActionIds: compareSurfaceSharedActionIds(entries),
    uniqueSignatures: new Set(signatures).size,
  };
}
