import { describe, expect, it } from "vitest";
import {
  claimCtaAnalyticsData,
  claimCtaAnalyticsEvent,
  newsletterSubscribeAnalyticsData,
  newsletterSubscribeAnalyticsEvent,
  sanitizeNewsletterSource,
} from "@/lib/conversion-cta-events-lib";

describe("conversion cta events lib", () => {
  it("builds claim CTA analytics without requiring an entry key", () => {
    expect(claimCtaAnalyticsEvent()).toBe("claim_cta_click");
    expect(
      claimCtaAnalyticsData("detail-command-center", "mcp", "browser"),
    ).toEqual({
      surface: "detail-command-center",
      entry: "mcp/browser",
    });
    expect(claimCtaAnalyticsData("compare-table")).toEqual({
      surface: "compare-table",
    });
  });

  it("builds newsletter subscribe analytics without email or PII", () => {
    expect(newsletterSubscribeAnalyticsEvent()).toBe("newsletter-subscribe");
    expect(newsletterSubscribeAnalyticsData("entry:mcp/browser", true)).toEqual(
      {
        source: "entry:mcp/browser",
        pending: true,
        surface: "newsletter",
      },
    );
    expect(sanitizeNewsletterSource("  ")).toBe("inline");
    expect(sanitizeNewsletterSource("x".repeat(80))).toHaveLength(64);
  });
});
