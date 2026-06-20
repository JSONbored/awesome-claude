import { describe, expect, it } from "vitest";

import {
  filterJobs,
  sortedJobFilterOptions,
} from "../integrations/raycast/src/jobs-feed.js";

const makeJob = (slug: string, extra: Record<string, unknown> = {}) =>
  ({
    slug,
    title: "t",
    company: "c",
    location: "l",
    description: "d",
    applyUrl: "https://a.example",
    webUrl: "https://w.example",
    sourceLabel: "s",
    applySourceLabel: "as",
    benefits: [],
    responsibilities: [],
    requirements: [],
    featured: false,
    ...extra,
  }) as never;

const jobs = [
  makeJob("a", { featured: true }),
  makeJob("b", { sponsored: true }),
  makeJob("c", { isRemote: true }),
  makeJob("d", { compensation: "$100k" }),
  makeJob("e", { source: "curated" }),
  makeJob("f", { claimedEmployer: true }),
  makeJob("g"),
];

const slugs = (filter: string, favorites = new Set<string>()) =>
  filterJobs(jobs, filter, favorites).map((job) => job.slug);

describe("filterJobs", () => {
  it("returns every job for 'all' and for an unknown filter", () => {
    const everything = ["a", "b", "c", "d", "e", "f", "g"];
    expect(slugs("all")).toEqual(everything);
    // The default branch is permissive rather than empty.
    expect(slugs("nonsense")).toEqual(everything);
  });

  it("treats 'featured' as featured OR sponsored, but 'sponsored' as sponsored only", () => {
    expect(slugs("featured")).toEqual(["a", "b"]);
    expect(slugs("sponsored")).toEqual(["b"]);
  });

  it("filters remote, compensation, curated, and claimed by their flags", () => {
    expect(slugs("remote")).toEqual(["c"]);
    expect(slugs("compensation")).toEqual(["d"]);
    expect(slugs("curated")).toEqual(["e"]);
    expect(slugs("claimed")).toEqual(["f"]);
  });

  it("filters favorites by the provided key set", () => {
    expect(slugs("favorites", new Set(["b", "d"]))).toEqual(["b", "d"]);
  });
});

describe("sortedJobFilterOptions", () => {
  it("exposes the fixed option list with 'all' first", () => {
    const options = sortedJobFilterOptions();
    expect(options[0]).toEqual({ value: "all", title: "All Jobs" });
    expect(options.map((option) => option.value)).toContain("favorites");
    expect(options.length).toBeGreaterThanOrEqual(8);
  });
});
