import { describe, expect, it } from "vitest";

import { createHeyClaudeMcpServer } from "../packages/mcp/src/server-lib.js";

const searchIndex = {
  entries: [
    {
      category: "mcp",
      slug: "browser-bridge",
      title: "Browser Bridge",
      description: "playwright browser automation for Claude Code",
      tags: ["browser"],
      platforms: ["claude-code"],
    },
  ],
};

function makeServer() {
  return createHeyClaudeMcpServer({
    readJsonArtifact: async (relativePath: string) =>
      relativePath === "search-index.json" ? searchIndex : { entries: [] },
    readTextArtifact: async () => "artifact body",
  });
}

function handler(server: any, method: string) {
  const fn = server._requestHandlers.get(method);
  if (!fn) throw new Error(`no handler for ${method}`);
  return (params?: unknown) => fn({ method, params }, {});
}

describe("server-lib request handlers", () => {
  it("lists the registry tool definitions", async () => {
    const result = await handler(makeServer(), "tools/list")({});
    expect(Array.isArray(result.tools)).toBe(true);
    expect(result.tools.length).toBeGreaterThan(0);
  });

  it("defaults missing tool arguments to an empty object", async () => {
    const result = await handler(
      makeServer(),
      "tools/call",
    )({ name: "registry.search" });
    expect(result.structuredContent).toBeDefined();
    expect(result.isError).toBe(false);
  });

  it("marks failed tool results as errors", async () => {
    const result = await handler(
      makeServer(),
      "tools/call",
    )({ name: "entry.detail", arguments: {} });
    expect(result.isError).toBe(true);
    expect(result.structuredContent.ok).toBe(false);
  });

  it("lists resources and resource templates without params", async () => {
    const server = makeServer();
    const resources = await handler(server, "resources/list")();
    expect(resources).toBeDefined();
    const templates = await handler(server, "resources/templates/list")();
    expect(templates).toBeDefined();
  });

  it("lists prompts and resolves a prompt by name", async () => {
    const server = makeServer();
    expect(await handler(server, "prompts/list")()).toBeDefined();
    const prompt = await handler(
      server,
      "prompts/get",
    )({ name: "asset.find", arguments: { use_case: "browser automation" } });
    expect(prompt.messages[0].content.text).toContain("browser automation");
  });
});
