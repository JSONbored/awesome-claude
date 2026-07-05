/**
 * Discovery surface ranking surface.
 *
 * Pure list builders live in `growth-surface-rules-lib.ts`. This module
 * re-exports that surface so existing `@/lib/growth-surface-rules` imports
 * stay unchanged.
 */
export type { GrowthSurfaceEntry } from "@/lib/growth-surface-rules-lib";
export {
  buildDiscoverySurfaceLists,
  hasInstallSurface,
  hasSafeInstallSignal,
  isSourceBackedEntry,
} from "@/lib/growth-surface-rules-lib";
