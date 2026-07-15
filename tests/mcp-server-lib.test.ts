import { beforeEach, describe, expect, it, vi } from "vitest";

const registryMocks = vi.hoisted(() => ({
  callRegistryTool: vi.fn(),
  getRegistryPrompt: vi.fn(),
  listRegistryPrompts: vi.fn(),
  listRegistryResources: vi.fn(),
  listRegistryResourceTemplates: vi.fn(),
  readRegistryResource: vi.fn(),
  TOOL_DEFINITIONS: [
    { name: "search", description: "Search", inputSchema: {} },
  ],
}));

vi.mock("../packages/mcp/src/registry.js", () => registryMocks);

import {
  createHeyClaudeMcpServer,
  runStdioServer,
} from "../packages/mcp/src/server-lib.js";
import {
  createHeyClaudeMcpServer as createServerFromWrapper,
  runStdioServer as runStdioServerFromWrapper,
} from "../packages/mcp/src/server.js";
import { packageVersion } from "../packages/mcp/src/package-metadata.js";

const { Server } =
  await import("../packages/mcp/node_modules/@modelcontextprotocol/sdk/dist/esm/server/index.js");
const {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} =
  await import("../packages/mcp/node_modules/@modelcontextprotocol/sdk/dist/esm/types.js");

// Capture the request handlers server-lib registers, keyed by request schema
// (the SDK Server constructor registers its own internal handlers too, so match
// by schema rather than by call order), then invoke each in isolation.
function captureRequestHandlers(options = {}) {
  const handlers = new Map();
  const spy = vi
    .spyOn(Server.prototype, "setRequestHandler")
    .mockImplementation((schema, handler) => {
      handlers.set(schema, handler);
    });
  try {
    createHeyClaudeMcpServer(options);
  } finally {
    spy.mockRestore();
  }
  return {
    listTools: handlers.get(ListToolsRequestSchema),
    callTool: handlers.get(CallToolRequestSchema),
    listResources: handlers.get(ListResourcesRequestSchema),
    listResourceTemplates: handlers.get(ListResourceTemplatesRequestSchema),
    readResource: handlers.get(ReadResourceRequestSchema),
    listPrompts: handlers.get(ListPromptsRequestSchema),
    getPrompt: handlers.get(GetPromptRequestSchema),
  };
}

describe("server-lib MCP server wiring", () => {
  it("creates a registry MCP server with the package version metadata", () => {
    const server = createHeyClaudeMcpServer({});
    expect(server).toBeInstanceOf(Server);
    expect(server.server?.name || server._serverInfo?.name).toBe(
      "heyclaude-registry",
    );
    expect(server.server?.version || server._serverInfo?.version).toBe(
      packageVersion,
    );
  });

  it("reuses an injected artifact cache across handler calls", () => {
    const artifactCache = new Map();
    const server = createHeyClaudeMcpServer({ artifactCache });
    expect(server).toBeInstanceOf(Server);
    expect(artifactCache.size).toBe(0);
  });

  it("connects the registry server to a stdio transport", async () => {
    const connect = vi
      .spyOn(Server.prototype, "connect")
      .mockResolvedValue(undefined);

    await runStdioServer({});

    expect(connect).toHaveBeenCalledWith(expect.any(Object));
    connect.mockRestore();
  });
});

describe("server-lib request handlers", () => {
  beforeEach(() => {
    for (const value of Object.values(registryMocks)) {
      if (typeof value?.mockReset === "function") value.mockReset();
    }
  });

  it("lists the registry tool definitions", async () => {
    const { listTools } = captureRequestHandlers();
    await expect(listTools()).resolves.toEqual({
      tools: registryMocks.TOOL_DEFINITIONS,
    });
  });

  it("forwards a tool call and wraps a successful object result", async () => {
    registryMocks.callRegistryTool.mockResolvedValue({ ok: true, data: 1 });
    const { callTool } = captureRequestHandlers();

    const response = await callTool({
      params: { name: "search", arguments: { q: "mcp" } },
    });

    expect(registryMocks.callRegistryTool).toHaveBeenCalledWith(
      "search",
      { q: "mcp" },
      expect.any(Object),
    );
    expect(response.isError).toBe(false);
    expect(response.structuredContent).toEqual({ ok: true, data: 1 });
    expect(response.content[0]).toMatchObject({ type: "text" });
    expect(JSON.parse(response.content[0].text)).toEqual({ ok: true, data: 1 });
  });

  it("marks a failed tool result as an error and defaults missing arguments", async () => {
    registryMocks.callRegistryTool.mockResolvedValue({ ok: false });
    const { callTool } = captureRequestHandlers();

    const response = await callTool({ params: { name: "search" } });

    expect(registryMocks.callRegistryTool).toHaveBeenCalledWith(
      "search",
      {},
      expect.any(Object),
    );
    expect(response.isError).toBe(true);
  });

  it("wraps a non-object tool result under a result key", async () => {
    registryMocks.callRegistryTool.mockResolvedValue("plain string");
    const { callTool } = captureRequestHandlers();

    const response = await callTool({
      params: { name: "search", arguments: {} },
    });

    expect(response.structuredContent).toEqual({ result: "plain string" });
  });

  it("delegates the resource, template, and prompt handlers to the registry", async () => {
    registryMocks.listRegistryResources.mockResolvedValue({ resources: [] });
    registryMocks.listRegistryResourceTemplates.mockReturnValue({
      resourceTemplates: [],
    });
    registryMocks.readRegistryResource.mockResolvedValue({ contents: [] });
    registryMocks.listRegistryPrompts.mockReturnValue({ prompts: [] });
    registryMocks.getRegistryPrompt.mockResolvedValue({ messages: [] });
    const handlers = captureRequestHandlers();

    await handlers.listResources({ params: { cursor: "x" } });
    expect(registryMocks.listRegistryResources).toHaveBeenCalledWith(
      { cursor: "x" },
      expect.any(Object),
    );

    await handlers.listResourceTemplates();
    expect(registryMocks.listRegistryResourceTemplates).toHaveBeenCalled();

    await handlers.readResource({ params: { uri: "registry://x" } });
    expect(registryMocks.readRegistryResource).toHaveBeenCalledWith(
      { uri: "registry://x" },
      expect.any(Object),
    );

    await handlers.listPrompts();
    expect(registryMocks.listRegistryPrompts).toHaveBeenCalled();

    await handlers.getPrompt({ params: { name: "p" } });
    expect(registryMocks.getRegistryPrompt).toHaveBeenCalledWith({ name: "p" });
  });

  it("passes an empty params object to resource handlers when params are absent", async () => {
    registryMocks.listRegistryResources.mockResolvedValue({ resources: [] });
    registryMocks.readRegistryResource.mockResolvedValue({ contents: [] });
    registryMocks.getRegistryPrompt.mockResolvedValue({ messages: [] });
    const handlers = captureRequestHandlers();

    await handlers.listResources({});
    expect(registryMocks.listRegistryResources).toHaveBeenCalledWith(
      {},
      expect.any(Object),
    );
    await handlers.readResource({});
    expect(registryMocks.readRegistryResource).toHaveBeenCalledWith(
      {},
      expect.any(Object),
    );
    await handlers.getPrompt({});
    expect(registryMocks.getRegistryPrompt).toHaveBeenCalledWith({});
  });
});

describe("server re-export compatibility", () => {
  it("keeps the public wrapper wired to the extracted lib", () => {
    expect(createServerFromWrapper).toBe(createHeyClaudeMcpServer);
    expect(runStdioServerFromWrapper).toBe(runStdioServer);
  });
});
