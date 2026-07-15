import { describe, expect, it } from "vitest";
import {
  COMMERCIAL_DISCLOSURE_SURFACE,
  commercialDisclosureEgressAnalyticsData,
  commercialDisclosureEgressAnalyticsEvent,
} from "@/lib/commercial-disclosure-cta-events-lib";

describe("commercial disclosure cta events lib", () => {
  it("builds commercial disclosure navigation analytics", () => {
    expect(commercialDisclosureEgressAnalyticsEvent()).toBe(
      "commercial_disclosure_egress_click",
    );
    expect(commercialDisclosureEgressAnalyticsData("legal")).toEqual({
      surface: COMMERCIAL_DISCLOSURE_SURFACE,
      destination: "legal",
    });
  });
});
