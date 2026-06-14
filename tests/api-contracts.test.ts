import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

import { ENDPOINTS, OPENAPI_TAGS } from "../apps/web/src/data/openapi";
import { listApiRouteDefinitions } from "../apps/web/src/lib/api/contracts";
import { repoRoot } from "./helpers/registry-fixtures";

function findRouteFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findRouteFiles(entryPath);
    return /\.tsx?$/.test(entry.name) ? [entryPath] : [];
  });
}

const apiRoutes = [
  "/api/registry/manifest",
  "/api/registry/categories",
  "/api/registry/search",
  "/api/registry/feed",
  "/api/registry/trending",
  "/api/registry/diff",
  "/api/registry/integrity",
  "/api/registry/entries/{category}/{slug}",
  "/api/registry/entries/{category}/{slug}/llms",
  "/api/mcp",
  "/api/brand-assets/{kind}/{domain}",
  "/api/votes/query",
  "/api/votes/toggle",
  "/api/newsletter/subscribe",
  "/api/newsletter/webhook",
  "/api/public/newsletter/confirm",
  "/api/og",
  "/api/submissions/preflight",
  "/api/download",
  "/api/jobs",
  "/api/jobs/{slug}",
  "/api/listing-leads",
  "/api/admin/listing-leads",
  "/api/admin/jobs",
  "/api/admin/jobs/health",
  "/api/intent-events",
  "/api/community-signals",
  "/api/community-signals/query",
  "/api/github-stats",
  "/api/public/alerts",
  "/api/public/feeds/health",
  "/feed.xml",
  "/atom.xml",
  "/data/feeds/index.json",
  "/data/feeds/categories/{category}.json",
  "/data/feeds/platforms/{platform}.json",
];

describe("OpenAPI route coverage", () => {
  const schema = fs.readFileSync(
    path.join(repoRoot, "cloudflare/api-schema-heyclaude-openapi.yaml"),
    "utf8",
  );
  const publicYamlSchema = fs.readFileSync(
    path.join(repoRoot, "apps/web/public/openapi.yaml"),
    "utf8",
  );
  const publicJsonSchema = JSON.parse(
    fs.readFileSync(
      path.join(repoRoot, "apps/web/public/openapi.json"),
      "utf8",
    ),
  ) as { openapi?: string; paths?: Record<string, unknown> };
  const parsedSchema = parse(schema) as {
    paths: Record<
      string,
      {
        get?: {
          description?: string;
          parameters?: Array<{ name?: string; in?: string }>;
          responses?: Record<string, { content?: Record<string, unknown> }>;
        };
        post?: unknown;
        patch?: unknown;
      }
    >;
    components?: {
      schemas?: Record<string, { properties?: Record<string, unknown> }>;
    };
  };
  const parsedPublicYamlSchema = parse(publicYamlSchema) as {
    openapi?: string;
    paths?: Record<string, unknown>;
  };

  it("documents every public and limited dynamic API route", () => {
    for (const route of apiRoutes) {
      expect(schema, route).toContain(`${route}:`);
    }

    expect(
      [...new Set(listApiRouteDefinitions().map((route) => route.path))].sort(),
    ).toEqual(apiRoutes.toSorted());
  });

  it("publishes static OpenAPI JSON and YAML assets for the docs surface", () => {
    expect(parsedPublicYamlSchema.openapi).toBe("3.1.0");
    expect(Object.keys(parsedPublicYamlSchema.paths ?? {}).sort()).toEqual(
      Object.keys(parsedSchema.paths).sort(),
    );
    expect(publicJsonSchema.openapi).toBe("3.1.0");
    expect(Object.keys(publicJsonSchema.paths ?? {}).sort()).toEqual(
      Object.keys(parsedSchema.paths).sort(),
    );
  });

  it("renders every documented endpoint tag in the Atlas API docs data", () => {
    const documentedEndpointIds = new Set(
      ENDPOINTS.map((endpoint) => endpoint.id),
    );
    const renderedTagIds = new Set(OPENAPI_TAGS.map((tag) => tag.id));

    for (const route of listApiRouteDefinitions()) {
      expect(documentedEndpointIds, route.id).toContain(
        route.id.replaceAll(".", "-"),
      );
      for (const tag of route.tags) {
        expect(renderedTagIds, `${route.id}:${tag}`).toContain(
          tag.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        );
      }
    }

    expect(
      ENDPOINTS.find((endpoint) => endpoint.id === "registry-search"),
    ).toMatchObject({
      liveRequest: true,
      parameters: expect.arrayContaining([
        expect.objectContaining({ name: "q", in: "query", example: "mcp" }),
        expect.objectContaining({ name: "limit", in: "query", example: "5" }),
      ]),
    });
    expect(
      ENDPOINTS.find((endpoint) => endpoint.id === "submissions-preflight"),
    ).toMatchObject({
      liveRequest: false,
    });
    expect(
      ENDPOINTS.find((endpoint) => endpoint.id === "jobs-detail"),
    ).toMatchObject({
      liveRequest: true,
      parameters: expect.arrayContaining([
        expect.objectContaining({ name: "slug", in: "path" }),
      ]),
    });
  });

  it("keeps API docs examples tied to known contracts and real client paths", () => {
    const routeIds = new Set(
      listApiRouteDefinitions().map((route) => route.id.replaceAll(".", "-")),
    );
    for (const endpoint of ENDPOINTS) {
      expect(routeIds, endpoint.id).toContain(endpoint.id);
      expect(endpoint.responseExample, endpoint.id).not.toBe(
        JSON.stringify({ ok: true }, null, 2),
      );
      expect(endpoint.responseExample, endpoint.id).not.toContain("heyclaude.");
      expect(endpoint.responseExample, endpoint.id).not.toContain(
        "raycast://extensions/jsonbored/heyclaude/",
      );
    }

    const search = ENDPOINTS.find(
      (endpoint) => endpoint.id === "registry-search",
    );
    expect(search?.clientExamples).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Raycast",
          code: "raycast://extensions/jsonbored/heyclaude/search",
        }),
        expect.objectContaining({ label: "MCP" }),
      ]),
    );
  });

  it("keeps route handlers as central-router adapters", () => {
    const routeFiles = findRouteFiles(
      path.join(repoRoot, "apps/web/src/routes/api"),
    ).filter((filePath) => !filePath.includes(`${path.sep}public${path.sep}`));

    expect(routeFiles.length).toBeGreaterThan(0);
    for (const filePath of routeFiles) {
      const source = fs.readFileSync(filePath, "utf8");
      if (filePath.endsWith(`${path.sep}api${path.sep}mcp.ts`)) {
        expect(source, filePath).toContain(
          'getApiRouteDefinition("mcp.streamable")',
        );
        expect(source, filePath).toContain(
          "WebStandardStreamableHTTPServerTransport",
        );
        expect(source, filePath).not.toContain("NextResponse");
        continue;
      }
      expect(source, filePath).toContain("createApiHandler");
      expect(source, filePath).not.toContain("NextResponse");
      expect(source, filePath).not.toContain("isAllowedOrigin");
      expect(source, filePath).not.toContain("hasBodyWithinLimit");
      expect(source, filePath).not.toContain("isRateLimited");
    }
  });

  it("keeps registry publishing out of the public API", () => {
    expect(schema).not.toContain("/api/registry/publish:");
    expect(schema).not.toContain("/api/submissions/import:");
    expect(schema).toContain("Token-protected lead review/export endpoint");
    expect(schema).toContain("Token-protected reviewed jobs list");
  });

  it("documents D1-backed failure modes for dynamic-state endpoints", () => {
    expect(schema).toContain("Site DB not configured");
    expect(schema).toContain("D1 insert failed");
    expect(schema).toContain("status transition");
  });

  it("documents platform-aware search and social preview generation", () => {
    expect(parsedSchema.paths["/api/registry/search"]?.get?.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "platform", in: "query" }),
        expect.objectContaining({ name: "hasSafetyNotes", in: "query" }),
        expect.objectContaining({ name: "downloadTrust", in: "query" }),
        expect.objectContaining({ name: "claimStatus", in: "query" }),
        expect.objectContaining({ name: "offset", in: "query" }),
      ]),
    );
    expect(
      parsedSchema.paths["/api/registry/feed"]?.get?.description,
    ).toContain("category and platform shards");
    expect(
      parsedSchema.paths["/api/og"]?.get?.responses?.["200"]?.content,
    ).toHaveProperty("image/png");
    expect(
      parsedSchema.paths["/feed.xml"]?.get?.responses?.["200"]?.content,
    ).toHaveProperty("application/rss+xml");
    expect(
      parsedSchema.paths["/atom.xml"]?.get?.responses?.["200"]?.content,
    ).toHaveProperty("application/atom+xml");
  });

  it("documents facet counts on the registry search response", () => {
    const searchResponse =
      parsedSchema.paths["/api/registry/search"]?.get?.responses?.["200"];
    const jsonContent = (
      searchResponse?.content as
        | Record<string, { schema?: unknown }>
        | undefined
    )?.["application/json"];
    const responseSchema = jsonContent?.schema as
      | {
          properties?: {
            facets?: {
              type?: string;
              properties?: Record<string, unknown>;
            };
          };
        }
      | undefined;

    expect(responseSchema?.properties?.facets?.type).toBe("object");
    expect(
      Object.keys(responseSchema?.properties?.facets?.properties ?? {}),
    ).toEqual(
      expect.arrayContaining([
        "categories",
        "platforms",
        "hasSafetyNotes",
        "hasPrivacyNotes",
        "downloadTrust",
        "claimStatus",
        "sourceStatus",
      ]),
    );
  });

  it("documents richer public job filters and pagination cursor", () => {
    expect(parsedSchema.paths["/api/jobs"]?.get?.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "location", in: "query" }),
        expect.objectContaining({ name: "type", in: "query" }),
        expect.objectContaining({ name: "sourceKind", in: "query" }),
        expect.objectContaining({ name: "compensation", in: "query" }),
        expect.objectContaining({ name: "claimedEmployer", in: "query" }),
        expect.objectContaining({ name: "postedAfter", in: "query" }),
        expect.objectContaining({ name: "offset", in: "query" }),
      ]),
    );
  });

  it("documents registry search pagination metadata", () => {
    const searchResponse =
      parsedSchema.paths["/api/registry/search"]?.get?.responses?.["200"];
    const jsonContent = (
      searchResponse?.content as
        | Record<string, { schema?: unknown }>
        | undefined
    )?.["application/json"];
    const responseSchema = jsonContent?.schema as
      | {
          required?: string[];
          properties?: Record<string, { type?: string | string[] }>;
        }
      | undefined;

    expect(responseSchema?.required).toEqual(
      expect.arrayContaining(["total", "limit", "offset", "nextOffset"]),
    );
    expect(responseSchema?.properties?.total?.type).toBe("integer");
    expect(responseSchema?.properties?.limit?.type).toBe("integer");
    expect(responseSchema?.properties?.offset?.type).toBe("integer");
    expect(responseSchema?.properties?.nextOffset?.type).toEqual([
      "integer",
      "null",
    ]);
  });

  it("documents concrete registry trending response metadata", () => {
    const trendingResponse =
      parsedSchema.paths["/api/registry/trending"]?.get?.responses?.["200"];
    const responseSchema = (
      trendingResponse?.content as
        | Record<string, { schema?: { $ref?: string } }>
        | undefined
    )?.["application/json"]?.schema;
    const component = parsedSchema.components?.schemas?.RegistryTrendingResponse
      ?.properties as
      | Record<
          string,
          { maxItems?: number; minimum?: number; maximum?: number }
        >
      | undefined;

    expect(responseSchema?.$ref).toBe(
      "#/components/schemas/RegistryTrendingResponse",
    );
    expect(component?.limit?.minimum).toBe(1);
    expect(component?.limit?.maximum).toBe(50);
    expect(component?.entries?.maxItems).toBe(50);
  });

  it("documents error envelopes, cacheable feeds, and registry trust signals", () => {
    expect(schema).toContain("ErrorEnvelope:");
    expect(schema).toContain("RegistryTrustSignals:");
    expect(schema).toContain("trustSignals");
    expect(schema).toContain("packageChecksum");
    expect(schema).toContain("lastVerifiedAt");
    expect(schema).toContain("adapterGenerated");
    expect(schema).toContain("RSS, changelog, category feeds, platform feeds");
  });
});
