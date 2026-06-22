import { describe, expect, it, vi } from "vitest";

import {
  brandAssetProxyUrl,
  brandfetchClientId,
  brandfetchLogoUrl,
  buildBrandAssetMetadata,
  detectKnownBrand,
  domainFromUrl,
  isAllowedBrandAssetUrl,
  isHostingOrRegistryDomain,
  normalizeBrandColors,
  normalizeBrandDomain,
  shouldAutoResolveBrandAsset,
} from "@heyclaude/registry/brand-assets";

describe("brand asset helpers", () => {
  it("normalizes domains, hosting providers, colors, and asset URLs defensively", () => {
    expect(normalizeBrandDomain("www.Example.COM/path")).toBe("example.com");
    expect(normalizeBrandDomain("https://bad..example.com")).toBe("");
    expect(normalizeBrandDomain("localhost")).toBe("");
    expect(normalizeBrandDomain("%")).toBe("");
    expect(domainFromUrl("not a url")).toBe("");
    expect(isHostingOrRegistryDomain("docs.github.com")).toBe(true);
    expect(isHostingOrRegistryDomain("example.com")).toBe(false);
    expect(normalizeBrandColors(["#ABCDEF", "#abcdef", "bad"])).toEqual([
      "#abcdef",
    ]);
    expect(isAllowedBrandAssetUrl("")).toBe(true);
    expect(isAllowedBrandAssetUrl("/api/brand-assets/icon/asana.com")).toBe(
      true,
    );
    expect(isAllowedBrandAssetUrl("/bad path")).toBe(false);
    expect(isAllowedBrandAssetUrl("//tracker.example/pixel.png")).toBe(false);
    expect(isAllowedBrandAssetUrl("http://cdn.brandfetch.io/logo.png")).toBe(
      false,
    );
    expect(isAllowedBrandAssetUrl("not a url")).toBe(false);
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

  it("builds Brandfetch and proxy URLs from explicit and environment client IDs", () => {
    vi.stubEnv("BRANDFETCH_CLIENT_ID", "env-client");

    try {
      expect(brandfetchClientId({ clientId: " explicit-client " })).toBe(
        "explicit-client",
      );
      expect(brandfetchClientId()).toBe("env-client");
      expect(brandfetchLogoUrl("", { clientId: "client" })).toBe("");
      expect(
        brandfetchLogoUrl("Example.com", { clientId: "client" }),
      ).toContain("/w/128/h/128/icon.png");
      const logoUrl = brandfetchLogoUrl("Example.com", {
        clientId: "client",
        width: 999,
        height: 1,
        type: "symbol",
        theme: "dark",
      });
      expect(logoUrl).toContain("/w/512/h/16/theme/dark/symbol.png");
      expect(logoUrl).toContain("c=client");
      expect(brandAssetProxyUrl("Example.com", { kind: "logo" })).toBe(
        "/api/brand-assets/logo/example.com",
      );
      expect(
        brandAssetProxyUrl("Example.com", {
          kind: "icon",
          siteUrl: "https://heyclau.de/base/",
        }),
      ).toBe("https://heyclau.de/api/brand-assets/icon/example.com");
      expect(brandAssetProxyUrl("%", { kind: "icon" })).toBe("");
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("detects explicit, title, and tag-based brands while sanitizing metadata", () => {
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
    expect(detectKnownBrand({ title: "" })).toBeNull();
    expect(
      detectKnownBrand({ title: "Workflow Pack", tags: ["zapier"] }),
    ).toMatchObject({
      name: "Zapier",
      domain: "zapier.com",
      alias: "zapier",
    });
    expect(detectKnownBrand({ title: "Plain Workflow" })).toBeNull();

    expect(buildBrandAssetMetadata({ title: "Plain Workflow" })).toEqual({
      brandName: undefined,
      brandDomain: undefined,
      brandIconUrl: undefined,
      brandLogoUrl: undefined,
      brandAssetSource: undefined,
      brandVerifiedAt: undefined,
      brandColors: undefined,
    });

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
    expect(
      buildBrandAssetMetadata(
        { title: "Zapier Workflow", tags: ["zapier"] },
        { allowAliasFallback: true },
      ),
    ).toMatchObject({
      brandIconUrl: "/api/brand-assets/icon/zapier.com",
      brandAssetSource: "brandfetch",
    });
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
  });
});
