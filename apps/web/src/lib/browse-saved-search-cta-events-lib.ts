/**
 * Pure browse saved-search and pagination analytics helpers.
 *
 * Maps saved-search and load-more interactions to privacy-light event
 * names without embedding search labels or query strings.
 */

import type { AlertCadence, AlertChannel, SavedSearch } from "@/lib/recents-types-lib";

export const BROWSE_SAVED_SEARCH_SURFACE = "browse-saved-search";
export const BROWSE_SAVED_SEARCH_MANAGER_SURFACE = "browse-saved-search-manager";
export const BROWSE_RECENTS_PANEL_SURFACE = "browse-recents-panel";
export const BROWSE_RESULTS_SURFACE = "browse-results";

export function savedSearchFilterCount(
  search: Pick<SavedSearch, "q" | "category" | "trust" | "source" | "signal" | "platform">,
): number {
  return (
    Number(!!search.q) +
    Number(!!search.category) +
    Number(!!search.trust) +
    Number(!!search.source) +
    Number(!!search.signal) +
    Number(!!search.platform)
  );
}

export function browseSavedSearchApplyAnalyticsEvent(): string {
  return "browse_saved_search_apply";
}

export function browseSavedSearchApplyAnalyticsData(
  search: Pick<SavedSearch, "q" | "category" | "trust" | "source" | "signal" | "platform"> & {
    alerts?: SavedSearch["alerts"];
  },
) {
  return {
    surface: BROWSE_SAVED_SEARCH_SURFACE,
    filterCount: savedSearchFilterCount(search),
    hasAlerts: Boolean(search.alerts?.enabled),
  };
}

export function browseSavedSearchSaveAnalyticsEvent(): string {
  return "browse_saved_search_save";
}

export function browseSavedSearchSaveAnalyticsData(activeCount: number) {
  return {
    surface: BROWSE_SAVED_SEARCH_SURFACE,
    activeCount,
  };
}

export function browseLoadMoreAnalyticsEvent(): string {
  return "browse_load_more";
}

export function browseLoadMoreAnalyticsData(shown: number, total: number, loadCount: number) {
  return {
    surface: BROWSE_RESULTS_SURFACE,
    shown,
    total,
    loadCount,
  };
}

export function browseEmptySuggestionApplyAnalyticsEvent(): string {
  return "browse_empty_suggestion_apply";
}

export function browseEmptySuggestionApplyAnalyticsData(matchCount: number) {
  return {
    surface: BROWSE_RESULTS_SURFACE,
    matchCount,
  };
}

export function browseSavedSearchLinkClickAnalyticsEvent(): string {
  return "browse_saved_search_link_click";
}

export function browseSavedSearchLinkClickAnalyticsData(
  search: Pick<SavedSearch, "q" | "category" | "trust" | "source" | "signal" | "platform"> & {
    alerts?: SavedSearch["alerts"];
  },
) {
  return {
    surface: BROWSE_RECENTS_PANEL_SURFACE,
    filterCount: savedSearchFilterCount(search),
    hasAlerts: Boolean(search.alerts?.enabled),
  };
}

export function browseSavedSearchRemoveAnalyticsEvent(): string {
  return "browse_saved_search_remove";
}

export function browseSavedSearchRemoveAnalyticsData(savedCount: number) {
  return {
    surface: BROWSE_RECENTS_PANEL_SURFACE,
    savedCount,
  };
}

export function browseRecentEntryClickAnalyticsEvent(): string {
  return "browse_recent_entry_click";
}

export function browseRecentEntryClickAnalyticsData(position: number, recentCount: number) {
  return {
    surface: BROWSE_RECENTS_PANEL_SURFACE,
    position,
    recentCount,
  };
}

export function browseSavedSearchManagerOpenAnalyticsEvent(): string {
  return "browse_saved_search_manager_open";
}

export function browseSavedSearchManagerOpenAnalyticsData(savedCount: number) {
  return {
    surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
    savedCount,
  };
}

export function browseSavedSearchManagerApplyAnalyticsEvent(): string {
  return "browse_saved_search_manager_apply";
}

export function browseSavedSearchManagerApplyAnalyticsData(
  search: Pick<SavedSearch, "q" | "category" | "trust" | "source" | "signal" | "platform"> & {
    alerts?: SavedSearch["alerts"];
  },
) {
  return {
    surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
    filterCount: savedSearchFilterCount(search),
    hasAlerts: Boolean(search.alerts?.enabled),
  };
}

export function browseSavedSearchManagerRenameAnalyticsEvent(): string {
  return "browse_saved_search_manager_rename";
}

export function browseSavedSearchManagerRenameAnalyticsData(savedCount: number) {
  return {
    surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
    savedCount,
  };
}

export function browseSavedSearchManagerAlertsToggleAnalyticsEvent(): string {
  return "browse_saved_search_manager_alerts_toggle";
}

export function browseSavedSearchManagerAlertsToggleAnalyticsData(
  enabled: boolean,
  filterCount: number,
) {
  return {
    surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
    enabled,
    filterCount,
  };
}

export function browseSavedSearchManagerAlertsSaveAnalyticsEvent(): string {
  return "browse_saved_search_manager_alerts_save";
}

export function browseSavedSearchManagerAlertsSaveAnalyticsData(
  channelCount: number,
  cadence: AlertCadence,
  hasEmail: boolean,
) {
  return {
    surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
    channelCount,
    cadence,
    hasEmail,
  };
}

export function browseSavedSearchManagerFeedCopyAnalyticsEvent(): string {
  return "browse_saved_search_manager_feed_copy";
}

export function browseSavedSearchManagerFeedCopyAnalyticsData(filterCount: number) {
  return {
    surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
    filterCount,
  };
}

export function browseSavedSearchManagerRemoveAnalyticsEvent(): string {
  return "browse_saved_search_manager_remove";
}

export function browseSavedSearchManagerRemoveAnalyticsData(savedCount: number) {
  return {
    surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
    savedCount,
  };
}

export type BrowseSavedSearchAlertChannel = AlertChannel;
export type BrowseSavedSearchAlertCadence = AlertCadence;

export function browseSavedSearchManagerChannelToggleAnalyticsEvent(): string {
  return "browse_saved_search_manager_channel_toggle";
}

export function browseSavedSearchManagerChannelToggleAnalyticsData(
  channel: BrowseSavedSearchAlertChannel,
  enabled: boolean,
  channelCount: number,
) {
  return {
    surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
    channel,
    enabled,
    channelCount,
  };
}

export function browseSavedSearchManagerCadenceSelectAnalyticsEvent(): string {
  return "browse_saved_search_manager_cadence_select";
}

export function browseSavedSearchManagerCadenceSelectAnalyticsData(
  cadence: BrowseSavedSearchAlertCadence,
  channelCount: number,
) {
  return {
    surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
    cadence,
    channelCount,
  };
}

export function browseSavedSearchManagerAlertsCancelAnalyticsEvent(): string {
  return "browse_saved_search_manager_alerts_cancel";
}

export function browseSavedSearchManagerAlertsCancelAnalyticsData(filterCount: number) {
  return {
    surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
    filterCount,
  };
}

export function browseSavedSearchManagerAlertsEditorAnalyticsEvent(): string {
  return "browse_saved_search_manager_alerts_editor_click";
}

export function browseSavedSearchManagerAlertsEditorAnalyticsData(
  open: boolean,
  filterCount: number,
) {
  return {
    surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
    open,
    filterCount,
  };
}
