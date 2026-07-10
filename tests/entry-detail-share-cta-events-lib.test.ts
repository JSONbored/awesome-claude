import { describe, expect, it } from "vitest";
import {
  ENTRY_DETAIL_SHARE_SURFACE,
  entryDetailShareAnalyticsData,
  entryDetailShareAnalyticsEvent,
} from "@/lib/entry-detail-share-cta-events-lib";

describe("entry detail share cta events lib", () => {
  it("builds privacy-light share menu analytics", () => {
    expect(entryDetailShareAnalyticsEvent()).toBe("detail_share_action");
    expect(
      entryDetailShareAnalyticsData(
        "mcp",
        "browser",
        "copy-markdown",
        ENTRY_DETAIL_SHARE_SURFACE,
      ),
    ).toEqual({
      entry: "mcp/browser",
      surface: "detail-share",
      action: "copy-markdown",
    });
    expect(
      entryDetailShareAnalyticsData("skills", "demo", "open-llms"),
    ).toEqual({
      entry: "skills/demo",
      surface: "detail-share",
      action: "open-llms",
    });
  });
});
