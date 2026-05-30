import { getCloudflareBinding } from "@/lib/cloudflare-env.server";

export type D1RunResult = {
  success?: boolean;
  meta?: {
    changes?: number;
  };
};

export type D1PreparedStatement = {
  bind: (...values: unknown[]) => {
    first: <T = Record<string, unknown>>() => Promise<T | null>;
    run: () => Promise<D1RunResult>;
    all: <T = Record<string, unknown>>() => Promise<{ results: T[] }>;
  };
};

export type D1DatabaseLike = {
  prepare: (query: string) => D1PreparedStatement;
};

export function getSiteDb(): D1DatabaseLike | null {
  return getCloudflareBinding<D1DatabaseLike>("SITE_DB") ?? null;
}
