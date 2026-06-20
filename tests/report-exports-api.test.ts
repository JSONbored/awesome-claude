import { describe, expect, it } from "vitest";

import { GET } from "../apps/web/src/routes/api/reports/$report";
import {
  buildReportDataset,
  reportToCsv,
  reportToJson,
} from "../apps/web/src/lib/data-reports";
import { buildSkillsReport } from "../apps/web/src/lib/skills-stats";
import { ENTRIES } from "../apps/web/src/data/entries";

// No Origin header — the export must be fetchable by crawlers and direct
// downloads (the route intentionally omits originCheck).
function call(report: string) {
  return GET(new Request(`https://heyclau.de/api/reports/${report}`), {
    params: { report },
  });
}

describe("/api/reports/{report}", () => {
  it("serves a report as JSON", async () => {
    const res = await call("agent-skills.json");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    const body = (await res.json()) as {
      report: string;
      license: string;
      total: number;
      dimensions: unknown[];
    };
    expect(body.report).toBe("agent-skills");
    expect(body.license).toBe("CC BY 4.0");
    expect(body.total).toBeGreaterThan(50);
    expect(body.dimensions.length).toBeGreaterThan(1);
  });

  it("serves a report as CSV with a header row", async () => {
    const res = await call("claude-code-hooks.csv");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/csv");
    const text = await res.text();
    expect(text.split("\r\n")[0]).toBe("dimension,label,count,percent");
    expect(text).toContain("hook-events");
  });

  it("serves the AI agents report", async () => {
    const res = await call("ai-agents.json");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { report: string; total: number };
    expect(body.report).toBe("ai-agents");
    expect(body.total).toBeGreaterThan(50);
  });

  it("sets caching and a download filename", async () => {
    const res = await call("agent-skills.csv");
    expect(res.headers.get("cache-control")).toContain("max-age");
    expect(res.headers.get("content-disposition")).toContain(
      "agent-skills.csv",
    );
  });

  it("applies security headers to the export", async () => {
    const res = await call("agent-skills.json");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
  });

  it("404s for an unknown report slug", async () => {
    const res = await call("does-not-exist.json");
    expect(res.status).toBe(404);
  });

  it("400s for an unsupported format", async () => {
    const res = await call("agent-skills.txt");
    expect(res.status).toBe(400);
  });
});

describe("report serializers", () => {
  const model = buildSkillsReport(ENTRIES, "2026-06-20");

  it("Dataset links the JSON + CSV downloads", () => {
    const ds = buildReportDataset(model) as {
      distribution: Array<{ encodingFormat: string; contentUrl: string }>;
    };
    expect(ds.distribution.map((d) => d.encodingFormat).sort()).toEqual([
      "application/json",
      "text/csv",
    ]);
    expect(
      ds.distribution.every((d) =>
        d.contentUrl.includes("/api/reports/agent-skills."),
      ),
    ).toBe(true);
  });

  it("JSON export carries license + every dimension; CSV escapes correctly", () => {
    const json = reportToJson(model);
    expect(json.report).toBe("agent-skills");
    expect(json.license).toBe("CC BY 4.0");
    expect(json.dimensions.length).toBe(model.dimensions.length);

    const csv = reportToCsv(model);
    expect(csv.startsWith("dimension,label,count,percent\r\n")).toBe(true);
    expect(csv.endsWith("\r\n")).toBe(true);
  });

  it("neutralizes spreadsheet formula injection in cell values (CWE-1236)", () => {
    // Row labels come from community-submitted tags; a hostile tag must not
    // become an executable spreadsheet formula in the CSV export.
    const malicious = {
      slug: "/x",
      exportSlug: "x",
      title: "X",
      description: "",
      keywords: [],
      asOf: "2026-06-20",
      total: 1,
      stats: [],
      dimensions: [
        {
          key: "use-cases",
          title: "T",
          help: "",
          rows: [
            { label: "=cmd|'/C calc'!A0", count: 1, pct: 100 },
            { label: "@SUM(1+1)", count: 1, pct: 100 },
            { label: "-2+3", count: 1, pct: 100 },
            { label: "safe-tag", count: 1, pct: 100 },
          ],
        },
      ],
    } as Parameters<typeof reportToCsv>[0];

    const csv = reportToCsv(malicious);
    // Formula triggers are prefixed with a single quote (text, not formula)...
    expect(csv).toContain("'=cmd");
    expect(csv).toContain("'@SUM");
    expect(csv).toContain("'-2+3");
    // ...and no cell begins with a raw formula trigger.
    expect(csv).not.toMatch(/(^|,)[=+@]/m);
    // Benign values are untouched.
    expect(csv).toContain("safe-tag");
  });
});
