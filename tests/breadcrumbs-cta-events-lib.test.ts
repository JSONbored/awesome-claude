import { describe, expect, it } from "vitest";
import {
  BREADCRUMBS_SURFACE,
  breadcrumbsCrumbAnalyticsData,
  breadcrumbsCrumbAnalyticsEvent,
  breadcrumbsHomeAnalyticsData,
  breadcrumbsHomeAnalyticsEvent,
} from "@/lib/breadcrumbs-cta-events-lib";

describe("breadcrumbs cta events lib", () => {
  it("builds breadcrumbs navigation analytics", () => {
    expect(breadcrumbsHomeAnalyticsEvent()).toBe("breadcrumbs_home_click");
    expect(breadcrumbsHomeAnalyticsData(3)).toEqual({
      surface: BREADCRUMBS_SURFACE,
      crumbCount: 3,
    });
    expect(breadcrumbsCrumbAnalyticsEvent()).toBe("breadcrumbs_crumb_click");
    expect(breadcrumbsCrumbAnalyticsData(1, 4)).toEqual({
      surface: BREADCRUMBS_SURFACE,
      rowIndex: 1,
      crumbCount: 4,
    });
  });
});
