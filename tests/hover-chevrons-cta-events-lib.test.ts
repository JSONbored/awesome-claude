import { describe, expect, it } from "vitest";
import {
  HOVER_CHEVRONS_SURFACE,
  hoverChevronsScrollAnalyticsData,
  hoverChevronsScrollAnalyticsEvent,
} from "@/lib/hover-chevrons-cta-events-lib";

describe("hover chevrons cta events lib", () => {
  it("builds hover chevrons navigation analytics", () => {
    expect(hoverChevronsScrollAnalyticsEvent()).toBe(
      "hover_chevrons_scroll_click",
    );
    expect(hoverChevronsScrollAnalyticsData("left")).toEqual({
      surface: HOVER_CHEVRONS_SURFACE,
      direction: "left",
    });
    expect(hoverChevronsScrollAnalyticsData("right")).toEqual({
      surface: HOVER_CHEVRONS_SURFACE,
      direction: "right",
    });
  });
});
