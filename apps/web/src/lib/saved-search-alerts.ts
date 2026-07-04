/**
 * Saved-search alert surface.
 *
 * Pure matching and alert builders live in `saved-search-alerts-lib.ts`. This
 * module re-exports that surface so existing `@/lib/saved-search-alerts`
 * imports stay unchanged.
 */
export type {
  SavedSearchAlertSchedule,
  SavedSearchAlertSearch,
  SavedSearchAlertEntry,
  SavedSearchAlertEvent,
  SavedSearchAlertSeverity,
  SavedSearchAlert,
} from "@/lib/saved-search-alerts-lib";
export {
  savedSearchAlertTargetId,
  activeInAppSavedSearches,
  savedSearchQueryMatchesEntry,
  savedSearchMatchesEntry,
  buildSavedSearchAlerts,
} from "@/lib/saved-search-alerts-lib";
