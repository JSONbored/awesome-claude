import { describe, expect, it } from "vitest";

import {
  absoluteSiteUrl,
  uniqueValues,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  buildSearchActionJsonLd,
  buildWebPageJsonLd,
  buildCollectionPageJsonLd,
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildEntryJsonLd,
  buildToolSoftwareApplicationJsonLd,
  buildJobPostingJsonLd,
  buildJobPostingDescription,
  cleanJobDescriptionText,
  jobBenefitsFromJob,
  parseJobCompensation,
  buildEntryJsonLdSnapshot,
} from "../packages/registry/src/seo-lib.js";

const SITE = "https://heyclau.de";

function validJob(overrides: Record<string, unknown> = {}) {
  return {
    slug: "eng-role",
    title: "Engineer",
    company: "Acme",
    companyUrl: "https://acme.example",
    description: "S".repeat(120),
    descriptionMd: "D".repeat(240),
    responsibilities: ["Ship features", "Review code"],
    requirements: ["TypeScript", "Node.js"],
    benefits: ["Health", "Equity"],
    compensation: "$100k-$140k",
    equity: "0.1%",
    bonus: "10%",
    type: "FULL_TIME",
    postedAt: "2026-05-01",
    expiresAt: "2026-07-01",
    applyUrl: "https://jobs.example/apply",
    sourceUrl: "https://jobs.example/source",
    sourceCheckedAt: "2026-05-20",
    status: "active",
    location: "San Francisco",
    isRemote: false,
    isWorldwide: false,
    ...overrides,
  };
}

describe("absoluteSiteUrl / uniqueValues", () => {
  it("resolves absolute urls and defaults the path", () => {
    expect(absoluteSiteUrl(SITE, "/browse")).toBe("https://heyclau.de/browse");
    expect(absoluteSiteUrl(SITE)).toBe("https://heyclau.de/");
    expect(absoluteSiteUrl(SITE, "")).toBe("https://heyclau.de/");
  });

  it("deduplicates truthy values", () => {
    expect(uniqueValues(["a", "", "a", "b", null, "b"])).toEqual(["a", "b"]);
    expect(uniqueValues()).toEqual([]);
  });
});

describe("site-level JSON-LD", () => {
  it("builds organization markup with optional logo and sameAs links", () => {
    const withLogo = buildOrganizationJsonLd({
      siteUrl: SITE,
      logo: "/logo.png",
      githubUrl: "https://github.com/JSONbored/awesome-claude",
      twitterUrl: "https://twitter.com/heyclaude",
      discordUrl: "",
    });
    expect(withLogo.logo).toEqual({
      "@type": "ImageObject",
      url: "https://heyclau.de/logo.png",
    });
    expect(withLogo.sameAs).toEqual([
      "https://github.com/JSONbored/awesome-claude",
      "https://twitter.com/heyclaude",
    ]);

    const bare = buildOrganizationJsonLd();
    expect(bare.name).toBe("HeyClaude");
    expect(bare.logo).toBeUndefined();
    expect(bare.sameAs).toEqual([]);
  });

  it("builds website and search-action markup", () => {
    const website = buildWebsiteJsonLd({
      siteUrl: `${SITE}/`,
      description: "Custom description",
    });
    expect(website["@type"]).toBe("WebSite");
    expect(website.description).toBe("Custom description");
    expect(website.potentialAction.target.urlTemplate).toContain(
      "/browse?q={search_term_string}",
    );

    const defaults = buildWebsiteJsonLd();
    expect(defaults.name).toBe("HeyClaude");
    expect(defaults.description).toContain("directory");

    const search = buildSearchActionJsonLd();
    expect(search["@type"]).toBe("SearchAction");
    expect(search["query-input"]).toBe("required name=search_term_string");
  });

  it("builds webpage and collection-page markup", () => {
    const page = buildWebPageJsonLd({
      siteUrl: SITE,
      path: "/browse",
      name: "Browse",
      description: "Browse entries",
      breadcrumbId: "https://heyclau.de/browse#breadcrumb",
    });
    expect(page["@type"]).toBe("WebPage");
    expect(page.breadcrumb).toEqual({
      "@id": "https://heyclau.de/browse#breadcrumb",
    });

    const noCrumb = buildWebPageJsonLd({ siteUrl: SITE, name: "Home" });
    expect(noCrumb.breadcrumb).toBeUndefined();
    expect(noCrumb["@type"]).toBe("WebPage");

    const collection = buildCollectionPageJsonLd({
      siteUrl: SITE,
      path: "/browse",
      name: "Browse",
    });
    expect(collection["@type"]).toBe("CollectionPage");
  });

  it("builds breadcrumb and item-list markup", () => {
    const breadcrumb = buildBreadcrumbJsonLd([
      { name: "Home", url: SITE },
      { name: "Browse", url: `${SITE}/browse` },
    ]);
    expect(breadcrumb["@id"]).toBe("https://heyclau.de/browse#breadcrumb");
    expect(breadcrumb.itemListElement).toHaveLength(2);
    expect(breadcrumb.itemListElement[0].position).toBe(1);

    expect(buildBreadcrumbJsonLd([])["@id"]).toBeUndefined();

    const list = buildItemListJsonLd(
      [
        { url: `${SITE}/a`, name: "A" },
        { url: `${SITE}/b`, title: "B" },
      ],
      { name: "List", description: "Items" },
    );
    expect(list.numberOfItems).toBe(2);
    expect(list.itemListElement[1].name).toBe("B");
    expect(buildItemListJsonLd().numberOfItems).toBe(0);
  });
});

describe("buildEntryJsonLd", () => {
  it("classifies guides as TechArticle", () => {
    const doc = buildEntryJsonLd({
      category: "guides",
      slug: "intro",
      title: "Intro",
      description: "Guide body",
      dateAdded: "2026-01-01",
    });
    expect(doc["@type"]).toBe("TechArticle");
    expect(doc.codeRepository).toBeUndefined();
  });

  it("classifies code-like categories as SoftwareSourceCode", () => {
    for (const category of ["commands", "hooks", "mcp", "statuslines"]) {
      const doc = buildEntryJsonLd({
        category,
        slug: "tool",
        title: "Tool",
        description: "Desc",
        dateAdded: "2026-01-01",
        repoUrl: "https://github.com/a/b",
        scriptLanguage: "bash",
      });
      expect(doc["@type"]).toBe("SoftwareSourceCode");
      expect(doc.codeRepository).toBe("https://github.com/a/b");
      expect(doc.programmingLanguage).toBe("bash");
      expect(doc.runtimePlatform).toBe("Claude Code");
    }
  });

  it("defaults other categories to CreativeWork with organization author", () => {
    const doc = buildEntryJsonLd({
      category: "skills",
      slug: "skill",
      title: "Skill",
      description: "Desc",
      dateAdded: "2026-01-01",
    });
    expect(doc["@type"]).toBe("CreativeWork");
    expect(doc.author).toEqual({
      "@type": "Organization",
      name: "HeyClaude",
      url: SITE,
    });
    expect(doc.isBasedOn).toBeUndefined();
    expect(doc.additionalProperty).toBeUndefined();
  });

  it("includes person author, source urls, and additional properties", () => {
    const doc = buildEntryJsonLd(
      {
        category: "agents",
        slug: "agent",
        title: "Agent",
        seoDescription: "SEO desc",
        description: "Desc",
        dateAdded: "2026-01-01",
        contentUpdatedAt: "2026-02-01",
        author: "Ada",
        authorProfileUrl: "https://ada.example",
        documentationUrl: "https://docs.example",
        repoUrl: "https://github.com/a/b",
        githubUrl: "https://github.com/a/b/blob/main/x.md",
        websiteUrl: "https://example.com",
        keywords: ["one", "one"],
        tags: ["two"],
        downloadSha256: "abc123",
        platformCompatibility: [
          { platform: "claude-code", supportLevel: "full" },
        ],
      },
      { siteName: "Custom" },
    );
    expect(doc.description).toBe("SEO desc");
    expect(doc.dateModified).toBe("2026-02-01");
    expect(doc.author).toEqual({
      "@type": "Person",
      name: "Ada",
      url: "https://ada.example",
    });
    expect(doc.isBasedOn).toEqual([
      "https://docs.example",
      "https://github.com/a/b",
      "https://github.com/a/b/blob/main/x.md",
      "https://example.com",
    ]);
    expect(doc.keywords).toBe("one, two");
    expect(doc.additionalProperty).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Package SHA256", value: "abc123" }),
        expect.objectContaining({
          name: "Platform compatibility",
          value: "claude-code: full",
        }),
      ]),
    );
  });

  it("falls back through dateModified candidates", () => {
    expect(
      buildEntryJsonLd({
        category: "skills",
        slug: "a",
        title: "A",
        description: "d",
        dateAdded: "2026-01-01",
        repoUpdatedAt: "2026-03-01",
      }).dateModified,
    ).toBe("2026-03-01");
    expect(
      buildEntryJsonLd({
        category: "skills",
        slug: "a",
        title: "A",
        description: "d",
        dateAdded: "2026-01-01",
        verifiedAt: "2026-04-01",
      }).dateModified,
    ).toBe("2026-04-01");
  });
});

describe("buildToolSoftwareApplicationJsonLd", () => {
  const tool = {
    slug: "widget",
    title: "Widget",
    description: "A widget",
    websiteUrl: "https://widget.example",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    pricingModel: "free",
    disclosure: "sponsored",
    documentationUrl: "https://docs.widget.example",
    repoUrl: "https://github.com/a/widget",
  };

  it("returns null when required visible fields are missing", () => {
    expect(buildToolSoftwareApplicationJsonLd({})).toBeNull();
    expect(
      buildToolSoftwareApplicationJsonLd({ ...tool, pricingModel: "" }),
    ).toBeNull();
  });

  it("builds free and paid software application markup", () => {
    const free = buildToolSoftwareApplicationJsonLd(tool);
    expect(free?.["@type"]).toBe("SoftwareApplication");
    expect(free?.offers.price).toBe("0");
    expect(free?.offers.priceCurrency).toBe("USD");
    expect(free?.additionalProperty.value).toBe("sponsored");

    const openSource = buildToolSoftwareApplicationJsonLd({
      ...tool,
      pricingModel: "Open-Source",
      seoDescription: "SEO",
    });
    expect(openSource?.description).toBe("SEO");
    expect(openSource?.offers.price).toBe("0");
    expect(openSource?.url).toBe("https://widget.example");

    const paid = buildToolSoftwareApplicationJsonLd({
      ...tool,
      pricingModel: "subscription",
    });
    expect(paid?.offers.price).toBeUndefined();
    expect(paid?.offers.priceCurrency).toBeUndefined();
    expect(paid?.offers.category).toBe("subscription");
  });

  it("defaults application category and operating system", () => {
    const doc = buildToolSoftwareApplicationJsonLd({
      ...tool,
      applicationCategory: "",
      operatingSystem: "",
    });
    // Empty strings are falsy, so hasRequiredVisibleFields fails.
    expect(doc).toBeNull();
  });
});

describe("job description helpers", () => {
  it("cleans markdown-ish job text", () => {
    expect(
      cleanJobDescriptionText(
        "## Title\r\n- item\n**bold** [link](https://x.test)\n\n\nmore",
      ),
    ).toBe("Title\nitem\nbold link\n\nmore");
    expect(cleanJobDescriptionText(null)).toBe("");
  });

  it("joins benefits and builds a full posting description", () => {
    expect(jobBenefitsFromJob({ benefits: [" Health ", "", "Equity"] })).toBe(
      "Health; Equity",
    );
    expect(jobBenefitsFromJob({})).toBe("");

    const description = buildJobPostingDescription(
      validJob({
        description: "Summary",
        descriptionMd: "## Details\n- ship",
        responsibilities: ["**Own** delivery"],
        requirements: ["[TS](https://x.test)"],
        compensation: "$100k",
        equity: "0.1%",
        bonus: "10%",
        benefits: ["Health"],
      }),
    );
    expect(description).toContain("Summary");
    expect(description).toContain("Details");
    expect(description).toContain("Responsibilities: Own delivery");
    expect(description).toContain("Requirements: TS");
    expect(description).toContain("Salary: $100k.");
    expect(description).toContain("Equity: 0.1%.");
    expect(description).toContain("Bonus: 10%.");
    expect(description).toContain("Benefits: Health.");
  });

  it("skips duplicate details and empty optional sections", () => {
    const description = buildJobPostingDescription({
      description: "Same",
      descriptionMd: "Same",
    });
    expect(description).toBe("Same");
  });
});

describe("parseJobCompensation", () => {
  it("returns undefined for blank, currency-free, or incomplete ranges", () => {
    expect(parseJobCompensation("")).toBeUndefined();
    expect(parseJobCompensation("100-200")).toBeUndefined();
    expect(parseJobCompensation("$100k")).toBeUndefined();
    expect(parseJobCompensation("$bad-$worse")).toBeUndefined();
    expect(parseJobCompensation("$200k-$100k")).toBeUndefined();
  });

  it("parses currency symbols and k suffixes", () => {
    expect(parseJobCompensation("$100k-$140k")).toEqual({
      "@type": "MonetaryAmount",
      currency: "USD",
      value: {
        "@type": "QuantitativeValue",
        minValue: 100000,
        maxValue: 140000,
        unitText: "YEAR",
      },
    });
    expect(parseJobCompensation("€80-€100k").value.minValue).toBe(80000);
    expect(parseJobCompensation("£50k-£60k").currency).toBe("GBP");
  });

  it("infers pay periods from the compensation text", () => {
    expect(parseJobCompensation("$50-$60 per hour").value.unitText).toBe(
      "HOUR",
    );
    expect(parseJobCompensation("$400-$500 daily").value.unitText).toBe("DAY");
    expect(parseJobCompensation("$1,000-$2,000 per week").value.unitText).toBe(
      "WEEK",
    );
    expect(parseJobCompensation("$5k-$6k monthly").value.unitText).toBe(
      "MONTH",
    );
    expect(parseJobCompensation("$100k-$120k / yr").value.unitText).toBe(
      "YEAR",
    );
  });
});

describe("buildJobPostingJsonLd", () => {
  it("returns null for incomplete or non-active jobs", () => {
    expect(buildJobPostingJsonLd(null)).toBeNull();
    expect(buildJobPostingJsonLd({})).toBeNull();
    expect(buildJobPostingJsonLd(validJob({ status: "closed" }))).toBeNull();
    expect(buildJobPostingJsonLd(validJob({ status: "draft" }))).toBeNull();
  });

  it("returns null when public exposure validation fails", () => {
    expect(
      buildJobPostingJsonLd(
        validJob({
          description: "short",
          descriptionMd: "",
          responsibilities: [],
          requirements: [],
        }),
      ),
    ).toBeNull();
  });

  it("builds a remote worldwide job posting", () => {
    const doc = buildJobPostingJsonLd(
      validJob({
        isRemote: true,
        isWorldwide: true,
        benefits: [],
        compensation: "",
      }),
    );
    expect(doc?.["@type"]).toBe("JobPosting");
    expect(doc?.jobLocationType).toBe("TELECOMMUTE");
    expect(doc?.applicantLocationRequirements).toBeUndefined();
    expect(doc?.jobLocation).toBeUndefined();
    expect(doc?.baseSalary).toBeUndefined();
    expect(doc?.jobBenefits).toBeUndefined();
  });

  it("builds an onsite job posting with salary and benefits", () => {
    const doc = buildJobPostingJsonLd(validJob());
    expect(doc?.hiringOrganization).toEqual({
      "@type": "Organization",
      name: "Acme",
      sameAs: "https://acme.example",
    });
    expect(doc?.jobLocationType).toBeUndefined();
    expect(doc?.applicantLocationRequirements).toEqual({
      "@type": "Country",
      name: "San Francisco",
    });
    expect(doc?.jobLocation).toEqual({
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "San Francisco",
      },
    });
    expect(doc?.baseSalary?.value.minValue).toBe(100000);
    expect(doc?.jobBenefits).toBe("Health; Equity");
  });

  it("defaults status to active and location to United States", () => {
    const doc = buildJobPostingJsonLd(
      validJob({ status: undefined, location: "", isRemote: false }),
    );
    expect(doc?.applicantLocationRequirements).toEqual({
      "@type": "Country",
      name: "United States",
    });
  });
});

describe("buildEntryJsonLdSnapshot", () => {
  it("assembles breadcrumb, webpage, and entry documents", () => {
    const snapshot = buildEntryJsonLdSnapshot({
      category: "mcp",
      slug: "server",
      title: "Server",
      seoDescription: "SEO",
      description: "Desc",
      dateAdded: "2026-01-01",
    });
    expect(snapshot.key).toBe("mcp:server");
    expect(snapshot.documents).toHaveLength(3);
    expect(snapshot.documents[0]["@type"]).toBe("BreadcrumbList");
    expect(snapshot.documents[1]["@type"]).toBe("WebPage");
    expect(snapshot.documents[1].breadcrumb["@id"]).toContain("#breadcrumb");
    expect(snapshot.documents[2]["@type"]).toBe("SoftwareSourceCode");
  });

  it("falls back to the category id when no label exists", () => {
    const snapshot = buildEntryJsonLdSnapshot({
      category: "not-a-real-category",
      slug: "x",
      title: "X",
      description: "d",
      dateAdded: "2026-01-01",
    });
    expect(snapshot.documents[0].itemListElement[1].name).toBe(
      "not-a-real-category",
    );
  });
});

describe("public wrapper re-exports", () => {
  it("keeps the seo.js surface identical to the lib", async () => {
    const wrapper = await import("../packages/registry/src/seo.js");
    expect(wrapper.buildEntryJsonLd).toBe(buildEntryJsonLd);
    expect(wrapper.buildJobPostingJsonLd).toBe(buildJobPostingJsonLd);
    expect(wrapper.buildEntryJsonLdSnapshot).toBe(buildEntryJsonLdSnapshot);
    expect(wrapper.absoluteSiteUrl).toBe(absoluteSiteUrl);
  });
});
