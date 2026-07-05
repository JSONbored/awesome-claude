import { describe, expect, it } from "vitest";

import {
  mcpConfigSupportsTarget,
  mcpInstallTargetsForConfig,
} from "../integrations/raycast/src/mcp-installer.js";

describe("Raycast MCP installer URL credential hardening", () => {
  it("rejects http/sse URLs that embed a user and password", () => {
    for (const type of ["http", "sse"] as const) {
      const config = {
        type,
        url: "https://user:pass@remote.example.com/mcp",
      };
      expect(mcpConfigSupportsTarget(config, "claude-code")).toBe(false);
      expect(mcpInstallTargetsForConfig(config)).toEqual([]);
    }
  });

  it("rejects a bare userinfo token with no password", () => {
    const config = {
      type: "http",
      url: "https://supersecrettoken@remote.example.com/mcp",
    };
    expect(mcpConfigSupportsTarget(config, "claude-code")).toBe(false);
    expect(mcpInstallTargetsForConfig(config)).toEqual([]);
  });

  it("rejects embedded credentials even on a loopback http URL", () => {
    const config = {
      type: "http",
      url: "http://user:pass@127.0.0.1:8080/mcp",
    };
    expect(mcpConfigSupportsTarget(config, "claude-code")).toBe(false);
    expect(mcpInstallTargetsForConfig(config)).toEqual([]);
  });

  it("accepts a clean remote https URL", () => {
    const config = {
      type: "http",
      url: "https://remote.example.com/mcp",
    };
    expect(mcpConfigSupportsTarget(config, "claude-code")).toBe(true);
    expect(mcpInstallTargetsForConfig(config)).toContain("claude-code");
  });

  it("accepts a clean loopback http URL", () => {
    const config = {
      type: "http",
      url: "http://127.0.0.1:8080/mcp",
    };
    expect(mcpConfigSupportsTarget(config, "claude-code")).toBe(true);
    expect(mcpInstallTargetsForConfig(config)).toContain("claude-code");
  });
});
