import { describe, expect, it } from "vitest";

import {
  browseCompareUrlSelectedCount,
  compareBrowseSharePath,
  compareBrowseShareUrl,
  compareBrowseShareUrlFromEntries,
} from "../apps/web/src/lib/compare-browse-share-link-lib";

describe("compare-browse-share-link-lib compareBrowseSharePath", () => {
  it("drops the compare param when no ids are selected", () => {
    expect(compareBrowseSharePath("")).toBe("/browse");
    expect(compareBrowseSharePath("   ")).toBe("/browse");
  });

  it("encodes the selected ids into the compare param", () => {
    expect(compareBrowseSharePath("mcp:a,mcp:b")).toBe(
      "/browse?compare=mcp%3Aa%2Cmcp%3Ab",
    );
  });
});

describe("compare-browse-share-link-lib compareBrowseShareUrl", () => {
  it("defaults to a relative url without an origin", () => {
    expect(compareBrowseShareUrl("mcp:a")).toBe("/browse?compare=mcp%3Aa");
  });

  it("prefixes the origin when one is supplied", () => {
    expect(compareBrowseShareUrl("mcp:a", "https://heyclau.de")).toBe(
      "https://heyclau.de/browse?compare=mcp%3Aa",
    );
  });
});

describe("compare-browse-share-link-lib compareBrowseShareUrlFromEntries", () => {
  it("serializes entries into the compare param", () => {
    expect(
      compareBrowseShareUrlFromEntries(
        [{ category: "mcp", slug: "a" }] as never,
        "https://heyclau.de",
      ),
    ).toBe("https://heyclau.de/browse?compare=mcp%2Fa");
  });

  it("omits the compare param for an empty selection", () => {
    expect(
      compareBrowseShareUrlFromEntries([] as never, "https://heyclau.de"),
    ).toBe("https://heyclau.de/browse");
  });
});

describe("compare-browse-share-link-lib browseCompareUrlSelectedCount", () => {
  it("treats missing params as an empty selection", () => {
    expect(browseCompareUrlSelectedCount(undefined)).toBe(0);
    expect(browseCompareUrlSelectedCount(null)).toBe(0);
  });
});
