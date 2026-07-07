import { describe, expect, it } from "vitest";
import {
  resourceCardCompareAnalyticsData,
  resourceCardCompareAnalyticsEvent,
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
  });
});
