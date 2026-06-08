import { describe, expect, it } from "vitest";

import {
  MCP_INSTALL_TARGET_IDS,
  extractMcpServerConfig,
  mcpInstallTargetsForConfig,
  normalizeMcpServerConfig,
  resolveMcpInstallConfig,
  type McpInstallTargetId,
  type ResolvedMcpInstallConfig,
} from "@heyclaude/registry";

describe("MCP install config helpers", () => {
  it("exports the install-config surface from the registry package root", () => {
    const targets: McpInstallTargetId[] = [...MCP_INSTALL_TARGET_IDS];

    expect(targets).toEqual([
      "claude-code",
      "codex",
      "cursor",
      "antigravity",
    ]);
    expect(
      mcpInstallTargetsForConfig({
        command: "npx",
        args: ["-y", "@example/mcp"],
      }),
    ).toEqual(targets);
  });

  it("normalizes streamable HTTP and serverUrl configs for artifact metadata", () => {
    expect(
      normalizeMcpServerConfig({
        type: "streamable-http",
        serverUrl: "https://example.com/mcp",
      }),
    ).toEqual({
      type: "http",
      url: "https://example.com/mcp",
    });

    const resolved: ResolvedMcpInstallConfig | null = resolveMcpInstallConfig({
      category: "mcp",
      slug: "remote-docs",
      configSnippet: JSON.stringify({
        mcpServers: {
          docs: {
            type: "streamable-http",
            serverUrl: "https://example.com/mcp",
          },
        },
      }),
    });

    expect(resolved).toMatchObject({
      name: "docs",
      targets: ["claude-code", "codex", "cursor", "antigravity"],
      config: {
        type: "http",
        url: "https://example.com/mcp",
      },
    });
    expect(extractMcpServerConfig(resolved?.configSnippet)?.config).toEqual({
      type: "http",
      url: "https://example.com/mcp",
    });
  });

  it("keeps legacy transport snippets out of machine-install metadata", () => {
    expect(
      resolveMcpInstallConfig({
        category: "mcp",
        slug: "legacy-sse",
        configSnippet: JSON.stringify({
          mcpServers: {
            legacy: {
              transport: "sse",
              url: "https://example.com/sse",
            },
          },
        }),
      }),
    ).toBeNull();
  });
});
