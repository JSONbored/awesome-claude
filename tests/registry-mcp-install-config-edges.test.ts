import { describe, expect, it } from "vitest";

import {
  extractMcpServerConfig,
  resolveMcpInstallConfig,
} from "../packages/registry/src/mcp-install-config-lib.js";

function mcpEntry(snippet: unknown, overrides: Record<string, unknown> = {}) {
  return {
    category: "mcp",
    slug: "my-slug",
    configSnippet: JSON.stringify(snippet),
    ...overrides,
  };
}

describe("mcp-install-config-lib extractMcpServerConfig", () => {
  it("rejects json payloads that are not records", () => {
    expect(extractMcpServerConfig("[]")).toBeNull();
    expect(extractMcpServerConfig('"just-a-string"')).toBeNull();
  });

  it("rejects a non-record mcpServers map", () => {
    expect(extractMcpServerConfig({ mcpServers: "nope" })).toBeNull();
  });

  it("rejects an empty map but installs the first of several servers", () => {
    expect(extractMcpServerConfig({ mcpServers: {} })).toBeNull();
    expect(
      extractMcpServerConfig({
        mcpServers: { a: { command: "x" }, b: { command: "y" } },
      }),
    ).toEqual({ name: "a", config: { command: "x", type: "stdio" } });
  });

  it("extracts a single normalized stdio server", () => {
    expect(
      extractMcpServerConfig({
        mcpServers: { demo: { command: "npx", args: ["-y", "demo"] } },
      }),
    ).toEqual({
      name: "demo",
      config: { command: "npx", args: ["-y", "demo"], type: "stdio" },
    });
  });
});

describe("mcp-install-config-lib resolveMcpInstallConfig", () => {
  it("ignores non-mcp entries and blank snippets", () => {
    expect(
      resolveMcpInstallConfig({ category: "skills", configSnippet: "{}" }),
    ).toBeNull();
    expect(
      resolveMcpInstallConfig({ category: "mcp", configSnippet: "   " }),
    ).toBeNull();
  });

  it("returns null for an unparseable snippet", () => {
    expect(
      resolveMcpInstallConfig({ category: "mcp", configSnippet: "{oops" }),
    ).toBeNull();
  });

  it("uses the extracted server name when present", () => {
    expect(
      resolveMcpInstallConfig(
        mcpEntry({ mcpServers: { demo: { command: "npx" } } }),
      )?.name,
    ).toBe("demo");
  });

  it("falls back to the entry slug when the server name is blank", () => {
    expect(
      resolveMcpInstallConfig(
        mcpEntry({ mcpServers: { "": { command: "npx" } } }),
      )?.name,
    ).toBe("my-slug");
  });
});
