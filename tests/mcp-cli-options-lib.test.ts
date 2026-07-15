import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  DEFAULT_REMOTE_MCP_URL,
  normalizeEndpointUrl,
} from "../packages/mcp/src/endpoint-url.js";
import {
  parseCliArgs,
  renderHelp,
} from "../packages/mcp/src/cli-options-lib.js";
import {
  parseCliArgs as parseCliArgsFromWrapper,
  renderHelp as renderHelpFromWrapper,
} from "../packages/mcp/src/cli-options.js";
import { packageVersion } from "../packages/mcp/src/package-metadata.js";
import { repoRoot } from "./helpers/registry-fixtures";

describe("cli-options-lib remote defaults", () => {
  it("defaults to the remote production MCP endpoint", () => {
    const options = parseCliArgs([], {});
    expect(options.mode).toBe("remote");
    expect(options.url.toString()).toBe(DEFAULT_REMOTE_MCP_URL);
    expect(options.dataDir).toBe("");
  });

  it("normalizes remote endpoint URLs during parsing", () => {
    const options = parseCliArgs(["--url", "https://example.com"], {});
    expect(options.url.toString()).toBe("https://example.com/api/mcp");
    expect(normalizeEndpointUrl("http://localhost:3000").toString()).toBe(
      "http://localhost:3000/api/mcp",
    );
    expect(() => normalizeEndpointUrl("http://example.com")).toThrow(
      /HTTPS outside localhost/i,
    );
  });
});

describe("cli-options-lib local mode", () => {
  it("keeps local artifact mode explicit", () => {
    const dataDir = path.join(repoRoot, "apps/web/public/data");
    expect(parseCliArgs(["--data-dir", dataDir], {}).mode).toBe("local");
    expect(parseCliArgs(["--data-dir", dataDir], {}).dataDir).toBe(dataDir);
    expect(parseCliArgs([], { HEYCLAUDE_DATA_DIR: dataDir }).mode).toBe(
      "local",
    );
    expect(() => parseCliArgs(["--local"], {})).toThrow(/requires --data-dir/i);
  });
});

describe("cli-options-lib validation and help", () => {
  it("validates timeout bounds and unknown flags", () => {
    expect(() => parseCliArgs(["--timeout-ms", "10"], {})).toThrow(
      /Timeout must be between/i,
    );
    expect(() => parseCliArgs(["--unknown"], {})).toThrow(/Unknown option/i);
  });

  it("reports package version through help text", () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(repoRoot, "packages/mcp/package.json"), "utf8"),
    ) as { version: string };

    expect(packageVersion).toBe(packageJson.version);
    expect(parseCliArgs(["--version"], {}).version).toBe(true);
    expect(renderHelp()).toContain(`@heyclaude/mcp ${packageJson.version}`);
  });
});

describe("cli-options re-export compatibility", () => {
  it("keeps the public wrapper wired to the extracted lib", () => {
    expect(parseCliArgsFromWrapper([], {})).toEqual(parseCliArgs([], {}));
    expect(renderHelpFromWrapper()).toBe(renderHelp());
  });
});

describe("cli-options-lib flag parsing edge cases", () => {
  it("throws when a value flag is missing its argument or gets another flag", () => {
    expect(() => parseCliArgs(["--url"], {})).toThrow(
      "--url requires a value.",
    );
    expect(() => parseCliArgs(["--url", "-x"], {})).toThrow(
      "--url requires a value.",
    );
  });

  it("skips the bare -- separator", () => {
    expect(parseCliArgs(["--"], {}).mode).toBe("remote");
  });

  it("sets help for both --help and -h", () => {
    expect(parseCliArgs(["--help"], {}).help).toBe(true);
    expect(parseCliArgs(["-h"], {}).help).toBe(true);
  });
});
