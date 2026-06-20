import { describe, expect, it } from "vitest";

import { getCollectionItems, getSourceSignals } from "@/lib/detail-assembly";
import type { ContentEntry, DirectoryEntry } from "@heyclaude/registry";

function entry(overrides: Partial<ContentEntry>): ContentEntry {
  return {
    category: "agents",
    slug: "s",
    title: "t",
    description: "d",
    tags: [],
    keywords: [],
    body: "",
    sections: [],
    headings: [],
    codeBlocks: [],
    ...overrides,
  } as ContentEntry;
}

describe("getCollectionItems", () => {
  it("resolves collection member refs against the directory", () => {
    const target = {
      category: "agents",
      slug: "x",
      title: "X",
    } as DirectoryEntry;
    const items = getCollectionItems(
      entry({
        category: "collections",
        items: [{ category: "agents", slug: "x" }],
      }),
      [target],
    );
    expect(items).toHaveLength(1);
    expect(items[0].ref).toBe("agents/x");
    expect(items[0].target).toMatchObject({ slug: "x", title: "X" });
  });

  it("returns an empty list for non-collection entries", () => {
    expect(
      getCollectionItems(
        entry({ category: "agents", items: [{ category: "a", slug: "b" }] }),
        [],
      ),
    ).toEqual([]);
  });

  it("drops refs that do not resolve to a known entry", () => {
    expect(
      getCollectionItems(
        entry({
          category: "collections",
          items: [{ category: "agents", slug: "missing" }],
        }),
        [],
      ),
    ).toEqual([]);
  });
});

describe("getSourceSignals", () => {
  it("returns no signals for an entry without trust/provenance metadata", () => {
    expect(getSourceSignals(entry({ category: "agents" }))).toEqual([]);
  });

  it("labels first-party vs external package trust", () => {
    const firstParty = getSourceSignals(
      entry({ downloadTrust: "first-party" }),
    );
    expect(firstParty).toContainEqual({
      label: "Package trust",
      value: "Verified first-party package",
    });
    const external = getSourceSignals(entry({ downloadTrust: "external" }));
    expect(external[0].value).toContain("External package");
  });

  it("surfaces repository and documentation source links", () => {
    const signals = getSourceSignals(
      entry({
        repoUrl: "https://github.com/a/b",
        documentationUrl: "https://docs.example",
      }),
    );
    const labels = signals.map((signal) => signal.label);
    expect(labels).toContain("Repository");
    expect(labels).toContain("Documentation");
  });
});
