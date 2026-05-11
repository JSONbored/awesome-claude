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
