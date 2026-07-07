import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "../apps/web/src/routes/api/public/newsletter/unsubscribe";

const WEBHOOK_URL = "https://heyclau.de/api/public/newsletter/unsubscribe";

const globalWithEnv = globalThis as typeof globalThis & { __env__?: unknown };

function unsubscribeRequest(body: unknown) {
  return new Request(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://heyclau.de",
      "cf-connecting-ip": "203.0.113.10",
    },
    body: JSON.stringify(body),
  });
}

describe("newsletter unsubscribe route", () => {
  beforeEach(() => {
    globalWithEnv.__env__ = {
      RESEND_API_KEY: "resend-key",
      RESEND_SEGMENT_ID: "seg-general",
    };
  });

  afterEach(() => {
    delete globalWithEnv.__env__;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns provider_error when upstream calls fail with network errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Promise.reject(new Error("network down"))),
    );

    const response = await POST(
      unsubscribeRequest({ email: "user@example.com" }),
    );
    const body = (await response.json()) as { error?: { code?: string } };

    expect(response.status).toBe(502);
    expect(body.error?.code).toBe("provider_error");
  });

  it("treats 404 provider responses as a successful unsubscribe", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("not found", { status: 404 })),
    );

    const response = await POST(
      unsubscribeRequest({ email: "user@example.com" }),
    );
    const body = (await response.json()) as { ok?: boolean };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
  });
});
