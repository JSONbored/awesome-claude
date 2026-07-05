import { describe, expect, it } from "vitest";

import {
  REPORT_PATHS,
  buildReportDataset,
  reportExportUrl,
  reportToCsv,
  reportToJson,
  tagDistribution,
  type ReportModel,
} from "../apps/web/src/lib/data-reports-lib";

function model(overrides: Partial<ReportModel> = {}): ReportModel {
  return {
    slug: "/state-of-agent-skills",
    exportSlug: "agent-skills",
    title: "State of Agent Skills",
    description: "Registry-derived skill statistics.",
    keywords: ["skills", "claude"],
    asOf: "2026-06-20",
    total: 100,
    stats: [
      {
        key: "total",
        label: "Skills indexed",
        value: 100,
        hint: "All skills in the registry",
      },
    ],
    dimensions: [
      {
        key: "use-cases",
        title: "Top use cases",
        help: "Most common tags",
        rows: [
          { label: "testing", count: 40, pct: 40 },
          { label: "docs", count: 25, pct: 25 },
        ],
      },
    ],
    ...overrides,
  };
}

describe("REPORT_PATHS", () => {
  it("lists every published data report route", () => {
    expect(REPORT_PATHS).toEqual([
      "/state-of-claude-tooling",
      "/state-of-mcp-servers",
      "/mcp-security-report",
      "/state-of-claude-code-hooks",
      "/state-of-agent-skills",
      "/state-of-ai-agents",
    ]);
  });
});

describe("reportExportUrl", () => {
  it("builds absolute JSON and CSV export URLs", () => {
    expect(reportExportUrl("agent-skills", "json")).toBe(
      "https://heyclau.de/api/reports/agent-skills.json",
    );
    expect(reportExportUrl("claude-code-hooks", "csv")).toBe(
      "https://heyclau.de/api/reports/claude-code-hooks.csv",
    );
  });
});

describe("buildReportDataset", () => {
  it("emits Dataset JSON-LD with measured variables and downloads", () => {
    const ds = buildReportDataset(model()) as {
      "@type": string;
      variableMeasured: string[];
      distribution: Array<{ encodingFormat: string; contentUrl: string }>;
      dateModified: string;
      url: string;
    };

    expect(ds["@type"]).toBe("Dataset");
    expect(ds.variableMeasured).toEqual(["Skills indexed", "Top use cases"]);
    expect(ds.dateModified).toBe("2026-06-20");
    expect(ds.url).toBe("https://heyclau.de/state-of-agent-skills");
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

  it("deduplicates repeated variableMeasured labels", () => {
    const ds = buildReportDataset(
      model({
        stats: [
          { key: "a", label: "Shared label", value: 1, hint: "" },
          { key: "b", label: "Shared label", value: 2, hint: "" },
        ],
        dimensions: [
          {
            key: "d1",
            title: "Shared label",
            help: "",
            rows: [{ label: "x", count: 1, pct: 100 }],
          },
        ],
      }),
    ) as { variableMeasured: string[] };

    expect(ds.variableMeasured).toEqual(["Shared label"]);
  });

  it("includes creator, license, and accessibility metadata", () => {
    const ds = buildReportDataset(model()) as {
      license: string;
      isAccessibleForFree: boolean;
      creator: { name: string; url: string };
    };
    expect(ds.license).toBe("https://creativecommons.org/licenses/by/4.0/");
    expect(ds.isAccessibleForFree).toBe(true);
    expect(ds.creator.name).toBe("HeyClaude");
    expect(ds.creator.url).toBe("https://heyclau.de/");
  });
});

describe("reportToJson", () => {
  it("serializes headline stats and dimension rows", () => {
    const json = reportToJson(model());
    expect(json.report).toBe("agent-skills");
    expect(json.license).toBe("CC BY 4.0");
    expect(json.total).toBe(100);
    expect(json.source).toBe("https://heyclau.de/state-of-agent-skills");
    expect(json.stats).toEqual([
      { key: "total", label: "Skills indexed", value: 100 },
    ]);
    expect(json.dimensions[0]?.rows).toEqual([
      { label: "testing", count: 40, percent: 40 },
      { label: "docs", count: 25, percent: 25 },
    ]);
  });

  it("preserves export metadata fields", () => {
    const json = reportToJson(
      model({
        title: "Custom title",
        description: "Custom description",
        asOf: "2026-01-15",
      }),
    );
    expect(json.title).toBe("Custom title");
    expect(json.description).toBe("Custom description");
    expect(json.asOf).toBe("2026-01-15");
  });
});

describe("reportToCsv", () => {
  it("writes a header row and CRLF line endings", () => {
    const csv = reportToCsv(model());
    expect(csv.startsWith("dimension,label,count,percent\r\n")).toBe(true);
    expect(csv.endsWith("\r\n")).toBe(true);
    expect(csv).toContain("use-cases,testing,40,40\r\n");
    expect(csv).toContain("use-cases,docs,25,25\r\n");
  });

  it("quotes cells that contain commas or quotes", () => {
    const csv = reportToCsv(
      model({
        dimensions: [
          {
            key: "tags",
            title: "Tags",
            help: "",
            rows: [
              { label: 'say "hello", world', count: 2, pct: 100 },
              { label: "multi,part", count: 1, pct: 50 },
            ],
          },
        ],
      }),
    );
    expect(csv).toContain('"say ""hello"", world"');
    expect(csv).toContain('"multi,part"');
  });

  it("neutralizes spreadsheet formula injection in cell values", () => {
    const csv = reportToCsv(
      model({
        dimensions: [
          {
            key: "use-cases",
            title: "T",
            help: "",
            rows: [
              { label: "=cmd|'/C calc'!A0", count: 1, pct: 100 },
              { label: "@SUM(1+1)", count: 1, pct: 100 },
              { label: "-2+3", count: 1, pct: 100 },
              { label: "+IMPORTXML()", count: 1, pct: 100 },
              { label: "safe-tag", count: 1, pct: 100 },
            ],
          },
        ],
      }),
    );

    expect(csv).toContain("'=cmd");
    expect(csv).toContain("'@SUM");
    expect(csv).toContain("'-2+3");
    expect(csv).toContain("'+IMPORTXML()");
    expect(csv).not.toMatch(/(^|,)[=+@]/m);
    expect(csv).toContain("safe-tag");
  });

  it("returns only the header when there are no dimension rows", () => {
    const csv = reportToCsv(model({ dimensions: [] }));
    expect(csv).toBe("dimension,label,count,percent\r\n");
  });
});

describe("tagDistribution", () => {
  const entries = [
    { tags: ["Testing", "docs"] },
    { tags: ["testing", "ci"] },
    { tags: ["Docs", ""] },
    { tags: ["skills"] },
    { tags: undefined },
  ];

  it("counts normalized tags and sorts by count then label", () => {
    const rows = tagDistribution(entries);
    expect(rows.map((r) => r.label)).toEqual([
      "docs",
      "testing",
      "ci",
      "skills",
    ]);
    expect(rows.find((r) => r.label === "testing")?.count).toBe(2);
    expect(rows.find((r) => r.label === "docs")?.count).toBe(2);
  });

  it("computes whole-number percentages against total entries", () => {
    const rows = tagDistribution(entries, { limit: 10 });
    expect(rows.find((r) => r.label === "testing")).toEqual({
      label: "testing",
      count: 2,
      pct: 40,
    });
  });

  it("excludes mechanism tags when configured", () => {
    const rows = tagDistribution(entries, {
      exclude: new Set(["skills", "testing"]),
      limit: 10,
    });
    expect(rows.map((r) => r.label)).toEqual(["docs", "ci"]);
  });

  it("honors the configured limit", () => {
    const rows = tagDistribution(entries, { limit: 2 });
    expect(rows).toHaveLength(2);
    expect(rows[0]?.label).toBe("docs");
    expect(rows[1]?.label).toBe("testing");
  });

  it("returns an empty list for empty input", () => {
    expect(tagDistribution([])).toEqual([]);
  });

  it("ignores blank tags after trimming", () => {
    expect(tagDistribution([{ tags: ["", "  ", "real"] }])).toEqual([
      { label: "real", count: 1, pct: 100 },
    ]);
  });

  it("returns zero percent when total entries is zero", () => {
    expect(tagDistribution([], { limit: 5 })).toEqual([]);
  });
});

describe("tagDistribution tie-breaking and casing", () => {
  it("breaks count ties alphabetically by label", () => {
    const rows = tagDistribution([
      { tags: ["beta"] },
      { tags: ["alpha"] },
      { tags: ["gamma"] },
    ]);
    expect(rows.map((r) => r.label)).toEqual(["alpha", "beta", "gamma"]);
    for (const row of rows) {
      expect(row.count).toBe(1);
      expect(row.pct).toBe(33);
    }
  });

  it("lowercases mixed-case tags before counting", () => {
    const rows = tagDistribution([{ tags: ["Claude", "CLAUDE", "claude"] }]);
    expect(rows).toEqual([{ label: "claude", count: 3, pct: 300 }]);
  });
});

describe("report serializers integration", () => {
  it("keeps JSON dimension count aligned with the model", () => {
    const report = model({
      dimensions: [
        {
          key: "a",
          title: "A",
          help: "",
          rows: [{ label: "one", count: 1, pct: 100 }],
        },
        {
          key: "b",
          title: "B",
          help: "",
          rows: [{ label: "two", count: 2, pct: 100 }],
        },
      ],
    });
    expect(reportToJson(report).dimensions).toHaveLength(2);
    expect(reportToCsv(report).split("\r\n").length).toBe(4);
  });
});

describe("buildReportDataset export links", () => {
  it.each(REPORT_PATHS)("builds dataset URLs for %s reports", (slug) => {
    const exportSlug = slug.replace("/state-of-", "").replace("/", "") || "x";
    const ds = buildReportDataset(
      model({ slug, exportSlug: exportSlug.replace(/^\//, "") }),
    ) as { url: string };
    expect(ds.url).toBe(`https://heyclau.de${slug}`);
  });
});

describe("tagDistribution large sample", () => {
  it("handles many tags and respects exclude + limit together", () => {
    const entries = Array.from({ length: 20 }, (_, index) => ({
      tags: [
        `tag-${index % 5}`,
        index % 2 === 0 ? "skills" : "automation",
        "shared",
      ],
    }));
    const rows = tagDistribution(entries, {
      exclude: new Set(["skills"]),
      limit: 3,
    });
    expect(rows).toHaveLength(3);
    expect(rows.every((row) => row.label !== "skills")).toBe(true);
    expect(rows[0]?.label).toBe("shared");
  });
});

describe("reportToCsv formula guard matrix", () => {
  it.each([
    ["=1+1", "'=1+1"],
    ["+2", "'+2"],
    ["-3", "'-3"],
    ["@payload", "'@payload"],
    ["\tformula", "'\tformula"],
  ])("prefixes formula trigger %s", (label, expectedFragment) => {
    const csv = reportToCsv(
      model({
        dimensions: [
          {
            key: "x",
            title: "X",
            help: "",
            rows: [{ label, count: 1, pct: 100 }],
          },
        ],
      }),
    );
    expect(csv).toContain(expectedFragment);
  });
});

describe("reportToJson stats and dimensions coverage", () => {
  it("serializes multiple stats without dropping keys", () => {
    const json = reportToJson(
      model({
        stats: [
          { key: "total", label: "Total", value: 10, hint: "" },
          { key: "verified", label: "Verified", value: 4, hint: "" },
        ],
      }),
    );
    expect(json.stats).toEqual([
      { key: "total", label: "Total", value: 10 },
      { key: "verified", label: "Verified", value: 4 },
    ]);
  });

  it("preserves dimension keys and titles in JSON export", () => {
    const json = reportToJson(
      model({
        dimensions: [
          {
            key: "transport",
            title: "Transport mix",
            help: "",
            rows: [{ label: "stdio", count: 3, pct: 75 }],
          },
        ],
      }),
    );
    expect(json.dimensions[0]).toEqual({
      key: "transport",
      title: "Transport mix",
      rows: [{ label: "stdio", count: 3, percent: 75 }],
    });
  });
});

describe("tagDistribution percentage rounding", () => {
  it("rounds percentages to whole numbers", () => {
    const rows = tagDistribution([
      { tags: ["a"] },
      { tags: ["b"] },
      { tags: ["c"] },
    ]);
    for (const row of rows) {
      expect(row.pct).toBe(33);
    }
  });

  it("returns 0 percent for tags when there are no entries", () => {
    expect(tagDistribution([])).toEqual([]);
  });
});

describe("buildReportDataset keywords and naming", () => {
  it("preserves report keywords in Dataset JSON-LD", () => {
    const ds = buildReportDataset(
      model({ keywords: ["hooks", "claude-code", "registry"] }),
    ) as { keywords: string[] };
    expect(ds.keywords).toEqual(["hooks", "claude-code", "registry"]);
  });

  it("uses the report title and description verbatim", () => {
    const ds = buildReportDataset(
      model({
        title: "State of MCP Servers",
        description: "Transport and auth breakdown.",
      }),
    ) as { name: string; description: string };
    expect(ds.name).toBe("State of MCP Servers");
    expect(ds.description).toBe("Transport and auth breakdown.");
  });
});

describe("reportExportUrl slug coverage", () => {
  it.each([
    ["agent-skills", "json"],
    ["agent-skills", "csv"],
    ["claude-code-hooks", "json"],
    ["mcp-security", "csv"],
    ["ai-agents", "json"],
  ])("builds export URL for %s.%s", (slug, format) => {
    const url = reportExportUrl(slug, format as "json" | "csv");
    expect(url).toBe(`https://heyclau.de/api/reports/${slug}.${format}`);
  });
});

describe("tagDistribution duplicate tags within one entry", () => {
  it("counts repeated tags on the same entry once per occurrence", () => {
    const rows = tagDistribution([{ tags: ["docs", "Docs", "docs"] }]);
    expect(rows).toEqual([{ label: "docs", count: 3, pct: 300 }]);
  });
});

describe("reportToCsv multiline and special character escaping", () => {
  it("quotes labels containing embedded quotes and commas together", () => {
    const csv = reportToCsv(
      model({
        dimensions: [
          {
            key: "tags",
            title: "Tags",
            help: "",
            rows: [{ label: 'a,"b",c', count: 1, pct: 100 }],
          },
        ],
      }),
    );
    expect(csv).toContain('"a,""b"",c"');
  });
});

describe("REPORT_PATHS export alignment", () => {
  it("includes every state-of and security report route once", () => {
    expect(new Set(REPORT_PATHS).size).toBe(REPORT_PATHS.length);
    expect(REPORT_PATHS.every((path) => path.startsWith("/"))).toBe(true);
  });
});
