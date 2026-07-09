import { describe, expect, it } from "vitest";

import {
  DEFAULT_ITEM_LIST_CAP,
  entryItemListJsonLd,
} from "../apps/web/src/lib/entry-itemlist-jsonld-lib";

const abs = (path: string) => `https://heyclau.de${path}`;

const makeEntries = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    title: `Entry ${i + 1}`,
    category: "agents",
    slug: `e${i + 1}`,
  }));

describe("entryItemListJsonLd", () => {
  it("builds a named ItemList with the given description", () => {
    const ld = entryItemListJsonLd("My List", "Desc", [], abs);
    expect(ld["@type"]).toBe("ItemList");
    expect(ld.name).toBe("My List");
    expect(ld.description).toBe("Desc");
    expect(ld.numberOfItems).toBe(0);
    expect(ld.itemListElement).toEqual([]);
  });

  it("maps entries to 1-based positioned ListItems with entry urls", () => {
    const ld = entryItemListJsonLd("L", "d", makeEntries(2), abs);
    expect(ld.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Entry 1",
        url: "https://heyclau.de/entry/agents/e1",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Entry 2",
        url: "https://heyclau.de/entry/agents/e2",
      },
    ]);
  });

  it("reports the full count but caps list items at the default cap", () => {
    const ld = entryItemListJsonLd(
      "L",
      "d",
      makeEntries(DEFAULT_ITEM_LIST_CAP + 1),
      abs,
    );
    expect(ld.numberOfItems).toBe(DEFAULT_ITEM_LIST_CAP + 1);
    expect(ld.itemListElement).toHaveLength(DEFAULT_ITEM_LIST_CAP);
  });

  it("honors an explicit cap (Infinity emits every entry)", () => {
    expect(
      entryItemListJsonLd("L", "d", makeEntries(5), abs, 2).itemListElement,
    ).toHaveLength(2);
    expect(
      entryItemListJsonLd("L", "d", makeEntries(35), abs, Infinity)
        .itemListElement,
    ).toHaveLength(35);
  });
});
