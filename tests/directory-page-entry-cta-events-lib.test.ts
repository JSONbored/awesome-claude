import { describe, expect, it } from "vitest";
import {
  CHANGELOG_DIFF_SURFACE,
  PLATFORMS_MATRIX_SURFACE,
  TOOLS_DIRECTORY_SURFACE,
  changelogDiffEntryAnalyticsData,
  changelogDiffEntryAnalyticsEvent,
  platformsMatrixEntryAnalyticsData,
  platformsMatrixEntryAnalyticsEvent,
  toolsDirectoryEntryAnalyticsData,
  toolsDirectoryEntryAnalyticsEvent,
} from "@/lib/directory-page-entry-cta-events-lib";

describe("directory page entry cta events lib", () => {
  it("builds privacy-light changelog diff entry egress analytics", () => {
    expect(changelogDiffEntryAnalyticsEvent()).toBe(
      "changelog_diff_entry_click",
    );
    expect(
      changelogDiffEntryAnalyticsData(
        "mcp",
        "browser",
        "added",
        0,
        5,
        "release",
      ),
    ).toEqual({
      entry: "mcp/browser",
      surface: CHANGELOG_DIFF_SURFACE,
      changeKind: "added",
      rowIndex: 0,
      rowCount: 5,
      releaseStream: "release",
    });
  });

  it("builds privacy-light platforms matrix entry egress analytics", () => {
    expect(platformsMatrixEntryAnalyticsEvent()).toBe(
      "platforms_matrix_entry_click",
    );
    expect(
      platformsMatrixEntryAnalyticsData(
        "skills",
        "demo",
        "cursor",
        "native",
        2,
        8,
      ),
    ).toEqual({
      entry: "skills/demo",
      surface: PLATFORMS_MATRIX_SURFACE,
      platformId: "cursor",
      support: "native",
      rowIndex: 2,
      rowCount: 8,
    });
  });

  it("builds privacy-light tools directory entry egress analytics", () => {
    expect(toolsDirectoryEntryAnalyticsEvent()).toBe(
      "tools_directory_entry_click",
    );
    expect(toolsDirectoryEntryAnalyticsData("cursor", 1, 12)).toEqual({
      entry: "tools/cursor",
      surface: TOOLS_DIRECTORY_SURFACE,
      cardIndex: 1,
      toolCount: 12,
    });
  });
});
