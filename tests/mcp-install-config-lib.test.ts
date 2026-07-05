import { describe, expect, it } from "vitest";

import {
  MCP_INSTALL_TARGET_IDS,
  normalizeMcpServerConfig,
  extractMcpServerConfig,
  mcpConfigSupportsTarget,
  mcpInstallTargetsForConfig,
  formatMcpConfigSnippet,
  resolveMcpInstallConfig,
} from "../packages/registry/src/mcp-install-config-lib.js";

const ALL_TARGETS = [...MCP_INSTALL_TARGET_IDS];

describe("normalizeMcpServerConfig", () => {
  it("normalizes streamable-http and serverUrl aliases", () => {
    expect(
      normalizeMcpServerConfig({
        type: "streamable-http",
        serverUrl: "https://example.com/mcp",
      }),
    ).toEqual({
      type: "http",
      url: "https://example.com/mcp",
    });
  });

  it("infers stdio and http types from command or url", () => {
    expect(normalizeMcpServerConfig({ command: "npx" })?.type).toBe("stdio");
    expect(
      normalizeMcpServerConfig({ url: "https://api.example.com/mcp" })?.type,
    ).toBe("http");
  });

  it("coerces numeric and boolean args to strings", () => {
    expect(
      normalizeMcpServerConfig({
        command: "npx",
        args: ["-y", 42, true],
      })?.args,
    ).toEqual(["-y", "42", "true"]);
  });

  it("rejects non-record values and legacy transport fields", () => {
    expect(normalizeMcpServerConfig(null)).toBeNull();
    expect(normalizeMcpServerConfig("stdio")).toBeNull();
    expect(
      normalizeMcpServerConfig({ transport: "stdio", command: "npx" }),
    ).toBeNull();
  });

  it("rejects blank serverUrl aliases and unknown transport types", () => {
    expect(normalizeMcpServerConfig({ type: "websocket" })).toBeNull();
    expect(
      normalizeMcpServerConfig({ type: "http", serverUrl: "   " }),
    ).toBeNull();
  });

  it("rejects stdio configs without a command and malformed args", () => {
    expect(normalizeMcpServerConfig({ type: "stdio" })).toBeNull();
    expect(
      normalizeMcpServerConfig({ command: "npx", args: [{ bad: true }] }),
    ).toBeNull();
    expect(
      normalizeMcpServerConfig({ command: "npx", args: "not-an-array" }),
    ).toBeNull();
  });

  it("rejects remote plaintext http but accepts https and loopback http", () => {
    expect(
      normalizeMcpServerConfig({ type: "http", url: "http://evil.example/x" }),
    ).toBeNull();
    expect(
      normalizeMcpServerConfig({
        type: "http",
        url: "https://api.example.com/mcp",
      }),
    ).not.toBeNull();
    for (const url of [
      "http://localhost:3000/mcp",
      "http://127.0.0.1:3000/mcp",
      "http://127.1.2.3:3000/mcp",
      "http://0.0.0.0:3000/mcp",
      "http://[::1]:3000/mcp",
    ]) {
      expect(
        normalizeMcpServerConfig({ type: "http", url }),
        url,
      ).not.toBeNull();
    }
  });

  it("rejects embedded URL credentials for http and sse transports", () => {
    for (const type of ["http", "sse"] as const) {
      expect(
        normalizeMcpServerConfig({
          type,
          url: "https://user:pass@remote.example.com/mcp",
        }),
      ).toBeNull();
      expect(
        normalizeMcpServerConfig({
          type,
          url: "https://token@remote.example.com/mcp",
        }),
      ).toBeNull();
      expect(
        normalizeMcpServerConfig({
          type,
          url: "https://:pass@remote.example.com/mcp",
        }),
      ).toBeNull();
    }
    expect(
      normalizeMcpServerConfig({
        type: "http",
        url: "http://user:pass@127.0.0.1:8080/mcp",
      }),
    ).toBeNull();
  });

  it("rejects non-scalar env and header records", () => {
    expect(
      normalizeMcpServerConfig({
        command: "npx",
        env: { BAD: { nested: true } },
      }),
    ).toBeNull();
    expect(
      normalizeMcpServerConfig({
        type: "http",
        url: "https://api.example.com/mcp",
        headers: { Authorization: ["Bearer", "x"] },
      }),
    ).toBeNull();
    expect(
      normalizeMcpServerConfig({
        type: "http",
        url: "https://api.example.com/mcp",
        http_headers: { Authorization: { nested: true } },
      }),
    ).toBeNull();
    expect(
      normalizeMcpServerConfig({
        type: "http",
        url: "https://api.example.com/mcp",
        env_http_headers: { TOKEN: { nested: true } },
      }),
    ).toBeNull();
  });

  it("accepts scalar env and header records on remote configs", () => {
    const normalized = normalizeMcpServerConfig({
      type: "http",
      url: "https://api.example.com/mcp",
      headers: { Authorization: "Bearer ${TOKEN}" },
      http_headers: { "X-Api-Key": "abc" },
      env_http_headers: { TOKEN: "MCP_TOKEN" },
      env: { DEBUG: true, PORT: 3000 },
    });
    expect(normalized?.headers).toEqual({ Authorization: "Bearer ${TOKEN}" });
    expect(normalized?.http_headers).toEqual({ "X-Api-Key": "abc" });
    expect(normalized?.env_http_headers).toEqual({ TOKEN: "MCP_TOKEN" });
    expect(normalized?.env).toEqual({ DEBUG: true, PORT: 3000 });
  });
});

describe("extractMcpServerConfig", () => {
  it("parses a single-server mcpServers map from a JSON string", () => {
    const extracted = extractMcpServerConfig(
      JSON.stringify({
        mcpServers: {
          docs: { command: "npx", args: ["-y", "docs-mcp"] },
        },
      }),
    );
    expect(extracted).toEqual({
      name: "docs",
      config: {
        type: "stdio",
        command: "npx",
        args: ["-y", "docs-mcp"],
      },
    });
  });

  it("accepts an already-parsed object payload", () => {
    const extracted = extractMcpServerConfig({
      mcpServers: {
        remote: { type: "http", url: "https://remote.example.com/mcp" },
      },
    });
    expect(extracted?.name).toBe("remote");
    expect(extracted?.config.url).toBe("https://remote.example.com/mcp");
  });

  it("rejects maps with zero or multiple servers and invalid inner configs", () => {
    expect(extractMcpServerConfig({ mcpServers: {} })).toBeNull();
    expect(
      extractMcpServerConfig({
        mcpServers: {
          a: { command: "npx" },
          b: { command: "node" },
        },
      }),
    ).toBeNull();
    expect(
      extractMcpServerConfig({
        mcpServers: {
          bad: { transport: "sse", url: "https://example.com/sse" },
        },
      }),
    ).toBeNull();
    expect(() => extractMcpServerConfig("not json")).toThrow(SyntaxError);
  });
});

describe("mcpConfigSupportsTarget", () => {
  it("supports every install target for a valid stdio config", () => {
    const stdio = { command: "npx", args: ["-y", "example-mcp"] };
    for (const target of ALL_TARGETS) {
      expect(mcpConfigSupportsTarget(stdio, target)).toBe(true);
    }
  });

  it("supports plain https http configs on every target", () => {
    const http = { type: "http", url: "https://api.example.com/mcp" };
    for (const target of ALL_TARGETS) {
      expect(mcpConfigSupportsTarget(http, target)).toBe(true);
    }
  });

  it("excludes codex for sse configs but keeps the other targets", () => {
    const sse = { type: "sse", url: "https://api.example.com/sse" };
    expect(mcpConfigSupportsTarget(sse, "codex")).toBe(false);
    expect(mcpInstallTargetsForConfig(sse)).toEqual([
      "claude-code",
      "cursor",
      "antigravity",
    ]);
  });

  it("requires bearer token env vars for codex when http headers are present", () => {
    const withHeaders = {
      type: "http",
      url: "https://api.example.com/mcp",
      headers: { Authorization: "Bearer placeholder" },
    };
    expect(mcpConfigSupportsTarget(withHeaders, "codex")).toBe(false);
    expect(
      mcpConfigSupportsTarget(
        { ...withHeaders, bearerTokenEnvVar: "MCP_TOKEN" },
        "codex",
      ),
    ).toBe(true);
    expect(
      mcpConfigSupportsTarget(
        { ...withHeaders, bearer_token_env_var: "MCP_TOKEN" },
        "codex",
      ),
    ).toBe(true);
    expect(mcpConfigSupportsTarget(withHeaders, "cursor")).toBe(true);
  });

  it("treats http_headers and env_http_headers as codex auth requirements", () => {
    const httpHeaders = {
      type: "http",
      url: "https://api.example.com/mcp",
      http_headers: { Authorization: "Bearer x" },
    };
    const envHeaders = {
      type: "http",
      url: "https://api.example.com/mcp",
      env_http_headers: { TOKEN: "MCP_TOKEN" },
    };
    expect(mcpConfigSupportsTarget(httpHeaders, "codex")).toBe(false);
    expect(mcpConfigSupportsTarget(envHeaders, "codex")).toBe(false);
    expect(
      mcpConfigSupportsTarget(
        { ...httpHeaders, bearerTokenEnvVar: "MCP_TOKEN" },
        "codex",
      ),
    ).toBe(true);
  });

  it("returns false for unknown targets and invalid configs", () => {
    expect(mcpConfigSupportsTarget({ command: "npx" }, "not-a-target")).toBe(
      false,
    );
    expect(mcpConfigSupportsTarget(null, "cursor")).toBe(false);
    expect(
      mcpConfigSupportsTarget({ transport: "x", command: "npx" }, "cursor"),
    ).toBe(false);
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
    expect(snippet.endsWith("\n")).toBe(true);
  });

  it("falls back to the default server name for blank labels", () => {
    expect(
      Object.keys(
        JSON.parse(formatMcpConfigSnippet("", { command: "npx" })).mcpServers,
      ),
    ).toEqual(["heyclaude-mcp"]);
    expect(
      Object.keys(
        JSON.parse(formatMcpConfigSnippet("   ", { command: "npx" }))
          .mcpServers,
      ),
    ).toEqual(["heyclaude-mcp"]);
  });
});

describe("resolveMcpInstallConfig", () => {
  it("resolves install metadata for valid MCP entries", () => {
    const resolved = resolveMcpInstallConfig({
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
      targets: ALL_TARGETS,
      config: { type: "http", url: "https://example.com/mcp" },
    });
    expect(extractMcpServerConfig(resolved?.configSnippet)?.config).toEqual({
      type: "http",
      url: "https://example.com/mcp",
    });
  });

  it("falls back to the entry slug when the server map omits a name", () => {
    const resolved = resolveMcpInstallConfig({
      category: "mcp",
      slug: "postgres-mcp",
      configSnippet: JSON.stringify({
        mcpServers: {
          "": { command: "npx", args: ["-y", "postgres-mcp"] },
        },
      }),
    });
    expect(resolved?.name).toBe("postgres-mcp");
    expect(resolved?.configSnippet).toContain('"postgres-mcp"');
  });

  it("returns null for non-mcp entries, empty snippets, and unsupported configs", () => {
    expect(
      resolveMcpInstallConfig({ category: "skills", configSnippet: "{}" }),
    ).toBeNull();
    expect(
      resolveMcpInstallConfig({ category: "mcp", configSnippet: "" }),
    ).toBeNull();
    expect(resolveMcpInstallConfig(null)).toBeNull();
    expect(
      resolveMcpInstallConfig({
        category: "mcp",
        slug: "remote-http",
        configSnippet: JSON.stringify({
          mcpServers: {
            remote: { type: "http", url: "http://mcp.example.com/mcp" },
          },
        }),
      }),
    ).toBeNull();
    expect(
      resolveMcpInstallConfig({
        category: "mcp",
        slug: "legacy-sse",
        configSnippet: JSON.stringify({
          mcpServers: {
            legacy: { transport: "sse", url: "https://example.com/sse" },
          },
        }),
      }),
    ).toBeNull();
  });

  it("ignores prose and shell snippets that are not JSON", () => {
    expect(
      resolveMcpInstallConfig({
        category: "mcp",
        slug: "manual",
        configSnippet: "npx -y some-mcp-server@latest",
      }),
    ).toBeNull();
  });

  it("keeps arbitrary stdio commands valid for registry metadata", () => {
    const resolved = resolveMcpInstallConfig({
      category: "mcp",
      slug: "shell-one-liner",
      configSnippet: JSON.stringify({
        mcpServers: {
          shell: {
            command: "bash",
            args: ["-lc", "touch /tmp/heyclaude-owned"],
          },
        },
      }),
    });
    expect(resolved).toMatchObject({
      targets: ALL_TARGETS,
      config: {
        type: "stdio",
        command: "bash",
        args: ["-lc", "touch /tmp/heyclaude-owned"],
      },
    });
  });

  it("allows loopback http urls in install metadata", () => {
    for (const url of [
      "http://127.0.0.1:3000/mcp",
      "http://0.0.0.0:3000/mcp",
    ]) {
      expect(
        resolveMcpInstallConfig({
          category: "mcp",
          slug: "loopback",
          configSnippet: JSON.stringify({
            mcpServers: { loopback: { type: "http", url } },
          }),
        })?.targets,
        url,
      ).toEqual(ALL_TARGETS);
    }
    expect(
      resolveMcpInstallConfig({
        category: "mcp",
        slug: "ipv6-loopback",
        configSnippet: JSON.stringify({
          mcpServers: {
            loopback: { type: "sse", url: "http://[::1]:3000/sse" },
          },
        }),
      })?.targets,
    ).toEqual(["claude-code", "cursor", "antigravity"]);
  });
});

describe("mcp install-config re-export compatibility", () => {
  it("exposes the install target ids constant", () => {
    expect(ALL_TARGETS).toEqual([
      "claude-code",
      "codex",
      "cursor",
      "antigravity",
    ]);
  });
});
