import { beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { apiRouteDefinitions } from "../apps/web/src/lib/api/contracts";
import { repoRoot } from "./helpers/registry-fixtures";

function submissionRequest(
  body: unknown,
  headers: Record<string, string> = {},
) {
  return new Request("https://heyclau.de/api/submissions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://heyclau.de",
      "cf-connecting-ip": "198.51.100.99",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("central API router security", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
    delete process.env.BRANDFETCH_CLIENT_ID;
  });

  it("normalizes forbidden-origin errors and attaches security headers", async () => {
    const { createApiHandler, apiJson } = await import("@/lib/api/router");
    const POST = createApiHandler("submissions.create", async () =>
      apiJson({ ok: true }),
    );

    const response = await POST(
      submissionRequest({ fields: {} }, { origin: "https://attacker.example" }),
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: {
        code: "forbidden_origin",
        message: "Forbidden origin",
      },
    });
    expect(response.headers.get("content-security-policy")).toContain(
      "frame-ancestors 'none'",
    );
    expect(response.headers.get("x-frame-options")).toBe("DENY");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  });

  it("rejects oversized JSON requests before body parsing", async () => {
    const { createApiHandler, apiJson } = await import("@/lib/api/router");
    const POST = createApiHandler("submissions.create", async () =>
      apiJson({ ok: true }),
    );

    const response = await POST(
      submissionRequest(
        { fields: {} },
        { "content-length": String(65 * 1024) },
      ),
    );

    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: { code: "payload_too_large" },
    });
  });

  it("rejects oversized streamed JSON requests without content-length", async () => {
    const { createApiHandler, apiJson } = await import("@/lib/api/router");
    const POST = createApiHandler("submissions.create", async () =>
      apiJson({ ok: true }),
    );

    const response = await POST(
      submissionRequest({
        fields: {
          name: "Large Payload",
          description: "x".repeat(70 * 1024),
        },
      }),
    );

    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: { code: "payload_too_large" },
    });
  });

  it("rejects invalid JSON content type for body-backed endpoints", async () => {
    const { createApiHandler, apiJson } = await import("@/lib/api/router");
    const POST = createApiHandler("submissions.create", async () =>
      apiJson({ ok: true }),
    );

    const response = await POST(
      new Request("https://heyclau.de/api/submissions", {
        method: "POST",
        headers: {
          "content-type": "text/plain",
          origin: "https://heyclau.de",
          "cf-connecting-ip": "198.51.100.100",
        },
        body: "not-json",
      }),
    );

    expect(response.status).toBe(415);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: { code: "invalid_content_type" },
    });
  });

  it("returns Zod issue details for malformed query input", async () => {
    const { createApiHandler, apiJson } = await import("@/lib/api/router");
    const GET = createApiHandler("registry.search", async () =>
      apiJson({ ok: true }),
    );

    const response = await GET(
      new Request("https://heyclau.de/api/registry/search?limit=999", {
        headers: { origin: "https://heyclau.de" },
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: {
        code: "invalid_payload",
        details: [expect.objectContaining({ path: "limit" })],
      },
    });
  });

  it("rejects unknown listing lead fields before route code runs", async () => {
    const { createApiHandler, apiJson } = await import("@/lib/api/router");
    const POST = createApiHandler("listingLeads.create", async () =>
      apiJson({ ok: true }),
    );

    const response = await POST(
      new Request("https://heyclau.de/api/listing-leads", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://heyclau.de",
          "cf-connecting-ip": "198.51.100.101",
        },
        body: JSON.stringify({
          kind: "claim",
          tierInterest: "free",
          contactName: "Jane",
          contactEmail: "jane@example.com",
          companyName: "Example Co",
          listingTitle: "Example Listing",
          websiteUrl: "https://example.com/proof",
          message: "Claiming a listing.",
          unexpectedWriteFlag: true,
        }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: { code: "invalid_payload" },
    });
  });

  it("accepts claim listing leads in the central contract", async () => {
    const parsed = apiRouteDefinitions["listingLeads.create"].bodySchema?.parse(
      {
        kind: "claim",
        tierInterest: "free",
        contactName: "Jane",
        contactEmail: "jane@example.com",
        companyName: "Example Co",
        listingTitle: "Example Listing",
        websiteUrl: "https://example.com/proof",
        message: "Claiming a listing.",
      },
    );

    expect(parsed).toMatchObject({
      kind: "claim",
      tierInterest: "free",
      websiteUrl: "https://example.com/proof",
    });
  });

  it("requires HTTPS apply URLs for job listing leads", async () => {
    expect(() =>
      apiRouteDefinitions["listingLeads.create"].bodySchema?.parse({
        kind: "job",
        tierInterest: "free",
        contactName: "Jane",
        contactEmail: "jane@example.com",
        companyName: "Example Co",
        listingTitle: "AI Engineer",
        applyUrl: "http://example.com/jobs/ai-engineer",
      }),
    ).not.toThrow();

    const { validateListingLeadPayload } =
      await import("@heyclaude/registry/commercial");
    const report = validateListingLeadPayload({
      kind: "job",
      tierInterest: "free",
      contactName: "Jane",
      contactEmail: "jane@example.com",
      companyName: "Example Co",
      listingTitle: "AI Engineer",
      applyUrl: "http://example.com/jobs/ai-engineer",
    });
    expect(report.ok).toBe(false);
    expect(report.errors).toContain("job leads require an https applyUrl");
  });

  it("configures Cloudflare-native rate-limit bindings for protected routes", () => {
    const wranglerConfig = fs.readFileSync(
      path.join(repoRoot, "apps/web/wrangler.jsonc"),
      "utf8",
    );
    const routerSource = fs.readFileSync(
      path.join(repoRoot, "apps/web/src/lib/api/router.ts"),
      "utf8",
    );

    expect(wranglerConfig).toContain('"ratelimits"');
    expect(wranglerConfig).not.toContain('"type": "ratelimit"');
    expect(wranglerConfig).toContain('"name": "API_REGISTRY_RATE_LIMIT"');
    expect(wranglerConfig).toContain('"name": "API_DYNAMIC_RATE_LIMIT"');
    expect(wranglerConfig).toContain('"name": "API_STRICT_RATE_LIMIT"');
    expect(wranglerConfig).toContain('"name": "API_MCP_RATE_LIMIT"');
    expect(apiRouteDefinitions["submissions.create"].rateLimit?.binding).toBe(
      "API_STRICT_RATE_LIMIT",
    );
    expect(
      apiRouteDefinitions["submissions.preflight"].rateLimit?.binding,
    ).toBe("API_DYNAMIC_RATE_LIMIT");
    expect(apiRouteDefinitions["registry.search"].rateLimit?.binding).toBe(
      "API_REGISTRY_RATE_LIMIT",
    );
    expect(apiRouteDefinitions["mcp.streamable"].rateLimit).toMatchObject({
      binding: "API_MCP_RATE_LIMIT",
      limit: 60,
      windowMs: 60_000,
    });
    expect(routerSource).toContain("binding.limit({ key })");
  });

  it("rejects Brandfetch icons outside the trusted asset CDN", async () => {
    process.env.BRANDFETCH_CLIENT_ID = "test-client";
    const fetchMock = vi.fn(async () =>
      Response.json([
        {
          domain: "example.com",
          icon: "https://attacker.example/icon.svg",
        },
      ]),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { GET } = await import("@/routes/api/brand-assets/$kind/$domain");
    const response = await GET(
      new Request("https://heyclau.de/api/brand-assets/icon/example.com"),
      { params: { kind: "icon", domain: "example.com" } },
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: { code: "brand_asset_invalid" },
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("rejects Brandfetch icon redirects outside the trusted asset CDN", async () => {
    process.env.BRANDFETCH_CLIENT_ID = "test-client";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json([
          {
            domain: "example.com",
            icon: "https://cdn.brandfetch.io/example/icon.png",
          },
        ]),
      )
      .mockResolvedValueOnce(
        new Response(null, {
          status: 302,
          headers: {
            location: "https://attacker.example/icon.png",
          },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const { GET } = await import("@/routes/api/brand-assets/$kind/$domain");
    const response = await GET(
      new Request("https://heyclau.de/api/brand-assets/icon/example.com"),
      { params: { kind: "icon", domain: "example.com" } },
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: { code: "brand_asset_invalid" },
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("rejects SVG Brandfetch icon responses from trusted hosts", async () => {
    process.env.BRANDFETCH_CLIENT_ID = "test-client";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json([
          {
            domain: "example.com",
            icon: "https://cdn.brandfetch.io/example/icon.svg",
          },
        ]),
      )
      .mockResolvedValueOnce(
        new Response("<svg><script>alert(1)</script></svg>", {
          headers: {
            "content-length": "37",
            "content-type": "image/svg+xml",
          },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const { GET } = await import("@/routes/api/brand-assets/$kind/$domain");
    const response = await GET(
      new Request("https://heyclau.de/api/brand-assets/icon/example.com"),
      { params: { kind: "icon", domain: "example.com" } },
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: { code: "brand_asset_invalid" },
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("rejects oversized Brandfetch icon responses before buffering", async () => {
    process.env.BRANDFETCH_CLIENT_ID = "test-client";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json([
          {
            domain: "example.com",
            icon: "https://cdn.brandfetch.io/example/icon.png",
          },
        ]),
      )
      .mockResolvedValueOnce(
        new Response(null, {
          headers: {
            "content-length": String(1024 * 1024 + 1),
            "content-type": "image/png",
          },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const { GET } = await import("@/routes/api/brand-assets/$kind/$domain");
    const response = await GET(
      new Request("https://heyclau.de/api/brand-assets/icon/example.com"),
      { params: { kind: "icon", domain: "example.com" } },
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: { code: "brand_asset_too_large" },
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("requires admin tokens for reviewed D1 jobs endpoints", async () => {
    const { GET } = await import("@/routes/api/admin/jobs/health");
    const response = await GET(
      new Request("https://heyclau.de/api/admin/jobs/health", {
        headers: { origin: "https://heyclau.de" },
      }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: { code: "unauthorized" },
    });
  });

  it("rejects jobs-only tokens on listing lead admin routes", async () => {
    const previousAdmin = process.env.ADMIN_API_TOKEN;
    const previousJobs = process.env.JOBS_ADMIN_API_TOKEN;
    const previousLeads = process.env.LEADS_ADMIN_TOKEN;
    const previousAdminLeads = process.env.ADMIN_LEADS_TOKEN;
    delete process.env.ADMIN_API_TOKEN;
    process.env.JOBS_ADMIN_API_TOKEN = "jobs-admin-token";
    delete process.env.LEADS_ADMIN_TOKEN;
    delete process.env.ADMIN_LEADS_TOKEN;

    try {
      const { GET } = await import("@/routes/api/admin/listing-leads");
      const response = await GET(
        new Request("https://heyclau.de/api/admin/listing-leads", {
          headers: { authorization: "Bearer jobs-admin-token" },
        }),
      );

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toMatchObject({
        ok: false,
        error: { code: "unauthorized" },
      });
    } finally {
      if (previousAdmin === undefined) delete process.env.ADMIN_API_TOKEN;
      else process.env.ADMIN_API_TOKEN = previousAdmin;
      if (previousJobs === undefined) delete process.env.JOBS_ADMIN_API_TOKEN;
      else process.env.JOBS_ADMIN_API_TOKEN = previousJobs;
      if (previousLeads === undefined) delete process.env.LEADS_ADMIN_TOKEN;
      else process.env.LEADS_ADMIN_TOKEN = previousLeads;
      if (previousAdminLeads === undefined)
        delete process.env.ADMIN_LEADS_TOKEN;
      else process.env.ADMIN_LEADS_TOKEN = previousAdminLeads;
    }
  });

  it("scopes dedicated admin tokens to their intended admin routes", async () => {
    const previousAdmin = process.env.ADMIN_API_TOKEN;
    const previousJobs = process.env.JOBS_ADMIN_API_TOKEN;
    const previousLeads = process.env.LEADS_ADMIN_TOKEN;
    const previousAdminLeads = process.env.ADMIN_LEADS_TOKEN;
    process.env.ADMIN_API_TOKEN = "primary-admin-token";
    process.env.JOBS_ADMIN_API_TOKEN = "jobs-admin-token";
    process.env.LEADS_ADMIN_TOKEN = "leads-admin-token";
    delete process.env.ADMIN_LEADS_TOKEN;

    try {
      const { isJobsAdminAuthorized, isLeadsAdminAuthorized } =
        await import("@/lib/admin-auth");
      expect(
        isJobsAdminAuthorized(
          new Request("https://heyclau.de/api/admin/jobs", {
            headers: { authorization: "Bearer jobs-admin-token" },
          }),
        ),
      ).toBe(true);
      expect(
        isLeadsAdminAuthorized(
          new Request("https://heyclau.de/api/admin/listing-leads", {
            headers: { authorization: "Bearer jobs-admin-token" },
          }),
        ),
      ).toBe(false);
      expect(
        isLeadsAdminAuthorized(
          new Request("https://heyclau.de/api/admin/listing-leads", {
            headers: { "x-admin-token": "leads-admin-token" },
          }),
        ),
      ).toBe(true);
      expect(
        isJobsAdminAuthorized(
          new Request("https://heyclau.de/api/admin/jobs", {
            headers: { "x-admin-token": "leads-admin-token" },
          }),
        ),
      ).toBe(false);
      expect(
        isLeadsAdminAuthorized(
          new Request("https://heyclau.de/api/admin/listing-leads", {
            headers: { "x-admin-token": "primary-admin-token" },
          }),
        ),
      ).toBe(true);
      expect(
        isJobsAdminAuthorized(
          new Request("https://heyclau.de/api/admin/jobs", {
            headers: { "x-admin-token": "primary-admin-token" },
          }),
        ),
      ).toBe(true);
    } finally {
      if (previousAdmin === undefined) delete process.env.ADMIN_API_TOKEN;
      else process.env.ADMIN_API_TOKEN = previousAdmin;
      if (previousJobs === undefined) delete process.env.JOBS_ADMIN_API_TOKEN;
      else process.env.JOBS_ADMIN_API_TOKEN = previousJobs;
      if (previousLeads === undefined) delete process.env.LEADS_ADMIN_TOKEN;
      else process.env.LEADS_ADMIN_TOKEN = previousLeads;
      if (previousAdminLeads === undefined)
        delete process.env.ADMIN_LEADS_TOKEN;
      else process.env.ADMIN_LEADS_TOKEN = previousAdminLeads;
    }
  });

  it("rejects invalid admin lead status filters and neutralizes CSV formulas", async () => {
    expect(() =>
      apiRouteDefinitions["adminListingLeads.list"].querySchema?.parse({
        status: "peding_review",
      }),
    ).toThrow();

    const { csvEscape } = await import("@/lib/csv");
    expect(csvEscape('=IMPORTXML("https://attacker.invalid")')).toBe(
      '"\'=IMPORTXML(""https://attacker.invalid"")"',
    );
    expect(csvEscape("+Example")).toBe("'+Example");
    expect(csvEscape("@payload")).toBe("'@payload");
  });

  it("validates reviewed D1 job payloads before admin route code runs", () => {
    expect(() =>
      apiRouteDefinitions["adminJobs.upsert"].bodySchema?.parse({
        slug: "reviewed-ai-engineer",
        title: "Reviewed AI Engineer",
        companyName: "Example Co",
        summary:
          "Build reviewed Claude workflow systems with source verification, external apply links, and private D1-backed publication state.",
        applyUrl: "http://example.com/jobs/reviewed-ai-engineer",
      }),
    ).toThrow(/URL must be HTTPS/);

    expect(
      apiRouteDefinitions["adminJobs.upsert"].bodySchema?.parse({
        slug: "reviewed-ai-engineer",
        title: "Reviewed AI Engineer",
        companyName: "Example Co",
        summary:
          "Build reviewed Claude workflow systems with source verification, external apply links, and private D1-backed publication state.",
        applyUrl: "https://example.com/jobs/reviewed-ai-engineer",
      }),
    ).toMatchObject({
      slug: "reviewed-ai-engineer",
      status: "pending_review",
      tier: "free",
      sourceKind: "employer_submitted",
    });

    expect(() =>
      apiRouteDefinitions["adminJobs.upsert"].bodySchema?.parse({
        slug: "thin-sponsored-role",
        title: "Thin Sponsored Role",
        companyName: "Example Co",
        summary: "Too short.",
        applyUrl: "https://example.com/jobs/thin-sponsored-role",
        tier: "sponsored",
        status: "active",
      }),
    ).toThrow(/paid active jobs require/);

    expect(
      apiRouteDefinitions["adminJobs.upsert"].bodySchema?.parse({
        slug: "reviewed-sponsored-role",
        title: "Reviewed Sponsored Role",
        companyName: "Example Co",
        summary:
          "Build Claude-native developer workflow infrastructure for teams shipping production AI systems, with strong ownership over integrations and product quality.",
        descriptionMd:
          "Own the public-facing role detail for a paid HeyClaude listing. This description explains the team context, product surface, AI workflow responsibilities, developer tooling expectations, source verification, and why the role matters to the Claude and MCP ecosystem. It is intentionally long enough to support useful search snippets and truthful JobPosting structured data.",
        employmentType: "Full-time",
        compensationSummary: "$150K – $190K",
        benefits: ["Health benefits", "Remote work"],
        responsibilities: [
          "Build production integrations for Claude and MCP developer workflows.",
          "Partner with product and customer teams to prioritize high-signal automation work.",
          "Maintain source-verified listing details as the role evolves.",
        ],
        requirements: [
          "Professional TypeScript or backend engineering experience.",
          "Comfort working with LLM applications and developer tooling.",
          "Strong written communication for technical product surfaces.",
        ],
        applyUrl: "https://example.com/jobs/reviewed-sponsored-role",
        sourceUrl: "https://example.com/jobs/reviewed-sponsored-role",
        postedAt: "2026-04-28",
        expiresAt: "2026-05-28",
        sourceCheckedAt: "2026-04-28",
        tier: "sponsored",
        status: "active",
      }),
    ).toMatchObject({
      slug: "reviewed-sponsored-role",
      status: "active",
      tier: "sponsored",
    });
  });
});

describe("in-memory fallback rate limiter", () => {
  function fallbackRequest(ip: string) {
    return new Request("https://heyclau.de/api/registry/search", {
      headers: {
        origin: "https://heyclau.de",
        "cf-connecting-ip": ip,
      },
    });
  }

  async function loadRateLimiter() {
    const mod = await import("@/lib/api-security");
    mod.__rateLimitTestHooks.reset();
    return mod;
  }

  beforeEach(() => {
    vi.useRealTimers();
  });

  it("blocks after the configured limit within the window", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const { isRateLimited } = await loadRateLimiter();

    const check = () =>
      isRateLimited({
        request: fallbackRequest("203.0.113.10"),
        scope: "test",
        limit: 2,
        windowMs: 60_000,
      });

    expect(check()).toBe(false);
    expect(check()).toBe(false);
    expect(check()).toBe(true);
  });

  it("allows requests again after the window resets", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const { isRateLimited } = await loadRateLimiter();

    const check = () =>
      isRateLimited({
        request: fallbackRequest("203.0.113.11"),
        scope: "test",
        limit: 1,
        windowMs: 60_000,
      });

    expect(check()).toBe(false);
    expect(check()).toBe(true);

    vi.setSystemTime(60_001);
    expect(check()).toBe(false);
  });

  it("prunes expired buckets when new keys arrive", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const { isRateLimited, __rateLimitTestHooks } = await loadRateLimiter();

    for (let i = 0; i < 5; i += 1) {
      isRateLimited({
        request: fallbackRequest(`198.51.100.${i}`),
        scope: "test",
        limit: 5,
        windowMs: 1_000,
      });
    }
    expect(__rateLimitTestHooks.size()).toBe(5);

    // Advance past every bucket's reset, then touch a single new key. The
    // pruning pass should reclaim all five stale buckets, leaving only the new
    // one behind.
    vi.setSystemTime(2_000);
    isRateLimited({
      request: fallbackRequest("198.51.100.200"),
      scope: "test",
      limit: 5,
      windowMs: 1_000,
    });
    expect(__rateLimitTestHooks.size()).toBe(1);
  });

  it("caps live bucket growth by evicting the oldest keys", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const { isRateLimited, __rateLimitTestHooks } = await loadRateLimiter();
    const cap = __rateLimitTestHooks.maxBuckets;

    // Use a never-expiring window so no key ages out; growth must be bounded
    // purely by the oldest-first eviction cap.
    for (let i = 0; i < cap + 50; i += 1) {
      isRateLimited({
        request: fallbackRequest(`10.0.${Math.floor(i / 256)}.${i % 256}`),
        scope: "test",
        limit: 5,
        windowMs: 60 * 60 * 1000,
      });
    }

    expect(__rateLimitTestHooks.size()).toBeLessThanOrEqual(cap);
  });
});
