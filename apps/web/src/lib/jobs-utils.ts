/**
 * Jobs-board utility surface.
 *
 * The pure presentation/ranking helpers live in `jobs-utils-lib.ts`. This
 * module re-exports that surface so existing `@/lib/jobs-utils` imports stay
 * unchanged.
 */
export {
  monogram,
  companyTint,
  daysSince,
  relativePosted,
  isFresh,
  sortJobs,
  pickDailySpotlight,
} from "@/lib/jobs-utils-lib";
