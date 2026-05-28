"use client";

import { useCallback } from "react";

import { logClientError } from "@/lib/client-logs";

type AsyncAction<TArgs extends unknown[]> = (
  ...args: TArgs
) => Promise<void> | void;

type AsyncLogMeta<TArgs extends unknown[]> =
  | Record<string, unknown>
  | ((...args: TArgs) => Record<string, unknown>);

type LoggedAsyncOptions<TArgs extends unknown[]> = {
  meta?: AsyncLogMeta<TArgs>;
  onError?: (error: unknown, ...args: TArgs) => void;
};

export function useLoggedAsync<TArgs extends unknown[]>(
  event: string,
  action: AsyncAction<TArgs>,
  options: LoggedAsyncOptions<TArgs> = {},
) {
  const { meta, onError } = options;

  return useCallback(
    async (...args: TArgs) => {
      try {
        await action(...args);
      } catch (error) {
        logClientError(
          event,
          error,
          typeof meta === "function" ? meta(...args) : meta,
        );
        onError?.(error, ...args);
      }
    },
    [action, event, meta, onError],
  );
}
