import { describe, expect, it } from "vitest";
import {
  peekCopyAnalyticsData,
  peekCopyAnalyticsEvent,
  peekCopyIntentType,
  peekPanelActionAnalyticsData,
  peekPanelActionAnalyticsEvent,
  peekPanelCategoryDestination,
  peekPanelEntryDestination,
  peekPanelOpenAnalyticsData,
  peekPanelOpenAnalyticsEvent,
  peekSnippetVariantSelectAnalyticsData,
  peekSnippetVariantSelectAnalyticsEvent,
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
    expect(peekSnippetVariantSelectAnalyticsEvent()).toBe(
      "peek_snippet_variant_select",
    );
    expect(
      peekSnippetVariantSelectAnalyticsData("skills", "demo", "config"),
    ).toEqual({
      entry: "skills/demo",
      variant: "config",
      surface: "peek-panel",
    });
  });

  it("maps peek panel entry and category refs to destinations", () => {
    expect(peekPanelEntryDestination("mcp", "browser")).toEqual({
      to: "/entry/$category/$slug",
      params: { category: "mcp", slug: "browser" },
    });
    expect(peekPanelEntryDestination("", "browser")).toBeNull();
    expect(peekPanelEntryDestination("mcp", "")).toBeNull();
    expect(peekPanelCategoryDestination("skills")).toEqual({
      to: "/browse",
      search: { category: "skills" },
    });
    expect(peekPanelCategoryDestination("")).toBeNull();
    expect(peekPanelCategoryDestination("unknown")).toEqual({
      to: "/browse",
      search: { category: "unknown" },
    });
  });
});
