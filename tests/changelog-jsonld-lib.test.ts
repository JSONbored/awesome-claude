import { describe, expect, it } from "vitest";

import { changelogItemListJsonLd } from "../apps/web/src/lib/changelog-jsonld-lib";

const note = (stream: string, over: Record<string, unknown> = {}) => ({
  title: `${stream} note`,
  date: "2026-01-01",
  body: "details",
  stream,
  ...over,
});

describe("changelogItemListJsonLd", () => {
  it("builds an ItemList named for the changelog", () => {
    const ld = changelogItemListJsonLd([]);
    expect(ld["@type"]).toBe("ItemList");
    expect(ld.name).toBe("HeyClaude registry changelog");
    expect(ld.itemListElement).toEqual([]);
  });

  it("maps notes to positioned NewsArticles", () => {
    const ld = changelogItemListJsonLd([note("release"), note("policy")]);
    expect(ld.itemListElement.map((i) => i.position)).toEqual([1, 2]);
    expect(ld.itemListElement[0].item).toMatchObject({
      "@type": "NewsArticle",
      headline: "release note",
      datePublished: "2026-01-01",
      description: "details",
    });
  });

  it("labels articleSection from the stream", () => {
    const sections = changelogItemListJsonLd([
      note("release"),
      note("policy"),
      note("security"),
    ]).itemListElement.map((i) => i.item.articleSection);
    expect(sections).toEqual(["Releases", "Policy", "Security"]);
  });
});
