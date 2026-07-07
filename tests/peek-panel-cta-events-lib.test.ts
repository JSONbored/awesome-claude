import { describe, expect, it } from "vitest";
import {
  peekCopyAnalyticsData,
  peekCopyAnalyticsEvent,
  peekCopyIntentType,
  peekPanelActionAnalyticsData,
  peekPanelActionAnalyticsEvent,
  peekPanelOpenAnalyticsData,
  peekPanelOpenAnalyticsEvent,
} from "@/lib/peek-panel-cta-events-lib";

describe("peek panel cta events lib", () => {
  it("maps peek copy variants to intent types", () => {
    expect(peekCopyIntentType("install")).toBe("install");
    expect(peekCopyIntentType("config")).toBe("copy");
  });

  it("builds privacy-light peek analytics payloads", () => {
    expect(peekCopyAnalyticsEvent("install")).toBe("peek_copy_install");
    expect(peekCopyAnalyticsData("mcp", "browser", "full")).toEqual({
      entry: "mcp/browser",
      variant: "full",
      surface: "peek-panel",
    });
    expect(peekPanelActionAnalyticsEvent("source")).toBe("peek_source");
    expect(peekPanelActionAnalyticsData("skills", "demo", "dossier")).toEqual({
      entry: "skills/demo",
      action: "dossier",
      surface: "peek-panel",
    });
    expect(peekPanelOpenAnalyticsEvent()).toBe("peek_open");
    expect(peekPanelOpenAnalyticsData("mcp", "browser")).toEqual({
      entry: "mcp/browser",
      surface: "peek-panel",
    });
  });
});
