import type { Server } from "@modelcontextprotocol/sdk/server/index.js";

export type RemoteProxyOptions = {
  url?: string | URL;
  timeoutMs?: number | string;
};

export function createRemoteMcpProxyServer(
  options?: RemoteProxyOptions,
): Promise<{
  server: Server;
  client: unknown;
  endpointUrl: URL;
  timeoutMs: number;
}>;

export function createRemoteMcpProxyServerFromClient(
  client: {
    getServerCapabilities: () => Record<string, unknown> | undefined;
    listTools: (...args: unknown[]) => Promise<{ tools: Array<unknown> }>;
    callTool: (...args: unknown[]) => Promise<unknown>;
    listResources?: (...args: unknown[]) => Promise<unknown>;
    listResourceTemplates?: (...args: unknown[]) => Promise<unknown>;
    readResource?: (...args: unknown[]) => Promise<unknown>;
    listPrompts?: (...args: unknown[]) => Promise<unknown>;
    getPrompt?: (...args: unknown[]) => Promise<unknown>;
    close?: () => Promise<void>;
  },
  options?: RemoteProxyOptions,
): Promise<{
  server: Server;
  client: unknown;
  endpointUrl: URL;
  timeoutMs: number;
}>;

export function runRemoteStdioProxy(
  options?: RemoteProxyOptions,
): Promise<void>;
