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

export type McpInstallTargetOptions = {
  /**
   * Whether to require one-click install safety. Defaults to `true`, which
   * limits stdio configs to a bare `npx`/`uvx` command. Pass `false` to ask
   * only whether the client can run the config at all (platform compatibility).
   */
  oneClick?: boolean;
};

/**
 * One-click install support for `config` on `target`.
 *
 * A stdio config only qualifies when its `command` is a bare `npx` or `uvx`;
 * any other local binary or shell command is manual-install only, even though
 * `normalizeMcpServerConfig` still accepts it as valid registry metadata.
 */
export declare function mcpConfigSupportsTarget(
  config: unknown,
  target: McpInstallTargetId,
  options?: McpInstallTargetOptions,
): boolean;

/**
 * The one-click install targets `config` supports - empty for a stdio config
 * whose `command` is outside the `npx`/`uvx` allowlist.
 */
export declare function mcpInstallTargetsForConfig(
  config: unknown,
  options?: McpInstallTargetOptions,
): McpInstallTargetId[];

export declare function formatMcpConfigSnippet(
  name: string,
  config: McpServerConfig,
): string;

export declare function resolveMcpInstallConfig(
  entry: Record<string, unknown>,
  options?: McpInstallTargetOptions,
): ResolvedMcpInstallConfig | null;
