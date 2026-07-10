import { describe, expect, it } from "vitest";
import {
  ENTRY_PREREQUISITE_SURFACE,
  entryPrerequisiteEntryKey,
  entryPrerequisiteResetAnalyticsData,
  entryPrerequisiteResetAnalyticsEvent,
  entryPrerequisiteToggleAnalyticsData,
  entryPrerequisiteToggleAnalyticsEvent,
} from "@/lib/entry-prerequisite-events-lib";

describe("entry prerequisite events lib", () => {
  it("builds a stable entry key", () => {
    expect(entryPrerequisiteEntryKey("tools", "activepieces")).toBe(
      "tools/activepieces",
    );
  });

  it("names toggle events by checked state", () => {
    expect(entryPrerequisiteToggleAnalyticsEvent(true)).toBe(
      "detail_prereq_check",
    );
    expect(entryPrerequisiteToggleAnalyticsEvent(false)).toBe(
      "detail_prereq_uncheck",
    );
  });

  it("emits privacy-light toggle payloads without prerequisite copy", () => {
    const data = entryPrerequisiteToggleAnalyticsData(
      "mcp",
      "example",
      "account",
      2,
      4,
    );
    expect(data).toEqual({
      entry: "mcp/example",
      surface: ENTRY_PREREQUISITE_SURFACE,
      kind: "account",
      checkedCount: 2,
      total: 4,
    });
  });

  it("names and shapes the reset event", () => {
    expect(entryPrerequisiteResetAnalyticsEvent()).toBe("detail_prereq_reset");
    expect(entryPrerequisiteResetAnalyticsData("skills", "example", 3)).toEqual(
      {
        entry: "skills/example",
        surface: ENTRY_PREREQUISITE_SURFACE,
        total: 3,
      },
    );
  });
});
