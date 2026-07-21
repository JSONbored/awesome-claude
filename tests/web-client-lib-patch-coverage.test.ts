import { afterEach, describe, expect, it, vi } from "vitest";

import { buildCommunityTrendingEntries } from "../apps/web/src/lib/growth-community-trending-lib";
import { newsletterApiErrorMessage } from "../apps/web/src/lib/newsletter-api-client-lib";
import { respondText } from "../apps/web/src/lib/llms-text-route-lib";
import { clampDescription } from "../apps/web/src/lib/seo-lib";

describe("web client lib patch coverage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("clamps on a word boundary when a long space appears late", () => {
    const text = `${"alpha ".repeat(20)}beta`;
    expect(clampDescription(text, 40)).toMatch(/…$/);
  });

  it("parses nested newsletter API errors", () => {
    expect(
      newsletterApiErrorMessage({ error: { message: "bad email" } }, "x"),
    ).toBe("bad email");
  });

  it("skips community trending entries without trust metadata", () => {
    expect(
      buildCommunityTrendingEntries(
        [{ category: "mcp", slug: "plain", dateAdded: "2026-01-01" }],
        { communityCounts: {}, intentCounts: {}, voteCounts: {} },
      ),
    ).toEqual([]);
  });

  it("returns 304 for matching etags in respondText", async () => {
    const body = "hello llms";
    const first = await respondText(
      new Request("https://heyclau.de/llms.txt"),
      body,
    );
    const etag = first.headers.get("etag");
    const cached = await respondText(
      new Request("https://heyclau.de/llms.txt", {
        headers: { "if-none-match": etag ?? "" },
      }),
      body,
    );
    expect(cached.status).toBe(304);
  });
});
