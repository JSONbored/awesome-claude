import { describe, expect, it } from "vitest";
import {
  PEEK_HINT_SURFACE,
  SKIP_LINK_SURFACE,
  peekHintDismissAnalyticsData,
  peekHintDismissAnalyticsEvent,
  skipLinkAnalyticsData,
  skipLinkAnalyticsEvent,
} from "@/lib/a11y-chrome-cta-events-lib";

describe("a11y chrome cta events lib", () => {
  it("builds privacy-light skip-link and peek-hint analytics", () => {
    expect(skipLinkAnalyticsEvent()).toBe("skip_link_click");
    expect(skipLinkAnalyticsData()).toEqual({
      surface: SKIP_LINK_SURFACE,
    });
    expect(peekHintDismissAnalyticsEvent()).toBe("peek_hint_dismiss_click");
    expect(peekHintDismissAnalyticsData("button")).toEqual({
      surface: PEEK_HINT_SURFACE,
      reason: "button",
    });
    expect(peekHintDismissAnalyticsData("timeout")).toEqual({
      surface: PEEK_HINT_SURFACE,
      reason: "timeout",
    });
    expect(peekHintDismissAnalyticsData("hotkey")).toEqual({
      surface: PEEK_HINT_SURFACE,
      reason: "hotkey",
    });
  });
});
