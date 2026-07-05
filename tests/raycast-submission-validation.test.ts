import { describe, expect, it } from "vitest";

import {
  normalizeDomain,
  isValidHttpsUrl,
  isValidDomain,
} from "../integrations/raycast/src/submission.js";

describe("normalizeDomain", () => {
  it("extracts a lowercased, www-stripped hostname from a URL", () => {
    expect(normalizeDomain("https://www.Example.com/path?q=1")).toBe(
      "example.com",
    );
  });

  it("treats a bare host as https and lowercases it", () => {
    // Missing scheme is assumed https so the host can still be parsed.
    expect(normalizeDomain("Example.COM")).toBe("example.com");
  });

  it("returns an empty string for empty or missing input", () => {
    // The parameter is declared `value?: string`, so a missing/blank value is
    // a supported call shape that normalizes to "".
    expect(normalizeDomain("")).toBe("");
    expect(normalizeDomain()).toBe("");
  });
});

describe("isValidHttpsUrl", () => {
  it("accepts only https URLs", () => {
    expect(isValidHttpsUrl("https://example.com")).toBe(true);
    // http and non-URL inputs are rejected (no plaintext, no garbage).
    expect(isValidHttpsUrl("http://example.com")).toBe(false);
    expect(isValidHttpsUrl("not a url")).toBe(false);
    expect(isValidHttpsUrl("")).toBe(false);
  });

  it("rejects https URLs with embedded userinfo credentials", () => {
    expect(isValidHttpsUrl("https://token@github.com/owner/repo")).toBe(false);
    expect(isValidHttpsUrl("https://user:pass@example.com/docs")).toBe(false);
  });
});

describe("isValidDomain", () => {
  it("accepts dotted domains, including multi-label hosts", () => {
    expect(isValidDomain("example.com")).toBe(true);
    expect(isValidDomain("a.b.example.co.uk")).toBe(true);
    // It normalizes first, so a full URL with www resolves to a valid domain.
    expect(isValidDomain("https://www.example.com/path")).toBe(true);
  });

  it("rejects single-label hosts and invalid characters", () => {
    expect(isValidDomain("localhost")).toBe(false);
    expect(isValidDomain("not_a_domain")).toBe(false);
    expect(isValidDomain("")).toBe(false);
  });
});
