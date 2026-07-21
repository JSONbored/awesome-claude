import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ogImageMetaTags } from "../apps/web/src/lib/og-meta-lib";
import { ogImageUrl } from "../apps/web/src/lib/og-image";

describe("jobs detail OG meta", () => {
  it("wires job detail head through ogImageUrl + ogImageMetaTags like sibling detail routes", () => {
    const source = readFileSync(
      new URL("../apps/web/src/routes/jobs.$slug.tsx", import.meta.url),
      "utf8",
    );

    expect(source).toContain('from "@/lib/og-image"');
    expect(source).toContain('from "@/lib/og-meta-lib"');
    expect(source).toContain(
      'ogImageUrl({ title, eyebrow: "Job", description })',
    );
    expect(source).toContain('...ogImageMetaTags(ogImage, "article")');
    expect(source).not.toContain('{ property: "og:type", content: "article" }');
  });

  it("emits the shared article card shape used by sibling detail routes", () => {
    const ogImage = ogImageUrl({
      title: "Staff Engineer at Acme",
      eyebrow: "Job",
      description: "Build Claude workflows.",
    });
    const tags = ogImageMetaTags(ogImage, "article");

    expect(tags).toEqual(
      expect.arrayContaining([
        { property: "og:image", content: ogImage },
        { property: "og:image:type", content: "image/png" },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: ogImage },
      ]),
    );
    expect(ogImage).toContain("/og?");
    expect(ogImage).toContain("title=");
    expect(ogImage).toContain("eyebrow=");
  });
});
