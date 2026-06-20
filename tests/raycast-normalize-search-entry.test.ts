import { describe, expect, it } from "vitest";

// Deep-relative test imports use the `.js` specifier across this repo's suite;
// the bundler maps it to the TypeScript source.
import { normalizeRegistrySearchEntry } from "../integrations/raycast/src/feed.js";

const rawResult = {
  category: "agents",
  slug: "a",
  title: "T",
  description: "D",
  webUrl: "https://w.example",
  tags: [" x ", "x", "y"],
  installable: true,
};

describe("normalizeRegistrySearchEntry", () => {
  it("normalizes a complete search result, trimming/de-duping tags", () => {
    const entry = normalizeRegistrySearchEntry(rawResult);
    expect(entry).not.toBeNull();
    expect(entry!.slug).toBe("a");
    expect(entry!.tags).toEqual(["x", "y"]);
    expect(entry!.installable).toBe(true);
  });

  it("derives the web url from canonicalUrl/url/webUrl in priority order", () => {
    // The search payload may name the link differently; canonicalUrl wins.
    const entry = normalizeRegistrySearchEntry({
      ...rawResult,
      webUrl: "",
      canonicalUrl: "https://canonical.example",
    });
    expect(entry!.webUrl).toBe("https://canonical.example");
  });

  it("returns null when no usable web url is present", () => {
    // category/slug/title/description plus a resolvable web url are all required.
    expect(
      normalizeRegistrySearchEntry({ ...rawResult, webUrl: "" }),
    ).toBeNull();
  });

  it("returns null for non-record inputs", () => {
    expect(normalizeRegistrySearchEntry("not-an-object")).toBeNull();
    expect(normalizeRegistrySearchEntry(42)).toBeNull();
  });
});
