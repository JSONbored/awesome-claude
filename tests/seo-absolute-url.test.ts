import { describe, expect, it } from "vitest";

import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

describe("absoluteUrl", () => {
  it("resolves an already-absolute path against the configured site origin", () => {
    expect(absoluteUrl("/browse")).toBe(`${siteConfig.url}/browse`);
    expect(absoluteUrl("/entry/agents/example")).toBe(
      `${siteConfig.url}/entry/agents/example`,
    );
  });

  it("adds a leading slash to relative paths", () => {
    expect(absoluteUrl("browse")).toBe(`${siteConfig.url}/browse`);
  });

  it("treats empty input and the bare root as the site root", () => {
    expect(absoluteUrl("")).toBe(`${siteConfig.url}/`);
    expect(absoluteUrl("/")).toBe(`${siteConfig.url}/`);
  });

  it("preserves trailing slashes, query strings, and fragments", () => {
    expect(absoluteUrl("/a/b/")).toBe(`${siteConfig.url}/a/b/`);
    expect(absoluteUrl("/search?q=1#top")).toBe(
      `${siteConfig.url}/search?q=1#top`,
    );
  });

  it("always returns an absolute URL on the configured origin", () => {
    const origin = new URL(siteConfig.url).origin;
    for (const path of ["/", "/x", "deep/relative", "/og/agents/slug"]) {
      expect(new URL(absoluteUrl(path)).origin).toBe(origin);
    }
  });
});
