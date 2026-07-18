import { describe, expect, it } from "vitest";
import {
  SOURCE_CITATIONS_DETAIL_SURFACE,
  sourceCitationAnalyticsData,
  sourceCitationAnalyticsEvent,
  sourceCitationContributorDestination,
  sourceCitationEgressAnalyticsData,
  sourceCitationEgressAnalyticsEvent,
  sourceCitationQualityDestination,
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

  it("builds privacy-light source citations methodology egress analytics", () => {
    expect(sourceCitationEgressAnalyticsEvent()).toBe(
      "detail_source_citations_egress_click",
    );
    expect(
      sourceCitationEgressAnalyticsData("quality-source-provenance"),
    ).toEqual({
      surface: "detail-source-citations",
      destination: "quality-source-provenance",
    });
    expect(
      sourceCitationEgressAnalyticsData(
        "quality-source-provenance",
        "compare-table",
      ),
    ).toEqual({
      surface: "compare-table",
      destination: "quality-source-provenance",
    });
    expect(sourceCitationEgressAnalyticsData("contributor-profile")).toEqual({
      surface: "detail-source-citations",
      destination: "contributor-profile",
    });
  });

  it("maps source citation egress ids to destinations", () => {
    expect(sourceCitationContributorDestination("alice")).toEqual({
      to: "/contributors/$slug",
      params: { slug: "alice" },
    });
    expect(sourceCitationContributorDestination("  bob  ")).toEqual({
      to: "/contributors/$slug",
      params: { slug: "bob" },
    });
    expect(sourceCitationContributorDestination("")).toBeNull();
    expect(sourceCitationContributorDestination("   ")).toBeNull();
    expect(
      sourceCitationQualityDestination("quality-source-provenance"),
    ).toEqual({
      to: "/quality",
      hash: "source-provenance",
    });
    expect(sourceCitationQualityDestination("unknown")).toBeNull();
    expect(sourceCitationQualityDestination("")).toBeNull();
  });
});
