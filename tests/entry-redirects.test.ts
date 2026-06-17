import { describe, expect, it } from "vitest";

import { ENTRY_REDIRECTS, getEntryRedirectTarget } from "@/lib/entry-redirects";

describe("entry consolidation redirects", () => {
  it("resolves a removed entry to its surviving canonical target", () => {
    expect(
      getEntryRedirectTarget("skills", "mintlify-documentation-automation"),
    ).toEqual({
      category: "commands",
      slug: "mintlify-docs",
    });
  });

  it("returns null for entries that are not consolidated", () => {
    expect(getEntryRedirectTarget("commands", "mintlify-docs")).toBeNull();
    expect(getEntryRedirectTarget("skills", "some-live-skill")).toBeNull();
  });

  it("never points a redirect back at itself (no redirect loops)", () => {
    for (const [from, to] of Object.entries(ENTRY_REDIRECTS)) {
      expect(from).not.toBe(`${to.category}/${to.slug}`);
      // The target must not itself be a redirect source (single-hop only).
      expect(ENTRY_REDIRECTS[`${to.category}/${to.slug}`]).toBeUndefined();
    }
  });
});
