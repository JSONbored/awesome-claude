import { describe, expect, it } from "vitest";
import {
  ENTRY_SETUP_SNAPSHOT_SURFACE,
  entrySetupSnapshotAnalyticsData,
  entrySetupSnapshotAnalyticsEvent,
} from "@/lib/entry-setup-snapshot-cta-events-lib";

describe("entry setup snapshot cta events lib", () => {
  it("builds privacy-light setup snapshot tile analytics", () => {
    expect(entrySetupSnapshotAnalyticsEvent()).toBe(
      "detail_setup_snapshot_click",
    );
    expect(
      entrySetupSnapshotAnalyticsData(
        "mcp",
        "browser",
        "install",
        "entry-command-center",
      ),
    ).toEqual({
      entry: "mcp/browser",
      surface: ENTRY_SETUP_SNAPSHOT_SURFACE,
      tileId: "install",
      destination: "entry-command-center",
    });
    expect(
      entrySetupSnapshotAnalyticsData(
        "skills",
        "demo",
        "prerequisites",
        "prerequisites",
      ),
    ).toEqual({
      entry: "skills/demo",
      surface: ENTRY_SETUP_SNAPSHOT_SURFACE,
      tileId: "prerequisites",
      destination: "prerequisites",
    });
  });
});
