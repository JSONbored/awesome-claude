"use client";

import { useCallback } from "react";

import { logClientError } from "@/lib/client-logs";

type AsyncAction<TArgs extends unknown[]> = (
  ...args: TArgs
) => Promise<void> | void;

export function useLoggedAsync<TArgs extends unknown[]>(
  event: string,
  action: AsyncAction<TArgs>,
) {
  return useCallback(
    async (...args: TArgs) => {
      try {
        await action(...args);
      } catch (error) {
        logClientError(event, error);
      }
    },
    [action, event],
  );
}
