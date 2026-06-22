import { describe, expect, it } from "vitest";

import {
  mcpJsonConfigPathCandidates,
  defaultMcpConfigPath,
  mcpCliCandidates,
  claudeCliCandidates,
} from "../integrations/raycast/src/mcp-installer.js";

describe("mcpJsonConfigPathCandidates", () => {
  it("resolves Cursor's mcp.json under the given home directory", () => {
    expect(mcpJsonConfigPathCandidates("cursor", "/home/u")).toEqual([
      "/home/u/.cursor/mcp.json",
    ]);
  });

  it("offers the Antigravity config locations in priority order", () => {
    const candidates = mcpJsonConfigPathCandidates("antigravity", "/home/u");
    expect(candidates[0]).toBe("/home/u/.gemini/antigravity/mcp_config.json");
    expect(candidates.length).toBeGreaterThan(1);
  });
});

describe("defaultMcpConfigPath", () => {
  it("returns the first (highest priority) candidate", () => {
    expect(defaultMcpConfigPath("cursor", "/home/u")).toBe(
      mcpJsonConfigPathCandidates("cursor", "/home/u")[0],
    );
  });
});

describe("mcpCliCandidates", () => {
  it("lists the bare command name first so a PATH lookup wins", () => {
    // Trying the bare name first lets a normally-installed CLI resolve via PATH.
    expect(mcpCliCandidates("codex")[0]).toBe("codex");
    expect(mcpCliCandidates("claude-code")[0]).toBe("claude");
  });

  it("includes a stable system fallback path", () => {
    expect(mcpCliCandidates("codex")).toContain("/usr/local/bin/codex");
  });

  it("claudeCliCandidates delegates to the claude-code candidates", () => {
    expect(claudeCliCandidates()).toEqual(mcpCliCandidates("claude-code"));
  });
});
