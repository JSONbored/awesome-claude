import { describe, expect, it } from "vitest";

import { respondFeed } from "@/lib/feeds";
import {
  cachedJsonResponse,
  cachedTextResponse,
  ifNoneMatchMatches,
} from "@/lib/http-cache";
import { respondText } from "@/lib/llms";

describe("HTTP cache helpers", () => {
  it("matches strong, weak, list, and wildcard ETag validators", () => {
    const etag = '"sha256-abcdef"';
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
    expect(ifNoneMatchMatches('"sha256-deadbeef"', etag)).toBe(false);
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(`W/${etag}`, etag)).toBe(true);
    expect(ifNoneMatchMatches(`"sha256-deadbeef", W/${etag}`, etag)).toBe(true);
    expect(ifNoneMatchMatches("*", etag)).toBe(true);
  });

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

    const multi = await cachedJsonResponse(
      new Request("https://heyclau.de/api/registry/feed", {
        headers: {
          "if-none-match": `"deadbeef", W/${etag}`,
        },
      }),
      { ok: true },
    );
    expect(multi.status).toBe(304);

    const wildcard = await cachedJsonResponse(
      new Request("https://heyclau.de/api/registry/feed", {
        headers: {
          "if-none-match": "*",
        },
      }),
      { ok: true },
    );
    expect(wildcard.status).toBe(304);
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

  it("normalizes text bodies and revalidates text responses with weak ETags", async () => {
    const first = await cachedTextResponse(
      new Request("https://heyclau.de/llms.txt"),
      "hello",
      { headers: { "cache-control": "public, max-age=60" } },
    );
    const etag = first.headers.get("etag");

    expect(await first.text()).toBe("hello\n");
    expect(first.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(first.headers.get("cache-control")).toBe("public, max-age=60");

    const second = await cachedTextResponse(
      new Request("https://heyclau.de/llms.txt", {
        headers: { "if-none-match": `W/${etag}` },
      }),
      "hello\n",
    );
    expect(second.status).toBe(304);
    expect(await second.text()).toBe("");
  });

  it("revalidates LLM text responses with weak and wildcard ETags", async () => {
    const first = await respondText(
      new Request("https://heyclau.de/llms.txt"),
      "# HeyClaude\n",
    );
    const etag = first.headers.get("etag");
    expect(etag).toBeTruthy();

    const weak = await respondText(
      new Request("https://heyclau.de/llms.txt", {
        headers: { "if-none-match": `W/${etag}` },
      }),
      "# HeyClaude\n",
    );
    expect(weak.status).toBe(304);

    const wildcard = await respondText(
      new Request("https://heyclau.de/llms.txt", {
        headers: { "if-none-match": "*" },
      }),
      "# HeyClaude\n",
    );
    expect(wildcard.status).toBe(304);
  });
});

describe("feed response helpers", () => {
  it("sends RSS and Atom content types that match the public API contract", async () => {
    const request = new Request("https://heyclau.de/feed.xml");
    const rss = await respondFeed(
      request,
      '<rss version="2.0"></rss>',
      "2026-05-29T00:00:00.000Z",
    );
    const atom = await respondFeed(
      new Request("https://heyclau.de/atom.xml"),
      "<feed></feed>",
      "2026-05-29T00:00:00.000Z",
      "application/atom+xml; charset=utf-8",
    );

    expect(rss.headers.get("content-type")).toBe(
      "application/rss+xml; charset=utf-8",
    );
    expect(atom.headers.get("content-type")).toBe(
      "application/atom+xml; charset=utf-8",
    );
  });
});
