import { describe, expect, it } from "vitest";
import {
  ENTRY_DETAIL_WATCH_SURFACE,
  entryDetailWatchAnalyticsData,
  entryDetailWatchAnalyticsEvent,
} from "@/lib/entry-detail-watch-cta-events-lib";

describe("entry detail watch cta events lib", () => {
  it("builds privacy-light watch toggle analytics", () => {
    expect(entryDetailWatchAnalyticsEvent(true)).toBe("detail_watch_add");
    expect(entryDetailWatchAnalyticsEvent(false)).toBe("detail_watch_remove");
    expect(entryDetailWatchAnalyticsData("mcp", "browser")).toEqual({
      entry: "mcp/browser",
      surface: ENTRY_DETAIL_WATCH_SURFACE,
      kind: "entry",
    });
  });
});
