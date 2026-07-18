import { describe, expect, it } from "vitest";
import {
  SUBMIT_SURFACE,
  submitCategorySelectAnalyticsData,
  submitCategorySelectAnalyticsEvent,
  submitCompletionEgressAnalyticsData,
  submitCompletionEgressAnalyticsEvent,
  submitDraftCopyAnalyticsData,
  submitDraftCopyAnalyticsEvent,
  submitEgressAnalyticsData,
  submitEgressAnalyticsEvent,
  submitEgressDestination,
  submitPreflightNextActionAnalyticsData,
  submitPreflightNextActionAnalyticsEvent,
  submitPreflightRetryAnalyticsData,
  submitPreflightRetryAnalyticsEvent,
  submitStartAnalyticsData,
  submitStartAnalyticsEvent,
  submitStepAnalyticsData,
  submitStepAnalyticsEvent,
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

  it("builds privacy-light submit wizard navigation analytics", () => {
    expect(submitCategorySelectAnalyticsEvent()).toBe("submit_category_select");
    expect(submitCategorySelectAnalyticsData("mcp", false, 9)).toEqual({
      surface: SUBMIT_SURFACE,
      category: "mcp",
      webOnly: false,
      categoryCount: 9,
    });
    expect(submitStepAnalyticsEvent()).toBe("submit_step_click");
    expect(submitStepAnalyticsData("continue", 0, 1, "mcp", 4)).toEqual({
      surface: SUBMIT_SURFACE,
      direction: "continue",
      fromStep: 0,
      toStep: 1,
      category: "mcp",
      stepCount: 4,
    });
    expect(submitStepAnalyticsData("back", 2, 1, "skills", 4)).toEqual({
      surface: SUBMIT_SURFACE,
      direction: "back",
      fromStep: 2,
      toStep: 1,
      category: "skills",
      stepCount: 4,
    });
    expect(submitPreflightRetryAnalyticsEvent()).toBe(
      "submit_preflight_retry_click",
    );
    expect(submitPreflightRetryAnalyticsData("hooks", 3)).toEqual({
      surface: SUBMIT_SURFACE,
      category: "hooks",
      step: 3,
    });
    expect(submitEgressAnalyticsEvent()).toBe("submit_egress_click");
    expect(submitEgressAnalyticsData("advertise")).toEqual({
      surface: SUBMIT_SURFACE,
      destination: "advertise",
    });
    expect(submitEgressAnalyticsData("jobs-post")).toEqual({
      surface: SUBMIT_SURFACE,
      destination: "jobs-post",
    });
    expect(submitEgressDestination("advertise")).toEqual({ to: "/advertise" });
    expect(submitEgressDestination("jobs-post")).toEqual({ to: "/jobs/post" });
    expect(submitEgressDestination("unknown")).toBeNull();
    expect(submitCompletionEgressAnalyticsEvent()).toBe(
      "submit_completion_egress_click",
    );
    expect(submitCompletionEgressAnalyticsData("mcp", "status")).toEqual({
      surface: SUBMIT_SURFACE,
      category: "mcp",
      destination: "status",
    });
    expect(submitDraftCopyAnalyticsEvent()).toBe("submit_draft_copy_click");
    expect(submitDraftCopyAnalyticsData("skills", "manual")).toEqual({
      surface: SUBMIT_SURFACE,
      category: "skills",
      source: "manual",
    });
    expect(submitDraftCopyAnalyticsData("hooks", "wizard")).toEqual({
      surface: SUBMIT_SURFACE,
      category: "hooks",
      source: "wizard",
    });
    expect(submitPreflightNextActionAnalyticsEvent()).toBe(
      "submit_preflight_next_action_click",
    );
    expect(submitPreflightNextActionAnalyticsData("mcp", "route_away")).toEqual(
      {
        surface: SUBMIT_SURFACE,
        category: "mcp",
        routeSuggestion: "route_away",
      },
    );
    expect(
      submitPreflightNextActionAnalyticsData("skills", "fix_required"),
    ).toEqual({
      surface: SUBMIT_SURFACE,
      category: "skills",
      routeSuggestion: "fix_required",
    });
    expect(
      submitPreflightNextActionAnalyticsData("hooks", "manual_review"),
    ).toEqual({
      surface: SUBMIT_SURFACE,
      category: "hooks",
      routeSuggestion: "manual_review",
    });
  });
});
