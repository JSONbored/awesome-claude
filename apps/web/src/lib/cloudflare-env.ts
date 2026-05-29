import { AsyncLocalStorage } from "node:async_hooks";

type RuntimeContext = {
  env: Record<string, unknown>;
  ctx: unknown;
  request: Request;
};

const runtimeStorage = new AsyncLocalStorage<RuntimeContext>();

export function runWithCloudflareRuntime<T>(
  request: Request,
  env: unknown,
  ctx: unknown,
  callback: () => T,
) {
  return runtimeStorage.run(
    {
      request,
      ctx,
      env:
        env && typeof env === "object"
          ? (env as Record<string, unknown>)
          : {},
    },
    callback,
  );
}

export function getCloudflareRuntime() {
  return runtimeStorage.getStore() ?? null;
}

export function getCloudflareEnv() {
  return getCloudflareRuntime()?.env ?? {};
}

export function getCloudflareBinding<T = unknown>(name: string): T | undefined {
  const value = getCloudflareEnv()[name];
  return value as T | undefined;
}

export function getEnvString(...names: string[]) {
  const env = getCloudflareEnv();
  for (const name of names) {
    const runtimeValue = env[name];
    if (typeof runtimeValue === "string" && runtimeValue.trim()) {
      return runtimeValue.trim();
    }
    const processValue = process.env[name];
    if (typeof processValue === "string" && processValue.trim()) {
      return processValue.trim();
    }
  }
  return "";
}
