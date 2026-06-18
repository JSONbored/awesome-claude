import { execFile } from "node:child_process";
import {
  access,
  copyFile,
  mkdir,
  readFile,
  rename,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { isRecord } from "./utils";
import type { RaycastDetail, RaycastEntry } from "./feed";

const execFileAsync = promisify(execFile);
const SAFE_SERVER_NAME_PATTERN = /^[a-z0-9][a-z0-9._-]{0,63}$/;
const SAFE_ENV_KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;
const ENV_EXPANSION_PATTERN = /\$\{([A-Z_][A-Z0-9_]*)(?::-([^}]*))?\}/g;
const LITERAL_PLACEHOLDER_PATTERN =
  /<[^>\n]{2,}>|\b(?:YOUR|REPLACE|TODO|INSERT)_[A-Z0-9_]+\b|(?:YOUR|REPLACE|INSERT)[ _-]?(?:KEY|TOKEN|SECRET|ID)/i;
const ONE_CLICK_STDIO_COMMANDS = new Set(["npx", "uvx"]);

export type McpInstallTargetId =
  | "claude-code"
  | "codex"
  | "cursor"
  | "antigravity";

export type McpInstallKind = "cli" | "json-config";

export type McpInstallTarget = {
  id: McpInstallTargetId;
  label: string;
  installKind: McpInstallKind;
  scopeLabel: string;
  actionTitle: string;
};

export type McpServerConfig = Record<string, unknown>;

export type McpInstallPlan = {
  target: McpInstallTargetId;
  targetLabel: string;
  installKind: McpInstallKind;
  name: string;
  scopeLabel: string;
  config: McpServerConfig;
  configJson: string;
  addArgs?: string[];
  getArgs?: string[];
  removeArgs?: string[];
  configPath?: string;
  warnings: string[];
  envPlaceholders: string[];
  sourceUrl?: string;
  serverPreview: string;
};

export type McpInstallResult = {
  name: string;
  target: McpInstallTargetId;
  targetLabel: string;
  replacedExisting: boolean;
  configPath?: string;
  backupPath?: string;
  cliPath?: string;
};

export type ExecFileLike = (
  file: string,
  args: string[],
) => Promise<{ stdout?: string; stderr?: string }>;

type CliInstallTargetId = Extract<McpInstallTargetId, "claude-code" | "codex">;

export type InstallMcpServerOptions = {
  replaceExisting?: boolean;
  execFileFn?: ExecFileLike;
  cliPath?: string;
  configPath?: string;
  now?: Date;
};

export const MCP_INSTALL_TARGETS: readonly McpInstallTarget[] = [
  {
    id: "claude-code",
    label: "Claude Code",
    installKind: "cli",
    scopeLabel: "user",
    actionTitle: "Install in Claude Code",
  },
  {
    id: "codex",
    label: "Codex",
    installKind: "cli",
    scopeLabel: "user",
    actionTitle: "Install in Codex",
  },
  {
    id: "cursor",
    label: "Cursor",
    installKind: "json-config",
    scopeLabel: "global",
    actionTitle: "Install in Cursor",
  },
  {
    id: "antigravity",
    label: "Antigravity",
    installKind: "json-config",
    scopeLabel: "global",
    actionTitle: "Install in Antigravity",
  },
] as const;

export const MCP_INSTALL_TARGET_BY_ID = Object.fromEntries(
  MCP_INSTALL_TARGETS.map((target) => [target.id, target]),
) as Record<McpInstallTargetId, McpInstallTarget>;

function homeDir() {
  return process.env.HOME || process.env.USERPROFILE || os.homedir() || "";
}

export function defaultMcpConfigPath(
  target: Extract<McpInstallTargetId, "cursor" | "antigravity">,
  home = homeDir(),
) {
  return mcpJsonConfigPathCandidates(target, home)[0];
}

export function mcpJsonConfigPathCandidates(
  target: Extract<McpInstallTargetId, "cursor" | "antigravity">,
  home = homeDir(),
) {
  if (target === "cursor") return [path.join(home, ".cursor", "mcp.json")];
  return [
    path.join(home, ".gemini", "antigravity", "mcp_config.json"),
    path.join(home, ".gemini", "config", "mcp_config.json"),
  ];
}

export async function resolveMcpJsonConfigPath(
  target: Extract<McpInstallTargetId, "cursor" | "antigravity">,
  home = homeDir(),
) {
  const candidates = mcpJsonConfigPathCandidates(target, home);
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Keep looking for an existing config before falling back to the default.
    }
  }
  return candidates[0];
}

export function mcpCliCandidates(target: CliInstallTargetId) {
  const home = homeDir();
  if (target === "codex") {
    return [
      "codex",
      home ? `${home}/.local/bin/codex` : "",
      home ? `${home}/.npm-global/bin/codex` : "",
      home ? `${home}/.bun/bin/codex` : "",
      "/Applications/Codex.app/Contents/Resources/codex",
      "/opt/homebrew/bin/codex",
      "/usr/local/bin/codex",
    ].filter(Boolean);
  }

  return [
    "claude",
    home ? `${home}/.local/bin/claude` : "",
    home ? `${home}/.npm-global/bin/claude` : "",
    home ? `${home}/.bun/bin/claude` : "",
    "/opt/homebrew/bin/claude",
    "/usr/local/bin/claude",
  ].filter(Boolean);
}

export function claudeCliCandidates() {
  return mcpCliCandidates("claude-code");
}

function slugifyServerName(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[^a-z0-9]+/, "")
    .replace(/[^a-z0-9]+$/, "")
    .slice(0, 64);
  return slug || "heyclaude-mcp";
}

function safeServerName(value: string, fallback: string) {
  const candidate = slugifyServerName(value);
  return SAFE_SERVER_NAME_PATTERN.test(candidate)
    ? candidate
    : slugifyServerName(fallback);
}

function oneClickStdioCommandName(value: unknown) {
  const command = String(value || "").trim();
  if (!command || command.includes("/") || command.includes("\\")) return "";
  return command.toLowerCase();
}

export function isOneClickSafeStdioCommand(value: unknown) {
  return ONE_CLICK_STDIO_COMMANDS.has(oneClickStdioCommandName(value));
}

function stableJson(value: unknown) {
  return JSON.stringify(value);
}

function cloneConfig(config: McpServerConfig) {
  return JSON.parse(JSON.stringify(config)) as McpServerConfig;
}

function looksLikeServerConfig(value: Record<string, unknown>) {
  return (
    typeof value.command === "string" ||
    typeof value.url === "string" ||
    typeof value.serverUrl === "string" ||
    value.type === "stdio" ||
    value.type === "sse" ||
    value.type === "http" ||
    value.type === "streamable-http"
  );
}

export function extractMcpServerConfig(configSnippet: string): {
  name?: string;
  config: McpServerConfig;
} {
  const trimmed = configSnippet.trim();
  if (!trimmed) {
    throw new Error("No MCP config snippet is available for this entry.");
  }

  const parsed = JSON.parse(trimmed) as unknown;
  if (!isRecord(parsed)) {
    throw new Error("MCP config must be a JSON object.");
  }

  if (isRecord(parsed.mcpServers)) {
    const servers = Object.entries(parsed.mcpServers).filter(([, value]) =>
      isRecord(value),
    );
    if (servers.length !== 1) {
      throw new Error(
        "MCP install currently supports one MCP server per entry.",
      );
    }
    const [name, config] = servers[0];
    return { name, config: config as McpServerConfig };
  }

  if (looksLikeServerConfig(parsed)) return { config: parsed };

  throw new Error("MCP config did not contain a compatible server.");
}

export const extractClaudeMcpServerConfig = extractMcpServerConfig;

function collectStringValues(value: unknown, output: string[] = []) {
  if (typeof value === "string") {
    output.push(value);
    return output;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStringValues(item, output);
    return output;
  }
  if (isRecord(value)) {
    for (const item of Object.values(value)) collectStringValues(item, output);
  }
  return output;
}

function collectEnvPlaceholders(config: McpServerConfig) {
  const placeholders = new Set<string>();
  for (const value of collectStringValues(config)) {
    ENV_EXPANSION_PATTERN.lastIndex = 0;
    for (const match of value.matchAll(ENV_EXPANSION_PATTERN)) {
      const variableName = match[1];
      const hasDefault = match[2] !== undefined;
      if (!hasDefault && !process.env[variableName]) {
        placeholders.add(`\${${variableName}}`);
      }
    }
    if (LITERAL_PLACEHOLDER_PATTERN.test(value)) placeholders.add(value);
  }
  return [...placeholders].sort();
}

function sourceUrlFor(entry: RaycastEntry, detail: RaycastDetail) {
  return (
    detail.sourceUrl ||
    entry.repoUrl ||
    entry.documentationUrl ||
    entry.webUrl ||
    undefined
  );
}

function normalizeConfigForTarget(
  target: McpInstallTargetId,
  config: McpServerConfig,
) {
  const next = cloneConfig(config);
  if (!next.type && typeof next.command === "string") next.type = "stdio";
  if (!next.type && typeof next.url === "string") next.type = "http";
  if (
    target === "antigravity" &&
    typeof next.url === "string" &&
    typeof next.serverUrl !== "string"
  ) {
    next.serverUrl = next.url;
    delete next.url;
  }
  if (next.type === "streamable-http") next.type = "http";
  return next;
}

function normalizedConfigType(config: McpServerConfig) {
  if (typeof config.type === "string") {
    const type = config.type.toLowerCase();
    if (type === "streamable-http") return "http";
    if (type === "stdio" || type === "http" || type === "sse") return type;
  }
  if (typeof config.command === "string" && config.command.trim()) {
    return "stdio";
  }
  if (getServerUrl(config)) return "http";
  return "";
}

function getServerUrl(config: McpServerConfig) {
  if (typeof config.url === "string" && config.url.trim()) return config.url;
  if (typeof config.serverUrl === "string" && config.serverUrl.trim()) {
    return config.serverUrl;
  }
  return "";
}

function isLoopbackHostname(hostname: string) {
  const host = hostname
    .trim()
    .toLowerCase()
    .replace(/^\[|\]$/g, "");
  if (host === "localhost" || host === "::1") return true;
  const ipv4 = host.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  return Boolean(ipv4 && Number(ipv4[1]) === 127);
}

function isSafeRemoteMcpUrl(value: string) {
  try {
    const url = new URL(value.trim());
    if (url.protocol === "https:") return true;
    return url.protocol === "http:" && isLoopbackHostname(url.hostname);
  } catch {
    return false;
  }
}

function normalizeServerArgs(config: McpServerConfig, targetLabel: string) {
  if (config.args === undefined) return [];
  if (!Array.isArray(config.args)) {
    throw new Error(`${targetLabel} install requires MCP args to be an array.`);
  }
  return config.args.map((arg) => {
    if (typeof arg !== "string") {
      throw new Error(
        `${targetLabel} install requires MCP args to be strings.`,
      );
    }
    return arg;
  });
}

function normalizeServerEnv(config: McpServerConfig, targetLabel: string) {
  if (config.env === undefined) return [];
  if (!isRecord(config.env)) {
    throw new Error(`${targetLabel} install requires MCP env to be an object.`);
  }
  return Object.entries(config.env)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => {
      if (!SAFE_ENV_KEY_PATTERN.test(key)) {
        throw new Error(`${targetLabel} install found an invalid env key.`);
      }
      if (
        typeof value !== "string" &&
        typeof value !== "number" &&
        typeof value !== "boolean"
      ) {
        throw new Error(
          `${targetLabel} install requires MCP env values to be scalar.`,
        );
      }
      return `${key}=${String(value)}`;
    });
}

function bearerTokenEnvVar(config: McpServerConfig) {
  return (
    (typeof config.bearerTokenEnvVar === "string" &&
      config.bearerTokenEnvVar.trim()) ||
    (typeof config.bearer_token_env_var === "string" &&
      config.bearer_token_env_var.trim()) ||
    ""
  );
}

function hasStaticOrEnvHttpHeaders(config: McpServerConfig) {
  return (
    (isRecord(config.headers) && Object.keys(config.headers).length > 0) ||
    (isRecord(config.http_headers) &&
      Object.keys(config.http_headers).length > 0) ||
    (isRecord(config.env_http_headers) &&
      Object.keys(config.env_http_headers).length > 0)
  );
}

export function mcpConfigSupportsTarget(
  config: McpServerConfig,
  target: McpInstallTargetId,
) {
  const type = normalizedConfigType(config);
  if (!MCP_INSTALL_TARGET_BY_ID[target]) return false;
  if (type === "http" || type === "sse") {
    const url = getServerUrl(config);
    if (!url || !isSafeRemoteMcpUrl(url)) return false;
  }
  if (type === "stdio" && !isOneClickSafeStdioCommand(config.command)) {
    return false;
  }
  if (target === "codex") {
    if (type === "sse") return false;
    if (type === "http" && hasStaticOrEnvHttpHeaders(config)) {
      return Boolean(bearerTokenEnvVar(config));
    }
  }
  return Boolean(type);
}

export function mcpInstallTargetsForConfig(config: McpServerConfig) {
  return MCP_INSTALL_TARGETS.map((target) => target.id).filter((target) =>
    mcpConfigSupportsTarget(config, target),
  );
}

function formatServerPreview(config: McpServerConfig) {
  const type = normalizedConfigType(config);
  if (type === "stdio") {
    const command = typeof config.command === "string" ? config.command : "";
    return [command, ...normalizeServerArgs(config, "MCP")]
      .filter(Boolean)
      .join(" ");
  }
  const url = getServerUrl(config);
  return url ? `${type.toUpperCase()} ${url}` : "Unknown MCP server config";
}

function buildCliArgs(
  target: CliInstallTargetId,
  name: string,
  config: McpServerConfig,
  configJson: string,
) {
  if (target === "claude-code") {
    return {
      addArgs: ["mcp", "add-json", name, configJson, "--scope", "user"],
      getArgs: ["mcp", "get", name],
      removeArgs: ["mcp", "remove", name],
    };
  }

  const url = getServerUrl(config);
  if (url) {
    if (config.type === "sse") {
      throw new Error(
        "Codex install supports stdio and streamable HTTP MCP configs; this entry uses SSE.",
      );
    }
    if (hasStaticOrEnvHttpHeaders(config) && !bearerTokenEnvVar(config)) {
      throw new Error(
        "Codex install cannot preserve this MCP config's HTTP headers.",
      );
    }
    const addArgs = ["mcp", "add", name, "--url", url];
    const tokenEnvVar = bearerTokenEnvVar(config);
    if (tokenEnvVar) {
      addArgs.push("--bearer-token-env-var", tokenEnvVar);
    }
    return {
      addArgs,
      getArgs: ["mcp", "get", name, "--json"],
      removeArgs: ["mcp", "remove", name],
    };
  }

  if (typeof config.command !== "string" || !config.command.trim()) {
    throw new Error(
      "Codex install supports MCP configs with a stdio command or HTTP URL.",
    );
  }
  const envArgs = normalizeServerEnv(config, "Codex").flatMap((env) => [
    "--env",
    env,
  ]);
  const addArgs = [
    "mcp",
    "add",
    name,
    ...envArgs,
    "--",
    config.command,
    ...normalizeServerArgs(config, "Codex"),
  ];
  return {
    addArgs,
    getArgs: ["mcp", "get", name, "--json"],
    removeArgs: ["mcp", "remove", name],
  };
}

export function buildMcpInstallPlan(
  targetId: McpInstallTargetId,
  entry: RaycastEntry,
  detail: RaycastDetail,
): McpInstallPlan {
  if (entry.category !== "mcp") {
    throw new Error("Harness install is currently available for MCP entries.");
  }

  const target = MCP_INSTALL_TARGET_BY_ID[targetId];
  const advertisedTargets = detail.mcpInstallTargets?.length
    ? detail.mcpInstallTargets
    : entry.mcpInstallTargets || [];
  if (advertisedTargets.length && !advertisedTargets.includes(targetId)) {
    throw new Error(
      `${target.label} install is not available for this MCP config.`,
    );
  }
  const configSnippet = detail.configSnippet || entry.configSnippet;
  const extracted = extractMcpServerConfig(configSnippet || "");
  const name = safeServerName(extracted.name || entry.slug, entry.slug);
  if (!mcpConfigSupportsTarget(extracted.config, targetId)) {
    throw new Error(
      `${target.label} install is not available for this MCP config.`,
    );
  }
  const config = normalizeConfigForTarget(targetId, extracted.config);
  const configJson = stableJson(config);
  const envPlaceholders = collectEnvPlaceholders(config);
  const serverPreview = formatServerPreview(config);
  const warnings = [
    ...(envPlaceholders.length
      ? [
          "This server has environment placeholders. Install can proceed, but the server may not run until those values are configured.",
        ]
      : []),
    ...(targetId === "antigravity" && typeof config.serverUrl === "string"
      ? ["Antigravity uses serverUrl for remote MCP servers."]
      : []),
    ...(detail.safetyNotes || entry.safetyNotes || []),
  ];
  const cliArgs =
    target.installKind === "cli"
      ? buildCliArgs(targetId as CliInstallTargetId, name, config, configJson)
      : {};

  return {
    target: targetId,
    targetLabel: target.label,
    installKind: target.installKind,
    name,
    scopeLabel: target.scopeLabel,
    config,
    configJson,
    configPath:
      target.installKind === "json-config"
        ? defaultMcpConfigPath(targetId as "cursor" | "antigravity")
        : undefined,
    warnings,
    envPlaceholders,
    sourceUrl: sourceUrlFor(entry, detail),
    serverPreview,
    ...cliArgs,
  };
}

export function buildClaudeMcpInstallPlan(
  entry: RaycastEntry,
  detail: RaycastDetail,
) {
  return buildMcpInstallPlan("claude-code", entry, detail);
}

async function defaultExecFile(file: string, args: string[]) {
  const result = await execFileAsync(file, args, {
    timeout: 30_000,
    maxBuffer: 1024 * 1024,
  });
  return { stdout: result.stdout, stderr: result.stderr };
}

export async function resolveMcpCli(
  target: CliInstallTargetId,
  execFileFn: ExecFileLike = defaultExecFile,
) {
  const label = MCP_INSTALL_TARGET_BY_ID[target].label;
  for (const candidate of mcpCliCandidates(target)) {
    try {
      await execFileFn(candidate, ["--version"]);
      return candidate;
    } catch (error) {
      void error;
    }
  }

  throw new Error(
    `${label} CLI was not found. Install or reinstall ${label}, or repair the launcher so Raycast can run it from PATH or a common local install path.`,
  );
}

export function resolveClaudeCli(execFileFn: ExecFileLike = defaultExecFile) {
  return resolveMcpCli("claude-code", execFileFn);
}

function nodeErrorCode(error: unknown) {
  return isRecord(error) && typeof error.code === "string" ? error.code : "";
}

async function readMcpJsonConfig(configPath: string) {
  try {
    const raw = await readFile(configPath, "utf8");
    const trimmed = raw.trim();
    if (!trimmed) return { raw, config: {}, exists: true };
    const parsed = JSON.parse(trimmed) as unknown;
    if (!isRecord(parsed)) {
      throw new Error("MCP config file must contain a JSON object.");
    }
    return { raw, config: parsed as Record<string, unknown>, exists: true };
  } catch (error) {
    if (nodeErrorCode(error) === "ENOENT") {
      return { raw: "", config: {}, exists: false };
    }
    if (error instanceof SyntaxError) {
      throw new Error("Existing MCP config is not valid JSON.");
    }
    throw error;
  }
}

function getMcpServers(config: Record<string, unknown>) {
  if (config.mcpServers === undefined) {
    config.mcpServers = {};
  }
  if (!isRecord(config.mcpServers)) {
    throw new Error("Existing MCP config has a non-object mcpServers field.");
  }
  return config.mcpServers as Record<string, unknown>;
}

function backupTimestamp(now: Date) {
  return now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

async function writeMcpJsonConfig(
  plan: McpInstallPlan,
  options: InstallMcpServerOptions,
) {
  const configPath =
    options.configPath ||
    (plan.installKind === "json-config"
      ? await resolveMcpJsonConfigPath(plan.target as "cursor" | "antigravity")
      : plan.configPath);
  if (!configPath) {
    throw new Error(`${plan.targetLabel} install does not have a config path.`);
  }

  const current = await readMcpJsonConfig(configPath);
  const servers = getMcpServers(current.config);
  const existed = servers[plan.name] !== undefined;
  if (existed && !options.replaceExisting) {
    throw new Error(
      `${plan.targetLabel} MCP server "${plan.name}" already exists.`,
    );
  }

  servers[plan.name] = plan.config;
  await mkdir(path.dirname(configPath), { recursive: true });

  let backupPath: string | undefined;
  if (current.exists && current.raw.trim()) {
    backupPath = `${configPath}.bak.heyclaude-${backupTimestamp(
      options.now || new Date(),
    )}`;
    await copyFile(configPath, backupPath);
  }

  const tempPath = `${configPath}.heyclaude-${process.pid}-${Date.now()}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(current.config, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  await rename(tempPath, configPath);

  return {
    name: plan.name,
    target: plan.target,
    targetLabel: plan.targetLabel,
    replacedExisting: existed,
    configPath,
    backupPath,
  } satisfies McpInstallResult;
}

export async function mcpServerExists(
  plan: McpInstallPlan,
  options: Pick<
    InstallMcpServerOptions,
    "execFileFn" | "cliPath" | "configPath"
  > = {},
) {
  if (plan.installKind === "json-config") {
    const configPath =
      options.configPath ||
      (await resolveMcpJsonConfigPath(plan.target as "cursor" | "antigravity"));
    if (!configPath) return false;
    const current = await readMcpJsonConfig(configPath);
    const servers = getMcpServers(current.config);
    return servers[plan.name] !== undefined;
  }

  const execFileFn = options.execFileFn ?? defaultExecFile;
  const cliPath =
    options.cliPath ??
    (await resolveMcpCli(plan.target as CliInstallTargetId, execFileFn));
  try {
    await execFileFn(cliPath, plan.getArgs || []);
    return true;
  } catch {
    return false;
  }
}

export async function installMcpServer(
  plan: McpInstallPlan,
  options: InstallMcpServerOptions = {},
) {
  if (plan.installKind === "json-config") {
    return writeMcpJsonConfig(plan, options);
  }

  const execFileFn = options.execFileFn ?? defaultExecFile;
  const cliPath =
    options.cliPath ??
    (await resolveMcpCli(plan.target as CliInstallTargetId, execFileFn));
  const exists = await mcpServerExists(plan, { execFileFn, cliPath });
  if (exists && !options.replaceExisting) {
    throw new Error(
      `${plan.targetLabel} MCP server "${plan.name}" already exists.`,
    );
  }
  if (exists && options.replaceExisting) {
    await execFileFn(cliPath, plan.removeArgs || []);
  }

  await execFileFn(cliPath, plan.addArgs || []);
  await execFileFn(cliPath, plan.getArgs || []);

  return {
    name: plan.name,
    target: plan.target,
    targetLabel: plan.targetLabel,
    replacedExisting: exists,
    cliPath,
  } satisfies McpInstallResult;
}

export async function claudeMcpServerExists(
  plan: McpInstallPlan,
  execFileFn: ExecFileLike = defaultExecFile,
  claudeCli = "claude",
) {
  return mcpServerExists(plan, { execFileFn, cliPath: claudeCli });
}

export async function installClaudeMcpServer(
  plan: McpInstallPlan,
  options: {
    replaceExisting?: boolean;
    execFileFn?: ExecFileLike;
    claudeCli?: string;
  } = {},
) {
  return installMcpServer(plan, {
    replaceExisting: options.replaceExisting,
    execFileFn: options.execFileFn,
    cliPath: options.claudeCli,
  });
}
