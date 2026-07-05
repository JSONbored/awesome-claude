/**
 * API-logging surface.
 *
 * The pure metadata/payload/redaction helpers live in `api-logs-lib.ts`. This
 * module keeps the `console` dispatch and the request-bound `logApi*` wrappers,
 * and re-exports the pure helpers so existing `@/lib/api-logs` imports stay
 * unchanged.
 */
import { buildLogPayload, type LogLevel, type LogMeta, pickRequestMeta } from "@/lib/api-logs-lib";

export { redactEmail, sample } from "@/lib/api-logs-lib";

function writeLog(level: LogLevel, event: string, meta: LogMeta) {
  const line = JSON.stringify(buildLogPayload(level, event, meta));
  if (level === "error") {
    console.error(line);
    return;
  }
  if (level === "warn") {
    console.warn(line);
    return;
  }
  console.info(line);
}

export function logApiInfo(request: Request, event: string, meta: LogMeta = {}) {
  writeLog("info", event, { ...pickRequestMeta(request), ...meta });
}

export function logApiWarn(request: Request, event: string, meta: LogMeta = {}) {
  writeLog("warn", event, { ...pickRequestMeta(request), ...meta });
}

export function logApiError(request: Request, event: string, meta: LogMeta = {}) {
  writeLog("error", event, { ...pickRequestMeta(request), ...meta });
}
