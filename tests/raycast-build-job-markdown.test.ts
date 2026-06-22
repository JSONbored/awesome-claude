import { describe, expect, it } from "vitest";

import {
  buildJobMarkdown,
  type RaycastJob,
} from "../integrations/raycast/src/jobs-feed.js";

const baseJob: RaycastJob = {
  slug: "s",
  title: "Engineer",
  company: "Acme",
  location: "L",
  description: "Desc here",
  applyUrl: "https://a.example",
  webUrl: "https://w.example",
  sourceLabel: "s",
  applySourceLabel: "as",
  benefits: ["B1"],
  responsibilities: ["R1", "R2"],
  requirements: [],
  featured: false,
  curationNote: "Noted",
};

describe("buildJobMarkdown", () => {
  it("renders the heading, description, and populated sections as bullet lists", () => {
    const md = buildJobMarkdown(baseJob);
    expect(md.startsWith("# Acme — Engineer")).toBe(true);
    expect(md).toContain("Desc here");
    expect(md).toContain("## Responsibilities");
    expect(md).toContain("- R1");
    expect(md).toContain("- R2");
    expect(md).toContain("## Benefits");
    expect(md).toContain("- B1");
    expect(md).toContain("## Curation Note");
    expect(md).toContain("Noted");
  });

  it("omits sections whose source list/value is empty", () => {
    // requirements is an empty array, so its section is dropped entirely.
    expect(buildJobMarkdown(baseJob)).not.toContain("## Requirements");
  });

  it("omits the curation note section when it is absent", () => {
    const withoutNote: RaycastJob = { ...baseJob, curationNote: "" };
    expect(buildJobMarkdown(withoutNote)).not.toContain("## Curation Note");
  });
});
