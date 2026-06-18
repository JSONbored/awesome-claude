import { describe, expect, it } from "vitest";

import {
  canonicalizeSourceUrl,
  hasAffiliateParam,
  isAffiliateParam,
  isTrackingParam,
  stripTrackingParams,
} from "@heyclaude/registry/source-url";

describe("source URL canonicalization", () => {
  it("classifies affiliate and tracking params", () => {
    expect(isAffiliateParam("ref")).toBe(true);
    expect(isAffiliateParam("utm_source")).toBe(true);
    expect(isAffiliateParam("fbclid")).toBe(false);
    expect(isTrackingParam("fbclid")).toBe(true);
    expect(isTrackingParam("gclid")).toBe(true);
    expect(isTrackingParam("version")).toBe(false);
  });

  it("preserves affiliate detection used by submission validation", () => {
    expect(
      hasAffiliateParam("https://example.com/docs?utm_source=newsletter"),
    ).toBe(true);
    expect(hasAffiliateParam("https://example.com/docs?ref=creator")).toBe(
      true,
    );
    expect(hasAffiliateParam("https://example.com/docs?version=1")).toBe(false);
  });

  it("strips tracking params without dropping meaningful query params", () => {
    expect(
      stripTrackingParams(
        "https://example.com/docs?utm_source=newsletter&version=1&fbclid=abc",
      ),
    ).toBe("https://example.com/docs?version=1");
  });

  it("canonicalizes source URLs for duplicate comparison", () => {
    expect(
      canonicalizeSourceUrl(
        "https://www.Example.com/docs/?utm_source=newsletter&b=2&a=1#install",
      ),
    ).toBe("https://example.com/docs?a=1&b=2");
    expect(canonicalizeSourceUrl("not a url")).toBe("not a url");
  });
});
