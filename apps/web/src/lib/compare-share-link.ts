import type { EntryIdentity } from "@/lib/entry-identity";
import { serializeCompareItems } from "@/lib/compare-selection";

export function comparePageSharePath(idsParam: string): string {
  const ids = idsParam.trim();
  return ids ? `/compare?ids=${encodeURIComponent(ids)}` : "/compare";
}

export function comparePageShareUrl(idsParam: string, origin = ""): string {
  return `${origin}${comparePageSharePath(idsParam)}`;
}

export function comparePageShareUrlFromEntries(entries: EntryIdentity[], origin = ""): string {
  return comparePageShareUrl(serializeCompareItems(entries), origin);
}
