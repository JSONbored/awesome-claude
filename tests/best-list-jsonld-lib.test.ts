import { describe, expect, it } from "vitest";

import { bestListItemListJsonLd } from "../apps/web/src/lib/best-list-jsonld-lib";

const abs = (path: string) => `https://heyclau.de${path}`;

const list = {
  title: "Best Agents",
  subtitle: "Our top picks",
  picks: [{ ref: "agents/a" }, { ref: "agents/b" }],
};

describe("bestListItemListJsonLd", () => {
  it("builds an ItemList with name/description/count", () => {
    const ld = bestListItemListJsonLd(list, abs, () => "");
    expect(ld["@type"]).toBe("ItemList");
    expect(ld.name).toBe("Best Agents");
    expect(ld.description).toBe("Our top picks");
    expect(ld.numberOfItems).toBe(2);
  });

  it("maps picks to positioned ListItems with resolved titles and entry urls", () => {
    const titles: Record<string, string> = { "agents/a": "Agent A" };
    const ld = bestListItemListJsonLd(list, abs, (ref) => titles[ref] ?? ref);
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
        name: "agents/b",
        url: "https://heyclau.de/entry/agents/b",
      },
    ]);
  });

  it("handles an empty pick list", () => {
    const ld = bestListItemListJsonLd({ ...list, picks: [] }, abs, () => "");
    expect(ld.numberOfItems).toBe(0);
    expect(ld.itemListElement).toEqual([]);
  });
});
