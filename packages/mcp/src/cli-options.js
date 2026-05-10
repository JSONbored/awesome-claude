import {
  DEFAULT_REMOTE_MCP_URL,
  DEFAULT_REQUEST_TIMEOUT_MS,
  normalizeEndpointUrl,
  normalizeTimeoutMs,
} from "./endpoint-url.js";
import { packageName, packageVersion } from "./package-metadata.js";

const helpText = `${packageName} ${packageVersion}

Read-only stdio MCP bridge for the HeyClaude registry.

Usage:
  heyclaude-mcp [--url <endpoint>] [--timeout-ms <ms>]
  heyclaude-mcp --local --data-dir <path>

Options:
  --url <endpoint>       Remote Streamable HTTP MCP endpoint.
                         Defaults to ${DEFAULT_REMOTE_MCP_URL}
  --local                Run the local artifact-backed MCP server.
  --data-dir <path>      Generated registry data directory for local mode.
  --timeout-ms <ms>      Remote request timeout. Default ${DEFAULT_REQUEST_TIMEOUT_MS}.
  --version, -v          Print package version.
  --help, -h             Print this help text.

Environment:
  HEYCLAUDE_MCP_URL          Remote MCP endpoint override.
  HEYCLAUDE_MCP_TIMEOUT_MS   Remote request timeout override.
  HEYCLAUDE_DATA_DIR         Local data directory; enables local mode.
`;

function readFlagValue(argv, index, flag) {
  const value = argv[index + 1];
  if (!value || value.startsWith("-")) {
    throw new Error(`${flag} requires a value.`);
  }
  return value;
}

export function renderHelp() {
  return helpText;
}

export function parseCliArgs(argv = [], env = process.env) {
  const options = {
    mode: "remote",
    url: env.HEYCLAUDE_MCP_URL || DEFAULT_REMOTE_MCP_URL,
    dataDir: env.HEYCLAUDE_DATA_DIR || "",
    timeoutMs: normalizeTimeoutMs(env.HEYCLAUDE_MCP_TIMEOUT_MS),
    help: false,
    version: false,
  };

  if (options.dataDir) {
    options.mode = "local";
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") continue;
    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }
    if (arg === "--version" || arg === "-v") {
      options.version = true;
      continue;
    }
    if (arg === "--local") {
      options.mode = "local";
      continue;
    }
    if (arg === "--url") {
      options.url = readFlagValue(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--data-dir") {
      options.dataDir = readFlagValue(argv, index, arg);
      options.mode = "local";
      index += 1;
      continue;
    }
    if (arg === "--timeout-ms") {
      options.timeoutMs = normalizeTimeoutMs(readFlagValue(argv, index, arg));
      index += 1;
      continue;
    }
    throw new Error(`Unknown option: ${arg}`);
  }

  if (options.help || options.version) return options;

  if (options.mode === "local") {
    if (!options.dataDir) {
      throw new Error("Local mode requires --data-dir or HEYCLAUDE_DATA_DIR.");
    }
    return options;
  }

  options.url = normalizeEndpointUrl(options.url);
  return options;
}
