import { beforeEach, describe, expect, it } from "vitest";

import {
  MAX_REFERRALS_PER_WINDOW,
  __aiSignalsTestHooks,
  consumeReferralQuota,
  getClientKey,
  isPageLikeRequest,
  pruneExpiredSignalBuckets,
} from "../apps/web/src/lib/ai-signals-lib";

function pageRequest(path: string, init: RequestInit = {}) {
  return new Request(`https://heyclau.de${path}`, {
    headers: { "cf-connecting-ip": "203.0.113.7" },
    ...init,
  });
}

beforeEach(() => {
  __aiSignalsTestHooks.reset();
});

describe("ai-signals-lib isPageLikeRequest", () => {
  it("accepts a plain GET page request", () => {
    expect(isPageLikeRequest(pageRequest("/mcp/browser-bridge"))).toBe(true);
  });

  it("rejects non-GET methods", () => {
    expect(isPageLikeRequest(pageRequest("/mcp", { method: "POST" }))).toBe(
      false,
    );
  });

  it("rejects api paths", () => {
    expect(isPageLikeRequest(pageRequest("/api/registry"))).toBe(false);
    expect(isPageLikeRequest(pageRequest("/api"))).toBe(false);
  });

  it("rejects asset and download paths", () => {
    expect(isPageLikeRequest(pageRequest("/assets/app"))).toBe(false);
    expect(isPageLikeRequest(pageRequest("/downloads/demo"))).toBe(false);
  });

  it("rejects paths that look like files", () => {
    expect(isPageLikeRequest(pageRequest("/robots.txt"))).toBe(false);
  });
});

describe("ai-signals-lib getClientKey", () => {
  it("uses the cloudflare connecting ip when present", () => {
    expect(getClientKey(pageRequest("/mcp"))).toBe("203.0.113.7");
  });

  it("falls back to unknown without a connecting ip", () => {
    expect(getClientKey(new Request("https://heyclau.de/mcp"))).toBe("unknown");
  });
});

describe("ai-signals-lib consumeReferralQuota", () => {
  it("allows up to the per-window limit then rejects", () => {
    const request = pageRequest("/mcp/browser-bridge");
    for (let attempt = 0; attempt < MAX_REFERRALS_PER_WINDOW; attempt += 1) {
      expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
    }
    expect(consumeReferralQuota(request, "chatgpt")).toBe(false);
  });

  it("tracks quota separately per source, client, and path", () => {
    const request = pageRequest("/mcp/browser-bridge");
    for (let attempt = 0; attempt < MAX_REFERRALS_PER_WINDOW; attempt += 1) {
      consumeReferralQuota(request, "chatgpt");
    }
    expect(consumeReferralQuota(request, "chatgpt")).toBe(false);
    expect(consumeReferralQuota(request, "perplexity")).toBe(true);
    expect(consumeReferralQuota(pageRequest("/skills/demo"), "chatgpt")).toBe(
      true,
    );
  });

  it("allows a new window after expired buckets are pruned", () => {
    const request = pageRequest("/mcp/browser-bridge");
    for (let attempt = 0; attempt < MAX_REFERRALS_PER_WINDOW; attempt += 1) {
      consumeReferralQuota(request, "chatgpt");
    }
    expect(consumeReferralQuota(request, "chatgpt")).toBe(false);

    pruneExpiredSignalBuckets(Date.now() + 120_000);
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
});
