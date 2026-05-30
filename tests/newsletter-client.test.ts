import { afterEach, describe, expect, it, vi } from "vitest";

import {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
} from "@/lib/api/newsletter";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("newsletter client helpers", () => {
  it("normalizes centralized subscribe API errors to displayable strings", async () => {
    globalThis.fetch = vi.fn(async () =>
      Response.json(
        {
          ok: false,
          error: { code: "rate_limited", message: "Rate limited" },
          requestId: "req_123",
        },
        { status: 429 },
      ),
    ) as typeof fetch;

    await expect(
      subscribeToNewsletter({ email: "reader@example.com", source: "test" }),
    ).resolves.toEqual({ ok: false, error: "Rate limited" });
  });

  it("preserves legacy flat newsletter error strings", async () => {
    globalThis.fetch = vi.fn(async () =>
      Response.json(
        { error: "Provider rejected the request" },
        { status: 502 },
      ),
    ) as typeof fetch;

    await expect(
      unsubscribeFromNewsletter({ email: "reader@example.com" }),
    ).resolves.toEqual({
      ok: false,
      error: "Provider rejected the request",
    });
  });

  it("falls back when a newsletter error body is not displayable", async () => {
    globalThis.fetch = vi.fn(async () =>
      Response.json(
        { ok: false, error: { code: "provider_error" } },
        { status: 502 },
      ),
    ) as typeof fetch;

    await expect(
      subscribeToNewsletter({ email: "reader@example.com" }),
    ).resolves.toEqual({
      ok: false,
      error: "Subscribe failed (502).",
    });
  });
});
