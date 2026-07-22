import { describe, expect, it } from "vitest";

import {
  LISTING_LEADS_MAX_OFFSET,
  clampListingLeadsOffset,
  leadsToCsv,
  normalizeKind,
} from "@/lib/listing-leads-csv-lib";

describe("normalizeKind", () => {
  it("accepts allow-listed kinds, case/space-insensitively", () => {
    expect(normalizeKind("job")).toBe("job");
    expect(normalizeKind("  Tool ")).toBe("tool");
    expect(normalizeKind("CLAIM")).toBe("claim");
  });

  it("returns '' for unknown or missing kinds", () => {
    expect(normalizeKind("sponsor")).toBe("");
    expect(normalizeKind(null)).toBe("");
  });
});

describe("clampListingLeadsOffset", () => {
  it("passes through an in-range offset (page 2 reaches lead #101)", () => {
    // With the newest 100 leads on page 1 (LIMIT 100 OFFSET 0), offset=100 is
    // what makes lead #101 reachable — the whole point of the pagination fix.
    expect(clampListingLeadsOffset(100)).toBe(100);
    expect(clampListingLeadsOffset(0)).toBe(0);
    expect(clampListingLeadsOffset(LISTING_LEADS_MAX_OFFSET)).toBe(
      LISTING_LEADS_MAX_OFFSET,
    );
  });

  it("floors negatives to 0 and truncates fractionals", () => {
    expect(clampListingLeadsOffset(-1)).toBe(0);
    expect(clampListingLeadsOffset(-1000)).toBe(0);
    expect(clampListingLeadsOffset(100.9)).toBe(100);
  });

  it("caps above the max and coerces non-finite input to 0", () => {
    expect(clampListingLeadsOffset(LISTING_LEADS_MAX_OFFSET + 1)).toBe(
      LISTING_LEADS_MAX_OFFSET,
    );
    expect(clampListingLeadsOffset(Number.NaN)).toBe(0);
    // Non-finite input (±Infinity) is garbage, not "the last page" — floor to 0.
    expect(clampListingLeadsOffset(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe("leadsToCsv", () => {
  it("emits the header row followed by column-ordered values", () => {
    const csv = leadsToCsv([
      { id: "1", kind: "job", contact_email: "a@b.com", message: "hi" },
    ]);
    const [header, row] = csv.split("\n");
    expect(header.split(",")[0]).toBe("id");
    expect(header).toContain("contact_email");
    const cols = row.split(",");
    expect(cols[0]).toBe("1");
    expect(cols[1]).toBe("job");
  });

  it("escapes values containing commas and quotes", () => {
    const csv = leadsToCsv([{ message: 'a,b "c"' }]);
    const row = csv.split("\n")[1];
    expect(row).toContain('"a,b ""c"""');
  });

  it("renders only the header for no rows", () => {
    const csv = leadsToCsv([]);
    expect(csv.split("\n")).toHaveLength(1);
    expect(csv.startsWith("id,kind,status")).toBe(true);
  });
});
