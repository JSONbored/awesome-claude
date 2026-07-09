import { describe, expect, it } from "vitest";

import { breadcrumbListJsonLd } from "../apps/web/src/lib/breadcrumb-jsonld-lib";

describe("breadcrumbListJsonLd", () => {
  it("builds a BreadcrumbList with 1-based positions in order", () => {
    const ld = breadcrumbListJsonLd([
      { name: "Contributors", item: "https://heyclau.de/contributors" },
      { name: "Ada", item: "https://heyclau.de/contributors/ada" },
    ]);
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Contributors",
        item: "https://heyclau.de/contributors",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Ada",
        item: "https://heyclau.de/contributors/ada",
      },
    ]);
  });

  it("returns an empty itemListElement for no crumbs", () => {
    expect(breadcrumbListJsonLd([]).itemListElement).toEqual([]);
  });
});
