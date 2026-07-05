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

export async function recordCompareIntentEvent(
  type: "copy" | "open" | "install",
  entry: Pick<Entry, "category" | "slug">,
): Promise<boolean> {
  try {
    const response = await fetch("/api/intent-events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type,
        entryKey: `${entry.category}:${entry.slug}`,
      }),
    });
    if (!response.ok) return false;
    const payload = (await response.json()) as { stored?: boolean };
    return payload.stored === true;
  } catch {
    return false;
  }
}
