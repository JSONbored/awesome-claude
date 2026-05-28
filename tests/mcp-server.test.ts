import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { createRemoteMcpProxyServerFromClient } from "../packages/mcp/src/remote-proxy.js";
import { createHeyClaudeMcpServer } from "../packages/mcp/src/server.js";
import {
  callRegistryTool,
  getClientSetup,
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
  safety_notes:
    "Installs and runs an MCP server process from the submitted package.",
  privacy_notes:
    "Not applicable: this fixture does not access user files or credentials.",
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
    get_submission_policy: {},
    explain_entry_trust: { category: skill.category, slug: skill.slug },
    review_entry_safety: {
      entries: [
        { category: skill.category, slug: skill.slug },
        { category: otherSkill.category, slug: otherSkill.slug },
      ],
      platform: "claude",
    },
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
        /read-only|fetch|search|list|validate|build|guidance|review|explain/i,
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
        hasSafetyNotes: "all",
        downloadTrust: "first-party",
        claimStatus: "unclaimed",
        sourceStatus: "available",
        limit: 3,
      }),
    ).toEqual({
      query: "discord",
      category: "mcp",
      platform: "cursor-rules",
      hasSafetyNotes: "all",
      downloadTrust: "first-party",
      claimStatus: "unclaimed",
      sourceStatus: "available",
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

    expect(() =>
      parseToolArguments("validate_submission_draft", {
        fields: {
          category: "mcp",
          name: "Too Many Notes MCP",
          safety_notes: Array.from(
            { length: 9 },
            (_, index) => `note ${index}`,
          ).join("\n"),
        },
      }),
    ).toThrow("Use at most 8 non-empty lines, 320 characters per line.");

    expect(() =>
      parseToolArguments("validate_submission_draft", {
        fields: {
          category: "mcp",
          name: "Long Privacy Note MCP",
          privacy_notes: "x".repeat(321),
        },
      }),
    ).toThrow("Use at most 8 non-empty lines, 320 characters per line.");
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

  it("searches registry artifacts with trust filters", async () => {
    const result = await callRegistryTool(
      "search_registry",
      {
        category: "skills",
        downloadTrust: "first-party",
        sourceStatus: "available",
        claimStatus: "unclaimed",
        limit: 5,
      },
      { dataDir },
    );

    expect(result).toMatchObject({
      ok: true,
      filters: {
        downloadTrust: "first-party",
        sourceStatus: "available",
        claimStatus: "unclaimed",
      },
    });
    expect(result.entries.length).toBeGreaterThan(0);
    expect(result.entries[0]).toMatchObject({
      downloadTrust: "first-party",
      trust: {
        package: { downloadTrust: "first-party" },
        source: { status: "available" },
      },
    });
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
      entry: {
        safetyNotes: expect.any(Array),
        privacyNotes: expect.any(Array),
      },
      trust: {
        source: { status: "available" },
        disclosures: {
          hasSafetyNotes: expect.any(Boolean),
          hasPrivacyNotes: expect.any(Boolean),
        },
      },
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
      trust: {
        recommendations: expect.any(Array),
      },
    });
    expect(guidance).not.toHaveProperty("writePath");
  });

  it("explains submission policy and entry trust through read-only helpers", async () => {
    const policy = await callRegistryTool(
      "get_submission_policy",
      {},
      { dataDir },
    );
    expect(policy).toMatchObject({
      ok: true,
      publicPolicy: {
        readOnly: true,
        createsIssues: false,
        createsPullRequests: false,
      },
      reviewModel: {
        autoMerge: false,
        importPrRequiresApprovalLabel: ["accepted", "import-approved"],
      },
      artifactPolicy: {
        communityZipHostingAllowed: false,
        maintainerBuiltDownloadsOnly: true,
      },
    });

    const trust = await callRegistryTool(
      "explain_entry_trust",
      { category: skill.category, slug: skill.slug },
      { dataDir },
    );
    expect(trust).toMatchObject({
      ok: true,
      key: `${skill.category}:${skill.slug}`,
      trust: {
        source: { status: "available" },
        package: { downloadTrust: expect.any(String) },
        recommendations: expect.any(Array),
      },
    });

    const review = await callRegistryTool(
      "review_entry_safety",
      {
        entries: [
          { category: skill.category, slug: skill.slug },
          { category: otherSkill.category, slug: otherSkill.slug },
        ],
        platform: "claude",
      },
      { dataDir },
    );
    expect(review).toMatchObject({
      ok: true,
      count: 2,
      platform: "Claude",
      summary: {
        sourceBacked: expect.any(Number),
        firstPartyPackages: expect.any(Number),
      },
      reviewNotes: expect.arrayContaining([
        expect.stringContaining("metadata review"),
      ]),
    });
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

  it("rejects non-HTTPS custom endpoint URLs for client setup", async () => {
    const setup = await callRegistryTool(
      "get_client_setup",
      { endpointUrl: "http://evil.example/mcp" },
      { dataDir },
    );
    expect(setup).toMatchObject({
      ok: false,
      error: {
        code: "invalid_request",
        message: "MCP endpoint URL must use HTTPS outside localhost.",
      },
    });
  });

  it("rejects explicit empty endpoint URLs for client setup", async () => {
    const setup = await callRegistryTool(
      "get_client_setup",
      { endpointUrl: "" },
      { dataDir },
    );
    expect(setup).toMatchObject({
      ok: false,
      error: {
        code: "invalid_request",
        message: "Invalid HeyClaude MCP tool arguments.",
      },
    });

    await expect(getClientSetup({ endpointUrl: "" })).resolves.toMatchObject({
      ok: false,
      error: {
        code: "invalid_request",
        message: "MCP endpoint URL is required.",
      },
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
      safety_notes:
        "Installs package-like skill content from a source-backed download.",
      privacy_notes:
        "Not applicable: this fixture does not access user files or credentials.",
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
      safety_notes:
        "Installs and runs an MCP server process from the submitted package.",
      privacy_notes:
        "Not applicable: this fixture does not access user files or credentials.",
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

  describe("trust-review helper edge cases", () => {
    it("explains trust for entry with safety and privacy notes", async () => {
      const trust = await callRegistryTool(
        "explain_entry_trust",
        { category: "hooks", slug: "documentation-generator" },
        { dataDir },
      );
      expect(trust).toMatchObject({
        ok: true,
        key: "hooks:documentation-generator",
        trust: {
          disclosures: {
            hasSafetyNotes: true,
            hasPrivacyNotes: true,
          },
          source: {
            status: "available",
          },
        },
      });
      expect(trust.trust.disclosures.safetyNotes.length).toBeGreaterThan(0);
      expect(trust.trust.disclosures.privacyNotes.length).toBeGreaterThan(0);
    });

    it("explains trust for entry without safety or privacy notes", async () => {
      const directory = JSON.parse(
        fs.readFileSync(path.join(dataDir, "directory-index.json"), "utf8"),
      ) as {
        entries: Array<{ category: string; slug: string }>;
      };
      const entryWithoutNotes = directory.entries.find(
        (e) => e.category === "hooks" && e.slug !== "documentation-generator",
      );
      expect(entryWithoutNotes).toBeTruthy();

      const trust = await callRegistryTool(
        "explain_entry_trust",
        {
          category: entryWithoutNotes!.category,
          slug: entryWithoutNotes!.slug,
        },
        { dataDir },
      );
      expect(trust).toMatchObject({
        ok: true,
        trust: {
          disclosures: {
            hasSafetyNotes: false,
            hasPrivacyNotes: false,
          },
        },
      });
      expect(trust.trust.disclosures.safetyNotes).toEqual([]);
      expect(trust.trust.disclosures.privacyNotes).toEqual([]);
    });

    it("explains trust for first-party package download", async () => {
      const trust = await callRegistryTool(
        "explain_entry_trust",
        { category: "skills", slug: "agent-evals-regression-gate" },
        { dataDir },
      );
      expect(trust).toMatchObject({
        ok: true,
        trust: {
          package: {
            downloadTrust: "first-party",
            downloadUrl: expect.stringContaining("/downloads/"),
          },
        },
      });
      expect(trust.trust.recommendations).not.toContain(
        expect.stringContaining("external"),
      );
    });

    it("explains trust for entry without download (copyable content only)", async () => {
      const trust = await callRegistryTool(
        "explain_entry_trust",
        { category: "hooks", slug: "documentation-generator" },
        { dataDir },
      );
      expect(trust).toMatchObject({
        ok: true,
        trust: {
          package: {
            downloadTrust: "none",
            downloadUrl: "",
          },
        },
      });
    });

    it("explains trust for entry with weak source metadata", async () => {
      const trust = await callRegistryTool(
        "explain_entry_trust",
        { category: "statuslines", slug: "python-rich-statusline" },
        { dataDir },
      );
      expect(trust).toMatchObject({
        ok: true,
        trust: {
          source: {
            githubStars: null,
            githubForks: null,
          },
        },
      });
      // Entry has weak source signals (no GitHub stats) even if it has documentation URL
    });

    it("explains trust for claimed and reviewed entry", async () => {
      const directory = JSON.parse(
        fs.readFileSync(path.join(dataDir, "directory-index.json"), "utf8"),
      ) as {
        entries: Array<{ category: string; slug: string }>;
      };
      const reviewedEntry = directory.entries.find(
        (e) => e.category === "agents" && e.slug === "contrastapi-agent",
      );
      if (!reviewedEntry) {
        // Skip if the specific entry doesn't exist in test data
        return;
      }

      const trust = await callRegistryTool(
        "explain_entry_trust",
        { category: reviewedEntry.category, slug: reviewedEntry.slug },
        { dataDir },
      );
      expect(trust).toMatchObject({
        ok: true,
        trust: {
          review: {
            claimStatus: "unclaimed",
            reviewedBy: expect.any(String),
            reviewedAt: expect.any(String),
          },
        },
      });
    });

    it("reviews safety for entries with mixed trust signals", async () => {
      const review = await callRegistryTool(
        "review_entry_safety",
        {
          entries: [
            { category: "hooks", slug: "documentation-generator" },
            { category: "skills", slug: "agent-evals-regression-gate" },
          ],
          platform: "claude",
        },
        { dataDir },
      );
      expect(review).toMatchObject({
        ok: true,
        count: 2,
        summary: {
          entriesWithSafetyOrPrivacyNotes: expect.any(Number),
          firstPartyPackages: expect.any(Number),
          sourceBacked: expect.any(Number),
        },
        reviewNotes: expect.arrayContaining([
          expect.stringContaining("metadata review"),
        ]),
      });
      expect(review.reviewNotes).not.toContain(
        expect.stringContaining("malware scan"),
      );
      expect(review.reviewNotes).not.toContain(
        expect.stringContaining("install verdict"),
      );
    });

    it("reviews safety for entry without safety notes highlights manual inspection", async () => {
      const directory = JSON.parse(
        fs.readFileSync(path.join(dataDir, "directory-index.json"), "utf8"),
      ) as {
        entries: Array<{ category: string; slug: string }>;
      };
      const entryWithoutNotes = directory.entries.find(
        (e) =>
          e.category === "hooks" &&
          e.slug !== "documentation-generator" &&
          e.slug !== "retro-daily",
      );
      expect(entryWithoutNotes).toBeTruthy();

      const review = await callRegistryTool(
        "review_entry_safety",
        {
          entries: [
            {
              category: entryWithoutNotes!.category,
              slug: entryWithoutNotes!.slug,
            },
          ],
          platform: "claude",
        },
        { dataDir },
      );
      expect(review).toMatchObject({
        ok: true,
        count: 1,
        entries: [
          expect.objectContaining({
            trust: expect.objectContaining({
              disclosures: expect.objectContaining({
                hasSafetyNotes: false,
              }),
            }),
          }),
        ],
      });
    });

    it("review_entry_safety output clearly states metadata review scope", async () => {
      const review = await callRegistryTool(
        "review_entry_safety",
        {
          entries: [{ category: "hooks", slug: "documentation-generator" }],
          platform: "claude",
        },
        { dataDir },
      );
      expect(review.reviewNotes).toContain(
        "This is a metadata review, not a malware scan or install verdict.",
      );
      expect(review.reviewNotes).not.toContain("safe to install");
      expect(review.reviewNotes).not.toContain("approved");
      expect(review.reviewNotes).not.toContain("verified malware-free");
    });

    it("explain_entry_trust output remains advisory only", async () => {
      const trust = await callRegistryTool(
        "explain_entry_trust",
        { category: "hooks", slug: "documentation-generator" },
        { dataDir },
      );
      expect(JSON.stringify(trust)).not.toContain("safe to install");
      expect(JSON.stringify(trust)).not.toContain("approved");
      expect(JSON.stringify(trust)).not.toContain("verified malware-free");
      expect(JSON.stringify(trust)).not.toContain("automatic safety");
      // Recommendations are advisory and vary by entry; check they don't claim safety
      if (
        trust.trust.recommendations &&
        trust.trust.recommendations.length > 0
      ) {
        for (const rec of trust.trust.recommendations) {
          expect(String(rec)).not.toContain("safe to install");
          expect(String(rec)).not.toContain("approved");
          expect(String(rec)).not.toContain("verified");
        }
      }
    });
  });

  describe("jobs and trending discovery resources", () => {
    it("documents the new discovery helpers with JSDoc (docstring coverage gate)", () => {
      const registrySource = fs.readFileSync(
        path.join(repoRoot, "packages/mcp/src/registry.js"),
        "utf8",
      );

      const requireDocstringBefore = (declaration: string) => {
        const index = registrySource.indexOf(declaration);
        expect(
          index,
          `Expected to find declaration: ${declaration}`,
        ).toBeGreaterThan(-1);
        const preceding = registrySource.slice(Math.max(0, index - 4000), index);
        const trimmed = preceding.trimEnd();
        expect(
          trimmed.endsWith("*/"),
          `Missing JSDoc block immediately before: ${declaration}`,
        ).toBe(true);
        const blockStart = trimmed.lastIndexOf("/**");
        expect(
          blockStart,
          `Missing JSDoc opener before: ${declaration}`,
        ).toBeGreaterThan(-1);
        const block = trimmed.slice(blockStart);
        expect(block.length).toBeGreaterThan(40);
      };

      requireDocstringBefore("export async function listRegistryRecent(");
      requireDocstringBefore("export async function listRegistryTrending(");
      requireDocstringBefore("export async function listJobsActive(");
      requireDocstringBefore("async function fetchPublicApiJson(");
      requireDocstringBefore("function publicApiBaseUrl(");
      requireDocstringBefore("function unavailable(");
      requireDocstringBefore("function toTrendingEntry(");
      requireDocstringBefore("function toJobEntry(");
      requireDocstringBefore("const DISCOVERY_RESOURCES = [");
    });

    it("lists discovery resources alongside the directory and category feeds", async () => {
      const resources = await listRegistryResources({}, { dataDir });
      const uris = (resources.resources as Array<{ uri: string }>).map(
        (resource) => resource.uri,
      );
      expect(uris).toEqual(
        expect.arrayContaining([
          "heyclaude://feeds/directory",
          "heyclaude://registry/recent",
          "heyclaude://registry/trending",
          "heyclaude://jobs/active",
        ]),
      );

      await withMcpClient(async (client) => {
        const remote = await client.listResources();
        const remoteUris = remote.resources.map(
          (resource: { uri: string }) => resource.uri,
        );
        expect(remoteUris).toEqual(
          expect.arrayContaining([
            "heyclaude://registry/recent",
            "heyclaude://registry/trending",
            "heyclaude://jobs/active",
          ]),
        );
      });
    });

    it("reads bounded recent registry updates from the local search index", async () => {
      const resource = await readRegistryResource(
        { uri: "heyclaude://registry/recent" },
        { dataDir },
      );
      const payload = JSON.parse(resource.contents[0].text);
      expect(payload).toMatchObject({
        ok: true,
        kind: "registry-recent",
        policy: { readOnly: true, createsIssues: false },
      });
      expect(payload.entries.length).toBeGreaterThan(0);
      expect(payload.entries.length).toBeLessThanOrEqual(25);
      const dates = payload.entries.map((entry: { updatedAt: string }) => entry.updatedAt);
      expect(dates).toEqual([...dates].sort().reverse());
      expect(payload.entries[0]).toMatchObject({
        key: expect.stringContaining(":"),
        updateKind: expect.stringMatching(/added|upstream_update/),
      });
    });

    it("reads trending entries via an injected public-api fetcher", async () => {
      const fetchPublicApi = async (apiPath: string) => {
        expect(apiPath).toContain("/api/registry/trending");
        return {
          schemaVersion: 1,
          kind: "registry-trending",
          category: "all",
          platform: "all",
          limit: 25,
          count: 1,
          signalsAvailable: { votes: true, community: true, intent: true },
          entries: [
            {
              category: skill.category,
              slug: skill.slug,
              title: skill.title,
              description: "Example trending entry.",
              canonicalUrl: `https://heyclau.de/${skill.category}/${skill.slug}`,
              platforms: ["Claude"],
              tags: ["evals"],
              dateAdded: "2026-05-01",
              score: 12.5,
              reasons: ["upvotes", "community_used"],
              trustSignals: { sourceStatus: "available" },
            },
          ],
        };
      };

      const resource = await readRegistryResource(
        { uri: "heyclaude://registry/trending" },
        { dataDir, fetchPublicApi },
      );
      const payload = JSON.parse(resource.contents[0].text);
      expect(payload).toMatchObject({
        ok: true,
        kind: "registry-trending",
        source: "public-api",
        signalsAvailable: { votes: true, community: true, intent: true },
        policy: { readOnly: true },
      });
      expect(payload.entries).toHaveLength(1);
      expect(payload.entries[0]).toMatchObject({
        key: `${skill.category}:${skill.slug}`,
        reasons: expect.arrayContaining(["upvotes"]),
      });
    });

    it("reads active jobs via an injected public-api fetcher", async () => {
      const fetchPublicApi = async (apiPath: string) => {
        expect(apiPath).toContain("/api/jobs");
        return {
          schemaVersion: 1,
          kind: "jobs-index",
          count: 1,
          totalAvailable: 1,
          entries: [
            {
              id: "example-job",
              title: "Example AI Engineer",
              company: "Example Co",
              location: "Remote",
              type: "full-time",
              isRemote: true,
              tier: "premium",
              applyUrl: "https://example.com/jobs/example-job",
              sourceLabel: "Example",
              postedAt: "2026-05-20",
              labels: ["ai"],
            },
          ],
        };
      };

      const resource = await readRegistryResource(
        { uri: "heyclaude://jobs/active" },
        { dataDir, fetchPublicApi },
      );
      const payload = JSON.parse(resource.contents[0].text);
      expect(payload).toMatchObject({
        ok: true,
        kind: "jobs-active",
        source: "public-api",
        totalAvailable: 1,
        policy: { readOnly: true, createsIssues: false },
      });
      expect(payload.entries).toEqual([
        expect.objectContaining({
          id: "example-job",
          isRemote: true,
          applyUrl: "https://example.com/jobs/example-job",
        }),
      ]);
    });

    it("treats malformed upstream payloads as unavailable", async () => {
      const fetchPublicApi = async () => ({ entries: null });

      const trending = await readRegistryResource(
        { uri: "heyclaude://registry/trending" },
        { dataDir, fetchPublicApi },
      );
      const trendingPayload = JSON.parse(trending.contents[0].text);
      expect(trendingPayload).toMatchObject({
        ok: false,
        error: { code: "unavailable" },
      });

      const jobs = await readRegistryResource(
        { uri: "heyclaude://jobs/active" },
        { dataDir, fetchPublicApi: async () => ({}) },
      );
      const jobsPayload = JSON.parse(jobs.contents[0].text);
      expect(jobsPayload).toMatchObject({
        ok: false,
        error: { code: "unavailable" },
      });
    });

    it("degrades gracefully when the public api is unavailable", async () => {
      const fetchPublicApi = async () => {
        throw new Error("network unreachable");
      };

      const trending = await readRegistryResource(
        { uri: "heyclaude://registry/trending" },
        { dataDir, fetchPublicApi },
      );
      const trendingPayload = JSON.parse(trending.contents[0].text);
      expect(trendingPayload).toMatchObject({
        ok: false,
        error: { code: "unavailable" },
        policy: { readOnly: true },
      });

      const jobs = await readRegistryResource(
        { uri: "heyclaude://jobs/active" },
        { dataDir, fetchPublicApi },
      );
      const jobsPayload = JSON.parse(jobs.contents[0].text);
      expect(jobsPayload).toMatchObject({
        ok: false,
        error: { code: "unavailable" },
        policy: { readOnly: true },
      });
    });
  });
});
