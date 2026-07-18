import { describe, expect, it } from "vitest";
import {
  ENTRY_DETAIL_COLLECTION_ITEMS_SURFACE,
  entryDetailCollectionEntryAnalyticsData,
  entryDetailCollectionEntryAnalyticsEvent,
  entryDetailCollectionEntryDestination,
} from "@/lib/entry-detail-collection-cta-events-lib";

describe("entry detail collection cta events lib", () => {
  it("builds privacy-light collection item egress analytics", () => {
    expect(entryDetailCollectionEntryAnalyticsEvent()).toBe(
      "detail_collection_entry_click",
    );
    expect(
      entryDetailCollectionEntryAnalyticsData(
        "collections",
        "starter-pack",
        "mcp/browser",
        1,
        5,
      ),
    ).toEqual({
      entry: "collections/starter-pack",
      surface: ENTRY_DETAIL_COLLECTION_ITEMS_SURFACE,
      peer: "mcp/browser",
      itemIndex: 1,
      itemCount: 5,
    });
  });

  it("maps collection entry destinations", () => {
    expect(entryDetailCollectionEntryDestination("mcp", "browser")).toEqual({
      to: "/entry/$category/$slug",
      params: { category: "mcp", slug: "browser" },
    });
    expect(entryDetailCollectionEntryDestination("", "browser")).toBeNull();
    expect(entryDetailCollectionEntryDestination("mcp", "")).toBeNull();
    expect(entryDetailCollectionEntryDestination("  ", "browser")).toBeNull();
    expect(entryDetailCollectionEntryDestination("mcp", "  ")).toBeNull();
  });
});
