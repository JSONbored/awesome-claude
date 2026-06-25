import { createRequire } from "node:module";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createRemoteMcpProxyServer,
  createRemoteMcpProxyServerFromClient,
  createTimeoutFetch,
  runRemoteStdioProxy,
} from "../packages/mcp/src/remote-proxy.js";
import { LOCAL_DRAFT_TOOL_NAMES } from "../packages/mcp/src/registry.js";
import { repoRoot } from "./helpers/registry-fixtures";

const packageRequire = createRequire(
  path.join(repoRoot, "packages/mcp/package.json"),
);
const { Client } = await import(
  packageRequire.resolve("@modelcontextprotocol/sdk/client/index.js")
);
const { InMemoryTransport } = await import(
  packageRequire.resolve("@modelcontextprotocol/sdk/inMemory.js")
);

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

async function withMcpClientForServer<T>(
  server: any,
  run: (client: any) => Promise<T>,
) {
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  const client = new Client({
    name: "heyclaude-remote-proxy-test",
    version: "0.0.0",
  });

  await server.connect(serverTransport);
  await client.connect(clientTransport);
  try {
    return await run(client);
  } finally {
    await client.close().catch(() => {});
    await server.close().catch(() => {});
  }
}

function createRemoteMcpHttpFetch() {
  return vi.fn(async (_url: URL | string, init?: RequestInit) => {
    expect(init?.redirect).toBe("error");
    expect(init?.signal).toBeInstanceOf(AbortSignal);

    if (init?.method === "GET") {
      return new Response(null, { status: 405 });
    }

    const message = JSON.parse(String(init?.body));
    if (message.method === "notifications/initialized") {
      return new Response(null, { status: 202 });
    }

    const result =
      message.method === "initialize"
        ? {
            protocolVersion: "2025-11-25",
            capabilities: { tools: {} },
            serverInfo: {
              name: "remote-heyclaude-test",
              version: "0.0.0",
            },
          }
        : {
            tools: [
              {
                name: "registry.search",
                description: "Remote search.",
                inputSchema: { type: "object", additionalProperties: true },
              },
            ],
          };

    return Response.json({
      jsonrpc: "2.0",
      id: message.id,
      result,
    });
  }) as typeof fetch & ReturnType<typeof vi.fn>;
}

describe("HeyClaude MCP remote proxy privacy boundary", () => {
  it("does not expose or forward local draft tools through the remote proxy", async () => {
    const forwardedCalls: Array<{ name: string; arguments?: unknown }> = [];
    const remoteClient = {
      getServerCapabilities() {
        return { tools: {} };
      },
      async listTools() {
        return {
          tools: [
            {
              name: "registry.search",
              description: "Remote search.",
              inputSchema: { type: "object", additionalProperties: true },
            },
            ...LOCAL_DRAFT_TOOL_NAMES.map((name) => ({
              name,
              description: "Remote draft helper.",
              inputSchema: { type: "object", additionalProperties: true },
            })),
          ],
        };
      },
      async callTool(request: { name: string; arguments?: unknown }) {
        forwardedCalls.push(request);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true }),
            },
          ],
        };
      },
    };
    const { server } = await createRemoteMcpProxyServerFromClient(
      remoteClient,
      {
        url: "https://example.com/api/mcp",
        timeoutMs: 1000,
      },
    );

    await withMcpClientForServer(server, async (client) => {
      const tools = await client.listTools();
      const toolNames = tools.tools.map((tool: { name: string }) => tool.name);
      expect(toolNames).toContain("registry.search");
      expect(toolNames).not.toContain("submission.validate");
      expect(toolNames).not.toContain("submission.urls");
      expect(toolNames).not.toContain("submission.prepare");
      expect(toolNames).not.toContain("submission.review");

      const result = await client.callTool({
        name: "submission.validate",
        arguments: {
          fields: {
            category: "mcp",
            name: "Private Draft",
            contact_email: "private@example.test",
            full_copyable_content: "secret draft body",
          },
        },
      });

      expect(result.isError).toBe(true);
      expect(result.structuredContent).toMatchObject({
        ok: false,
        error: { code: "local_only_tool" },
      });
      expect(JSON.stringify(result.structuredContent)).toContain(
        "local artifact mode",
      );
    });

    expect(forwardedCalls).toEqual([]);
  });

  it("forwards read-only calls with policy metadata while proxying resources and prompts", async () => {
    const forwardedCalls: Array<{
      name: string;
      arguments?: Record<string, unknown>;
    }> = [];
    const remoteClient = {
      closed: false,
      getServerCapabilities() {
        return { tools: {}, resources: {}, prompts: {} };
      },
      async listTools() {
        return {
          tools: [
            {
              name: "registry.search",
              description: "Remote search.",
              inputSchema: { type: "object", additionalProperties: true },
            },
          ],
        };
      },
      async callTool(request: {
        name: string;
        arguments?: Record<string, unknown>;
      }) {
        forwardedCalls.push(request);
        if (request.arguments?.mode === "structured") {
          return {
            structuredContent: { ok: true, results: [{ slug: "demo" }] },
            content: [{ type: "text", text: "structured" }],
          };
        }
        if (request.arguments?.mode === "text-json") {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ ok: true, results: [{ slug: "json" }] }),
              },
            ],
          };
        }
        if (request.arguments?.mode === "text-plain") {
          return {
            content: [{ type: "text", text: "plain text result" }],
          };
        }
        if (request.arguments?.mode === "structured-policy") {
          return {
            structuredContent: {
              ok: true,
              policy: { readOnly: true, note: "remote provided policy" },
            },
            content: [{ type: "text", text: "policy payload" }],
          };
        }
        if (request.arguments?.mode === "text-array") {
          return {
            content: [{ type: "text", text: "[]" }],
          };
        }
        throw "remote exploded";
      },
      async listResources() {
        return {
          resources: [{ uri: "heyclaude://registry/recent", name: "Recent" }],
        };
      },
      async listResourceTemplates() {
        return {
          resourceTemplates: [
            {
              uriTemplate: "heyclaude://entry/{category}/{slug}",
              name: "Entry",
            },
          ],
        };
      },
      async readResource() {
        return {
          contents: [
            {
              uri: "heyclaude://registry/recent",
              mimeType: "application/json",
              text: JSON.stringify({ ok: true }),
            },
          ],
        };
      },
      async listPrompts() {
        return {
          prompts: [{ name: "recommend-workflow", description: "Recommend" }],
        };
      },
      async getPrompt() {
        return {
          description: "Recommend",
          messages: [
            {
              role: "user",
              content: { type: "text", text: "Recommend a workflow." },
            },
          ],
        };
      },
      async close() {
        this.closed = true;
      },
    };
    const { server } = await createRemoteMcpProxyServerFromClient(
      remoteClient,
      {
        url: "https://example.com/api/mcp",
        timeoutMs: 1000,
      },
    );

    await withMcpClientForServer(server, async (client) => {
      await expect(
        client.callTool({
          name: "delete_registry_entry",
          arguments: {},
        }),
      ).resolves.toMatchObject({
        isError: true,
        structuredContent: {
          ok: false,
          error: { code: "invalid_request" },
        },
      });

      await expect(
        client.callTool({
          name: "registry.search",
          arguments: { mode: "structured" },
        }),
      ).resolves.toMatchObject({
        structuredContent: {
          ok: true,
          results: [{ slug: "demo" }],
          policy: expect.objectContaining({ readOnly: true }),
        },
      });

      await expect(
        client.callTool({
          name: "registry.search",
          arguments: { mode: "text-json" },
        }),
      ).resolves.toMatchObject({
        structuredContent: {
          ok: true,
          results: [{ slug: "json" }],
          policy: expect.objectContaining({ readOnly: true }),
        },
      });

      await expect(
        client.callTool({
          name: "registry.search",
          arguments: { mode: "text-plain" },
        }),
      ).resolves.toMatchObject({
        structuredContent: {
          ok: true,
          policy: expect.objectContaining({ readOnly: true }),
        },
      });

      await expect(
        client.callTool({
          name: "registry.search",
          arguments: { mode: "structured-policy" },
        }),
      ).resolves.toMatchObject({
        structuredContent: {
          ok: true,
          policy: { note: "remote provided policy" },
        },
      });

      await expect(
        client.callTool({
          name: "registry.search",
          arguments: { mode: "text-array" },
        }),
      ).resolves.toMatchObject({
        structuredContent: {
          ok: true,
          policy: expect.objectContaining({ readOnly: true }),
        },
      });

      await expect(
        client.callTool({
          name: "registry.search",
          arguments: { mode: "throws" },
        }),
      ).resolves.toMatchObject({
        isError: true,
        structuredContent: {
          ok: false,
          error: {
            code: "remote_mcp_error",
            message: "remote exploded",
          },
        },
      });

      await expect(client.listResources()).resolves.toMatchObject({
        resources: [{ uri: "heyclaude://registry/recent" }],
      });
      await expect(client.listResourceTemplates()).resolves.toMatchObject({
        resourceTemplates: [
          { uriTemplate: "heyclaude://entry/{category}/{slug}" },
        ],
      });
      await expect(
        client.readResource({ uri: "heyclaude://registry/recent" }),
      ).resolves.toMatchObject({
        contents: [{ uri: "heyclaude://registry/recent" }],
      });
      await expect(client.listPrompts()).resolves.toMatchObject({
        prompts: [{ name: "recommend-workflow" }],
      });
      await expect(
        client.getPrompt({ name: "recommend-workflow", arguments: {} }),
      ).resolves.toMatchObject({
        messages: [
          {
            role: "user",
            content: { type: "text", text: "Recommend a workflow." },
          },
        ],
      });
    });

    expect(forwardedCalls.map((call) => call.arguments?.mode)).toEqual([
      "structured",
      "text-json",
      "text-plain",
      "structured-policy",
      "text-array",
      "throws",
    ]);
    expect(remoteClient.closed).toBe(true);
  });

  it("uses the bounded fetch transport when starting a remote stdio proxy", async () => {
    const fetchMock = vi.fn(async (_url: URL | string, init?: RequestInit) => {
      expect(init?.redirect).toBe("error");
      expect(init?.signal).toBeInstanceOf(AbortSignal);
      return new Response("{}", { status: 503 });
    }) as typeof fetch;
    globalThis.fetch = fetchMock;

    await expect(
      createRemoteMcpProxyServer({
        url: "https://example.com/api/mcp",
        timeoutMs: 25,
      }),
    ).rejects.toThrow();
    expect(fetchMock.mock.calls.length).toBeLessThanOrEqual(1);
  });

  it("starts the remote proxy through streamable HTTP and stdio transport", async () => {
    const fetchMock = createRemoteMcpHttpFetch();
    globalThis.fetch = fetchMock;

    const proxy = await createRemoteMcpProxyServer({
      url: "https://example.com/api/mcp",
      timeoutMs: 1000,
    });
    expect(proxy.endpointUrl.href).toBe("https://example.com/api/mcp");
    expect(proxy.timeoutMs).toBe(1000);
    expect(
      fetchMock.mock.calls.some(([, init]) => {
        const body = String(init?.body ?? "");
        return body.includes('"method":"initialize"');
      }),
    ).toBe(true);
    await proxy.client.close();

    await expect(
      runRemoteStdioProxy({
        url: "https://example.com/api/mcp",
        timeoutMs: 1000,
      }),
    ).resolves.toBeUndefined();
    expect(
      fetchMock.mock.calls.filter(([, init]) =>
        String(init?.body ?? "").includes('"method":"tools/list"'),
      ),
    ).toHaveLength(2);
  });

  it("wraps fetch with timeout and caller abort propagation", async () => {
    const removeEventListener = vi.fn();
    const callerSignal = {
      aborted: false,
      addEventListener: vi.fn(),
      removeEventListener,
    } as unknown as AbortSignal;
    const fetchMock = vi.fn(async (_url: URL | string, init?: RequestInit) => {
      expect(init?.redirect).toBe("error");
      expect(init?.signal).toBeInstanceOf(AbortSignal);
      return new Response("ok", { status: 200 });
    }) as typeof fetch;
    globalThis.fetch = fetchMock;

    await expect(
      createTimeoutFetch(50)("https://example.com/mcp", {
        signal: callerSignal,
      }),
    ).resolves.toMatchObject({ status: 200 });
    expect(removeEventListener).toHaveBeenCalled();

    const abortedSignal = {
      aborted: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as AbortSignal;
    await createTimeoutFetch(50)("https://example.com/mcp", {
      signal: abortedSignal,
    });
    expect(fetchMock).toHaveBeenLastCalledWith(
      "https://example.com/mcp",
      expect.objectContaining({
        redirect: "error",
        signal: expect.objectContaining({ aborted: true }),
      }),
    );
  });
});
