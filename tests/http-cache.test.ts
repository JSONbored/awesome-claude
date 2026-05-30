import { describe, expect, it } from "vitest";

import { respondFeed } from "@/lib/feeds";
import { cachedJsonResponse } from "@/lib/http-cache";

describe("HTTP cache helpers", () => {
  it("accepts Cloudflare weak ETag revalidation headers", async () => {
    const first = await cachedJsonResponse(
      new Request("https://heyclau.de/api/registry/feed"),
      { ok: true },
    );
    const etag = first.headers.get("etag");
    expect(etag).toBeTruthy();

    const second = await cachedJsonResponse(
      new Request("https://heyclau.de/api/registry/feed", {
        headers: {
          "if-none-match": `W/${etag}`,
        },
      }),
      { ok: true },
    );

    expect(second.status).toBe(304);
  });

  it("attaches security headers to cacheable registry responses", async () => {
    const response = await cachedJsonResponse(
      new Request("https://heyclau.de/api/registry/feed"),
      { ok: true },
    );

    expect(response.headers.get("content-security-policy")).toContain(
      "default-src 'self'",
    );
    expect(response.headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(response.headers.get("permissions-policy")).toContain(
      "geolocation=()",
    );
    expect(response.headers.get("strict-transport-security")).toContain(
      "max-age=63072000",
    );
  });
});

describe("feed response helpers", () => {
  it("sends RSS and Atom content types that match the public API contract", async () => {
    const request = new Request("https://heyclau.de/feed.xml");
    const rss = await respondFeed(
      request,
      "<rss version=\"2.0\"></rss>",
      "2026-05-29T00:00:00.000Z",
    );
    const atom = await respondFeed(
      new Request("https://heyclau.de/atom.xml"),
      "<feed></feed>",
      "2026-05-29T00:00:00.000Z",
      "application/atom+xml; charset=utf-8",
    );

    expect(rss.headers.get("content-type")).toBe("application/rss+xml; charset=utf-8");
    expect(atom.headers.get("content-type")).toBe("application/atom+xml; charset=utf-8");
  });
});
