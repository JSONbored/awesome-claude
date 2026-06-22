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
  it("returns pending subscription state from the centralized subscribe API", async () => {
    globalThis.fetch = vi.fn(async () =>
      Response.json({ ok: true, pending: true }),
    ) as typeof fetch;

    await expect(
      subscribeToNewsletter({
        email: "reader@example.com",
        segments: ["brief"],
      }),
    ).resolves.toEqual({ ok: true, pending: true });
  });

  it("defaults successful subscriptions to non-pending when the API omits the flag", async () => {
    globalThis.fetch = vi.fn(async () =>
      Response.json({ ok: true }),
    ) as typeof fetch;

    await expect(
      subscribeToNewsletter({ email: "reader@example.com" }),
    ).resolves.toEqual({ ok: true, pending: false });
  });

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

  it("falls back when subscribe returns an unreadable error body", async () => {
    globalThis.fetch = vi.fn(
      async () => new Response("not json", { status: 502 }),
    ) as typeof fetch;

    await expect(
      subscribeToNewsletter({ email: "reader@example.com" }),
    ).resolves.toEqual({
      ok: false,
      error: "Subscribe failed (502).",
    });
  });

  it("falls back when unsubscribe returns an unreadable error body", async () => {
    globalThis.fetch = vi.fn(
      async () => new Response("not json", { status: 503 }),
    ) as typeof fetch;

    await expect(
      unsubscribeFromNewsletter({ email: "reader@example.com" }),
    ).resolves.toEqual({
      ok: false,
      error: "Unsubscribe failed (503).",
    });
  });

  it("reports unsubscribe success and network failures without throwing", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ ok: true }))
      .mockRejectedValueOnce(new Error("offline"))
      .mockRejectedValueOnce(new Error("offline"));

    await expect(
      unsubscribeFromNewsletter({ email: "reader@example.com" }),
    ).resolves.toEqual({ ok: true });
    await expect(
      subscribeToNewsletter({ email: "reader@example.com" }),
    ).resolves.toEqual({
      ok: false,
      error: "Network error. Try again in a moment.",
    });
    await expect(
      unsubscribeFromNewsletter({ email: "reader@example.com" }),
    ).resolves.toEqual({
      ok: false,
      error: "Network error. Try again in a moment.",
    });
  });
});
