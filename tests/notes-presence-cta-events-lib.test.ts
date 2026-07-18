import { describe, expect, it } from "vitest";
import {
  NOTES_PRESENCE_SURFACE,
  notesPresenceAnalyticsData,
  notesPresenceAnalyticsEvent,
  notesPresenceBrowseDestination,
  notesPresenceBrowseSearch,
} from "@/lib/notes-presence-cta-events-lib";

describe("notes presence cta events lib", () => {
  it("builds privacy-light notes chip analytics payloads", () => {
    expect(notesPresenceAnalyticsEvent()).toBe("notes_presence_chip_click");
    expect(notesPresenceAnalyticsData("safety", true)).toEqual({
      surface: NOTES_PRESENCE_SURFACE,
      noteKind: "safety",
      present: true,
    });
    expect(
      notesPresenceAnalyticsData("privacy", false, "compare-table"),
    ).toEqual({
      surface: "compare-table",
      noteKind: "privacy",
      present: false,
    });
    expect(
      notesPresenceAnalyticsData("safety", true, "compare-drawer"),
    ).toEqual({
      surface: "compare-drawer",
      noteKind: "safety",
      present: true,
    });
    expect(
      notesPresenceAnalyticsData("privacy", true, "category-ranking"),
    ).toEqual({
      surface: "category-ranking",
      noteKind: "privacy",
      present: true,
    });
    expect(notesPresenceAnalyticsData("safety", true, "peek-panel")).toEqual({
      surface: "peek-panel",
      noteKind: "safety",
      present: true,
    });
    expect(notesPresenceAnalyticsData("privacy", true, "compare-tray")).toEqual(
      {
        surface: "compare-tray",
        noteKind: "privacy",
        present: true,
      },
    );
    expect(notesPresenceAnalyticsData("safety", true, "trending-list")).toEqual(
      {
        surface: "trending-list",
        noteKind: "safety",
        present: true,
      },
    );
    expect(
      notesPresenceAnalyticsData("privacy", true, "contributor-profile"),
    ).toEqual({
      surface: "contributor-profile",
      noteKind: "privacy",
      present: true,
    });
    expect(notesPresenceAnalyticsData("privacy", true, "browse-grid")).toEqual({
      surface: "browse-grid",
      noteKind: "privacy",
      present: true,
    });
    expect(notesPresenceAnalyticsData("safety", false, "browse-row")).toEqual({
      surface: "browse-row",
      noteKind: "safety",
      present: false,
    });
  });

  it("maps present notes chips to browse signal search patches", () => {
    expect(notesPresenceBrowseSearch("safety", true)).toEqual({
      signal: "safety-notes",
    });
    expect(notesPresenceBrowseSearch("privacy", true)).toEqual({
      signal: "privacy-notes",
    });
    expect(notesPresenceBrowseSearch("safety", false)).toBeNull();
    expect(notesPresenceBrowseSearch("privacy", false)).toBeNull();
    expect(notesPresenceBrowseSearch("unknown", true)).toBeNull();
  });

  it("maps present notes chips to browse destinations", () => {
    expect(notesPresenceBrowseDestination("safety", true)).toEqual({
      to: "/browse",
      search: { signal: "safety-notes" },
    });
    expect(notesPresenceBrowseDestination("privacy", true)).toEqual({
      to: "/browse",
      search: { signal: "privacy-notes" },
    });
    expect(notesPresenceBrowseDestination("safety", false)).toBeNull();
    expect(notesPresenceBrowseDestination("privacy", false)).toBeNull();
    expect(notesPresenceBrowseDestination("unknown", true)).toBeNull();
    expect(notesPresenceBrowseDestination("", true)).toBeNull();
  });
});
