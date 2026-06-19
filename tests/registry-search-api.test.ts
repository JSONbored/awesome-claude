import type { SearchDocument } from "@heyclaude/registry";
import { beforeEach, describe, expect, it, vi } from "vitest";

const searchIndexMock = vi.hoisted(() => ({
  entries: [] as SearchDocument[],
}));

vi.mock("@/lib/content.server", () => ({
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

async function runSearch(query: string) {
  const { GET } = await import("../apps/web/src/routes/api/registry/search");
  const response = await GET(
    new Request(
      `https://heyclau.de/api/registry/search?q=${encodeURIComponent(query)}`,
      { headers: { origin: "https://heyclau.de" } },
    ),
  );

  expect(response.status).toBe(200);
  return response.json();
}

describe("/api/registry/search", () => {
  beforeEach(() => {
    vi.resetModules();
    searchIndexMock.entries = ["a", "b", "c"].map((slug) =>
      makeEntry(`fixture-${slug}`),
    );
  });

  it("returns page metadata while preserving full-result facets", async () => {
    const { GET } = await import("../apps/web/src/routes/api/registry/search");
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

    const { GET } = await import("../apps/web/src/routes/api/registry/search");
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

  it("prioritizes required high-intent Claude workflow query fixtures", async () => {
    const trustedSignals = {
      ...makeEntry("trusted").trustSignals,
      sourceStatus: "available",
      sourceUrlCount: 1,
      packageVerified: true,
      hasSafetyNotes: true,
      hasPrivacyNotes: true,
    };

    searchIndexMock.entries = [
      {
        ...makeEntry("broad-code-review"),
        title: "Repository Browser",
        description: "Generic MCP directory page that mentions code review once.",
        tags: ["browser"],
        keywords: ["code"],
      },
      {
        ...makeEntry("code-review-agent"),
        category: "agents",
        title: "Code Review MCP Server",
        description: "Review code changes with source-backed repository metadata.",
        tags: ["code-review", "pull-request"],
        keywords: ["code-review", "repository review"],
        safetyNotes: ["Runs read-only repository analysis."],
        privacyNotes: ["Reads selected source snippets."],
        trustSignals: trustedSignals,
      },
      {
        ...makeEntry("broad-browser-automation"),
        title: "Automation Notes",
        description: "A broad note that mentions browser automation in passing.",
        tags: ["automation"],
        keywords: ["browser"],
      },
      {
        ...makeEntry("browser-automation-mcp"),
        title: "Playwright Browser Automation MCP Server",
        description: "Run browser automation and screenshot workflows for Claude Code.",
        tags: ["browser-automation", "playwright", "web-testing"],
        keywords: ["browser automation", "chrome", "screenshots"],
        safetyNotes: ["Runs browser sessions with reviewed test credentials."],
        privacyNotes: ["Pages and screenshots may contain user data."],
        trustSignals: trustedSignals,
      },
      {
        ...makeEntry("broad-safe-mcp"),
        title: "MCP Scratchpad",
        description: "General safe MCP wording without reviewed trust metadata.",
        tags: ["mcp"],
        keywords: ["safe"],
        trustSignals: {
          ...makeEntry("broad-safe-mcp").trustSignals,
          sourceStatus: "missing",
        },
      },
      {
        ...makeEntry("safe-mcp-review"),
        title: "MCP Security Review Server",
        description: "Review MCP servers for least privilege before connecting them.",
        tags: ["mcp", "security", "least-privilege"],
        keywords: ["safe mcp", "mcp security", "trust review"],
        downloadTrust: "first-party",
        safetyNotes: ["Reviews tool side effects before installation."],
        privacyNotes: ["Flags credential and tool-output exposure."],
        trustSignals: trustedSignals,
      },
      {
        ...makeEntry("broad-design-skill"),
        category: "guides",
        title: "Design Workflow Guide",
        description: "Mentions skill development for visual collaboration.",
        tags: ["design"],
        keywords: ["workflow"],
      },
      {
        ...makeEntry("design-system-skill"),
        category: "skills",
        title: "Design System Skill",
        description: "Reusable design review capability for Claude workflows.",
        tags: ["design", "ux", "visual-qa"],
        keywords: ["design skill", "frontend design"],
      },
      {
        ...makeEntry("broad-statusline"),
        category: "guides",
        title: "Workflow Visibility Guide",
        description: "Mentions statusline examples for coding sessions.",
        tags: ["observability"],
        keywords: ["statusline"],
      },
      {
        ...makeEntry("context-statusline"),
        category: "statuslines",
        title: "Context Pressure Statusline",
        description: "Claude Code statusline for context and usage visibility.",
        tags: ["statusline", "monitoring", "usage"],
        keywords: ["claude code statusline", "workflow visibility"],
        safetyNotes: ["Runs a local shell status command."],
        privacyNotes: ["May read git state and local session metadata."],
        trustSignals: trustedSignals,
      },
      {
        ...makeEntry("broad-raycast"),
        category: "guides",
        title: "Launcher Guide",
        description: "Mentions Raycast as one possible launcher.",
        tags: ["launcher"],
        keywords: ["raycast"],
      },
      {
        ...makeEntry("raycast-registry-search"),
        category: "tools",
        title: "Raycast Registry Search",
        description: "Search HeyClaude registry entries from Raycast.",
        tags: ["raycast", "launcher", "extension"],
        keywords: ["raycast extension", "launcher"],
        platforms: ["raycast"],
        trustSignals: trustedSignals,
      },
    ];

    const expectations = [
      ["code review", "code-review-agent", "broad-code-review"],
      ["browser automation", "browser-automation-mcp", "broad-browser-automation"],
      ["safe mcp", "safe-mcp-review", "broad-safe-mcp"],
      ["design skill", "design-system-skill", "broad-design-skill"],
      ["statusline", "context-statusline", "broad-statusline"],
      ["raycast", "raycast-registry-search", "broad-raycast"],
    ] as const;

    for (const [query, expectedSlug, broadSlug] of expectations) {
      const body = await runSearch(query);
      const winner = body.results[0];
      const broadMatch = body.results.find(
        (entry: SearchDocument & { searchScore?: number }) => entry.slug === broadSlug,
      );

      expect(body.results.length).toBeLessThanOrEqual(50);
      expect(winner.slug).toBe(expectedSlug);
      expect(winner.searchReasons).toContain("query intent");
      expect(winner.searchScore).toBeGreaterThan(broadMatch?.searchScore ?? 0);
    }
  });

  it("matches multi-token and aliased category searches without requiring an exact phrase", async () => {
    searchIndexMock.entries = [
      {
        ...makeEntry("microsoft-teams"),
        title: "MCP Teams Server",
        description: "Connect Microsoft Teams through Claude Code.",
        tags: ["teams", "mcp"],
        keywords: ["microsoft-teams", "msteams"],
        installable: true,
      },
      {
        ...makeEntry("claude-hook"),
        category: "hooks",
        title: "Auto Formatter Hook",
        description: "Format files before Claude Code completes a task.",
        tags: ["hooks", "formatter"],
        keywords: ["claude-code"],
      },
      {
        ...makeEntry("github-server"),
        title: "GitHub MCP Server",
        description: "Search repositories and issues.",
        tags: ["github"],
        keywords: ["repository"],
      },
    ];

    const { GET } = await import("../apps/web/src/routes/api/registry/search");
    const teams = await GET(
      new Request(
        "https://heyclau.de/api/registry/search?q=ms%20teams&installable=true",
        { headers: { origin: "https://heyclau.de" } },
      ),
    );
    const hooks = await GET(
      new Request(
        "https://heyclau.de/api/registry/search?q=claude%20code%20hooks",
        { headers: { origin: "https://heyclau.de" } },
      ),
    );
    const github = await GET(
      new Request("https://heyclau.de/api/registry/search?q=gh", {
        headers: { origin: "https://heyclau.de" },
      }),
    );

    await expect(teams.json()).resolves.toMatchObject({
      total: 1,
      results: [expect.objectContaining({ slug: "microsoft-teams" })],
    });
    await expect(hooks.json()).resolves.toMatchObject({
      total: 1,
      results: [expect.objectContaining({ slug: "claude-hook" })],
    });
    await expect(github.json()).resolves.toMatchObject({
      total: 1,
      results: [expect.objectContaining({ slug: "github-server" })],
    });
  });

  it("does not advertise an offset beyond the documented maximum", async () => {
    searchIndexMock.entries = Array.from({ length: 10_001 }, (_, index) =>
      makeEntry(`fixture-${index}`),
    );

    const { GET } = await import("../apps/web/src/routes/api/registry/search");
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
    const { GET } = await import("../apps/web/src/routes/api/registry/search");
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
    const { GET } = await import("../apps/web/src/routes/api/registry/search");
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
