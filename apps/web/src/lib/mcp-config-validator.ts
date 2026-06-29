import {
  buildReportText,
  extractServers,
  initMcpConfigValidatorLib,
  isRecord,
  sanitizeConfigValue,
  validateServer,
  type McpConfigValidation,
} from "@/lib/mcp-config-validator-lib";

export type { McpConfigServerReport, McpConfigValidation } from "@/lib/mcp-config-validator-lib";

const SENSITIVE_ENV_PATTERN =
  /(api[_-]?key|auth|authorization|bearer|client[_-]?secret|credential|env|password|private[_-]?key|secret|token|x-api-key)/i;
const PLACEHOLDER_PATTERN = /(\$\{[A-Z0-9_]+\}|YOUR_|REPLACE_|INSERT_|<[^>]+>|\bxxx+\b|\bTODO\b)/i;
const SECRET_VALUE_PATTERN =
  /\b(gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{40,}|glpat-[A-Za-z0-9_-]{20,}|sk-(?:proj-)?[A-Za-z0-9_-]{20,}|xox[baprs]-[A-Za-z0-9-]{20,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{20,}|Bearer\s+[A-Za-z0-9._~+/=-]{16,})\b/;
const SHELL_OPERATOR_PATTERN = /(?:&&|\|\||[;|`<>]|\$\()/;
const SENSITIVE_SPLIT_ARG_KEYS = new Set([
  "api_key",
  "apikey",
  "auth",
  "authorization",
  "bearer",
  "client_secret",
  "clientsecret",
  "password",
  "private_key",
  "privatekey",
  "secret",
  "token",
  "x_api_key",
  "xapikey",
]);

initMcpConfigValidatorLib({
  SENSITIVE_ENV_PATTERN,
  PLACEHOLDER_PATTERN,
  SECRET_VALUE_PATTERN,
  SHELL_OPERATOR_PATTERN,
  SENSITIVE_SPLIT_ARG_KEYS,
});

export function validateMcpConfigText(input: string): McpConfigValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const normalizedInput = String(input || "").trim();

  if (!normalizedInput) {
    errors.push("Paste a JSON MCP configuration.");
    const result = {
      ok: false,
      errors,
      warnings,
      servers: [],
      fixedConfigText: "",
      redactedSecretCount: 0,
    };
    return { ...result, reportText: buildReportText(result) };
  }
  if (normalizedInput.length > 100_000) {
    errors.push("Config is too large for browser-side validation.");
    const result = {
      ok: false,
      errors,
      warnings,
      servers: [],
      fixedConfigText: "",
      redactedSecretCount: 0,
    };
    return { ...result, reportText: buildReportText(result) };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(normalizedInput);
  } catch (error) {
    errors.push(error instanceof Error ? `Invalid JSON: ${error.message}` : "Invalid JSON.");
    const result = {
      ok: false,
      errors,
      warnings,
      servers: [],
      fixedConfigText: "",
      redactedSecretCount: 0,
    };
    return { ...result, reportText: buildReportText(result) };
  }

  const extracted = extractServers(parsed);
  if (extracted.rootError) errors.push(extracted.rootError);
  if (extracted.wrapped) {
    warnings.push("Input looked like a bare servers object; output wraps it in mcpServers.");
  }

  const reports = Object.entries(extracted.servers).map(([name, value]) =>
    validateServer(name, value),
  );
  let rootRedactedSecretCount = 0;
  const sanitizedRootConfig = Object.fromEntries(
    isRecord(parsed) && !extracted.wrapped
      ? Object.entries(parsed)
          .filter(([key]) => key !== "mcpServers")
          .map(([key, value]) => {
            const sanitized = sanitizeConfigValue(key, value);
            rootRedactedSecretCount += sanitized.redactedCount;
            return [key, sanitized.value];
          })
      : [],
  );
  const redactedSecretCount = reports.reduce(
    (count, report) => count + report.redactedSecretCount,
    rootRedactedSecretCount,
  );
  const sanitizedConfig = {
    ...sanitizedRootConfig,
    mcpServers: Object.fromEntries(reports.map((report) => [report.name, report.sanitized])),
  };

  for (const report of reports) {
    errors.push(...report.errors.map((error) => `${report.name}: ${error}`));
    warnings.push(...report.warnings.map((warning) => `${report.name}: ${warning}`));
  }

  const result = {
    ok: errors.length === 0,
    errors,
    warnings,
    servers: reports.map(({ sanitized: _sanitized, ...report }) => report),
    fixedConfigText: reports.length ? JSON.stringify(sanitizedConfig, null, 2) : "",
    redactedSecretCount,
  };
  return { ...result, reportText: buildReportText(result) };
}
