import { describe, expect, it } from "vitest";

import { categoryItemListJsonLd } from "../apps/web/src/lib/category-itemlist-jsonld-lib";

const abs = (path: string) => `https://heyclau.de${path}`;

const makeEntries = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    title: `Entry ${i + 1}`,
    category: "agents",
    slug: `e${i + 1}`,
  }));

describe("categoryItemListJsonLd", () => {
  it("names the list for the category and includes the description", () => {
    const ld = categoryItemListJsonLd("agents", "All agents", [], abs);
    expect(ld["@type"]).toBe("ItemList");
    expect(ld.name).toBe("Claude agents");
    expect(ld.description).toBe("All agents");
    expect(ld.numberOfItems).toBe(0);
  });

  it("maps entries to positioned ListItems with entry urls", () => {
    const ld = categoryItemListJsonLd("agents", "d", makeEntries(2), abs);
    expect(ld.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Entry 1",
      url: "https://heyclau.de/entry/agents/e1",
    });
    expect(ld.itemListElement[1].position).toBe(2);
  });

  it("reports the full count but caps list items at 30", () => {
    const ld = categoryItemListJsonLd("agents", "d", makeEntries(31), abs);
    expect(ld.numberOfItems).toBe(31);
    expect(ld.itemListElement).toHaveLength(30);
  });
});
