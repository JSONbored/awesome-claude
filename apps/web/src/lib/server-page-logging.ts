export interface ServerPageLogger {
  info: (event: string, meta?: Record<string, unknown>) => void;
  error: (event: string, meta?: Record<string, unknown>) => void;
}

export interface DurationContext {
  getDurationMs: () => number;
  logger: ServerPageLogger;
  requestId: string;
}

export function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }
  return "Unknown error";
}

function writeServerPageLog(
  level: "info" | "error",
  event: string,
  requestId: string,
  meta: Record<string, unknown> = {},
) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    event,
    requestId,
    ...meta,
  };
  const line = JSON.stringify(payload);
  if (level === "error") {
    console.error(line);
    return;
  }
  console.info(line);
}

export function createServerPageLogger(
  namespace: string,
  requestId: string,
): ServerPageLogger {
  return {
    info(event, meta = {}) {
      writeServerPageLog("info", `${namespace}.${event}`, requestId, meta);
    },
    error(event, meta = {}) {
      writeServerPageLog("error", `${namespace}.${event}`, requestId, meta);
    },
  };
}

export async function withDuration<T>(
  namespace: string,
  callback: (context: DurationContext) => Promise<T>,
): Promise<T> {
  const startedAt = Date.now();
  const requestId = crypto.randomUUID();
  const logger = createServerPageLogger(namespace, requestId);
  const getDurationMs = () => Date.now() - startedAt;

  try {
    return await callback({ getDurationMs, logger, requestId });
  } catch (error) {
    logger.error("failed", {
      durationMs: getDurationMs(),
      error: normalizeError(error),
    });
    throw error;
  }
}
