import { describe, expect, it } from "vitest";
import {
  API_DOCS_PAGE_SURFACE,
  apiDocsEndpointNavAnalyticsData,
  apiDocsEndpointNavAnalyticsEvent,
  apiDocsIntegrityNavAnalyticsData,
  apiDocsIntegrityNavAnalyticsEvent,
  apiDocsSpecAnalyticsData,
  apiDocsSpecAnalyticsEvent,
  apiDocsPageHashDestination,
} from "@/lib/api-docs-page-cta-events-lib";

describe("api docs page cta events lib", () => {
  it("builds api docs page navigation analytics", () => {
    expect(apiDocsSpecAnalyticsEvent()).toBe("api_docs_spec_click");
    expect(apiDocsSpecAnalyticsData("json", 42)).toEqual({
      surface: API_DOCS_PAGE_SURFACE,
      format: "json",
      endpointCount: 42,
    });
    expect(apiDocsEndpointNavAnalyticsEvent()).toBe(
      "api_docs_endpoint_nav_click",
    );
    expect(
      apiDocsEndpointNavAnalyticsData("registry-search", "registry", 2, 18),
    ).toEqual({
      surface: API_DOCS_PAGE_SURFACE,
      endpointId: "registry-search",
      tag: "registry",
      rowIndex: 2,
      visibleCount: 18,
    });
    expect(apiDocsIntegrityNavAnalyticsEvent()).toBe(
      "api_docs_integrity_nav_click",
    );
    expect(apiDocsIntegrityNavAnalyticsData("registry-manifest")).toEqual({
      surface: API_DOCS_PAGE_SURFACE,
      endpointId: "registry-manifest",
    });
  });

  it("maps api docs page hash destinations", () => {
    expect(apiDocsPageHashDestination("get-entries")).toEqual({
      to: "/api-docs",
      hash: "get-entries",
    });
    expect(apiDocsPageHashDestination("")).toBeNull();
  });
});
