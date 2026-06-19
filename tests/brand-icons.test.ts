import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { EntryBrandMark } from "@/components/entry-brand-mark";
import {
  brandDisplayName,
  brandIconSourceLooksBrandfetch,
  brandIdentityLabel,
  displayableBrandIconUrl,
  hasDisplayableBrandIcon,
  type BrandIconTarget,
} from "@/lib/brand-icons";

const slackTarget: BrandIconTarget = {
  title: "Claude Slack Delegation Triage Agent",
  brandName: "Slack",
  brandDomain: "slack.com",
  brandIconUrl: "/api/brand-assets/icon/slack.com",
  brandAssetSource: "brandfetch",
  tags: ["slack"],
};

describe("brand icon display helpers", () => {
  it("recognizes Brandfetch-backed asset sources", () => {
    expect(brandIconSourceLooksBrandfetch("")).toBe(false);
    expect(
      brandIconSourceLooksBrandfetch("/api/brand-assets/icon/slack.com"),
    ).toBe(true);
    expect(
      brandIconSourceLooksBrandfetch(
        "https://cdn.brandfetch.io/domain/slack.com/icon.png",
      ),
    ).toBe(true);
    expect(
      brandIconSourceLooksBrandfetch(
        "https://heyclau.de/api/brand-assets/icon/slack.com",
      ),
    ).toBe(true);
    expect(brandIconSourceLooksBrandfetch("/logos/slack.svg")).toBe(false);
    expect(brandIconSourceLooksBrandfetch("%")).toBe(false);
  });

  it("only displays auto-resolved hosting icons for matching known brands", () => {
    expect(hasDisplayableBrandIcon(null)).toBe(false);
    expect(hasDisplayableBrandIcon({ title: "Slack" })).toBe(false);
    expect(
      hasDisplayableBrandIcon({
        title: "Slack Agent",
        brandName: "Slack",
        brandIconUrl: "/api/brand-assets/icon/slack.com",
        brandAssetSource: "brandfetch",
      }),
    ).toBe(false);
    expect(
      hasDisplayableBrandIcon({
        title: "Community MCP Server",
        brandName: "Community MCP Server",
        brandDomain: "github.com",
        brandIconUrl: "/api/brand-assets/icon/github.com",
        brandAssetSource: "brandfetch",
      }),
    ).toBe(false);

    expect(
      hasDisplayableBrandIcon({
        title: "GitHub Copilot Advisor",
        brandName: "GitHub Copilot",
        brandDomain: "github.com",
        brandIconUrl: "/api/brand-assets/icon/github.com",
        brandAssetSource: "brandfetch",
      }),
    ).toBe(true);
    expect(
      hasDisplayableBrandIcon({
        title: "Slack Agent",
        brandName: "Slack",
        brandDomain: "slack.com",
        brandIconUrl: "/api/brand-assets/icon/slack.com",
      }),
    ).toBe(true);
  });

  it("keeps reviewed manual icons displayable even on hosting domains", () => {
    const manualIcon = {
      title: "Repository Contributor Agent",
      brandName: "Repository Contributor",
      brandDomain: "github.com",
      brandIconUrl: "/assets/brands/repository-contributor.svg",
      brandAssetSource: "manual",
    };

    expect(hasDisplayableBrandIcon(manualIcon)).toBe(true);
    expect(displayableBrandIconUrl(manualIcon)).toBe(
      "/assets/brands/repository-contributor.svg",
    );
    expect(brandIdentityLabel(manualIcon)).toBe("Repository Contributor");
    expect(
      hasDisplayableBrandIcon({
        title: "Hidden Brand",
        brandDomain: "example.com",
        brandIconUrl: "/assets/brands/hidden.svg",
        brandAssetSource: "none",
      }),
    ).toBe(false);
    expect(
      hasDisplayableBrandIcon({
        title: "Local Brand",
        brandIconUrl: "/assets/brands/local.svg",
      }),
    ).toBe(true);
    expect(
      hasDisplayableBrandIcon({
        title: "Tracker Brand",
        brandIconUrl: "//tracker.example/pixel.png",
        brandAssetSource: "manual",
      }),
    ).toBe(false);
    expect(
      displayableBrandIconUrl({
        title: "Tracker Brand",
        brandIconUrl: "//tracker.example/pixel.png",
        brandAssetSource: "manual",
      }),
    ).toBeUndefined();
  });

  it("provides stable labels and suppresses generic auto-resolved identities", () => {
    expect(
      brandDisplayName({ name: "Tool card", brandDomain: "example.com" }),
    ).toBe("Tool card");
    expect(brandDisplayName({ brandDomain: "example.com" })).toBe(
      "example.com",
    );
    expect(brandDisplayName({})).toBe("Brand");
    expect(brandIdentityLabel(slackTarget)).toBe("Slack");
    expect(brandIdentityLabel(null)).toBe("");
    expect(
      brandIdentityLabel({
        brandName: "Example",
        brandDomain: "example.com",
        brandAssetSource: "website",
      }),
    ).toBe("Example");
    expect(
      brandIdentityLabel({
        title: "Community MCP Server",
        brandName: "Community MCP Server",
        brandDomain: "github.com",
        brandIconUrl: "/api/brand-assets/icon/github.com",
        brandAssetSource: "brandfetch",
      }),
    ).toBe("");
  });

  it("renders displayable icons and returns no markup for suppressed generic hosts", () => {
    expect(
      renderToStaticMarkup(
        React.createElement(EntryBrandMark, { entry: slackTarget }),
      ),
    ).toContain('src="/api/brand-assets/icon/slack.com"');
    expect(
      renderToStaticMarkup(
        React.createElement(EntryBrandMark, { entry: slackTarget }),
      ),
    ).toContain('alt="Slack logo"');
    expect(
      renderToStaticMarkup(
        React.createElement(EntryBrandMark, {
          entry: {
            title: "Community MCP Server",
            brandName: "Community MCP Server",
            brandDomain: "github.com",
            brandIconUrl: "/api/brand-assets/icon/github.com",
            brandAssetSource: "brandfetch",
          },
        }),
      ),
    ).toBe("");
  });
});
