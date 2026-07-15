import { describe, expect, it } from "vitest";
import {
  CITATION_FACTS_SURFACE,
  citationFactLabelKey,
  citationFactsEgressAnalyticsData,
  citationFactsEgressAnalyticsEvent,
} from "@/lib/citation-facts-cta-events-lib";

describe("citation facts cta events lib", () => {
  it("builds privacy-light citation fact egress analytics", () => {
    expect(citationFactLabelKey(" Package URL ")).toBe("package-url");
    expect(citationFactsEgressAnalyticsEvent()).toBe(
      "citation_facts_egress_click",
    );
    expect(
      citationFactsEgressAnalyticsData(
        "mcp",
        "browser",
        "Package URL",
        "npmjs.com",
      ),
    ).toEqual({
      entry: "mcp/browser",
      surface: CITATION_FACTS_SURFACE,
      factLabel: "package-url",
      host: "npmjs.com",
    });
  });
});
