import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  BodyTooLargeError,
  __rateLimitTestHooks,
  getClientIp,
  hasJsonContentType,
  isAllowedOrigin,
  isRateLimited,
  readRequestTextWithinLimit,
} from "../apps/web/src/lib/api-security-lib";

const request = (
  init: RequestInit & { headers?: Record<string, string> } = {},
) =>
  new Request("https://heyclau.de/api/test", {
    ...init,
    headers: init.headers,
  });

const requestWithOrigin = (origin?: string) =>
  request(origin ? { headers: { origin } } : {});

describe("getClientIp", () => {
  it("prefers the Cloudflare connecting IP header", () => {
    expect(
      getClientIp(
        request({
          headers: {
            "cf-connecting-ip": "1.2.3.4",
            "x-forwarded-for": "9.9.9.9",
          },
        }),
      ),
    ).toBe("1.2.3.4");
  });

  it("falls back to the first x-forwarded-for hop, trimmed", () => {
    expect(
      getClientIp(
        request({ headers: { "x-forwarded-for": "9.9.9.9, 10.0.0.1" } }),
      ),
    ).toBe("9.9.9.9");
    expect(
      getClientIp(request({ headers: { "x-forwarded-for": "  8.8.8.8  " } })),
    ).toBe("8.8.8.8");
  });

  it("returns 'unknown' when no client IP header is present", () => {
    expect(getClientIp(request())).toBe("unknown");
  });
});

describe("isAllowedOrigin", () => {
  it("allows requests with no Origin header", () => {
    expect(isAllowedOrigin(requestWithOrigin())).toBe(true);
  });

  it("allows production, dev, preview, and local origins", () => {
    expect(isAllowedOrigin(requestWithOrigin("https://heyclau.de"))).toBe(true);
    expect(isAllowedOrigin(requestWithOrigin("https://dev.heyclau.de"))).toBe(
      true,
    );
    expect(
      isAllowedOrigin(requestWithOrigin("https://pr-123.zeronode.workers.dev")),
    ).toBe(true);
    expect(isAllowedOrigin(requestWithOrigin("http://localhost:3000"))).toBe(
      true,
    );
    expect(isAllowedOrigin(requestWithOrigin("http://127.0.0.1:8788"))).toBe(
      true,
    );
  });

  it("rejects unrelated and downgrade origins", () => {
    expect(isAllowedOrigin(requestWithOrigin("https://evil.com"))).toBe(false);
    expect(isAllowedOrigin(requestWithOrigin("http://heyclau.de"))).toBe(false);
    expect(
      isAllowedOrigin(requestWithOrigin("https://heyclau.de.evil.com")),
    ).toBe(false);
  });

  it("rejects preview hosts with invalid subdomain characters", () => {
    expect(
      isAllowedOrigin(requestWithOrigin("https://pr_123.zeronode.workers.dev")),
    ).toBe(false);
    expect(
      isAllowedOrigin(
        requestWithOrigin("https://pr..123.zeronode.workers.dev"),
      ),
    ).toBe(false);
  });

  it("allows uppercase letters in preview worker hostnames", () => {
    expect(
      isAllowedOrigin(requestWithOrigin("https://PR-123.zeronode.workers.dev")),
    ).toBe(true);
  });

  it("accepts localhost and loopback on arbitrary ports", () => {
    for (const origin of [
      "http://localhost:1",
      "http://localhost:65535",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:8788",
    ]) {
      expect(isAllowedOrigin(requestWithOrigin(origin)), origin).toBe(true);
    }
  });

  it("rejects origins that only partially match allow-list patterns", () => {
    for (const origin of [
      "https://heyclau.de.attacker.example",
      "https://sub.heyclau.de",
      "https://evil.zeronode.workers.dev.evil.com",
      "http://localhost",
      "http://127.0.0.1",
      "https://heyclau.de:4443",
    ]) {
      expect(isAllowedOrigin(requestWithOrigin(origin)), origin).toBe(false);
    }
  });
});

describe("hasJsonContentType", () => {
  it("accepts application/json with parameters case-insensitively", () => {
    expect(
      hasJsonContentType(
        request({
          headers: { "content-type": "application/json; charset=utf-8" },
        }),
      ),
    ).toBe(true);
    expect(
      hasJsonContentType(
        request({ headers: { "content-type": "APPLICATION/JSON" } }),
      ),
    ).toBe(true);
  });

  it("rejects non-JSON and missing content types", () => {
    expect(
      hasJsonContentType(
        request({ headers: { "content-type": "text/plain" } }),
      ),
    ).toBe(false);
    expect(hasJsonContentType(request())).toBe(false);
  });
});

describe("BodyTooLargeError", () => {
  it("exposes a stable error name and message", () => {
    const err = new BodyTooLargeError();
    expect(err.name).toBe("BodyTooLargeError");
    expect(err.message).toBe("Request body exceeded configured byte limit");
    expect(err).toBeInstanceOf(Error);
  });
});

describe("readRequestTextWithinLimit", () => {
  it("returns an empty string when the request has no body", async () => {
    await expect(readRequestTextWithinLimit(request(), 1024)).resolves.toBe("");
  });

  it("reads a small body within the configured limit", async () => {
    const body = JSON.stringify({ ok: true });
    const req = request({
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });
    await expect(readRequestTextWithinLimit(req, 1024)).resolves.toBe(body);
  });

  it("rejects bodies whose declared content-length exceeds the limit", async () => {
    const req = request({
      method: "POST",
      headers: { "content-length": "2048" },
      body: "x".repeat(100),
    });
    await expect(readRequestTextWithinLimit(req, 1024)).rejects.toBeInstanceOf(
      BodyTooLargeError,
    );
  });

  it("allows bodies when content-length is within the limit", async () => {
    const body = "hello";
    const req = request({
      method: "POST",
      headers: { "content-length": String(body.length) },
      body,
    });
    await expect(readRequestTextWithinLimit(req, 1024)).resolves.toBe(body);
  });

  it("rejects upfront when content-length is non-finite", async () => {
    const body = "tiny";
    const req = request({
      method: "POST",
      headers: { "content-length": "not-a-number" },
      body,
    });
    await expect(readRequestTextWithinLimit(req, 1024)).rejects.toBeInstanceOf(
      BodyTooLargeError,
    );
  });

  it("rejects upfront when content-length is negative", async () => {
    const body = "tiny";
    const req = request({
      method: "POST",
      headers: { "content-length": "-1" },
      body,
    });
    await expect(readRequestTextWithinLimit(req, 1024)).rejects.toBeInstanceOf(
      BodyTooLargeError,
    );
  });

  it("rejects streamed bodies that exceed the limit without content-length", async () => {
    const req = request({
      method: "POST",
      body: "x".repeat(2048),
    });
    await expect(readRequestTextWithinLimit(req, 1024)).rejects.toBeInstanceOf(
      BodyTooLargeError,
    );
  });

  it("reassembles multi-chunk bodies within the limit", async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode('{"part":'));
        controller.enqueue(encoder.encode('"two"}'));
        controller.close();
      },
    });
    const req = new Request("https://heyclau.de/api/test", {
      method: "POST",
      body: stream,
      duplex: "half",
    } as RequestInit);
    await expect(readRequestTextWithinLimit(req, 1024)).resolves.toBe(
      '{"part":"two"}',
    );
  });

  it("rejects when a later chunk pushes the stream past the limit", async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode("a".repeat(512)));
        controller.enqueue(encoder.encode("b".repeat(600)));
        controller.close();
      },
    });
    const req = new Request("https://heyclau.de/api/test", {
      method: "POST",
      body: stream,
      duplex: "half",
    } as RequestInit);
    await expect(readRequestTextWithinLimit(req, 1024)).rejects.toBeInstanceOf(
      BodyTooLargeError,
    );
  });

  it("accepts a body whose declared length exactly matches the limit", async () => {
    const body = "x".repeat(512);
    const req = request({
      method: "POST",
      headers: { "content-length": String(body.length) },
      body,
    });
    await expect(readRequestTextWithinLimit(req, 512)).resolves.toBe(body);
  });

  it("rejects when declared length is one byte over the limit", async () => {
    const req = request({
      method: "POST",
      headers: { "content-length": "513" },
      body: "x".repeat(513),
    });
    await expect(readRequestTextWithinLimit(req, 512)).rejects.toBeInstanceOf(
      BodyTooLargeError,
    );
  });

  it("decodes utf-8 bodies within the limit", async () => {
    const body = "café — 日本語";
    const req = request({
      method: "POST",
      headers: {
        "content-length": String(new TextEncoder().encode(body).length),
      },
      body,
    });
    await expect(readRequestTextWithinLimit(req, 1024)).resolves.toBe(body);
  });

  it("returns an empty string for an explicit zero content-length", async () => {
    const req = request({
      method: "POST",
      headers: { "content-length": "0" },
    });
    await expect(readRequestTextWithinLimit(req, 1024)).resolves.toBe("");
  });

  it("treats Infinity content-length as oversize for any finite limit", async () => {
    const req = request({
      method: "POST",
      headers: { "content-length": "Infinity" },
      body: "small",
    });
    await expect(readRequestTextWithinLimit(req, 1024)).rejects.toBeInstanceOf(
      BodyTooLargeError,
    );
  });
});

describe("isRateLimited fallback limiter", () => {
  function fallbackRequest(ip: string, scope = "registry-search") {
    return request({
      headers: {
        origin: "https://heyclau.de",
        "cf-connecting-ip": ip,
      },
    });
  }

  beforeEach(() => {
    vi.useRealTimers();
    __rateLimitTestHooks.reset();
  });

  afterEach(() => {
    vi.useRealTimers();
    __rateLimitTestHooks.reset();
  });

  it("blocks after the configured limit within the window", () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const check = () =>
      isRateLimited({
        request: fallbackRequest("203.0.113.10"),
        scope: "test",
        limit: 2,
        windowMs: 60_000,
      });

    expect(check()).toBe(false);
    expect(check()).toBe(false);
    expect(check()).toBe(true);
  });

  it("allows requests again after the window resets", () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const check = () =>
      isRateLimited({
        request: fallbackRequest("203.0.113.11"),
        scope: "test",
        limit: 1,
        windowMs: 60_000,
      });

    expect(check()).toBe(false);
    expect(check()).toBe(true);
    vi.setSystemTime(60_001);
    expect(check()).toBe(false);
  });

  it("isolates buckets by scope and client IP", () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const params = {
      scope: "test",
      limit: 1,
      windowMs: 60_000,
    };

    expect(
      isRateLimited({ ...params, request: fallbackRequest("10.0.0.1") }),
    ).toBe(false);
    expect(
      isRateLimited({ ...params, request: fallbackRequest("10.0.0.1") }),
    ).toBe(true);
    expect(
      isRateLimited({ ...params, request: fallbackRequest("10.0.0.2") }),
    ).toBe(false);
    expect(
      isRateLimited({
        ...params,
        scope: "other",
        request: fallbackRequest("10.0.0.1"),
      }),
    ).toBe(false);
  });

  it("increments the bucket count until the limit is reached", () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const params = {
      request: fallbackRequest("198.51.100.50"),
      scope: "increment",
      limit: 4,
      windowMs: 30_000,
    };

    expect(isRateLimited(params)).toBe(false);
    expect(isRateLimited(params)).toBe(false);
    expect(isRateLimited(params)).toBe(false);
    expect(isRateLimited(params)).toBe(false);
    expect(isRateLimited(params)).toBe(true);
    expect(isRateLimited(params)).toBe(true);
  });

  it("prunes expired buckets when new keys arrive", () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);

    for (let i = 0; i < 5; i += 1) {
      isRateLimited({
        request: fallbackRequest(`198.51.100.${i}`),
        scope: "test",
        limit: 5,
        windowMs: 1_000,
      });
    }
    expect(__rateLimitTestHooks.size()).toBe(5);

    vi.setSystemTime(2_000);
    isRateLimited({
      request: fallbackRequest("198.51.100.200"),
      scope: "test",
      limit: 5,
      windowMs: 1_000,
    });
    expect(__rateLimitTestHooks.size()).toBe(1);
  });

  it("caps live bucket growth by evicting the oldest keys", () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const cap = __rateLimitTestHooks.maxBuckets;

    for (let i = 0; i < cap + 50; i += 1) {
      isRateLimited({
        request: fallbackRequest(`10.0.${Math.floor(i / 256)}.${i % 256}`),
        scope: "test",
        limit: 5,
        windowMs: 60 * 60 * 1000,
      });
    }

    expect(__rateLimitTestHooks.size()).toBeLessThanOrEqual(cap);
  });

  it("uses the unknown IP sentinel when headers are missing", () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const bare = request();
    const params = {
      request: bare,
      scope: "anon",
      limit: 1,
      windowMs: 60_000,
    };

    expect(isRateLimited(params)).toBe(false);
    expect(isRateLimited(params)).toBe(true);
  });

  it("refreshes an expired bucket without blocking the first request", () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const params = {
      request: fallbackRequest("203.0.113.99"),
      scope: "refresh",
      limit: 1,
      windowMs: 5_000,
    };

    expect(isRateLimited(params)).toBe(false);
    expect(isRateLimited(params)).toBe(true);
    vi.setSystemTime(5_001);
    expect(isRateLimited(params)).toBe(false);
    expect(isRateLimited(params)).toBe(true);
  });

  it("exposes test hooks for reset, size, and max bucket cap", () => {
    expect(__rateLimitTestHooks.maxBuckets).toBe(10_000);
    expect(__rateLimitTestHooks.size()).toBe(0);
    isRateLimited({
      request: fallbackRequest("1.2.3.4"),
      scope: "hooks",
      limit: 10,
      windowMs: 60_000,
    });
    expect(__rateLimitTestHooks.size()).toBe(1);
    __rateLimitTestHooks.reset();
    expect(__rateLimitTestHooks.size()).toBe(0);
  });

  it("keeps separate windows per scope for the same client IP", () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const ip = "203.0.113.42";
    const windowMs = 10_000;

    expect(
      isRateLimited({
        request: fallbackRequest(ip),
        scope: "scope-a",
        limit: 1,
        windowMs,
      }),
    ).toBe(false);
    expect(
      isRateLimited({
        request: fallbackRequest(ip),
        scope: "scope-a",
        limit: 1,
        windowMs,
      }),
    ).toBe(true);
    expect(
      isRateLimited({
        request: fallbackRequest(ip),
        scope: "scope-b",
        limit: 1,
        windowMs,
      }),
    ).toBe(false);
  });

  it("does not prune active buckets when touching an existing key", () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const params = {
      request: fallbackRequest("198.51.100.77"),
      scope: "active",
      limit: 3,
      windowMs: 60_000,
    };

    isRateLimited(params);
    isRateLimited({
      request: fallbackRequest("198.51.100.78"),
      scope: "active",
      limit: 3,
      windowMs: 60_000,
    });
    expect(__rateLimitTestHooks.size()).toBe(2);

    isRateLimited(params);
    expect(__rateLimitTestHooks.size()).toBe(2);
  });
});
