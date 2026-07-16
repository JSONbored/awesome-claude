import { describe, expect, it } from "vitest";
import {
  APP_ERROR_SURFACE,
  appErrorChromeAnalyticsData,
  appErrorChromeAnalyticsEvent,
} from "@/lib/app-error-cta-events-lib";

describe("app error cta events lib", () => {
  it("builds privacy-light app error chrome analytics", () => {
    expect(appErrorChromeAnalyticsEvent()).toBe("app_error_chrome_click");
    expect(appErrorChromeAnalyticsData("retry")).toEqual({
      surface: APP_ERROR_SURFACE,
      destination: "retry",
    });
    expect(appErrorChromeAnalyticsData("home")).toEqual({
      surface: APP_ERROR_SURFACE,
      destination: "home",
    });
  });
});
