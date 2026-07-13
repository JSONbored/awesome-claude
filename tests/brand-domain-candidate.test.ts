import { describe, expect, it } from "vitest";

import { candidateDomain } from "../scripts/lib/brand-domain-candidate.mjs";

describe("candidateDomain", () => {
  it("prefers an explicit brandDomain", () => {
    expect(
      candidateDomain({
        brandDomain: "acme.com",
        websiteUrl: "https://other.com",
      }),
    ).toEqual({ domain: "acme.com", source: "explicit" });
  });

  it("uses a non-hosting websiteUrl domain when there is no brandDomain", () => {
    expect(candidateDomain({ websiteUrl: "https://acme.com/product" })).toEqual(
      {
        domain: "acme.com",
        source: "websiteUrl",
      },
    );
  });

  it("skips a hosting websiteUrl and falls back to a documentationUrl domain", () => {
    expect(
      candidateDomain({
        websiteUrl: "https://github.com/acme/tool",
        documentationUrl: "https://docs.acme.io/start",
      }),
    ).toEqual({
      domain: "docs.acme.io",
      source: "documentationUrl-review-only",
    });
  });

  it("returns the missing sentinel when nothing usable is present", () => {
    expect(candidateDomain({})).toEqual({ domain: "", source: "missing" });
    expect(
      candidateDomain({
        websiteUrl: "https://github.com/x",
        documentationUrl: "https://npmjs.com/package/y",
      }),
    ).toEqual({ domain: "", source: "missing" });
  });
});
