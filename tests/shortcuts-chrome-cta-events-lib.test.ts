import { describe, expect, it } from "vitest";
import {
  SHORTCUTS_CHROME_SURFACE,
  shortcutsDialogOpenAnalyticsData,
  shortcutsDialogOpenAnalyticsEvent,
  shortcutsGNavAnalyticsData,
  shortcutsGNavAnalyticsEvent,
} from "@/lib/shortcuts-chrome-cta-events-lib";

describe("shortcuts chrome cta events lib", () => {
  it("builds privacy-light shortcuts chrome analytics", () => {
    expect(shortcutsDialogOpenAnalyticsEvent()).toBe("shortcuts_dialog_open");
    expect(shortcutsDialogOpenAnalyticsData("hotkey")).toEqual({
      surface: SHORTCUTS_CHROME_SURFACE,
      source: "hotkey",
    });
    expect(shortcutsGNavAnalyticsEvent()).toBe("shortcuts_g_nav_click");
    expect(shortcutsGNavAnalyticsData("/browse")).toEqual({
      surface: SHORTCUTS_CHROME_SURFACE,
      destination: "/browse",
    });
    expect(shortcutsGNavAnalyticsData("/integrations")).toEqual({
      surface: SHORTCUTS_CHROME_SURFACE,
      destination: "/integrations",
    });
  });
});
