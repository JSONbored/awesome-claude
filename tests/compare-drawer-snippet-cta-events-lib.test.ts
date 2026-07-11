import { describe, expect, it } from "vitest";
import {
  compareDrawerSnippetCopyAnalyticsData,
  compareDrawerSnippetCopyAnalyticsEvent,
  compareDrawerSnippetVariantAnalyticsData,
  compareDrawerSnippetVariantAnalyticsEvent,
} from "@/lib/compare-drawer-snippet-cta-events-lib";

describe("compare drawer snippet cta events lib", () => {
  it("builds privacy-light compare drawer snippet analytics", () => {
    expect(compareDrawerSnippetVariantAnalyticsEvent()).toBe(
      "compare_drawer_snippet_variant_select",
    );
    expect(compareDrawerSnippetVariantAnalyticsData("install", 3)).toEqual({
      surface: "compare-drawer",
      variant: "install",
      compareCount: 3,
    });
    expect(compareDrawerSnippetCopyAnalyticsEvent("install")).toBe(
      "compare_copy_install",
    );
    expect(compareDrawerSnippetCopyAnalyticsEvent("config")).toBe(
      "compare_copy_config",
    );
    expect(compareDrawerSnippetCopyAnalyticsEvent("full")).toBe(
      "compare_drawer_snippet_copy",
    );
    expect(
      compareDrawerSnippetCopyAnalyticsData("mcp", "browser", "config"),
    ).toEqual({
      entry: "mcp/browser",
      surface: "compare-drawer",
      variant: "config",
    });
  });
});
