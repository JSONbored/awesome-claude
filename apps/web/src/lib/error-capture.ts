// Captures the original Error out-of-band so server.ts can recover the stack
// when h3 has already swallowed the throw into a generic 500 Response.
//
// The pure freshness check lives in `error-capture-lib.ts`
// (`@/lib/error-capture-lib`); this module keeps the capture buffer and the
// global `error`/`unhandledrejection` listeners.
import { CAPTURE_TTL_MS, isCaptureFresh } from "@/lib/error-capture-lib";

export { isCaptureFresh, CAPTURE_TTL_MS } from "@/lib/error-capture-lib";

let lastCapturedError: { error: unknown; at: number } | undefined;

function record(error: unknown) {
  lastCapturedError = { error, at: Date.now() };
}

if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) => record((event as ErrorEvent).error ?? event));
  globalThis.addEventListener("unhandledrejection", (event) =>
    record((event as PromiseRejectionEvent).reason),
  );
}

export function consumeLastCapturedError(): unknown {
  if (!lastCapturedError) return undefined;
  if (!isCaptureFresh(lastCapturedError.at, Date.now(), CAPTURE_TTL_MS)) {
    lastCapturedError = undefined;
    return undefined;
  }
  const { error } = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}
