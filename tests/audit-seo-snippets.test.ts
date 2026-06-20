import { execFileSync } from "node:child_process";

import { describe, expect, it } from "vitest";

import {
  auditEntries,
  findDuplicateSnippets,
  normalizeSnippet,
  parseGscImpressions,
  renderMarkdown,
  snippetIssues,
} from "../scripts/audit-seo-snippets.mjs";

const goodTitle = "Postgres MCP Server for Claude Code — schema-aware queries";
const goodDesc =
  "A Model Context Protocol server that gives Claude read-only Postgres access with schema introspection, parameterized queries, and per-connection scoping.";

function entry(over: Record<string, unknown> = {}) {
  return {
    category: "mcp",
    slug: "postgres",
    title: "Postgres MCP Server",
    description: "Query Postgres from Claude.",
    seoTitle: goodTitle,
    seoDescription: goodDesc,
    ...over,
  };
}

describe("snippetIssues", () => {
  it("passes a well-formed entry", () => {
    expect(snippetIssues(entry())).toEqual([]);
  });

  it("flags missing snippets", () => {
    const issues = snippetIssues(
      entry({ seoTitle: "", seoDescription: undefined }),
    );
    expect(issues.map((i) => i.code)).toContain("missing");
    expect(issues.filter((i) => i.code === "missing")).toHaveLength(2);
  });

  it("flags length out of bounds", () => {
    const issues = snippetIssues(
      entry({ seoTitle: "Too short", seoDescription: "x".repeat(200) }),
    );
    expect(issues.find((i) => i.field === "seoTitle")?.code).toBe("too-short");
    expect(issues.find((i) => i.field === "seoDescription")?.code).toBe(
      "too-long",
    );
  });

  it("flags snippets that just echo the base title/description", () => {
    const issues = snippetIssues(
      entry({
        seoTitle: "Postgres MCP Server",
        seoDescription: "Query Postgres from Claude.",
      }),
    );
    expect(
      issues.some((i) => i.field === "seoTitle" && i.code === "echoes-base"),
    ).toBe(true);
    expect(
      issues.some(
        (i) => i.field === "seoDescription" && i.code === "echoes-base",
      ),
    ).toBe(true);
  });
});

describe("findDuplicateSnippets", () => {
  it("detects verbatim shared snippets across entries", () => {
    const entries = [
      entry({
        slug: "a",
        seoTitle: "Same Title Used Across Many Entries Here",
      }),
      entry({
        slug: "b",
        seoTitle: "Same Title Used Across Many Entries Here",
      }),
      entry({ slug: "c", seoTitle: "A Genuinely Unique Title For This Entry" }),
    ];
    const { dupTitleKeys } = findDuplicateSnippets(entries);
    expect(dupTitleKeys.has("mcp/a")).toBe(true);
    expect(dupTitleKeys.has("mcp/b")).toBe(true);
    expect(dupTitleKeys.has("mcp/c")).toBe(false);
  });
});

describe("parseGscImpressions", () => {
  it("maps page pathnames to impressions from a GSC CSV", () => {
    const csv = [
      "Page,Clicks,Impressions,CTR,Position",
      "https://heyclau.de/entry/mcp/postgres,12,3400,0.35%,4.2",
      '"https://heyclau.de/entry/mcp/redis/",3,900,0.33%,7.1',
    ].join("\n");
    const map = parseGscImpressions(csv);
    expect(map.get("/entry/mcp/postgres")).toBe(3400);
    expect(map.get("/entry/mcp/redis")).toBe(900);
  });

  it("returns an empty map for unrecognized CSVs", () => {
    expect(parseGscImpressions("foo,bar\n1,2").size).toBe(0);
  });
});

describe("auditEntries", () => {
  it("excludes clean entries, includes duplicates, and ranks worst-first", () => {
    const entries = [
      entry({ slug: "clean" }),
      entry({
        slug: "dupe-a",
        seoTitle: "Shared Templated Title Across Two Listings",
        seoDescription:
          "A distinct, valid description for the first listing that comfortably clears the minimum length bound here.",
      }),
      entry({
        slug: "dupe-b",
        seoTitle: "Shared Templated Title Across Two Listings",
        seoDescription:
          "A different, valid description for the second listing that also clears the minimum length bound comfortably.",
      }),
      entry({ slug: "broken", seoTitle: "", seoDescription: "short" }),
    ];
    const findings = auditEntries(entries, {
      gscImpressions: new Map([["/entry/mcp/dupe-a", 5000]]),
    });
    const keys = findings.map((f) => f.key);
    expect(keys).not.toContain("mcp/clean");
    expect(keys).toContain("mcp/dupe-a");
    // "broken" has the most issues → ranked first
    expect(findings[0].key).toBe("mcp/broken");
  });
});

describe("renderMarkdown", () => {
  it("reports total flagged entries separately from displayed findings", () => {
    const output = renderMarkdown(
      [
        {
          key: "mcp/postgres",
          category: "mcp",
          slug: "postgres",
          path: "/entry/mcp/postgres",
          impressions: 0,
          issues: [
            {
              field: "seoTitle",
              code: "echoes-base",
              detail: "seoTitle just repeats the on-page title",
            },
          ],
        },
      ],
      { total: 10, flagged: 7 },
    );

    expect(output).toContain(
      "7 of 10 entries have weak seoTitle/seoDescription.",
    );
    expect(output).toContain("Showing top 1 of 7 findings.");
    expect(output).not.toContain(
      "1 of 10 entries have weak seoTitle/seoDescription.",
    );
  });

  it("reports when the full finding set is displayed", () => {
    const findings = auditEntries([
      entry({ slug: "short-a", seoTitle: "Short", seoDescription: "short" }),
      entry({ slug: "short-b", seoTitle: "Tiny", seoDescription: "tiny" }),
    ]);

    const output = renderMarkdown(findings, {
      total: 2,
      flagged: findings.length,
    });

    expect(output).toContain(
      "2 of 2 entries have weak seoTitle/seoDescription.",
    );
    expect(output).toContain("Showing all 2 findings.");
  });
});

describe("normalizeSnippet", () => {
  it("collapses whitespace and lowercases", () => {
    expect(normalizeSnippet("  Foo   Bar\n")).toBe("foo bar");
  });
});

describe("module import", () => {
  it("does not run the CLI guard when process.argv[1] is absent", () => {
    const output = execFileSync(
      process.execPath,
      [
        "-e",
        "import('./scripts/audit-seo-snippets.mjs').then(({ auditEntries }) => console.log(typeof auditEntries))",
      ],
      { cwd: process.cwd(), encoding: "utf8" },
    );

    expect(output.trim()).toBe("function");
  });
});
