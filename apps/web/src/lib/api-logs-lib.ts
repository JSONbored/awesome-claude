/**
 * Pure API-logging helpers.
 *
 * Builds the structured request metadata, the JSON log payload, and the
 * email-redaction / sampling utilities used by the API logger. Everything here
 * is deterministic given its inputs (the log payload takes an injectable
 * timestamp); the actual `console` dispatch lives in the `api-logs.ts` wrapper.
 *
 * The public surface (`api-logs.ts` / `@/lib/api-logs`) re-exports the public
 * helpers below.
 */

export type LogLevel = "info" | "warn" | "error";

export type LogMeta = Record<string, unknown>;

/** Non-identifying request metadata for a structured log line. */
export function pickRequestMeta(request: Request) {
  const url = new URL(request.url);
  return {
    method: request.method,
    path: url.pathname,
    query: url.search ? "present" : "none",
    cfRay: request.headers.get("cf-ray") ?? undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
  };
}

/** The structured log payload; timestamp is injectable so it is deterministic. */
export function buildLogPayload(
  level: LogLevel,
  event: string,
  meta: LogMeta,
  now: Date = new Date(),
) {
  return {
    ts: now.toISOString(),
    level,
    event,
    ...meta,
  };
}

export function sample(rate: number) {
  return Math.random() < rate;
}

export function redactEmail(value: string) {
  const email = String(value || "")
    .trim()
    .toLowerCase();
  const [local, domain] = email.split("@");
  if (!local || !domain) return "invalid";
  const visible = local.slice(0, 2);
  return `${visible}***@${domain}`;
}
