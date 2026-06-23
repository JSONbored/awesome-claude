import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { packageVersion } from "./package-metadata.js";
import {
  callRegistryTool,
  getRegistryPrompt,
  listRegistryPrompts,
  listRegistryResources,
  listRegistryResourceTemplates,
  readRegistryResource,
  TOOL_DEFINITIONS,
} from "./registry.js";

export function createHeyClaudeMcpServer(options = {}) {
  // Share one artifact cache across every tool/resource call for this server
  // instance so the long-lived stdio process parses each immutable registry
  // artifact once. Skip when a caller injects artifact loaders (e.g. the web
  // worker, which manages its own caching/revalidation) or already supplied one.
  const runtimeOptions =
    options.artifactCache ||
    typeof options.readJsonArtifact === "function" ||
    typeof options.readTextArtifact === "function"
      ? options
      : { ...options, artifactCache: new Map() };
  const server = new Server(
    {
      name: "heyclaude-registry",
      version: packageVersion,
    },
    {
      capabilities: {
        prompts: {},
        resources: {},
        tools: {},
      },
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOL_DEFINITIONS,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const result = await callRegistryTool(
      request.params.name,
      request.params.arguments || {},
      runtimeOptions,
    );
    return {
      isError: result.ok === false,
      structuredContent:
        result && typeof result === "object" && !Array.isArray(result)
          ? result
          : { result },
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  });

  server.setRequestHandler(ListResourcesRequestSchema, async (request) =>
    listRegistryResources(request.params || {}, runtimeOptions),
  );

  server.setRequestHandler(ListResourceTemplatesRequestSchema, async () =>
    listRegistryResourceTemplates(),
  );

  server.setRequestHandler(ReadResourceRequestSchema, async (request) =>
    readRegistryResource(request.params || {}, runtimeOptions),
  );

  server.setRequestHandler(ListPromptsRequestSchema, async () =>
    listRegistryPrompts(),
  );

  server.setRequestHandler(GetPromptRequestSchema, async (request) =>
    getRegistryPrompt(request.params || {}),
  );

  return server;
}

export async function runStdioServer(options = {}) {
  const server = createHeyClaudeMcpServer(options);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
