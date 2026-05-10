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

export function runRemoteStdioProxy(
  options?: RemoteProxyOptions,
): Promise<void>;
