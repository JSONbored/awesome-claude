import { AsyncLocalStorage } from "node:async_hooks";

type RuntimeContext = {
  env: Record<string, unknown>;
  ctx: unknown;
  request: Request;
};

type CloudflareRuntimeRequest = Request & {
  runtime?: {
    cloudflare?: {
      env?: unknown;
      context?: unknown;
    };
  };
};

const runtimeStorage = new AsyncLocalStorage<RuntimeContext>();

function envRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function nitroGlobalEnv(): Record<string, unknown> | null {
  return envRecord((globalThis as typeof globalThis & { __env__?: unknown }).__env__);
}

function requestCloudflareRuntime(request: Request) {
  return (request as CloudflareRuntimeRequest).runtime?.cloudflare ?? null;
}

export function runWithCloudflareRuntime<T>(
  request: Request,
  env: unknown,
  ctx: unknown,
  callback: () => T,
) {
  const requestRuntime = requestCloudflareRuntime(request);
  return runtimeStorage.run(
    {
      request,
      ctx: ctx ?? requestRuntime?.context,
      env: envRecord(env) ?? envRecord(requestRuntime?.env) ?? nitroGlobalEnv() ?? {},
    },
    callback,
  );
}

export function getCloudflareRuntime() {
  return runtimeStorage.getStore() ?? null;
}

export function getCloudflareEnv() {
  return getCloudflareRuntime()?.env ?? nitroGlobalEnv() ?? {};
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
