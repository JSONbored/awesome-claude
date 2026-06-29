/**
 * Vitest globalSetup: verify packages/mcp/src/package-metadata.js is committed
 * in sync with packages/mcp/package.json before any MCP tests run.
 *
 * Release validation must fail on committed metadata drift instead of repairing
 * the local checkout. The npm publish workflow publishes from a fresh checkout,
 * so mutating this tracked file during tests can mask stale package metadata.
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const mcpRoot = join(__dirname, "../../packages/mcp");

export default function setup() {
  const pkg = JSON.parse(
    readFileSync(join(mcpRoot, "package.json"), "utf8"),
  ) as { name: string; version: string };

  const metadata = readFileSync(
    join(mcpRoot, "src/package-metadata.js"),
    "utf8",
  );

  const expectedName = `export const packageName = ${JSON.stringify(pkg.name)};`;
  const expectedVersion = `export const packageVersion = ${JSON.stringify(pkg.version)};`;

  if (!metadata.includes(expectedName) || !metadata.includes(expectedVersion)) {
    throw new Error(
      [
        "packages/mcp/src/package-metadata.js is out of sync with packages/mcp/package.json.",
        `Expected committed metadata to include: ${expectedName}`,
        `Expected committed metadata to include: ${expectedVersion}`,
        "Update package-metadata.js in the same change as the MCP package version bump.",
      ].join("\n"),
    );
  }
}
