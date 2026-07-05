/**
 * MCP registry statistics surface.
 *
 * Pure MCP stats helpers live in `mcp-stats-lib.ts`. This module re-exports that
 * surface so existing `@/lib/mcp-stats` imports stay unchanged.
 */
export type { McpAuth, McpTransport, StatRow } from "@/lib/mcp-stats-lib";
export {
  authDistribution,
  classifyAuth,
  classifyTransport,
  hostingDistribution,
  hostingOf,
  supplyChainCoverage,
  transportDistribution,
} from "@/lib/mcp-stats-lib";
