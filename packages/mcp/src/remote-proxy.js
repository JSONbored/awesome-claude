import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { normalizeEndpointUrl, normalizeTimeoutMs } from "./endpoint-url.js";
import { packageVersion } from "./package-metadata.js";
import { READ_ONLY_TOOL_NAMES, TOOL_DEFINITIONS } from "./registry.js";

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
  return {
    isError: true,
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            ok: false,
            error: {
              code: "invalid_request",
              message: `Unknown or unsupported HeyClaude MCP tool: ${name}`,
            },
          },
          null,
          2,
        ),
      },
    ],
  };
}

function errorToolResult(error) {
  return {
    isError: true,
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            ok: false,
            error: {
              code: "remote_mcp_error",
              message: safeErrorMessage(error),
            },
          },
          null,
          2,
        ),
      },
    ],
  };
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

  const server = new Server(
    {
      name: "heyclaude-registry",
      version: packageVersion,
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOL_DEFINITIONS,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const name = request.params.name;
    if (!READ_ONLY_TOOL_NAMES.includes(name)) {
      return invalidToolResult(name);
    }

    try {
      return await client.callTool(
        {
          name,
          arguments: request.params.arguments || {},
        },
        undefined,
        { timeout: timeoutMs },
      );
    } catch (error) {
      return errorToolResult(error);
    }
  });

  server.onclose = () => {
    client.close().catch(() => {});
  };

  return { server, client, endpointUrl, timeoutMs };
}

export async function runRemoteStdioProxy(options = {}) {
  const { server } = await createRemoteMcpProxyServer(options);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
