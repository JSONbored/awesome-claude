/**
 * Ecosystem-pulse windowing surface.
 *
 * The pure trailing-window filter lives in `ecosystem-pulse-window-lib.ts`. This
 * module re-exports it so existing `@/lib/ecosystem-pulse-window` imports stay
 * unchanged.
 */
export { filterRecentPulseEntries } from "@/lib/ecosystem-pulse-window-lib";
