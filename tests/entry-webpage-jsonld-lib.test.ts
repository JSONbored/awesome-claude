import { describe, expect, it } from "vitest";

import type { Entry } from "../apps/web/src/types/registry";
import {
  entryWebPageDateModified,
  entryWebPageJsonLd,
} from "../apps/web/src/lib/entry-webpage-jsonld-lib";

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

describe("entryWebPageDateModified (#5675)", () => {
  it("prefers contentUpdatedAt over repoUpdatedAt/verifiedAt/reviewedAt", () => {
    expect(
      entryWebPageDateModified(
        entry({
          reviewedAt: "2026-02-02",
          verifiedAt: "2026-02-10",
          repoUpdatedAt: "2026-03-15T12:00:00.000Z",
          contentUpdatedAt: "2026-04-01T00:00:00.000Z",
        }),
      ),
    ).toBe("2026-04-01T00:00:00.000Z");
  });

  it("prefers repoUpdatedAt over verifiedAt/reviewedAt when contentUpdatedAt is absent", () => {
    expect(
      entryWebPageDateModified(
        entry({
          reviewedAt: "2026-02-02",
          verifiedAt: "2026-02-10",
          repoUpdatedAt: "2026-03-15T12:00:00.000Z",
        }),
      ),
    ).toBe("2026-03-15T12:00:00.000Z");
  });

  it("prefers verifiedAt over reviewedAt when content/repo signals are absent", () => {
    expect(
      entryWebPageDateModified(
        entry({
          reviewedAt: "2026-02-02",
          verifiedAt: "2026-02-10T08:00:00.000Z",
        }),
      ),
    ).toBe("2026-02-10T08:00:00.000Z");
  });

  it("ignores invalid freshness strings and keeps the reviewedAt/dateAdded fallback", () => {
    expect(
      entryWebPageDateModified(
        entry({
          reviewedAt: "2026-02-02",
          repoUpdatedAt: "not-a-date",
        }),
      ),
    ).toBe("2026-02-02");
    expect(
      entryWebPageDateModified(
        entry({
          contentUpdatedAt: "also-invalid",
        }),
      ),
    ).toBe("2026-01-01");
  });

  it("treats empty/null freshness fields as absent", () => {
    expect(
      entryWebPageDateModified(
        entry({
          reviewedAt: "2026-02-02",
          contentUpdatedAt: null,
          repoUpdatedAt: "",
          verifiedAt: null,
        }),
      ),
    ).toBe("2026-02-02");
  });
});
