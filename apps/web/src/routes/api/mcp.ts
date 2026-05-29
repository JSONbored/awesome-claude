import { createApiFileRoute } from "@/lib/api/file-route";

import { getApiRouteDefinition } from "@/lib/api/contracts";
import { apiError, enforceApiRateLimit, getApiRequestId } from "@/lib/api/router";
import {
  BodyTooLargeError,
  hasJsonContentType,
  isAllowedOrigin,
  readRequestTextWithinLimit,
} from "@/lib/api-security";
import { logApiError, logApiWarn } from "@/lib/api-logs";
import { getCloudflareBinding } from "@/lib/cloudflare-env.server";
import { loadJsonDataFile, loadTextDataFile } from "@/lib/content.server";
import { applySecurityHeaders } from "@/lib/security-headers";

const route = getApiRouteDefinition("mcp.streamable");

type StaticAssetsBinding = {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

const mcpCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, DELETE, OPTIONS",
  "access-control-allow-headers":
    "content-type, accept, mcp-session-id, mcp-protocol-version, mcp-method, mcp-name, last-event-id",
  "access-control-expose-headers": "mcp-session-id, mcp-protocol-version",
};

function applyMcpHeaders(response: Response) {
  const headers = applySecurityHeaders(new Headers(response.headers));
  for (const [key, value] of Object.entries(mcpCorsHeaders)) headers.set(key, value);
  headers.set("cache-control", "no-store");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function mcpError(
  request: Request,
  code: string,
  status: number,
  requestId: string,
  message?: string,
) {
  logApiWarn(request, `${route.id}.${code}`);
  return applyMcpHeaders(apiError(code, status, { requestId, message }));
}

function mcpMethodNotAllowed() {
  return applyMcpHeaders(
    new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Method not allowed." },
        id: null,
      }),
      {
        status: 405,
        headers: {
          allow: "POST, DELETE, OPTIONS",
          "content-type": "application/json",
        },
      },
    ),
  );
}

function assetRequest(origin: string, fileName: string) {
  return new Request(`${origin}/data/${fileName}`);
}

function createMcpArtifactReaders(origin: string, assets?: StaticAssetsBinding) {
  const loadAssetText = async (fileName: string) => {
    const response = await (assets?.fetch(assetRequest(origin, fileName)) ??
      fetch(assetRequest(origin, fileName)));
    if (!response.ok) {
      throw new Error(`Failed to load ${fileName} asset (${response.status})`);
    }
    return response.text();
  };

  const readTextArtifact = async (fileName: string) => {
    try {
      return await loadTextDataFile(fileName);
    } catch {
      return loadAssetText(fileName);
    }
  };

  return {
    readTextArtifact,
    readJsonArtifact: async <T>(fileName: string): Promise<T> => {
      try {
        return await loadJsonDataFile<T>(fileName);
      } catch {
        return JSON.parse(await loadAssetText(fileName)) as T;
      }
    },
  };
}

async function validateMcpRequest(request: Request) {
  const requestId = getApiRequestId(request);
  if (route.originCheck && !isAllowedOrigin(request)) {
    return mcpError(request, "forbidden_origin", 403, requestId);
  }
  if (request.method === "POST" && !hasJsonContentType(request)) {
    return mcpError(request, "invalid_content_type", 415, requestId);
  }

  let checkedRequest = request;
  if (request.method === "POST" && route.bodyLimitBytes) {
    try {
      const body = await readRequestTextWithinLimit(request, route.bodyLimitBytes);
      checkedRequest = new Request(request.url, {
        method: request.method,
        headers: request.headers,
        body,
      });
    } catch (error) {
      if (error instanceof BodyTooLargeError) {
        return mcpError(request, "payload_too_large", 413, requestId);
      }
      throw error;
    }
  }

  if (await enforceApiRateLimit(route, request)) {
    return mcpError(request, "rate_limited", 429, requestId);
  }

  return { request: checkedRequest };
}

async function handleMcpRequest(request: Request) {
  const validationResult = await validateMcpRequest(request);
  if (validationResult instanceof Response) return validationResult;
  const checkedRequest = validationResult.request;

  try {
    const url = new URL(checkedRequest.url);
    const host = url.host;
    const artifactReaders = createMcpArtifactReaders(
      url.origin,
      getCloudflareBinding<StaticAssetsBinding>("ASSETS"),
    );
    const [{ createHeyClaudeMcpServer }, { WebStandardStreamableHTTPServerTransport }] =
      await Promise.all([
        import("@heyclaude/mcp/server"),
        import("@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js"),
      ]);
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
      enableDnsRebindingProtection: true,
      allowedHosts: [host],
    });
    const server = createHeyClaudeMcpServer(artifactReaders);

    await server.connect(transport);
    return applyMcpHeaders(await transport.handleRequest(checkedRequest));
  } catch (error) {
    logApiError(request, `${route.id}.unhandled_error`, {
      error: error instanceof Error ? error.message : "unknown",
    });
    return applyMcpHeaders(
      apiError("internal_error", 500, { requestId: getApiRequestId(request) }),
    );
  }
}

export function OPTIONS(request: Request) {
  if (route.originCheck && !isAllowedOrigin(request)) {
    return mcpError(request, "forbidden_origin", 403, getApiRequestId(request));
  }
  return applyMcpHeaders(new Response(null, { status: 204 }));
}

export function GET() {
  return mcpMethodNotAllowed();
}

export function POST(request: Request) {
  return handleMcpRequest(request);
}

export function DELETE(request: Request) {
  return handleMcpRequest(request);
}

export const Route = createApiFileRoute("/api/mcp")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => OPTIONS(request),
      GET: async () => GET(),
      POST: async ({ request }) => POST(request),
      DELETE: async ({ request }) => DELETE(request),
    },
  },
});
