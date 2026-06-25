#!/usr/bin/env node

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import { normalizeEndpointUrl } from "../src/endpoint-url.js";
import { READ_ONLY_TOOL_NAMES } from "../src/registry.js";

const baselineToolNames = [
  "registry.search",
  "entry.detail",
  "install.compatibility",
  "install.guidance",
  "install.adapter",
  "registry.feeds",
  "submission.schema",
  "submission.validate",
  "submission.duplicates",
  "submission.urls",
  "submission.guidance",
];

function parseArgs(argv) {
  const args = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--") continue;
    if (!value.startsWith("--")) continue;
    if (value === "--strict-tools") {
      args.set("strict-tools", "1");
      continue;
    }
    if (value === "--require-safety-metadata") {
      args.set("require-safety-metadata", "1");
      continue;
    }
    args.set(value.slice(2), argv[index + 1] ?? "");
    index += 1;
  }
  return args;
}

function parseToolResult(result) {
  const text = result?.content?.find((item) => item?.type === "text")?.text;
  if (!text) throw new Error("MCP tool response did not include text content.");
  return JSON.parse(text);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertSubmitUrl(value) {
  let url;
  try {
    url = new URL(String(value || ""));
  } catch {
    throw new Error("submission.urls did not return an absolute submit URL.");
  }
  assert(
    url.protocol === "https:",
    "submission.urls submit URL must use HTTPS.",
  );
  assert(
    url.origin === "https://heyclau.de",
    "submission.urls submit URL used the wrong origin.",
  );
  assert(
    url.pathname === "/submit",
    "submission.urls did not return the submit URL.",
  );
}

function assertSafetyMetadataShape(payload, label) {
  assert(
    Array.isArray(payload?.safetyNotes),
    `${label} did not expose safetyNotes as an array.`,
  );
  assert(
    Array.isArray(payload?.privacyNotes),
    `${label} did not expose privacyNotes as an array.`,
  );
}

async function validateHttpGuards(endpointUrl) {
  const options = await fetch(endpointUrl, { method: "OPTIONS" });
  assert(options.status === 204, `OPTIONS returned ${options.status}`);
  assert(
    String(options.headers.get("access-control-allow-methods") || "").includes(
      "POST",
    ),
    "OPTIONS did not expose POST in access-control-allow-methods.",
  );
  assert(
    options.headers.get("cache-control") === "no-store",
    "OPTIONS did not return cache-control: no-store.",
  );

  const invalidContentType = await fetch(endpointUrl, {
    method: "POST",
    headers: {
      accept: "application/json, text/event-stream",
      "content-type": "text/plain",
    },
    body: "{}",
  });
  assert(
    invalidContentType.status === 415 || invalidContentType.status === 403,
    `text/plain POST returned ${invalidContentType.status}`,
  );

  const forbiddenOrigin = await fetch(endpointUrl, {
    method: "POST",
    headers: {
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
      origin: "https://example.invalid",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "forbidden-origin",
      method: "tools/list",
      params: {},
    }),
  });
  assert(
    forbiddenOrigin.status === 403,
    `forbidden origin POST returned ${forbiddenOrigin.status}`,
  );
}

function validateToolList(toolNames, strictTools) {
  if (strictTools) {
    assert(
      JSON.stringify(toolNames) === JSON.stringify(READ_ONLY_TOOL_NAMES),
      `Unexpected tool list: ${toolNames.join(", ")}`,
    );
    return;
  }

  for (const toolName of baselineToolNames) {
    assert(
      toolNames.includes(toolName),
      `Deployed MCP endpoint is missing baseline tool: ${toolName}`,
    );
  }
}

async function validateMcpTools(endpointUrl, options = {}) {
  const client = new Client({
    name: "heyclaude-endpoint-validator",
    version: "0.1.0",
  });
  const transport = new StreamableHTTPClientTransport(endpointUrl);

  try {
    await client.connect(transport);

    const tools = await client.listTools();
    const toolNames = tools.tools.map((tool) => tool.name);
    validateToolList(toolNames, options.strictTools);
    const hasVersionTwoSurface = toolNames.includes("registry.stats");
    if (hasVersionTwoSurface) {
      assert(
        tools.tools.every((tool) => tool.annotations?.readOnlyHint === true),
        "All HeyClaude MCP tools must advertise read-only annotations.",
      );
      assert(
        tools.tools.every((tool) => tool.outputSchema?.type === "object"),
        "All HeyClaude MCP tools must expose object output schemas.",
      );

      const resources = await client.listResources();
      assert(
        resources.resources.some(
          (resource) => resource.uri === "heyclaude://feeds/directory",
        ),
        "MCP resources did not expose the directory feed resource.",
      );
      const directoryResource = await client.readResource({
        uri: "heyclaude://feeds/directory",
      });
      assert(
        directoryResource.contents?.[0]?.mimeType === "application/json",
        "Directory resource did not return JSON content.",
      );

      const prompts = await client.listPrompts();
      assert(
        prompts.prompts.some((prompt) => prompt.name === "asset.find"),
        "MCP prompts did not expose asset.find.",
      );
      const installPrompt = await client.getPrompt({
        name: "install.asset",
        arguments: { category: "mcp", slug: "example", platform: "Codex" },
      });
      assert(
        installPrompt.messages?.[0]?.content?.text?.includes(
          "install.guidance",
        ),
        "install.asset prompt did not mention install guidance.",
      );
    }

    const search = parseToolResult(
      await client.callTool({
        name: "registry.search",
        arguments: { query: "mcp", limit: 2 },
      }),
    );
    assert(search.ok === true, "registry.search did not return ok: true.");
    assert(
      Array.isArray(search.entries) && search.entries.length > 0,
      "registry.search did not return entries.",
    );
    if (options.requireSafetyMetadata) {
      assertSafetyMetadataShape(
        search.entries[0],
        "registry.search first entry",
      );
    }

    if (toolNames.includes("registry.info")) {
      const info = parseToolResult(
        await client.callTool({
          name: "registry.info",
          arguments: {},
        }),
      );
      assert(info.ok === true, "server.info did not return ok.");
      assert(
        info.endpoint?.auth === "none",
        "server.info did not expose the public no-key access model.",
      );
      assert(
        info.endpoint?.rateLimit?.binding === "API_MCP_RATE_LIMIT",
        "server.info did not expose the MCP rate-limit binding.",
      );
    }

    if (toolNames.includes("registry.list")) {
      const listed = parseToolResult(
        await client.callTool({
          name: "registry.list",
          arguments: { category: "mcp", limit: 2 },
        }),
      );
      assert(listed.ok === true, "registry.list did not return ok.");
      assert(
        Array.isArray(listed.entries) && listed.entries.length > 0,
        "registry.list did not return entries.",
      );
    }

    if (toolNames.includes("registry.stats")) {
      const stats = parseToolResult(
        await client.callTool({
          name: "registry.stats",
          arguments: {},
        }),
      );
      assert(stats.ok === true, "registry.stats did not return ok.");
      assert(
        stats.policy?.readOnly === true,
        "registry.stats did not expose the no-write policy.",
      );
    }

    const first = search.entries[0];
    const detail = parseToolResult(
      await client.callTool({
        name: "entry.detail",
        arguments: { category: first.category, slug: first.slug },
      }),
    );
    assert(detail.ok === true, "entry.detail did not return ok: true.");
    assert(
      detail.key === `${first.category}:${first.slug}`,
      "entry.detail returned the wrong entry.",
    );
    if (options.requireSafetyMetadata) {
      assertSafetyMetadataShape(detail.entry, "entry.detail entry");
    }

    if (toolNames.includes("entry.asset")) {
      const asset = parseToolResult(
        await client.callTool({
          name: "entry.asset",
          arguments: { category: first.category, slug: first.slug },
        }),
      );
      assert(asset.ok === true, "entry.asset did not return ok.");
      assert(
        asset.primaryAsset || asset.assets?.length,
        "entry.asset did not return any copyable asset.",
      );
    }

    const feeds = parseToolResult(
      await client.callTool({
        name: "registry.feeds",
        arguments: {},
      }),
    );
    assert(feeds.ok === true, "feeds.list did not return ok.");
    assert(
      feeds.artifacts?.directory === "/data/directory-index.json",
      "feeds.list did not expose the directory artifact.",
    );

    const schema = parseToolResult(
      await client.callTool({
        name: "submission.schema",
        arguments: { category: "mcp" },
      }),
    );
    assert(schema.ok === true, "submission.schema did not return ok.");
    assert(
      schema.prIntake?.mode === "github_app_user_fork_pr",
      "submission.schema did not return PR-first intake metadata.",
    );
    if (options.requireSafetyMetadata) {
      const fieldIds = schema.schema?.fields?.map((field) => field.id) || [];
      assert(
        fieldIds.includes("safety_notes"),
        "submission.schema did not expose safety_notes.",
      );
      assert(
        fieldIds.includes("privacy_notes"),
        "submission.schema did not expose privacy_notes.",
      );
    }

    const urls = parseToolResult(
      await client.callTool({
        name: "submission.urls",
        arguments: {
          fields: {
            category: "mcp",
            name: "Endpoint Validation MCP",
            docs_url: "https://example.com/docs",
            description:
              "Endpoint validation draft for the HeyClaude MCP submission helpers.",
            install_command: "npx -y endpoint-validation-mcp",
            usage_snippet: "Use this draft to validate MCP route behavior.",
          },
        },
      }),
    );
    assert(urls.ok === true, "submission.urls did not return ok.");
    assertSubmitUrl(urls.submitUrl);

    if (toolNames.includes("submission.prepare")) {
      const prepared = parseToolResult(
        await client.callTool({
          name: "submission.prepare",
          arguments: {
            fields: {
              category: "mcp",
              name: "Endpoint Validation MCP",
              docs_url: "https://example.com/docs",
              description:
                "Endpoint validation draft for the HeyClaude MCP submission helpers.",
              install_command: "npx -y endpoint-validation-mcp",
              usage_snippet: "Use this draft to validate MCP route behavior.",
            },
          },
        }),
      );
      assert(
        prepared.prDraft?.body,
        "submission.prepare did not return a canonical PR draft body.",
      );
      assert(
        String(prepared.submissionPolicy || "").includes(
          "may be merged automatically",
        ),
        "submission.prepare did not expose the maintainer-reviewed policy.",
      );
    }

    const invalid = parseToolResult(
      await client.callTool({
        name: "registry.search",
        arguments: { limit: 100, unexpected: true },
      }),
    );
    assert(invalid.ok === false, "Invalid registry.search call did not fail.");
    assert(
      invalid.error?.code === "invalid_request",
      "Invalid registry.search call did not return invalid_request.",
    );
  } finally {
    await client.close();
  }
}

const args = parseArgs(process.argv.slice(2));
const endpointUrlRaw = args.get("url") || process.env.MCP_ENDPOINT_URL;
const endpointUrl = endpointUrlRaw ? normalizeEndpointUrl(endpointUrlRaw) : "";
const strictTools =
  args.get("strict-tools") === "1" ||
  process.env.MCP_ENDPOINT_STRICT_TOOLS === "1";
const requireSafetyMetadata =
  args.get("require-safety-metadata") === "1" ||
  process.env.MCP_ENDPOINT_REQUIRE_SAFETY_METADATA === "1";

if (!endpointUrl) {
  console.error(
    "Missing --url or MCP_ENDPOINT_URL for MCP endpoint validation.",
  );
  process.exit(1);
}

try {
  await validateHttpGuards(endpointUrl);
  await validateMcpTools(endpointUrl, { strictTools, requireSafetyMetadata });
  console.log(`Validated HeyClaude MCP endpoint at ${endpointUrl.toString()}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
