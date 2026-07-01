import { asStringArray, isRecord, sanitizeConfigValue } from "./mcp-config-validator-lib";

export function getServerSanitization(raw: Record<string, unknown>) {
  const sanitizedRaw = sanitizeConfigValue("", raw);
  const sanitizedRawValue = isRecord(sanitizedRaw.value) ? sanitizedRaw.value : {};
  return {
    sanitizedRawValue,
    sanitizedArgs: asStringArray(sanitizedRawValue.args),
    redactedSecretCount: sanitizedRaw.redactedCount,
  };
}
