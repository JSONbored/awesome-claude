import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  DEFAULT_REMOTE_MCP_URL,
  normalizeEndpointUrl,
} from "../packages/mcp/src/endpoint-url.js";
import { packageVersion } from "../packages/mcp/src/package-metadata.js";
import { parseCliArgs, renderHelp } from "../packages/mcp/src/cli-options.js";
import { repoRoot } from "./helpers/registry-fixtures";

describe("HeyClaude MCP CLI options", () => {
  it("defaults to the remote production MCP endpoint", () => {
    const options = parseCliArgs([], {});
    expect(options.mode).toBe("remote");
    expect(options.url.toString()).toBe(DEFAULT_REMOTE_MCP_URL);
    expect(options.dataDir).toBe("");
  });

  it("keeps local artifact mode explicit", () => {
    const dataDir = path.join(repoRoot, "apps/web/public/data");
    expect(parseCliArgs(["--data-dir", dataDir], {}).mode).toBe("local");
    expect(parseCliArgs(["--data-dir", dataDir], {}).dataDir).toBe(dataDir);
    expect(parseCliArgs([], { HEYCLAUDE_DATA_DIR: dataDir }).mode).toBe(
      "local",
    );
    expect(() => parseCliArgs(["--local"], {})).toThrow(/requires --data-dir/i);
  });

  it("validates remote endpoint URLs and timeout bounds", () => {
    expect(normalizeEndpointUrl("https://example.com").toString()).toBe(
      "https://example.com/api/mcp",
    );
    expect(normalizeEndpointUrl("http://localhost:3000").toString()).toBe(
      "http://localhost:3000/api/mcp",
    );
    expect(() => normalizeEndpointUrl("http://example.com")).toThrow(
      /HTTPS outside localhost/i,
    );
    expect(() => parseCliArgs(["--timeout-ms", "10"], {})).toThrow(
      /Timeout must be between/i,
    );
  });

  it("reports package version through the same metadata used by the server", () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(repoRoot, "packages/mcp/package.json"), "utf8"),
    ) as { version: string };

    expect(packageVersion).toBe(packageJson.version);
    expect(parseCliArgs(["--version"], {}).version).toBe(true);
    expect(renderHelp()).toContain(`@heyclaude/mcp ${packageJson.version}`);
  });
});
