import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { createRemoteMcpProxyServerFromClient } from "../packages/mcp/src/remote-proxy.js";
import { createHeyClaudeMcpServer } from "../packages/mcp/src/server.js";
import {
  callRegistryTool,
  getRegistryPrompt,
  listRegistryPrompts,
  listRegistryResources,
  listRegistryResourceTemplates,
  READ_ONLY_TOOL_NAMES,
  readRegistryResource,
  TOOL_DEFINITIONS,
} from "../packages/mcp/src/registry.js";
import {
  jsonSchemaForTool,
  parseToolArguments,
  TOOL_INPUT_SCHEMAS,
} from "../packages/mcp/src/schemas.js";
import { repoRoot } from "./helpers/registry-fixtures";

const dataDir = path.join(repoRoot, "apps/web/public/data");
const packageRequire = createRequire(
  path.join(repoRoot, "packages/mcp/package.json"),
);
const { Client } = await import(
  packageRequire.resolve("@modelcontextprotocol/sdk/client/index.js")
);
const { InMemoryTransport } = await import(
  packageRequire.resolve("@modelcontextprotocol/sdk/inMemory.js")
);

function firstSkill() {
  const payload = JSON.parse(
    fs.readFileSync(path.join(dataDir, "directory-index.json"), "utf8"),
  ) as {
    entries: Array<{ category: string; slug: string; title: string }>;
  };
  const entry = payload.entries.find(
    (candidate) => candidate.category === "skills",
  );
  if (!entry) throw new Error("Expected at least one skill entry.");
  return entry;
}

const skill = firstSkill();

function secondSkill() {
  const payload = JSON.parse(
    fs.readFileSync(path.join(dataDir, "directory-index.json"), "utf8"),
  ) as {
    entries: Array<{ category: string; slug: string; title: string }>;
  };
  const entry = payload.entries.find(
    (candidate) =>
      candidate.category === skill.category && candidate.slug !== skill.slug,
  );
  if (!entry) throw new Error("Expected at least two skill entries.");
  return entry;
}

const otherSkill = secondSkill();

const validMcpSubmissionFields = {
  category: "mcp",
  name: "Example Protocol MCP",
  docs_url: "https://example.com/docs",
  description:
    "Example MCP server submission used to verify the protocol-level tool surface.",
  install_command: "npx -y example-protocol-mcp",
  usage_snippet: "Add this server to your MCP client configuration.",
};

function validToolArguments(name: string) {
  const argsByTool: Record<string, unknown> = {
    search_registry: { query: "mcp", limit: 1 },
    server_info: {},
    list_category_entries: { category: "mcp", limit: 1 },
    get_recent_updates: { limit: 1 },
    get_related_entries: {
      category: skill.category,
      slug: skill.slug,
      limit: 1,
    },
    get_entry_detail: { category: skill.category, slug: skill.slug },
    get_copyable_asset: {
      category: skill.category,
      slug: skill.slug,
      platform: "claude",
    },
    compare_entries: {
      entries: [
        { category: skill.category, slug: skill.slug },
        { category: otherSkill.category, slug: otherSkill.slug },
      ],
      platform: "claude",
    },
    get_registry_stats: {},
    get_client_setup: { client: "codex" },
    get_compatibility: { slug: skill.slug },
    get_install_guidance: {
      category: skill.category,
      slug: skill.slug,
      platform: "claude",
    },
    get_platform_adapter: { slug: skill.slug, platform: "cursor-rules" },
    list_distribution_feeds: {},
    get_submission_schema: { category: "mcp" },
    validate_submission_draft: { fields: validMcpSubmissionFields },
    search_duplicate_entries: {
      category: skill.category,
      slug: skill.slug,
      limit: 1,
    },
    build_submission_urls: { fields: validMcpSubmissionFields },
    get_category_submission_guidance: { category: "mcp" },
    prepare_submission_draft: { fields: validMcpSubmissionFields },
    get_submission_examples: { category: "mcp" },
    review_submission_draft: { fields: validMcpSubmissionFields },
  };
  if (!(name in argsByTool)) {
    throw new Error(`Missing protocol test arguments for ${name}.`);
  }
  return argsByTool[name];
}

async function withMcpClient<T>(run: (client: any) => Promise<T>) {
  const server = createHeyClaudeMcpServer({ dataDir });
  return withMcpClientForServer(server, run);
}

async function withMcpClientForServer<T>(
  server: any,
  run: (client: any) => Promise<T>,
) {
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  const client = new Client({
    name: "heyclaude-protocol-test",
    version: "0.0.0",
  });

  await server.connect(serverTransport);
  await client.connect(clientTransport);
  try {
    return await run(client);
  } finally {
    await client.close().catch(() => {});
    await server.close().catch(() => {});
  }
}

function fakeRemoteClient() {
  const directoryResource = {
    uri: "heyclaude://feeds/directory",
    name: "directory",
    title: "directory",
    mimeType: "application/json",
  };
  return {
    getServerCapabilities() {
      return { tools: {}, resources: {}, prompts: {} };
    },
    async listTools() {
      return {
        tools: [
          {
            name: "search_registry",
            description: "Remote search.",
            inputSchema: { type: "object", additionalProperties: true },
            outputSchema: {
              type: "object",
              properties: { ok: { type: "boolean" } },
              required: ["ok"],
              additionalProperties: true,
            },
            annotations: {
              readOnlyHint: false,
              destructiveHint: true,
              idempotentHint: false,
            },
          },
        ],
      };
    },
    async callTool() {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ ok: true, count: 0, entries: [] }),
          },
        ],
      };
    },
    async listResources() {
      return { resources: [directoryResource] };
    },
    async listResourceTemplates() {
      return {
        resourceTemplates: [
          {
            uriTemplate: "heyclaude://entry/{category}/{slug}",
            name: "entry",
            title: "entry",
            mimeType: "application/json",
          },
        ],
      };
    },
    async readResource() {
      return {
        contents: [
          {
            uri: directoryResource.uri,
            mimeType: "application/json",
            text: JSON.stringify({ ok: true, entries: [] }),
          },
        ],
      };
    },
    async listPrompts() {
      return {
        prompts: [
          {
            name: "find_best_asset",
            description: "Remote prompt.",
            arguments: [],
          },
        ],
      };
    },
    async getPrompt() {
      return {
        description: "Remote prompt.",
        messages: [
          {
            role: "user",
            content: { type: "text", text: "Use remote discovery tools." },
          },
        ],
      };
    },
    async close() {},
  };
}

describe("HeyClaude read-only MCP helpers", () => {
  it("keeps the MCP package publishable without private workspace dependencies", () => {
    const rootPackageJson = JSON.parse(
      fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"),
    ) as {
      dependencies?: Record<string, string>;
    };
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(repoRoot, "packages/mcp/package.json"), "utf8"),
    ) as {
      private?: boolean;
      bin?: Record<string, string>;
      dependencies?: Record<string, string>;
      exports?: Record<string, unknown>;
      files?: string[];
      scripts?: Record<string, string>;
    };

    expect(packageJson.private).not.toBe(true);
    expect(packageJson.bin).toHaveProperty("heyclaude-mcp", "src/cli.js");
    expect(packageJson.files).toContain("scripts/**/*.mjs");
    expect(packageJson.scripts).not.toHaveProperty("preinstall");
    expect(packageJson.scripts).not.toHaveProperty("install");
    expect(packageJson.scripts).not.toHaveProperty("postinstall");
    expect(packageJson.scripts).toHaveProperty(
      "validate:endpoint",
      "node scripts/validate-endpoint.mjs",
    );
    expect(packageJson.scripts).toHaveProperty(
      "validate:package",
      "node ../../scripts/validate-mcp-package.mjs",
    );
    expect(packageJson.dependencies).not.toHaveProperty("@heyclaude/registry");
    expect(packageJson.dependencies).toHaveProperty(
      "zod",
      rootPackageJson.dependencies?.zod,
    );
    expect(Object.values(packageJson.dependencies ?? {})).not.toContain(
      "workspace:*",
    );
    expect(packageJson.exports).toHaveProperty("./server");
    expect(packageJson.exports).toHaveProperty("./remote-proxy");
    expect(packageJson.exports).toHaveProperty("./submissions");
  });

  it("keeps npm package README branding, links, and release convention current", () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(repoRoot, "packages/mcp/package.json"), "utf8"),
    ) as {
      version: string;
    };
    const readme = fs.readFileSync(
      path.join(repoRoot, "packages/mcp/README.md"),
      "utf8",
    );

    expect(readme).toContain("https://heyclau.de/heyclaude-wordmark.svg");
    expect(readme).toContain("https://github.com/JSONbored/awesome-claude");
    expect(readme).toContain("https://www.npmjs.com/package/@heyclaude/mcp");
    expect(readme).toContain("https://heyclau.de/api/mcp");
    expect(readme).toContain(
      `https://github.com/JSONbored/awesome-claude/releases/tag/mcp-v${packageJson.version}`,
    );
    expect(readme).toContain("`mcp-vX.Y.Z`");
    expect(readme).toContain("npmjs.com");
    expect(readme).toContain("GitHub Releases track");
  });

  it("exposes only read-only registry and submission helper tools", () => {
    expect(TOOL_DEFINITIONS.map((tool) => tool.name)).toEqual(
      READ_ONLY_TOOL_NAMES,
    );
    expect(Object.keys(TOOL_INPUT_SCHEMAS)).toEqual(READ_ONLY_TOOL_NAMES);
    for (const tool of TOOL_DEFINITIONS) {
      expect(tool.name).not.toMatch(
        /create_issue|create_pull_request|publish_content|write_file|delete/i,
      );
      expect(tool.description).toMatch(
        /read-only|fetch|search|list|validate|build|guidance|review/i,
      );
      expect(tool.annotations).toMatchObject({
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
      });
      expect(tool.outputSchema).toMatchObject({
        type: "object",
        required: ["ok"],
      });
      expect(tool.inputSchema).toEqual(jsonSchemaForTool(tool.name));
      expect(tool.inputSchema).toMatchObject({
        type: "object",
        additionalProperties: false,
      });
      expect(JSON.stringify(tool.inputSchema)).not.toContain("$schema");
    }
  });

  it("serves every public tool with structured output through the MCP SDK", async () => {
    await withMcpClient(async (client) => {
      const tools = await client.listTools();
      expect(tools.tools.map((tool) => tool.name)).toEqual(
        READ_ONLY_TOOL_NAMES,
      );
      for (const tool of tools.tools) {
        expect(tool.outputSchema).toMatchObject({
          type: "object",
          required: ["ok"],
        });
        expect(tool.annotations).toMatchObject({
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
        });
      }

      for (const name of READ_ONLY_TOOL_NAMES) {
        const result = await client.callTool({
          name,
          arguments: validToolArguments(name),
        });
        expect(result.isError).not.toBe(true);
        expect(result.structuredContent).toMatchObject({
          ok: true,
          policy: {
            apiKeyRequired: false,
            readOnly: true,
            createsIssues: false,
            createsPullRequests: false,
            publishesContent: false,
            writesLocalFiles: false,
          },
        });
        const text = result.content?.find((item) => item.type === "text")?.text;
        expect(text).toBeTruthy();
        expect(JSON.parse(String(text))).toEqual(result.structuredContent);
      }
    });
  });

  it("serves resources and prompts through the MCP SDK", async () => {
    await withMcpClient(async (client) => {
      const resources = await client.listResources();
      expect(resources.resources).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            uri: "heyclaude://feeds/directory",
            mimeType: "application/json",
          }),
          expect.objectContaining({ uri: "heyclaude://category/skills" }),
        ]),
      );

      const templates = await client.listResourceTemplates();
      expect(templates.resourceTemplates).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            uriTemplate: "heyclaude://entry/{category}/{slug}",
          }),
          expect.objectContaining({
            uriTemplate: "heyclaude://category/{category}",
          }),
        ]),
      );

      const entryResource = await client.readResource({
        uri: `heyclaude://entry/${skill.category}/${skill.slug}`,
      });
      const entryPayload = JSON.parse(entryResource.contents[0].text);
      expect(entryPayload).toMatchObject({
        ok: true,
        key: `${skill.category}:${skill.slug}`,
        policy: { readOnly: true },
      });

      const prompts = await client.listPrompts();
      expect(prompts.prompts.map((prompt) => prompt.name)).toEqual([
        "find_best_asset",
        "prepare_submission",
        "review_submission_before_issue",
        "install_asset_safely",
      ]);

      const prompt = await client.getPrompt({
        name: "find_best_asset",
        arguments: {
          use_case: "find an MCP server for code review",
          category: "mcp",
          platform: "Codex",
        },
      });
      expect(prompt.messages[0].content.text).toContain("compare_entries");
      expect(prompt.messages[0].content.text).toContain(
        "Do not invent popularity metrics",
      );
    });
  });

  it("normalizes remote proxy tools, annotations, and structured output", async () => {
    const { server } = await createRemoteMcpProxyServerFromClient(
      fakeRemoteClient(),
      {
        url: "https://example.com/api/mcp",
        timeoutMs: 1000,
      },
    );

    await withMcpClientForServer(server, async (client) => {
      const tools = await client.listTools();
      expect(tools.tools).toEqual([
        expect.objectContaining({
          name: "search_registry",
          annotations: expect.objectContaining({
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
          }),
        }),
      ]);

      const result = await client.callTool({
        name: "search_registry",
        arguments: { query: "mcp" },
      });
      expect(result.isError).not.toBe(true);
      expect(result.structuredContent).toMatchObject({
        ok: true,
        count: 0,
        policy: {
          apiKeyRequired: false,
          readOnly: true,
          createsIssues: false,
          createsPullRequests: false,
          publishesContent: false,
          writesLocalFiles: false,
        },
      });

      const resources = await client.listResources();
      expect(resources.resources[0]).toMatchObject({
        uri: "heyclaude://feeds/directory",
      });
      const prompts = await client.listPrompts();
      expect(prompts.prompts[0]).toMatchObject({ name: "find_best_asset" });
    });
  });

  it("reports public no-key MCP server metadata and durable rate-limit policy", async () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(repoRoot, "packages/mcp/package.json"), "utf8"),
    ) as { name: string; version: string };

    const info = await callRegistryTool("server_info", {}, { dataDir });
    expect(info).toMatchObject({
      ok: true,
      package: {
        name: packageJson.name,
        version: packageJson.version,
      },
      endpoint: {
        auth: "none",
        requestBodyLimitBytes: 64 * 1024,
        rateLimit: {
          binding: "API_MCP_RATE_LIMIT",
          limit: 60,
          windowSeconds: 60,
        },
      },
      policy: {
        apiKeyRequired: false,
        readOnly: true,
        createsIssues: false,
        createsPullRequests: false,
        publishesContent: false,
      },
    });
    expect(info.tools).toEqual(READ_ONLY_TOOL_NAMES);
  });

  it("validates MCP tool arguments from shared Zod schemas", async () => {
    expect(
      parseToolArguments("search_registry", {
        query: "discord",
        category: "mcp",
        platform: "cursor-rules",
        limit: 3,
      }),
    ).toEqual({
      query: "discord",
      category: "mcp",
      platform: "cursor-rules",
      limit: 3,
    });

    await expect(
      callRegistryTool(
        "get_entry_detail",
        { category: "../mcp", slug: "bad" },
        { dataDir },
      ),
    ).resolves.toMatchObject({
      ok: false,
      error: {
        code: "invalid_request",
        details: [
          expect.objectContaining({
            path: "category",
            code: "invalid_format",
          }),
        ],
      },
    });

    await expect(
      callRegistryTool(
        "search_registry",
        { limit: 100, unexpected: true },
        { dataDir },
      ),
    ).resolves.toMatchObject({
      ok: false,
      error: {
        code: "invalid_request",
        details: expect.arrayContaining([
          expect.objectContaining({ path: "limit", code: "too_big" }),
          expect.objectContaining({ path: "", code: "unrecognized_keys" }),
        ]),
      },
    });
  });

  it("searches registry artifacts with category and platform filters", async () => {
    const result = await callRegistryTool(
      "search_registry",
      {
        query: "skill",
        category: "skills",
        platform: "cursor-rules",
        limit: 5,
      },
      { dataDir },
    );
    expect(result).toMatchObject({
      ok: true,
      category: "skills",
      count: expect.any(Number),
    });
    expect(result.entries.length).toBeGreaterThan(0);
    expect(result.entries.length).toBeLessThanOrEqual(5);
    expect(result.entries[0].platforms).toContain("Cursor");
  });

  it("lists category entries with bounded pagination and filters", async () => {
    const result = await callRegistryTool(
      "list_category_entries",
      {
        category: "skills",
        platform: "cursor-rules",
        tag: "evals",
        limit: 2,
      },
      { dataDir },
    );

    expect(result).toMatchObject({
      ok: true,
      category: "skills",
      platform: "Cursor",
      tag: "evals",
      count: expect.any(Number),
      limit: 2,
      offset: 0,
    });
    expect(result.entries.length).toBeLessThanOrEqual(2);
    expect(result.entries[0]).toMatchObject({
      category: "skills",
      canonicalUrl: expect.stringContaining("/skills/"),
      dateAdded: expect.any(String),
    });
    expect(result.entries[0].tags).toContain("evals");
    expect(result.entries[0].platforms).toContain("Cursor");
  });

  it("lists recent updates from generated registry metadata", async () => {
    const result = await callRegistryTool(
      "get_recent_updates",
      { limit: 5 },
      { dataDir },
    );

    expect(result).toMatchObject({ ok: true, count: 5 });
    const dates = result.entries.map((entry: any) => entry.updatedAt);
    expect(dates).toEqual([...dates].sort().reverse());
    expect(result.entries[0]).toMatchObject({
      key: expect.stringContaining(":"),
      updateKind: expect.stringMatching(/added|upstream_update/),
    });

    const since = await callRegistryTool(
      "get_recent_updates",
      { since: result.entries[0].updatedAt, limit: 5 },
      { dataDir },
    );
    expect(since).toMatchObject({
      ok: true,
      since: result.entries[0].updatedAt,
    });
  });

  it("returns related entries without returning the requested entry", async () => {
    const result = await callRegistryTool(
      "get_related_entries",
      { category: skill.category, slug: skill.slug, limit: 5 },
      { dataDir },
    );

    expect(result).toMatchObject({
      ok: true,
      key: `${skill.category}:${skill.slug}`,
      count: expect.any(Number),
    });
    expect(result.entries.length).toBeGreaterThan(0);
    expect(result.entries.map((entry: any) => entry.key)).not.toContain(
      `${skill.category}:${skill.slug}`,
    );
    expect(result.entries[0]).toMatchObject({
      relatedScore: expect.any(Number),
      relatedReasons: expect.arrayContaining([expect.any(String)]),
    });
  });

  it("fetches entry detail and install guidance without write capabilities", async () => {
    const detail = await callRegistryTool(
      "get_entry_detail",
      { category: skill.category, slug: skill.slug },
      { dataDir },
    );
    expect(detail).toMatchObject({
      ok: true,
      key: `${skill.category}:${skill.slug}`,
      canonicalUrl: `https://heyclau.de/${skill.category}/${skill.slug}`,
    });

    const guidance = await callRegistryTool(
      "get_install_guidance",
      { category: skill.category, slug: skill.slug, platform: "claude" },
      { dataDir },
    );
    expect(guidance).toMatchObject({
      ok: true,
      key: `${skill.category}:${skill.slug}`,
      platform: "Claude",
    });
    expect(guidance).not.toHaveProperty("writePath");
  });

  it("returns category-aware copyable assets and comparison metadata", async () => {
    const asset = await callRegistryTool(
      "get_copyable_asset",
      { category: skill.category, slug: skill.slug, platform: "claude" },
      { dataDir },
    );
    expect(asset).toMatchObject({
      ok: true,
      key: `${skill.category}:${skill.slug}`,
      primaryAsset: {
        type: expect.stringMatching(/install_command|full_content|usage/),
        content: expect.any(String),
      },
      source: {
        sourceHosts: expect.any(Array),
      },
      policy: {
        readOnly: true,
        writesLocalFiles: false,
      },
    });
    expect(JSON.stringify(asset)).not.toMatch(
      /createIssue|createPullRequest|publish_content|writePath/i,
    );

    const directory = JSON.parse(
      fs.readFileSync(path.join(dataDir, "directory-index.json"), "utf8"),
    ) as {
      entries: Array<{ category: string; slug: string }>;
    };
    const second = directory.entries.find(
      (entry) => entry.category === skill.category && entry.slug !== skill.slug,
    );
    expect(second).toBeTruthy();
    const compared = await callRegistryTool(
      "compare_entries",
      {
        entries: [
          { category: skill.category, slug: skill.slug },
          { category: second?.category, slug: second?.slug },
        ],
        platform: "claude",
      },
      { dataDir },
    );
    expect(compared).toMatchObject({
      ok: true,
      count: 2,
      platform: "Claude",
      entries: [
        expect.objectContaining({
          key: `${skill.category}:${skill.slug}`,
          installComplexity: expect.stringMatching(/unknown|low|medium|higher/),
        }),
        expect.any(Object),
      ],
      policy: { readOnly: true },
    });
  });

  it("returns registry stats and client setup snippets without auth requirements", async () => {
    const stats = await callRegistryTool("get_registry_stats", {}, { dataDir });
    expect(stats).toMatchObject({
      ok: true,
      package: { name: "@heyclaude/mcp" },
      registry: {
        totalEntries: expect.any(Number),
        categories: expect.any(Object),
      },
      sourceSignals: {
        entriesWithGithubStats: expect.any(Number),
        installableEntries: expect.any(Number),
      },
      policy: { apiKeyRequired: false, readOnly: true },
    });

    const setup = await callRegistryTool(
      "get_client_setup",
      { client: "codex" },
      { dataDir },
    );
    expect(setup).toMatchObject({
      ok: true,
      apiKeyRequired: false,
      snippets: {
        codex: {
          config: {
            mcpServers: {
              heyclaude: {
                command: "npx",
                args: ["-y", "@heyclaude/mcp"],
              },
            },
          },
        },
      },
      policy: { createsIssues: false },
    });
  });

  it("exposes registry resources and workflow prompts through MCP helpers", async () => {
    await expect(listRegistryResources({}, { dataDir })).resolves.toMatchObject(
      {
        resources: expect.arrayContaining([
          expect.objectContaining({
            uri: "heyclaude://feeds/directory",
            mimeType: "application/json",
          }),
          expect.objectContaining({
            uri: "heyclaude://category/skills",
          }),
        ]),
      },
    );
    expect(listRegistryResourceTemplates()).toMatchObject({
      resourceTemplates: expect.arrayContaining([
        expect.objectContaining({
          uriTemplate: "heyclaude://entry/{category}/{slug}",
        }),
      ]),
    });
    await expect(
      readRegistryResource(
        { uri: `heyclaude://entry/${skill.category}/${skill.slug}` },
        { dataDir },
      ),
    ).resolves.toMatchObject({
      contents: [
        {
          mimeType: "application/json",
          text: expect.stringContaining(`"${skill.slug}"`),
        },
      ],
    });

    expect(listRegistryPrompts()).toMatchObject({
      prompts: expect.arrayContaining([
        expect.objectContaining({ name: "find_best_asset" }),
        expect.objectContaining({ name: "install_asset_safely" }),
      ]),
    });
    expect(
      getRegistryPrompt({
        name: "install_asset_safely",
        arguments: {
          category: skill.category,
          slug: skill.slug,
          platform: "Claude",
        },
      }),
    ).toMatchObject({
      messages: [
        {
          role: "user",
          content: {
            text: expect.stringContaining("get_install_guidance"),
          },
        },
      ],
    });
  });

  it("returns compatibility and generated Cursor adapter content", async () => {
    const compatibility = await callRegistryTool(
      "get_compatibility",
      { slug: skill.slug },
      { dataDir },
    );
    expect(compatibility).toMatchObject({ ok: true, slug: skill.slug });
    expect(
      compatibility.platformCompatibility.map((item: any) => item.platform),
    ).toEqual(
      expect.arrayContaining([
        "Claude",
        "Codex",
        "Windsurf",
        "Gemini",
        "Cursor",
      ]),
    );

    const adapter = await callRegistryTool(
      "get_platform_adapter",
      { slug: skill.slug, platform: "cursor-rules" },
      { dataDir },
    );
    expect(adapter).toMatchObject({
      ok: true,
      platform: "Cursor",
      adapterAvailable: true,
      adapterPath: `/data/skill-adapters/cursor/${skill.slug}.mdc`,
    });
    expect(adapter.content).toContain(
      "Cursor does not natively install Agent Skills",
    );
  });

  it("serves the canonical submission spec through MCP", async () => {
    const submissionSpec = JSON.parse(
      fs.readFileSync(path.join(dataDir, "submission-spec.json"), "utf8"),
    ) as {
      categories: Record<string, { fields: Array<{ id: string }> }>;
      issueTemplates: Record<string, unknown>;
    };

    expect(Object.keys(submissionSpec.categories)).toEqual(
      expect.arrayContaining(["agents", "mcp", "skills", "guides"]),
    );

    const result = await callRegistryTool(
      "get_submission_schema",
      { category: "skills" },
      { dataDir },
    );
    expect(result).toMatchObject({
      ok: true,
      category: "skills",
      schema: {
        template: "submit-skill.yml",
      },
      issueTemplate: {
        labels: expect.arrayContaining(["content-submission", "skills"]),
      },
    });
    expect(result.schema.fields.map((field: any) => field.id)).toEqual(
      submissionSpec.categories.skills.fields.map((field) => field.id),
    );
  });

  it("validates submission drafts and builds review URLs without GitHub writes", async () => {
    const fields = {
      category: "skills",
      name: "Example Submission Skill",
      source_url: "https://example.com/docs",
      brand_domain: "example.com",
      description:
        "Create a complete HeyClaude-ready skill submission draft from source material.",
      usage_snippet: "Use this skill to prepare a reviewed submission.",
      skill_type: "general",
      skill_level: "advanced",
      verification_status: "validated",
      download_url: "https://example.com/example-skill.zip",
      tags: ["heyclaude", "submissions"],
    };

    await expect(
      callRegistryTool("validate_submission_draft", { fields }, { dataDir }),
    ).resolves.toMatchObject({
      ok: true,
      valid: true,
      category: "skills",
      slug: "example-submission-skill",
      issuePreview: {
        title: "Submit Skill: Example Submission Skill",
        labels: expect.arrayContaining(["content-submission", "skills"]),
      },
    });

    const urls = await callRegistryTool(
      "build_submission_urls",
      { fields, includeIssueBody: true },
      { dataDir },
    );
    expect(urls).toMatchObject({
      ok: true,
      valid: true,
      submitUrl: expect.stringContaining("https://heyclau.de/submit"),
      githubIssueUrl: expect.stringContaining(
        "https://github.com/JSONbored/awesome-claude/issues/new",
      ),
      issueDraft: {
        title: "Submit Skill: Example Submission Skill",
        labels: expect.arrayContaining(["content-submission", "skills"]),
      },
    });
    expect(urls.githubIssueUrl).toContain("template=submit-skill.yml");
    expect(urls.issueDraft.body).toContain("### Brand domain");
    expect(JSON.stringify(urls)).not.toMatch(/token|secret|authorization/i);
  });

  it("rejects MCP skill drafts that fail registry skill rules", async () => {
    const invalid = await callRegistryTool(
      "validate_submission_draft",
      {
        fields: {
          category: "skills",
          name: "Invalid Submission Skill",
          docs_url: "https://example.com/docs",
          description:
            "Invalid skill draft used to test MCP-side registry validation parity.",
          card_description: "Invalid skill draft.",
          skill_type: "capability-pack",
          skill_level: "advanced",
          verification_status: "validated",
          retrieval_sources: "http://example.com/source",
          usage_snippet: "Use this draft only for validation testing.",
        },
      },
      { dataDir },
    );

    expect(invalid).toMatchObject({
      ok: true,
      valid: false,
      category: "skills",
    });
    expect(invalid.errors).toEqual(
      expect.arrayContaining([
        "capability-pack skills require verified_at.",
        "capability-pack skills must use skill_level=expert.",
        "retrieval_sources must use https URLs: http://example.com/source",
      ]),
    );
  });

  it("prepares and reviews submission drafts without GitHub writes", async () => {
    const fields = {
      category: "mcp",
      name: "Example Draft MCP",
      docs_url: "https://example.com/docs",
      description:
        "Example MCP server submission used to test stronger draft tooling.",
      install_command: "npx -y example-draft-mcp",
      usage_snippet: "Add this server to your MCP client configuration.",
    };

    const prepared = await callRegistryTool(
      "prepare_submission_draft",
      { fields },
      { dataDir },
    );
    expect(prepared).toMatchObject({
      ok: true,
      valid: true,
      category: "mcp",
      issueDraft: {
        title: "Submit MCP Server: Example Draft MCP",
        labels: expect.arrayContaining(["content-submission", "community-mcp"]),
        body: expect.stringContaining("### Install command"),
      },
      githubIssueUrl: expect.stringContaining("template=submit-mcp.yml"),
      submissionPolicy: expect.stringContaining("does not auto-merge"),
      artifactPolicy: expect.stringContaining("quarantine/review"),
    });

    const reviewed = await callRegistryTool(
      "review_submission_draft",
      { fields },
      { dataDir },
    );
    expect(reviewed).toMatchObject({
      ok: true,
      valid: true,
      recommendedAction: expect.stringMatching(
        /open_review_issue|review_possible_duplicate/,
      ),
      duplicateReview: { ok: true },
      reviewChecklist: expect.arrayContaining([
        expect.stringContaining("maintainer review"),
      ]),
    });
    expect(JSON.stringify({ prepared, reviewed })).not.toMatch(
      /token|secret|authorization|createIssue|createPullRequest/i,
    );
  });

  it("returns category submission examples for faster valid drafts", async () => {
    const examples = await callRegistryTool(
      "get_submission_examples",
      { category: "guides" },
      { dataDir },
    );
    expect(examples).toMatchObject({
      ok: true,
      categories: [
        {
          category: "guides",
          requiredFields: expect.arrayContaining(["guide_content"]),
          minimalFields: {
            category: "guides",
            guide_content: expect.stringContaining("# Example"),
          },
        },
      ],
      reviewModel: expect.stringContaining("maintainers review"),
    });
  });

  it("finds likely duplicate entries before submission", async () => {
    const duplicate = await callRegistryTool(
      "search_duplicate_entries",
      {
        category: skill.category,
        slug: skill.slug,
        title: skill.title,
        limit: 3,
      },
      { dataDir },
    );
    expect(duplicate).toMatchObject({
      ok: true,
      count: expect.any(Number),
      matches: [
        expect.objectContaining({
          key: `${skill.category}:${skill.slug}`,
          reasons: expect.arrayContaining(["slug", "title"]),
        }),
      ],
    });
  });

  it("rejects malformed submission helper arguments from Zod schemas", async () => {
    await expect(
      callRegistryTool(
        "build_submission_urls",
        {
          fields: {
            category: "skills",
            name: "Unsafe",
            unexpected: "value",
          },
        },
        { dataDir },
      ),
    ).resolves.toMatchObject({
      ok: false,
      error: {
        code: "invalid_request",
        details: [
          expect.objectContaining({
            path: "fields",
            code: "unrecognized_keys",
          }),
        ],
      },
    });

    await expect(
      callRegistryTool(
        "compare_entries",
        {
          entries: [
            { category: "skills", slug: skill.slug },
            { category: "skills", slug: skill.slug, writePath: "/tmp/x" },
          ],
        },
        { dataDir },
      ),
    ).resolves.toMatchObject({
      ok: false,
      error: {
        code: "invalid_request",
        details: [
          expect.objectContaining({
            path: "entries.1",
            code: "unrecognized_keys",
          }),
        ],
      },
    });
  });

  it("lists distribution feeds from the manifest and feed index", async () => {
    const feeds = await callRegistryTool(
      "list_distribution_feeds",
      {},
      { dataDir },
    );
    expect(feeds).toMatchObject({
      ok: true,
      artifacts: {
        directory: "/data/directory-index.json",
        distributionFeeds: "/data/feeds",
      },
    });
    expect(feeds.categories.length).toBeGreaterThan(0);
    expect(feeds.platforms.map((item: any) => item.feedSlug)).toEqual(
      expect.arrayContaining(["claude", "cursor"]),
    );
  });

  it("handles malformed or missing requests without exposing mutations", async () => {
    await expect(
      callRegistryTool("unknown_write_tool", {}, { dataDir }),
    ).resolves.toMatchObject({ ok: false, error: { code: "invalid_request" } });

    await expect(
      callRegistryTool(
        "get_entry_detail",
        { category: "mcp", slug: "does-not-exist" },
        { dataDir },
      ),
    ).resolves.toMatchObject({ ok: false, error: { code: "not_found" } });
  });
});
