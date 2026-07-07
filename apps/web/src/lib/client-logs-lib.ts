/**
 * Pure normalization of an unknown thrown value into a `{ name, message }`
 * shape.
 *
 * The logging side effect (`console.error`) lives in `client-logs.ts`
 * (`@/lib/client-logs`), which imports this helper and re-exports it. Given the
 * same input the output here is deterministic — no module state, no console
 * side effects — so it is unit-testable in isolation.
 */

export type NormalizedError = { name: string; message: string };

/**
 * Reduce any thrown value to a safe `{ name, message }` pair. Real `Error`
 * instances keep their `name`/`message`; anything else is coerced to a string
 * message under the generic `"Error"` name, with falsy values reported as
 * `"Unknown error"`.
 */
export function normalizeError(error: unknown): NormalizedError {
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
