import { afterEach, describe, expect, it, vi } from "vitest";

import {
  displayableBrandIconUrl,
  hasDisplayableBrandIcon,
} from "../apps/web/src/lib/brand-icons-lib";
import { selectDigestEntries } from "../apps/web/src/lib/newsletter-digest-lib";
import * as robotsPolicyLib from "../apps/web/src/lib/robots-policy-lib";

const NOW = Date.parse("2026-06-15T12:00:00.000Z");

describe("web policy lib patch coverage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("resolves brandfetch metadata from name when title and brandName are blank", () => {
    const target = {
      name: "Slack",
      brandDomain: "slack.com",
      brandIconUrl: "/api/brand-assets/icon/slack.com",
      brandAssetSource: "brandfetch",
      tags: ["slack"],
    };

    expect(hasDisplayableBrandIcon(target)).toBe(true);
    expect(displayableBrandIconUrl(target)).toBe(
      "/api/brand-assets/icon/slack.com",
    );
  });

  it("uses default digest minimum and skips entries without dateAdded", () => {
    const dated = Array.from({ length: 5 }, (_, index) => ({
      title: `Entry ${index}`,
      category: "mcp",
      slug: `slug-${index}`,
      dateAdded: "2026-06-14T00:00:00.000Z",
    }));

    expect(selectDigestEntries(dated, NOW)).not.toBeNull();
    expect(selectDigestEntries(dated.slice(0, 4), NOW)).toBeNull();

    const mixed = [
      { title: "Undated", category: "mcp", slug: "undated" },
      ...dated,
    ];
    const result = selectDigestEntries(mixed, NOW, { min: 1, max: 10 });
    expect(result?.map((item) => item.slug)).not.toContain("undated");
  });

  it("renders robots rules when disallow paths are omitted", () => {
    const rendered = robotsPolicyLib.renderRobotsTxt({
      rules: [{ userAgent: "*", allow: "/" }],
      contentSignal: "ai-train=yes, search=yes, ai-input=yes",
      sitemap: "https://heyclau.de/sitemap.xml",
      host: "heyclau.de",
    });

    expect(rendered).toContain("User-agent: *");
    expect(rendered).not.toContain("Disallow:");
  });
});
