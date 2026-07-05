/**
 * Ecosystem statistics surface.
 *
 * Pure ecosystem stats helpers live in `ecosystem-stats-lib.ts`. This module
 * re-exports that surface so existing `@/lib/ecosystem-stats` imports stay
 * unchanged.
 */
export type { StatRow } from "@/lib/ecosystem-stats-lib";
export {
  installMethodDistribution,
  installMethodOf,
  notesCoverage,
} from "@/lib/ecosystem-stats-lib";
