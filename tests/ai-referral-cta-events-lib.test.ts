import { describe, expect, it } from "vitest";
import {
  AI_REFERRAL_SURFACE,
  aiReferralAnalyticsData,
  aiReferralAnalyticsEvent,
  aiReferralLandingSegment,
} from "@/lib/ai-referral-cta-events-lib";

describe("ai referral cta events lib", () => {
  it("builds privacy-light ai referral analytics payloads", () => {
    expect(aiReferralAnalyticsEvent()).toBe("ai-referral");
    expect(aiReferralLandingSegment("/")).toBe("home");
    expect(aiReferralLandingSegment("/agents")).toBe("agents");
    expect(aiReferralLandingSegment("/entry/mcp/browser")).toBe("entry");
    expect(aiReferralAnalyticsData("claude", "/agents")).toEqual({
      surface: AI_REFERRAL_SURFACE,
      source: "claude",
      landingSegment: "agents",
    });
  });
});
