import { describe, expect, it } from "vitest";

import type { Entry } from "../apps/web/src/types/registry";
import { entryWebPageJsonLd } from "../apps/web/src/lib/entry-webpage-jsonld-lib";

const entry = (over: Record<string, unknown> = {}): Entry =>
  ({
    title: "My Agent",
    description: "Does things",
    category: "agents",
    author: "Ada",
    dateAdded: "2026-01-01",
    ...over,
  }) as Entry;

const URL = "https://heyclau.de/entry/agents/my-agent";

describe("entryWebPageJsonLd", () => {
  it("maps the core WebPage fields", () => {
    const ld = entryWebPageJsonLd(entry(), URL) as Record<string, unknown>;
    expect(ld["@type"]).toBe("WebPage");
    expect(ld.name).toBe("My Agent");
    expect(ld.url).toBe(URL);
    expect(ld.about).toBe("agents");
    expect(ld.author).toEqual({ "@type": "Person", name: "Ada" });
  });

  it("falls back dateModified to dateAdded, or uses reviewedAt when present", () => {
    expect(entryWebPageJsonLd(entry(), URL).dateModified).toBe("2026-01-01");
    expect(
      entryWebPageJsonLd(entry({ reviewedAt: "2026-02-02" }), URL).dateModified,
    ).toBe("2026-02-02");
  });

  it("includes isBasedOn only when sourceUrl is present", () => {
    expect("isBasedOn" in entryWebPageJsonLd(entry(), URL)).toBe(false);
    expect(
      entryWebPageJsonLd(entry({ sourceUrl: "https://github.com/o/r" }), URL),
    ).toMatchObject({ isBasedOn: "https://github.com/o/r" });
  });
});
