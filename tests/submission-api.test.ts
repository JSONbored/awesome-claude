import { beforeEach, describe, expect, it, vi } from "vitest";

const envMock = vi.hoisted(() => ({ value: {} as Record<string, unknown> }));
const directoryEntriesMock = vi.hoisted(() => vi.fn());

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: () => ({ env: envMock.value }),
}));

vi.mock("@/lib/content", () => ({
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

function request(
  body: Record<string, unknown>,
  ip = "203.0.113.10",
  headers: Record<string, string> = {},
  url = "https://heyclau.de/api/submissions",
) {
  return new Request(url, {
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

function preflightRequest(
  body: Record<string, unknown>,
  ip = "203.0.113.10",
  headers: Record<string, string> = {},
) {
  return request(
    body,
    ip,
    headers,
    "https://heyclau.de/api/submissions/preflight",
  );
}

function githubIssueResponse(number = 42) {
  return new Response(
    JSON.stringify({
      number,
      html_url: `https://github.com/JSONbored/awesome-claude/issues/${number}`,
    }),
    {
      status: 201,
      headers: { "content-type": "application/json" },
    },
  );
}

function githubSearchResponse(items: Array<Record<string, unknown>> = []) {
  return new Response(
    JSON.stringify({
      total_count: items.length,
      items,
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    },
  );
}

describe("website submission API", () => {
  beforeEach(() => {
    directoryEntriesMock.mockReset();
    directoryEntriesMock.mockResolvedValue([]);
    envMock.value = {
      GITHUB_SUBMISSIONS_TOKEN: "test-token",
      GITHUB_SUBMISSIONS_REPO: "JSONbored/awesome-claude",
    };
    process.env.GITHUB_SUBMISSIONS_TOKEN = "test-token";
    process.env.GITHUB_SUBMISSION_TOKEN = "";
    process.env.GITHUB_TOKEN = "";
    process.env.GITHUB_SUBMISSIONS_REPO = "JSONbored/awesome-claude";
    process.env.GITHUB_SUBMISSION_REPO = "";
    process.env.GITHUB_REPOSITORY = "";
    process.env.TURNSTILE_SECRET_KEY = "";
    process.env.SUBMISSIONS_REQUIRE_TURNSTILE = "";
    process.env.REQUIRE_TURNSTILE = "";
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/search/issues")) {
          return Promise.resolve(githubSearchResponse());
        }
        return Promise.resolve(githubIssueResponse());
      }),
    );
  });

  it("creates a reviewable GitHub issue without writing content directly", async () => {
    const { POST } = await import("@/app/api/submissions/route");
    const response = await POST(
      request({ fields: validFields() }, "203.0.113.11"),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      category: "mcp",
      slug: "direct-submit-api-asset",
      issueUrl: "https://github.com/JSONbored/awesome-claude/issues/42",
      issueNumber: 42,
    });

    expect(fetch).toHaveBeenCalledTimes(2);
    const fetchMock = fetch as unknown as {
      mock: { calls: Array<[RequestInfo | URL, RequestInit]> };
    };
    const [, init] = fetchMock.mock.calls[1];
    const issuePayload = JSON.parse(String(init.body));
    expect(issuePayload.title).toBe(
      "Submit MCP Server: Direct Submit API Asset",
    );
    expect(issuePayload.body).toContain("### Name");
    expect(issuePayload.body).toContain("Direct Submit API Asset");
    expect(issuePayload.labels).toEqual([
      "content-submission",
      "needs-review",
      "community-mcp",
    ]);
  });

  it("rejects invalid submission fields before GitHub issue creation", async () => {
    const { POST } = await import("@/app/api/submissions/route");
    const response = await POST(
      request({ fields: { name: "Incomplete" } }, "203.0.113.12"),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "invalid_submission" },
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects duplicate slugs before GitHub issue creation", async () => {
    directoryEntriesMock.mockResolvedValue([
      { category: "mcp", slug: "direct-submit-api-asset" },
    ]);
    const { POST } = await import("@/app/api/submissions/route");
    const response = await POST(
      request({ fields: validFields() }, "203.0.113.13"),
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({
      error: {
        code: "duplicate_slug",
        details: {
          category: "mcp",
          slug: "direct-submit-api-asset",
        },
      },
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects pending duplicate submission issues before creating another one", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/search/issues")) {
          return Promise.resolve(
            githubSearchResponse([
              {
                number: 77,
                html_url:
                  "https://github.com/JSONbored/awesome-claude/issues/77",
                title: "Submit MCP Server: Direct Submit API Asset",
                body: "### Category\nmcp\n\n### Slug\ndirect-submit-api-asset",
              },
            ]),
          );
        }
        return Promise.resolve(githubIssueResponse());
      }),
    );

    const { POST } = await import("@/app/api/submissions/route");
    const response = await POST(
      request({ fields: validFields() }, "203.0.113.18"),
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({
      error: {
        code: "duplicate_pending_issue",
        details: {
          category: "mcp",
          slug: "direct-submit-api-asset",
          issueNumber: 77,
        },
      },
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("preflights valid submissions without GitHub writes", async () => {
    const { POST } = await import("@/app/api/submissions/preflight/route");
    const response = await POST(
      preflightRequest({ fields: validFields() }, "203.0.113.20"),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      valid: true,
      routeSuggestion: "github_issue",
      category: "mcp",
      slug: "direct-submit-api-asset",
      blockers: [],
      duplicates: [],
      issuePreview: {
        title: "Submit MCP Server: Direct Submit API Asset",
        labels: expect.arrayContaining(["content-submission"]),
      },
      risk: {
        policyDecision: expect.any(String),
        policyMatrix: expect.any(Object),
      },
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("preflights existing duplicate registry entries before issue creation", async () => {
    directoryEntriesMock.mockResolvedValue([
      {
        category: "mcp",
        slug: "direct-submit-api-asset",
        title: "Direct Submit API Asset",
        canonicalUrl: "https://heyclau.de/mcp/direct-submit-api-asset",
        documentationUrl: "https://example.com/docs",
        trustSignals: { sourceUrls: ["https://example.com/docs"] },
      },
    ]);
    const { POST } = await import("@/app/api/submissions/preflight/route");
    const response = await POST(
      preflightRequest({ fields: validFields() }, "203.0.113.21"),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      valid: false,
      routeSuggestion: "fix_required",
      blockers: [expect.objectContaining({ code: "duplicate_existing" })],
      duplicates: [
        expect.objectContaining({
          key: "mcp:direct-submit-api-asset",
          reasons: expect.arrayContaining(["slug", "source_url", "title"]),
        }),
      ],
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("preflights product-shaped submissions toward the tools flow", async () => {
    const { POST } = await import("@/app/api/submissions/preflight/route");
    const response = await POST(
      preflightRequest({
        fields: validFields({
          name: "Paid SaaS AI Platform",
          slug: "paid-saas-ai-platform",
          category: "mcp",
          docs_url: "https://example.com/pricing",
          install_command: "Use the hosted dashboard at https://example.com",
          usage_snippet: "Create an account and use the hosted dashboard.",
          safety_notes:
            "Hosted dashboard account actions happen in the third-party service.",
          privacy_notes:
            "Sends account and workspace data to the hosted third-party service.",
          description:
            "Commercial AI SaaS platform with pricing plans, subscription tiers, and a hosted product signup flow.",
          card_description: "Commercial AI SaaS platform.",
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      routeSuggestion: "tools_form",
      nextAction: {
        url: "/tools/submit",
      },
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("preflights local download requests as blockers", async () => {
    const { POST } = await import("@/app/api/submissions/preflight/route");
    const response = await POST(
      preflightRequest({
        fields: validFields({
          category: "skills",
          skill_type: "general",
          skill_level: "advanced",
          verification_status: "validated",
          download_url: "/downloads/skills/submitted.zip",
        }),
      }),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.routeSuggestion).toBe("fix_required");
    expect(body.nextAction).toMatchObject({
      label: "Fix blockers before opening a submission issue",
    });
    expect(body.nextAction.url).toBeUndefined();
    expect(
      body.blockers.map((item: { message: string }) => item.message),
    ).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Community submissions cannot request local"),
      ]),
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("preflights risky drafts with expected safety and privacy notes", async () => {
    const { POST } = await import("@/app/api/submissions/preflight/route");
    const response = await POST(
      preflightRequest({
        fields: validFields({
          name: "Workspace Sync Hook",
          slug: "workspace-sync-hook",
          category: "hooks",
          trigger: "PostToolUse",
          script_language: "bash",
          install_command: "curl -fsSL https://example.com/install.sh | sh",
          description:
            "Runs a background sync worker that reads the local workspace and requires an API key for a third-party API.",
          card_description: "Background sync hook for project files.",
          full_copyable_content:
            "curl -fsSL https://example.com/install.sh | sh\nexport API_TOKEN=...",
          safety_notes: "",
          privacy_notes: "",
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      expectedNotes: {
        safety: true,
        privacy: true,
      },
      warnings: expect.arrayContaining([
        expect.objectContaining({ code: "missing_safety_notes" }),
        expect.objectContaining({ code: "missing_privacy_notes" }),
      ]),
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("silently discards honeypot submissions", async () => {
    const { POST } = await import("@/app/api/submissions/route");
    const response = await POST(
      request(
        { fields: validFields(), honeypot: "https://spam.example" },
        "203.0.113.14",
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      queued: false,
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("requires Turnstile when the secret is configured", async () => {
    envMock.value = {
      ...envMock.value,
      TURNSTILE_SECRET_KEY: "turnstile-secret",
    };
    process.env.TURNSTILE_SECRET_KEY = "turnstile-secret";
    const { POST } = await import("@/app/api/submissions/route");
    const response = await POST(
      request({ fields: validFields() }, "203.0.113.15"),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "turnstile_failed" },
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fails closed when production Turnstile is required but not configured", async () => {
    envMock.value = {
      ...envMock.value,
      SUBMISSIONS_REQUIRE_TURNSTILE: "1",
    };
    process.env.TURNSTILE_SECRET_KEY = "";
    process.env.SUBMISSIONS_REQUIRE_TURNSTILE = "1";
    const { POST } = await import("@/app/api/submissions/route");
    const response = await POST(
      request({ fields: validFields() }, "203.0.113.19"),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "turnstile_not_configured" },
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns a GitHub fallback when issue creation is not configured", async () => {
    envMock.value = {};
    process.env.GITHUB_SUBMISSIONS_TOKEN = "";
    process.env.GITHUB_SUBMISSION_TOKEN = "";
    process.env.GITHUB_TOKEN = "";
    const { POST } = await import("@/app/api/submissions/route");
    const response = await POST(
      request({ fields: validFields() }, "203.0.113.16"),
    );

    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body).toMatchObject({
      error: { code: "submissions_not_configured" },
    });
    expect(String(body.error.details.fallbackUrl)).toContain(
      "https://github.com/JSONbored/awesome-claude/issues/new",
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rate limits repeated direct submissions by client IP", async () => {
    const { POST } = await import("@/app/api/submissions/route");
    for (let index = 0; index < 8; index += 1) {
      const response = await POST(
        request(
          {
            fields: validFields({
              slug: `direct-submit-api-asset-${index}`,
            }),
          },
          "203.0.113.17",
        ),
      );
      expect(response.status).toBe(200);
    }

    const limited = await POST(
      request(
        {
          fields: validFields({
            slug: "direct-submit-api-asset-limited",
          }),
        },
        "203.0.113.17",
      ),
    );
    expect(limited.status).toBe(429);
    await expect(limited.json()).resolves.toMatchObject({
      error: { code: "rate_limited" },
    });
  });
});
