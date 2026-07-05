import type { EntryIdentity } from "@/lib/entry-identity";
import { serializeCompareItems } from "@/lib/compare-selection";
import { compareShareOrigin } from "@/lib/compare-share-origin";

export function compareBrowseSharePath(idsParam: string): string {
  const ids = idsParam.trim();
  return ids ? `/browse?compare=${encodeURIComponent(ids)}` : "/browse";
}

export function compareBrowseShareUrl(idsParam: string, origin = ""): string {
  return `${origin}${compareBrowseSharePath(idsParam)}`;
}

export function compareBrowseShareUrlFromEntries(entries: EntryIdentity[], origin = ""): string {
  return compareBrowseShareUrl(serializeCompareItems(entries), origin);
}

export function compareBrowseShareUrlForWindow(entries: EntryIdentity[]): string {
  return compareBrowseShareUrlFromEntries(entries, compareShareOrigin());
}
