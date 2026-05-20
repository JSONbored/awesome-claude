"use client";

import { useCallback } from "react";

type AsyncAction<TArgs extends unknown[]> = (
  ...args: TArgs
) => Promise<void> | void;

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

function logClientAsyncError(event: string, error: unknown) {
  console.error(
    JSON.stringify({
      ts: new Date().toISOString(),
      level: "error",
      event,
      error: normalizeError(error),
    }),
  );
}

export function useLoggedAsync<TArgs extends unknown[]>(
  event: string,
  action: AsyncAction<TArgs>,
) {
  return useCallback(
    async (...args: TArgs) => {
      try {
        await action(...args);
      } catch (error) {
        logClientAsyncError(event, error);
      }
    },
    [action, event],
  );
}
