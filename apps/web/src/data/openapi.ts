import { listApiRouteDefinitions, type ApiRouteId } from "@/lib/api/contracts";

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
  clientExamples?: Array<{ label: string; code: string }>;
}

const TAG_BLURBS: Record<string, string> = {
  Registry: "Search, trending, manifest, integrity, diff",
  Entries: "Per-entry payloads and LLM text",
  Dynamic: "Votes, signals, intent events, GitHub stats",
  Submissions: "Read-only submission preflight for PR-first intake",
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
  if (name === "report") return "agent-skills.json";
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

const BODY_EXAMPLES: Partial<Record<ApiRouteId, unknown>> = {
  "mcp.streamable": { jsonrpc: "2.0", id: 1, method: "tools/list", params: {} },
  "votes.query": { keys: ["mcp:github-mcp-server"], clientId: "anon-client-1234" },
  "votes.toggle": { key: "mcp:github-mcp-server", clientId: "anon-client-1234", vote: true },
  "newsletter.subscribe": { email: "reader@example.com", source: "api-docs" },
  "newsletter.webhook": { type: "contact.created", data: { email: "reader@example.com" } },
  "submissions.preflight": {
    fields: {
      name: "Example MCP Server",
      slug: "example-mcp-server",
      category: "mcp",
      github_url: "https://github.com/example/example-mcp",
      description: "A source-backed MCP server for a specific workflow.",
    },
  },
  "listingLeads.create": {
    kind: "claim",
    tierInterest: "free",
    contactName: "Maintainer",
    contactEmail: "maintainer@example.com",
    companyName: "Example",
    listingTitle: "Example MCP Server",
    websiteUrl: "https://example.com",
    message: "Claim proof and context.",
  },
  "adminListingLeads.update": { id: "lead_123", status: "pending_review" },
  "adminJobs.upsert": {
    slug: "example-ai-platform-engineer",
    title: "AI Platform Engineer",
    companyName: "Example Co",
    locationText: "Remote",
    applyUrl: "https://example.com/jobs/ai-platform-engineer",
    status: "pending_review",
    sourceKind: "employer_careers",
  },
  "adminJobs.update": { id: "job_123", status: "stale_pending_review" },
  "intentEvents.create": {
    targetKey: "mcp:github-mcp-server",
    eventName: "install_copy",
    source: "entry-detail",
  },
  "communitySignals.write": {
    targetKey: "mcp:github-mcp-server",
    signal: "used",
    clientId: "anon-client-1234",
  },
  "communitySignals.query": { targetKeys: ["mcp:github-mcp-server"] },
};

const RESPONSE_EXAMPLES: Partial<Record<ApiRouteId, unknown>> = {
  "reports.export": {
    report: "agent-skills",
    title: "State of Agent Skills 2026",
    asOf: "2026-06-20",
    total: 174,
    license: "CC BY 4.0",
    stats: [{ key: "total", label: "Total skills", value: 174 }],
    dimensions: [
      {
        key: "skill-type",
        title: "Skill type",
        rows: [{ label: "Capability pack", count: 110, percent: 63 }],
      },
    ],
  },
  "registry.manifest": {
    schemaVersion: 2,
    generatedAt: "2026-05-29T00:00:00.000Z",
    artifacts: { "directory-index.json": { sha256: "64-char-sha256", bytes: 12345 } },
  },
  "registry.categories": {
    schemaVersion: 1,
    count: 1,
    entries: [{ id: "mcp", label: "MCP servers", count: 42 }],
  },
  "registry.search": {
    schemaVersion: 1,
    query: "mcp",
    category: "",
    platform: "",
    count: 1,
    total: 1,
    limit: 20,
    offset: 0,
    nextOffset: null,
    results: [{ category: "mcp", slug: "github-mcp-server", title: "GitHub MCP Server" }],
    facets: {
      categories: { mcp: 1 },
      platforms: {},
      hasSafetyNotes: {},
      hasPrivacyNotes: {},
      downloadTrust: {},
      claimStatus: {},
      sourceStatus: {},
    },
  },
  "registry.feed": {
    schemaVersion: 1,
    kind: "registry-feed",
    qualityMethodology: "/quality#methodology",
    categoryFeeds: { mcp: "/data/feeds/categories/mcp.json" },
    platformFeeds: { claude: "/data/feeds/platforms/claude.json" },
    jobs: "/api/jobs?limit=100",
    endpoints: {
      qualityMethodology: "/quality#methodology",
      categoryFeed: "/data/feeds/categories/{category}.json",
      platformFeed: "/data/feeds/platforms/{platform}.json",
      jobs: "/api/jobs?limit=100",
    },
  },
  "registry.trending": {
    schemaVersion: 1,
    kind: "registry-trending",
    category: "",
    platform: "",
    limit: 3,
    count: 1,
    signalsAvailable: { votes: true, community: true, intent: true },
    entries: [
      {
        category: "mcp",
        slug: "github-mcp-server",
        title: "GitHub MCP Server",
        score: 12,
        reasons: ["recent usage signals"],
        platforms: ["claude-code"],
        tags: ["github"],
        dateAdded: "2026-05-01",
        trustSignals: { sourceStatus: "available" },
      },
    ],
  },
  "registry.diff": {
    schemaVersion: 1,
    count: 1,
    entries: [
      { key: "mcp/github-mcp-server", type: "updated", category: "mcp", slug: "github-mcp-server" },
    ],
  },
  "registry.integrity": {
    status: "snapshot",
    artifact: null,
    generatedAt: "2026-05-29T00:00:00.000Z",
  },
  "registry.entry": {
    schemaVersion: 1,
    key: "mcp:github-mcp-server",
    entry: { category: "mcp", slug: "github-mcp-server", title: "GitHub MCP Server" },
  },
  "registry.entryLlms": "# GitHub MCP Server\n\nMachine-readable entry text.",
  "mcp.streamable": { jsonrpc: "2.0", id: 1, result: { tools: [{ name: "registry.search" }] } },
  "brandAsset.read": "Binary image response.",
  "votes.query": {
    ok: true,
    votes: { "mcp:github-mcp-server": true },
    counts: { "mcp:github-mcp-server": 12 },
  },
  "votes.toggle": { ok: true, key: "mcp:github-mcp-server", voted: true, count: 12 },
  "newsletter.subscribe": { ok: true, subscribed: true },
  "newsletter.webhook": { ok: true, accepted: true },
  "submissions.preflight": {
    ok: true,
    valid: true,
    routeSuggestion: "submit_pr",
    prPreview: {
      title: "Add MCP Server: Example MCP Server",
      targetPath: "content/mcp/example-mcp-server.mdx",
      branchHint: "heyclaude/submit-mcp-example-mcp-server",
      baseRef: "main",
      body: "### Name\n\nExample MCP Server",
    },
    blockers: [],
    warnings: [],
  },
  download: "Binary package response.",
  "listingLeads.create": { ok: true, id: "lead_123", status: "new" },
  "jobs.list": {
    schemaVersion: 1,
    kind: "jobs-index",
    generatedAt: "2026-05-29T00:00:00.000Z",
    count: 1,
    total: 1,
    totalAvailable: 1,
    limit: 10,
    offset: 0,
    nextOffset: null,
    entries: [
      {
        slug: "example-ai-platform-engineer",
        title: "AI Platform Engineer",
        company: "Example Co",
        location: "Remote",
        description: "Build source-backed AI workflow infrastructure.",
        featured: false,
        applyUrl: "https://example.com/jobs/ai-platform-engineer",
        webUrl: "https://heyclau.de/jobs/example-ai-platform-engineer",
        labels: ["Remote"],
        sourceLabel: "Employer careers page",
        applySourceLabel: "External apply via employer site",
      },
    ],
  },
  "jobs.detail": {
    schemaVersion: 1,
    kind: "jobs-detail",
    slug: "example-ai-platform-engineer",
    generatedAt: "2026-05-29T00:00:00.000Z",
    entry: {
      slug: "example-ai-platform-engineer",
      title: "AI Platform Engineer",
      company: "Example Co",
      location: "Remote",
      description: "Build source-backed AI workflow infrastructure.",
      featured: false,
      applyUrl: "https://example.com/jobs/ai-platform-engineer",
      webUrl: "https://heyclau.de/jobs/example-ai-platform-engineer",
      labels: ["Remote"],
      sourceLabel: "Employer careers page",
      applySourceLabel: "External apply via employer site",
    },
    related: [],
  },
  "adminListingLeads.list": { ok: true, entries: [] },
  "adminListingLeads.update": { ok: true, status: "pending_review" },
  "adminJobs.list": { ok: true, entries: [] },
  "adminJobs.upsert": { ok: true, slug: "example-ai-platform-engineer" },
  "adminJobs.update": {
    ok: true,
    slug: "example-ai-platform-engineer",
    status: "stale_pending_review",
  },
  "adminJobs.health": { ok: true, requiredColumnsPresent: true, statusCounts: [] },
  "intentEvents.create": { ok: true, accepted: true },
  "communitySignals.read": { ok: true, target: "mcp:github-mcp-server", signals: {} },
  "communitySignals.write": { ok: true, accepted: true },
  "communitySignals.query": { ok: true, signals: {} },
  "githubStats.read": { ok: true, repo: "jsonbored/awesome-claude", stars: 123 },
  "publicAlerts.read": { ok: true, events: [] },
  "publicFeeds.health": { ok: true, feeds: [] },
  "static.rss": "RSS XML response.",
  "static.atom": "Atom XML response.",
  "static.feedIndex": { schemaVersion: 1, feeds: [] },
  "static.categoryFeed": { schemaVersion: 1, category: "skills", entries: [] },
  "static.platformFeed": { schemaVersion: 1, platform: "claude", entries: [] },
  "og.render": "PNG image response.",
};

const CLIENT_EXAMPLES: Partial<Record<ApiRouteId, Array<{ label: string; code: string }>>> = {
  "registry.search": [
    { label: "Raycast", code: "raycast://extensions/jsonbored/heyclaude/search" },
    { label: "MCP", code: "Use the registry.search tool from the HeyClaude MCP server." },
  ],
  "jobs.list": [
    { label: "Raycast", code: "raycast://extensions/jsonbored/heyclaude/jobs" },
    { label: "MCP resource", code: "heyclaude://jobs/active" },
  ],
  "mcp.streamable": [
    { label: "Streamable HTTP endpoint", code: "https://heyclau.de/api/mcp" },
    { label: "First tool to call", code: "tools/list, then registry.search or entry.detail" },
  ],
};

function bodyExample(id: ApiRouteId) {
  return JSON.stringify(
    BODY_EXAMPLES[id] ?? { schema: id, note: "See request schema above." },
    null,
    2,
  );
}

function sampleResponse(definition: ReturnType<typeof listApiRouteDefinitions>[number]) {
  return (
    RESPONSE_EXAMPLES[definition.id as ApiRouteId] ?? {
      schema: definition.responseSchemaName ?? "application/json",
      note: `Response shape is documented by the OpenAPI schema for ${definition.id}.`,
    }
  );
}

function endpointId(id: string) {
  return id.replaceAll(".", "-");
}

export const ENDPOINTS: OpenApiEndpoint[] = listApiRouteDefinitions().map((definition) => {
  const routeId = definition.id as ApiRouteId;
  const tag = definition.tags[0] ?? "Registry";
  const body = definition.bodySchema
    ? {
        contentType: "application/json",
        example: bodyExample(routeId),
      }
    : undefined;
  const sample = sampleResponse(definition);
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
    clientExamples: CLIENT_EXAMPLES[routeId],
  };
});

export function getEndpoint(id: string) {
  return ENDPOINTS.find((e) => e.id === id);
}
