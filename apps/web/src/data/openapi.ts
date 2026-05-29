import { listApiRouteDefinitions } from "@/lib/api/contracts";

export interface OpenApiParam {
  name: string;
  in: "query" | "path" | "header";
  required?: boolean;
  type: "string" | "number" | "boolean";
  description?: string;
  example?: string;
  enumValues?: string[];
}

export interface OpenApiEndpoint {
  id: string;
  method: "GET" | "POST" | "PATCH";
  path: string;
  tag: string;
  summary: string;
  description: string;
  parameters?: OpenApiParam[];
  body?: { contentType: string; example: string; description?: string };
  responseExample: string;
  sampleResponse: unknown;
  curlExtra?: string;
  liveRequest?: boolean;
}

const TAG_BLURBS: Record<string, string> = {
  Registry: "Search, trending, manifest, integrity, diff",
  Entries: "Per-entry payloads and LLM text",
  Dynamic: "Votes, signals, intent events, GitHub stats",
  Submissions: "Preflight, issue creation, and public queue status",
  Commercial: "Lead intake for jobs, tools, claims, and sponsorship",
  Jobs: "Public reviewed jobs board API",
  MCP: "Streamable HTTP MCP transport",
  Distribution: "Generated registry package downloads",
  Newsletter: "Newsletter subscribe and webhook endpoints",
  Admin: "Token-protected maintainer administration",
};

const TAG_ORDER = [
  "Registry",
  "Entries",
  "Dynamic",
  "Submissions",
  "Commercial",
  "Jobs",
  "MCP",
  "Distribution",
  "Newsletter",
  "Admin",
];

function tagId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export const OPENAPI_TAGS = TAG_ORDER.map((tag) => ({
  id: tagId(tag),
  label: tag,
  blurb: TAG_BLURBS[tag] ?? `${tag} endpoints`,
}));

function paramsFromPath(path: string): OpenApiParam[] {
  const params = [...path.matchAll(/\{([^}]+)\}/g)].map((match) => ({
    name: match[1],
    in: "path" as const,
    required: true,
    type: "string" as const,
    example: exampleForPathParam(match[1], path),
  }));
  return params;
}

function exampleForPathParam(name: string, path: string) {
  if (name === "category") return path.includes("/data/feeds/") ? "skills" : "tools";
  if (name === "slug") return "aider";
  if (name === "platform") return "claude";
  if (name === "kind") return "icon";
  if (name === "domain") return "anthropic.com";
  return "example";
}

const QUERY_PARAM_EXAMPLES: Record<string, OpenApiParam[]> = {
  "registry.search": [
    {
      name: "q",
      in: "query",
      type: "string",
      description: "Search query.",
      example: "mcp",
    },
    {
      name: "limit",
      in: "query",
      type: "number",
      description: "Maximum result count.",
      example: "5",
    },
  ],
  "registry.trending": [
    {
      name: "limit",
      in: "query",
      type: "number",
      description: "Maximum result count.",
      example: "5",
    },
  ],
  "registry.diff": [
    {
      name: "limit",
      in: "query",
      type: "number",
      description: "Maximum changelog event count.",
      example: "10",
    },
  ],
  "registry.integrity": [
    {
      name: "artifact",
      in: "query",
      type: "string",
      description: "Optional artifact path from the registry manifest.",
      example: "directory-index.json",
    },
  ],
  "submissions.queue": [
    {
      name: "limit",
      in: "query",
      type: "number",
      description: "Maximum issue count.",
      example: "10",
    },
  ],
  download: [
    {
      name: "category",
      in: "query",
      type: "string",
      description: "Entry category.",
      example: "skills",
    },
    {
      name: "slug",
      in: "query",
      type: "string",
      description: "Entry slug.",
      example: "agent-evals-regression-gate",
    },
  ],
  "jobs.list": [
    {
      name: "limit",
      in: "query",
      type: "number",
      description: "Maximum job count.",
      example: "10",
    },
  ],
  "communitySignals.read": [
    {
      name: "target",
      in: "query",
      type: "string",
      description: "Entry key or tool target.",
      example: "tools:aider",
    },
  ],
  "og.render": [
    {
      name: "title",
      in: "query",
      type: "string",
      description: "Preview title.",
      example: "HeyClaude",
    },
  ],
};

function paramsFor(definition: ReturnType<typeof listApiRouteDefinitions>[number]) {
  return [...paramsFromPath(definition.path), ...(QUERY_PARAM_EXAMPLES[definition.id] ?? [])];
}

function canTryLive(definition: ReturnType<typeof listApiRouteDefinitions>[number]) {
  if (definition.method !== "GET") return false;
  if (definition.tags.includes("Admin")) return false;
  if (definition.responseContentType === "image/png") return false;
  if (definition.responseContentType === "application/octet-stream") return false;
  if (definition.id === "brandAsset.read") return false;
  if (definition.id === "download") return false;
  return true;
}

function bodyExample(id: string) {
  if (id === "submissions.create" || id === "submissions.preflight") {
    return JSON.stringify(
      {
        fields: {
          name: "Example MCP Server",
          slug: "example-mcp-server",
          category: "mcp",
          github_url: "https://github.com/example/example-mcp",
          description: "A source-backed MCP server for a specific workflow.",
          card_description: "Source-backed MCP server.",
          install_command: "npx -y @example/mcp",
          usage_snippet: "Add the server to your Claude config.",
          safety_notes: "Runs a local MCP server process.",
          privacy_notes: "May send configured tool inputs to the upstream service.",
        },
      },
      null,
      2,
    );
  }
  if (id === "listingLeads.create") {
    return JSON.stringify(
      {
        kind: "claim",
        tierInterest: "free",
        contactName: "Maintainer",
        contactEmail: "maintainer@example.com",
        companyName: "Example",
        listingTitle: "Example MCP Server",
        websiteUrl: "https://example.com",
        message: "Claim proof and context.",
      },
      null,
      2,
    );
  }
  if (id === "newsletter.subscribe") {
    return JSON.stringify({ email: "reader@example.com", source: "api-docs" }, null, 2);
  }
  if (id === "votes.toggle") {
    return JSON.stringify(
      { key: "mcp:github-mcp-server", clientId: "anon-client-1234", vote: true },
      null,
      2,
    );
  }
  if (id === "mcp") {
    return JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }, null, 2);
  }
  return JSON.stringify({}, null, 2);
}

function sampleResponse(id: string) {
  if (id === "submissions.queue") {
    return {
      ok: true,
      generatedAt: "2026-05-28T00:00:00.000Z",
      repo: "JSONbored/awesome-claude",
      count: 1,
      entries: [
        {
          number: 123,
          url: "https://github.com/JSONbored/awesome-claude/issues/123",
          title: "Submit MCP Server: Example",
          author: "contributor",
          category: "mcp",
          slug: "example",
          status: "in_review",
          state: "open",
          labels: ["content-submission", "needs-review", "community-mcp"],
          blockers: [],
          updatedAt: "2026-05-28T00:00:00Z",
          createdAt: "2026-05-28T00:00:00Z",
        },
      ],
    };
  }
  if (id.includes("registry.search")) {
    return {
      results: [{ category: "mcp", slug: "github-mcp-server", title: "GitHub MCP Server" }],
      facets: {},
      pagination: { limit: 20, offset: 0, total: 1 },
    };
  }
  if (id.includes("registry.manifest")) {
    return { generatedAt: "2026-05-28T00:00:00Z", artifacts: [] };
  }
  if (id === "listingLeads.create" || id === "newsletter.subscribe") {
    return { ok: true };
  }
  return { ok: true };
}

function endpointId(id: string) {
  return id.replaceAll(".", "-");
}

export const ENDPOINTS: OpenApiEndpoint[] = listApiRouteDefinitions().map((definition) => {
  const tag = definition.tags[0] ?? "Registry";
  const body = definition.bodySchema
    ? {
        contentType: "application/json",
        example: bodyExample(definition.id),
      }
    : undefined;
  const sample = sampleResponse(definition.id);
  return {
    id: endpointId(definition.id),
    method: definition.method,
    path: definition.path,
    tag: tagId(tag),
    summary: definition.summary,
    description: definition.description ?? definition.summary,
    parameters: paramsFor(definition),
    body,
    responseExample: JSON.stringify(sample, null, 2),
    sampleResponse: sample,
    liveRequest: canTryLive(definition),
  };
});

export function getEndpoint(id: string) {
  return ENDPOINTS.find((e) => e.id === id);
}
