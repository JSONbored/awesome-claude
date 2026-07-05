import type { EntryIdentity } from "@/lib/entry-identity";
import { serializeCompareItems } from "@/lib/compare-selection";

export const COMPARE_INTERACTIVE_MIN = 2;
export const COMPARE_INTERACTIVE_MAX = 4;

export function canOpenInteractiveCompare(entries: EntryIdentity[]): boolean {
  return entries.length >= COMPARE_INTERACTIVE_MIN && entries.length <= COMPARE_INTERACTIVE_MAX;
}

export function compareInteractiveEntryCount(entryCount: number): number {
  return Math.min(entryCount, COMPARE_INTERACTIVE_MAX);
}

export function compareInteractiveSearch(entries: EntryIdentity[]): { ids: string } | null {
  const slice = entries.slice(0, COMPARE_INTERACTIVE_MAX);
  if (!canOpenInteractiveCompare(slice)) return null;
  return { ids: serializeCompareItems(slice) };
}

export function compareInteractiveLinkLabel(entryCount: number): string {
  const count = compareInteractiveEntryCount(entryCount);
  if (count === COMPARE_INTERACTIVE_MIN) {
    return "Open in the interactive comparison tool";
  }
  return `Open ${count} picks in the interactive comparison tool`;
}
