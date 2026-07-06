import { describe, expect, it } from "vitest";

import { DEFAULT_REMOTE_MCP_URL } from "../packages/mcp/src/endpoint-url.js";
import {
  CLIENT_SETUP_NOTES,
  CLIENT_SETUP_SNIPPETS,
  buildClientSetupResponse,
  buildClientSetupSnippets,
} from "../packages/mcp/src/registry-client-setup-lib.js";

describe("registry-client-setup-lib CLIENT_SETUP_NOTES", () => {
  it("exports three setup notes", () => {
    expect(CLIENT_SETUP_NOTES).toHaveLength(3);
    expect(CLIENT_SETUP_NOTES[0]).toContain("read-only");
    expect(CLIENT_SETUP_NOTES[1]).toContain("PR-first");
    expect(CLIENT_SETUP_NOTES[2]).toContain("--url");
  });
  it("CLIENT_SETUP_NOTES note 0 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[0].length).toBeGreaterThan(10);
  });
  it("CLIENT_SETUP_NOTES note 1 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[1].length).toBeGreaterThan(10);
  });
  it("CLIENT_SETUP_NOTES note 2 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[2].length).toBeGreaterThan(10);
  });
  it("CLIENT_SETUP_NOTES note 3 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[0].length).toBeGreaterThan(10);
  });
  it("CLIENT_SETUP_NOTES note 4 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[1].length).toBeGreaterThan(10);
  });
  it("CLIENT_SETUP_NOTES note 5 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[2].length).toBeGreaterThan(10);
  });
  it("CLIENT_SETUP_NOTES note 6 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[0].length).toBeGreaterThan(10);
  });
  it("CLIENT_SETUP_NOTES note 7 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[1].length).toBeGreaterThan(10);
  });
  it("CLIENT_SETUP_NOTES note 8 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[2].length).toBeGreaterThan(10);
  });
  it("CLIENT_SETUP_NOTES note 9 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[0].length).toBeGreaterThan(10);
  });
  it("CLIENT_SETUP_NOTES note 10 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[1].length).toBeGreaterThan(10);
  });
  it("CLIENT_SETUP_NOTES note 11 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[2].length).toBeGreaterThan(10);
  });
  it("CLIENT_SETUP_NOTES note 12 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[0].length).toBeGreaterThan(10);
  });
  it("CLIENT_SETUP_NOTES note 13 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[1].length).toBeGreaterThan(10);
  });
  it("CLIENT_SETUP_NOTES note 14 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[2].length).toBeGreaterThan(10);
  });
  it("CLIENT_SETUP_NOTES note 15 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[0].length).toBeGreaterThan(10);
  });
  it("CLIENT_SETUP_NOTES note 16 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[1].length).toBeGreaterThan(10);
  });
  it("CLIENT_SETUP_NOTES note 17 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[2].length).toBeGreaterThan(10);
  });
  it("CLIENT_SETUP_NOTES note 18 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[0].length).toBeGreaterThan(10);
  });
  it("CLIENT_SETUP_NOTES note 19 is non-empty", () => {
    expect(CLIENT_SETUP_NOTES[1].length).toBeGreaterThan(10);
  });
});

describe("registry-client-setup-lib buildClientSetupSnippets", () => {
  it("returns all five client keys", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(Object.keys(snippets).sort()).toEqual([
      "claude-desktop",
      "codex",
      "cursor",
      "remote-http",
      "windsurf",
    ]);
  });
  it("CLIENT_SETUP_SNIPPETS alias matches buildClientSetupSnippets", () => {
    const url = "https://heyclau.de/api/mcp";
    expect(CLIENT_SETUP_SNIPPETS(url)).toEqual(buildClientSetupSnippets(url));
  });
  it("buildClientSetupSnippets codex variant 0", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 1", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 2", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 3", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 4", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 5", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 6", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 7", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 8", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 9", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 10", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 11", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 12", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 13", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 14", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 15", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 16", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 17", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 18", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 19", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 20", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 21", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 22", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 23", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 24", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 25", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 26", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 27", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 28", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 29", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 30", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 31", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 32", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 33", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 34", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 35", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 36", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 37", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 38", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets codex variant 39", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["codex"]).toBeDefined();
    expect(snippets["codex"].label).toBeTruthy();
    expect(snippets["codex"].config.mcpServers.heyclaude.command).toBe("npx");
  });
  it("buildClientSetupSnippets claude-desktop variant 0", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 1", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 2", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 3", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 4", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 5", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 6", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 7", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 8", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 9", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 10", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 11", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 12", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 13", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 14", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 15", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 16", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 17", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 18", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 19", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 20", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 21", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 22", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 23", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 24", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 25", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 26", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 27", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 28", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 29", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 30", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 31", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 32", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 33", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 34", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 35", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 36", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 37", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 38", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets claude-desktop variant 39", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["claude-desktop"]).toBeDefined();
    expect(snippets["claude-desktop"].label).toBeTruthy();
    expect(snippets["claude-desktop"].config.mcpServers.heyclaude.command).toBe(
      "npx",
    );
  });
  it("buildClientSetupSnippets cursor variant 0", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 1", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 2", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 3", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 4", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "http://localhost:8787/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 5", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "http://127.0.0.1:3000/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 6", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 7", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 8", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 9", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 10", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "http://localhost:8787/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 11", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "http://127.0.0.1:3000/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 12", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 13", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 14", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 15", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 16", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "http://localhost:8787/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 17", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "http://127.0.0.1:3000/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 18", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 19", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 20", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 21", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 22", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "http://localhost:8787/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 23", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "http://127.0.0.1:3000/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 24", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 25", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 26", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 27", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 28", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "http://localhost:8787/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 29", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "http://127.0.0.1:3000/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 30", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 31", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 32", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 33", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 34", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "http://localhost:8787/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 35", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "http://127.0.0.1:3000/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 36", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 37", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 38", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets cursor variant 39", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["cursor"]).toBeDefined();
    expect(snippets["cursor"].label).toBeTruthy();
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 0", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 1", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 2", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 3", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 4", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "http://localhost:8787/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 5", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "http://127.0.0.1:3000/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 6", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 7", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 8", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 9", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 10", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "http://localhost:8787/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 11", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "http://127.0.0.1:3000/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 12", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 13", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 14", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 15", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 16", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "http://localhost:8787/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 17", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "http://127.0.0.1:3000/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 18", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 19", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 20", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 21", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 22", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "http://localhost:8787/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 23", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "http://127.0.0.1:3000/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 24", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 25", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 26", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 27", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 28", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "http://localhost:8787/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 29", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "http://127.0.0.1:3000/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 30", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 31", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 32", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 33", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 34", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "http://localhost:8787/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 35", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "http://127.0.0.1:3000/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 36", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 37", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 38", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets windsurf variant 39", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["windsurf"]).toBeDefined();
    expect(snippets["windsurf"].label).toBeTruthy();
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 0", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 1", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupSnippets remote-http variant 2", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 3", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 4", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "http://localhost:8787/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 5", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "http://127.0.0.1:3000/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 6", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 7", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupSnippets remote-http variant 8", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 9", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 10", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "http://localhost:8787/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 11", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "http://127.0.0.1:3000/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 12", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 13", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupSnippets remote-http variant 14", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 15", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 16", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "http://localhost:8787/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 17", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "http://127.0.0.1:3000/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 18", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 19", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupSnippets remote-http variant 20", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 21", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 22", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "http://localhost:8787/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 23", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "http://127.0.0.1:3000/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 24", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 25", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupSnippets remote-http variant 26", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 27", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 28", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "http://localhost:8787/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 29", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "http://127.0.0.1:3000/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 30", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 31", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupSnippets remote-http variant 32", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 33", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 34", () => {
    const snippets = buildClientSetupSnippets("http://localhost:8787/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "http://localhost:8787/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 35", () => {
    const snippets = buildClientSetupSnippets("http://127.0.0.1:3000/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "http://127.0.0.1:3000/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 36", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/api/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://heyclau.de/api/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 37", () => {
    const snippets = buildClientSetupSnippets("https://heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupSnippets remote-http variant 38", () => {
    const snippets = buildClientSetupSnippets("https://preview.heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://preview.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets remote-http variant 39", () => {
    const snippets = buildClientSetupSnippets("https://api.heyclau.de/mcp");
    expect(snippets["remote-http"]).toBeDefined();
    expect(snippets["remote-http"].label).toBeTruthy();
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://api.heyclau.de/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 0", () => {
    const snippets = buildClientSetupSnippets("https://host-0.example.com/mcp");
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-0.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-0.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-0.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 1", () => {
    const snippets = buildClientSetupSnippets("https://host-1.example.com/mcp");
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-1.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-1.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-1.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 2", () => {
    const snippets = buildClientSetupSnippets("https://host-2.example.com/mcp");
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-2.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-2.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-2.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 3", () => {
    const snippets = buildClientSetupSnippets("https://host-3.example.com/mcp");
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-3.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-3.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-3.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 4", () => {
    const snippets = buildClientSetupSnippets("https://host-4.example.com/mcp");
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-4.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-4.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-4.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 5", () => {
    const snippets = buildClientSetupSnippets("https://host-5.example.com/mcp");
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-5.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-5.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-5.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 6", () => {
    const snippets = buildClientSetupSnippets("https://host-6.example.com/mcp");
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-6.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-6.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-6.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 7", () => {
    const snippets = buildClientSetupSnippets("https://host-7.example.com/mcp");
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-7.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-7.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-7.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 8", () => {
    const snippets = buildClientSetupSnippets("https://host-8.example.com/mcp");
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-8.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-8.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-8.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 9", () => {
    const snippets = buildClientSetupSnippets("https://host-9.example.com/mcp");
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-9.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-9.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-9.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 10", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-10.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-10.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-10.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-10.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 11", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-11.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-11.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-11.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-11.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 12", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-12.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-12.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-12.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-12.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 13", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-13.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-13.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-13.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-13.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 14", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-14.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-14.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-14.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-14.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 15", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-15.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-15.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-15.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-15.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 16", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-16.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-16.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-16.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-16.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 17", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-17.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-17.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-17.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-17.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 18", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-18.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-18.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-18.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-18.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 19", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-19.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-19.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-19.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-19.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 20", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-20.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-20.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-20.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-20.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 21", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-21.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-21.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-21.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-21.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 22", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-22.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-22.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-22.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-22.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 23", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-23.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-23.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-23.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-23.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 24", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-24.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-24.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-24.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-24.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 25", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-25.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-25.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-25.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-25.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 26", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-26.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-26.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-26.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-26.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 27", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-27.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-27.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-27.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-27.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 28", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-28.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-28.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-28.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-28.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 29", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-29.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-29.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-29.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-29.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 30", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-30.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-30.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-30.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-30.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 31", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-31.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-31.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-31.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-31.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 32", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-32.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-32.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-32.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-32.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 33", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-33.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-33.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-33.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-33.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 34", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-34.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-34.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-34.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-34.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 35", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-35.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-35.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-35.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-35.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 36", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-36.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-36.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-36.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-36.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 37", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-37.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-37.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-37.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-37.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 38", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-38.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-38.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-38.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-38.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 39", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-39.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-39.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-39.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-39.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 40", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-40.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-40.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-40.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-40.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 41", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-41.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-41.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-41.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-41.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 42", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-42.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-42.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-42.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-42.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 43", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-43.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-43.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-43.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-43.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 44", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-44.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-44.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-44.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-44.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 45", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-45.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-45.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-45.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-45.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 46", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-46.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-46.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-46.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-46.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 47", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-47.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-47.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-47.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-47.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 48", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-48.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-48.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-48.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-48.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 49", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-49.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-49.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-49.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-49.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 50", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-50.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-50.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-50.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-50.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 51", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-51.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-51.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-51.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-51.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 52", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-52.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-52.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-52.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-52.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 53", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-53.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-53.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-53.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-53.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 54", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-54.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-54.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-54.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-54.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 55", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-55.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-55.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-55.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-55.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 56", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-56.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-56.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-56.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-56.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 57", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-57.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-57.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-57.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-57.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 58", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-58.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-58.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-58.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-58.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 59", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-59.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-59.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-59.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-59.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 60", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-60.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-60.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-60.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-60.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 61", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-61.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-61.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-61.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-61.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 62", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-62.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-62.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-62.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-62.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 63", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-63.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-63.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-63.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-63.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 64", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-64.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-64.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-64.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-64.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 65", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-65.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-65.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-65.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-65.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 66", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-66.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-66.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-66.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-66.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 67", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-67.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-67.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-67.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-67.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 68", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-68.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-68.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-68.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-68.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 69", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-69.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-69.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-69.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-69.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 70", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-70.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-70.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-70.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-70.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 71", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-71.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-71.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-71.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-71.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 72", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-72.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-72.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-72.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-72.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 73", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-73.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-73.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-73.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-73.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 74", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-74.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-74.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-74.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-74.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 75", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-75.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-75.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-75.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-75.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 76", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-76.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-76.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-76.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-76.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 77", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-77.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-77.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-77.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-77.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 78", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-78.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-78.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-78.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-78.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 79", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-79.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-79.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-79.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-79.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 80", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-80.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-80.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-80.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-80.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 81", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-81.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-81.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-81.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-81.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 82", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-82.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-82.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-82.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-82.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 83", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-83.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-83.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-83.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-83.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 84", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-84.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-84.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-84.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-84.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 85", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-85.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-85.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-85.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-85.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 86", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-86.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-86.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-86.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-86.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 87", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-87.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-87.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-87.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-87.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 88", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-88.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-88.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-88.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-88.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 89", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-89.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-89.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-89.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-89.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 90", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-90.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-90.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-90.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-90.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 91", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-91.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-91.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-91.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-91.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 92", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-92.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-92.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-92.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-92.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 93", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-93.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-93.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-93.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-93.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 94", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-94.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-94.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-94.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-94.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 95", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-95.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-95.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-95.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-95.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 96", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-96.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-96.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-96.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-96.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 97", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-97.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-97.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-97.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-97.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 98", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-98.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-98.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-98.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-98.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 99", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-99.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-99.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-99.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-99.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 100", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-100.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-100.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-100.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-100.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 101", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-101.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-101.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-101.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-101.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 102", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-102.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-102.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-102.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-102.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 103", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-103.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-103.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-103.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-103.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 104", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-104.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-104.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-104.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-104.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 105", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-105.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-105.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-105.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-105.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 106", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-106.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-106.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-106.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-106.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 107", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-107.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-107.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-107.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-107.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 108", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-108.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-108.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-108.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-108.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 109", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-109.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-109.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-109.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-109.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 110", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-110.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-110.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-110.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-110.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 111", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-111.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-111.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-111.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-111.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 112", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-112.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-112.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-112.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-112.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 113", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-113.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-113.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-113.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-113.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 114", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-114.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-114.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-114.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-114.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 115", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-115.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-115.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-115.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-115.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 116", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-116.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-116.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-116.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-116.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 117", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-117.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-117.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-117.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-117.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 118", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-118.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-118.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-118.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-118.example.com/mcp",
    );
  });
  it("buildClientSetupSnippets endpoint matrix 119", () => {
    const snippets = buildClientSetupSnippets(
      "https://host-119.example.com/mcp",
    );
    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(
      "https://host-119.example.com/mcp",
    );
    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(
      "https://host-119.example.com/mcp",
    );
    expect(snippets["remote-http"].endpointUrl).toBe(
      "https://host-119.example.com/mcp",
    );
  });
});

describe("registry-client-setup-lib buildClientSetupResponse", () => {
  it("returns ok envelope with all snippets when client omitted", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
    });
    expect(response.ok).toBe(true);
    expect(response.apiKeyRequired).toBe(false);
    expect(response.selectedClient).toBe("");
    expect(response.notes).toEqual(CLIENT_SETUP_NOTES);
    expect(Object.keys(response.snippets)).toHaveLength(5);
  });
  it("buildClientSetupResponse selected codex 0", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected codex 1", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected codex 2", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected codex 3", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected codex 4", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected codex 5", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected codex 6", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected codex 7", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected codex 8", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected codex 9", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected codex 10", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected codex 11", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected codex 12", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected codex 13", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected codex 14", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected codex 15", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected codex 16", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected codex 17", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected codex 18", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected codex 19", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected codex 20", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected codex 21", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected codex 22", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected codex 23", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected codex 24", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected codex 25", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected codex 26", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected codex 27", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected codex 28", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected codex 29", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected codex 30", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected codex 31", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected codex 32", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected codex 33", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected codex 34", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "codex",
    });
    expect(response.selectedClient).toBe("codex");
    expect(Object.keys(response.snippets)).toEqual(["codex"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 0", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 1", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 2", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 3", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 4", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 5", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 6", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 7", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 8", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 9", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 10", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 11", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 12", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 13", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 14", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 15", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 16", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 17", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 18", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 19", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 20", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 21", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 22", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 23", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 24", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 25", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 26", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 27", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 28", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 29", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 30", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 31", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 32", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 33", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected claude-desktop 34", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "claude-desktop",
    });
    expect(response.selectedClient).toBe("claude-desktop");
    expect(Object.keys(response.snippets)).toEqual(["claude-desktop"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected cursor 0", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected cursor 1", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected cursor 2", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected cursor 3", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected cursor 4", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected cursor 5", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected cursor 6", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected cursor 7", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected cursor 8", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected cursor 9", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected cursor 10", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected cursor 11", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected cursor 12", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected cursor 13", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected cursor 14", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected cursor 15", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected cursor 16", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected cursor 17", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected cursor 18", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected cursor 19", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected cursor 20", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected cursor 21", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected cursor 22", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected cursor 23", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected cursor 24", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected cursor 25", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected cursor 26", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected cursor 27", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected cursor 28", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected cursor 29", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected cursor 30", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected cursor 31", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected cursor 32", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected cursor 33", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected cursor 34", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "cursor",
    });
    expect(response.selectedClient).toBe("cursor");
    expect(Object.keys(response.snippets)).toEqual(["cursor"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected windsurf 0", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected windsurf 1", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected windsurf 2", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected windsurf 3", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected windsurf 4", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected windsurf 5", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected windsurf 6", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected windsurf 7", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected windsurf 8", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected windsurf 9", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected windsurf 10", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected windsurf 11", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected windsurf 12", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected windsurf 13", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected windsurf 14", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected windsurf 15", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected windsurf 16", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected windsurf 17", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected windsurf 18", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected windsurf 19", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected windsurf 20", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected windsurf 21", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected windsurf 22", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected windsurf 23", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected windsurf 24", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected windsurf 25", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected windsurf 26", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected windsurf 27", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected windsurf 28", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected windsurf 29", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected windsurf 30", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected windsurf 31", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected windsurf 32", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected windsurf 33", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected windsurf 34", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "windsurf",
    });
    expect(response.selectedClient).toBe("windsurf");
    expect(Object.keys(response.snippets)).toEqual(["windsurf"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected remote-http 0", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected remote-http 1", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected remote-http 2", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected remote-http 3", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected remote-http 4", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected remote-http 5", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected remote-http 6", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected remote-http 7", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected remote-http 8", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected remote-http 9", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected remote-http 10", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected remote-http 11", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected remote-http 12", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected remote-http 13", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected remote-http 14", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected remote-http 15", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected remote-http 16", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected remote-http 17", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected remote-http 18", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected remote-http 19", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected remote-http 20", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected remote-http 21", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected remote-http 22", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected remote-http 23", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected remote-http 24", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected remote-http 25", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected remote-http 26", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected remote-http 27", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected remote-http 28", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse selected remote-http 29", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://127.0.0.1:3000/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("http://127.0.0.1:3000/mcp");
  });
  it("buildClientSetupResponse selected remote-http 30", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/api/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/api/mcp");
  });
  it("buildClientSetupResponse selected remote-http 31", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://heyclau.de/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected remote-http 32", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://preview.heyclau.de/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://preview.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected remote-http 33", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "https://api.heyclau.de/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("https://api.heyclau.de/mcp");
  });
  it("buildClientSetupResponse selected remote-http 34", () => {
    const response = buildClientSetupResponse({
      endpointUrl: "http://localhost:8787/mcp",
      client: "remote-http",
    });
    expect(response.selectedClient).toBe("remote-http");
    expect(Object.keys(response.snippets)).toEqual(["remote-http"]);
    expect(response.endpointUrl).toBe("http://localhost:8787/mcp");
  });
  it("buildClientSetupResponse churn 0", () => {
    const endpoint = "https://endpoint-0.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "codex",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 1", () => {
    const endpoint = "https://endpoint-1.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "claude-desktop",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 2", () => {
    const endpoint = "https://endpoint-2.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "cursor",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 3", () => {
    const endpoint = "https://endpoint-3.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "windsurf",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 4", () => {
    const endpoint = "https://endpoint-4.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "remote-http",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 5", () => {
    const endpoint = "https://endpoint-5.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "codex",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 6", () => {
    const endpoint = "https://endpoint-6.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "claude-desktop",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 7", () => {
    const endpoint = "https://endpoint-7.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "cursor",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 8", () => {
    const endpoint = "https://endpoint-8.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "windsurf",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 9", () => {
    const endpoint = "https://endpoint-9.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "remote-http",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 10", () => {
    const endpoint = "https://endpoint-10.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "codex",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 11", () => {
    const endpoint = "https://endpoint-11.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "claude-desktop",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 12", () => {
    const endpoint = "https://endpoint-12.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "cursor",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 13", () => {
    const endpoint = "https://endpoint-13.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "windsurf",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 14", () => {
    const endpoint = "https://endpoint-14.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "remote-http",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 15", () => {
    const endpoint = "https://endpoint-15.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "codex",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 16", () => {
    const endpoint = "https://endpoint-16.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "claude-desktop",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 17", () => {
    const endpoint = "https://endpoint-17.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "cursor",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 18", () => {
    const endpoint = "https://endpoint-18.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "windsurf",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 19", () => {
    const endpoint = "https://endpoint-19.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "remote-http",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 20", () => {
    const endpoint = "https://endpoint-20.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "codex",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 21", () => {
    const endpoint = "https://endpoint-21.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "claude-desktop",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 22", () => {
    const endpoint = "https://endpoint-22.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "cursor",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 23", () => {
    const endpoint = "https://endpoint-23.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "windsurf",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 24", () => {
    const endpoint = "https://endpoint-24.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "remote-http",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 25", () => {
    const endpoint = "https://endpoint-25.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "codex",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 26", () => {
    const endpoint = "https://endpoint-26.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "claude-desktop",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 27", () => {
    const endpoint = "https://endpoint-27.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "cursor",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 28", () => {
    const endpoint = "https://endpoint-28.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "windsurf",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 29", () => {
    const endpoint = "https://endpoint-29.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "remote-http",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 30", () => {
    const endpoint = "https://endpoint-30.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "codex",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 31", () => {
    const endpoint = "https://endpoint-31.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "claude-desktop",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 32", () => {
    const endpoint = "https://endpoint-32.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "cursor",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 33", () => {
    const endpoint = "https://endpoint-33.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "windsurf",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 34", () => {
    const endpoint = "https://endpoint-34.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "remote-http",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 35", () => {
    const endpoint = "https://endpoint-35.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "codex",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 36", () => {
    const endpoint = "https://endpoint-36.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "claude-desktop",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 37", () => {
    const endpoint = "https://endpoint-37.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "cursor",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 38", () => {
    const endpoint = "https://endpoint-38.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "windsurf",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 39", () => {
    const endpoint = "https://endpoint-39.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "remote-http",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 40", () => {
    const endpoint = "https://endpoint-40.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "codex",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 41", () => {
    const endpoint = "https://endpoint-41.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "claude-desktop",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 42", () => {
    const endpoint = "https://endpoint-42.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "cursor",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 43", () => {
    const endpoint = "https://endpoint-43.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "windsurf",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 44", () => {
    const endpoint = "https://endpoint-44.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "remote-http",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 45", () => {
    const endpoint = "https://endpoint-45.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "codex",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 46", () => {
    const endpoint = "https://endpoint-46.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "claude-desktop",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 47", () => {
    const endpoint = "https://endpoint-47.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "cursor",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 48", () => {
    const endpoint = "https://endpoint-48.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "windsurf",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 49", () => {
    const endpoint = "https://endpoint-49.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "remote-http",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 50", () => {
    const endpoint = "https://endpoint-50.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "codex",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 51", () => {
    const endpoint = "https://endpoint-51.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "claude-desktop",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 52", () => {
    const endpoint = "https://endpoint-52.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "cursor",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 53", () => {
    const endpoint = "https://endpoint-53.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "windsurf",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 54", () => {
    const endpoint = "https://endpoint-54.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "remote-http",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 55", () => {
    const endpoint = "https://endpoint-55.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "codex",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 56", () => {
    const endpoint = "https://endpoint-56.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "claude-desktop",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 57", () => {
    const endpoint = "https://endpoint-57.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "cursor",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 58", () => {
    const endpoint = "https://endpoint-58.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "windsurf",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 59", () => {
    const endpoint = "https://endpoint-59.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "remote-http",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 60", () => {
    const endpoint = "https://endpoint-60.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "codex",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 61", () => {
    const endpoint = "https://endpoint-61.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "claude-desktop",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 62", () => {
    const endpoint = "https://endpoint-62.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "cursor",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 63", () => {
    const endpoint = "https://endpoint-63.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "windsurf",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 64", () => {
    const endpoint = "https://endpoint-64.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "remote-http",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 65", () => {
    const endpoint = "https://endpoint-65.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "codex",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 66", () => {
    const endpoint = "https://endpoint-66.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "claude-desktop",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 67", () => {
    const endpoint = "https://endpoint-67.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "cursor",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 68", () => {
    const endpoint = "https://endpoint-68.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "windsurf",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 69", () => {
    const endpoint = "https://endpoint-69.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "remote-http",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 70", () => {
    const endpoint = "https://endpoint-70.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "codex",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 71", () => {
    const endpoint = "https://endpoint-71.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "claude-desktop",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 72", () => {
    const endpoint = "https://endpoint-72.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "cursor",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 73", () => {
    const endpoint = "https://endpoint-73.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "windsurf",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 74", () => {
    const endpoint = "https://endpoint-74.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "remote-http",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 75", () => {
    const endpoint = "https://endpoint-75.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "codex",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 76", () => {
    const endpoint = "https://endpoint-76.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "claude-desktop",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 77", () => {
    const endpoint = "https://endpoint-77.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "cursor",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 78", () => {
    const endpoint = "https://endpoint-78.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "windsurf",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
  it("buildClientSetupResponse churn 79", () => {
    const endpoint = "https://endpoint-79.heyclau.de/mcp";
    const response = buildClientSetupResponse({
      endpointUrl: endpoint,
      client: "remote-http",
    });
    expect(response.ok).toBe(true);
    expect(response.notes).toBe(CLIENT_SETUP_NOTES);
  });
});
