import { describe, expect, it } from "vitest";

import { comparisonItemListJsonLd } from "../apps/web/src/lib/comparison-itemlist-jsonld-lib";

const abs = (path: string) => `https://heyclau.de${path}`;
const comparison = { heading: "A vs B", seoDescription: "Compare A and B" };

describe("comparisonItemListJsonLd", () => {
  it("builds an ItemList with heading/description/count", () => {
    const ld = comparisonItemListJsonLd(comparison, [], abs);
    expect(ld["@type"]).toBe("ItemList");
    expect(ld.name).toBe("A vs B");
    expect(ld.description).toBe("Compare A and B");
    expect(ld.numberOfItems).toBe(0);
    expect(ld.itemListElement).toEqual([]);
  });

  it("maps entries to positioned ListItems with entry urls", () => {
    const ld = comparisonItemListJsonLd(
      comparison,
      [
        { title: "Agent A", category: "agents", slug: "a" },
        { title: "Agent B", category: "agents", slug: "b" },
      ],
      abs,
    );
    expect(ld.numberOfItems).toBe(2);
    expect(ld.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Agent A",
        url: "https://heyclau.de/entry/agents/a",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Agent B",
        url: "https://heyclau.de/entry/agents/b",
      },
    ]);
  });
});
