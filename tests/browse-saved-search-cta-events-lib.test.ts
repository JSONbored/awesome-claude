import { describe, expect, it } from "vitest";
import {
  BROWSE_RECENTS_PANEL_SURFACE,
  BROWSE_RESULTS_SURFACE,
  BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
  BROWSE_SAVED_SEARCH_SURFACE,
  browseEmptySuggestionApplyAnalyticsData,
  browseEmptySuggestionApplyAnalyticsEvent,
  browseLoadMoreAnalyticsData,
  browseLoadMoreAnalyticsEvent,
  browseRecentEntryClickAnalyticsData,
  browseRecentEntryClickAnalyticsEvent,
  browseSavedSearchApplyAnalyticsData,
  browseSavedSearchApplyAnalyticsEvent,
  browseSavedSearchLinkClickAnalyticsData,
  browseSavedSearchLinkClickAnalyticsEvent,
  browseSavedSearchManagerAlertsCancelAnalyticsData,
  browseSavedSearchManagerAlertsCancelAnalyticsEvent,
  browseSavedSearchManagerAlertsEditorAnalyticsData,
  browseSavedSearchManagerAlertsEditorAnalyticsEvent,
  browseSavedSearchManagerAlertsSaveAnalyticsData,
  browseSavedSearchManagerAlertsSaveAnalyticsEvent,
  browseSavedSearchManagerAlertsToggleAnalyticsData,
  browseSavedSearchManagerAlertsToggleAnalyticsEvent,
  browseSavedSearchManagerApplyAnalyticsData,
  browseSavedSearchManagerApplyAnalyticsEvent,
  browseSavedSearchManagerCadenceSelectAnalyticsData,
  browseSavedSearchManagerCadenceSelectAnalyticsEvent,
  browseSavedSearchManagerChannelToggleAnalyticsData,
  browseSavedSearchManagerChannelToggleAnalyticsEvent,
  browseSavedSearchManagerFeedCopyAnalyticsData,
  browseSavedSearchManagerFeedCopyAnalyticsEvent,
  browseSavedSearchManagerOpenAnalyticsData,
  browseSavedSearchManagerOpenAnalyticsEvent,
  browseSavedSearchManagerRemoveAnalyticsData,
  browseSavedSearchManagerRemoveAnalyticsEvent,
  browseSavedSearchManagerRenameAnalyticsData,
  browseSavedSearchManagerRenameAnalyticsEvent,
  browseSavedSearchRemoveAnalyticsData,
  browseSavedSearchRemoveAnalyticsEvent,
  browseSavedSearchSaveAnalyticsData,
  browseSavedSearchSaveAnalyticsEvent,
  savedSearchFilterCount,
} from "@/lib/browse-saved-search-cta-events-lib";

describe("browse saved search cta events lib", () => {
  it("builds privacy-light browse saved search analytics", () => {
    expect(browseSavedSearchApplyAnalyticsEvent()).toBe(
      "browse_saved_search_apply",
    );
    expect(browseSavedSearchSaveAnalyticsEvent()).toBe(
      "browse_saved_search_save",
    );
    expect(browseLoadMoreAnalyticsEvent()).toBe("browse_load_more");
    expect(browseEmptySuggestionApplyAnalyticsEvent()).toBe(
      "browse_empty_suggestion_apply",
    );
    expect(browseSavedSearchLinkClickAnalyticsEvent()).toBe(
      "browse_saved_search_link_click",
    );
    expect(browseSavedSearchRemoveAnalyticsEvent()).toBe(
      "browse_saved_search_remove",
    );
    expect(browseRecentEntryClickAnalyticsEvent()).toBe(
      "browse_recent_entry_click",
    );
    expect(browseSavedSearchManagerOpenAnalyticsEvent()).toBe(
      "browse_saved_search_manager_open",
    );
    expect(browseSavedSearchManagerApplyAnalyticsEvent()).toBe(
      "browse_saved_search_manager_apply",
    );
    expect(browseSavedSearchManagerRenameAnalyticsEvent()).toBe(
      "browse_saved_search_manager_rename",
    );
    expect(browseSavedSearchManagerAlertsToggleAnalyticsEvent()).toBe(
      "browse_saved_search_manager_alerts_toggle",
    );
    expect(browseSavedSearchManagerAlertsSaveAnalyticsEvent()).toBe(
      "browse_saved_search_manager_alerts_save",
    );
    expect(browseSavedSearchManagerFeedCopyAnalyticsEvent()).toBe(
      "browse_saved_search_manager_feed_copy",
    );
    expect(browseSavedSearchManagerRemoveAnalyticsEvent()).toBe(
      "browse_saved_search_manager_remove",
    );
    expect(
      savedSearchFilterCount({
        q: "mcp",
        category: "mcp",
        trust: "",
        source: "",
        signal: "",
        platform: "",
      }),
    ).toBe(2);
    expect(
      savedSearchFilterCount({
        q: "",
        category: "",
        trust: "verified",
        source: "community",
        signal: "trending",
        platform: "claude-code",
      }),
    ).toBe(4);
    expect(
      browseSavedSearchApplyAnalyticsData({
        q: "",
        category: "skills",
        trust: "verified",
        source: "",
        signal: "",
        platform: "",
        alerts: { enabled: true, channels: ["inapp"], cadence: "weekly" },
      }),
    ).toEqual({
      surface: BROWSE_SAVED_SEARCH_SURFACE,
      filterCount: 2,
      hasAlerts: true,
    });
    expect(browseSavedSearchSaveAnalyticsData(4)).toEqual({
      surface: BROWSE_SAVED_SEARCH_SURFACE,
      activeCount: 4,
    });
    expect(browseLoadMoreAnalyticsData(30, 120, 30)).toEqual({
      surface: BROWSE_RESULTS_SURFACE,
      shown: 30,
      total: 120,
      loadCount: 30,
    });
    expect(browseEmptySuggestionApplyAnalyticsData(8)).toEqual({
      surface: BROWSE_RESULTS_SURFACE,
      matchCount: 8,
    });
    expect(
      browseSavedSearchLinkClickAnalyticsData({
        q: "hooks",
        category: "",
        trust: "",
        source: "",
        signal: "",
        platform: "",
        alerts: { enabled: false, channels: ["inapp"], cadence: "weekly" },
      }),
    ).toEqual({
      surface: BROWSE_RECENTS_PANEL_SURFACE,
      filterCount: 1,
      hasAlerts: false,
    });
    expect(browseSavedSearchRemoveAnalyticsData(3)).toEqual({
      surface: BROWSE_RECENTS_PANEL_SURFACE,
      savedCount: 3,
    });
    expect(browseRecentEntryClickAnalyticsData(1, 6)).toEqual({
      surface: BROWSE_RECENTS_PANEL_SURFACE,
      position: 1,
      recentCount: 6,
    });
    expect(browseSavedSearchManagerOpenAnalyticsData(5)).toEqual({
      surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
      savedCount: 5,
    });
    expect(
      browseSavedSearchManagerApplyAnalyticsData({
        q: "mcp",
        category: "mcp",
        trust: "",
        source: "",
        signal: "",
        platform: "",
      }),
    ).toEqual({
      surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
      filterCount: 2,
      hasAlerts: false,
    });
    expect(browseSavedSearchManagerRenameAnalyticsData(4)).toEqual({
      surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
      savedCount: 4,
    });
    expect(browseSavedSearchManagerAlertsToggleAnalyticsData(true, 3)).toEqual({
      surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
      enabled: true,
      filterCount: 3,
    });
    expect(
      browseSavedSearchManagerAlertsSaveAnalyticsData(2, "weekly", true),
    ).toEqual({
      surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
      channelCount: 2,
      cadence: "weekly",
      hasEmail: true,
    });
    expect(browseSavedSearchManagerFeedCopyAnalyticsData(1)).toEqual({
      surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
      filterCount: 1,
    });
    expect(browseSavedSearchManagerRemoveAnalyticsData(2)).toEqual({
      surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
      savedCount: 2,
    });
    expect(browseSavedSearchManagerChannelToggleAnalyticsEvent()).toBe(
      "browse_saved_search_manager_channel_toggle",
    );
    expect(
      browseSavedSearchManagerChannelToggleAnalyticsData("email", true, 2),
    ).toEqual({
      surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
      channel: "email",
      enabled: true,
      channelCount: 2,
    });
    expect(browseSavedSearchManagerCadenceSelectAnalyticsEvent()).toBe(
      "browse_saved_search_manager_cadence_select",
    );
    expect(
      browseSavedSearchManagerCadenceSelectAnalyticsData("daily", 1),
    ).toEqual({
      surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
      cadence: "daily",
      channelCount: 1,
    });
    expect(browseSavedSearchManagerAlertsCancelAnalyticsEvent()).toBe(
      "browse_saved_search_manager_alerts_cancel",
    );
    expect(browseSavedSearchManagerAlertsCancelAnalyticsData(2)).toEqual({
      surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
      filterCount: 2,
    });
    expect(browseSavedSearchManagerAlertsEditorAnalyticsEvent()).toBe(
      "browse_saved_search_manager_alerts_editor_click",
    );
    expect(browseSavedSearchManagerAlertsEditorAnalyticsData(true, 3)).toEqual({
      surface: BROWSE_SAVED_SEARCH_MANAGER_SURFACE,
      open: true,
      filterCount: 3,
    });
  });
});
