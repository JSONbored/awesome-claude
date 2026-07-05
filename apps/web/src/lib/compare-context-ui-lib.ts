import type { Entry } from "@/types/registry";
import { compareDrawerShareUrl } from "@/lib/compare-drawer-ui-lib";
import { serializeCompareItems } from "@/lib/compare-selection";

export function compareContextShareUrl(items: Entry[]): string {
  return compareDrawerShareUrl(items);
}

export function compareContextSelectionParam(items: Entry[]): string {
  return serializeCompareItems(items);
}
