/**
 * MCP install-config surface.
 *
 * Pure JSON normalization helpers live in `mcp-install-config-lib.js`. This
 * module re-exports that surface so existing `@heyclaude/registry/mcp-install-config`
 * imports stay unchanged.
 */
export {
  MCP_INSTALL_TARGET_IDS,
  normalizeMcpServerConfig,
  extractMcpServerConfig,
  mcpConfigSupportsTarget,
  mcpInstallTargetsForConfig,
  formatMcpConfigSnippet,
  resolveMcpInstallConfig,
} from "./mcp-install-config-lib.js";
