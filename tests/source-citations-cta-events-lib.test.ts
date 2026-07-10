import { describe, expect, it } from "vitest";
import {
  SOURCE_CITATIONS_DETAIL_SURFACE,
  sourceCitationAnalyticsData,
  sourceCitationAnalyticsEvent,
} from "@/lib/source-citations-cta-events-lib";

describe("source citations cta events lib", () => {
  it("builds privacy-light citation analytics", () => {
    expect(sourceCitationAnalyticsEvent()).toBe("detail_citation_open");
    expect(
      sourceCitationAnalyticsData(
        "mcp",
        "browser",
        "docs",
        "docs.example.com",
        SOURCE_CITATIONS_DETAIL_SURFACE,
      ),
    ).toEqual({
      entry: "mcp/browser",
      surface: "detail-source-citations",
      citation: "docs",
      host: "docs.example.com",
    });
    expect(
      sourceCitationAnalyticsData(
        "skills",
        "demo",
        "package",
        "cdn.example.com",
        "compare-table",
      ),
    ).toEqual({
      entry: "skills/demo",
      surface: "compare-table",
      citation: "package",
      host: "cdn.example.com",
    });
  });
});
