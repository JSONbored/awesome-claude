import { afterEach, describe, expect, it, vi } from "vitest";

import {
  BRAND_ASSET_SOURCES,
  KNOWN_BRANDS,
  HOSTING_DOMAINS,
  clean,
  normalizedText,
  textContainsAlias,
  normalizeBrandDomain,
  domainFromUrl,
  isHostingOrRegistryDomain,
  knownBrandTextCandidates,
  knownBrandMatchesDomain,
  shouldAutoResolveBrandAsset,
  normalizeBrandColors,
  isAllowedBrandAssetUrl,
  brandfetchClientId,
  brandfetchLogoUrl,
  brandAssetProxyUrl,
  detectKnownBrand,
  buildBrandAssetMetadata,
} from "../packages/registry/src/brand-assets-lib.js";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("constants", () => {
  it("exposes brand sources, known brands, and hosting domains", () => {
    expect(BRAND_ASSET_SOURCES).toEqual([
      "brandfetch",
      "manual",
      "website",
      "github",
      "none",
    ]);
    expect(KNOWN_BRANDS.length).toBeGreaterThan(50);
    expect(KNOWN_BRANDS.some((brand) => brand.name === "Zapier")).toBe(true);
    expect(HOSTING_DOMAINS.has("github.com")).toBe(true);
    expect(HOSTING_DOMAINS.has("modelcontextprotocol.io")).toBe(true);
  });
});

describe("text helpers", () => {
  it("cleans and normalizes text", () => {
    expect(clean("  hi ")).toBe("hi");
    expect(clean(null)).toBe("");
    expect(clean(undefined)).toBe("");
    expect(normalizedText("GitHub Copilot!")).toBe("github copilot");
    expect(normalizedText("  A   B  ")).toBe("a b");
  });

  it("matches aliases as whole tokens", () => {
    expect(textContainsAlias("GitHub Copilot Advisor", "copilot")).toBe(true);
    expect(textContainsAlias("Copilot", "github copilot")).toBe(false);
    expect(textContainsAlias("", "copilot")).toBe(false);
    expect(textContainsAlias("Copilot", "")).toBe(false);
    expect(textContainsAlias("Zapier AI Workflow", "zapier ai")).toBe(true);
  });
});

describe("domain helpers", () => {
  it("normalizes domains and rejects invalid hostnames", () => {
    expect(normalizeBrandDomain("www.Example.COM/path")).toBe("example.com");
    expect(normalizeBrandDomain("https://docs.example.com")).toBe(
      "docs.example.com",
    );
    expect(normalizeBrandDomain("example.com")).toBe("example.com");
    expect(normalizeBrandDomain("https://bad..example.com")).toBe("");
    expect(normalizeBrandDomain("localhost")).toBe("");
    expect(normalizeBrandDomain("%")).toBe("");
    expect(normalizeBrandDomain("")).toBe("");
    expect(normalizeBrandDomain("not a domain")).toBe("");
  });

  it("extracts domains from urls", () => {
    expect(domainFromUrl("https://www.Example.com/path")).toBe("example.com");
    expect(domainFromUrl("not a url")).toBe("");
    expect(domainFromUrl("")).toBe("");
  });

  it("detects hosting and registry domains including subdomains", () => {
    expect(isHostingOrRegistryDomain("github.com")).toBe(true);
    expect(isHostingOrRegistryDomain("docs.github.com")).toBe(true);
    expect(isHostingOrRegistryDomain("www.npmjs.com")).toBe(true);
    expect(isHostingOrRegistryDomain("example.com")).toBe(false);
    expect(isHostingOrRegistryDomain("%")).toBe(false);
  });
});

describe("known-brand matching", () => {
  it("collects brand text candidates from name, title, and tags", () => {
    expect(
      knownBrandTextCandidates({
        brandName: " Zapier ",
        title: "Workflow",
        tags: ["automation", ""],
      }),
    ).toEqual(["Zapier", "Workflow", "automation"]);
    expect(knownBrandTextCandidates({})).toEqual([]);
    expect(knownBrandTextCandidates({ tags: "nope" })).toEqual([]);
  });

  it("matches known brands only when text and domain align", () => {
    expect(
      knownBrandMatchesDomain(
        { title: "GitHub Copilot Advisor", tags: ["github"] },
        "github.com",
      ),
    ).toBe(true);
    expect(
      knownBrandMatchesDomain({ title: "Community MCP" }, "github.com"),
    ).toBe(false);
    expect(knownBrandMatchesDomain({ title: "Zapier" }, "")).toBe(false);
    expect(knownBrandMatchesDomain({}, "zapier.com")).toBe(false);
  });

  it("auto-resolves non-hosting domains and known hosting brands", () => {
    expect(shouldAutoResolveBrandAsset("example.com")).toBe(true);
    expect(shouldAutoResolveBrandAsset("%")).toBe(false);
    expect(shouldAutoResolveBrandAsset("github.com", {})).toBe(false);
    expect(
      shouldAutoResolveBrandAsset("github.com", { title: "Community MCP" }),
    ).toBe(false);
    expect(
      shouldAutoResolveBrandAsset("github.com", {
        title: "Copilot Advisor",
        tags: ["github"],
      }),
    ).toBe(true);
  });
});

describe("colors and asset urls", () => {
  it("normalizes brand colors", () => {
    expect(normalizeBrandColors(["#ABCDEF", "#abcdef", "bad", "#123"])).toEqual(
      ["#abcdef"],
    );
    expect(normalizeBrandColors("nope")).toEqual([]);
    expect(
      normalizeBrandColors([
        "#111111",
        "#222222",
        "#333333",
        "#444444",
        "#555555",
        "#666666",
        "#777777",
      ]),
    ).toHaveLength(6);
  });

  it("allows only safe relative and brandfetch/heyclaude urls", () => {
    expect(isAllowedBrandAssetUrl("")).toBe(true);
    expect(isAllowedBrandAssetUrl("/api/brand-assets/icon/asana.com")).toBe(
      true,
    );
    expect(isAllowedBrandAssetUrl("/bad path")).toBe(false);
    expect(isAllowedBrandAssetUrl("//tracker.example/pixel.png")).toBe(false);
    expect(isAllowedBrandAssetUrl("http://cdn.brandfetch.io/logo.png")).toBe(
      false,
    );
    expect(
      isAllowedBrandAssetUrl("https://cdn.brandfetch.io/domain/x/icon.png"),
    ).toBe(true);
    expect(
      isAllowedBrandAssetUrl("https://asset.brandfetch.io/example/logo.png"),
    ).toBe(true);
    expect(isAllowedBrandAssetUrl("https://heyclau.de/logo.png")).toBe(true);
    expect(isAllowedBrandAssetUrl("https://evil.example/icon.png")).toBe(false);
    expect(isAllowedBrandAssetUrl("not a url")).toBe(false);
  });
});

describe("brandfetch and proxy urls", () => {
  it("reads client ids from params and environment", () => {
    expect(brandfetchClientId({ clientId: " explicit-client " })).toBe(
      "explicit-client",
    );

    vi.stubEnv("BRANDFETCH_CLIENT_ID", "env-client");
    expect(brandfetchClientId()).toBe("env-client");

    vi.stubEnv("BRANDFETCH_CLIENT_ID", "");
    vi.stubEnv("NEXT_PUBLIC_BRANDFETCH_CLIENT_ID", "next-client");
    expect(brandfetchClientId()).toBe("next-client");

    vi.stubEnv("NEXT_PUBLIC_BRANDFETCH_CLIENT_ID", "");
    expect(brandfetchClientId()).toBe("");
  });

  it("builds brandfetch logo urls with clamped dimensions and themes", () => {
    expect(brandfetchLogoUrl("", { clientId: "client" })).toBe("");
    expect(brandfetchLogoUrl("Example.com", { clientId: "" })).toBe("");
    expect(brandfetchLogoUrl("Example.com", { clientId: "client" })).toContain(
      "/w/128/h/128/icon.png",
    );

    const logoUrl = brandfetchLogoUrl("Example.com", {
      clientId: "client",
      width: 999,
      height: 1,
      type: "symbol",
      theme: "dark",
    });
    expect(logoUrl).toContain("/w/512/h/16/theme/dark/symbol.png");
    expect(logoUrl).toContain("c=client");

    const lightLogo = brandfetchLogoUrl("Example.com", {
      clientId: "client",
      width: "bad",
      height: "bad",
      type: "nope",
      theme: "nope",
    });
    expect(lightLogo).toContain("/w/128/h/128/icon.png");
    expect(lightLogo).not.toContain("/theme/");
  });

  it("builds relative and absolute proxy urls", () => {
    expect(brandAssetProxyUrl("Example.com", { kind: "logo" })).toBe(
      "/api/brand-assets/logo/example.com",
    );
    expect(
      brandAssetProxyUrl("Example.com", {
        kind: "icon",
        siteUrl: "https://heyclau.de/base/",
      }),
    ).toBe("https://heyclau.de/api/brand-assets/icon/example.com");
    expect(
      brandAssetProxyUrl("Example.com", {
        kind: "icon",
        baseUrl: "https://heyclau.de",
      }),
    ).toBe("https://heyclau.de/api/brand-assets/icon/example.com");
    expect(brandAssetProxyUrl("%", { kind: "icon" })).toBe("");
    expect(brandAssetProxyUrl("Example.com", { kind: "other" })).toBe(
      "/api/brand-assets/icon/example.com",
    );
  });
});

describe("detectKnownBrand", () => {
  it("prefers explicit brand domains", () => {
    expect(
      detectKnownBrand({
        brandDomain: "www.CustomBrand.com",
        brandName: "Custom",
      }),
    ).toMatchObject({
      name: "Custom",
      domain: "custombrand.com",
      source: "explicit",
    });
  });

  it("matches known brands from title aliases, longest first", () => {
    expect(detectKnownBrand({ title: "" })).toBeNull();
    expect(detectKnownBrand({ title: "Plain Workflow" })).toBeNull();
    expect(detectKnownBrand({ title: "Zapier AI Workflow" })).toMatchObject({
      name: "Zapier",
      domain: "zapier.com",
      source: "known-brand",
      alias: "zapier ai",
    });
    expect(detectKnownBrand({ title: "GitHub Copilot Advisor" })).toMatchObject(
      {
        name: "GitHub Copilot",
        domain: "github.com",
        alias: "github copilot",
      },
    );
  });

  it("matches known brands from tags when the title does not", () => {
    expect(
      detectKnownBrand({ title: "Workflow Pack", tags: ["zapier"] }),
    ).toMatchObject({
      name: "Zapier",
      domain: "zapier.com",
      alias: "zapier",
    });
    expect(
      detectKnownBrand({ title: "Workflow Pack", tags: "not-an-array" }),
    ).toBeNull();
  });
});

describe("buildBrandAssetMetadata", () => {
  it("returns empty metadata for plain entries", () => {
    expect(buildBrandAssetMetadata({ title: "Plain Workflow" })).toEqual({
      brandName: undefined,
      brandDomain: undefined,
      brandIconUrl: undefined,
      brandLogoUrl: undefined,
      brandAssetSource: undefined,
      brandVerifiedAt: undefined,
      brandColors: undefined,
    });
  });

  it("resolves known brands and sanitizes unsafe asset urls", () => {
    expect(
      buildBrandAssetMetadata(
        {
          title: "Zapier Workflow",
          tags: ["automation"],
          brandIconUrl: "https://evil.example/icon.png",
          brandLogoUrl: "https://heyclau.de/logo.png",
          brandAssetSource: "unknown",
          brandColors: ["#123456", "#123456", "#bad"],
          verifiedAt: "2026-01-01",
        },
        { allowAliasFallback: true },
      ),
    ).toMatchObject({
      brandName: "Zapier",
      brandDomain: "zapier.com",
      brandIconUrl: undefined,
      brandLogoUrl: "https://heyclau.de/logo.png",
      brandAssetSource: undefined,
      brandVerifiedAt: "2026-01-01",
      brandColors: ["#123456"],
    });
  });

  it("auto-resolves brandfetch icons for known brands", () => {
    expect(
      buildBrandAssetMetadata(
        { title: "Zapier Workflow", tags: ["zapier"] },
        { allowAliasFallback: true },
      ),
    ).toMatchObject({
      brandIconUrl: "/api/brand-assets/icon/zapier.com",
      brandAssetSource: "brandfetch",
    });
  });

  it("does not auto-resolve hosting domains without a known brand match", () => {
    expect(
      buildBrandAssetMetadata({
        title: "Community MCP Server",
        brandDomain: "github.com",
      }),
    ).toMatchObject({
      brandName: "Community MCP Server",
      brandDomain: "github.com",
      brandIconUrl: undefined,
      brandAssetSource: undefined,
    });
  });

  it("rejects unsafe brandfetch assets and clears the source", () => {
    expect(
      buildBrandAssetMetadata({
        title: "Rejected Brand Asset",
        brandDomain: "example.com",
        brandIconUrl: "//tracker.example/pixel.png",
        brandLogoUrl: "javascript:alert(1)",
        brandAssetSource: "brandfetch",
      }),
    ).toMatchObject({
      brandDomain: "example.com",
      brandIconUrl: undefined,
      brandLogoUrl: undefined,
      brandAssetSource: undefined,
    });
  });

  it("auto-resolves known hosting brands like GitHub Copilot", () => {
    expect(
      buildBrandAssetMetadata({
        title: "GitHub Copilot Advisor",
        brandDomain: "github.com",
      }),
    ).toMatchObject({
      brandDomain: "github.com",
      brandIconUrl: "/api/brand-assets/icon/github.com",
      brandAssetSource: "brandfetch",
    });
  });

  it("keeps manual and none sources when assets are safe", () => {
    expect(
      buildBrandAssetMetadata({
        title: "Reviewed Manual Brand",
        brandDomain: "example.com",
        brandIconUrl: "https://cdn.brandfetch.io/domain/example.com/icon.png",
        brandLogoUrl: "https://asset.brandfetch.io/example/logo.png",
        brandAssetSource: "manual",
      }),
    ).toMatchObject({
      brandDomain: "example.com",
      brandIconUrl: "https://cdn.brandfetch.io/domain/example.com/icon.png",
      brandLogoUrl: "https://asset.brandfetch.io/example/logo.png",
      brandAssetSource: "manual",
    });

    expect(
      buildBrandAssetMetadata({
        title: "Hidden Brand",
        brandDomain: "example.com",
        brandIconUrl: "/api/brand-assets/icon/example.com",
        brandAssetSource: "none",
      }),
    ).toMatchObject({
      brandDomain: "example.com",
      brandIconUrl: "/api/brand-assets/icon/example.com",
      brandAssetSource: "none",
    });
  });

  it("uses website fallback domains when enabled", () => {
    expect(
      buildBrandAssetMetadata(
        {
          title: "Activepieces Workflow Tool",
          websiteUrl: "https://activepieces.com/docs",
        },
        { allowWebsiteFallback: true },
      ),
    ).toMatchObject({
      brandDomain: "activepieces.com",
      brandIconUrl: "/api/brand-assets/icon/activepieces.com",
      brandAssetSource: "brandfetch",
    });

    expect(
      buildBrandAssetMetadata({
        title: "Activepieces Workflow Tool",
        websiteUrl: "https://activepieces.com/docs",
      }),
    ).toMatchObject({
      brandDomain: undefined,
      brandIconUrl: undefined,
    });
  });

  it("uses explicit brand names and verified timestamps", () => {
    expect(
      buildBrandAssetMetadata({
        brandName: "Custom",
        brandDomain: "custom.example",
        brandAssetSource: "website",
        brandVerifiedAt: "2026-02-01",
        brandColors: ["#abcdef"],
      }),
    ).toMatchObject({
      brandName: "Custom",
      brandDomain: "custom.example",
      brandAssetSource: "website",
      brandVerifiedAt: "2026-02-01",
      brandColors: ["#abcdef"],
    });
  });

  it("builds absolute proxy icons when an asset base url is provided", () => {
    expect(
      buildBrandAssetMetadata(
        {
          title: "Zapier Workflow",
          brandDomain: "zapier.com",
          brandAssetSource: "brandfetch",
        },
        { assetBaseUrl: "https://heyclau.de" },
      ),
    ).toMatchObject({
      brandIconUrl: "https://heyclau.de/api/brand-assets/icon/zapier.com",
      brandAssetSource: "brandfetch",
    });
  });

  it("does not run alias detection when allowAliasFallback is false", () => {
    expect(
      buildBrandAssetMetadata(
        { title: "Zapier Workflow", tags: ["zapier"] },
        { allowAliasFallback: false },
      ),
    ).toEqual({
      brandName: undefined,
      brandDomain: undefined,
      brandIconUrl: undefined,
      brandLogoUrl: undefined,
      brandAssetSource: undefined,
      brandVerifiedAt: undefined,
      brandColors: undefined,
    });
  });
});

describe("public wrapper re-exports", () => {
  it("keeps the brand-assets.js surface identical to the lib", async () => {
    const wrapper = await import("../packages/registry/src/brand-assets.js");
    expect(wrapper.buildBrandAssetMetadata).toBe(buildBrandAssetMetadata);
    expect(wrapper.detectKnownBrand).toBe(detectKnownBrand);
    expect(wrapper.normalizeBrandDomain).toBe(normalizeBrandDomain);
    expect(wrapper.KNOWN_BRANDS).toBe(KNOWN_BRANDS);
    expect(wrapper.BRAND_ASSET_SOURCES).toEqual(BRAND_ASSET_SOURCES);
  });
});
