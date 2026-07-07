/**
 * Entry detail command center surface.
 *
 * Pure helpers live in `entry-detail-command-center-lib.ts`. This module
 * re-exports that surface so existing `@/lib/entry-detail-command-center`
 * imports stay stable.
 */
export type {
  DetailCommunityAnchor,
  DetailMobileAction,
  DetailMobileActionKind,
  DetailQuickLink,
  DetailReadinessItem,
} from "@/lib/entry-detail-command-center-lib";
export {
  ENTRY_COMMAND_CENTER_ID,
  detailMobileActionIds,
  detailSafetyGateMessage,
  entryDetailSuggestChangeUrl,
  resolveDetailCommunityAnchors,
  resolveDetailMobileActions,
  resolveDetailQuickLinks,
  resolveDetailReadinessItems,
  shouldElevateDetailSafetyGate,
} from "@/lib/entry-detail-command-center-lib";
