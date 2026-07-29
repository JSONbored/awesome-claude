/**
 * Pure MCP install-config normalizers.
 *
 * This module holds the deterministic JSON normalization layer used to derive
 * machine-install metadata for MCP registry entries. Nothing here touches the
 * network — given the same snippet the output is byte-stable.
 *
 * The public package surface (`mcp-install-config.js` /
 * `@heyclaude/registry/mcp-install-config`) re-exports everything below so
 * existing imports stay unchanged.
 */

import { hasEmbeddedUrlUserinfo, isPublicHttpsUrl } from "./source-url-lib.js";

export const MCP_INSTALL_TARGET_IDS = [
  "claude-code",
  "codex",
  "cursor",
  "antigravity",
];

const SERVER_CONFIG_TYPES = new Set(["stdio", "http", "sse"]);

// A one-click install writes the stdio server entry straight into the user's
// client config, so whatever `command` names gets executed locally on their
// machine. Only the two managed package runners are safe to advertise that way.
// Both real consumers already enforce this same allowlist on top of us -
// `artifacts-lib.js`'s RAYCAST_ONE_CLICK_STDIO_COMMANDS and the Raycast
// extension's ONE_CLICK_STDIO_COMMANDS - so keep the sets identical.
const ONE_CLICK_STDIO_COMMANDS = new Set(["npx", "uvx"]);

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function scalarRecordIsValid(value) {
  return (
    value === undefined ||
    (isRecord(value) &&
      Object.values(value).every(
        (item) =>
          typeof item === "string" ||
          typeof item === "number" ||
          typeof item === "boolean",
      ))
  );
}

function normalizeType(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  if (normalized === "streamable-http") return "http";
  if (normalized === "http" || normalized === "sse" || normalized === "stdio") {
    return normalized;
  }
  return "";
}

function isLoopbackHostname(hostname) {
  const host = String(hostname || "")
    .trim()
    .toLowerCase()
    .replace(/^\[|\]$/g, "");
  if (host === "localhost" || host === "::1" || host === "0.0.0.0") return true;
  const ipv4 = host.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  return Boolean(ipv4 && Number(ipv4[1]) === 127);
}

function isSafeRemoteMcpUrl(value) {
  try {
    const url = new URL(String(value).trim());
    if (hasEmbeddedUrlUserinfo(value)) return false;
    if (isPublicHttpsUrl(value)) return true;
    return url.protocol === "http:" && isLoopbackHostname(url.hostname);
  } catch {
    return false;
  }
}

function normalizeArgs(value) {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return null;
  if (
    !value.every(
      (item) =>
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean",
    )
  ) {
    return null;
  }
  return value.map(String);
}

export function normalizeMcpServerConfig(value) {
  if (!isRecord(value)) return null;
  const config = cloneJson(value);

  if (config.transport !== undefined) return null;

  if (config.serverUrl !== undefined) {
    if (typeof config.serverUrl !== "string" || !config.serverUrl.trim()) {
      return null;
    }
    if (config.url === undefined) config.url = config.serverUrl;
    delete config.serverUrl;
  }

  const type = normalizeType(config.type);
  const hasCommand =
    typeof config.command === "string" && config.command.trim();
  const hasUrl = typeof config.url === "string" && config.url.trim();

  if (!type && hasCommand) config.type = "stdio";
  else if (!type && hasUrl) config.type = "http";
  else if (type) config.type = type;

  const normalizedType = normalizeType(config.type);
  if (!SERVER_CONFIG_TYPES.has(normalizedType)) return null;
  if (normalizedType === "stdio" && !hasCommand) return null;
  if (normalizedType === "http" || normalizedType === "sse") {
    if (!hasUrl || !isSafeRemoteMcpUrl(config.url)) return null;
  }

  const args = normalizeArgs(config.args);
  if (args === null) return null;
  if (args !== undefined) config.args = args;
  if (!scalarRecordIsValid(config.env)) return null;
  if (!scalarRecordIsValid(config.headers)) return null;
  if (!scalarRecordIsValid(config.http_headers)) return null;
  if (!scalarRecordIsValid(config.env_http_headers)) return null;

  return config;
}

// One-click install targets a single named server, but an `mcpServers` map may
// legitimately declare several - e.g. an SSE and a streamable variant of the
// same backend. Take the first that normalizes rather than refusing the whole
// snippet: a user offered one working install target is better served than one
// offered none. Insertion order decides, so the entry author controls the
// default by listing it first, and the rest stay visible in the entry's own
// configSnippet.
function installableServerFromMap(value) {
  if (!isRecord(value)) return null;
  for (const [name, config] of Object.entries(value)) {
    if (!isRecord(config)) continue;
    const normalized = normalizeMcpServerConfig(config);
    if (normalized) return { name, config: normalized };
  }
  return null;
}

export function extractMcpServerConfig(value) {
  const parsed = typeof value === "string" ? JSON.parse(value.trim()) : value;
  if (!isRecord(parsed)) return null;

  return installableServerFromMap(parsed.mcpServers);
}

function bearerTokenEnvVar(config) {
  return (
    (typeof config.bearerTokenEnvVar === "string" &&
      config.bearerTokenEnvVar.trim()) ||
    (typeof config.bearer_token_env_var === "string" &&
      config.bearer_token_env_var.trim()) ||
    ""
  );
}

function hasStaticOrEnvHttpHeaders(config) {
  return (
    (isRecord(config.headers) && Object.keys(config.headers).length > 0) ||
    (isRecord(config.http_headers) &&
      Object.keys(config.http_headers).length > 0) ||
    (isRecord(config.env_http_headers) &&
      Object.keys(config.env_http_headers).length > 0)
  );
}

// Mirrors the consumers' helper: a bare command name only, so a path-qualified
// lookalike like /usr/local/bin/npx cannot slip past the allowlist.
function oneClickStdioCommandName(value) {
  const command = String(value || "").trim();
  if (!command || command.includes("/") || command.includes("\\")) return "";
  return command.toLowerCase();
}

export function mcpConfigSupportsTarget(config, target, options = {}) {
  const normalized = normalizeMcpServerConfig(config);
  if (!normalized) return false;
  const type = normalizeType(normalized.type);

  // Arbitrary stdio commands stay valid registry metadata (the entry still
  // renders its own configSnippet) - they are just manual-install only.
  // `oneClick: false` asks the narrower "can this client run the config at all"
  // question, so platform-compatibility facets still count a server that works
  // fine once configured by hand.
  if (
    options.oneClick !== false &&
    type === "stdio" &&
    !ONE_CLICK_STDIO_COMMANDS.has(oneClickStdioCommandName(normalized.command))
  ) {
    return false;
  }

  if (target === "codex") {
    if (type === "sse") return false;
    if (type === "http" && hasStaticOrEnvHttpHeaders(normalized)) {
      return Boolean(bearerTokenEnvVar(normalized));
    }
  }

  return MCP_INSTALL_TARGET_IDS.includes(target);
}

export function mcpInstallTargetsForConfig(config, options = {}) {
  return MCP_INSTALL_TARGET_IDS.filter((target) =>
    mcpConfigSupportsTarget(config, target, options),
  );
}

export function formatMcpConfigSnippet(name, config) {
  const serverName = String(name || "heyclaude-mcp").trim() || "heyclaude-mcp";
  return `${JSON.stringify(
    { mcpServers: { [serverName]: config } },
    null,
    2,
  )}\n`;
}

export function resolveMcpInstallConfig(entry, options = {}) {
  if (!entry || entry.category !== "mcp") return null;
  const snippet = String(entry.configSnippet || "").trim();
  if (!snippet) return null;
  try {
    const extracted = extractMcpServerConfig(snippet);
    if (!extracted) return null;
    const name = extracted.name || entry.slug || "heyclaude-mcp";
    const targets = mcpInstallTargetsForConfig(extracted.config, options);
    if (!targets.length) return null;
    return {
      name,
      config: extracted.config,
      configSnippet: formatMcpConfigSnippet(name, extracted.config),
      targets,
    };
  } catch {
    // Non-JSON shell commands and prose are intentionally manual-only.
  }
  return null;
}
