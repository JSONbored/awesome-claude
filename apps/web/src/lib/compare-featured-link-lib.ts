import type { EntryIdentity } from "@/lib/entry-identity";
import { parseEntryRef } from "@/lib/entry-identity";
import {
  compareInteractiveLinkLabel,
  compareInteractiveSearch,
} from "@/lib/compare-interactive-link-lib";

export function resolveComparisonRefs(refs: string[], catalog: EntryIdentity[]): EntryIdentity[] {
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

export function compareFeaturedInteractiveSearch(
  refs: string[],
  catalog: EntryIdentity[],
): { ids: string } | null {
  return compareInteractiveSearch(resolveComparisonRefs(refs, catalog));
}

export function compareFeaturedInteractiveLinkLabel(resolvedCount: number): string {
  if (resolvedCount <= 2) {
    return "Open interactively";
  }
  return compareInteractiveLinkLabel(resolvedCount);
}
