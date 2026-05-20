type ClientLogMeta = Record<string, unknown>;

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }
  return {
    name: "Error",
    message: String(error || "Unknown error"),
  };
}

function writeClientLog(
  level: "error",
  event: string,
  meta: ClientLogMeta = {},
) {
  console.error(
    JSON.stringify({
      ts: new Date().toISOString(),
      level,
      event,
      ...meta,
    }),
  );
}

export function logClientError(
  event: string,
  error: unknown,
  meta: ClientLogMeta = {},
) {
  writeClientLog("error", event, {
    ...meta,
    error: normalizeError(error),
  });
}
