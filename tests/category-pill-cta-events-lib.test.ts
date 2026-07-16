import { describe, expect, it } from "vitest";
import {
  categoryPillAnalyticsData,
  categoryPillAnalyticsEvent,
} from "@/lib/category-pill-cta-events-lib";

describe("category pill cta events lib", () => {
  it("builds privacy-light category pill analytics", () => {
    expect(categoryPillAnalyticsEvent()).toBe("category_pill_click");
    expect(categoryPillAnalyticsData("mcp", "compare-table")).toEqual({
      surface: "compare-table",
      category: "mcp",
    });
    expect(categoryPillAnalyticsData("skills", "compare-drawer")).toEqual({
      surface: "compare-drawer",
      category: "skills",
    });
  });
});
