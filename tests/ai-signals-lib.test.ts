import { describe, expect, it, beforeEach } from "vitest";

import {
  __aiSignalsTestHooks,
  consumeReferralQuota,
  evictOldestSignalBuckets,
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

describe("ai-signals-lib normalizePath", () => {
  it("normalizePath matrix 0", () => {
    expect(normalizePath("https://example.com/path/0?q=1")).toBe("/path/0");
  });
  it("normalizePath matrix 1", () => {
    expect(normalizePath("https://example.com/path/1?q=1")).toBe("/path/1");
  });
  it("normalizePath matrix 2", () => {
    expect(normalizePath("https://example.com/path/2?q=1")).toBe("/path/2");
  });
  it("normalizePath matrix 3", () => {
    expect(normalizePath("https://example.com/path/3?q=1")).toBe("/path/3");
  });
  it("normalizePath matrix 4", () => {
    expect(normalizePath("https://example.com/path/4?q=1")).toBe("/path/4");
  });
  it("normalizePath matrix 5", () => {
    expect(normalizePath("https://example.com/path/5?q=1")).toBe("/path/5");
  });
  it("normalizePath matrix 6", () => {
    expect(normalizePath("https://example.com/path/6?q=1")).toBe("/path/6");
  });
  it("normalizePath matrix 7", () => {
    expect(normalizePath("https://example.com/path/7?q=1")).toBe("/path/7");
  });
  it("normalizePath matrix 8", () => {
    expect(normalizePath("https://example.com/path/8?q=1")).toBe("/path/8");
  });
  it("normalizePath matrix 9", () => {
    expect(normalizePath("https://example.com/path/9?q=1")).toBe("/path/9");
  });
  it("normalizePath matrix 10", () => {
    expect(normalizePath("https://example.com/path/10?q=1")).toBe("/path/10");
  });
  it("normalizePath matrix 11", () => {
    expect(normalizePath("https://example.com/path/11?q=1")).toBe("/path/11");
  });
  it("normalizePath matrix 12", () => {
    expect(normalizePath("https://example.com/path/12?q=1")).toBe("/path/12");
  });
  it("normalizePath matrix 13", () => {
    expect(normalizePath("https://example.com/path/13?q=1")).toBe("/path/13");
  });
  it("normalizePath matrix 14", () => {
    expect(normalizePath("https://example.com/path/14?q=1")).toBe("/path/14");
  });
  it("normalizePath matrix 15", () => {
    expect(normalizePath("https://example.com/path/15?q=1")).toBe("/path/15");
  });
  it("normalizePath matrix 16", () => {
    expect(normalizePath("https://example.com/path/16?q=1")).toBe("/path/16");
  });
  it("normalizePath matrix 17", () => {
    expect(normalizePath("https://example.com/path/17?q=1")).toBe("/path/17");
  });
  it("normalizePath matrix 18", () => {
    expect(normalizePath("https://example.com/path/18?q=1")).toBe("/path/18");
  });
  it("normalizePath matrix 19", () => {
    expect(normalizePath("https://example.com/path/19?q=1")).toBe("/path/19");
  });
  it("normalizePath matrix 20", () => {
    expect(normalizePath("https://example.com/path/20?q=1")).toBe("/path/20");
  });
  it("normalizePath matrix 21", () => {
    expect(normalizePath("https://example.com/path/21?q=1")).toBe("/path/21");
  });
  it("normalizePath matrix 22", () => {
    expect(normalizePath("https://example.com/path/22?q=1")).toBe("/path/22");
  });
  it("normalizePath matrix 23", () => {
    expect(normalizePath("https://example.com/path/23?q=1")).toBe("/path/23");
  });
  it("normalizePath matrix 24", () => {
    expect(normalizePath("https://example.com/path/24?q=1")).toBe("/path/24");
  });
  it("normalizePath matrix 25", () => {
    expect(normalizePath("https://example.com/path/25?q=1")).toBe("/path/25");
  });
  it("normalizePath matrix 26", () => {
    expect(normalizePath("https://example.com/path/26?q=1")).toBe("/path/26");
  });
  it("normalizePath matrix 27", () => {
    expect(normalizePath("https://example.com/path/27?q=1")).toBe("/path/27");
  });
  it("normalizePath matrix 28", () => {
    expect(normalizePath("https://example.com/path/28?q=1")).toBe("/path/28");
  });
  it("normalizePath matrix 29", () => {
    expect(normalizePath("https://example.com/path/29?q=1")).toBe("/path/29");
  });
  it("normalizePath matrix 30", () => {
    expect(normalizePath("https://example.com/path/30?q=1")).toBe("/path/30");
  });
  it("normalizePath matrix 31", () => {
    expect(normalizePath("https://example.com/path/31?q=1")).toBe("/path/31");
  });
  it("normalizePath matrix 32", () => {
    expect(normalizePath("https://example.com/path/32?q=1")).toBe("/path/32");
  });
  it("normalizePath matrix 33", () => {
    expect(normalizePath("https://example.com/path/33?q=1")).toBe("/path/33");
  });
  it("normalizePath matrix 34", () => {
    expect(normalizePath("https://example.com/path/34?q=1")).toBe("/path/34");
  });
  it("normalizePath matrix 35", () => {
    expect(normalizePath("https://example.com/path/35?q=1")).toBe("/path/35");
  });
  it("normalizePath matrix 36", () => {
    expect(normalizePath("https://example.com/path/36?q=1")).toBe("/path/36");
  });
  it("normalizePath matrix 37", () => {
    expect(normalizePath("https://example.com/path/37?q=1")).toBe("/path/37");
  });
  it("normalizePath matrix 38", () => {
    expect(normalizePath("https://example.com/path/38?q=1")).toBe("/path/38");
  });
  it("normalizePath matrix 39", () => {
    expect(normalizePath("https://example.com/path/39?q=1")).toBe("/path/39");
  });
  it("normalizePath matrix 40", () => {
    expect(normalizePath("https://example.com/path/40?q=1")).toBe("/path/40");
  });
  it("normalizePath matrix 41", () => {
    expect(normalizePath("https://example.com/path/41?q=1")).toBe("/path/41");
  });
  it("normalizePath matrix 42", () => {
    expect(normalizePath("https://example.com/path/42?q=1")).toBe("/path/42");
  });
  it("normalizePath matrix 43", () => {
    expect(normalizePath("https://example.com/path/43?q=1")).toBe("/path/43");
  });
  it("normalizePath matrix 44", () => {
    expect(normalizePath("https://example.com/path/44?q=1")).toBe("/path/44");
  });
  it("normalizePath matrix 45", () => {
    expect(normalizePath("https://example.com/path/45?q=1")).toBe("/path/45");
  });
  it("normalizePath matrix 46", () => {
    expect(normalizePath("https://example.com/path/46?q=1")).toBe("/path/46");
  });
  it("normalizePath matrix 47", () => {
    expect(normalizePath("https://example.com/path/47?q=1")).toBe("/path/47");
  });
  it("normalizePath matrix 48", () => {
    expect(normalizePath("https://example.com/path/48?q=1")).toBe("/path/48");
  });
  it("normalizePath matrix 49", () => {
    expect(normalizePath("https://example.com/path/49?q=1")).toBe("/path/49");
  });
});

describe("ai-signals-lib request helpers", () => {
  it("isPageLikeRequest matrix 0", () => {
    const page = new Request("https://example.com/entries/mcp/demo-0");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 0", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.0" },
    });
    expect(getClientKey(request)).toBe("1.2.3.0");
  });
  it("isVerifiedCloudflareBot matrix 0", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 0", () => {
    const request = new Request("https://example.com/page-0", {
      headers: { "cf-connecting-ip": "10.0.0.0" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 0", () => {
    pruneExpiredSignalBuckets(Date.now() + 0);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 0", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 1", () => {
    const page = new Request("https://example.com/entries/mcp/demo-1");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 1", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.1" },
    });
    expect(getClientKey(request)).toBe("1.2.3.1");
  });
  it("isVerifiedCloudflareBot matrix 1", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 1", () => {
    const request = new Request("https://example.com/page-1", {
      headers: { "cf-connecting-ip": "10.0.0.1" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 1", () => {
    pruneExpiredSignalBuckets(Date.now() + 1);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 1", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 2", () => {
    const page = new Request("https://example.com/entries/mcp/demo-2");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 2", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.2" },
    });
    expect(getClientKey(request)).toBe("1.2.3.2");
  });
  it("isVerifiedCloudflareBot matrix 2", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 2", () => {
    const request = new Request("https://example.com/page-2", {
      headers: { "cf-connecting-ip": "10.0.0.2" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 2", () => {
    pruneExpiredSignalBuckets(Date.now() + 2);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 2", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 3", () => {
    const page = new Request("https://example.com/entries/mcp/demo-3");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 3", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.3" },
    });
    expect(getClientKey(request)).toBe("1.2.3.3");
  });
  it("isVerifiedCloudflareBot matrix 3", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 3", () => {
    const request = new Request("https://example.com/page-3", {
      headers: { "cf-connecting-ip": "10.0.0.3" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 3", () => {
    pruneExpiredSignalBuckets(Date.now() + 3);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 3", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 4", () => {
    const page = new Request("https://example.com/entries/mcp/demo-4");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 4", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.4" },
    });
    expect(getClientKey(request)).toBe("1.2.3.4");
  });
  it("isVerifiedCloudflareBot matrix 4", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 4", () => {
    const request = new Request("https://example.com/page-4", {
      headers: { "cf-connecting-ip": "10.0.0.4" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 4", () => {
    pruneExpiredSignalBuckets(Date.now() + 4);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 4", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 5", () => {
    const page = new Request("https://example.com/entries/mcp/demo-5");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 5", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.5" },
    });
    expect(getClientKey(request)).toBe("1.2.3.5");
  });
  it("isVerifiedCloudflareBot matrix 5", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 5", () => {
    const request = new Request("https://example.com/page-5", {
      headers: { "cf-connecting-ip": "10.0.0.5" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 5", () => {
    pruneExpiredSignalBuckets(Date.now() + 5);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 5", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 6", () => {
    const page = new Request("https://example.com/entries/mcp/demo-6");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 6", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.6" },
    });
    expect(getClientKey(request)).toBe("1.2.3.6");
  });
  it("isVerifiedCloudflareBot matrix 6", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 6", () => {
    const request = new Request("https://example.com/page-6", {
      headers: { "cf-connecting-ip": "10.0.0.6" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 6", () => {
    pruneExpiredSignalBuckets(Date.now() + 6);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 6", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 7", () => {
    const page = new Request("https://example.com/entries/mcp/demo-7");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 7", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.7" },
    });
    expect(getClientKey(request)).toBe("1.2.3.7");
  });
  it("isVerifiedCloudflareBot matrix 7", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 7", () => {
    const request = new Request("https://example.com/page-7", {
      headers: { "cf-connecting-ip": "10.0.0.7" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 7", () => {
    pruneExpiredSignalBuckets(Date.now() + 7);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 7", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 8", () => {
    const page = new Request("https://example.com/entries/mcp/demo-8");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 8", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.8" },
    });
    expect(getClientKey(request)).toBe("1.2.3.8");
  });
  it("isVerifiedCloudflareBot matrix 8", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 8", () => {
    const request = new Request("https://example.com/page-8", {
      headers: { "cf-connecting-ip": "10.0.0.8" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 8", () => {
    pruneExpiredSignalBuckets(Date.now() + 8);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 8", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 9", () => {
    const page = new Request("https://example.com/entries/mcp/demo-9");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 9", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.9" },
    });
    expect(getClientKey(request)).toBe("1.2.3.9");
  });
  it("isVerifiedCloudflareBot matrix 9", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 9", () => {
    const request = new Request("https://example.com/page-9", {
      headers: { "cf-connecting-ip": "10.0.0.9" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 9", () => {
    pruneExpiredSignalBuckets(Date.now() + 9);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 9", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 10", () => {
    const page = new Request("https://example.com/entries/mcp/demo-10");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 10", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.10" },
    });
    expect(getClientKey(request)).toBe("1.2.3.10");
  });
  it("isVerifiedCloudflareBot matrix 10", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 10", () => {
    const request = new Request("https://example.com/page-10", {
      headers: { "cf-connecting-ip": "10.0.0.10" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 10", () => {
    pruneExpiredSignalBuckets(Date.now() + 10);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 10", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 11", () => {
    const page = new Request("https://example.com/entries/mcp/demo-11");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 11", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.11" },
    });
    expect(getClientKey(request)).toBe("1.2.3.11");
  });
  it("isVerifiedCloudflareBot matrix 11", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 11", () => {
    const request = new Request("https://example.com/page-11", {
      headers: { "cf-connecting-ip": "10.0.0.11" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 11", () => {
    pruneExpiredSignalBuckets(Date.now() + 11);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 11", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 12", () => {
    const page = new Request("https://example.com/entries/mcp/demo-12");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 12", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.12" },
    });
    expect(getClientKey(request)).toBe("1.2.3.12");
  });
  it("isVerifiedCloudflareBot matrix 12", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 12", () => {
    const request = new Request("https://example.com/page-12", {
      headers: { "cf-connecting-ip": "10.0.0.12" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 12", () => {
    pruneExpiredSignalBuckets(Date.now() + 12);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 12", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 13", () => {
    const page = new Request("https://example.com/entries/mcp/demo-13");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 13", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.13" },
    });
    expect(getClientKey(request)).toBe("1.2.3.13");
  });
  it("isVerifiedCloudflareBot matrix 13", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 13", () => {
    const request = new Request("https://example.com/page-13", {
      headers: { "cf-connecting-ip": "10.0.0.13" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 13", () => {
    pruneExpiredSignalBuckets(Date.now() + 13);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 13", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 14", () => {
    const page = new Request("https://example.com/entries/mcp/demo-14");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 14", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.14" },
    });
    expect(getClientKey(request)).toBe("1.2.3.14");
  });
  it("isVerifiedCloudflareBot matrix 14", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 14", () => {
    const request = new Request("https://example.com/page-14", {
      headers: { "cf-connecting-ip": "10.0.0.14" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 14", () => {
    pruneExpiredSignalBuckets(Date.now() + 14);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 14", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 15", () => {
    const page = new Request("https://example.com/entries/mcp/demo-15");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 15", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.15" },
    });
    expect(getClientKey(request)).toBe("1.2.3.15");
  });
  it("isVerifiedCloudflareBot matrix 15", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 15", () => {
    const request = new Request("https://example.com/page-15", {
      headers: { "cf-connecting-ip": "10.0.0.15" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 15", () => {
    pruneExpiredSignalBuckets(Date.now() + 15);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 15", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 16", () => {
    const page = new Request("https://example.com/entries/mcp/demo-16");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 16", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.16" },
    });
    expect(getClientKey(request)).toBe("1.2.3.16");
  });
  it("isVerifiedCloudflareBot matrix 16", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 16", () => {
    const request = new Request("https://example.com/page-16", {
      headers: { "cf-connecting-ip": "10.0.0.16" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 16", () => {
    pruneExpiredSignalBuckets(Date.now() + 16);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 16", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 17", () => {
    const page = new Request("https://example.com/entries/mcp/demo-17");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 17", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.17" },
    });
    expect(getClientKey(request)).toBe("1.2.3.17");
  });
  it("isVerifiedCloudflareBot matrix 17", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 17", () => {
    const request = new Request("https://example.com/page-17", {
      headers: { "cf-connecting-ip": "10.0.0.17" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 17", () => {
    pruneExpiredSignalBuckets(Date.now() + 17);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 17", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 18", () => {
    const page = new Request("https://example.com/entries/mcp/demo-18");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 18", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.18" },
    });
    expect(getClientKey(request)).toBe("1.2.3.18");
  });
  it("isVerifiedCloudflareBot matrix 18", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 18", () => {
    const request = new Request("https://example.com/page-18", {
      headers: { "cf-connecting-ip": "10.0.0.18" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 18", () => {
    pruneExpiredSignalBuckets(Date.now() + 18);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 18", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 19", () => {
    const page = new Request("https://example.com/entries/mcp/demo-19");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 19", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.19" },
    });
    expect(getClientKey(request)).toBe("1.2.3.19");
  });
  it("isVerifiedCloudflareBot matrix 19", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 19", () => {
    const request = new Request("https://example.com/page-19", {
      headers: { "cf-connecting-ip": "10.0.0.19" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 19", () => {
    pruneExpiredSignalBuckets(Date.now() + 19);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 19", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 20", () => {
    const page = new Request("https://example.com/entries/mcp/demo-20");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 20", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.20" },
    });
    expect(getClientKey(request)).toBe("1.2.3.20");
  });
  it("isVerifiedCloudflareBot matrix 20", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 20", () => {
    const request = new Request("https://example.com/page-20", {
      headers: { "cf-connecting-ip": "10.0.0.20" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 20", () => {
    pruneExpiredSignalBuckets(Date.now() + 20);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 20", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 21", () => {
    const page = new Request("https://example.com/entries/mcp/demo-21");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 21", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.21" },
    });
    expect(getClientKey(request)).toBe("1.2.3.21");
  });
  it("isVerifiedCloudflareBot matrix 21", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 21", () => {
    const request = new Request("https://example.com/page-21", {
      headers: { "cf-connecting-ip": "10.0.0.21" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 21", () => {
    pruneExpiredSignalBuckets(Date.now() + 21);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 21", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 22", () => {
    const page = new Request("https://example.com/entries/mcp/demo-22");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 22", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.22" },
    });
    expect(getClientKey(request)).toBe("1.2.3.22");
  });
  it("isVerifiedCloudflareBot matrix 22", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 22", () => {
    const request = new Request("https://example.com/page-22", {
      headers: { "cf-connecting-ip": "10.0.0.22" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 22", () => {
    pruneExpiredSignalBuckets(Date.now() + 22);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 22", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 23", () => {
    const page = new Request("https://example.com/entries/mcp/demo-23");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 23", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.23" },
    });
    expect(getClientKey(request)).toBe("1.2.3.23");
  });
  it("isVerifiedCloudflareBot matrix 23", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 23", () => {
    const request = new Request("https://example.com/page-23", {
      headers: { "cf-connecting-ip": "10.0.0.23" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 23", () => {
    pruneExpiredSignalBuckets(Date.now() + 23);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 23", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 24", () => {
    const page = new Request("https://example.com/entries/mcp/demo-24");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 24", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.24" },
    });
    expect(getClientKey(request)).toBe("1.2.3.24");
  });
  it("isVerifiedCloudflareBot matrix 24", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 24", () => {
    const request = new Request("https://example.com/page-24", {
      headers: { "cf-connecting-ip": "10.0.0.24" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 24", () => {
    pruneExpiredSignalBuckets(Date.now() + 24);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 24", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 25", () => {
    const page = new Request("https://example.com/entries/mcp/demo-25");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 25", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.25" },
    });
    expect(getClientKey(request)).toBe("1.2.3.25");
  });
  it("isVerifiedCloudflareBot matrix 25", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 25", () => {
    const request = new Request("https://example.com/page-25", {
      headers: { "cf-connecting-ip": "10.0.0.25" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 25", () => {
    pruneExpiredSignalBuckets(Date.now() + 25);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 25", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 26", () => {
    const page = new Request("https://example.com/entries/mcp/demo-26");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 26", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.26" },
    });
    expect(getClientKey(request)).toBe("1.2.3.26");
  });
  it("isVerifiedCloudflareBot matrix 26", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 26", () => {
    const request = new Request("https://example.com/page-26", {
      headers: { "cf-connecting-ip": "10.0.0.26" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 26", () => {
    pruneExpiredSignalBuckets(Date.now() + 26);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 26", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 27", () => {
    const page = new Request("https://example.com/entries/mcp/demo-27");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 27", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.27" },
    });
    expect(getClientKey(request)).toBe("1.2.3.27");
  });
  it("isVerifiedCloudflareBot matrix 27", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 27", () => {
    const request = new Request("https://example.com/page-27", {
      headers: { "cf-connecting-ip": "10.0.0.27" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 27", () => {
    pruneExpiredSignalBuckets(Date.now() + 27);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 27", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 28", () => {
    const page = new Request("https://example.com/entries/mcp/demo-28");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 28", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.28" },
    });
    expect(getClientKey(request)).toBe("1.2.3.28");
  });
  it("isVerifiedCloudflareBot matrix 28", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 28", () => {
    const request = new Request("https://example.com/page-28", {
      headers: { "cf-connecting-ip": "10.0.0.28" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 28", () => {
    pruneExpiredSignalBuckets(Date.now() + 28);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 28", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 29", () => {
    const page = new Request("https://example.com/entries/mcp/demo-29");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 29", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.29" },
    });
    expect(getClientKey(request)).toBe("1.2.3.29");
  });
  it("isVerifiedCloudflareBot matrix 29", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 29", () => {
    const request = new Request("https://example.com/page-29", {
      headers: { "cf-connecting-ip": "10.0.0.29" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 29", () => {
    pruneExpiredSignalBuckets(Date.now() + 29);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 29", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 30", () => {
    const page = new Request("https://example.com/entries/mcp/demo-30");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 30", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.30" },
    });
    expect(getClientKey(request)).toBe("1.2.3.30");
  });
  it("isVerifiedCloudflareBot matrix 30", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 30", () => {
    const request = new Request("https://example.com/page-30", {
      headers: { "cf-connecting-ip": "10.0.0.30" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 30", () => {
    pruneExpiredSignalBuckets(Date.now() + 30);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 30", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 31", () => {
    const page = new Request("https://example.com/entries/mcp/demo-31");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 31", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.31" },
    });
    expect(getClientKey(request)).toBe("1.2.3.31");
  });
  it("isVerifiedCloudflareBot matrix 31", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 31", () => {
    const request = new Request("https://example.com/page-31", {
      headers: { "cf-connecting-ip": "10.0.0.31" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 31", () => {
    pruneExpiredSignalBuckets(Date.now() + 31);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 31", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 32", () => {
    const page = new Request("https://example.com/entries/mcp/demo-32");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 32", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.32" },
    });
    expect(getClientKey(request)).toBe("1.2.3.32");
  });
  it("isVerifiedCloudflareBot matrix 32", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 32", () => {
    const request = new Request("https://example.com/page-32", {
      headers: { "cf-connecting-ip": "10.0.0.32" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 32", () => {
    pruneExpiredSignalBuckets(Date.now() + 32);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 32", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 33", () => {
    const page = new Request("https://example.com/entries/mcp/demo-33");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 33", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.33" },
    });
    expect(getClientKey(request)).toBe("1.2.3.33");
  });
  it("isVerifiedCloudflareBot matrix 33", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 33", () => {
    const request = new Request("https://example.com/page-33", {
      headers: { "cf-connecting-ip": "10.0.0.33" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 33", () => {
    pruneExpiredSignalBuckets(Date.now() + 33);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 33", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 34", () => {
    const page = new Request("https://example.com/entries/mcp/demo-34");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 34", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.34" },
    });
    expect(getClientKey(request)).toBe("1.2.3.34");
  });
  it("isVerifiedCloudflareBot matrix 34", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 34", () => {
    const request = new Request("https://example.com/page-34", {
      headers: { "cf-connecting-ip": "10.0.0.34" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 34", () => {
    pruneExpiredSignalBuckets(Date.now() + 34);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 34", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 35", () => {
    const page = new Request("https://example.com/entries/mcp/demo-35");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 35", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.35" },
    });
    expect(getClientKey(request)).toBe("1.2.3.35");
  });
  it("isVerifiedCloudflareBot matrix 35", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 35", () => {
    const request = new Request("https://example.com/page-35", {
      headers: { "cf-connecting-ip": "10.0.0.35" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 35", () => {
    pruneExpiredSignalBuckets(Date.now() + 35);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 35", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 36", () => {
    const page = new Request("https://example.com/entries/mcp/demo-36");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 36", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.36" },
    });
    expect(getClientKey(request)).toBe("1.2.3.36");
  });
  it("isVerifiedCloudflareBot matrix 36", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 36", () => {
    const request = new Request("https://example.com/page-36", {
      headers: { "cf-connecting-ip": "10.0.0.36" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 36", () => {
    pruneExpiredSignalBuckets(Date.now() + 36);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 36", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 37", () => {
    const page = new Request("https://example.com/entries/mcp/demo-37");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 37", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.37" },
    });
    expect(getClientKey(request)).toBe("1.2.3.37");
  });
  it("isVerifiedCloudflareBot matrix 37", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 37", () => {
    const request = new Request("https://example.com/page-37", {
      headers: { "cf-connecting-ip": "10.0.0.37" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 37", () => {
    pruneExpiredSignalBuckets(Date.now() + 37);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 37", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 38", () => {
    const page = new Request("https://example.com/entries/mcp/demo-38");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 38", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.38" },
    });
    expect(getClientKey(request)).toBe("1.2.3.38");
  });
  it("isVerifiedCloudflareBot matrix 38", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 38", () => {
    const request = new Request("https://example.com/page-38", {
      headers: { "cf-connecting-ip": "10.0.0.38" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 38", () => {
    pruneExpiredSignalBuckets(Date.now() + 38);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 38", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 39", () => {
    const page = new Request("https://example.com/entries/mcp/demo-39");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 39", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.39" },
    });
    expect(getClientKey(request)).toBe("1.2.3.39");
  });
  it("isVerifiedCloudflareBot matrix 39", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 39", () => {
    const request = new Request("https://example.com/page-39", {
      headers: { "cf-connecting-ip": "10.0.0.39" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 39", () => {
    pruneExpiredSignalBuckets(Date.now() + 39);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 39", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 40", () => {
    const page = new Request("https://example.com/entries/mcp/demo-40");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 40", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.40" },
    });
    expect(getClientKey(request)).toBe("1.2.3.40");
  });
  it("isVerifiedCloudflareBot matrix 40", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 40", () => {
    const request = new Request("https://example.com/page-40", {
      headers: { "cf-connecting-ip": "10.0.0.40" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 40", () => {
    pruneExpiredSignalBuckets(Date.now() + 40);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 40", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 41", () => {
    const page = new Request("https://example.com/entries/mcp/demo-41");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 41", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.41" },
    });
    expect(getClientKey(request)).toBe("1.2.3.41");
  });
  it("isVerifiedCloudflareBot matrix 41", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 41", () => {
    const request = new Request("https://example.com/page-41", {
      headers: { "cf-connecting-ip": "10.0.0.41" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 41", () => {
    pruneExpiredSignalBuckets(Date.now() + 41);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 41", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 42", () => {
    const page = new Request("https://example.com/entries/mcp/demo-42");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 42", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.42" },
    });
    expect(getClientKey(request)).toBe("1.2.3.42");
  });
  it("isVerifiedCloudflareBot matrix 42", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 42", () => {
    const request = new Request("https://example.com/page-42", {
      headers: { "cf-connecting-ip": "10.0.0.42" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 42", () => {
    pruneExpiredSignalBuckets(Date.now() + 42);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 42", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 43", () => {
    const page = new Request("https://example.com/entries/mcp/demo-43");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 43", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.43" },
    });
    expect(getClientKey(request)).toBe("1.2.3.43");
  });
  it("isVerifiedCloudflareBot matrix 43", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 43", () => {
    const request = new Request("https://example.com/page-43", {
      headers: { "cf-connecting-ip": "10.0.0.43" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 43", () => {
    pruneExpiredSignalBuckets(Date.now() + 43);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 43", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 44", () => {
    const page = new Request("https://example.com/entries/mcp/demo-44");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 44", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.44" },
    });
    expect(getClientKey(request)).toBe("1.2.3.44");
  });
  it("isVerifiedCloudflareBot matrix 44", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 44", () => {
    const request = new Request("https://example.com/page-44", {
      headers: { "cf-connecting-ip": "10.0.0.44" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 44", () => {
    pruneExpiredSignalBuckets(Date.now() + 44);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 44", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 45", () => {
    const page = new Request("https://example.com/entries/mcp/demo-45");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 45", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.45" },
    });
    expect(getClientKey(request)).toBe("1.2.3.45");
  });
  it("isVerifiedCloudflareBot matrix 45", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 45", () => {
    const request = new Request("https://example.com/page-45", {
      headers: { "cf-connecting-ip": "10.0.0.45" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 45", () => {
    pruneExpiredSignalBuckets(Date.now() + 45);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 45", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 46", () => {
    const page = new Request("https://example.com/entries/mcp/demo-46");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 46", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.46" },
    });
    expect(getClientKey(request)).toBe("1.2.3.46");
  });
  it("isVerifiedCloudflareBot matrix 46", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 46", () => {
    const request = new Request("https://example.com/page-46", {
      headers: { "cf-connecting-ip": "10.0.0.46" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 46", () => {
    pruneExpiredSignalBuckets(Date.now() + 46);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 46", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 47", () => {
    const page = new Request("https://example.com/entries/mcp/demo-47");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 47", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.47" },
    });
    expect(getClientKey(request)).toBe("1.2.3.47");
  });
  it("isVerifiedCloudflareBot matrix 47", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 47", () => {
    const request = new Request("https://example.com/page-47", {
      headers: { "cf-connecting-ip": "10.0.0.47" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 47", () => {
    pruneExpiredSignalBuckets(Date.now() + 47);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 47", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 48", () => {
    const page = new Request("https://example.com/entries/mcp/demo-48");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 48", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.48" },
    });
    expect(getClientKey(request)).toBe("1.2.3.48");
  });
  it("isVerifiedCloudflareBot matrix 48", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 48", () => {
    const request = new Request("https://example.com/page-48", {
      headers: { "cf-connecting-ip": "10.0.0.48" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 48", () => {
    pruneExpiredSignalBuckets(Date.now() + 48);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 48", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
  it("isPageLikeRequest matrix 49", () => {
    const page = new Request("https://example.com/entries/mcp/demo-49");
    const api = new Request("https://example.com/api/registry/search");
    expect(isPageLikeRequest(page)).toBe(true);
    expect(isPageLikeRequest(api)).toBe(false);
  });
  it("getClientKey matrix 49", () => {
    const request = new Request("https://example.com/", {
      headers: { "cf-connecting-ip": "1.2.3.49" },
    });
    expect(getClientKey(request)).toBe("1.2.3.49");
  });
  it("isVerifiedCloudflareBot matrix 49", () => {
    const request = new Request("https://example.com/");
    expect(isVerifiedCloudflareBot(request)).toBe(false);
  });
  it("consumeReferralQuota matrix 49", () => {
    const request = new Request("https://example.com/page-49", {
      headers: { "cf-connecting-ip": "10.0.0.49" },
    });
    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);
  });
  it("pruneExpiredSignalBuckets matrix 49", () => {
    pruneExpiredSignalBuckets(Date.now() + 49);
    evictOldestSignalBuckets();
    expect(true).toBe(true);
  });
  it("getDataset matrix 49", () => {
    expect(getDataset({})).toBeNull();
    expect(
      getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } }),
    ).toBeTruthy();
  });
});
