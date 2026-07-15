import { describe, expect, it } from "vitest";
import {
  SUBMIT_SURFACE,
  submitPageCategorySelectAnalyticsData,
  submitPageCategorySelectAnalyticsEvent,
  submitPageEgressAnalyticsData,
  submitPageEgressAnalyticsEvent,
  submitStartAnalyticsData,
  submitStartAnalyticsEvent,
  submitSuccessAnalyticsData,
  submitSuccessAnalyticsEvent,
} from "@/lib/submit-cta-events-lib";

describe("submit cta events lib", () => {
  it("builds privacy-light submit flow analytics payloads", () => {
    expect(submitStartAnalyticsEvent()).toBe("submit_start");
    expect(submitStartAnalyticsData("mcp", true)).toEqual({
      surface: SUBMIT_SURFACE,
      category: "mcp",
      hasGate: true,
    });
    expect(submitSuccessAnalyticsEvent()).toBe("submit_success");
    expect(submitSuccessAnalyticsData("skills", "gate")).toEqual({
      surface: SUBMIT_SURFACE,
      category: "skills",
      path: "gate",
    });
    expect(submitSuccessAnalyticsData("hooks", "manual")).toEqual({
      surface: SUBMIT_SURFACE,
      category: "hooks",
      path: "manual",
    });
  });

  it("builds submit page category and commercial egress analytics", () => {
    expect(submitPageCategorySelectAnalyticsEvent()).toBe(
      "submit_page_category_select",
    );
    expect(submitPageCategorySelectAnalyticsData("tools", true)).toEqual({
      surface: SUBMIT_SURFACE,
      category: "tools",
      webOnly: true,
    });
    expect(submitPageEgressAnalyticsEvent()).toBe("submit_page_egress_click");
    expect(submitPageEgressAnalyticsData("advertise", "intro")).toEqual({
      surface: SUBMIT_SURFACE,
      destination: "advertise",
      placement: "intro",
    });
    expect(submitPageEgressAnalyticsData("jobs-post", "intro")).toEqual({
      surface: SUBMIT_SURFACE,
      destination: "jobs-post",
      placement: "intro",
    });
    expect(
      submitPageEgressAnalyticsData("advertise", "unsupported-category"),
    ).toEqual({
      surface: SUBMIT_SURFACE,
      destination: "advertise",
      placement: "unsupported-category",
    });
  });
});
