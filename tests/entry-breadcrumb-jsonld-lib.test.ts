import { describe, expect, it } from "vitest";

import type { Entry } from "../apps/web/src/types/registry";
import { entryBreadcrumbJsonLd } from "../apps/web/src/lib/entry-breadcrumb-jsonld-lib";

const abs = (path: string) => `https://heyclau.de${path}`;
const entry = (over: Record<string, unknown> = {}): Entry =>
  ({ title: "My Agent", category: "agents", ...over }) as Entry;

const URL = "https://heyclau.de/entry/agents/my-agent";

describe("entryBreadcrumbJsonLd", () => {
  it("builds a three-item Directory > category > entry trail", () => {
    const ld = entryBreadcrumbJsonLd(entry(), URL, abs);
    expect(ld["@type"]).toBe("BreadcrumbList");
    const items = ld.itemListElement;
    expect(items.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(items.map((i) => i.name)).toEqual([
      "Directory",
      "agents",
      "My Agent",
    ]);
  });

  it("resolves list item urls via the injected absoluteUrl (entry uses the given url)", () => {
    const ld = entryBreadcrumbJsonLd(entry(), URL, abs);
    expect(ld.itemListElement[0].item).toBe("https://heyclau.de/browse");
    expect(ld.itemListElement[1].item).toBe("https://heyclau.de/agents");
    expect(ld.itemListElement[2].item).toBe(URL);
  });
});
