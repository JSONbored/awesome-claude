import { describe, expect, it } from "vitest";

import { validateMcpConfigText } from "@/lib/mcp-config-validator";

describe("MCP config validator", () => {
  it("accepts a stdio MCP server and redacts secret-like env values", () => {
    const result = validateMcpConfigText(
      JSON.stringify({
        mcpServers: {
          github: {
            command: "npx",
            args: ["-y", "@modelcontextprotocol/server-github"],
            env: {
              GITHUB_PERSONAL_ACCESS_TOKEN: "ghp_real_token_value",
              LOG_LEVEL: "debug",
            },
          },
        },
      }),
    );

    expect(result.ok).toBe(true);
    expect(result.servers[0]).toMatchObject({
      name: "github",
      transport: "stdio",
      packageName: "@modelcontextprotocol/server-github",
    });
    expect(result.redactedSecretCount).toBe(1);
    expect(result.fixedConfigText).not.toContain("ghp_real_token_value");
    expect(result.fixedConfigText).toContain("${GITHUB_PERSONAL_ACCESS_TOKEN}");
    expect(result.reportText).toContain("Redacted secrets: 1");
  });

  it("recursively redacts header secrets and malformed env values from fixed snippets", () => {
    const result = validateMcpConfigText(
      JSON.stringify({
        mcpServers: {
          remote: {
            url: "https://example.com/mcp",
            headers: {
              Authorization: "Bearer live_remote_bearer_token_do_not_leak",
              "x-api-key": "sk-liveapikeyvaluedonotleak",
            },
            env: "LIVE_ENV_STRING_SECRET_DO_NOT_LEAK",
          },
        },
      }),
    );

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain(
      "remote: env must be an object of environment variables.",
    );
    expect(result.fixedConfigText).not.toContain(
      "live_remote_bearer_token_do_not_leak",
    );
    expect(result.fixedConfigText).not.toContain("sk-liveapikeyvaluedonotleak");
    expect(result.fixedConfigText).not.toContain(
      "LIVE_ENV_STRING_SECRET_DO_NOT_LEAK",
    );
    expect(result.fixedConfigText).toContain("${AUTHORIZATION}");
    expect(result.fixedConfigText).toContain("${X_API_KEY}");
    expect(result.fixedConfigText).toContain("${ENV}");
  });

  it("redacts secrets from remote URLs and command args in reports and fixed snippets", () => {
    const result = validateMcpConfigText(
      JSON.stringify({
        mcpServers: {
          remoteWithUrlSecret: {
            url: "https://user:password@example.com/mcp?api_key=sk-12345678901234567890&mode=read",
          },
          stdioWithArgSecrets: {
            command: "npx",
            args: [
              "-y",
              "@example/mcp",
              "token=ghp_12345678901234567890",
              "https://example.com/sse?authorization=Bearer%20abcdef1234567890",
            ],
          },
        },
      }),
    );

    expect(result.ok).toBe(true);
    expect(result.redactedSecretCount).toBe(3);
    for (const output of [result.fixedConfigText, result.reportText]) {
      expect(output).not.toContain("user:password");
      expect(output).not.toContain("sk-12345678901234567890");
      expect(output).not.toContain("ghp_12345678901234567890");
      expect(output).not.toContain("abcdef1234567890");
      expect(output).toContain("${URL_USERNAME}");
      expect(output).toContain("${URL_PASSWORD}");
      expect(output).toContain("${API_KEY}");
    }
  });

  it("redacts malformed URL-like values that contain secrets", () => {
    const result = validateMcpConfigText(
      JSON.stringify({
        mcpServers: {
          malformedRemote: {
            url: "https://bad host/sse?api_key=sk-12345678901234567890",
          },
          malformedArg: {
            command: "npx",
            args: [
              "-y",
              "@example/mcp",
              "https://bad host/sse?api_key=sk-12345678901234567890",
            ],
          },
        },
      }),
    );

    expect(result.redactedSecretCount).toBe(2);
    expect(result.fixedConfigText).not.toContain("sk-12345678901234567890");
    expect(result.reportText).not.toContain("sk-12345678901234567890");
    expect(result.fixedConfigText).toContain("${URL}");
    expect(result.reportText).toContain("${URL}");
  });

  it("redacts values after sensitive split CLI flags", () => {
    const result = validateMcpConfigText(
      JSON.stringify({
        mcpServers: {
          splitFlagSecrets: {
            command: "npx",
            args: [
              "-y",
              "@example/secure-mcp",
              "--api-key",
              "live_api_key_value_that_must;not_leak",
              "--mode",
              "read",
              "--client-secret",
              "sk-proj-clientsecretvaluethatmustnotleak",
              "--token",
              "${EXISTING_TOKEN}",
              "--authorization",
              "Bearer abcdefghijklmnopqrstuvwxyz123456",
            ],
          },
        },
      }),
    );

    expect(result.ok).toBe(true);
    expect(result.redactedSecretCount).toBe(3);
    expect(result.servers[0]).toMatchObject({
      packageName: "@example/secure-mcp",
    });
    const fixed = JSON.parse(result.fixedConfigText);
    expect(fixed.mcpServers.splitFlagSecrets.args).toEqual([
      "-y",
      "@example/secure-mcp",
      "--api-key",
      "${API_KEY}",
      "--mode",
      "read",
      "--client-secret",
      "${CLIENT_SECRET}",
      "--token",
      "${EXISTING_TOKEN}",
      "--authorization",
      "${AUTHORIZATION}",
    ]);
    for (const output of [result.fixedConfigText, result.reportText]) {
      expect(output).not.toContain("live_api_key_value_that_must;not_leak");
      expect(output).not.toContain("sk-proj-clientsecretvaluethatmustnotleak");
      expect(output).not.toContain("abcdefghijklmnopqrstuvwxyz123456");
    }
    expect(result.reportText).toContain(
      "Argument contains shell-like syntax: ${API_KEY}",
    );
  });

  it("redacts modern raw token prefixes from command args", () => {
    const result = validateMcpConfigText(
      JSON.stringify({
        mcpServers: {
          rawTokenArgs: {
            command: "npx",
            args: [
              "-y",
              "@example/token-mcp",
              "gho_abcdefghijklmnopqrstuvwxyz123456",
              "glpat-abcdefghijklmnopqrstuvwxyz123456",
            ],
          },
        },
      }),
    );

    expect(result.ok).toBe(true);
    expect(result.redactedSecretCount).toBe(2);
    expect(result.fixedConfigText).not.toContain(
      "gho_abcdefghijklmnopqrstuvwxyz123456",
    );
    expect(result.fixedConfigText).not.toContain(
      "glpat-abcdefghijklmnopqrstuvwxyz123456",
    );
    expect(result.fixedConfigText).toContain("${SECRET}");
  });

  it("preserves non-sensitive primitive values in fixed snippets", () => {
    const result = validateMcpConfigText(
      JSON.stringify({
        mcpServers: {
          typed: {
            command: "npx",
            args: ["-y", "@example/typed-mcp"],
            disabled: false,
            retries: 2,
            metadata: {
              enabled: true,
              score: 3,
              empty: null,
            },
          },
        },
      }),
    );

    const fixed = JSON.parse(result.fixedConfigText);
    expect(fixed.mcpServers.typed.disabled).toBe(false);
    expect(fixed.mcpServers.typed.retries).toBe(2);
    expect(fixed.mcpServers.typed.metadata).toEqual({
      enabled: true,
      score: 3,
      empty: null,
    });
  });

  it("blocks unsafe server names and shell pipelines", () => {
    const result = validateMcpConfigText(`{
      "mcpServers": {
        "../bad": {
          "command": "npx && rm -rf /",
          "args": ["-y"]
        }
      }
    }`);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("Server name must be");
    expect(result.errors.join("\n")).toContain("not a shell pipeline");
  });

  it("does not parse oversized configs after the size limit trips", () => {
    const result = validateMcpConfigText("x".repeat(100_001));

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual([
      "Config is too large for browser-side validation.",
    ]);
    expect(result.reportText).toContain("Errors: 1");
  });

  it("treats an empty object as missing mcpServers instead of a bare server map", () => {
    const result = validateMcpConfigText("{}");

    expect(result.ok).toBe(false);
    expect(result.warnings).not.toContain(
      "Input looked like a bare servers object; output wraps it in mcpServers.",
    );
    expect(result.errors).toContain(
      "Config must include an mcpServers object.",
    );
  });

  it("reports non-string commands and detects package runners", () => {
    const result = validateMcpConfigText(
      JSON.stringify({
        mcpServers: {
          pnpmServer: {
            command: "pnpm",
            args: ["dlx", "@example/mcp-server"],
          },
          badCommand: {
            command: ["npx"],
          },
        },
      }),
    );

    expect(result.ok).toBe(false);
    expect(
      result.servers.find((server) => server.name === "pnpmServer"),
    ).toMatchObject({
      packageName: "@example/mcp-server",
    });
    expect(result.errors.join("\n")).toContain("command must be a string");
  });

  it("wraps bare server objects and warns on placeholders", () => {
    const result = validateMcpConfigText(
      JSON.stringify({
        linear: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-linear"],
          env: {
            LINEAR_API_KEY: "${LINEAR_API_KEY}",
          },
        },
      }),
    );

    expect(result.ok).toBe(true);
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        "Input looked like a bare servers object; output wraps it in mcpServers.",
        "linear: LINEAR_API_KEY is still a placeholder.",
      ]),
    );
    expect(JSON.parse(result.fixedConfigText)).toHaveProperty("mcpServers");
  });
});
