import { describe, expect, it } from "vitest";

import {
  TOOLS_LISTING_FLOW_URL,
  looksLikeToolAppListing,
  toolListingSignals,
} from "../packages/registry/src/submission-classification.js";

describe("submission-classification re-export surface", () => {
  it("keeps the public import path wired to the extracted lib", () => {
    expect(TOOLS_LISTING_FLOW_URL).toBe("https://heyclau.de/tools/submit");
    expect(
      toolListingSignals({ websiteUrl: "https://example.com" }, ""),
    ).toEqual(["website_url"]);
    expect(looksLikeToolAppListing({}, "hosted web app")).toBe(true);
  });
});
