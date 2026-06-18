import { beforeEach, describe, expect, it, vi } from "vitest";

const directoryEntriesMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/content.server", () => ({
  getDirectoryEntries: directoryEntriesMock,
}));

function validFields(overrides: Record<string, string> = {}) {
  return {
    name: "Direct Submit API Asset",
    slug: "direct-submit-api-asset",
    category: "mcp",
    contact_email: "dev@example.com",
    docs_url: "https://example.com/docs",
    description:
      "MCP server that exercises the direct website submission path.",
    card_description: "Exercises direct website submission.",
    install_command: "npx -y direct-submit-api-asset",
    usage_snippet:
      "claude mcp add direct-submit-api-asset -- npx -y direct-submit-api-asset",
    safety_notes:
      "Installs and runs an MCP server process from the submitted package.",
    privacy_notes:
      "Not applicable: this fixture does not access user files or credentials.",
    ...overrides,
  };
}

function preflightRequest(
  body: Record<string, unknown>,
  ip = "203.0.113.10",
  headers: Record<string, string> = {},
) {
  return new Request("https://heyclau.de/api/submissions/preflight", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://heyclau.de",
      "cf-connecting-ip": ip,
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("website submission preflight API", () => {
  beforeEach(() => {
    directoryEntriesMock.mockReset();
    directoryEntriesMock.mockResolvedValue([]);
    vi.unstubAllGlobals();
  });

  it("preflights valid submissions without GitHub writes", async () => {
    const { POST } = await import("@/routes/api/submissions/preflight");
    const response = await POST(
      preflightRequest({ fields: validFields() }, "203.0.113.11"),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      valid: true,
      category: "mcp",
      slug: "direct-submit-api-asset",
      routeSuggestion: "submit_pr",
      prPreview: {
        title: "Add MCP Server: Direct Submit API Asset",
        targetPath: "content/mcp/direct-submit-api-asset.mdx",
        branchHint: "heyclaude/submit-mcp-direct-submit-api-asset",
        baseRef: "main",
      },
    });
  });

  it("returns PR-first blockers for malformed submissions", async () => {
    const { POST } = await import("@/routes/api/submissions/preflight");
    const response = await POST(
      preflightRequest({ fields: { name: "Incomplete" } }, "203.0.113.12"),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
      ok: true,
      valid: false,
      routeSuggestion: "fix_required",
    });
    expect(body.blockers.map((item: { code: string }) => item.code)).toContain(
      "unsupported_category",
    );
    expect(body).not.toHaveProperty("fallbackUrl");
    expect(body).not.toHaveProperty("issueFallbackUrl");
    expect(body).not.toHaveProperty("issuePreview");
  });

  it("blocks existing duplicate registry entries before PR submission", async () => {
    directoryEntriesMock.mockResolvedValue([
      {
        category: "mcp",
        slug: "direct-submit-api-asset",
        title: "Direct Submit API Asset",
        repoUrl: "https://github.com/example/direct-submit-api-asset",
        canonicalUrl: "https://heyclau.de/entry/mcp/direct-submit-api-asset",
        trustSignals: { sourceUrls: [] },
      },
    ]);
    const { POST } = await import("@/routes/api/submissions/preflight");
    const response = await POST(
      preflightRequest({ fields: validFields() }, "203.0.113.13"),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      valid: false,
      routeSuggestion: "fix_required",
      blockers: expect.arrayContaining([
        expect.objectContaining({
          code: "duplicate_existing",
          message:
            "Likely duplicate of mcp:direct-submit-api-asset: same slug.",
        }),
      ]),
    });
  });

  it("continues preflight when duplicate lookup is unavailable", async () => {
    directoryEntriesMock.mockRejectedValueOnce(new Error("directory offline"));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { POST } = await import("@/routes/api/submissions/preflight");
    const response = await POST(
      preflightRequest({ fields: validFields() }, "203.0.113.14"),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      valid: true,
      duplicates: [],
    });
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("submissions.preflight.directory_entries_failed"),
    );
  });

  it("reports duplicate title warnings separately from source-url blockers", async () => {
    directoryEntriesMock.mockResolvedValue([
      {
        category: "mcp",
        slug: "same-title",
        title: "Direct Submit API Asset",
        repoUrl: "https://github.com/other/repo",
        canonicalUrl: "",
        trustSignals: { sourceUrls: [] },
      },
      {
        category: "mcp",
        slug: "same-source",
        title: "Different Asset",
        documentationUrl: "https://example.com/docs",
        canonicalUrl: "https://heyclau.de/entry/mcp/same-source",
        trustSignals: { sourceUrls: ["https://example.com/docs/"] },
      },
    ]);

    const { POST } = await import("@/routes/api/submissions/preflight");
    const response = await POST(
      preflightRequest(
        {
          fields: validFields({
            slug: "new-submit-api-asset",
            docs_url: "https://example.com/docs/#install",
          }),
        },
        "203.0.113.15",
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      valid: false,
      blockers: expect.arrayContaining([
        expect.objectContaining({
          code: "duplicate_existing",
          message: "Likely duplicate of mcp:same-source: same source.",
        }),
      ]),
      warnings: expect.arrayContaining([
        expect.objectContaining({
          code: "possible_duplicate_title",
          message: "Existing entry uses the same title: mcp:same-title.",
        }),
      ]),
      duplicates: expect.arrayContaining([
        expect.objectContaining({
          key: "mcp:same-source",
          reasonLabels: expect.arrayContaining(["same source"]),
        }),
      ]),
    });
  });

  it("canonicalizes tracked source URLs before duplicate matching", async () => {
    directoryEntriesMock.mockResolvedValue([
      {
        category: "mcp",
        slug: "tracked-source",
        title: "Tracked Source",
        documentationUrl: "https://example.com/docs?a=1&b=2",
        canonicalUrl: "https://heyclau.de/entry/mcp/tracked-source",
        trustSignals: { sourceUrls: [] },
      },
    ]);

    const { POST } = await import("@/routes/api/submissions/preflight");
    const response = await POST(
      preflightRequest(
        {
          fields: validFields({
            name: "New Tracked Source",
            slug: "new-tracked-source",
            docs_url:
              "https://www.example.com/docs/?utm_source=newsletter&b=2&a=1#install",
          }),
        },
        "203.0.113.16",
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      routeSuggestion: "fix_required",
      blockers: expect.arrayContaining([
        expect.objectContaining({
          code: "duplicate_existing",
          message: "Likely duplicate of mcp:tracked-source: same source.",
        }),
      ]),
    });
  });

  it("warns on similar titles and shared source hosts without blocking submission", async () => {
    directoryEntriesMock.mockResolvedValue([
      {
        category: "mcp",
        slug: "direct-submit-api-connector",
        title: "Direct Submit API Connector",
        documentationUrl:
          "https://docs.example.org/direct-submit-api-connector",
        canonicalUrl:
          "https://heyclau.de/entry/mcp/direct-submit-api-connector",
        trustSignals: { sourceUrls: [] },
      },
      {
        category: "mcp",
        slug: "github-repo-match",
        title: "Different GitHub Tool",
        repoUrl: "https://github.com/example/shared-repo",
        canonicalUrl: "https://heyclau.de/entry/mcp/github-repo-match",
        trustSignals: { sourceUrls: [] },
      },
    ]);

    const { POST } = await import("@/routes/api/submissions/preflight");
    const response = await POST(
      preflightRequest(
        {
          fields: validFields({
            name: "Direct Submit API Asset",
            slug: "new-submit-api-asset",
            docs_url: "https://docs.example.org/new-submit-api-asset",
            github_url:
              "https://github.com/example/shared-repo/tree/main/packages/mcp",
          }),
        },
        "203.0.113.17",
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      routeSuggestion: "submit_pr",
      warnings: expect.arrayContaining([
        expect.objectContaining({
          code: "possible_duplicate_existing",
          message:
            "Possible related existing entry mcp:direct-submit-api-connector: similar title, same source host.",
        }),
        expect.objectContaining({
          code: "possible_duplicate_existing",
          message:
            "Possible related existing entry mcp:github-repo-match: same GitHub repository.",
        }),
      ]),
      duplicates: expect.arrayContaining([
        expect.objectContaining({
          key: "mcp:direct-submit-api-connector",
          reasonLabels: expect.arrayContaining([
            "similar title",
            "same source host",
          ]),
        }),
        expect.objectContaining({
          key: "mcp:github-repo-match",
          reasonLabels: expect.arrayContaining(["same GitHub repository"]),
        }),
      ]),
    });
  });

  it("routes product-shaped submissions away from free content", async () => {
    const { POST } = await import("@/routes/api/submissions/preflight");
    const response = await POST(
      preflightRequest({
        fields: validFields({
          category: "mcp",
          name: "Paid Hosted Platform",
          slug: "paid-hosted-platform",
          description:
            "Paid SaaS platform with pricing, enterprise plans, and listing-style claims.",
          docs_url: "https://example.com/pricing",
        }),
      }),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.routeSuggestion).toBe("route_away");
  });

  it("routes tools listings without maintainer approval away from public PR submission", async () => {
    const { POST } = await import("@/routes/api/submissions/preflight");
    const response = await POST(
      preflightRequest({
        fields: validFields({
          category: "tools",
          name: "Paid Hosted Claude Platform",
          slug: "paid-hosted-claude-platform",
          description:
            "Paid SaaS platform with sponsored placement and enterprise pricing for Claude workflow teams.",
          card_description: "Paid Claude workflow platform.",
          website_url: "https://example.com/product",
          docs_url: "https://example.com/docs",
          pricing_model: "paid",
          disclosure: "sponsored",
          application_category: "Hosted platform",
          operating_system: "Web",
        }),
      }),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.routeSuggestion).toBe("route_away");
    expect(body.valid).toBe(false);
    expect(body.schema.errors.join("\n")).toContain(
      "not merged from the free resource queue without maintainer approval",
    );
  });

  it("routes risky but potentially valid submissions to manual review", async () => {
    const { POST } = await import("@/routes/api/submissions/preflight");
    const response = await POST(
      preflightRequest({
        fields: validFields({
          name: "Wallet Attestation MCP",
          slug: "wallet-attestation-mcp",
          description:
            "MCP server that uses OAuth and API keys to help users manage wallet attestations and on-chain identity workflows.",
          usage_snippet:
            "Set OAUTH_CLIENT_ID and API_KEY, then run claude mcp add wallet-attestation-mcp -- npx -y wallet-attestation-mcp",
          safety_notes:
            "Requires credential setup and should only be used with scoped test accounts.",
          privacy_notes:
            "Stores OAuth tokens locally and sends requests to the configured API provider.",
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      valid: false,
      routeSuggestion: "manual_review",
    });
  });

  it("silently discards honeypot submissions without queueing anything", async () => {
    const { POST } = await import("@/routes/api/submissions/preflight");
    const response = await POST(
      preflightRequest({ fields: validFields(), honeypot: "bot" }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      valid: false,
      queued: false,
    });
  });
});
