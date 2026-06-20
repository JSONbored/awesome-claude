import { describe, expect, it } from "vitest";

import {
  toolListingSignals,
  looksLikeToolAppListing,
  looksLikeMcpServerSubmission,
} from "../packages/registry/src/submission-classification.js";

describe("toolListingSignals", () => {
  it("flags commercial signals from structured fields", () => {
    expect(
      toolListingSignals(
        { websiteUrl: "https://example.com", pricingModel: "freemium" },
        "",
      ),
    ).toEqual(expect.arrayContaining(["website_url", "pricing_model"]));
  });

  it("detects hosted/SaaS/subscription language in free text", () => {
    const signals = toolListingSignals(
      {},
      "This is a hosted SaaS platform with a subscription plan",
    );
    expect(signals).toEqual(
      expect.arrayContaining(["saas", "service", "subscription"]),
    );
  });

  it("returns no signals for a plain free-content submission", () => {
    expect(toolListingSignals({}, "a simple reusable prompt")).toEqual([]);
  });
});

describe("looksLikeToolAppListing", () => {
  it("is true when commercial app signals are present", () => {
    expect(looksLikeToolAppListing({}, "hosted web app with a paid plan")).toBe(
      true,
    );
  });

  it("is false for plain free content", () => {
    expect(looksLikeToolAppListing({}, "a helpful coding agent prompt")).toBe(
      false,
    );
  });

  it("does not route a genuine MCP submission to the tool flow", () => {
    // An MCP-category server submission is content, not a commercial tool app.
    expect(
      looksLikeToolAppListing({ category: "mcp" }, "an MCP server endpoint"),
    ).toBe(false);
  });
});

describe("looksLikeMcpServerSubmission", () => {
  it("recognizes MCP server language and install commands", () => {
    expect(looksLikeMcpServerSubmission({}, "claude mcp add my-server")).toBe(
      true,
    );
    expect(
      looksLikeMcpServerSubmission({}, "an MCP server for local files"),
    ).toBe(true);
  });

  it("is false for non-MCP submissions", () => {
    expect(looksLikeMcpServerSubmission({}, "a regular CLI tool")).toBe(false);
  });
});
