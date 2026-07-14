import { describe, expect, it } from "vitest";
import {
  resourceCardCompareAnalyticsData,
  resourceCardCompareAnalyticsEvent,
  resourceCardCompareToastOpenAnalyticsData,
  resourceCardCompareToastOpenAnalyticsEvent,
  resourceCardEntryAnalyticsData,
  resourceCardEntryAnalyticsEvent,
  resourceCardSourceAnalyticsData,
  resourceCardSourceAnalyticsEvent,
  resourceCardInstallAnalyticsData,
  resourceCardInstallAnalyticsEvent,
  resourceCardInstallIntentType,
} from "@/lib/resource-card-cta-events-lib";

describe("resource card cta events lib", () => {
  it("maps install copy actions to intent types", () => {
    expect(resourceCardInstallIntentType({ installCommand: "npm i x" })).toBe(
      "install",
    );
    expect(resourceCardInstallIntentType({})).toBe("copy");
  });

  it("builds privacy-light analytics events and data", () => {
    expect(resourceCardInstallAnalyticsEvent()).toBe(
      "browse_card_copy_install",
    );
    expect(resourceCardInstallAnalyticsData("mcp", "browser")).toEqual({
      entry: "mcp/browser",
      surface: "browse-card",
    });
    expect(resourceCardCompareAnalyticsEvent(true)).toBe(
      "browse_card_compare_add",
    );
    expect(resourceCardCompareAnalyticsEvent(false)).toBe(
      "browse_card_compare_remove",
    );
    expect(resourceCardCompareAnalyticsData("skills", "demo")).toEqual({
      entry: "skills/demo",
      surface: "browse-card",
    });
    expect(resourceCardCompareToastOpenAnalyticsEvent()).toBe(
      "browse_card_compare_toast_open",
    );
    expect(
      resourceCardCompareToastOpenAnalyticsData("skills", "demo", 2),
    ).toEqual({
      entry: "skills/demo",
      surface: "browse-card",
      compareCount: 2,
    });
    expect(resourceCardSourceAnalyticsEvent()).toBe("browse_card_source_open");
    expect(
      resourceCardSourceAnalyticsData("skills", "demo", "github.com"),
    ).toEqual({
      entry: "skills/demo",
      surface: "browse-card",
      host: "github.com",
    });
    expect(resourceCardEntryAnalyticsEvent()).toBe("browse_card_entry_click");
    expect(
      resourceCardEntryAnalyticsData("mcp", "browser", "compact", 3, 2),
    ).toEqual({
      entry: "mcp/browser",
      surface: "browse-card",
      variant: "compact",
      rank: 3,
      compareCount: 2,
    });
    expect(
      resourceCardEntryAnalyticsData("skills", "demo", "grid", null, 0),
    ).toEqual({
      entry: "skills/demo",
      surface: "browse-card",
      variant: "grid",
      rank: null,
      compareCount: 0,
    });
  });
});
