import type { SearchDocument } from "@heyclaude/registry";
import { beforeEach, describe, expect, it, vi } from "vitest";

const searchIndexMock = vi.hoisted(() => ({
  entries: [] as SearchDocument[],
}));

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: () => ({ env: {} }),
}));

vi.mock("@/lib/content", () => ({
  getSearchIndex: () => Promise.resolve(searchIndexMock.entries),
}));

function makeEntry(slug: string): SearchDocument {
  return {
    category: "mcp",
    slug,
    title: `Fixture ${slug}`,
    description: "fixture search pagination",
    tags: [slug],
    keywords: ["fixture"],
    author: "tester",
    dateAdded: "2026-05-24",
    installable: false,
    downloadTrust: null,
    verificationStatus: "unverified",
    platforms: ["claude-code"],
    documentationUrl: "https://example.com/docs",
    repoUrl: "https://example.com/repo",
    url: "https://example.com",
    canonicalUrl: "https://example.com",
    llmsUrl: "https://example.com/llms.txt",
    apiUrl: "https://example.com/api",
    trustSignals: {
      firstPartyEditorial: false,
      packageVerified: false,
      packageTrust: null,
      packageChecksum: "",
      checksumPresent: false,
      sourceUrlCount: 0,
      sourceUrls: [],
      sourceStatus: "available",
      lastVerifiedAt: "",
      adapterGenerated: false,
      platforms: ["claude-code"],
      supportLevels: [],
    },
  } as SearchDocument;
}

describe("/api/registry/search", () => {
  beforeEach(() => {
    vi.resetModules();
    searchIndexMock.entries = ["a", "b", "c"].map((slug) =>
      makeEntry(`fixture-${slug}`),
    );
  });

  it("returns page metadata while preserving full-result facets", async () => {
    const { GET } =
      await import("../apps/web/src/app/api/registry/search/route");
    const response = await GET(
      new Request(
        "https://heyclau.de/api/registry/search?q=fixture&limit=2&offset=2",
        { headers: { origin: "https://heyclau.de" } },
      ),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
      count: 1,
      total: 3,
      limit: 2,
      offset: 2,
      nextOffset: null,
    });
    expect(body.results.map((entry: SearchDocument) => entry.slug)).toEqual([
      "fixture-c",
    ]);
    expect(body.facets.categories.mcp).toBe(3);
  });

  it("ranks exact title and trust matches ahead of broad substring matches", async () => {
    searchIndexMock.entries = [
      {
        ...makeEntry("broad-browser"),
        title: "Browser helper",
        description: "MCP server with a passing code review mention.",
        tags: ["browser"],
      },
      {
        ...makeEntry("code-review-agent"),
        title: "Code Review MCP Server",
        description: "Review code changes with source-backed metadata.",
        tags: ["review"],
        keywords: ["code-review", "quality"],
        trustSignals: {
          ...makeEntry("code-review-agent").trustSignals,
          sourceStatus: "available",
          sourceUrlCount: 1,
        },
        safetyNotes: ["Runs read-only repository analysis."],
        privacyNotes: ["Sends selected source snippets to the configured API."],
      },
    ];

    const { GET } =
      await import("../apps/web/src/app/api/registry/search/route");
    const response = await GET(
      new Request("https://heyclau.de/api/registry/search?q=code review", {
        headers: { origin: "https://heyclau.de" },
      }),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.results.map((entry: SearchDocument) => entry.slug)).toEqual([
      "code-review-agent",
      "broad-browser",
    ]);
    expect(body.results[0].searchScore).toBeGreaterThan(
      body.results[1].searchScore,
    );
    expect(body.results[0].searchReasons).toContain("title phrase");
    expect(body.results[0].searchReasons).toContain("source-backed");
  });

  it("does not advertise an offset beyond the documented maximum", async () => {
    searchIndexMock.entries = Array.from({ length: 10_001 }, (_, index) =>
      makeEntry(`fixture-${index}`),
    );

    const { GET } =
      await import("../apps/web/src/app/api/registry/search/route");
    const cappedPage = await GET(
      new Request(
        "https://heyclau.de/api/registry/search?limit=50&offset=9990",
        { headers: { origin: "https://heyclau.de" } },
      ),
    );

    await expect(cappedPage.json()).resolves.toMatchObject({
      count: 11,
      total: 10_001,
      nextOffset: null,
    });

    const finalPage = await GET(
      new Request(
        "https://heyclau.de/api/registry/search?limit=50&offset=10000",
        { headers: { origin: "https://heyclau.de" } },
      ),
    );

    await expect(finalPage.json()).resolves.toMatchObject({
      count: 1,
      total: 10_001,
      nextOffset: null,
    });
  });

  it("treats explicit empty category and platform as 'no filter'", async () => {
    const { GET } =
      await import("../apps/web/src/app/api/registry/search/route");
    const response = await GET(
      new Request(
        "https://heyclau.de/api/registry/search?q=fixture&category=&platform=",
        { headers: { origin: "https://heyclau.de" } },
      ),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ count: 3, total: 3 });
    expect(body.results.map((entry: SearchDocument) => entry.slug)).toEqual([
      "fixture-a",
      "fixture-b",
      "fixture-c",
    ]);
  });

  it("still rejects malformed non-empty category and platform", async () => {
    const { GET } =
      await import("../apps/web/src/app/api/registry/search/route");
    const badPlatform = await GET(
      new Request(
        "https://heyclau.de/api/registry/search?q=fixture&platform=%21bad",
        { headers: { origin: "https://heyclau.de" } },
      ),
    );
    expect(badPlatform.status).toBe(400);

    const badCategory = await GET(
      new Request(
        "https://heyclau.de/api/registry/search?q=fixture&category=NOT_A_SLUG",
        { headers: { origin: "https://heyclau.de" } },
      ),
    );
    expect(badCategory.status).toBe(400);
  });
});
