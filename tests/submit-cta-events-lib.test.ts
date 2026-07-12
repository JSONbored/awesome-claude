import { describe, expect, it } from "vitest";
import {
  SUBMIT_SURFACE,
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
});
