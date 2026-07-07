/**
 * Ecosystem-pulse recency window surface.
 *
 * The pure filter lives in `ecosystem-pulse-window-lib.ts`
 * (`@/lib/ecosystem-pulse-window-lib`). This module re-exports it so existing
 * `@/lib/ecosystem-pulse-window` importers stay unchanged.
 */
export { filterRecentPulseEntries } from "@/lib/ecosystem-pulse-window-lib";
