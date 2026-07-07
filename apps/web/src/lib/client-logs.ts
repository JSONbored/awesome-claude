import { normalizeError } from "@/lib/client-logs-lib";

export { normalizeError } from "@/lib/client-logs-lib";

type ClientLogMeta = Record<string, unknown>;

function writeClientLog(level: "error", event: string, meta: ClientLogMeta = {}) {
  console.error(
    JSON.stringify({
      ts: new Date().toISOString(),
      level,
      event,
      ...meta,
    }),
  );
}

export function logClientError(event: string, error: unknown, meta: ClientLogMeta = {}) {
  writeClientLog("error", event, {
    ...meta,
    error: normalizeError(error),
  });
}
