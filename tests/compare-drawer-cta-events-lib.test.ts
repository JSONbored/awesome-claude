import { describe, expect, it } from "vitest";
import {
  compareDrawerClearAnalyticsData,
  compareDrawerClearAnalyticsEvent,
  compareDrawerUndoRestoreAnalyticsData,
  compareDrawerUndoRestoreAnalyticsEvent,
  compareDrawerSourceAnalyticsData,
  compareDrawerSourceAnalyticsEvent,
  compareDrawerShareLinkCopyAnalyticsData,
  compareDrawerShareLinkCopyAnalyticsEvent,
} from "@/lib/compare-drawer-cta-events-lib";

describe("compare drawer cta events lib", () => {
  it("builds privacy-light clear and undo restore analytics", () => {
    expect(compareDrawerClearAnalyticsEvent()).toBe("compare_drawer_clear");
    expect(compareDrawerClearAnalyticsData(3)).toEqual({
      count: 3,
      surface: "compare-drawer",
    });
    expect(compareDrawerUndoRestoreAnalyticsEvent()).toBe(
      "compare_drawer_undo_restore",
    );
    expect(compareDrawerUndoRestoreAnalyticsData(2)).toEqual({
      count: 2,
      surface: "compare-drawer",
    });
    expect(compareDrawerSourceAnalyticsEvent()).toBe(
      "compare_drawer_source_open",
    );
    expect(
      compareDrawerSourceAnalyticsData("mcp", "browser", "github.com"),
    ).toEqual({
      entry: "mcp/browser",
      surface: "compare-drawer",
      host: "github.com",
    });
    expect(compareDrawerShareLinkCopyAnalyticsEvent()).toBe(
      "compare_drawer_share_link_copy",
    );
    expect(compareDrawerShareLinkCopyAnalyticsData(3)).toEqual({
      surface: "compare-drawer",
      compareCount: 3,
    });
  });
});
