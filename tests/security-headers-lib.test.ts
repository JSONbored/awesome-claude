import { describe, expect, it } from "vitest";

import {
  applyEdgeCacheHeaders,
  HTML_CACHE_CONTROL,
  isNonProdHost,
  urlOrigin,
} from "../apps/web/src/lib/security-headers-lib";

describe("urlOrigin", () => {
  it("returns the origin of a valid URL", () => {
    expect(urlOrigin("https://api.github.com/repos/x")).toBe(
      "https://api.github.com",
    );
    expect(urlOrigin("http://localhost:3000/a?b=c")).toBe(
      "http://localhost:3000",
    );
  });

  it("returns an empty string for empty or malformed input", () => {
    expect(urlOrigin("")).toBe("");
    expect(urlOrigin("not a url")).toBe("");
  });
});

describe("isNonProdHost", () => {
  it("flags preview/staging/local hosts", () => {
    for (const h of [
      "dev.heyclau.de",
      "localhost",
      "app.localhost",
      "web-staging.example.com",
      "web.workers.dev",
    ]) {
      expect(isNonProdHost(h)).toBe(true);
    }
  });

  it("does not flag the production host", () => {
    for (const h of ["heyclau.de", "www.heyclau.de", "developer.example.com"]) {
      expect(isNonProdHost(h)).toBe(false);
    }
  });
});

describe("applyEdgeCacheHeaders", () => {
  const htmlHeaders = () =>
    new Headers({ "content-type": "text/html; charset=utf-8" });

  it("caches a plain GET 200 HTML response", () => {
    const headers = applyEdgeCacheHeaders(htmlHeaders(), 200, "GET");
    expect(headers.get("cache-control")).toBe(HTML_CACHE_CONTROL);
  });

  it("does not cache non-GET, non-200, or non-HTML responses", () => {
    expect(
      applyEdgeCacheHeaders(htmlHeaders(), 200, "POST").has("cache-control"),
    ).toBe(false);
    expect(
      applyEdgeCacheHeaders(htmlHeaders(), 500, "GET").has("cache-control"),
    ).toBe(false);
    expect(
      applyEdgeCacheHeaders(
        new Headers({ "content-type": "application/json" }),
        200,
        "GET",
      ).has("cache-control"),
    ).toBe(false);
  });

  it("preserves an explicit cache-control and never caches a personalized (Set-Cookie) response", () => {
    const explicit = new Headers({
      "content-type": "text/html",
      "cache-control": "no-store",
    });
    expect(
      applyEdgeCacheHeaders(explicit, 200, "GET").get("cache-control"),
    ).toBe("no-store");

    const cookied = new Headers({
      "content-type": "text/html",
      "set-cookie": "sid=1",
    });
    expect(
      applyEdgeCacheHeaders(cookied, 200, "GET").has("cache-control"),
    ).toBe(false);
  });
});
