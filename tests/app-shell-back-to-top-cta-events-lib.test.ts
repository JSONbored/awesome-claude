import { describe, expect, it } from "vitest";
import {
  APP_SHELL_BACK_TO_TOP_SURFACE,
  appShellBackToTopAnalyticsData,
  appShellBackToTopAnalyticsEvent,
  appShellBackToTopScrollProgress,
} from "@/lib/app-shell-back-to-top-cta-events-lib";

describe("app shell back to top cta events lib", () => {
  it("builds privacy-light app shell back-to-top analytics", () => {
    expect(appShellBackToTopAnalyticsEvent()).toBe(
      "app_shell_back_to_top_click",
    );
    expect(appShellBackToTopAnalyticsData(64.6)).toEqual({
      surface: APP_SHELL_BACK_TO_TOP_SURFACE,
      scrollProgress: 65,
    });
  });

  it("computes scroll progress from viewport metrics", () => {
    expect(appShellBackToTopScrollProgress(400, 2000, 800)).toBe(33);
    expect(appShellBackToTopScrollProgress(1200, 2000, 800)).toBe(100);
    expect(appShellBackToTopScrollProgress(0, 800, 800)).toBe(0);
  });
});
