import { describe, expect, it } from "vitest";
import {
  ENTRY_SIGNALS_PANEL_SURFACE,
  entrySignalsCommunityAnalyticsData,
  entrySignalsCommunityAnalyticsEvent,
  entrySignalsVoteAnalyticsData,
  entrySignalsVoteAnalyticsEvent,
} from "@/lib/entry-signals-panel-cta-events-lib";

describe("entry signals panel cta events lib", () => {
  it("builds entry signals panel navigation analytics", () => {
    expect(entrySignalsVoteAnalyticsEvent()).toBe("entry_signals_vote_click");
    expect(entrySignalsVoteAnalyticsData("mcp", "browser", true, 12)).toEqual({
      surface: ENTRY_SIGNALS_PANEL_SURFACE,
      entry: "mcp/browser",
      voted: true,
      voteCount: 12,
    });
    expect(entrySignalsCommunityAnalyticsEvent()).toBe(
      "entry_signals_community_click",
    );
    expect(
      entrySignalsCommunityAnalyticsData("skills", "foo", "works", false),
    ).toEqual({
      surface: ENTRY_SIGNALS_PANEL_SURFACE,
      entry: "skills/foo",
      signalType: "works",
      active: false,
    });
  });
});
