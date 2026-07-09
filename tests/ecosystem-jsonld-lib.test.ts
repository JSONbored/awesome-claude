import { describe, expect, it } from "vitest";

import { ecosystemIntegrationsJsonLd } from "../apps/web/src/lib/ecosystem-jsonld-lib";

const abs = (path: string) => `https://heyclau.de${path}`;

describe("ecosystemIntegrationsJsonLd", () => {
  it("builds a named ItemList (empty when there are no integrations)", () => {
    const ld = ecosystemIntegrationsJsonLd([], abs);
    expect(ld["@type"]).toBe("ItemList");
    expect(ld.name).toBe("HeyClaude integrations");
    expect(ld.itemListElement).toEqual([]);
  });

  it("maps integrations to positioned ListItems with detail urls", () => {
    const ld = ecosystemIntegrationsJsonLd(
      [
        { name: "Cursor", slug: "cursor" },
        { name: "Zed", slug: "zed" },
      ],
      abs,
    );
    expect(ld.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Cursor",
        url: "https://heyclau.de/integrations/cursor",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Zed",
        url: "https://heyclau.de/integrations/zed",
      },
    ]);
  });
});
