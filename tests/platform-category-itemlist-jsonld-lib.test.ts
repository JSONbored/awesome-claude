import { describe, expect, it } from "vitest";

import { platformCategoryItemListJsonLd } from "../apps/web/src/lib/platform-category-itemlist-jsonld-lib";

const abs = (path: string) => `https://heyclau.de${path}`;

const makeEntries = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    title: `Entry ${i + 1}`,
    category: "mcp",
    slug: `e${i + 1}`,
  }));

describe("platformCategoryItemListJsonLd", () => {
  it("names the list from both labels and includes the description", () => {
    const ld = platformCategoryItemListJsonLd(
      "Cursor",
      "MCP servers",
      "d",
      [],
      abs,
    );
    expect(ld["@type"]).toBe("ItemList");
    expect(ld.name).toBe("Claude MCP servers for Cursor");
    expect(ld.description).toBe("d");
    expect(ld.numberOfItems).toBe(0);
  });

  it("maps entries to positioned ListItems with entry urls", () => {
    const ld = platformCategoryItemListJsonLd(
      "Cursor",
      "MCP",
      "d",
      makeEntries(2),
      abs,
    );
    expect(ld.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Entry 1",
      url: "https://heyclau.de/entry/mcp/e1",
    });
    expect(ld.itemListElement[1].position).toBe(2);
  });

  it("reports the full count but caps list items at 30", () => {
    const ld = platformCategoryItemListJsonLd(
      "Cursor",
      "MCP",
      "d",
      makeEntries(31),
      abs,
    );
    expect(ld.numberOfItems).toBe(31);
    expect(ld.itemListElement).toHaveLength(30);
  });
});
