import { describe, expect, it } from "vitest";

import {
  parseJobsFeed,
  buildJobSummary,
} from "../integrations/raycast/src/jobs-feed.js";

const fullJob = {
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
  it("normalizes the envelope and drops invalid entries", () => {
    const feed = JSON.stringify({
      generatedAt: "2026-06-20",
      count: 2,
      entries: [fullJob, { slug: "incomplete" }],
    });
    const parsed = parseJobsFeed(feed);
    // The incomplete entry fails normalization and is filtered out.
    expect(parsed.entries).toHaveLength(1);
    expect(parsed.entries[0].slug).toBe("s");
    expect(parsed.generatedAt).toBe("2026-06-20");
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
    expect(buildJobSummary(fullJob as never)).toBe(
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
    const minimal = { ...fullJob, compensation: "", equity: "", type: "" };
    expect(buildJobSummary(minimal as never)).toBe(
      [
        "Acme — Engineer",
        "Remote",
        "Build things",
        "Apply: https://a.example",
      ].join("\n"),
    );
  });
});
