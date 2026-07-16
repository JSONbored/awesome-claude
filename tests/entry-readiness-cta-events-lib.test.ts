import { describe, expect, it } from "vitest";
import {
  ENTRY_READINESS_SURFACE,
  entryReadinessRowAnalyticsData,
  entryReadinessRowAnalyticsEvent,
} from "@/lib/entry-readiness-cta-events-lib";

describe("entry readiness cta events lib", () => {
  it("builds privacy-light readiness row analytics", () => {
    expect(entryReadinessRowAnalyticsEvent()).toBe("entry_readiness_row_click");
    expect(
      entryReadinessRowAnalyticsData(
        "mcp",
        "browser",
        "trust",
        true,
        "citation-facts",
      ),
    ).toEqual({
      entry: "mcp/browser",
      surface: ENTRY_READINESS_SURFACE,
      rowId: "trust",
      ok: true,
      destination: "citation-facts",
    });
    expect(
      entryReadinessRowAnalyticsData(
        "skills",
        "demo",
        "safety",
        false,
        "safety",
      ),
    ).toEqual({
      entry: "skills/demo",
      surface: ENTRY_READINESS_SURFACE,
      rowId: "safety",
      ok: false,
      destination: "safety",
    });
  });
});
