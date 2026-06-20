import { describe, expect, it } from "vitest";

import {
  parseJobsFeed,
  buildJobSummary,
  type RaycastJob,
} from "../integrations/raycast/src/jobs-feed.js";

const fullJob: RaycastJob = {
  slug: "s",
  title: "Engineer",
  company: "Acme",
  location: "Remote",
  description: "Build things",
  applyUrl: "https://a.example",
  webUrl: "https://w.example",
  sourceLabel: "src",
  applySourceLabel: "asrc",
  benefits: [],
  responsibilities: [],
  requirements: [],
  featured: false,
  compensation: "$150k",
  equity: "0.5%",
  type: "Full-time",
};

describe("parseJobsFeed", () => {
  it("normalizes the envelope, drops invalid entries, and preserves the declared count", () => {
    const feed = JSON.stringify({
      generatedAt: "2026-06-20",
      count: 2,
      entries: [fullJob, { slug: "incomplete" }],
    });
    const parsed = parseJobsFeed(feed);
    // The incomplete entry fails normalization and is filtered out...
    expect(parsed.entries).toHaveLength(1);
    expect(parsed.entries[0].slug).toBe("s");
    expect(parsed.generatedAt).toBe("2026-06-20");
    // ...but `count` reflects the feed's declared value, not the filtered length.
    expect(parsed.count).toBe(2);
  });

  it("falls back to the entry length when count is missing or non-numeric", () => {
    expect(parseJobsFeed(JSON.stringify({ entries: [fullJob] })).count).toBe(1);
    expect(
      parseJobsFeed(JSON.stringify({ count: "five", entries: [fullJob] }))
        .count,
    ).toBe(1);
  });

  it("returns an empty result when the entries field is absent", () => {
    expect(parseJobsFeed(JSON.stringify({ foo: 1 }))).toEqual({
      entries: [],
      generatedAt: "",
      count: 0,
    });
  });
});

describe("buildJobSummary", () => {
  it("includes optional compensation/equity/type lines when present", () => {
    expect(buildJobSummary(fullJob)).toBe(
      [
        "Acme — Engineer",
        "Remote",
        "Full-time",
        "Compensation: $150k",
        "Equity: 0.5%",
        "Build things",
        "Apply: https://a.example",
      ].join("\n"),
    );
  });

  it("omits empty optional lines", () => {
    const minimal: RaycastJob = {
      ...fullJob,
      compensation: "",
      equity: "",
      type: "",
    };
    expect(buildJobSummary(minimal)).toBe(
      [
        "Acme — Engineer",
        "Remote",
        "Build things",
        "Apply: https://a.example",
      ].join("\n"),
    );
  });
});
