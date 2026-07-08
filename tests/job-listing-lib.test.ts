import { describe, expect, it } from "vitest";

import { normalizeJobListing } from "../apps/web/src/lib/job-listing-lib";

describe("normalizeJobListing", () => {
  it("fills sensible defaults for an empty input", () => {
    const job = normalizeJobListing({});
    expect(job).toMatchObject({
      slug: "",
      title: "Untitled role",
      company: "Unknown company",
      location: "Remote",
      type: "Role",
      tier: "free",
      isRemote: false,
      isWorldwide: false,
      featured: false,
      sponsored: false,
      postedAt: new Date(0).toISOString(),
    });
    expect(job.applyUrl).toBeUndefined();
    expect(job.benefits).toBeUndefined();
  });

  it("falls back postedAt to lastVerifiedAt when postedAt is absent", () => {
    expect(
      normalizeJobListing({ lastVerifiedAt: "2026-05-01T00:00:00.000Z" })
        .postedAt,
    ).toBe("2026-05-01T00:00:00.000Z");
  });

  it("coerces optional string fields, dropping non-strings", () => {
    expect(
      normalizeJobListing({ companyUrl: "https://x.example" }).companyUrl,
    ).toBe("https://x.example");
    expect(
      normalizeJobListing({ companyUrl: 42 as unknown as string }).companyUrl,
    ).toBeUndefined();
  });

  it("maps array fields to string arrays and leaves non-arrays undefined", () => {
    expect(
      normalizeJobListing({ benefits: ["Remote", 3 as unknown as string] })
        .benefits,
    ).toEqual(["Remote", "3"]);
    expect(
      normalizeJobListing({ requirements: "nope" as unknown as string[] })
        .requirements,
    ).toBeUndefined();
  });

  it("preserves provided identity and flag fields", () => {
    const job = normalizeJobListing({
      slug: "staff-eng",
      title: "Staff Engineer",
      company: "Acme",
      isRemote: true,
      featured: true,
      tier: "featured",
    });
    expect(job).toMatchObject({
      slug: "staff-eng",
      title: "Staff Engineer",
      company: "Acme",
      isRemote: true,
      featured: true,
      tier: "featured",
    });
  });
});
