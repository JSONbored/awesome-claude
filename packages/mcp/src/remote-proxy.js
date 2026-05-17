import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { normalizeEndpointUrl, normalizeTimeoutMs } from "./endpoint-url.js";
import { packageVersion } from "./package-metadata.js";
import { MCP_PUBLIC_POLICY, READ_ONLY_TOOL_NAMES } from "./registry.js";

function toError(error) {
  if (error instanceof Error) return error;
  return new Error(String(error));
}

function safeErrorMessage(error) {
  return toError(error).message || "Remote MCP request failed.";
}

function createTimeoutFetch(timeoutMs) {
  return async (url, init = {}) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const inputSignal = init.signal;

    const abortFromInput = () => controller.abort();
    if (inputSignal) {
      if (inputSignal.aborted) controller.abort();
      else
        inputSignal.addEventListener("abort", abortFromInput, { once: true });
    }

    try {
      return await fetch(url, {
        ...init,
        redirect: "error",
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
      if (inputSignal) {
        inputSignal.removeEventListener("abort", abortFromInput);
      }
    }
  };
}

function invalidToolResult(name) {
  const structuredContent = {
    ok: false,
    error: {
      code: "invalid_request",
      message: `Unknown or unsupported HeyClaude MCP tool: ${name}`,
    },
    policy: MCP_PUBLIC_POLICY,
  };
  return {
    isError: true,
    structuredContent,
    content: [
      {
        type: "text",
        text: JSON.stringify(structuredContent, null, 2),
      },
    ],
  };
}

function errorToolResult(error) {
  const structuredContent = {
    ok: false,
    error: {
      code: "remote_mcp_error",
      message: safeErrorMessage(error),
    },
    policy: MCP_PUBLIC_POLICY,
  };
  return {
    isError: true,
    structuredContent,
    content: [
      {
        type: "text",
        text: JSON.stringify(structuredContent, null, 2),
      },
    ],
  };
}

function readOnlyToolDefinition(tool) {
  if (!READ_ONLY_TOOL_NAMES.includes(tool?.name)) return null;
  return {
    ...tool,
    annotations: {
      ...(tool.annotations || {}),
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  };
}

function parseTextToolPayload(result) {
  const text = result?.content?.find((item) => item.type === "text")?.text;
  if (!text) return null;
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : null;
  } catch {
    return null;
  }
}

function withPolicy(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return payload;
  }
  if (payload.policy) return payload;
  return { ...payload, policy: MCP_PUBLIC_POLICY };
}

function normalizeForwardedToolResult(result) {
  if (!result || typeof result !== "object") return result;
  if (result.structuredContent) {
    return {
      ...result,
      structuredContent: withPolicy(result.structuredContent),
    };
  }

  const parsed = parseTextToolPayload(result);
  if (parsed) {
    return {
      ...result,
      structuredContent: withPolicy(parsed),
    };
  }

  return {
    ...result,
    structuredContent: {
      ok: result.isError !== true,
      policy: MCP_PUBLIC_POLICY,
    },
  };
}

export async function createRemoteMcpProxyServerFromClient(
  client,
  options = {},
) {
  const endpointUrl = normalizeEndpointUrl(options.url);
  const timeoutMs = normalizeTimeoutMs(options.timeoutMs);
  const remoteCapabilities = client.getServerCapabilities() || {};
  const remoteTools = await client.listTools(undefined, { timeout: timeoutMs });
  const toolDefinitions = remoteTools.tools
    .map(readOnlyToolDefinition)
    .filter(Boolean);
  const supportedToolNames = new Set(toolDefinitions.map((tool) => tool.name));
  const capabilities = {
    tools: {},
    ...(remoteCapabilities.resources ? { resources: {} } : {}),
    ...(remoteCapabilities.prompts ? { prompts: {} } : {}),
  };

  const server = new Server(
    {
      name: "heyclaude-registry",
      version: packageVersion,
    },
    { capabilities },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: toolDefinitions,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const name = request.params.name;
    if (!supportedToolNames.has(name)) {
      return invalidToolResult(name);
    }

    try {
      const result = await client.callTool(
        {
          name,
          arguments: request.params.arguments || {},
        },
        undefined,
        { timeout: timeoutMs },
      );
      return normalizeForwardedToolResult(result);
    } catch (error) {
      return errorToolResult(error);
    }
  });

  if (remoteCapabilities.resources) {
    server.setRequestHandler(ListResourcesRequestSchema, async (request) =>
      client.listResources(request.params || {}, { timeout: timeoutMs }),
    );
    server.setRequestHandler(
      ListResourceTemplatesRequestSchema,
      async (request) =>
        client.listResourceTemplates(request.params || {}, {
          timeout: timeoutMs,
        }),
    );
    server.setRequestHandler(ReadResourceRequestSchema, async (request) =>
      client.readResource(request.params || {}, { timeout: timeoutMs }),
    );
  }

  if (remoteCapabilities.prompts) {
    server.setRequestHandler(ListPromptsRequestSchema, async (request) =>
      client.listPrompts(request.params || {}, { timeout: timeoutMs }),
    );
    server.setRequestHandler(GetPromptRequestSchema, async (request) =>
      client.getPrompt(request.params || {}, { timeout: timeoutMs }),
    );
  }

  server.onclose = () => {
    client.close().catch(() => {});
  };

  return { server, client, endpointUrl, timeoutMs };
}

export async function createRemoteMcpProxyServer(options = {}) {
  const endpointUrl = normalizeEndpointUrl(options.url);
  const timeoutMs = normalizeTimeoutMs(options.timeoutMs);
  const client = new Client({
    name: "heyclaude-mcp-stdio-proxy",
    version: packageVersion,
  });
  const remoteTransport = new StreamableHTTPClientTransport(endpointUrl, {
    fetch: createTimeoutFetch(timeoutMs),
  });

  await client.connect(remoteTransport, { timeout: timeoutMs });
  return createRemoteMcpProxyServerFromClient(client, {
    url: endpointUrl,
    timeoutMs,
  });
}

export async function runRemoteStdioProxy(options = {}) {
  const { server } = await createRemoteMcpProxyServer(options);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
