import { afterEach, describe, expect, it } from "vitest";

import {
  getCloudflareBinding,
  getCloudflareEnv,
  runWithCloudflareRuntime,
} from "@/lib/cloudflare-env.server";

const globalWithEnv = globalThis as typeof globalThis & { __env__?: unknown };

afterEach(() => {
  delete globalWithEnv.__env__;
});

describe("Cloudflare runtime environment adapter", () => {
  it("uses Nitro's global env when the SSR service only receives a request", () => {
    const db = { prepare: () => ({}) };
    globalWithEnv.__env__ = { SITE_DB: db };

    const binding = runWithCloudflareRuntime(
      new Request("https://heyclau.de/api/votes/query"),
      undefined,
      undefined,
      () => getCloudflareBinding("SITE_DB"),
    );

    expect(binding).toBe(db);
  });

  it("uses request.runtime.cloudflare.env when Nitro attaches runtime context to the request", () => {
    const db = { prepare: () => ({}) };
    const request = new Request(
      "https://heyclau.de/api/community-signals/query",
    ) as Request & {
      runtime?: { cloudflare?: { env?: unknown; context?: unknown } };
    };
    request.runtime = {
      cloudflare: {
        env: { SITE_DB: db, CUSTOM_VALUE: "present" },
        context: { waitUntil: () => undefined },
      },
    };

    const env = runWithCloudflareRuntime(request, undefined, undefined, () =>
      getCloudflareEnv(),
    );

    expect(env.SITE_DB).toBe(db);
    expect(env.CUSTOM_VALUE).toBe("present");
  });
});
