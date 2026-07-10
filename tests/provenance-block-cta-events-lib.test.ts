import { describe, expect, it } from "vitest";
import {
  PROVENANCE_DETAIL_RAIL_SURFACE,
  provenanceLinkAnalyticsData,
  provenanceLinkAnalyticsEvent,
} from "@/lib/provenance-block-cta-events-lib";

describe("provenance block cta events lib", () => {
  it("builds privacy-light provenance link analytics", () => {
    expect(provenanceLinkAnalyticsEvent()).toBe("detail_provenance_open");
    expect(
      provenanceLinkAnalyticsData(
        "mcp",
        "browser",
        "submission",
        "github.com",
        PROVENANCE_DETAIL_RAIL_SURFACE,
      ),
    ).toEqual({
      entry: "mcp/browser",
      surface: "detail-provenance",
      link: "submission",
      host: "github.com",
    });
    expect(
      provenanceLinkAnalyticsData("skills", "demo", "import-pr", "github.com"),
    ).toEqual({
      entry: "skills/demo",
      surface: "detail-provenance",
      link: "import-pr",
      host: "github.com",
    });
  });
});
