/**
 * Compare entry actions surface.
 *
 * Pure compare action helpers live in `compare-entry-actions-lib.ts`. This
 * module re-exports that surface and keeps async intent-event recording here
 * so existing `@/lib/compare-entry-actions` imports stay unchanged.
 */
export type { CompareAction, CompareActionKind } from "@/lib/compare-entry-actions-lib";
export {
  compareActionSignature,
  compareActionsDiverge,
  resolveCompareEntryActions,
} from "@/lib/compare-entry-actions-lib";

import type { Entry } from "@/types/registry";
import { recordIntentEvent } from "@/lib/intent-event-client";

export async function recordCompareIntentEvent(
  type: "copy" | "open" | "install",
  entry: Pick<Entry, "category" | "slug">,
): Promise<boolean> {
  return recordIntentEvent(type, entry);
}
