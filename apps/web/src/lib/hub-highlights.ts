/**
 * Hub highlight surface.
 *
 * Pure highlight and signal builders live in `hub-highlights-lib.ts`. This module
 * re-exports that surface so existing `@/lib/hub-highlights` imports stay unchanged.
 */
export type { HighlightKind, Highlight, HubStat } from "@/lib/hub-highlights-lib";
export { hubHighlights, hubStats, trustPosture } from "@/lib/hub-highlights-lib";
