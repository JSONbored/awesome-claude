import { describe, expect, it } from "vitest";

import {
  extractMcpServerConfig,
  normalizeMcpServerConfig,
} from "@heyclaude/registry";

// Remote MCP server configs authenticate through the dedicated `headers`,
// `http_headers`, `env_http_headers`, and `bearerTokenEnvVar` fields. A URL that
// embeds credentials (`user:pass@host`, or a bare `token@host`) is therefore
// both redundant and unsafe: the secret lands in logs and saved client configs
// as plaintext. `normalizeMcpServerConfig` must reject such URLs for `http` and
// `sse` transports while still accepting clean remote URLs, loopback `http`, and
// `stdio` configs unchanged.
describe("normalizeMcpServerConfig URL credential hardening", () => {
  it("rejects http/sse URLs that embed a user and password", () => {
    for (const type of ["http", "sse"] as const) {
      expect(
        normalizeMcpServerConfig({
          type,
          url: "https://user:pass@remote.example.com/mcp",
        }),
      ).toBeNull();
    }
  });

  it("rejects a bare userinfo token with no password", () => {
    // `https://token@host` has a username but no password; it is still embedded
    // credential material and must be rejected.
    expect(
      normalizeMcpServerConfig({
        type: "http",
        url: "https://supersecrettoken@remote.example.com/mcp",
      }),
    ).toBeNull();
  });

  it("rejects a URL that carries only a password component", () => {
    // `https://:pass@host` sets the password but leaves the username empty.
    expect(
      normalizeMcpServerConfig({
        type: "http",
        url: "https://:p4ssw0rd@remote.example.com/mcp",
      }),
    ).toBeNull();
  });

  it("rejects percent-encoded credentials in the URL", () => {
    // `user%40name:pass` decodes to embedded credentials and must not slip past.
    expect(
      normalizeMcpServerConfig({
        type: "http",
        url: "https://user%40name:pass@remote.example.com/mcp",
      }),
    ).toBeNull();
  });

  it("rejects embedded credentials even on a loopback http URL", () => {
    // Loopback http is otherwise allowed, but credentials in the URL are not.
    expect(
      normalizeMcpServerConfig({
        type: "http",
        url: "http://user:pass@127.0.0.1:8080/mcp",
      }),
    ).toBeNull();
  });

  it("rejects embedded credentials supplied via the serverUrl alias", () => {
    // `serverUrl` is normalized onto `url`, so the same guard must apply.
    expect(
      normalizeMcpServerConfig({
        type: "http",
        serverUrl: "https://user:pass@remote.example.com/mcp",
      }),
    ).toBeNull();
  });

  it("accepts a clean remote https URL", () => {
    const normalized = normalizeMcpServerConfig({
      type: "http",
      url: "https://remote.example.com/mcp",
    });
    expect(normalized).not.toBeNull();
    expect(normalized?.url).toBe("https://remote.example.com/mcp");
  });

  it("accepts a clean loopback http URL", () => {
    const normalized = normalizeMcpServerConfig({
      type: "http",
      url: "http://127.0.0.1:8080/mcp",
    });
    expect(normalized).not.toBeNull();
    expect(normalized?.url).toBe("http://127.0.0.1:8080/mcp");
  });

  it("keeps proper header-based auth working without URL credentials", () => {
    // Auth belongs here, not in the URL — this config must remain valid.
    const normalized = normalizeMcpServerConfig({
      type: "http",
      url: "https://remote.example.com/mcp",
      headers: { Authorization: "Bearer ${TOKEN}" },
    });
    expect(normalized).not.toBeNull();
    expect(normalized?.headers).toEqual({ Authorization: "Bearer ${TOKEN}" });
  });

  it("leaves stdio command configs unaffected", () => {
    const normalized = normalizeMcpServerConfig({
      type: "stdio",
      command: "uvx",
      args: ["some-mcp-server@latest"],
    });
    expect(normalized).not.toBeNull();
    expect(normalized?.type).toBe("stdio");
  });

  it("rejects embedded credentials through extractMcpServerConfig too", () => {
    // The same guard must hold when the config arrives as a full mcpServers map.
    const snippet = JSON.stringify({
      mcpServers: {
        remote: {
          type: "http",
          url: "https://user:pass@remote.example.com/mcp",
        },
      },
    });
    expect(extractMcpServerConfig(snippet)).toBeNull();
  });

  it("extracts a clean remote config from an mcpServers map", () => {
    const snippet = JSON.stringify({
      mcpServers: {
        remote: { type: "http", url: "https://remote.example.com/mcp" },
      },
    });
    const extracted = extractMcpServerConfig(snippet);
    expect(extracted?.name).toBe("remote");
    expect(extracted?.config.url).toBe("https://remote.example.com/mcp");
  });
});
