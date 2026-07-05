import { COMPARE_INTERACTIVE_MAX, COMPARE_INTERACTIVE_MIN } from "@/lib/compare-interactive-link";
import type { EntryIdentity } from "@/lib/entry-identity";
import { parseEntryRef } from "@/lib/entry-identity";
import {
  compareInteractiveLinkLabel,
  compareInteractiveSearch,
} from "@/lib/compare-interactive-link";

export function compareEmptyStateDescription(): string {
  return `Add ${COMPARE_INTERACTIVE_MIN}–${COMPARE_INTERACTIVE_MAX} resources from the directory to see them side by side.`;
}

export function compareSingleItemHintText(itemCount: number): string | null {
  if (itemCount !== 1) return null;
  return "Add one more resource to unlock trust and next-step comparisons across the full table.";
}

export function compareInvalidUrlHint(idsParam: string, resolvedCount: number): string | null {
  if (!idsParam.trim() || resolvedCount > 0) return null;
  return "The compare link could not be resolved — choose resources from the directory instead.";
}

export function compareDrawerEmptyHint(): string {
  return "Add resources to compare by tapping the Compare button on any card.";
}

export function resolveCuratedPickRefs(refs: string[], catalog: EntryIdentity[]): EntryIdentity[] {
  const out: EntryIdentity[] = [];
  for (const ref of refs) {
    const identity = parseEntryRef(ref);
    if (!identity) continue;
    const entry = catalog.find(
      (candidate) => candidate.category === identity.category && candidate.slug === identity.slug,
    );
    if (entry) out.push(entry);
  }
  return out;
}

export function compareCuratedPickInteractiveSearch(
  refs: string[],
  catalog: EntryIdentity[],
): { ids: string } | null {
  return compareInteractiveSearch(resolveCuratedPickRefs(refs, catalog));
}

export function compareCuratedPickInteractiveLabel(resolvedCount: number): string {
  if (resolvedCount <= 2) {
    return "Open interactively";
  }
  return compareInteractiveLinkLabel(resolvedCount);
}
