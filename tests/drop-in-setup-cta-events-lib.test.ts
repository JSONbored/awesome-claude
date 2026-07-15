import { describe, expect, it } from "vitest";
import {
  DROP_IN_SETUP_SURFACE,
  dropInSetupCopyAnalyticsData,
  dropInSetupCopyAnalyticsEvent,
} from "@/lib/drop-in-setup-cta-events-lib";

describe("drop in setup cta events lib", () => {
  it("builds drop-in setup navigation analytics", () => {
    expect(dropInSetupCopyAnalyticsEvent()).toBe("drop_in_setup_copy_click");
    expect(
      dropInSetupCopyAnalyticsData("claude-code", "mcp-host", "config"),
    ).toEqual({
      surface: DROP_IN_SETUP_SURFACE,
      clientId: "claude-code",
      surfaceType: "mcp-host",
      copyKind: "config",
    });
    expect(dropInSetupCopyAnalyticsData("cursor", "adapter", "verify")).toEqual(
      {
        surface: DROP_IN_SETUP_SURFACE,
        clientId: "cursor",
        surfaceType: "adapter",
        copyKind: "verify",
      },
    );
  });
});
