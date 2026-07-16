import { describe, expect, it } from "vitest";
import {
  ENTRY_DETAIL_BADGE_SURFACE,
  entryDetailBadgeCopyAnalyticsData,
  entryDetailBadgeCopyAnalyticsEvent,
  entryDetailBadgePreviewAnalyticsData,
  entryDetailBadgePreviewAnalyticsEvent,
} from "@/lib/entry-detail-badge-cta-events-lib";

describe("entry detail badge cta events lib", () => {
  it("builds privacy-light badge markdown copy analytics", () => {
    expect(entryDetailBadgeCopyAnalyticsEvent()).toBe(
      "detail_badge_markdown_copy",
    );
    expect(entryDetailBadgeCopyAnalyticsData("mcp", "browser")).toEqual({
      entry: "mcp/browser",
      surface: ENTRY_DETAIL_BADGE_SURFACE,
    });
  });

  it("builds privacy-light badge preview click analytics", () => {
    expect(entryDetailBadgePreviewAnalyticsEvent()).toBe(
      "detail_badge_preview_click",
    );
    expect(entryDetailBadgePreviewAnalyticsData("skills", "demo")).toEqual({
      entry: "skills/demo",
      surface: ENTRY_DETAIL_BADGE_SURFACE,
    });
  });
});
