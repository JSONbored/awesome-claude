import { describe, expect, it } from "vitest";

import {
  missingToolListingReviewFields,
  toolListingRoutingMessage,
  toolListingApprovalMessage,
  TOOLS_LISTING_FLOW_URL,
} from "../packages/registry/src/submission-classification.js";

describe("missingToolListingReviewFields", () => {
  it("reports every review field as missing for an empty payload", () => {
    expect(missingToolListingReviewFields({})).toEqual([
      "websiteUrl",
      "documentationUrl",
      "pricingModel",
      "disclosure",
      "applicationCategory",
      "operatingSystem",
    ]);
  });

  it("only reports the fields that are still absent", () => {
    // Provided fields (incl. snake_case aliases) drop out of the missing list.
    expect(
      missingToolListingReviewFields({
        websiteUrl: "https://example.com",
        pricingModel: "free",
        disclosure: "sponsored",
      }),
    ).toEqual(["documentationUrl", "applicationCategory", "operatingSystem"]);
  });

  it("treats blank values as missing", () => {
    expect(missingToolListingReviewFields({ websiteUrl: "   " })).toContain(
      "websiteUrl",
    );
  });
});

describe("tool listing messages", () => {
  it("routing message points submitters at the tools listing flow", () => {
    const message = toolListingRoutingMessage();
    expect(message).toContain(TOOLS_LISTING_FLOW_URL);
  });

  it("approval message explains the maintainer-approval requirement", () => {
    const message = toolListingApprovalMessage();
    expect(message).toContain(TOOLS_LISTING_FLOW_URL);
    expect(message.toLowerCase()).toContain("approval");
  });
});
