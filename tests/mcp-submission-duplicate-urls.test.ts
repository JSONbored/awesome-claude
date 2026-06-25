import { describe, expect, it } from "vitest";

import { callRegistryTool } from "../packages/mcp/src/registry.js";
import {
  jsonSchemaForTool,
  parseToolArguments,
} from "../packages/mcp/src/schemas.js";
import { searchDuplicateEntries } from "../packages/mcp/src/submissions.js";

type RegistryEntry = Record<string, unknown>;

function entry(overrides: RegistryEntry = {}): RegistryEntry {
  return {
    category: "mcp",
    slug: "airtable-mcp-server",
    title: "Airtable MCP",
    brandDomain: "",
    documentationUrl: "https://github.com/domdomegg/airtable-mcp-server",
    repoUrl: "https://github.com/domdomegg/airtable-mcp-server",
    ...overrides,
  };
}

describe("searchDuplicateEntries source-URL matching", () => {
  it("matches a trailing-slash variant against an indexed entry's repoUrl", () => {
    const result = searchDuplicateEntries([entry()], {
      sourceUrl: "https://github.com/domdomegg/airtable-mcp-server/",
    });
    expect(result.count).toBe(1);
    expect(
      (result.matches as Array<{ reasons: string[] }>)[0].reasons,
    ).toContain("source_url");
  });

  it("matches a www-prefix + uppercase-host variant", () => {
    const result = searchDuplicateEntries([entry()], {
      sourceUrl: "https://www.GitHub.com/domdomegg/airtable-mcp-server",
    });
    expect(result.count).toBe(1);
  });

  it("matches a variant with utm_* and other tracking query params", () => {
    const result = searchDuplicateEntries([entry()], {
      sourceUrl:
        "https://github.com/domdomegg/airtable-mcp-server?utm_source=hn&campaign=launch&affiliate_id=42",
    });
    expect(result.count).toBe(1);
  });

  it("matches a variant with a #hash fragment", () => {
    const result = searchDuplicateEntries([entry()], {
      sourceUrl: "https://github.com/domdomegg/airtable-mcp-server#readme",
    });
    expect(result.count).toBe(1);
  });

  it("still matches the exact same URL (no regression)", () => {
    const result = searchDuplicateEntries([entry()], {
      sourceUrl: "https://github.com/domdomegg/airtable-mcp-server",
    });
    expect(result.count).toBe(1);
  });

  it("does not match an unrelated URL", () => {
    const result = searchDuplicateEntries([entry()], {
      sourceUrl: "https://github.com/some-other/repo",
    });
    expect(result.count).toBe(0);
  });

  it("does not match an unparseable URL (returns no match, doesn't throw)", () => {
    const result = searchDuplicateEntries([entry()], {
      sourceUrl: "not a url at all",
    });
    expect(result.count).toBe(0);
  });

  it("matches when the entry's matching URL lives only on downloadUrl", () => {
    const result = searchDuplicateEntries(
      [
        entry({
          documentationUrl: "",
          repoUrl: "",
          downloadUrl: "https://example.com/downloads/airtable.zip",
        }),
      ],
      { sourceUrl: "https://example.com/downloads/airtable.zip/" },
    );
    expect(result.count).toBe(1);
  });

  it("matches when the entry's matching URL lives only on websiteUrl", () => {
    const result = searchDuplicateEntries(
      [
        entry({
          documentationUrl: "",
          repoUrl: "",
          websiteUrl: "https://airtable-mcp.example",
        }),
      ],
      { sourceUrl: "https://www.airtable-mcp.example" },
    );
    expect(result.count).toBe(1);
  });

  it("matches when the entry's matching URL lives only in trustSignals.sourceUrls", () => {
    const result = searchDuplicateEntries(
      [
        entry({
          documentationUrl: "",
          repoUrl: "",
          trustSignals: {
            sourceUrls: [
              "https://docs.example.com/airtable",
              "https://blog.example.com/airtable-launch",
            ],
          },
        }),
      ],
      { sourceUrl: "https://docs.example.com/airtable/" },
    );
    expect(result.count).toBe(1);
  });

  it("accepts the new `sourceUrls` array and matches any candidate", () => {
    // First candidate is an unrelated repo; second normalizes (trailing slash
    // + utm_) to the indexed entry's `repoUrl`. Should match on the second
    // candidate. URL paths are case-sensitive per RFC 3986; only scheme/host
    // are case-insensitive, so the normalizer correctly does not fold case on
    // the path component.
    const result = searchDuplicateEntries([entry()], {
      sourceUrls: [
        "https://github.com/unrelated/repo",
        "https://github.com/domdomegg/airtable-mcp-server/?utm_source=test",
      ],
    });
    expect(result.count).toBe(1);
  });

  it("normalizes a trailing slash that sits before a surviving query string", () => {
    // `?ref=x` is a non-tracking param, so it is kept. The trailing slash on the
    // path must still be stripped (it sits before the `?`, so it is never the
    // last character of the serialized URL). Without pathname-level
    // normalization this would serialize as `.../airtable-mcp-server/?ref=x` and
    // fail to match the canonical entry URL.
    const result = searchDuplicateEntries(
      [
        entry({
          documentationUrl:
            "https://github.com/domdomegg/airtable-mcp-server?ref=x",
          repoUrl: "https://github.com/domdomegg/airtable-mcp-server?ref=x",
        }),
      ],
      {
        sourceUrl: "https://github.com/domdomegg/airtable-mcp-server/?ref=x",
      },
    );
    expect(result.count).toBe(1);
    expect(
      (result.matches as Array<{ reasons: string[] }>)[0].reasons,
    ).toContain("source_url");
  });

  it("checks every advertised fielded URL arg against its matching entry field", () => {
    // Each fielded submission arg must be matched against the corresponding
    // indexed entry field — the previous test only proved `githubUrl`/`docsUrl`.
    // Trailing-slash variants are used so each case also exercises path
    // normalization, not just exact equality.
    const githubResult = searchDuplicateEntries(
      [
        entry({
          documentationUrl: "",
          repoUrl: "",
          githubUrl: "https://github.com/domdomegg/airtable-mcp-server",
        }),
      ],
      { githubUrl: "https://github.com/domdomegg/airtable-mcp-server/" },
    );
    expect(githubResult.count).toBe(1);
    expect(
      (githubResult.matches as Array<{ reasons: string[] }>)[0].reasons,
    ).toContain("source_url");

    const docsResult = searchDuplicateEntries(
      [
        entry({
          documentationUrl: "https://docs.example.com/airtable",
          repoUrl: "",
        }),
      ],
      { docsUrl: "https://docs.example.com/airtable/" },
    );
    expect(docsResult.count).toBe(1);
    expect(
      (docsResult.matches as Array<{ reasons: string[] }>)[0].reasons,
    ).toContain("source_url");

    const downloadResult = searchDuplicateEntries(
      [
        entry({
          documentationUrl: "",
          repoUrl: "",
          downloadUrl: "https://example.com/downloads/airtable.zip",
        }),
      ],
      { downloadUrl: "https://example.com/downloads/airtable.zip/" },
    );
    expect(downloadResult.count).toBe(1);
    expect(
      (downloadResult.matches as Array<{ reasons: string[] }>)[0].reasons,
    ).toContain("source_url");

    const websiteResult = searchDuplicateEntries(
      [
        entry({
          documentationUrl: "",
          repoUrl: "",
          websiteUrl: "https://airtable-mcp.example",
        }),
      ],
      { websiteUrl: "https://www.airtable-mcp.example/" },
    );
    expect(websiteResult.count).toBe(1);
    expect(
      (websiteResult.matches as Array<{ reasons: string[] }>)[0].reasons,
    ).toContain("source_url");
  });

  it("exposes sourceUrls and fielded URL args through the public MCP schema", () => {
    expect(() =>
      parseToolArguments("submission.duplicates", {
        sourceUrls: ["https://github.com/domdomegg/airtable-mcp-server"],
        githubUrl: "https://github.com/domdomegg/airtable-mcp-server",
        docsUrl: "https://docs.example.com/airtable",
        downloadUrl: "https://example.com/downloads/airtable.zip",
        websiteUrl: "https://airtable-mcp.example",
      }),
    ).not.toThrow();

    const inputSchema = jsonSchemaForTool("submission.duplicates") as {
      properties?: Record<string, unknown>;
    };
    expect(inputSchema.properties).toMatchObject({
      sourceUrls: expect.any(Object),
      githubUrl: expect.any(Object),
      docsUrl: expect.any(Object),
      downloadUrl: expect.any(Object),
      websiteUrl: expect.any(Object),
    });
  });

  it("accepts fielded URL args through the public MCP tool path", async () => {
    const result = await callRegistryTool(
      "submission.duplicates",
      {
        githubUrl: "https://github.com/domdomegg/airtable-mcp-server/",
        limit: 3,
      },
      {
        readJsonArtifact: async (relativePath: string) => {
          if (relativePath === "search-index.json") {
            return { entries: [entry()] };
          }
          throw new Error(`Unexpected artifact read: ${relativePath}`);
        },
      },
    );

    expect(result).toMatchObject({
      ok: true,
      count: 1,
      matches: [
        expect.objectContaining({
          reasons: expect.arrayContaining(["source_url"]),
        }),
      ],
    });
  });

  it("accepts sourceUrls through the public MCP tool path", async () => {
    const result = await callRegistryTool(
      "submission.duplicates",
      {
        sourceUrls: [
          "https://github.com/unrelated/repo",
          "https://github.com/domdomegg/airtable-mcp-server/",
        ],
        limit: 3,
      },
      {
        readJsonArtifact: async (relativePath: string) => {
          if (relativePath === "search-index.json") {
            return { entries: [entry()] };
          }
          throw new Error(`Unexpected artifact read: ${relativePath}`);
        },
      },
    );

    expect(result).toMatchObject({
      ok: true,
      count: 1,
      matches: [
        expect.objectContaining({
          reasons: expect.arrayContaining(["source_url"]),
        }),
      ],
    });
  });

  it("returns count: 0 when no URL candidates are supplied", () => {
    const result = searchDuplicateEntries([entry()], {});
    expect(result.count).toBe(0);
  });
});
