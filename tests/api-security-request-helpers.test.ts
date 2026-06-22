import { describe, expect, it } from "vitest";

import { getClientIp, hasJsonContentType } from "@/lib/api-security";

const request = (headers: Record<string, string>) =>
  new Request("https://heyclau.de/api/test", { headers });

describe("getClientIp", () => {
  it("prefers the Cloudflare connecting IP header", () => {
    // cf-connecting-ip is set by the edge and is the most trustworthy source.
    expect(
      getClientIp(
        request({
          "cf-connecting-ip": "1.2.3.4",
          "x-forwarded-for": "9.9.9.9",
        }),
      ),
    ).toBe("1.2.3.4");
  });

  it("falls back to the first x-forwarded-for hop, trimmed", () => {
    // The left-most XFF entry is the original client; later hops are proxies.
    expect(
      getClientIp(request({ "x-forwarded-for": "9.9.9.9, 10.0.0.1" })),
    ).toBe("9.9.9.9");
    expect(getClientIp(request({ "x-forwarded-for": "  8.8.8.8  " }))).toBe(
      "8.8.8.8",
    );
  });

  it("returns 'unknown' when no client IP header is present", () => {
    // A stable sentinel keeps rate-limit bucket keys well-formed.
    expect(getClientIp(request({}))).toBe("unknown");
  });
});

describe("hasJsonContentType", () => {
  it("accepts application/json with or without parameters, case-insensitively", () => {
    expect(
      hasJsonContentType(
        request({ "content-type": "application/json; charset=utf-8" }),
      ),
    ).toBe(true);
    expect(
      hasJsonContentType(request({ "content-type": "APPLICATION/JSON" })),
    ).toBe(true);
  });

  it("rejects non-JSON and missing content types", () => {
    expect(hasJsonContentType(request({ "content-type": "text/plain" }))).toBe(
      false,
    );
    // No content-type header at all must not be treated as JSON.
    expect(hasJsonContentType(request({}))).toBe(false);
  });
});
