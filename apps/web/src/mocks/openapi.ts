/**
 * Minimal subset of an OpenAPI 3.1 spec for the public HeyClaude API.
 * Drives the in-app `/api-docs` renderer and the playground.
 */

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
  method: "GET" | "POST";
  path: string;
  tag: string;
  summary: string;
  description: string;
  parameters?: OpenApiParam[];
  body?: { contentType: string; example: string; description?: string };
  responseExample: string;
  mockResponse: unknown;
  curlExtra?: string;
}

export const OPENAPI_TAGS = [
  { id: "registry", label: "Registry", blurb: "Search, trending, manifest, integrity, diff" },
  { id: "entries", label: "Entries", blurb: "Per-entry payloads + LLM text" },
  { id: "community", label: "Community", blurb: "Votes, signals, intent events" },
  { id: "submissions", label: "Submissions", blurb: "Preflight + draft validation" },
  { id: "jobs", label: "Jobs", blurb: "Public jobs board API" },
  { id: "mcp", label: "MCP", blurb: "Streamable HTTP MCP transport" },
] as const;

export const ENDPOINTS: OpenApiEndpoint[] = [
  {
    id: "registry-search",
    method: "GET",
    path: "/api/registry/search",
    tag: "registry",
    summary: "Full-text + faceted registry search",
    description:
      "Search across title, description, tags, keywords, author, and platform. Returns results, facets, and a pagination cursor. Cached for 60s.",
    parameters: [
      { name: "q", in: "query", type: "string", required: false, description: "Query string", example: "postgres" },
      { name: "category", in: "query", type: "string", description: "Filter by category", enumValues: ["agents", "mcp", "skills", "commands", "hooks", "rules", "guides", "collections", "statuslines", "tools"] },
      { name: "platform", in: "query", type: "string", description: "Filter by platform", enumValues: ["claude-code", "claude-desktop", "cursor", "windsurf", "codex", "gemini"] },
      { name: "downloadTrust", in: "query", type: "string", description: "Filter by download trust", enumValues: ["first-party", "external", "unverified"] },
      { name: "limit", in: "query", type: "number", example: "20" },
      { name: "offset", in: "query", type: "number", example: "0" },
    ],
    responseExample: `{
  "results": [
    {
      "category": "mcp",
      "slug": "postgres-mcp",
      "title": "Postgres MCP",
      "trust": "trusted",
      "source": "first-party"
    }
  ],
  "facets": { "category": { "mcp": 14, "skills": 9 } },
  "cursor": { "limit": 20, "offset": 0, "total": 1 }
}`,
    mockResponse: {
      results: [{ category: "mcp", slug: "postgres-mcp", title: "Postgres MCP", trust: "trusted", source: "first-party" }],
      facets: { category: { mcp: 14, skills: 9 } },
      cursor: { limit: 20, offset: 0, total: 1 },
    },
  },
  {
    id: "registry-trending",
    method: "GET",
    path: "/api/registry/trending",
    tag: "registry",
    summary: "Trending entries (votes + signals + intent)",
    description:
      "Ranked by composite `communityDiscoveryScore`. Each result includes `reasonCodes` explaining why it ranks.",
    parameters: [
      { name: "category", in: "query", type: "string" },
      { name: "limit", in: "query", type: "number", example: "10" },
    ],
    responseExample: `{
  "results": [
    { "category": "mcp", "slug": "postgres-mcp", "score": 0.92, "reasonCodes": ["first_party", "high_signal"] }
  ]
}`,
    mockResponse: {
      results: [{ category: "mcp", slug: "postgres-mcp", score: 0.92, reasonCodes: ["first_party", "high_signal"] }],
    },
  },
  {
    id: "registry-manifest",
    method: "GET",
    path: "/api/registry/manifest",
    tag: "registry",
    summary: "Registry manifest + artifact contracts",
    description: "Returns build timestamp, counts, and SHA-256 contracts for every public data file.",
    responseExample: `{
  "generatedAt": "2026-05-26T08:12:00Z",
  "counts": { "entries": 412 },
  "artifactContracts": [
    { "path": "/data/directory-index.json", "sha256": "a1f29c…b9d4" }
  ]
}`,
    mockResponse: {
      generatedAt: "2026-05-26T08:12:00Z",
      counts: { entries: 412 },
      artifactContracts: [{ path: "/data/directory-index.json", sha256: "a1f29c…b9d4" }],
    },
  },
  {
    id: "registry-integrity",
    method: "GET",
    path: "/api/registry/integrity",
    tag: "registry",
    summary: "Verify an artifact against its manifest hash",
    description: "Compares a client-supplied SHA-256 against the build-time manifest. Returns `match`, `mismatch`, or `unknown`.",
    parameters: [
      { name: "artifact", in: "query", required: true, type: "string", example: "/data/directory-index.json" },
      { name: "hash", in: "query", required: true, type: "string", example: "a1f29c…b9d4" },
    ],
    responseExample: `{ "status": "match", "expected": "a1f29c…b9d4" }`,
    mockResponse: { status: "match", expected: "a1f29c…b9d4" },
  },
  {
    id: "registry-diff",
    method: "GET",
    path: "/api/registry/diff",
    tag: "registry",
    summary: "Incremental changelog diff",
    description: "Returns added / updated / removed entries since a cursor (date or hash).",
    parameters: [
      { name: "since", in: "query", type: "string", example: "2026-05-20" },
      { name: "hash", in: "query", type: "string" },
    ],
    responseExample: `{
  "added": [{ "ref": "mcp/postgres-mcp", "hash": "a1f2…b9" }],
  "updated": [],
  "removed": []
}`,
    mockResponse: { added: [{ ref: "mcp/postgres-mcp", hash: "a1f2…b9" }], updated: [], removed: [] },
  },
  {
    id: "entries-detail",
    method: "GET",
    path: "/api/registry/entries/{category}/{slug}",
    tag: "entries",
    summary: "Full entry payload",
    description: "Returns the complete entry JSON for the given category and slug.",
    parameters: [
      { name: "category", in: "path", required: true, type: "string", example: "mcp" },
      { name: "slug", in: "path", required: true, type: "string", example: "postgres-mcp" },
    ],
    responseExample: `{
  "category": "mcp",
  "slug": "postgres-mcp",
  "title": "Postgres MCP",
  "installCommand": "npx -y @modelcontextprotocol/server-postgres …",
  "trust": "trusted",
  "source": "first-party"
}`,
    mockResponse: {
      category: "mcp",
      slug: "postgres-mcp",
      title: "Postgres MCP",
      installCommand: "npx -y @modelcontextprotocol/server-postgres …",
      trust: "trusted",
      source: "first-party",
    },
  },
  {
    id: "entries-llms",
    method: "GET",
    path: "/api/registry/entries/{category}/{slug}/llms",
    tag: "entries",
    summary: "LLM-friendly text export",
    description: "Same content as `/<category>/<slug>/llms.txt` — returns `text/plain`.",
    parameters: [
      { name: "category", in: "path", required: true, type: "string", example: "mcp" },
      { name: "slug", in: "path", required: true, type: "string", example: "postgres-mcp" },
    ],
    responseExample: `# Postgres MCP
A read-only Postgres bridge for Claude…`,
    mockResponse: "# Postgres MCP\nA read-only Postgres bridge for Claude…",
  },
  {
    id: "votes-toggle",
    method: "POST",
    path: "/api/votes/toggle",
    tag: "community",
    summary: "Toggle an upvote",
    description: "Anonymous, client-ID gated. Persisted to Cloudflare D1.",
    body: {
      contentType: "application/json",
      description: "Toggle payload",
      example: `{
  "key": "mcp:postgres-mcp",
  "clientId": "anon-abc123",
  "vote": true
}`,
    },
    responseExample: `{ "key": "mcp:postgres-mcp", "count": 613, "voted": true }`,
    mockResponse: { key: "mcp:postgres-mcp", count: 613, voted: true },
  },
  {
    id: "community-signals",
    method: "POST",
    path: "/api/community-signals",
    tag: "community",
    summary: "Record a community signal",
    description: "`used` | `works` | `broken` signals per target.",
    body: {
      contentType: "application/json",
      example: `{
  "targetKind": "entry",
  "targetKey": "entry:mcp/postgres-mcp",
  "signalType": "works",
  "clientId": "anon-abc123",
  "active": true
}`,
    },
    responseExample: `{ "ok": true, "counts": { "used": 1820, "works": 981, "broken": 18 } }`,
    mockResponse: { ok: true, counts: { used: 1820, works: 981, broken: 18 } },
  },
  {
    id: "submissions-preflight",
    method: "POST",
    path: "/api/submissions/preflight",
    tag: "submissions",
    summary: "Pre-validate a submission draft",
    description: "Runs schema validation, risk analysis, duplicate detection, and notes gate.",
    body: {
      contentType: "application/json",
      example: `{
  "category": "mcp",
  "name": "Example MCP",
  "slug": "example-mcp",
  "source_url": "https://github.com/acme/example-mcp",
  "install_command": "npx -y @acme/example-mcp",
  "usage_snippet": "{ ... }",
  "safety_notes": ["Read-only by default."],
  "privacy_notes": ["Logs queries locally."]
}`,
    },
    responseExample: `{
  "blockers": [],
  "warnings": [],
  "duplicates": [],
  "fallbackUrl": "https://github.com/jsonbored/awesome-claude/issues/new?…",
  "issueDraft": "## Example MCP\\n\\n…"
}`,
    mockResponse: {
      blockers: [],
      warnings: [],
      duplicates: [],
      fallbackUrl: "https://github.com/jsonbored/awesome-claude/issues/new?template=submission.yml",
      issueDraft: "## Example MCP\n\nReady to import.",
    },
  },
  {
    id: "jobs-list",
    method: "GET",
    path: "/api/jobs",
    tag: "jobs",
    summary: "Public jobs listing",
    description: "Search across title, company, location, description, type, compensation.",
    parameters: [
      { name: "q", in: "query", type: "string" },
      { name: "tier", in: "query", type: "string", enumValues: ["free", "standard", "featured", "sponsored"] },
      { name: "remote", in: "query", type: "string", enumValues: ["true", "false", "all"] },
      { name: "limit", in: "query", type: "number", example: "20" },
    ],
    responseExample: `{
  "results": [
    { "slug": "anthropic-staff-engineer-claude-code", "title": "Staff Engineer, Claude Code Platform", "company": "Anthropic" }
  ]
}`,
    mockResponse: { results: [{ slug: "anthropic-staff-engineer-claude-code", title: "Staff Engineer, Claude Code Platform", company: "Anthropic" }] },
  },
  {
    id: "mcp-endpoint",
    method: "POST",
    path: "/api/mcp",
    tag: "mcp",
    summary: "Streamable HTTP MCP transport",
    description: "Remote MCP endpoint backed by `@heyclaude/mcp`. JSON-RPC 2.0 over HTTP. Use the stdio package for local clients.",
    body: {
      contentType: "application/json",
      example: `{ "jsonrpc": "2.0", "id": 1, "method": "tools/list" }`,
    },
    responseExample: `{ "jsonrpc": "2.0", "id": 1, "result": { "tools": [{ "name": "search_registry" }] } }`,
    mockResponse: { jsonrpc: "2.0", id: 1, result: { tools: [{ name: "search_registry" }, { name: "get_entry_detail" }, { name: "explain_entry_trust" }] } },
  },
];

export function getEndpoint(id: string) {
  return ENDPOINTS.find((e) => e.id === id);
}
