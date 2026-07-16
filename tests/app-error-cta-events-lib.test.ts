import { describe, expect, it } from "vitest";
import {
  APP_ERROR_SURFACE,
  APP_NOTFOUND_SURFACE,
  appErrorChromeAnalyticsData,
  appErrorChromeAnalyticsEvent,
  appNotFoundEgressAnalyticsData,
  appNotFoundEgressAnalyticsEvent,
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

  it("builds privacy-light app not-found egress analytics", () => {
    expect(appNotFoundEgressAnalyticsEvent()).toBe("app_notfound_egress_click");
    expect(appNotFoundEgressAnalyticsData("browse")).toEqual({
      surface: APP_NOTFOUND_SURFACE,
      destination: "browse",
    });
    expect(appNotFoundEgressAnalyticsData("home")).toEqual({
      surface: APP_NOTFOUND_SURFACE,
      destination: "home",
    });
  });
});
