import { describe, expect, it } from "vitest";

import {
  MCP_INSTALL_TARGET_IDS,
  mcpConfigSupportsTarget,
  formatMcpConfigSnippet,
  normalizeMcpServerConfig,
} from "@heyclaude/registry/mcp-install-config";

describe("mcpConfigSupportsTarget", () => {
  it("supports every install target for a valid stdio config", () => {
    const stdio = { command: "npx", args: ["-y", "example-mcp"] };
    for (const target of MCP_INSTALL_TARGET_IDS) {
      expect(mcpConfigSupportsTarget(stdio, target)).toBe(true);
    }
  });

  it("supports a plain http config (no custom headers) on every target", () => {
    const http = { type: "http", url: "https://api.example.com/mcp" };
    for (const target of MCP_INSTALL_TARGET_IDS) {
      expect(mcpConfigSupportsTarget(http, target)).toBe(true);
    }
  });

  it("excludes codex for an sse config but keeps the other targets", () => {
    const sse = { type: "sse", url: "https://api.example.com/sse" };
    expect(mcpConfigSupportsTarget(sse, "codex")).toBe(false);
    expect(mcpConfigSupportsTarget(sse, "cursor")).toBe(true);
    expect(mcpConfigSupportsTarget(sse, "claude-code")).toBe(true);
  });

  it("requires a bearer token env var for codex when http headers are present", () => {
    const withHeaders = {
      type: "http",
      url: "https://api.example.com/mcp",
      headers: { Authorization: "Bearer placeholder" },
    };
    expect(mcpConfigSupportsTarget(withHeaders, "codex")).toBe(false);

    const withBearerEnv = { ...withHeaders, bearerTokenEnvVar: "MCP_TOKEN" };
    expect(mcpConfigSupportsTarget(withBearerEnv, "codex")).toBe(true);
    // Other targets are unaffected by the codex-only header rule.
    expect(mcpConfigSupportsTarget(withHeaders, "cursor")).toBe(true);
  });

  it("returns false for unknown targets and invalid configs", () => {
    const stdio = { command: "npx" };
    expect(mcpConfigSupportsTarget(stdio, "not-a-target")).toBe(false);
    expect(
      mcpConfigSupportsTarget({ transport: "x", command: "npx" }, "cursor"),
    ).toBe(false);
    expect(mcpConfigSupportsTarget(null, "cursor")).toBe(false);
  });
});

describe("formatMcpConfigSnippet", () => {
  it("wraps the config under mcpServers keyed by the server name", () => {
    const snippet = formatMcpConfigSnippet("my-server", {
      type: "stdio",
      command: "npx",
    });
    expect(JSON.parse(snippet)).toEqual({
      mcpServers: { "my-server": { type: "stdio", command: "npx" } },
    });
  });

  it("falls back to a default name and ends with a trailing newline", () => {
    const snippet = formatMcpConfigSnippet("", { type: "stdio", command: "x" });
    expect(snippet.endsWith("\n")).toBe(true);
    expect(Object.keys(JSON.parse(snippet).mcpServers)).toEqual([
      "heyclaude-mcp",
    ]);
  });
});

describe("normalizeMcpServerConfig rejection paths", () => {
  it("rejects configs that carry an explicit transport field", () => {
    expect(
      normalizeMcpServerConfig({ transport: "stdio", command: "npx" }),
    ).toBeNull();
  });

  it("rejects non-loopback plaintext http urls but accepts https and loopback", () => {
    expect(
      normalizeMcpServerConfig({ type: "http", url: "http://evil.example/x" }),
    ).toBeNull();
    expect(
      normalizeMcpServerConfig({
        type: "http",
        url: "https://api.example.com/mcp",
      }),
    ).not.toBeNull();
    expect(
      normalizeMcpServerConfig({
        type: "http",
        url: "http://localhost:3000/mcp",
      }),
    ).not.toBeNull();
  });

  it("infers stdio/http type from command or url and rejects malformed args", () => {
    expect(normalizeMcpServerConfig({ command: "npx" })?.type).toBe("stdio");
    expect(
      normalizeMcpServerConfig({ url: "https://api.example.com/mcp" })?.type,
    ).toBe("http");
    expect(
      normalizeMcpServerConfig({ command: "npx", args: [{ bad: true }] }),
    ).toBeNull();
  });
});
