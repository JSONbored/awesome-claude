import { describe, expect, it } from "vitest";

import {
  canonicalizeSourceUrl,
  hasAffiliateParam,
  isAffiliateParam,
  isTrackingParam,
  stripTrackingParams,
} from "@heyclaude/registry/source-url";

describe("source-url helpers", () => {
  it("classifies affiliate params (utm_* and the partner set)", () => {
    expect(isAffiliateParam("utm_source")).toBe(true);
    expect(isAffiliateParam("UTM_Campaign")).toBe(true);
    expect(isAffiliateParam("ref")).toBe(true);
    expect(isAffiliateParam("via")).toBe(true);
    expect(isAffiliateParam("page")).toBe(false);
    expect(isAffiliateParam("")).toBe(false);
    expect(isAffiliateParam(null)).toBe(false);
  });

  it("treats analytics params as tracking but not affiliate", () => {
    expect(isTrackingParam("fbclid")).toBe(true);
    expect(isTrackingParam("gclid")).toBe(true);
    expect(isTrackingParam("igshid")).toBe(true);
    expect(isAffiliateParam("fbclid")).toBe(false);
    expect(isTrackingParam("utm_medium")).toBe(true);
    expect(isTrackingParam("q")).toBe(false);
  });

  it("detects affiliate URLs and ignores plain query strings", () => {
    expect(hasAffiliateParam("https://example.com/?utm_source=x")).toBe(true);
    expect(hasAffiliateParam("https://example.com/?ref=heyclaude")).toBe(true);
    expect(hasAffiliateParam("https://example.com/?page=2")).toBe(false);
    expect(hasAffiliateParam("https://example.com/?fbclid=abc")).toBe(false);
    expect(hasAffiliateParam("not a url")).toBe(false);
    expect(hasAffiliateParam("")).toBe(false);
  });

  it("strips tracking params while preserving meaningful ones", () => {
    expect(
      stripTrackingParams(
        "https://example.com/docs?utm_source=nl&page=2&fbclid=z",
      ),
    ).toBe("https://example.com/docs?page=2");
    expect(stripTrackingParams("https://example.com/docs?page=2")).toBe(
      "https://example.com/docs?page=2",
    );
    expect(stripTrackingParams("https://example.com/?utm_medium=x")).toBe(
      "https://example.com/",
    );
    expect(stripTrackingParams("not a url")).toBe("not a url");
  });

  it("canonicalizes for duplicate comparison", () => {
    const a = canonicalizeSourceUrl(
      "https://WWW.Example.com/Repo/?utm_source=nl&ref=x#readme",
    );
    const b = canonicalizeSourceUrl("https://example.com/Repo");
    expect(a).toBe(b);
    expect(a).toBe("https://example.com/repo");
  });

  it("keeps non-tracking query params during canonicalization", () => {
    expect(
      canonicalizeSourceUrl("https://example.com/search?q=claude&utm_term=x"),
    ).toBe("https://example.com/search?q=claude");
  });

  it("falls back to a lowercased string for unparsable input", () => {
    expect(canonicalizeSourceUrl("  Not A URL  ")).toBe("not a url");
    expect(canonicalizeSourceUrl("")).toBe("");
  });
});
