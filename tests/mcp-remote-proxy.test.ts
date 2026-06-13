import { createRequire } from "node:module";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { createRemoteMcpProxyServerFromClient } from "../packages/mcp/src/remote-proxy.js";
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
              name: "search_registry",
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
      expect(toolNames).toContain("search_registry");
      expect(toolNames).not.toContain("validate_submission_draft");
      expect(toolNames).not.toContain("build_submission_urls");
      expect(toolNames).not.toContain("prepare_submission_draft");
      expect(toolNames).not.toContain("review_submission_draft");

      const result = await client.callTool({
        name: "validate_submission_draft",
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
});
