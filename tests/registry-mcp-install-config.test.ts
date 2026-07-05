import { describe, expect, it } from "vitest";

import {
  MCP_INSTALL_TARGET_IDS,
  normalizeMcpServerConfig,
  resolveMcpInstallConfig,
} from "@heyclaude/registry/mcp-install-config";

describe("mcp-install-config re-export surface", () => {
  it("keeps the public import path wired to the extracted lib", () => {
    expect(MCP_INSTALL_TARGET_IDS).toContain("claude-code");
    expect(normalizeMcpServerConfig({ command: "npx" })?.type).toBe("stdio");
    expect(
      resolveMcpInstallConfig({
        category: "mcp",
        slug: "demo",
        configSnippet: JSON.stringify({
          mcpServers: { demo: { command: "npx" } },
        }),
      })?.name,
    ).toBe("demo");
  });
});
