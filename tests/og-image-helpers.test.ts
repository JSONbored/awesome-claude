import { describe, expect, it } from "vitest";

import { esc, ogImageUrl } from "@/lib/og-image";
import { siteConfig } from "@/lib/site";

describe("esc", () => {
  it("escapes the XML/HTML metacharacters used in SVG text", () => {
    // OG cards embed user text in SVG, so &, <, > must be entity-escaped.
    expect(esc("a & b < c > d")).toBe("a &amp; b &lt; c &gt; d");
  });

  it("leaves text without metacharacters unchanged", () => {
    expect(esc("plain text")).toBe("plain text");
  });
});

describe("ogImageUrl", () => {
  it("builds an absolute /og URL with the title param", () => {
    expect(ogImageUrl({ title: "My Title" })).toBe(
      `${siteConfig.url}/og?title=My+Title`,
    );
  });

  it("includes optional eyebrow/description/accent params when provided", () => {
    const url = new URL(
      ogImageUrl({
        title: "T",
        eyebrow: "E",
        description: "D",
        accent: "blue",
      }),
    );
    expect(url.searchParams.get("eyebrow")).toBe("E");
    expect(url.searchParams.get("description")).toBe("D");
    expect(url.searchParams.get("accent")).toBe("blue");
  });

  it("url-encodes special characters in the params", () => {
    const url = new URL(ogImageUrl({ title: "A & B" }));
    // The decoded value round-trips, confirming proper encoding.
    expect(url.searchParams.get("title")).toBe("A & B");
  });
});
