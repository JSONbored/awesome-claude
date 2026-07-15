import { beforeEach, describe, expect, it } from "vitest";

import {
  MAX_REFERRALS_PER_WINDOW,
  __aiSignalsTestHooks,
  consumeReferralQuota,
  getClientKey,
  getDataset,
  isPageLikeRequest,
  isVerifiedCloudflareBot,
  normalizePath,
  pruneExpiredSignalBuckets,
} from "../apps/web/src/lib/ai-signals-lib";

beforeEach(() => {
  __aiSignalsTestHooks.reset();
});

describe("ai-signals-lib branch edges", () => {
  it("normalizes invalid URLs to slash and truncates long paths", () => {
    expect(normalizePath("not a url")).toBe("/");
    expect(normalizePath(`https://example.com/${"a".repeat(300)}`).length).toBe(
      256,
    );
  });

  it("rejects non-GET, API, assets, downloads, and extension paths", () => {
    expect(
      isPageLikeRequest(
        new Request("https://example.com/browse", { method: "POST" }),
      ),
    ).toBe(false);
    expect(isPageLikeRequest(new Request("https://example.com/api"))).toBe(
      false,
    );
    expect(
      isPageLikeRequest(new Request("https://example.com/api/votes")),
    ).toBe(false);
    expect(
      isPageLikeRequest(new Request("https://example.com/assets/app.js")),
    ).toBe(false);
    expect(
      isPageLikeRequest(new Request("https://example.com/downloads/pkg.zip")),
    ).toBe(false);
    expect(
      isPageLikeRequest(new Request("https://example.com/favicon.ico")),
    ).toBe(false);
    expect(isPageLikeRequest(new Request("https://example.com/browse"))).toBe(
      true,
    );
  });

  it("detects verified bot management and category signals", () => {
    const plain = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(plain)).toBe(false);

    const verified = new Request("https://example.com/") as Request & {
      cf?: { botManagement?: { verifiedBot?: boolean } };
    };
    Object.defineProperty(verified, "cf", {
      value: { botManagement: { verifiedBot: true } },
    });
    expect(isVerifiedCloudflareBot(verified)).toBe(true);

    const categorized = new Request("https://example.com/") as Request & {
      cf?: { verifiedBotCategory?: string };
    };
    Object.defineProperty(categorized, "cf", {
      value: { verifiedBotCategory: "search_engine" },
    });
    expect(isVerifiedCloudflareBot(categorized)).toBe(true);
  });

  it("falls back to unknown client keys and accepts analytics datasets", () => {
    expect(getClientKey(new Request("https://example.com/"))).toBe("unknown");
    expect(getDataset(null)).toBeNull();
    expect(getDataset({ AI_SIGNALS: { writeDataPoint: "nope" } })).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => undefined } }),
    ).toBeTruthy();
  });

  it("rejects referral traffic after the window quota is exhausted", () => {
    const request = new Request("https://example.com/browse", {
      headers: { "cf-connecting-ip": "203.0.113.10" },
    });

    for (let i = 0; i < MAX_REFERRALS_PER_WINDOW; i += 1) {
      expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
    }
    expect(consumeReferralQuota(request, "chatgpt")).toBe(false);
  });

  it("prunes expired referral buckets once the window passes", () => {
    const request = new Request("https://example.com/browse", {
      headers: { "cf-connecting-ip": "203.0.113.11" },
    });
    expect(consumeReferralQuota(request, "claude")).toBe(true);
    pruneExpiredSignalBuckets(Date.now() + 120_000);
    expect(consumeReferralQuota(request, "claude")).toBe(true);
  });
});
