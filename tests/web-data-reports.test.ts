import { describe, expect, it } from "vitest";

import {
  REPORT_PATHS,
  buildReportDataset,
  reportExportUrl,
  tagDistribution,
} from "@/lib/data-reports";

describe("data-reports re-export surface", () => {
  it("keeps the public import path wired to the extracted lib", () => {
    expect(REPORT_PATHS).toContain("/state-of-agent-skills");
    expect(reportExportUrl("agent-skills", "json")).toContain(
      "/api/reports/agent-skills.json",
    );
    expect(tagDistribution([{ tags: ["testing"] }])[0]?.label).toBe("testing");
    expect(
      (
        buildReportDataset({
          slug: "/x",
          exportSlug: "x",
          title: "X",
          description: "",
          keywords: [],
          asOf: "2026-01-01",
          total: 0,
          stats: [],
          dimensions: [],
        }) as { "@type": string }
      )["@type"],
    ).toBe("Dataset");
  });
});
