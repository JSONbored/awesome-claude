export type McpInstallTargetId =
  | "claude-code"
  | "codex"
  | "cursor"
  | "antigravity";

export type McpServerConfig = Record<string, unknown>;

export type ResolvedMcpInstallConfig = {
  name: string;
  config: McpServerConfig;
  configSnippet: string;
  targets: McpInstallTargetId[];
};

export declare const MCP_INSTALL_TARGET_IDS: readonly McpInstallTargetId[];

export declare function normalizeMcpServerConfig(
  value: unknown,
): McpServerConfig | null;

export declare function extractMcpServerConfig(
  value: unknown,
): { name?: string; config: McpServerConfig } | null;

export declare function mcpConfigSupportsTarget(
  config: unknown,
  target: McpInstallTargetId,
): boolean;

export declare function mcpInstallTargetsForConfig(
  config: unknown,
): McpInstallTargetId[];

export declare function formatMcpConfigSnippet(
  name: string,
  config: McpServerConfig,
): string;

export declare function resolveMcpInstallConfig(
  entry: Record<string, unknown>,
): ResolvedMcpInstallConfig | null;
