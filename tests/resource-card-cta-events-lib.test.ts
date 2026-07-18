import { describe, expect, it } from "vitest";
import {
  resourceCardBadgeKinds,
  resourceCardCategoryBrowseAnalyticsData,
  resourceCardCategoryBrowseAnalyticsEvent,
  resourceCardTrustBrowseAnalyticsData,
  resourceCardTrustBrowseAnalyticsEvent,
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
  resourceCardTrustHintAnalyticsData,
  resourceCardTrustHintAnalyticsEvent,
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
    expect(
      resourceCardCompareAnalyticsData("skills", "demo", "browse-grid"),
    ).toEqual({
      entry: "skills/demo",
      surface: "browse-grid",
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
      resourceCardEntryAnalyticsData(
        "skills",
        "demo",
        "grid",
        null,
        0,
        "home-popular",
      ),
    ).toEqual({
      entry: "skills/demo",
      surface: "home-popular",
      variant: "grid",
      rank: null,
      compareCount: 0,
    });
    expect(resourceCardTrustHintAnalyticsEvent()).toBe(
      "browse_card_trust_hint_click",
    );
    expect(
      resourceCardTrustHintAnalyticsData(
        "mcp",
        "browser",
        "stronger",
        false,
        1,
        "browse-grid",
      ),
    ).toEqual({
      entry: "mcp/browser",
      surface: "browse-grid",
      kind: "stronger",
      inCompareTray: false,
      compareCount: 1,
    });
  });

  it("builds category browse analytics and badge kind maps", () => {
    expect(resourceCardCategoryBrowseAnalyticsEvent()).toBe(
      "browse_card_category_click",
    );
    expect(resourceCardCategoryBrowseAnalyticsData("mcp")).toEqual({
      surface: "browse-card",
      category: "mcp",
    });
    expect(
      resourceCardCategoryBrowseAnalyticsData("skills", "browse-grid"),
    ).toEqual({
      surface: "browse-grid",
      category: "skills",
    });
    expect(
      resourceCardCategoryBrowseAnalyticsData("hooks", "home-recent"),
    ).toEqual({
      surface: "home-recent",
      category: "hooks",
    });
    expect(resourceCardTrustBrowseAnalyticsEvent()).toBe(
      "browse_card_trust_click",
    );
    expect(resourceCardTrustBrowseAnalyticsData("trusted")).toEqual({
      surface: "browse-card",
      trust: "trusted",
    });
    expect(
      resourceCardTrustBrowseAnalyticsData("review", "browse-grid"),
    ).toEqual({
      surface: "browse-grid",
      trust: "review",
    });
    expect(resourceCardBadgeKinds("grid")).toEqual([
      "category",
      "trust",
      "source",
      "install-risk",
      "notes",
    ]);
    expect(resourceCardBadgeKinds("row")).toEqual([
      "category",
      "trust",
      "source",
      "install-risk",
      "platform",
      "notes",
    ]);
    expect(resourceCardBadgeKinds("compact")).toEqual([
      "category",
      "source",
      "trust",
    ]);
    expect(resourceCardBadgeKinds("unknown")).toEqual([]);
  });
});
