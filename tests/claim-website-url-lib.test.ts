import { describe, expect, it } from "vitest";

import type { Entry } from "../apps/web/src/types/registry";
import { resolveClaimWebsiteUrl } from "../apps/web/src/lib/claim-website-url-lib";

const entry = (over: Partial<Entry> = {}) => ({ ...over }) as Entry;

describe("resolveClaimWebsiteUrl", () => {
  it("prefers the first https entry URL in source/repo/docs/website order", () => {
    expect(
      resolveClaimWebsiteUrl(
        entry({
          sourceUrl: "http://insecure.example",
          repoUrl: "https://github.com/o/r",
          websiteUrl: "https://site.example",
        }),
        {},
      ),
    ).toBe("https://github.com/o/r");
  });

  it("falls back to a later https field when earlier ones are missing/insecure", () => {
    expect(
      resolveClaimWebsiteUrl(
        entry({
          sourceUrl: "  ",
          repoUrl: "http://insecure.example",
          docsUrl: "ftp://docs.example",
          websiteUrl: "https://site.example",
        }),
        {},
      ),
    ).toBe("https://site.example");
  });

  it("normalizes an owner/repo proof to a canonical github URL", () => {
    expect(resolveClaimWebsiteUrl(entry(), { repo: "owner/name" })).toBe(
      "https://github.com/owner/name",
    );
  });

  it("strips a github URL / trailing query from a repo proof", () => {
    expect(
      resolveClaimWebsiteUrl(entry(), {
        repo: "https://github.com/owner/name?tab=readme",
      }),
    ).toBe("https://github.com/owner/name");
  });

  it("ignores a malformed repo proof and falls back to an https link proof", () => {
    expect(
      resolveClaimWebsiteUrl(entry(), {
        repo: "not-a-repo",
        link: "https://proof.example/verify",
      }),
    ).toBe("https://proof.example/verify");
  });

  it("returns '' when nothing usable is present", () => {
    // No proof at all (link undefined), and a non-https link proof.
    expect(resolveClaimWebsiteUrl(entry({ sourceUrl: "ftp://x" }), {})).toBe(
      "",
    );
    expect(resolveClaimWebsiteUrl(entry(), { link: "http://insecure" })).toBe(
      "",
    );
  });
});
