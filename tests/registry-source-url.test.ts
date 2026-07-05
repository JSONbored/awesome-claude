import { describe, expect, it } from "vitest";

import {
  canonicalizeSourceUrl,
  hasAffiliateParam,
  isAffiliateParam,
  stripTrackingParams,
} from "@heyclaude/registry/source-url";

describe("source-url re-export surface", () => {
  it("keeps the public import path wired to the extracted lib", () => {
    expect(isAffiliateParam("ref")).toBe(true);
    expect(
      hasAffiliateParam("https://example.com/docs?utm_source=newsletter"),
    ).toBe(true);
    expect(
      stripTrackingParams(
        "https://example.com/docs?utm_source=newsletter&version=1",
      ),
    ).toBe("https://example.com/docs?version=1");
    expect(
      canonicalizeSourceUrl(
        "https://www.Example.com/docs/?utm_source=newsletter&b=2&a=1",
      ),
    ).toBe("https://example.com/docs?a=1&b=2");
  });
});
