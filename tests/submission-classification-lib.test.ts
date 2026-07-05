import { describe, expect, it } from "vitest";

import {
  TOOLS_CATEGORY,
  TOOLS_LISTING_FLOW_URL,
  looksLikeMcpServerSubmission,
  looksLikeToolAppListing,
  missingToolListingReviewFields,
  toolListingApprovalMessage,
  toolListingRoutingMessage,
  toolListingSignals,
} from "../packages/registry/src/submission-classification-lib.js";

describe("constants", () => {
  it("exposes the tools listing flow URL and category", () => {
    expect(TOOLS_LISTING_FLOW_URL).toBe("https://heyclau.de/tools/submit");
    expect(TOOLS_CATEGORY).toBe("tools");
  });
});

describe("toolListingSignals structured fields", () => {
  it("flags website_url from camelCase and snake_case aliases", () => {
    expect(
      toolListingSignals({ websiteUrl: "https://example.com" }, ""),
    ).toEqual(["website_url"]);
    expect(
      toolListingSignals({ website_url: "https://example.com" }, ""),
    ).toEqual(["website_url"]);
  });

  it("flags pricing_model from camelCase and snake_case aliases", () => {
    expect(toolListingSignals({ pricingModel: "freemium" }, "")).toEqual([
      "pricing_model",
    ]);
    expect(toolListingSignals({ pricing_model: "paid" }, "")).toEqual([
      "pricing_model",
    ]);
  });

  it("flags disclosure when the field is present", () => {
    expect(toolListingSignals({ disclosure: "paid partnership" }, "")).toEqual([
      "disclosure",
    ]);
  });

  it("ignores blank structured field values", () => {
    expect(
      toolListingSignals(
        {
          websiteUrl: "   ",
          pricingModel: "",
          disclosure: null,
        },
        "",
      ),
    ).toEqual([]);
  });

  it("merges structured fields into the searchable body", () => {
    expect(
      toolListingSignals(
        {
          title: "Hosted application",
          description: "subscription workspace",
        },
        "",
      ),
    ).toEqual(
      expect.arrayContaining([
        "hosted_app",
        "software",
        "service",
        "subscription",
      ]),
    );
  });
});

describe("toolListingSignals text patterns", () => {
  const expectSignal = (text: string, signal: string) => {
    expect(
      toolListingSignals({}, text),
      `expected ${signal} in "${text}"`,
    ).toEqual(expect.arrayContaining([signal]));
  };

  it("detects hosted app language", () => {
    for (const phrase of [
      "a hosted app for teams",
      "our hosted application ships weekly",
      "a hosted product for developers",
      "a hosted service for Claude users",
      "a hosted platform for agents",
    ]) {
      expectSignal(phrase, "hosted_app");
    }
  });

  it("detects desktop app language", () => {
    for (const phrase of [
      "download our desktop app",
      "a desktop application for macOS",
      "install the native app",
    ]) {
      expectSignal(phrase, "desktop_app");
    }
  });

  it("detects web and mobile app language", () => {
    expectSignal("try our web app in the browser", "web_app");
    expectSignal("a web application for teams", "web_app");
    expectSignal("install the mobile app", "mobile_app");
    expectSignal("a mobile application for iOS", "mobile_app");
  });

  it("detects runtime app language", () => {
    for (const phrase of [
      "a local ai agent runtime",
      "an agentic ai runtime",
      "this ai runtime runs locally",
      "software that runs on your machine",
    ]) {
      expectSignal(phrase, "runtime_app");
    }
  });

  it("detects product and software language", () => {
    expectSignal("a commercial product for teams", "product");
    expectSignal("our software product ships monthly", "product");
    expectSignal("desktop software for developers", "software");
    expectSignal("a useful application", "software");
  });

  it("detects SaaS and service language", () => {
    expectSignal("a SaaS offering", "saas");
    expectSignal("software as a service", "saas");
    expectSignal("a workspace for teams", "service");
    expectSignal("a dashboard for operators", "service");
    expectSignal("a developer interface", "service");
  });

  it("detects subscription and pricing language", () => {
    for (const phrase of [
      "monthly subscription",
      "transparent pricing",
      "paid plan available",
      "pro plan for teams",
      "free trial included",
      "free to try today",
      "no credit card required",
    ]) {
      expectSignal(phrase, "subscription");
    }
  });

  it("detects features page and placement language", () => {
    expectSignal("see our features page", "features_page");
    expectSignal("demo url available on request", "features_page");
    expectSignal("product url in the README", "features_page");
    expectSignal("website url in docs", "features_page");
    expectSignal("featured on the homepage", "placement");
    expectSignal("sponsored listing", "placement");
    expectSignal("affiliate disclosure required", "placement");
    expectSignal("preferred placement available", "placement");
  });

  it("returns no signals for plain free-content submissions", () => {
    expect(toolListingSignals({}, "a simple reusable prompt")).toEqual([]);
    expect(toolListingSignals({}, "helpful coding patterns")).toEqual([]);
  });

  it("deduplicates repeated signals", () => {
    expect(
      toolListingSignals(
        { websiteUrl: "https://example.com" },
        "hosted SaaS platform with hosted application copy",
      ),
    ).toEqual(expect.arrayContaining(["website_url", "hosted_app", "saas"]));
    expect(
      new Set(
        toolListingSignals(
          { websiteUrl: "https://example.com" },
          "hosted SaaS platform",
        ),
      ).size,
    ).toBe(
      toolListingSignals(
        { websiteUrl: "https://example.com" },
        "hosted SaaS platform",
      ).length,
    );
  });
});

describe("looksLikeMcpServerSubmission", () => {
  it("recognizes MCP server language in free text", () => {
    for (const phrase of [
      "an MCP server for local files",
      "remote MCP endpoint",
      "stdio MCP tool",
      "streamable MCP transport",
      "sample MCP config",
      "updated MCP configuration",
    ]) {
      expect(looksLikeMcpServerSubmission({}, phrase), phrase).toBe(true);
    }
  });

  it("recognizes claude mcp add install commands", () => {
    expect(looksLikeMcpServerSubmission({}, "claude mcp add my-server")).toBe(
      true,
    );
    expect(
      looksLikeMcpServerSubmission(
        { installCommand: "claude mcp add demo" },
        "",
      ),
    ).toBe(true);
  });

  it("reads MCP hints from structured fields", () => {
    expect(
      looksLikeMcpServerSubmission(
        {
          title: "Filesystem MCP server",
          usageSnippet: "stdio transport",
        },
        "",
      ),
    ).toBe(true);
  });

  it("is false for non-MCP submissions", () => {
    expect(looksLikeMcpServerSubmission({}, "a regular CLI tool")).toBe(false);
    expect(looksLikeMcpServerSubmission({}, "helpful prompt template")).toBe(
      false,
    );
  });
});

describe("looksLikeToolAppListing", () => {
  it("is true when a single hard commercial signal is present", () => {
    expect(looksLikeToolAppListing({}, "hosted web app with a paid plan")).toBe(
      true,
    );
    expect(looksLikeToolAppListing({}, "download our desktop app")).toBe(true);
    expect(looksLikeToolAppListing({}, "a SaaS platform")).toBe(true);
  });

  it("is true when two softer signals appear together", () => {
    expect(
      looksLikeToolAppListing(
        { websiteUrl: "https://example.com", pricingModel: "free" },
        "",
      ),
    ).toBe(true);
  });

  it("is false for plain free content", () => {
    expect(looksLikeToolAppListing({}, "a helpful coding agent prompt")).toBe(
      false,
    );
  });

  it("does not route a genuine MCP submission to the tool flow", () => {
    expect(
      looksLikeToolAppListing({ category: "mcp" }, "an MCP server endpoint"),
    ).toBe(false);
    expect(
      looksLikeToolAppListing(
        { category: "mcp", installCommand: "claude mcp add demo" },
        "stdio MCP transport",
      ),
    ).toBe(false);
  });

  it("still routes non-MCP categories with commercial signals", () => {
    expect(
      looksLikeToolAppListing({ category: "skills" }, "hosted SaaS platform"),
    ).toBe(true);
  });

  it("treats category case-insensitively for the MCP exception", () => {
    expect(
      looksLikeToolAppListing({ category: "MCP" }, "an MCP server endpoint"),
    ).toBe(false);
  });
});

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
    expect(
      missingToolListingReviewFields({
        websiteUrl: "https://example.com",
        pricingModel: "free",
        disclosure: "sponsored",
      }),
    ).toEqual(["documentationUrl", "applicationCategory", "operatingSystem"]);
  });

  it("accepts snake_case aliases for review fields", () => {
    expect(
      missingToolListingReviewFields({
        website_url: "https://example.com",
        docs_url: "https://example.com/docs",
        pricing_model: "free",
        disclosure: "none",
        application_category: "DeveloperApplication",
        operating_system: "macOS",
      }),
    ).toEqual([]);
  });

  it("treats blank values as missing", () => {
    expect(missingToolListingReviewFields({ websiteUrl: "   " })).toContain(
      "websiteUrl",
    );
    expect(missingToolListingReviewFields({ documentationUrl: "" })).toContain(
      "documentationUrl",
    );
  });
});

describe("tool listing messages", () => {
  it("routing message points submitters at the tools listing flow", () => {
    const message = toolListingRoutingMessage();
    expect(message).toContain(TOOLS_LISTING_FLOW_URL);
    expect(message.toLowerCase()).toContain("tools");
  });

  it("approval message explains the maintainer-approval requirement", () => {
    const message = toolListingApprovalMessage();
    expect(message).toContain(TOOLS_LISTING_FLOW_URL);
    expect(message.toLowerCase()).toContain("approval");
    expect(message.toLowerCase()).toContain("maintainer");
  });
});

describe("toolListingSignals field body composition", () => {
  it("searches card description aliases and tag text", () => {
    expect(
      toolListingSignals(
        {
          cardDescription: "desktop application",
          tags: "saas workspace",
        },
        "",
      ),
    ).toEqual(expect.arrayContaining(["desktop_app", "saas", "service"]));
  });

  it("searches documentation URL aliases without treating them as website_url", () => {
    expect(
      toolListingSignals(
        {
          documentationUrl: "https://example.com/docs",
        },
        "",
      ),
    ).toEqual([]);
  });

  it("combines free text with structured pricing and website fields", () => {
    const signals = toolListingSignals(
      {
        website_url: "https://example.com",
        pricing_model: "subscription",
      },
      "featured placement on the homepage",
    );

    expect(signals).toEqual(
      expect.arrayContaining([
        "website_url",
        "pricing_model",
        "placement",
        "subscription",
      ]),
    );
  });
});

describe("looksLikeToolAppListing threshold behavior", () => {
  it("is false with only one soft structured signal", () => {
    expect(
      looksLikeToolAppListing({ websiteUrl: "https://example.com" }, ""),
    ).toBe(false);
  });

  it("is true with one hard signal from text alone", () => {
    expect(looksLikeToolAppListing({}, "commercial software product")).toBe(
      true,
    );
  });

  it("is true with two soft structured signals and no hard text", () => {
    expect(
      looksLikeToolAppListing(
        {
          websiteUrl: "https://example.com",
          pricingModel: "free",
        },
        "",
      ),
    ).toBe(true);
  });
});

describe("looksLikeMcpServerSubmission edge cases", () => {
  it("is false when MCP appears without server context words", () => {
    expect(looksLikeMcpServerSubmission({}, "MCP is a protocol")).toBe(false);
  });

  it("matches MCP hints from card_description and usage_snippet aliases", () => {
    expect(
      looksLikeMcpServerSubmission(
        {
          card_description: "stdio MCP transport",
          usage_snippet: "claude mcp add demo",
        },
        "",
      ),
    ).toBe(true);
  });
});

describe("missingToolListingReviewFields alias coverage", () => {
  it("accepts camelCase aliases for every review field", () => {
    expect(
      missingToolListingReviewFields({
        websiteUrl: "https://example.com",
        documentationUrl: "https://example.com/docs",
        pricingModel: "free",
        disclosure: "none",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "macOS, Windows",
      }),
    ).toEqual([]);
  });

  it("reports missing documentation from absent docs aliases", () => {
    expect(
      missingToolListingReviewFields({
        websiteUrl: "https://example.com",
        docs_url: "",
      }),
    ).toContain("documentationUrl");
  });
});

describe("toolListingSignals combined commercial scenarios", () => {
  it("detects a full commercial SaaS listing from mixed fields and text", () => {
    const signals = toolListingSignals(
      {
        websiteUrl: "https://example.com",
        pricingModel: "subscription",
        disclosure: "paid partnership",
        description:
          "A hosted platform with SaaS pricing and a dashboard and free trial",
      },
      "featured placement available",
    );

    expect(signals).toEqual(
      expect.arrayContaining([
        "website_url",
        "pricing_model",
        "disclosure",
        "hosted_app",
        "saas",
        "service",
        "subscription",
        "placement",
      ]),
    );
  });

  it("detects mobile and desktop combinations from long-form copy", () => {
    expect(
      toolListingSignals(
        {},
        "Our desktop application and mobile app share one hosted platform.",
      ),
    ).toEqual(
      expect.arrayContaining([
        "desktop_app",
        "mobile_app",
        "hosted_app",
        "service",
      ]),
    );
  });

  it("detects runtime and product positioning together", () => {
    expect(
      toolListingSignals(
        {},
        "A local ai agent runtime packaged as a commercial product.",
      ),
    ).toEqual(expect.arrayContaining(["runtime_app", "product"]));
  });
});

describe("looksLikeMcpServerSubmission transport vocabulary", () => {
  it("matches each MCP server noun variant", () => {
    for (const noun of [
      "server",
      "endpoint",
      "tool",
      "transport",
      "config",
      "configuration",
    ]) {
      expect(
        looksLikeMcpServerSubmission({}, `stdio MCP ${noun} for files`),
        noun,
      ).toBe(true);
    }
  });
});

describe("tool listing messages stability", () => {
  it("returns stable routing copy across calls", () => {
    expect(toolListingRoutingMessage()).toBe(toolListingRoutingMessage());
  });

  it("returns stable approval copy across calls", () => {
    expect(toolListingApprovalMessage()).toBe(toolListingApprovalMessage());
  });
});
