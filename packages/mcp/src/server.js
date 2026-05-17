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
      options,
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
    listRegistryResources(request.params || {}, options),
  );

  server.setRequestHandler(ListResourceTemplatesRequestSchema, async () =>
    listRegistryResourceTemplates(),
  );

  server.setRequestHandler(ReadResourceRequestSchema, async (request) =>
    readRegistryResource(request.params || {}, options),
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
