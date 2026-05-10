#!/usr/bin/env node

import { execFile as execFileCallback } from "node:child_process";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);
const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const packageDir = path.join(repoRoot, "packages", "mcp");
const dataDir = path.join(repoRoot, "apps", "web", "public", "data");
const remoteSmokeUrl = process.env.MCP_PACKAGE_REMOTE_SMOKE_URL || "";
const packageRequire = createRequire(path.join(packageDir, "package.json"));
const { Client } = await import(
  packageRequire.resolve("@modelcontextprotocol/sdk/client/index.js")
);
const { StdioClientTransport } = await import(
  packageRequire.resolve("@modelcontextprotocol/sdk/client/stdio.js")
);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function run(command, args, options = {}) {
  return execFile(command, args, {
    timeout: 120000,
    maxBuffer: 10 * 1024 * 1024,
    ...options,
  });
}

function parseJsonOutput(output) {
  const parsed = JSON.parse(output);
  return Array.isArray(parsed) ? parsed[0] : parsed;
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function smokeMcpServer(command, args, label) {
  const client = new Client({
    name: `heyclaude-package-${label}-smoke`,
    version: "0.1.0",
  });
  const transport = new StdioClientTransport({
    command,
    args,
    stderr: "pipe",
  });

  try {
    await client.connect(transport, { timeout: 30000 });
    const tools = await client.listTools(undefined, { timeout: 30000 });
    const toolNames = tools.tools.map((tool) => tool.name);
    assert(
      toolNames.includes("search_registry"),
      `${label} smoke did not expose search_registry.`,
    );

    const search = await client.callTool(
      {
        name: "search_registry",
        arguments: { query: "mcp", limit: 1 },
      },
      undefined,
      { timeout: 30000 },
    );
    const text = search.content?.find((item) => item.type === "text")?.text;
    assert(text, `${label} smoke did not return a text tool result.`);
    const result = JSON.parse(text);
    assert(result.ok === true, `${label} smoke search did not return ok.`);
  } finally {
    await client.close().catch(() => {});
  }
}

async function main() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "heyclaude-mcp-"));
  const installDir = path.join(tempRoot, "install");
  await fs.mkdir(installDir, { recursive: true });

  try {
    const packageJson = await readJson(path.join(packageDir, "package.json"));
    assert(
      packageJson.name === "@heyclaude/mcp",
      "Unexpected MCP package name.",
    );
    assert(packageJson.private !== true, "MCP package must be publishable.");
    assert(
      !packageJson.scripts?.postinstall,
      "MCP package must not run postinstall.",
    );
    assert(
      !packageJson.scripts?.preinstall,
      "MCP package must not run preinstall.",
    );
    assert(!packageJson.scripts?.install, "MCP package must not run install.");
    assert(
      !Object.values(packageJson.dependencies || {}).includes("workspace:*"),
      "MCP package must not publish workspace dependencies.",
    );

    await fs.access(path.join(dataDir, "directory-index.json"));

    const { stdout } = await run(
      "npm",
      ["pack", "--json", "--pack-destination", tempRoot],
      { cwd: packageDir },
    );
    const pack = parseJsonOutput(stdout);
    const files = pack.files.map((file) => file.path);
    assert(
      files.includes("package.json"),
      "Package tarball is missing package.json.",
    );
    assert(files.includes("src/cli.js"), "Package tarball is missing CLI.");
    assert(
      files.includes("src/remote-proxy.js"),
      "Package tarball is missing remote proxy.",
    );
    assert(
      files.includes("src/endpoint-url.js"),
      "Package tarball is missing endpoint URL helpers.",
    );
    assert(
      !files.some((file) => file.startsWith("apps/web/public/data")),
      "Package tarball must not embed generated website data.",
    );

    const tarball = path.join(tempRoot, pack.filename);
    await run(
      "npm",
      ["install", "--ignore-scripts", "--no-audit", "--no-fund", tarball],
      { cwd: installDir },
    );

    const binPath = path.join(
      installDir,
      "node_modules",
      ".bin",
      process.platform === "win32" ? "heyclaude-mcp.cmd" : "heyclaude-mcp",
    );
    const help = await run(binPath, ["--help"], { cwd: installDir });
    assert(
      help.stdout.includes("@heyclaude/mcp"),
      "CLI help is missing package name.",
    );
    const version = await run(binPath, ["--version"], { cwd: installDir });
    assert(
      version.stdout.trim() === packageJson.version,
      "CLI version does not match package.json.",
    );

    await smokeMcpServer(binPath, ["--local", "--data-dir", dataDir], "local");

    if (remoteSmokeUrl) {
      await smokeMcpServer(binPath, ["--url", remoteSmokeUrl], "remote");
    } else {
      console.log(
        "Skipping remote packed-package smoke; MCP_PACKAGE_REMOTE_SMOKE_URL is not set.",
      );
    }

    console.log(`Validated packed ${packageJson.name}@${packageJson.version}`);
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
