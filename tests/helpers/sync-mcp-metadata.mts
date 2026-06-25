/**
 * Vitest globalSetup: regenerate packages/mcp/src/package-metadata.js from
 * packages/mcp/package.json before any test runs.
 *
 * release-please bumps packages/mcp/package.json in the Release PR, but the
 * generic extra-files updater can't reliably bump package-metadata.js at the
 * same time (it contains a quoted semver inside a JS export, which the updater
 * can't always locate). Running this in globalSetup means the file is always
 * in sync with package.json by the time tests import it, so mcp-cli.test.ts
 * and mcp-server.test.ts pass on the Release PR branch without any manual fix.
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const mcpRoot = join(__dirname, "../../packages/mcp");

export default function setup() {
  const pkg = JSON.parse(
    readFileSync(join(mcpRoot, "package.json"), "utf8"),
  ) as { name: string; version: string };

  const content =
    `// Keep this Worker-safe: Cloudflare's bundle loader rejects runtime\n` +
    `// package.json specifiers inside the SSR/MCP route bundle.\n` +
    `export const packageName = ${JSON.stringify(pkg.name)};\n` +
    `export const packageVersion = ${JSON.stringify(pkg.version)}; // x-release-please-version\n`;

  writeFileSync(join(mcpRoot, "src/package-metadata.js"), content, "utf8");
}
