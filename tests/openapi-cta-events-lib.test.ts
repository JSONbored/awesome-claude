import { describe, expect, it } from "vitest";
import {
  OPENAPI_SURFACE,
  openApiAdvancedToggleAnalyticsData,
  openApiAdvancedToggleAnalyticsEvent,
  openApiCopyAnalyticsData,
  openApiCopyAnalyticsEvent,
  openApiSendAnalyticsData,
  openApiSendAnalyticsEvent,
} from "@/lib/openapi-cta-events-lib";

describe("openapi cta events lib", () => {
  it("builds openapi playground navigation analytics", () => {
    expect(openApiCopyAnalyticsEvent()).toBe("openapi_copy_click");
    expect(openApiCopyAnalyticsData("list-entries", "GET", "curl")).toEqual({
      surface: OPENAPI_SURFACE,
      endpointId: "list-entries",
      method: "GET",
      copyKind: "curl",
    });
    expect(openApiCopyAnalyticsData("list-entries", "GET", "response")).toEqual(
      {
        surface: OPENAPI_SURFACE,
        endpointId: "list-entries",
        method: "GET",
        copyKind: "response",
      },
    );
    expect(openApiSendAnalyticsEvent()).toBe("openapi_send_click");
    expect(openApiSendAnalyticsData("search", "GET", true)).toEqual({
      surface: OPENAPI_SURFACE,
      endpointId: "search",
      method: "GET",
      liveRequest: true,
    });
    expect(openApiAdvancedToggleAnalyticsEvent()).toBe(
      "openapi_advanced_toggle_click",
    );
    expect(
      openApiAdvancedToggleAnalyticsData("search", "GET", true, 2),
    ).toEqual({
      surface: OPENAPI_SURFACE,
      endpointId: "search",
      method: "GET",
      open: true,
      exampleCount: 2,
    });
  });
});
