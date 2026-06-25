import { describe, expect, it } from "vitest";

import { GET, OPTIONS, POST } from "../apps/web/src/routes/api/mcp";

function mcpRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://heyclau.de/api/mcp", {
    method: "POST",
    headers: {
      host: "heyclau.de",
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

async function json(response: Response) {
  return JSON.parse(await response.text());
}

describe("HeyClaude remote MCP route", () => {
  it("exposes CORS and no-store headers for MCP clients", () => {
    const response = OPTIONS(
      new Request("https://heyclau.de/api/mcp", {
        method: "OPTIONS",
        headers: { host: "heyclau.de" },
      }),
    );
    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-methods")).toContain(
      "POST",
    );
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("returns 405 for optional GET SSE streams on the stateless Worker endpoint", async () => {
    const response = await GET(
      new Request("https://heyclau.de/api/mcp", {
        method: "GET",
        headers: {
          host: "heyclau.de",
          accept: "text/event-stream",
          "mcp-protocol-version": "2025-11-25",
        },
      }),
    );

    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("POST, DELETE, OPTIONS");
    expect(response.headers.get("access-control-allow-methods")).not.toContain(
      "GET",
    );
    expect(await json(response)).toMatchObject({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed." },
      id: null,
    });
  });

  it("rejects browser origins outside the HeyClaude allowlist", async () => {
    const response = await POST(
      mcpRequest(
        { jsonrpc: "2.0", id: 1, method: "tools/list", params: {} },
        { origin: "https://example.invalid" },
      ),
    );
    expect(response.status).toBe(403);
    expect(await json(response)).toMatchObject({
      ok: false,
      error: { code: "forbidden_origin" },
    });
  });

  it("lists read-only tools over Streamable HTTP", async () => {
    const response = await POST(
      mcpRequest({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }),
    );
    expect(response.status).toBe(200);

    const payload = await json(response);
    const toolNames = payload.result.tools.map(
      (tool: { name: string }) => tool.name,
    );
    expect(toolNames).toEqual([
      "registry.search",
      "workflow.plan",
      "registry.recommend",
      "server.info",
      "registry.list",
      "registry.updates",
      "entry.related",
      "entry.detail",
      "entry.asset",
      "entry.compare",
      "registry.stats",
      "install.setup",
      "install.compatibility",
      "install.guidance",
      "install.adapter",
      "feeds.list",
      "submission.schema",
      "submission.validate",
      "submission.duplicates",
      "submission.urls",
      "submission.guidance",
      "submission.prepare",
      "submission.examples",
      "submission.review",
      "submission.policy",
      "entry.trust",
      "entry.safety",
    ]);
    expect(payload.result.tools[0]).toMatchObject({
      outputSchema: { type: "object" },
      annotations: { readOnlyHint: true, destructiveHint: false },
    });
    expect(toolNames.join(" ")).not.toMatch(
      /create_issue|create_pull_request|publish_content|write_file|delete/i,
    );
  });

  it("exposes read-only registry resources and workflow prompts over Streamable HTTP", async () => {
    const resourcesResponse = await POST(
      mcpRequest({
        jsonrpc: "2.0",
        id: 22,
        method: "resources/list",
        params: {},
      }),
    );
    expect(resourcesResponse.status).toBe(200);
    const resourcesPayload = await json(resourcesResponse);
    expect(resourcesPayload.result.resources).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          uri: "heyclaude://feeds/directory",
          mimeType: "application/json",
        }),
      ]),
    );

    const readResponse = await POST(
      mcpRequest({
        jsonrpc: "2.0",
        id: 23,
        method: "resources/read",
        params: { uri: "heyclaude://feeds/directory" },
      }),
    );
    expect(readResponse.status).toBe(200);
    const readPayload = await json(readResponse);
    expect(readPayload.result.contents[0]).toMatchObject({
      uri: "heyclaude://feeds/directory",
      mimeType: "application/json",
    });

    const promptsResponse = await POST(
      mcpRequest({
        jsonrpc: "2.0",
        id: 24,
        method: "prompts/list",
        params: {},
      }),
    );
    expect(promptsResponse.status).toBe(200);
    const promptsPayload = await json(promptsResponse);
    expect(promptsPayload.result.prompts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "find_best_asset" }),
        expect.objectContaining({ name: "install_asset_safely" }),
      ]),
    );

    const promptResponse = await POST(
      mcpRequest({
        jsonrpc: "2.0",
        id: 25,
        method: "prompts/get",
        params: {
          name: "install_asset_safely",
          arguments: {
            category: "mcp",
            slug: "legal-fournier-spain-legal-mcp",
          },
        },
      }),
    );
    expect(promptResponse.status).toBe(200);
    const promptPayload = await json(promptResponse);
    expect(promptPayload.result.messages[0].content.text).toContain(
      "entry.asset",
    );
  });

  it("searches public registry artifacts without write capabilities", async () => {
    const response = await POST(
      mcpRequest({
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
          name: "registry.search",
          arguments: { query: "discord", limit: 2 },
        },
      }),
    );
    expect(response.status).toBe(200);

    const payload = await json(response);
    expect(payload.result.structuredContent).toMatchObject({
      ok: true,
      policy: { readOnly: true },
    });
    const result = JSON.parse(payload.result.content[0].text);
    expect(result).toMatchObject({ ok: true, count: 2 });
    expect(result.entries[0]).toHaveProperty("canonicalUrl");
    expect(JSON.stringify(result)).not.toMatch(/admin|token|secret/i);
  });

  it("serves MCP server metadata and category browse tools", async () => {
    const infoResponse = await POST(
      mcpRequest({
        jsonrpc: "2.0",
        id: 33,
        method: "tools/call",
        params: { name: "server.info", arguments: {} },
      }),
    );
    expect(infoResponse.status).toBe(200);
    const infoPayload = await json(infoResponse);
    const info = JSON.parse(infoPayload.result.content[0].text);
    expect(info).toMatchObject({
      ok: true,
      endpoint: {
        auth: "none",
        rateLimit: {
          binding: "API_MCP_RATE_LIMIT",
          limit: 60,
        },
      },
      policy: {
        apiKeyRequired: false,
        createsIssues: false,
        publishesContent: false,
      },
    });

    const listResponse = await POST(
      mcpRequest({
        jsonrpc: "2.0",
        id: 34,
        method: "tools/call",
        params: {
          name: "registry.list",
          arguments: { category: "mcp", limit: 2 },
        },
      }),
    );
    expect(listResponse.status).toBe(200);
    const listPayload = await json(listResponse);
    const list = JSON.parse(listPayload.result.content[0].text);
    expect(list).toMatchObject({
      ok: true,
      category: "mcp",
      count: 2,
      entries: [
        expect.objectContaining({
          canonicalUrl: expect.stringContaining("/entry/mcp/"),
        }),
        expect.any(Object),
      ],
    });
  });

  it("returns schema validation errors for malformed MCP tool arguments", async () => {
    const response = await POST(
      mcpRequest({
        jsonrpc: "2.0",
        id: 4,
        method: "tools/call",
        params: {
          name: "registry.search",
          arguments: { limit: 100, writePath: "/tmp/unsafe" },
        },
      }),
    );
    expect(response.status).toBe(200);

    const payload = await json(response);
    expect(payload.result.isError).toBe(true);
    const result = JSON.parse(payload.result.content[0].text);
    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "invalid_request",
        details: expect.arrayContaining([
          expect.objectContaining({ path: "limit", code: "too_big" }),
          expect.objectContaining({ path: "", code: "unrecognized_keys" }),
        ]),
      },
    });
  });

  it("rejects oversized MCP bodies without relying on content-length", async () => {
    const response = await POST(
      mcpRequest({
        jsonrpc: "2.0",
        id: 99,
        method: "tools/call",
        params: {
          name: "registry.search",
          arguments: { query: "x".repeat(70 * 1024) },
        },
      }),
    );

    expect(response.status).toBe(413);
    expect(await json(response)).toMatchObject({
      ok: false,
      error: { code: "payload_too_large" },
    });
  });

  it("builds submission helper URLs without calling GitHub write APIs", async () => {
    const response = await POST(
      mcpRequest({
        jsonrpc: "2.0",
        id: 5,
        method: "tools/call",
        params: {
          name: "submission.urls",
          arguments: {
            fields: {
              category: "mcp",
              name: "Example MCP Server",
              docs_url: "https://example.com/docs",
              description:
                "Example MCP server submission used to verify the public helper flow.",
              install_command: "npx -y example-mcp",
              usage_snippet: "Add the MCP server to your Claude config.",
              safety_notes:
                "Installs and runs an MCP server process from the submitted package.",
              privacy_notes:
                "Not applicable: this fixture does not access user files or credentials.",
            },
          },
        },
      }),
    );
    expect(response.status).toBe(200);

    const payload = await json(response);
    expect(payload.result.isError).toBe(false);
    const result = JSON.parse(payload.result.content[0].text);
    expect(result).toMatchObject({
      ok: true,
      valid: true,
      reviewUrl: expect.stringContaining("https://heyclau.de/submit"),
      reviewModel: expect.stringContaining("PR-first"),
    });
    expect(JSON.stringify(result)).not.toMatch(/token|secret|authorization/i);
  });

  it("prepares submission drafts without creating GitHub issues", async () => {
    const response = await POST(
      mcpRequest({
        jsonrpc: "2.0",
        id: 6,
        method: "tools/call",
        params: {
          name: "submission.prepare",
          arguments: {
            fields: {
              category: "guides",
              name: "Example Guide",
              docs_url: "https://example.com/guide",
              description:
                "Example guide submission used to verify draft-only MCP helpers.",
              guide_content:
                "# Example Guide\n\nA complete public guide body for maintainer review.",
            },
          },
        },
      }),
    );
    expect(response.status).toBe(200);

    const payload = await json(response);
    expect(payload.result.isError).toBe(false);
    const result = JSON.parse(payload.result.content[0].text);
    expect(result).toMatchObject({
      ok: true,
      valid: true,
      reviewUrl: expect.stringContaining("https://heyclau.de/submit"),
      prDraft: {
        body: expect.stringContaining("### Guide content"),
      },
      submissionPolicy: expect.stringContaining("may be merged automatically"),
      artifactPolicy: expect.stringContaining("quarantine/review"),
    });
    expect(JSON.stringify(result)).not.toMatch(
      /token|secret|authorization|createIssue|createPullRequest/i,
    );
  });
});
