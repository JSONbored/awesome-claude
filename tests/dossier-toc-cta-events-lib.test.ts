import { describe, expect, it } from "vitest";
import {
  DOSSIER_TOC_DETAIL_RAIL_SURFACE,
  dossierTocSectionAnalyticsData,
  dossierTocSectionAnalyticsEvent,
} from "@/lib/dossier-toc-cta-events-lib";

describe("dossier toc cta events lib", () => {
  it("builds privacy-light dossier TOC section analytics", () => {
    expect(dossierTocSectionAnalyticsEvent()).toBe("detail_toc_section_click");
    expect(
      dossierTocSectionAnalyticsData(
        "mcp",
        "browser",
        "citations",
        DOSSIER_TOC_DETAIL_RAIL_SURFACE,
      ),
    ).toEqual({
      entry: "mcp/browser",
      surface: "detail-dossier-toc",
      section: "citations",
    });
    expect(dossierTocSectionAnalyticsData("skills", "demo", "signals")).toEqual(
      {
        entry: "skills/demo",
        surface: "detail-dossier-toc",
        section: "signals",
      },
    );
  });
});
