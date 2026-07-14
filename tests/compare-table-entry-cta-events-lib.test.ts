import { describe, expect, it } from "vitest";
import {
  compareTableEntryAnalyticsData,
  compareTableEntryAnalyticsEvent,
} from "@/lib/compare-table-entry-cta-events-lib";

describe("compare table entry cta events lib", () => {
  it("builds privacy-light comparison table entry egress analytics", () => {
    expect(compareTableEntryAnalyticsEvent()).toBe("compare_table_entry_click");
    expect(
      compareTableEntryAnalyticsData("mcp", "browser", "title", 0, 3),
    ).toEqual({
      entry: "mcp/browser",
      surface: "compare-table",
      linkKind: "title",
      columnIndex: 0,
      comparedCount: 3,
    });
    expect(
      compareTableEntryAnalyticsData("skills", "demo", "dossier", 2, 4),
    ).toEqual({
      entry: "skills/demo",
      surface: "compare-table",
      linkKind: "dossier",
      columnIndex: 2,
      comparedCount: 4,
    });
  });
});
